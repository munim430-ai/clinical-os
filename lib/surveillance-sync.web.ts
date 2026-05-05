/**
 * Sprint F/G — Surveillance sync client (web / localStorage)
 * Mirror of surveillance-sync.ts adapted for the web build.
 */

import type { Disease } from "@/lib/surveillance.web";

export type SyncResult =
  | { status: "ok"; synced: number }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

const LAST_SYNC_KEY = "surv_lastSyncMs";
const INSTALL_HASH_KEY = "surv_installHash";
const MIN_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

function getEndpoint(): string | null {
  return process.env.EXPO_PUBLIC_SURVEILLANCE_ENDPOINT ?? null;
}

function getInstallHash(): string {
  let hash = localStorage.getItem(INSTALL_HASH_KEY);
  if (!hash) {
    hash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    localStorage.setItem(INSTALL_HASH_KEY, hash);
  }
  return hash;
}

function isTooSoon(): boolean {
  const last = localStorage.getItem(LAST_SYNC_KEY);
  if (!last) return false;
  return Date.now() - Number(last) < MIN_SYNC_INTERVAL_MS;
}

interface WebCaseLog {
  disease: Disease;
  ts: string;
  synced: boolean;
}

function getLogs(): WebCaseLog[] {
  try {
    const raw = localStorage.getItem("case_logs");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: WebCaseLog[]) {
  localStorage.setItem("case_logs", JSON.stringify(logs));
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

    localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));

    const logs = getLogs().filter((l) => !l.synced);
    if (logs.length === 0) {
      return { status: "skipped", reason: "No unsynced cases" };
    }

    const counts: Record<string, number> = {};
    for (const log of logs) {
      counts[log.disease] = (counts[log.disease] ?? 0) + 1;
    }

    const body = {
      deviceHash: getInstallHash(),
      reportedAt: new Date().toISOString(),
      counts,
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

    saveLogs(getLogs().map((l) => ({ ...l, synced: true })));
    return { status: "ok", synced: logs.length };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function getLastSyncMs(): number | undefined {
  const v = localStorage.getItem(LAST_SYNC_KEY);
  return v ? Number(v) : undefined;
}

export function canSyncNow(): boolean {
  return !!getEndpoint() && !isTooSoon();
}
