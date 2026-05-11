import { getItem, setItem } from "@/lib/storage";

const KEY = "rx_draft";

export type RxDrug = {
  id: number;
  brandName: string;
  genericName: string | null;
  strength: string | null;
  dosageForm: string | null;
  dose: string;
  frequency: string;
  duration: string;
};

export type RxDraft = {
  patientName: string;
  patientAge: string;
  patientSex: string;
  diagnosis: string;
  drugs: RxDrug[];
};

const EMPTY: RxDraft = {
  patientName: "",
  patientAge: "",
  patientSex: "",
  diagnosis: "",
  drugs: [],
};

export function getDraft(): RxDraft {
  return getItem<RxDraft>(KEY) ?? { ...EMPTY };
}

function save(draft: RxDraft) {
  setItem(KEY, draft);
}

export function addDrugToDraft(
  drug: Omit<RxDrug, "dose" | "frequency" | "duration">,
): void {
  const draft = getDraft();
  if (draft.drugs.some((d) => d.id === drug.id)) return;
  draft.drugs = [
    ...draft.drugs,
    { ...drug, dose: "", frequency: "1-0-1", duration: "5 days" },
  ];
  save(draft);
}

export function removeDrugFromDraft(id: number): void {
  const draft = getDraft();
  draft.drugs = draft.drugs.filter((d) => d.id !== id);
  save(draft);
}

export function updateDrugInDraft(
  id: number,
  patch: Partial<Pick<RxDrug, "dose" | "frequency" | "duration">>,
): void {
  const draft = getDraft();
  draft.drugs = draft.drugs.map((d) => (d.id === id ? { ...d, ...patch } : d));
  save(draft);
}

export function updatePatientInfo(
  patch: Partial<
    Pick<RxDraft, "patientName" | "patientAge" | "patientSex" | "diagnosis">
  >,
): void {
  const draft = getDraft();
  save({ ...draft, ...patch });
}

export function clearDraft(): void {
  save({ ...EMPTY });
}

export function getDrugCount(): number {
  return getDraft().drugs.length;
}
