import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { appAlerts, contentVersions, mediaAssets, syncManifest } from "@/db/schema";

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

export async function getContentSummary() {
  const [versions, feeds, assets] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(contentVersions),
    db.select({ count: sql<number>`count(*)` }).from(syncManifest),
    db.select({ count: sql<number>`count(*)` }).from(mediaAssets),
  ]);

  return {
    versions: Number(versions[0]?.count ?? 0),
    syncFeeds: Number(feeds[0]?.count ?? 0),
    mediaAssets: Number(assets[0]?.count ?? 0),
  };
}

export async function registerContentManifest(manifest: RemoteManifest) {
  await db.insert(contentVersions).values({
    id: manifest.id,
    contentType: manifest.module,
    version: manifest.version,
    sourceName: manifest.sourceName ?? null,
    sourceUrl: manifest.sourceUrl ?? null,
    checksum: manifest.checksum ?? null,
    status: "active",
    notes: manifest.notes ?? null,
  }).onConflictDoUpdate({
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
    await db.insert(mediaAssets).values({
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
    }).onConflictDoUpdate({
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
    await db.insert(appAlerts).values({
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
    }).onConflictDoUpdate({
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
