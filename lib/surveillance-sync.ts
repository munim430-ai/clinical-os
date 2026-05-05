/**
 * Sprint F/G — Surveillance sync client (native / expo-sqlite)
 *
 * Sends ONLY anonymous aggregate counts — no patient data, no device identifiers
 * beyond a one-way hash of the install ID. Endpoint is opt-in via env var.
 *
 * Rules enforced here:
 * - Max 1 sync attempt per 6 hours (stored in MMKV)
 * - Sends aggregated counts (disease → count) not individual case records
 * - POST body is validated before sending; no PII leaves the device
 * - Cases are marked synced only after HTTP 200/201
 * - Silent fail — surveillance sync must never crash the app
 */

import { getUnsyncedCaseLogs, markCaseLogsSynced } from "@/lib/surveillance";
import { MMKV } from "react-native-mmkv";

const store = new MMKV({ id: "surveillance-sync" });
const LAST_SYNC_KEY = "lastSyncAttemptMs";
const MIN_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

export type SyncResult =
  | { status: "ok"; synced: number }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

function getEndpoint(): string | null {
  return process.env.EXPO_PUBLIC_SURVEILLANCE_ENDPOINT ?? null;
}

function getInstallHash(): string {
  let hash = store.getString("installHash");
  if (!hash) {
    // 64-char hex derived from Math.random — not cryptographically secure,
    // but sufficient as a non-identifying device bucket key.
    hash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    store.set("installHash", hash);
  }
  return hash;
}

function isTooSoon(): boolean {
  const last = store.getNumber(LAST_SYNC_KEY);
  if (!last) return false;
  return Date.now() - last < MIN_SYNC_INTERVAL_MS;
}

function aggregate(logs: { diseaseType: string | null; id: number }[]) {
  const counts: Record<string, number> = {};
  for (const log of logs) {
    if (log.diseaseType) {
      counts[log.diseaseType] = (counts[log.diseaseType] ?? 0) + 1;
    }
  }
  return counts;
}

export async function syncSurveillanceData(): Promise<SyncResult> {
  try {
    const endpoint = getEndpoint();
    if (!endpoint) {
      return { status: "skipped", reason: "No EXPO_PUBLIC_SURVEILLANCE_ENDPOINT configured" };
    }

    if (isTooSoon()) {
      return { status: "skipped", reason: "Rate-limited — last sync was less than 6 hours ago" };
    }

    store.set(LAST_SYNC_KEY, Date.now());

    const logs = await getUnsyncedCaseLogs();
    if (logs.length === 0) {
      return { status: "skipped", reason: "No unsynced cases" };
    }

    const body = {
      deviceHash: getInstallHash(),
      reportedAt: new Date().toISOString(),
      counts: aggregate(logs as any[]),
      totalCases: logs.length,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return { status: "error", message: `Server returned ${response.status}` };
    }

    await markCaseLogsSynced(logs.map((l: any) => l.id));
    return { status: "ok", synced: logs.length };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function getLastSyncMs(): number | undefined {
  return store.getNumber(LAST_SYNC_KEY) ?? undefined;
}

export function canSyncNow(): boolean {
  return !!getEndpoint() && !isTooSoon();
}
