export type Disease = "dengue" | "typhoid" | "malaria" | "cholera";

interface CaseLog {
  disease: Disease;
  ts: string;
  synced: boolean;
}

function getLogs(): CaseLog[] {
  try {
    const raw = localStorage.getItem("case_logs");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: CaseLog[]) {
  localStorage.setItem("case_logs", JSON.stringify(logs));
}

export function logCase(disease: Disease) {
  const logs = getLogs();
  logs.push({ disease, ts: new Date().toISOString(), synced: false });
  saveLogs(logs);
}

export function getCaseCounts(): Record<Disease, number> {
  return getLogs().reduce((acc, l) => {
    acc[l.disease] = (acc[l.disease] ?? 0) + 1;
    return acc;
  }, {} as Record<Disease, number>);
}

export function getTotalCases(): number {
  return getLogs().length;
}
