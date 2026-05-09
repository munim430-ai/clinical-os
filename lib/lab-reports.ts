import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "clinical-os-lab-reports" });
const HISTORY_KEY = "reviewed-lab-reports";

export type LabInterpretationStatus =
  | "critical-low"
  | "low"
  | "normal"
  | "high"
  | "critical-high"
  | "unknown";

export type ReviewedLabValue = {
  referenceId: number;
  name: string;
  unit?: string | null;
  value: number;
  normalMin?: number | null;
  normalMax?: number | null;
  criticalLow?: number | null;
  criticalHigh?: number | null;
  notes?: string | null;
  status: LabInterpretationStatus;
};

export type ReviewedLabReport = {
  id: string;
  createdAt: string;
  reviewerPersona: string;
  sourceMode: "manual" | "camera" | "upload" | "ocr-ready";
  sourceUri?: string | null;
  values: ReviewedLabValue[];
};

export type OcrAdapter = {
  name: string;
  mode: "manual";
  extractValues: () => Promise<ReviewedLabValue[]>;
};

export const manualOcrAdapter: OcrAdapter = {
  name: "Manual review",
  mode: "manual",
  async extractValues() {
    return [];
  },
};

export function interpretLabValue(input: {
  value: number;
  normalMin?: number | null;
  normalMax?: number | null;
  criticalLow?: number | null;
  criticalHigh?: number | null;
}): LabInterpretationStatus {
  if (!Number.isFinite(input.value)) return "unknown";
  if (input.criticalLow != null && input.value < input.criticalLow) {
    return "critical-low";
  }
  if (input.criticalHigh != null && input.value > input.criticalHigh) {
    return "critical-high";
  }
  if (input.normalMin != null && input.value < input.normalMin) return "low";
  if (input.normalMax != null && input.value > input.normalMax) return "high";
  if (input.normalMin != null || input.normalMax != null) return "normal";
  return "unknown";
}

export function getReviewedLabReports(): ReviewedLabReport[] {
  const raw = storage.getString(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReviewedLabReport(report: ReviewedLabReport) {
  const next = [
    report,
    ...getReviewedLabReports().filter((item) => item.id !== report.id),
  ].slice(0, 12);
  storage.set(HISTORY_KEY, JSON.stringify(next));
}

export function createReviewedLabReportId() {
  return `lab-${Date.now().toString(36)}`;
}
