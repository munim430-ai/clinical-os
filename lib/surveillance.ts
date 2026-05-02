import { MMKV } from "react-native-mmkv";

const store = new MMKV({ id: "clinical-os" });

export type Disease = "dengue" | "typhoid" | "malaria" | "cholera";

interface CaseLog {
  disease: Disease;
  ts: string;
  synced: boolean;
}

export function logCase(disease: Disease) {
  const raw = store.getString("case_logs");
  const logs: CaseLog[] = raw ? JSON.parse(raw) : [];
  logs.push({ disease, ts: new Date().toISOString(), synced: false });
  store.set("case_logs", JSON.stringify(logs));
}

export function getCaseCounts(): Record<Disease, number> {
  const raw = store.getString("case_logs");
  const logs: CaseLog[] = raw ? JSON.parse(raw) : [];
  return logs.reduce((acc, l) => {
    acc[l.disease] = (acc[l.disease] ?? 0) + 1;
    return acc;
  }, {} as Record<Disease, number>);
}

export function getTotalCases(): number {
  const raw = store.getString("case_logs");
  return raw ? JSON.parse(raw).length : 0;
}
