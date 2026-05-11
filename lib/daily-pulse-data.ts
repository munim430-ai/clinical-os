// Clinical pearls and sponsor data for DailyPulse component

export interface Pearl {
  id: number;
  text: string;
  source: string;
  category: string;
}

export interface Sponsor {
  id: number;
  brand: string;
  drug: string;
  company: string;
  tagline: string;
  indication: string;
  dosing: string;
  color: string;
}

export const PEARLS: Pearl[] = [
  {
    id: 1,
    text: "Avoid NSAIDs in dengue fever — use paracetamol only for analgesia and fever control.",
    source: "WHO Dengue Guidelines 2012",
    category: "Infectious Disease"
  },
  {
    id: 2,
    text: "In type 2 DM, target HbA1c ≤7% for most adults; relax to ≤8% for elderly or those with hypoglycaemia risk.",
    source: "ADA Standards of Care 2024",
    category: "Endocrinology"
  },
  {
    id: 3,
    text: "Omeprazole should be taken 30–60 minutes before meals for maximum efficacy — timing matters.",
    source: "NICE CG17 Dyspepsia Guidelines",
    category: "Gastroenterology"
  },
  {
    id: 4,
    text: "eGFR <30 requires dose adjustment or avoidance of metformin, NSAIDs, and many antibiotics.",
    source: "KDIGO CKD Guidelines 2022",
    category: "Nephrology"
  },
  {
    id: 5,
    text: "Salbutamol MDI + spacer is as effective as nebulisation in mild-moderate acute asthma — and faster to set up.",
    source: "GINA Report 2023",
    category: "Respiratory"
  },
  {
    id: 6,
    text: "Oral rehydration solution remains the cornerstone of diarrhoea management in children; IV fluids only when unable to tolerate oral.",
    source: "WHO ORS Guidelines",
    category: "Paediatrics"
  },
  {
    id: 7,
    text: "Folic acid 400 mcg/day should start at least one month before conception and continue through the first trimester.",
    source: "RCOG Green-top Guideline No. 31",
    category: "Obstetrics"
  },
  {
    id: 8,
    text: "Iron deficiency anaemia: check ferritin first — serum iron alone is unreliable and affected by inflammation.",
    source: "WHO Haemoglobin Thresholds 2011",
    category: "Haematology"
  },
  {
    id: 9,
    text: "Regular paracetamol (not PRN) provides better analgesia in chronic pain — consistent plasma levels reduce breakthrough pain.",
    source: "WHO Analgesic Ladder",
    category: "Palliative Care"
  },
  {
    id: 10,
    text: "Blood pressure measurement: patient should be seated quietly for 5 minutes, arm at heart level, cuff covering 80% of arm circumference.",
    source: "ESC/ESH Hypertension Guidelines 2023",
    category: "Cardiology"
  },
  {
    id: 11,
    text: "Metronidazole + tetracycline combination is preferred for Helicobacter pylori in high clarithromycin-resistance regions like Bangladesh.",
    source: "ACG Clinical Guideline H. pylori 2022",
    category: "Gastroenterology"
  },
  {
    id: 12,
    text: "Skin-to-skin contact within 1 hour of birth significantly improves breastfeeding initiation and neonatal thermoregulation.",
    source: "WHO Recommendations: Intrapartum Care 2018",
    category: "Obstetrics"
  },
  {
    id: 13,
    text: "In CKD, calcium-based phosphate binders should be avoided when serum calcium is >2.54 mmol/L.",
    source: "KDIGO CKD-MBD Guidelines 2017",
    category: "Nephrology"
  },
  {
    id: 14,
    text: "Oral prednisolone 40–50 mg/day for 5 days is the standard for acute COPD exacerbation — longer courses add no benefit.",
    source: "GOLD COPD Report 2024",
    category: "Respiratory"
  },
  {
    id: 15,
    text: "Loperamide is contraindicated in bloody diarrhoea and suspected invasive enteritis — it can worsen outcomes in shigellosis.",
    source: "WHO Diarrhoeal Disease Management",
    category: "Infectious Disease"
  },
];

export const SPONSORS: Sponsor[] = [
  {
    id: 1,
    brand: "Seclo",
    drug: "Omeprazole 20mg",
    company: "Square Pharmaceuticals",
    tagline: "Trusted acid control for Bangladesh since 1994.",
    indication: "GERD, peptic ulcer, H. pylori eradication",
    dosing: "20–40 mg once daily before breakfast",
    color: "#0693A4"
  },
  {
    id: 2,
    brand: "Fexo",
    drug: "Fexofenadine 120mg",
    company: "Square Pharmaceuticals",
    tagline: "Non-drowsy relief for allergic rhinitis.",
    indication: "Allergic rhinitis, chronic urticaria",
    dosing: "120 mg once daily or 180 mg once daily",
    color: "#3B82F6"
  },
  {
    id: 3,
    brand: "Monas",
    drug: "Montelukast 10mg",
    company: "ACI Limited",
    tagline: "Leukotriene receptor antagonist for asthma & rhinitis.",
    indication: "Asthma prophylaxis, seasonal allergic rhinitis",
    dosing: "10 mg once daily in the evening",
    color: "#10B981"
  },
  {
    id: 4,
    brand: "Diabend",
    drug: "Glibenclamide 5mg",
    company: "Beximco Pharmaceuticals",
    tagline: "Reliable sulfonylurea for type 2 diabetes management.",
    indication: "Type 2 diabetes mellitus (adjunct to diet/exercise)",
    dosing: "2.5–5 mg before breakfast; max 15 mg/day",
    color: "#8B5CF6"
  },
  {
    id: 5,
    brand: "Atova",
    drug: "Atorvastatin 20mg",
    company: "Incepta Pharmaceuticals",
    tagline: "Cardioprotective statin for long-term lipid control.",
    indication: "Hyperlipidaemia, primary & secondary CV prevention",
    dosing: "10–80 mg once daily (evening preferred)",
    color: "#F59E0B"
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Infectious Disease": "#EF4444",
  "Endocrinology": "#F59E0B",
  "Gastroenterology": "#10B981",
  "Nephrology": "#3B82F6",
  "Respiratory": "#06B6D4",
  "Paediatrics": "#8B5CF6",
  "Obstetrics": "#EC4899",
  "Haematology": "#F97316",
  "Palliative Care": "#64748B",
  "Cardiology": "#EF4444",
};

export function getDailyIndex(arr: any[]): number {
  if (!arr || arr.length === 0) return 0;
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return (d.getFullYear() * 400 + dayOfYear) % arr.length;
}
