import type { useDatabase } from "@/db/provider";
import { dataVersions } from "@/db/schema";
import { BACKUPS_DIR, ensureDirectories } from "@/lib/storage-native";
import { desc, eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

type DB = NonNullable<ReturnType<typeof useDatabase>["db"]>;

export type VersionType = "auto" | "manual" | "pre-migration";

const SNAPSHOT_TABLES = [
  "patients",
  "prescriptions",
  "clinics",
  "visit_logs",
  "appointments",
  "doctor_profile",
  "vitals_log",
  "chief_complaints",
  "diagnosis_quick_picks",
  "advice_quick_picks",
] as const;

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number")
    return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function assertNative() {
  if (Platform.OS === "web") {
    throw new Error("Backup & restore is only available on the native app.");
  }
}

export async function createSnapshot(
  db: DB,
  type: VersionType = "manual",
  notes?: string,
): Promise<string> {
  assertNative();

  const snapshot: Record<string, unknown[]> = {};
  for (const table of SNAPSHOT_TABLES) {
    const rows = await db.all(`SELECT * FROM ${table}`);
    snapshot[table] = rows;
  }

  const json = JSON.stringify({
    version: "1.0",
    exportedAt: new Date().toISOString(),
    data: snapshot,
  });
  const checksum = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    json,
  );

  await ensureDirectories();
  const fileName = `snapshot_${Date.now()}.json`;
  const filePath = `${BACKUPS_DIR}${fileName}`;
  await FileSystem.writeAsStringAsync(filePath, json);

  const versionLabel = `${new Date().toISOString().slice(0, 10)}-v${Date.now()
    .toString()
    .slice(-4)}`;
  const totalRecords = Object.values(snapshot).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  await db.insert(dataVersions).values({
    version: versionLabel,
    type,
    entity: "full_db",
    recordCount: totalRecords,
    fileSizeBytes: json.length,
    filePath: fileName,
    checksum,
    notes: notes ?? (type === "auto" ? "Automatic snapshot" : "Manual backup"),
  });

  return versionLabel;
}

export async function restoreSnapshot(db: DB, filePath: string): Promise<void> {
  assertNative();

  const fullPath = filePath.startsWith(BACKUPS_DIR)
    ? filePath
    : `${BACKUPS_DIR}${filePath}`;
  const json = await FileSystem.readAsStringAsync(fullPath);
  const snapshot = JSON.parse(json) as {
    data: Record<string, Record<string, unknown>[]>;
  };

  await createSnapshot(db, "pre-migration", "Auto-snapshot before restore");

  for (const [tableName, rows] of Object.entries(snapshot.data)) {
    if (!(SNAPSHOT_TABLES as readonly string[]).includes(tableName)) continue;
    await db.run(`DELETE FROM ${tableName}`);
    for (const row of rows) {
      const cols = Object.keys(row);
      if (cols.length === 0) continue;
      const values = cols.map((c) => sqlLiteral(row[c])).join(", ");
      await db.run(
        `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES (${values})`,
      );
    }
  }
}

export async function listSnapshots(db: DB) {
  return await db
    .select()
    .from(dataVersions)
    .orderBy(desc(dataVersions.createdAt))
    .all();
}

export async function deleteSnapshot(db: DB, id: number, filePath: string) {
  const fullPath = `${BACKUPS_DIR}${filePath}`;
  await FileSystem.deleteAsync(fullPath, { idempotent: true });
  await db.delete(dataVersions).where(eq(dataVersions.id, id));
}

export async function exportSnapshot(filePath: string): Promise<void> {
  assertNative();
  const fullPath = `${BACKUPS_DIR}${filePath}`;
  await Sharing.shareAsync(fullPath, {
    mimeType: "application/json",
    dialogTitle: "Export Clinical OS Backup",
  });
}
