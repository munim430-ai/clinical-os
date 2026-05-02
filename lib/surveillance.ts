import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { caseLogs } from "@/db/schema";

export type Disease = "dengue" | "typhoid" | "malaria" | "cholera";

export type CaseCounts = Record<Disease, number>;

export async function logCase(disease: Disease, district?: string) {
  await db.insert(caseLogs).values({
    diseaseType: disease,
    district: district?.trim() || null,
    synced: false,
  });
}

export async function getCaseCounts(): Promise<CaseCounts> {
  const rows = await db
    .select({ diseaseType: caseLogs.diseaseType, count: sql<number>`count(*)` })
    .from(caseLogs)
    .groupBy(caseLogs.diseaseType);

  return rows.reduce((acc, row) => {
    const disease = row.diseaseType as Disease;
    acc[disease] = Number(row.count) || 0;
    return acc;
  }, {} as CaseCounts);
}

export async function getTotalCases(): Promise<number> {
  const rows = await db.select({ count: sql<number>`count(*)` }).from(caseLogs);
  return Number(rows[0]?.count ?? 0);
}

export async function getUnsyncedCaseLogs() {
  return db.select().from(caseLogs).where(eq(caseLogs.synced, false));
}

export async function markCaseLogsSynced(ids: number[]) {
  if (ids.length === 0) return;
  for (const id of ids) {
    await db.update(caseLogs).set({ synced: true }).where(eq(caseLogs.id, id));
  }
}
