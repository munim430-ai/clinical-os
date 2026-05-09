import { db } from "@/db/drizzle";
import {
  appAlerts,
  contentVersions,
  mediaAssets,
  syncManifest,
} from "@/db/schema";
import { sql } from "drizzle-orm";

export type ContentModule = "gp" | "dims" | "er" | "media" | "alerts";

export type RemoteManifest = {
  id: string;
  module: ContentModule;
  version: string;
  checksum?: string;
  sourceName?: string;
  sourceUrl?: string;
  notes?: string;
  assets?: Array<{
    id: string;
    module: "gp" | "dims" | "er";
    entityType: string;
    entityId: string;
    title?: string;
    remoteUrl?: string;
    mimeType?: string;
    checksum?: string;
    sizeBytes?: number;
  }>;
  alerts?: Array<{
    id: string;
    title: string;
    body: string;
    module?: string;
    severity?: "info" | "warning" | "critical";
    startsAt?: string;
    endsAt?: string;
    sourceName?: string;
    sourceUrl?: string;
  }>;
};

type ContentDb = Pick<typeof db, "select" | "insert" | "update">;

export async function getContentSummary(dbInstance: ContentDb = db) {
  try {
    const [versions, feeds, assets] = await Promise.all([
      dbInstance.select({ count: sql<number>`count(*)` }).from(contentVersions),
      dbInstance.select({ count: sql<number>`count(*)` }).from(syncManifest),
      dbInstance.select({ count: sql<number>`count(*)` }).from(mediaAssets),
    ]);

    return {
      versions: Number(versions[0]?.count ?? 0),
      syncFeeds: Number(feeds[0]?.count ?? 0),
      mediaAssets: Number(assets[0]?.count ?? 0),
    };
  } catch {
    return {
      versions: 0,
      syncFeeds: 0,
      mediaAssets: 0,
    };
  }
}

export async function registerContentManifest(manifest: RemoteManifest) {
  await db
    .insert(contentVersions)
    .values({
      id: manifest.id,
      contentType: manifest.module,
      version: manifest.version,
      sourceName: manifest.sourceName ?? null,
      sourceUrl: manifest.sourceUrl ?? null,
      checksum: manifest.checksum ?? null,
      status: "active",
      notes: manifest.notes ?? null,
    })
    .onConflictDoUpdate({
      target: contentVersions.id,
      set: {
        version: manifest.version,
        sourceName: manifest.sourceName ?? null,
        sourceUrl: manifest.sourceUrl ?? null,
        checksum: manifest.checksum ?? null,
        status: "active",
        notes: manifest.notes ?? null,
      },
    });

  for (const asset of manifest.assets ?? []) {
    await db
      .insert(mediaAssets)
      .values({
        id: asset.id,
        module: asset.module,
        entityType: asset.entityType,
        entityId: asset.entityId,
        title: asset.title ?? null,
        remoteUrl: asset.remoteUrl ?? null,
        mimeType: asset.mimeType ?? null,
        checksum: asset.checksum ?? null,
        sizeBytes: asset.sizeBytes ?? null,
        offlineAvailable: false,
      })
      .onConflictDoUpdate({
        target: mediaAssets.id,
        set: {
          title: asset.title ?? null,
          remoteUrl: asset.remoteUrl ?? null,
          mimeType: asset.mimeType ?? null,
          checksum: asset.checksum ?? null,
          sizeBytes: asset.sizeBytes ?? null,
        },
      });
  }

  for (const alert of manifest.alerts ?? []) {
    await db
      .insert(appAlerts)
      .values({
        id: alert.id,
        title: alert.title,
        body: alert.body,
        module: alert.module ?? manifest.module,
        severity: alert.severity ?? "info",
        startsAt: alert.startsAt ?? null,
        endsAt: alert.endsAt ?? null,
        sourceName: alert.sourceName ?? manifest.sourceName ?? null,
        sourceUrl: alert.sourceUrl ?? manifest.sourceUrl ?? null,
        dismissed: false,
      })
      .onConflictDoUpdate({
        target: appAlerts.id,
        set: {
          title: alert.title,
          body: alert.body,
          module: alert.module ?? manifest.module,
          severity: alert.severity ?? "info",
          startsAt: alert.startsAt ?? null,
          endsAt: alert.endsAt ?? null,
          sourceName: alert.sourceName ?? manifest.sourceName ?? null,
          sourceUrl: alert.sourceUrl ?? manifest.sourceUrl ?? null,
        },
      });
  }
}

export async function listEnabledSyncFeeds() {
  return db.select().from(syncManifest);
}

// ─── Pull mechanism (Sprint E) ───────────────────────────────────────────────

export type PullResult =
  | { status: "ok"; updated: number; alerts: number; skipped: number }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

const FETCH_TIMEOUT_MS = 15_000;

/**
 * Pull all enabled remote feeds defined in sync_manifest.
 * For each feed:
 *   1. GET the remote_url
 *   2. Validate it's a RemoteManifest shape
 *   3. Compare remote version vs local_version — skip if equal
 *   4. registerContentManifest() to upsert the version + assets + alerts
 *   5. Update sync_manifest.last_checked_at / last_synced_at / local_version
 *
 * Network failures and bad payloads are caught per-feed; one bad feed
 * doesn't block the others.
 */
export async function pullSyncFeeds(
  dbInstance: ContentDb = db,
): Promise<PullResult> {
  try {
    const feeds = await dbInstance.select().from(syncManifest);
    const enabled = feeds.filter((f) => f.enabled);

    if (enabled.length === 0) {
      return { status: "skipped", reason: "No enabled sync feeds" };
    }

    let updated = 0;
    let alertCount = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const feed of enabled) {
      try {
        await dbInstance
          .update(syncManifest)
          .set({ lastCheckedAt: now })
          .where(sql`${syncManifest.id} = ${feed.id}`);

        const res = await fetch(feed.remoteUrl, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!res.ok) {
          skipped++;
          continue;
        }

        const manifest = (await res.json()) as RemoteManifest;
        if (!manifest?.id || !manifest?.version) {
          skipped++;
          continue;
        }

        // Skip if version matches what we already have
        if (feed.localVersion && feed.localVersion === manifest.version) {
          skipped++;
          continue;
        }

        await registerContentManifest(manifest);

        await dbInstance
          .update(syncManifest)
          .set({
            localVersion: manifest.version,
            remoteVersion: manifest.version,
            checksum: manifest.checksum ?? null,
            lastSyncedAt: now,
          })
          .where(sql`${syncManifest.id} = ${feed.id}`);

        updated++;
        alertCount += manifest.alerts?.length ?? 0;
      } catch {
        skipped++;
      }
    }

    return { status: "ok", updated, alerts: alertCount, skipped };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function getActiveAlerts(dbInstance: ContentDb = db) {
  const now = new Date().toISOString();
  const rows = await dbInstance.select().from(appAlerts);
  return rows.filter((a) => {
    if (a.dismissed) return false;
    if (a.startsAt && a.startsAt > now) return false;
    if (a.endsAt && a.endsAt < now) return false;
    return true;
  });
}

export async function dismissAlert(id: string, dbInstance: ContentDb = db) {
  await dbInstance
    .update(appAlerts)
    .set({ dismissed: true })
    .where(sql`${appAlerts.id} = ${id}`);
}
