import { createId } from "@paralleldrive/cuid2";
import { create } from "zustand";

export type RxMedicine = {
  tempId: string;
  brandName: string;
  genericName: string | null;
  strength: string | null;
  dosageForm: string | null;
  medicineId: number | null;
  doseMorning: number;
  doseAfternoon: number;
  doseNight: number;
  timing: string;
  duration: string;
  quantity: number | null;
  instructions: string;
};

export type RxPatient = {
  id: number | null;
  name: string;
  age: string;
  gender: string;
  phone: string;
  bp: string;
  pulse: string;
  temperature: string;
  weight: string;
  allergies: string;
};

const EMPTY_PATIENT: RxPatient = {
  id: null,
  name: "",
  age: "",
  gender: "",
  phone: "",
  bp: "",
  pulse: "",
  temperature: "",
  weight: "",
  allergies: "",
};

export type RxDiagnosis = { label: string; icd10: string };

type RxState = {
  patient: RxPatient;
  clinicId: number | null;
  complaints: string[];
  examinations: string;
  investigations: string;
  diagnoses: RxDiagnosis[];
  medicines: RxMedicine[];
  advice: string[];
  followUpDate: string;
  visitFee: number;
  setPatient: (patch: Partial<RxPatient>) => void;
  selectPatient: (p: Partial<RxPatient> & { id: number }) => void;
  toggleComplaint: (text: string) => void;
  setExaminations: (text: string) => void;
  setInvestigations: (text: string) => void;
  toggleDiagnosis: (label: string, icd10: string) => void;
  addMedicine: (med: Omit<RxMedicine, "tempId">) => void;
  updateMedicine: (tempId: string, patch: Partial<RxMedicine>) => void;
  removeMedicine: (tempId: string) => void;
  toggleAdvice: (text: string) => void;
  setFollowUp: (date: string) => void;
  setClinic: (id: number | null, fee: number) => void;
  reset: () => void;
};

export const useRxStore = create<RxState>((set) => ({
  patient: { ...EMPTY_PATIENT },
  clinicId: null,
  complaints: [],
  examinations: "",
  investigations: "",
  diagnoses: [],
  medicines: [],
  advice: [],
  followUpDate: "",
  visitFee: 0,

  setPatient: (patch) => set((s) => ({ patient: { ...s.patient, ...patch } })),

  selectPatient: (p) =>
    set(() => ({
      patient: {
        ...EMPTY_PATIENT,
        ...p,
        allergies: p.allergies ?? "",
      },
    })),

  toggleComplaint: (text) =>
    set((s) => ({
      complaints: s.complaints.includes(text)
        ? s.complaints.filter((c) => c !== text)
        : [...s.complaints, text],
    })),

  setExaminations: (text) => set({ examinations: text }),
  setInvestigations: (text) => set({ investigations: text }),

  toggleDiagnosis: (label, icd10) =>
    set((s) => ({
      diagnoses: s.diagnoses.some((d) => d.label === label)
        ? s.diagnoses.filter((d) => d.label !== label)
        : [...s.diagnoses, { label, icd10 }],
    })),

  addMedicine: (med) =>
    set((s) => ({
      medicines: [...s.medicines, { ...med, tempId: createId() }],
    })),

  updateMedicine: (tempId, patch) =>
    set((s) => ({
      medicines: s.medicines.map((m) =>
        m.tempId === tempId ? { ...m, ...patch } : m,
      ),
    })),

  removeMedicine: (tempId) =>
    set((s) => ({ medicines: s.medicines.filter((m) => m.tempId !== tempId) })),

  toggleAdvice: (text) =>
    set((s) => ({
      advice: s.advice.includes(text)
        ? s.advice.filter((a) => a !== text)
        : [...s.advice, text],
    })),

  setFollowUp: (date) => set({ followUpDate: date }),
  setClinic: (id, fee) => set({ clinicId: id, visitFee: fee }),

  reset: () =>
    set({
      patient: { ...EMPTY_PATIENT },
      clinicId: null,
      complaints: [],
      examinations: "",
      investigations: "",
      diagnoses: [],
      medicines: [],
      advice: [],
      followUpDate: "",
      visitFee: 0,
    }),
}));
