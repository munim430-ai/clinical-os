/**
 * Sprint G — Surveillance receiver reference implementation
 *
 * Deploy this as an API route (Next.js, Express, Hono, etc.).
 * It handles: input validation, per-device rate limiting,
 * audit logging, and duplicate-safe aggregation.
 *
 * This file is intentionally NOT imported by the app — it is a
 * standalone server-side reference that can be deployed separately.
 * No credentials are stored here; configure DATABASE_URL via env.
 *
 * Expected POST body from the app client:
 * {
 *   deviceHash: string,       // 64-char hex, one-way, non-reversible
 *   reportedAt: string,       // ISO-8601 timestamp
 *   counts: Record<string, number>,  // { dengue: 3, typhoid: 1 }
 *   totalCases: number
 * }
 */

import type { IncomingMessage, ServerResponse } from "node:http";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SyncPayload {
  deviceHash: string;
  reportedAt: string;
  counts: Record<string, number>;
  totalCases: number;
}

const KNOWN_DISEASES = new Set(["dengue", "typhoid", "malaria", "cholera"]);
const MAX_CASES_PER_REPORT = 10_000;
const RATE_LIMIT_WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

// In-memory rate limit store (replace with Redis in production)
const rateLimitStore = new Map<string, number>();

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(body: unknown): body is SyncPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  if (typeof b.deviceHash !== "string" || !/^[0-9a-f]{64}$/.test(b.deviceHash)) return false;
  if (typeof b.reportedAt !== "string" || Number.isNaN(Date.parse(b.reportedAt))) return false;
  if (typeof b.totalCases !== "number" || b.totalCases < 0 || b.totalCases > MAX_CASES_PER_REPORT) return false;
  if (!b.counts || typeof b.counts !== "object") return false;

  for (const [disease, count] of Object.entries(b.counts as Record<string, unknown>)) {
    if (!KNOWN_DISEASES.has(disease)) return false;
    if (typeof count !== "number" || count < 0 || count > MAX_CASES_PER_REPORT) return false;
  }

  return true;
}

// ─── Rate limiter ─────────────────────────────────────────────────────────────

function isRateLimited(deviceHash: string): boolean {
  const last = rateLimitStore.get(deviceHash);
  if (!last) return false;
  return Date.now() - last < RATE_LIMIT_WINDOW_MS;
}

function recordAttempt(deviceHash: string) {
  rateLimitStore.set(deviceHash, Date.now());
}

// ─── Audit logger ────────────────────────────────────────────────────────────

function auditLog(event: string, deviceHash: string, extra?: Record<string, unknown>) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    event,
    deviceHashPrefix: deviceHash.slice(0, 8), // only prefix for logs — not full hash
    ...extra,
  }));
}

// ─── Aggregate storage (stub — replace with real DB) ─────────────────────────

interface AggregateRow {
  disease: string;
  date: string;
  deviceHash: string;
  count: number;
}

// In production: replace with DB UPSERT
// e.g. PostgreSQL: INSERT INTO aggregate_counts (disease, date, device_hash, count)
//      VALUES ($1, $2, $3, $4)
//      ON CONFLICT (disease, date, device_hash) DO UPDATE SET count = EXCLUDED.count
const aggregateStore = new Map<string, AggregateRow>();

function upsertAggregate(payload: SyncPayload) {
  const date = payload.reportedAt.split("T")[0]; // YYYY-MM-DD only
  for (const [disease, count] of Object.entries(payload.counts)) {
    const key = `${disease}::${date}::${payload.deviceHash}`;
    // DUPLICATE-SAFE: overwrite with latest count for same device+date+disease
    aggregateStore.set(key, { disease, date, deviceHash: payload.deviceHash, count });
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function handleSurveillanceSync(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    return res.end("Method Not Allowed");
  }

  // Parse body
  let body: unknown;
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    auditLog("parse_error", "unknown");
    res.writeHead(400);
    return res.end("Bad Request");
  }

  // Validate
  if (!validate(body)) {
    auditLog("validation_failed", (body as any)?.deviceHash ?? "unknown");
    res.writeHead(422);
    return res.end("Unprocessable Entity");
  }

  // Rate limit
  if (isRateLimited(body.deviceHash)) {
    auditLog("rate_limited", body.deviceHash);
    res.writeHead(429, { "Retry-After": "21600" });
    return res.end("Too Many Requests");
  }

  recordAttempt(body.deviceHash);
  auditLog("sync_received", body.deviceHash, {
    diseases: Object.keys(body.counts),
    totalCases: body.totalCases,
  });

  // Duplicate-safe aggregate upsert
  upsertAggregate(body);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}
