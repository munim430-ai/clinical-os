/**
 * Sprint 1N — Lightweight class-based interaction checker.
 *
 * This is NOT a comprehensive pharmacology engine. It's a small,
 * curated rule set keyed on drug class names (matching the
 * `drug_classes.name` column) that flags well-known clinically
 * significant interactions. It is a SAFETY AID, not a substitute
 * for full prescribing references like BNF / Stockley's.
 *
 * Each rule:
 *   classA, classB   — case-insensitive substring match against class name
 *   severity         — "major" (avoid) | "moderate" (monitor) | "minor" (caution)
 *   note             — short clinician-facing reason
 */

export type InteractionSeverity = "major" | "moderate" | "minor";

export interface InteractionRule {
  classA: string;
  classB: string;
  severity: InteractionSeverity;
  note: string;
}

export interface InteractionHit extends InteractionRule {
  drugA: string;
  drugB: string;
  drugAClass: string;
  drugBClass: string;
}

const RULES: InteractionRule[] = [
  // Bleeding risk
  {
    classA: "NSAID",
    classB: "Anticoagulant",
    severity: "major",
    note: "Markedly increased GI bleeding and intracranial haemorrhage risk. Avoid combination; use paracetamol if analgesia needed.",
  },
  {
    classA: "NSAID",
    classB: "Antiplatelet",
    severity: "moderate",
    note: "Additive bleeding risk. Add PPI cover; consider paracetamol alternative.",
  },
  {
    classA: "Anticoagulant",
    classB: "Antiplatelet",
    severity: "major",
    note: "High bleeding risk. Combination only justified post-stenting under specialist supervision.",
  },
  {
    classA: "SSRI",
    classB: "Anticoagulant",
    severity: "moderate",
    note: "SSRIs impair platelet function; bleeding risk raised. Consider PPI; monitor INR.",
  },

  // Renal / electrolyte
  {
    classA: "NSAID",
    classB: "ACE",
    severity: "major",
    note: "AKI risk (triple whammy if also on diuretic). Avoid in elderly, dehydration, CKD.",
  },
  {
    classA: "NSAID",
    classB: "ARB",
    severity: "major",
    note: "AKI risk (triple whammy if also on diuretic). Avoid in elderly, dehydration, CKD.",
  },
  {
    classA: "NSAID",
    classB: "Diuretic",
    severity: "moderate",
    note: "Reduces diuretic efficacy and raises AKI risk. Avoid prolonged use.",
  },
  {
    classA: "ACE",
    classB: "Potassium",
    severity: "moderate",
    note: "Hyperkalaemia risk. Avoid potassium supplements / K-sparing diuretics unless K+ low.",
  },

  // Cardiovascular
  {
    classA: "Beta-blocker",
    classB: "Calcium channel blocker",
    severity: "major",
    note: "With non-dihydropyridine CCBs (verapamil, diltiazem): risk of severe bradycardia, heart block, cardiac arrest.",
  },
  {
    classA: "Macrolide",
    classB: "Statin",
    severity: "major",
    note: "Erythromycin / clarithromycin inhibit CYP3A4 → ↑↑ statin levels → rhabdomyolysis. Hold statin during course.",
  },
  {
    classA: "Macrolide",
    classB: "Anticoagulant",
    severity: "moderate",
    note: "↑ INR with warfarin. Check INR within 3–5 days of starting.",
  },

  // CNS / serotonin
  {
    classA: "SSRI",
    classB: "MAOI",
    severity: "major",
    note: "Serotonin syndrome — life-threatening. Contraindicated. 14-day washout required.",
  },
  {
    classA: "Tramadol",
    classB: "SSRI",
    severity: "moderate",
    note: "Serotonin syndrome and lowered seizure threshold. Use alternative analgesic if possible.",
  },
  {
    classA: "Opioid",
    classB: "Benzodiazepine",
    severity: "major",
    note: "Profound respiratory depression and sedation. Avoid combination unless absolutely necessary.",
  },

  // Glycaemic / endocrine
  {
    classA: "Beta-blocker",
    classB: "Insulin",
    severity: "moderate",
    note: "Masks hypoglycaemia symptoms (tremor, tachycardia). Counsel patient; cardioselective preferred.",
  },
  {
    classA: "Corticosteroid",
    classB: "NSAID",
    severity: "moderate",
    note: "Marked GI ulcer / bleeding risk. PPI cover essential if combination unavoidable.",
  },

  // Pregnancy / contraception
  {
    classA: "Antiepileptic",
    classB: "Contraceptive",
    severity: "moderate",
    note: "Enzyme-inducing antiepileptics reduce hormonal contraceptive efficacy. Use barrier or copper IUD.",
  },
];

function normaliseClass(name: string | null | undefined): string {
  return (name ?? "").toLowerCase();
}

function classMatches(className: string, ruleTerm: string): boolean {
  return normaliseClass(className).includes(ruleTerm.toLowerCase());
}

export interface DrugInput {
  brandName: string;
  drugClass: string | null;
}

/**
 * Returns all interaction hits between any pair of drugs in the input list.
 * Skips drugs with no class.
 */
export function checkInteractions(drugs: DrugInput[]): InteractionHit[] {
  const hits: InteractionHit[] = [];

  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const a = drugs[i];
      const b = drugs[j];
      if (!a.drugClass || !b.drugClass) continue;

      for (const rule of RULES) {
        const aMatchesA = classMatches(a.drugClass, rule.classA);
        const bMatchesB = classMatches(b.drugClass, rule.classB);
        const aMatchesB = classMatches(a.drugClass, rule.classB);
        const bMatchesA = classMatches(b.drugClass, rule.classA);

        if ((aMatchesA && bMatchesB) || (aMatchesB && bMatchesA)) {
          hits.push({
            ...rule,
            drugA: a.brandName,
            drugB: b.brandName,
            drugAClass: a.drugClass,
            drugBClass: b.drugClass,
          });
          break;
        }
      }
    }
  }

  return hits;
}

export function severityColor(s: InteractionSeverity): { bg: string; text: string; border: string } {
  if (s === "major") return { bg: "bg-clinical-redSoft", text: "text-clinical-red", border: "border-border-red" };
  if (s === "moderate") return { bg: "bg-warning/15", text: "text-warning", border: "border-warning/40" };
  return { bg: "bg-mint-soft", text: "text-mint", border: "border-border-accent" };
}
