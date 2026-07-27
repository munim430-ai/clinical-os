export function formatSig(m: number, a: number, n: number): string {
  return `${m}+${a}+${n}`;
}

export function calculateQuantity(
  morning: number,
  afternoon: number,
  night: number,
  duration: string,
): number | null {
  const perDay = morning + afternoon + night;
  if (perDay === 0) return null;
  const d = duration.toLowerCase();
  const dayMatch = d.match(/(\d+)\s*days?/);
  const weekMatch = d.match(/(\d+)\s*weeks?/);
  const monthMatch = d.match(/(\d+)\s*months?/);
  if (dayMatch) return perDay * Number.parseInt(dayMatch[1], 10);
  if (weekMatch) return perDay * 7 * Number.parseInt(weekMatch[1], 10);
  if (monthMatch) return perDay * 30 * Number.parseInt(monthMatch[1], 10);
  return null;
}

export type DefaultDosing = {
  morning: number;
  afternoon: number;
  night: number;
  timing: string;
  duration: string;
};

const DEFAULT_DOSING: Record<string, DefaultDosing> = {
  paracetamol: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "5 days",
  },
  omeprazole: {
    morning: 1,
    afternoon: 0,
    night: 0,
    timing: "empty stomach",
    duration: "14 days",
  },
  azithromycin: {
    morning: 1,
    afternoon: 0,
    night: 0,
    timing: "after meal",
    duration: "3 days",
  },
  metformin: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "continue",
  },
  amlodipine: {
    morning: 1,
    afternoon: 0,
    night: 0,
    timing: "after meal",
    duration: "1 month",
  },
  atorvastatin: {
    morning: 0,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "1 month",
  },
  cetirizine: {
    morning: 0,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "7 days",
  },
  fexofenadine: {
    morning: 1,
    afternoon: 0,
    night: 0,
    timing: "empty stomach",
    duration: "7 days",
  },
  ranitidine: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "before meal",
    duration: "14 days",
  },
  ciprofloxacin: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "7 days",
  },
  risperidone: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "continue",
  },
  salbutamol: {
    morning: 1,
    afternoon: 0,
    night: 1,
    timing: "after meal",
    duration: "7 days",
  },
};

export function getDefaultDosing(genericName: string): DefaultDosing {
  return (
    DEFAULT_DOSING[genericName.toLowerCase()] ?? {
      morning: 1,
      afternoon: 0,
      night: 1,
      timing: "after meal",
      duration: "5 days",
    }
  );
}

export const TIMING_OPTIONS = [
  "Before meal",
  "After meal",
  "Empty stomach",
] as const;

export const DURATION_OPTIONS = [
  "3 days",
  "5 days",
  "7 days",
  "14 days",
  "1 month",
  "Continue",
] as const;
