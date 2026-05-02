/**
 * Clinical content seed — conditions, protocols, ER drugs, systems
 * Run: node scripts/seed-clinical.mjs
 * Output: db/migrations/0002_seed_clinical.sql
 */
import fs from "node:fs";

const OUT = "db/migrations/0002_seed_clinical.sql";
const L = [];

const esc = (v) => v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;
const ins = (table, cols, rows) => {
  for (let i = 0; i < rows.length; i += 200) {
    const vals = rows.slice(i, i + 200).map(r => `(${cols.map(c => esc(r[c])).join(",")})`).join(",\n  ");
    L.push(`INSERT OR IGNORE INTO ${table} (${cols.join(",")}) VALUES\n  ${vals};`);
  }
};

L.push("BEGIN TRANSACTION;");

// ── Systems ──────────────────────────────────────────────────────────────────
ins("systems", ["id","name","icon","color","order_index"], [
  { id:"cardiology",    name:"Cardiology",           icon:"Heart",        color:"#FF4444", order_index:1 },
  { id:"respiratory",  name:"Respiratory",           icon:"Wind",         color:"#4499FF", order_index:2 },
  { id:"gi",           name:"GI & Hepatology",       icon:"Activity",     color:"#FF9944", order_index:3 },
  { id:"nephrology",   name:"Nephrology",            icon:"FlaskConical", color:"#44AAFF", order_index:4 },
  { id:"neurology",    name:"Neurology",             icon:"Brain",        color:"#AA44FF", order_index:5 },
  { id:"infectious",   name:"Infectious Disease",    icon:"Microscope",   color:"#FF4499", order_index:6 },
  { id:"endocrine",    name:"Endocrinology",         icon:"Syringe",      color:"#FFCC44", order_index:7 },
  { id:"haematology",  name:"Haematology",           icon:"Droplets",     color:"#FF6644", order_index:8 },
  { id:"obgyn",        name:"Obs & Gynaecology",     icon:"User2",        color:"#FF44AA", order_index:9 },
  { id:"paediatrics",  name:"Paediatrics",           icon:"Baby",         color:"#44FFCC", order_index:10 },
]);

// ── Conditions ───────────────────────────────────────────────────────────────
ins("conditions", ["id","name","system_id","overview","icd10_code","slug"], [
  {
    id: "dengue", name: "Dengue Fever", system_id: "infectious", icd10_code: "A90",
    slug: "dengue",
    overview: "Dengue is a mosquito-borne viral infection caused by the dengue virus (DENV 1-4) transmitted by Aedes aegypti. It ranges from mild febrile illness to severe dengue with plasma leakage, hemorrhage, and organ impairment. Bangladesh sees seasonal outbreaks, primarily June–October.",
  },
  {
    id: "typhoid", name: "Typhoid Fever", system_id: "infectious", icd10_code: "A01.0",
    slug: "typhoid",
    overview: "Typhoid fever is a systemic infection caused by Salmonella enterica serovar Typhi. Transmitted via contaminated food and water. Endemic in Bangladesh. Presents with stepwise fever, relative bradycardia, rose spots, and abdominal symptoms.",
  },
  {
    id: "malaria", name: "Malaria", system_id: "infectious", icd10_code: "B54",
    slug: "malaria",
    overview: "Malaria is caused by Plasmodium parasites (P. falciparum 68%, P. vivax 32% in BD) transmitted by Anopheles mosquitoes. Endemic in Chittagong Hill Tracts. P. falciparum can cause severe/cerebral malaria.",
  },
  {
    id: "pneumonia", name: "Community-Acquired Pneumonia", system_id: "respiratory", icd10_code: "J18.9",
    slug: "pneumonia",
    overview: "CAP is an acute infection of the pulmonary parenchyma acquired outside hospital. Common pathogens: Streptococcus pneumoniae, Haemophilus influenzae, atypical organisms. CURB-65 score guides admission decision.",
  },
  {
    id: "acs", name: "Acute Coronary Syndrome", system_id: "cardiology", icd10_code: "I24.9",
    slug: "acs",
    overview: "ACS encompasses STEMI, NSTEMI, and unstable angina. Caused by rupture of atherosclerotic plaque with thrombosis. Time-critical: door-to-needle < 30 min for thrombolysis, door-to-balloon < 90 min for PCI.",
  },
  {
    id: "dka", name: "Diabetic Ketoacidosis", system_id: "endocrine", icd10_code: "E10.1",
    slug: "dka",
    overview: "DKA is a life-threatening complication of diabetes with hyperglycemia, metabolic acidosis, and ketosis. Precipitated by infection, missed insulin, or new-onset T1DM. Treatment: fluid, insulin, electrolyte replacement.",
  },
  {
    id: "uti", name: "Urinary Tract Infection", system_id: "nephrology", icd10_code: "N39.0",
    slug: "uti",
    overview: "UTI includes cystitis (lower) and pyelonephritis (upper). Commonest organism: E. coli. Women more affected. Uncomplicated cystitis treated empirically; pyelonephritis requires urine culture and longer course.",
  },
  {
    id: "stroke", name: "Ischaemic Stroke", system_id: "neurology", icd10_code: "I63.9",
    slug: "stroke",
    overview: "Ischaemic stroke is caused by cerebral artery occlusion. FAST acronym: Face drooping, Arm weakness, Speech difficulty, Time to call. Thrombolysis (rtPA) within 4.5 hours if eligible. CT head to exclude haemorrhage first.",
  },
  {
    id: "anaemia", name: "Iron Deficiency Anaemia", system_id: "haematology", icd10_code: "D50.9",
    slug: "anaemia",
    overview: "IDA is the commonest cause of anaemia worldwide. In Bangladesh, nutritional deficiency and helminth infection are major causes. Presents with fatigue, pallor, koilonychia, angular stomatitis.",
  },
  {
    id: "cholera", name: "Cholera", system_id: "infectious", icd10_code: "A00.9",
    slug: "cholera",
    overview: "Cholera is caused by Vibrio cholerae O1/O139. Presents with sudden-onset watery diarrhoea ('rice-water stool'), vomiting, and rapid dehydration. Can be fatal within hours if untreated. Oral or IV rehydration is the cornerstone of treatment.",
  },
]);

// ── Symptoms ─────────────────────────────────────────────────────────────────
ins("symptoms", ["condition_id","text","is_warn_sign","category"], [
  // Dengue
  { condition_id:"dengue", text:"Sudden high fever (38.5–40°C), lasting 2–7 days", is_warn_sign:0, category:"general" },
  { condition_id:"dengue", text:"Severe headache", is_warn_sign:0, category:"general" },
  { condition_id:"dengue", text:"Retro-orbital (behind-eye) pain", is_warn_sign:0, category:"general" },
  { condition_id:"dengue", text:"Myalgia and arthralgia ('breakbone fever')", is_warn_sign:0, category:"general" },
  { condition_id:"dengue", text:"Maculopapular rash (after day 3)", is_warn_sign:0, category:"skin" },
  { condition_id:"dengue", text:"Mild bleeding — petechiae, gum bleed, epistaxis", is_warn_sign:0, category:"bleeding" },
  { condition_id:"dengue", text:"Severe abdominal pain or tenderness", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Persistent vomiting (>3 times/day)", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Clinical fluid accumulation (ascites, pleural effusion)", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Mucosal bleeding (haematemesis, melaena)", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Lethargy or restlessness, sudden behavioural change", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Liver enlargement >2 cm", is_warn_sign:1, category:"warning" },
  { condition_id:"dengue", text:"Rapid drop in platelet with concurrent rise in Hct", is_warn_sign:1, category:"warning" },
  // Typhoid
  { condition_id:"typhoid", text:"Stepwise rising fever over 1 week", is_warn_sign:0, category:"general" },
  { condition_id:"typhoid", text:"Relative bradycardia (pulse-temperature dissociation)", is_warn_sign:0, category:"cvs" },
  { condition_id:"typhoid", text:"Abdominal pain, constipation or diarrhoea", is_warn_sign:0, category:"gi" },
  { condition_id:"typhoid", text:"Rose spots on abdomen (faint salmon-coloured macules)", is_warn_sign:0, category:"skin" },
  { condition_id:"typhoid", text:"Splenomegaly", is_warn_sign:0, category:"examination" },
  { condition_id:"typhoid", text:"Intestinal perforation (severe abdominal rigidity)", is_warn_sign:1, category:"warning" },
  { condition_id:"typhoid", text:"GI haemorrhage (bright red rectal bleeding)", is_warn_sign:1, category:"warning" },
  // Pneumonia
  { condition_id:"pneumonia", text:"Fever with chills and rigors", is_warn_sign:0, category:"general" },
  { condition_id:"pneumonia", text:"Productive cough with purulent or rusty sputum", is_warn_sign:0, category:"respiratory" },
  { condition_id:"pneumonia", text:"Dyspnoea, pleuritic chest pain", is_warn_sign:0, category:"respiratory" },
  { condition_id:"pneumonia", text:"Tachypnoea (RR >20), reduced SpO2", is_warn_sign:0, category:"respiratory" },
  { condition_id:"pneumonia", text:"Dullness on percussion, bronchial breathing", is_warn_sign:0, category:"examination" },
  { condition_id:"pneumonia", text:"SpO2 < 90% on room air", is_warn_sign:1, category:"warning" },
  // Cholera
  { condition_id:"cholera", text:"Sudden onset profuse watery diarrhoea ('rice-water stool')", is_warn_sign:0, category:"gi" },
  { condition_id:"cholera", text:"Painless watery vomiting", is_warn_sign:0, category:"gi" },
  { condition_id:"cholera", text:"Rapid dehydration — sunken eyes, decreased skin turgor", is_warn_sign:0, category:"general" },
  { condition_id:"cholera", text:"Muscle cramps (hypokalaemia)", is_warn_sign:0, category:"general" },
  { condition_id:"cholera", text:"Signs of severe dehydration: unable to drink, decreased consciousness", is_warn_sign:1, category:"warning" },
]);

// ── Protocols ────────────────────────────────────────────────────────────────
ins("protocols", ["id","condition_id","title","source","version","year"], [
  { id:1, condition_id:"dengue",    title:"Dengue Clinical Case Management",       source:"DGHS NMEP", version:"2022 Revised", year:2022 },
  { id:2, condition_id:"typhoid",   title:"Typhoid Standard Treatment Guideline",  source:"DGHS",      version:"1.0",          year:2021 },
  { id:3, condition_id:"pneumonia", title:"CAP Management Protocol",               source:"DGHS",      version:"1.0",          year:2020 },
  { id:4, condition_id:"cholera",   title:"Cholera Case Management",               source:"DGHS/ICDDR,B", version:"1.0",       year:2021 },
  { id:5, condition_id:"malaria",   title:"Malaria Treatment Protocol",            source:"DGHS NMEP", version:"NSP 2021-2025",year:2021 },
]);

// ── Protocol Steps ───────────────────────────────────────────────────────────
const dengueSteps = [
  {
    protocol_id:1, step_number:1,
    heading:"Step 1: Classify the Patient",
    body:"Use the DGHS 3-group classification based on warning signs and severity:",
    sub_steps_json: JSON.stringify([
      "GROUP A (Mild) — No warning signs, tolerating oral fluids, normal urine output → SEND HOME",
      "GROUP B (Moderate) — Any warning sign present, OR high-risk patient (infant, pregnancy, DM, renal disease, haematological condition) → ADMIT for monitoring",
      "GROUP C (Severe) — Severe plasma leakage with shock (DSS), severe haemorrhage, severe organ impairment → EMERGENCY MANAGEMENT",
    ]),
    severity:"all",
  },
  {
    protocol_id:1, step_number:2,
    heading:"Step 2: Warning Signs to Watch",
    body:"Any ONE of these = Group B (admit immediately):",
    sub_steps_json: JSON.stringify([
      "Severe abdominal pain or tenderness",
      "Persistent vomiting (>3 times/day)",
      "Clinical fluid accumulation (ascites, pleural effusion)",
      "Mucosal bleeding (haematemesis, melaena)",
      "Lethargy, restlessness, or sudden behavioural change",
      "Liver enlargement >2 cm",
      "Tourniquet test positive (≥20 petechiae per 2.5 cm²)",
      "Rapid drop in platelet AND concurrent rise in haematocrit",
    ]),
    severity:"group-b",
  },
  {
    protocol_id:1, step_number:3,
    heading:"Step 3: Group A — Home Management",
    body:"Adequate rest and oral fluid intake. Return immediately if warning signs develop.",
    sub_steps_json: JSON.stringify([
      "Paracetamol 500–1000 mg every 6 hours for fever (MAX 4g/day) — NOT aspirin or ibuprofen (risk of bleeding)",
      "Oral fluids: 2–3 litres/day — ORS, coconut water, fruit juice, rice water",
      "Monitor: temperature, fluid intake/output, urine output",
      "Return immediately if: no improvement after 48h, warning signs develop, unable to tolerate oral fluids",
      "Follow-up in 24–48 hours",
    ]),
    severity:"group-a",
  },
  {
    protocol_id:1, step_number:4,
    heading:"Step 4: Group B — In-Hospital Management",
    body:"Admit, IV access, baseline investigations, fluid management protocol.",
    sub_steps_json: JSON.stringify([
      "IV access + blood: CBC (platelets, Hct), LFT (AST/ALT), blood group, NS1 antigen / IgM-IgG serology",
      "Encourage oral fluids. If not tolerated: IV fluids — NS or Ringer's Lactate",
      "Fluid rate: maintenance + 5% deficit correction based on weight",
      "Paracetamol for fever — avoid NSAIDs",
      "Monitor: vital signs every 4h, Hct every 12h, platelet count daily",
      "Watch for warning signs and transition to Group C if deterioration",
      "Discharge criteria: afebrile >48h, improving, platelets >50,000, stable haematocrit, adequate urine output",
    ]),
    severity:"group-b",
  },
  {
    protocol_id:1, step_number:5,
    heading:"Step 5: Group C — Emergency Management (DSS)",
    body:"Dengue Shock Syndrome — immediate aggressive IV fluid resuscitation.",
    sub_steps_json: JSON.stringify([
      "IMMEDIATE: IV NS or RL 10–20 ml/kg over 1 hour",
      "Reassess: if improved → reduce to 5–7 ml/kg/hr for 1–2h, then 3–5 ml/kg/hr, then 2–3 ml/kg/hr",
      "If NOT improved after initial bolus → repeat 10–20 ml/kg bolus (maximum 2 boluses)",
      "If still no improvement → consider colloid (Dextran 40 or fresh frozen plasma 10 ml/kg)",
      "Severe haemorrhage: Packed Red Cells or Fresh Whole Blood (10 ml/kg)",
      "Severe thrombocytopenia with bleeding: Platelet concentrate (if platelets <10,000 or <20,000 with active bleed)",
      "ICU transfer: persistent shock despite 2 fluid boluses, severe organ impairment, severe haemorrhage",
    ]),
    table_json: JSON.stringify({
      title: "Fluid Rate Guide",
      headers: ["Phase", "Rate"],
      rows: [
        ["Initial bolus (shock)", "10–20 ml/kg/hr × 1 hr"],
        ["Step down 1", "5–7 ml/kg/hr × 1–2 hr"],
        ["Step down 2", "3–5 ml/kg/hr × 2–4 hr"],
        ["Step down 3", "2–3 ml/kg/hr × 2–4 hr"],
        ["Maintenance", "1–2 ml/kg/hr, monitor Hct"],
      ],
    }),
    severity:"group-c",
  },
  {
    protocol_id:1, step_number:6,
    heading:"Step 6: Key Lab Thresholds",
    body:"Monitor these values closely during hospitalisation:",
    table_json: JSON.stringify({
      title: "Lab Monitoring",
      headers: ["Test", "Threshold", "Action"],
      rows: [
        ["Haematocrit (Hct)", "Rise >20% from baseline", "Suspect plasma leakage → increase fluids"],
        ["Platelet", "<100,000", "Increase monitoring frequency"],
        ["Platelet", "<20,000", "Consider prophylactic transfusion if bleeding"],
        ["Platelet", "<10,000", "Platelet transfusion regardless"],
        ["AST or ALT", "≥1000 U/L", "Severe liver involvement → Group C"],
        ["Urine output", "<0.5 ml/kg/hr for >4h", "Inadequate → increase fluids"],
      ],
    }),
    severity:"all",
  },
];

const typhoidSteps = [
  {
    protocol_id:2, step_number:1,
    heading:"Step 1: Diagnosis",
    body:"Clinical diagnosis + supportive lab findings. Blood culture is the gold standard.",
    sub_steps_json: JSON.stringify([
      "Blood culture (sensitivity 60–80% in week 1) — collect BEFORE starting antibiotics",
      "Widal test: single titre O ≥1:160 or H ≥1:160 — suggestive but not diagnostic",
      "CBC: leucopenia (WBC 2000–4000), relative lymphocytosis",
      "LFT: mild transaminase elevation common",
      "Stool culture (week 2–3), urine culture (week 2–4)",
    ]),
    severity:"all",
  },
  {
    protocol_id:2, step_number:2,
    heading:"Step 2: Antibiotic Therapy",
    body:"Choose based on local resistance patterns. Fluoroquinolone resistance is rising in BD.",
    sub_steps_json: JSON.stringify([
      "FIRST LINE (uncomplicated): Azithromycin 1g stat then 500mg OD × 6 days",
      "ALTERNATIVE 1: Ceftriaxone 2g IV OD × 10–14 days (if severely ill or unable to take oral)",
      "ALTERNATIVE 2: Cefixime 200mg BD PO × 14 days",
      "AVOID: Fluoroquinolones (ciprofloxacin) — high resistance in BD",
      "AVOID: Chloramphenicol, cotrimoxazole — widespread resistance",
      "For complications (perforation, haemorrhage): IV Ceftriaxone + Metronidazole, surgical consult",
    ]),
    severity:"all",
  },
  {
    protocol_id:2, step_number:3,
    heading:"Step 3: Supportive Care",
    body:"Fever management, nutrition, hydration, monitoring for complications.",
    sub_steps_json: JSON.stringify([
      "Paracetamol for fever — tepid sponging",
      "Soft diet, adequate hydration",
      "Watch for: intestinal perforation (sudden worsening abdominal pain, rigidity, fever spike), GI bleeding",
      "Dexamethasone 3 mg/kg IV then 1 mg/kg every 6h × 48h for severe typhoid with altered consciousness/shock",
      "Isolation precautions: enteric precautions, hand hygiene",
    ]),
    severity:"all",
  },
];

const pneumoniaSteps = [
  {
    protocol_id:3, step_number:1,
    heading:"Step 1: Severity Assessment (CURB-65)",
    body:"Score 1 point each: Confusion, Urea >7 mmol/L, RR ≥30, BP <90/60, Age ≥65.",
    table_json: JSON.stringify({
      title: "CURB-65 Management",
      headers: ["Score", "Severity", "Management"],
      rows: [
        ["0–1", "Low", "Outpatient oral antibiotics"],
        ["2", "Moderate", "Consider hospitalisation"],
        ["3–5", "High", "Hospital admission, consider ICU"],
      ],
    }),
    severity:"all",
  },
  {
    protocol_id:3, step_number:2,
    heading:"Step 2: Antibiotic Selection",
    body:"Empirical antibiotics within 4 hours of diagnosis.",
    sub_steps_json: JSON.stringify([
      "OUTPATIENT (CURB-65 0-1): Amoxicillin 500mg TDS × 5 days, OR Azithromycin 500mg OD × 5 days",
      "INPATIENT (CURB-65 2): Amoxicillin-Clavulanate 1.2g IV TDS + Azithromycin 500mg OD",
      "SEVERE (CURB-65 3+): Ceftriaxone 2g IV OD + Azithromycin 500mg IV OD",
      "ASPIRATION: Add Metronidazole 500mg TDS",
      "De-escalate to oral when afebrile >48h and improving",
    ]),
    severity:"all",
  },
  {
    protocol_id:3, step_number:3,
    heading:"Step 3: Oxygen & Supportive Care",
    body:"Target SpO2 ≥94% (88–92% if COPD). IV fluids for dehydration.",
    sub_steps_json: JSON.stringify([
      "Supplemental oxygen via nasal cannula or face mask to maintain SpO2 ≥94%",
      "High-flow oxygen or NIV if SpO2 <90% despite standard oxygen",
      "Adequate IV fluids",
      "Chest physiotherapy",
      "Follow-up CXR at 6 weeks to confirm resolution",
    ]),
    severity:"all",
  },
];

const choleraSteps = [
  {
    protocol_id:4, step_number:1,
    heading:"Step 1: Assess Dehydration",
    body:"Classify dehydration severity immediately.",
    table_json: JSON.stringify({
      title: "Dehydration Classification",
      headers: ["Feature", "None", "Some", "Severe"],
      rows: [
        ["General", "Well", "Restless", "Lethargic/unconscious"],
        ["Eyes", "Normal", "Sunken", "Very sunken"],
        ["Thirst", "Drinks normally", "Drinks eagerly", "Unable to drink"],
        ["Skin pinch", "Returns quickly", "Returns slowly", "Returns very slowly"],
        ["Management", "ORS at home", "ORS in clinic (Plan B)", "IV Ringer's Lactate (Plan C)"],
      ],
    }),
    severity:"all",
  },
  {
    protocol_id:4, step_number:2,
    heading:"Step 2: Rehydration (Plan C — Severe)",
    body:"IV Ringer's Lactate (preferred over NS for cholera).",
    sub_steps_json: JSON.stringify([
      "Adults: 100 ml/kg RL in 3 hours. First 30 ml/kg in 30 minutes.",
      "Children <5 yrs: 100 ml/kg RL in 3 hours. First 30 ml/kg in 1 hour.",
      "Reassess every 30 min. If improving, continue. If not, increase speed.",
      "Once able to drink: switch to ORS, continue until diarrhoea stops",
    ]),
    severity:"severe",
  },
  {
    protocol_id:4, step_number:3,
    heading:"Step 3: Antibiotic Therapy",
    body:"Single dose antibiotic reduces severity and excretion.",
    sub_steps_json: JSON.stringify([
      "Adults: Azithromycin 1g single dose (drug of choice in BD)",
      "Children: Azithromycin 20 mg/kg single dose (max 1g)",
      "Alternative: Doxycycline 300mg single dose (adults only, NOT in children/pregnancy)",
      "Tetracycline resistance is widespread — avoid",
    ]),
    severity:"all",
  },
];

const malariaSteps = [
  {
    protocol_id:5, step_number:1,
    heading:"Step 1: Diagnosis",
    body:"Confirm with RDT or microscopy before treatment. Never treat empirically.",
    sub_steps_json: JSON.stringify([
      "RDT (Rapid Diagnostic Test) — preferred for field settings",
      "Thick and thin blood smear microscopy — gold standard, identifies species",
      "If P. falciparum: classify as uncomplicated or severe",
      "Severe malaria criteria: coma/impaired consciousness, severe anaemia (Hb <7), respiratory distress, repeated convulsions, inability to stand/walk, jaundice, haemoglobinuria, shock",
    ]),
    severity:"all",
  },
  {
    protocol_id:5, step_number:2,
    heading:"Step 2: Uncomplicated P. falciparum",
    body:"Artemisinin-based combination therapy (ACT) — first line.",
    sub_steps_json: JSON.stringify([
      "FIRST LINE: Artemether-Lumefantrine (Coartem) — 1.5/9 mg/kg BD × 3 days with fatty food",
      "ALTERNATIVE: Artesunate-Amodiaquine × 3 days",
      "Do NOT use monotherapy",
      "Follow-up blood smear on day 3, 7, 28",
    ]),
    severity:"uncomplicated",
  },
  {
    protocol_id:5, step_number:3,
    heading:"Step 3: Severe P. falciparum",
    body:"IV Artesunate — refer to tertiary hospital.",
    sub_steps_json: JSON.stringify([
      "IV Artesunate 2.4 mg/kg at 0, 12, 24 hours, then daily",
      "Switch to oral ACT when able to tolerate oral medications",
      "Quinine IV if artesunate unavailable: loading dose 20 mg/kg over 4h, then 10 mg/kg every 8h",
      "Supportive: IV fluids (cautious — avoid overhydration), monitor blood glucose, treat hypoglycaemia",
    ]),
    severity:"severe",
  },
  {
    protocol_id:5, step_number:4,
    heading:"Step 4: P. vivax",
    body:"Chloroquine + Primaquine (check G6PD first).",
    sub_steps_json: JSON.stringify([
      "Chloroquine 10 mg base/kg on day 1 and 2, then 5 mg/kg on day 3",
      "Primaquine 0.25 mg/kg OD × 14 days (radical cure, prevents relapse)",
      "CHECK G6PD status before primaquine — haemolysis risk in G6PD deficiency",
    ]),
    severity:"vivax",
  },
];

const allSteps = [...dengueSteps, ...typhoidSteps, ...pneumoniaSteps, ...choleraSteps, ...malariaSteps];
ins("protocol_steps", ["protocol_id","step_number","heading","body","sub_steps_json","table_json","severity"], allSteps);

// ── ER Drugs ─────────────────────────────────────────────────────────────────
ins("er_drugs", ["name","indication","dose_per_kg","max_dose_mg","route","concentration_mg_per_ml","dilution_notes","warning_note","is_paediatric_safe","order_index"], [
  {
    name:"Adrenaline (Epinephrine)",
    indication:"Anaphylaxis / Cardiac Arrest",
    dose_per_kg:0.01, max_dose_mg:0.5,
    route:"IM (lateral thigh)",
    concentration_mg_per_ml:1.0,
    dilution_notes:"1:1000 solution (1 mg/mL). Give IM, not IV for anaphylaxis.",
    warning_note:"IV route only for cardiac arrest. Repeat IM dose every 5–15 min if no response.",
    is_paediatric_safe:1, order_index:1,
  },
  {
    name:"Diazepam",
    indication:"Seizure / Status Epilepticus",
    dose_per_kg:0.3, max_dose_mg:10,
    route:"IV (slow) / PR",
    concentration_mg_per_ml:5.0,
    dilution_notes:"IV: 5 mg/mL. Give slowly over 3 min. PR: same dose.",
    warning_note:"Monitor respiratory rate. Respiratory depression risk. Have bag-mask ready.",
    is_paediatric_safe:1, order_index:2,
  },
  {
    name:"Phenobarbitone",
    indication:"Status Epilepticus (2nd line)",
    dose_per_kg:20, max_dose_mg:1000,
    route:"IV slow",
    concentration_mg_per_ml:200.0,
    dilution_notes:"200 mg/mL. Dilute to 20 mg/mL with WFI. Give at max 100 mg/min.",
    warning_note:"Causes respiratory depression and hypotension. Monitor closely.",
    is_paediatric_safe:1, order_index:3,
  },
  {
    name:"Hydrocortisone",
    indication:"Anaphylaxis / Adrenal Crisis / Severe Asthma",
    dose_per_kg:4, max_dose_mg:200,
    route:"IV",
    concentration_mg_per_ml:50.0,
    dilution_notes:"100 mg/2 mL. Dilute in 10 mL NS. Give over 5–10 min.",
    warning_note:"Slow onset (hours). Not a first-line drug for anaphylaxis — use adrenaline first.",
    is_paediatric_safe:1, order_index:4,
  },
  {
    name:"Salbutamol (Nebulised)",
    indication:"Acute Severe Asthma / Bronchospasm",
    dose_per_kg:0.15, max_dose_mg:5,
    route:"Nebulised",
    concentration_mg_per_ml:5.0,
    dilution_notes:"0.15 mg/kg in 2.5 mL NS via nebuliser. Repeat every 20 min × 3.",
    warning_note:"Monitor heart rate. Can cause tachycardia and hypokalaemia.",
    is_paediatric_safe:1, order_index:5,
  },
  {
    name:"Dextrose 10%",
    indication:"Hypoglycaemia",
    dose_per_kg:5, max_dose_mg:null,
    route:"IV",
    concentration_mg_per_ml:100.0,
    dilution_notes:"5 ml/kg of 10% Dextrose IV. (= 0.5 g/kg glucose). Target BGL >4 mmol/L.",
    warning_note:"Use 10% in children (NOT 50% — too hypertonic). Recheck BGL 15 min after.",
    is_paediatric_safe:1, order_index:6,
  },
  {
    name:"Atropine",
    indication:"Bradycardia / Organophosphate Poisoning",
    dose_per_kg:0.02, max_dose_mg:0.5,
    route:"IV",
    concentration_mg_per_ml:0.6,
    dilution_notes:"0.6 mg/mL ampoule. Minimum dose 0.1 mg (avoid paradoxical bradycardia).",
    warning_note:"In organophosphate poisoning: large doses may be needed (2–4 mg adults). Repeat every 10 min until secretions dry.",
    is_paediatric_safe:1, order_index:7,
  },
  {
    name:"Adenosine",
    indication:"SVT (Supraventricular Tachycardia)",
    dose_per_kg:0.1, max_dose_mg:6,
    route:"IV rapid push",
    concentration_mg_per_ml:3.0,
    dilution_notes:"3 mg/mL. Must be given as rapid IV push followed immediately by 20 mL NS flush.",
    warning_note:"Causes transient asystole (3–10 sec) — warn patient. Second dose: 0.2 mg/kg (max 12 mg).",
    is_paediatric_safe:1, order_index:8,
  },
  {
    name:"Paracetamol IV",
    indication:"Fever / Pain",
    dose_per_kg:15, max_dose_mg:1000,
    route:"IV infusion",
    concentration_mg_per_ml:10.0,
    dilution_notes:"10 mg/mL. Give over 15 min. Reduce dose in hepatic impairment.",
    warning_note:"Max 4 doses in 24h. Hepatotoxic in overdose.",
    is_paediatric_safe:1, order_index:9,
  },
  {
    name:"Oral Rehydration Salts",
    indication:"Dehydration / Diarrhoea",
    dose_per_kg:null, max_dose_mg:null,
    route:"Oral",
    concentration_mg_per_ml:null,
    dilution_notes:"1 sachet in 1 litre boiled cooled water. Give 50–100 ml/kg over 4h for moderate dehydration.",
    warning_note:"For severe dehydration with vomiting: IV fluids first.",
    is_paediatric_safe:1, order_index:10,
  },
]);

// ── OSCE Cards ────────────────────────────────────────────────────────────────
ins("osce_cards", ["condition_id","question","answer","station_type"], [
  // Dengue
  { condition_id:"dengue", station_type:"history", question:"Name 3 warning signs of dengue that require immediate hospital admission.", answer:"Any of: (1) Severe abdominal pain/tenderness, (2) Persistent vomiting >3 times/day, (3) Clinical fluid accumulation (ascites/effusion), (4) Mucosal bleeding, (5) Lethargy or restlessness, (6) Liver enlargement >2 cm, (7) Rapid drop in platelets with rising haematocrit." },
  { condition_id:"dengue", station_type:"management", question:"A 25-year-old with dengue shock (DSS) arrives. What is your immediate fluid management?", answer:"IV NS or Ringer's Lactate 10–20 ml/kg over 1 hour. Reassess: if improved → step down to 5–7 ml/kg/hr. If not improved → repeat bolus. Max 2 boluses. If still no response → consider colloid (Dextran 40). Target: stable vitals, Hct stable, urine output >0.5 ml/kg/hr." },
  { condition_id:"dengue", station_type:"data-interpretation", question:"A dengue patient's Hct has risen from 38% to 46% in 12 hours. What does this mean and what do you do?", answer:"20% rise in Hct indicates significant plasma leakage (hallmark of Dengue Haemorrhagic Fever). Action: upgrade to Group B/C, increase IV fluid rate, monitor closely, check platelet count. Do NOT give diuretics." },
  { condition_id:"dengue", station_type:"management", question:"Why is aspirin/ibuprofen contraindicated in dengue?", answer:"NSAIDs and aspirin inhibit platelet function and can precipitate or worsen bleeding in dengue. Paracetamol (max 4g/day) is the only safe antipyretic. Aspirin also risks Reye's syndrome in children." },
  // Typhoid
  { condition_id:"typhoid", station_type:"history", question:"What is the most reliable diagnostic test for typhoid fever and when should it be collected?", answer:"Blood culture — gold standard. Should be collected in the first week of illness BEFORE antibiotics are started. Sensitivity 60–80%. Widal test is suggestive (O titre ≥1:160) but not diagnostic due to cross-reactivity." },
  { condition_id:"typhoid", station_type:"management", question:"What is the first-line antibiotic for uncomplicated typhoid in Bangladesh?", answer:"Azithromycin 1g stat then 500mg OD for 6 days (total 7-day course). Fluoroquinolones (ciprofloxacin) should be avoided due to high resistance in Bangladesh." },
  // Pneumonia
  { condition_id:"pneumonia", station_type:"data-interpretation", question:"What does the CURB-65 score assess and how does it guide management?", answer:"CURB-65 assesses CAP severity: Confusion, Urea >7, RR ≥30, BP <90/60, Age ≥65 (1 point each). Score 0–1: outpatient; Score 2: hospital admission; Score 3–5: consider ICU. Each point increases 30-day mortality." },
  { condition_id:"pneumonia", station_type:"management", question:"What SpO2 target do you aim for in a patient with CAP without COPD?", answer:"SpO2 ≥94% on supplemental oxygen. In patients with known COPD or risk of hypercapnia, target 88–92% to avoid suppressing hypoxic respiratory drive." },
  // Cholera
  { condition_id:"cholera", station_type:"management", question:"A 35-year-old with cholera has severe dehydration and is unable to sit up. What is your Plan C rehydration?", answer:"IV Ringer's Lactate 100 ml/kg over 3 hours. First 30 ml/kg in 30 minutes. Reassess every 30 minutes. Once patient can drink, switch to ORS. Give single-dose Azithromycin 1g." },
]);

// ── Lab References ───────────────────────────────────────────────────────────
ins("lab_references", ["name","unit","normal_min","normal_max","critical_low","critical_high","notes"], [
  { name:"Haemoglobin (Male)",      unit:"g/dL",       normal_min:13.0, normal_max:17.0, critical_low:7.0,  critical_high:20.0, notes:"<7 = severe anaemia, transfusion threshold" },
  { name:"Haemoglobin (Female)",    unit:"g/dL",       normal_min:12.0, normal_max:15.0, critical_low:7.0,  critical_high:20.0, notes:"<7 = severe anaemia" },
  { name:"Haematocrit (Male)",      unit:"%",          normal_min:39.0, normal_max:50.0, critical_low:20.0, critical_high:60.0, notes:">20% rise from baseline in dengue = plasma leakage" },
  { name:"Haematocrit (Female)",    unit:"%",          normal_min:36.0, normal_max:46.0, critical_low:20.0, critical_high:60.0, notes:null },
  { name:"WBC (Total)",             unit:"×10⁹/L",     normal_min:4.0,  normal_max:11.0, critical_low:2.0,  critical_high:30.0, notes:"<4 leukopenia (typhoid, dengue); >11 infection/inflammation" },
  { name:"Platelet Count",          unit:"×10⁹/L",     normal_min:150,  normal_max:400,  critical_low:20,   critical_high:null, notes:"<100 = thrombocytopenia; <20 = transfusion risk; <10 = transfuse" },
  { name:"Serum Sodium",            unit:"mmol/L",     normal_min:136,  normal_max:145,  critical_low:120,  critical_high:160,  notes:"<120 or >160 = critical, treat urgently" },
  { name:"Serum Potassium",         unit:"mmol/L",     normal_min:3.5,  normal_max:5.0,  critical_low:2.5,  critical_high:6.5,  notes:"<2.5 = severe hypoK (arrhythmia risk); >6.5 = severe hyperK" },
  { name:"Serum Creatinine",        unit:"µmol/L",     normal_min:60,   normal_max:110,  critical_low:null, critical_high:500,  notes:">500 = severe AKI" },
  { name:"Serum Urea",              unit:"mmol/L",     normal_min:2.5,  normal_max:7.0,  critical_low:null, critical_high:30.0, notes:">7 = CURB-65 point for pneumonia" },
  { name:"ALT (SGPT)",              unit:"U/L",        normal_min:7,    normal_max:56,   critical_low:null, critical_high:1000, notes:">1000 = severe hepatitis / dengue liver involvement" },
  { name:"AST (SGOT)",              unit:"U/L",        normal_min:10,   normal_max:40,   critical_low:null, critical_high:1000, notes:">1000 with dengue = Group C criteria" },
  { name:"Serum Bilirubin (Total)", unit:"µmol/L",     normal_min:5,    normal_max:17,   critical_low:null, critical_high:200,  notes:">200 = consider haemolysis or severe liver disease" },
  { name:"Blood Glucose (Fasting)", unit:"mmol/L",     normal_min:3.9,  normal_max:5.6,  critical_low:2.5,  critical_high:25.0, notes:"<2.5 = treat hypoglycaemia immediately; >25 = consider DKA" },
  { name:"SpO2",                    unit:"%",          normal_min:94,   normal_max:100,  critical_low:88,   critical_high:null, notes:"<94 = supplemental O2; <88 = critical, high-flow O2 or NIV" },
  { name:"CRP",                     unit:"mg/L",       normal_min:0,    normal_max:5,    critical_low:null, critical_high:200,  notes:">100 = significant infection/inflammation" },
  { name:"Prothrombin Time (PT)",   unit:"seconds",    normal_min:11,   normal_max:14,   critical_low:null, critical_high:30,   notes:">30 = significant coagulopathy, check INR" },
  { name:"INR",                     unit:"ratio",      normal_min:0.8,  normal_max:1.2,  critical_low:null, critical_high:3.0,  notes:">3.0 = bleeding risk; therapeutic range for anticoagulation 2–3" },
]);

L.push("COMMIT;");
fs.writeFileSync(OUT, L.join("\n"), "utf8");
console.log(`Written: ${OUT} (${(fs.statSync(OUT).size/1024).toFixed(1)} KB)`);
