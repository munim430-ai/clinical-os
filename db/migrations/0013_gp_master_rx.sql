-- GP Master Rx: full condition set + treatment guidelines
-- Sources: Standard Treatment Guidelines (Gujarat STG 2013) + General Practice 3rd Ed (Murtagh)
BEGIN TRANSACTION;

-- ─── rx_entries table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rx_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  condition_id TEXT NOT NULL REFERENCES conditions(id),
  drug_name TEXT NOT NULL,
  drug_class TEXT,
  indication TEXT,
  dosage TEXT,
  frequency TEXT,
  route TEXT,
  duration TEXT,
  notes TEXT,
  priority INTEGER DEFAULT 1,
  source TEXT
);

-- ─── New conditions ──────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview) VALUES
('hypertension', 'Hypertension', 'cardiology', 'I10',
 'Persistently elevated blood pressure ≥140/90 mmHg. Usually asymptomatic; discovered on routine measurement. Can cause target organ damage: CAD, LVH, stroke, retinopathy, renal disease. Associated risk factors include age, smoking, diabetes, dyslipidaemia, obesity, sedentary lifestyle.'),

('diabetes_t2', 'Type 2 Diabetes Mellitus', 'endocrine', 'E11',
 'Chronic metabolic disorder characterised by hyperglycaemia due to reduced insulin secretion and insulin resistance. Diagnosis: fasting plasma glucose ≥126 mg/dL, or random ≥200 mg/dL with symptoms, or 2-hr OGTT ≥200 mg/dL. Long-term complications affect eyes, kidneys, nerves, and cardiovascular system.'),

('tuberculosis', 'Pulmonary Tuberculosis', 'respiratory', 'A15',
 'Infectious disease caused by Mycobacterium tuberculosis. Most common symptom: persistent cough ≥2 weeks with or without expectoration, accompanied by fever, night sweats and weight loss. Diagnosis requires sputum smear microscopy and culture. Treatment follows DOTS (Directly Observed Therapy Short-course) under RNTCP/NTP guidelines.'),

('asthma', 'Bronchial Asthma', 'respiratory', 'J45',
 'Chronic inflammatory disorder of the airways characterised by episodic wheezing, breathlessness, chest tightness and cough — particularly at night or early morning. Associated with variable, often reversible airflow obstruction. Diagnosis confirmed by ≥12% improvement in FEV1 after bronchodilator, or >20% diurnal PEF variation.'),

('epilepsy', 'Epilepsy', 'neurology', 'G40',
 'Recurrent seizures due to chronic abnormal excessive neuronal activity. Classified as generalised (tonic-clonic, absence, myoclonic, atonic) or focal seizures. Evaluation directed at identifying underlying cause, precipitating factors, and adequacy of anti-epileptic drug therapy. Avoid sleep deprivation, alcohol, and known triggers.'),

('peptic_ulcer', 'Peptic Ulcer Disease', 'gi', 'K27',
 'Ulceration of the gastric or duodenal mucosa due to acid, pepsin, and H. pylori infection or NSAID use. Presents with epigastric pain, heartburn, relation to food. Complications include haemorrhage (haematemesis, melaena) and perforation (acute abdomen, guarding, rigidity, shock). H. pylori eradication is cornerstone of therapy.'),

('acute_diarrhoea', 'Acute Diarrhoea', 'gi', 'A09',
 'Passage of ≥3 loose stools/day for <7 days. Common causes: Rotavirus, E. coli, V. cholerae, Giardia; invasive diarrhoea by Shigella, Salmonella, E. histolytica. Clinical features: frequent stools, vomiting, fever, dehydration. Management is primarily rehydration with oral rehydration solution (ORS); antibiotics only for specific indications.');

-- ─── Symptoms ────────────────────────────────────────────────────────────────

-- Hypertension
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('hypertension', 'Usually asymptomatic — found on routine BP measurement', 0),
('hypertension', 'Headache (occipital, worse in morning)', 0),
('hypertension', 'Fatigue, dizziness, epistaxis', 0),
('hypertension', 'Blurred vision (hypertensive retinopathy)', 0),
('hypertension', 'Chest pain or palpitations', 0),
('hypertension', 'BP ≥180/120 mmHg with acute end-organ damage (hypertensive emergency)', 1),
('hypertension', 'Sudden severe headache, visual loss, or focal neurological deficit', 1),
('hypertension', 'Acute pulmonary oedema: breathlessness, pink frothy sputum', 1),
('hypertension', 'Oliguria or haematuria (acute renal involvement)', 1);

-- Diabetes Type 2
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('diabetes_t2', 'Polyuria — increased urine frequency and volume', 0),
('diabetes_t2', 'Polydipsia — excessive thirst', 0),
('diabetes_t2', 'Polyphagia — increased hunger despite eating', 0),
('diabetes_t2', 'Unexplained weight loss', 0),
('diabetes_t2', 'Fatigue and lethargy', 0),
('diabetes_t2', 'Recurrent infections: skin, urinary, candidiasis', 0),
('diabetes_t2', 'Blurred vision', 0),
('diabetes_t2', 'Peripheral tingling or numbness (neuropathy)', 0),
('diabetes_t2', 'Confusion, drowsiness, or coma (hypoglycaemia or DKA)', 1),
('diabetes_t2', 'Kussmaul breathing, fruity breath (DKA)', 1),
('diabetes_t2', 'Chest pain or stroke symptoms (macrovascular complication)', 1);

-- Tuberculosis
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('tuberculosis', 'Persistent cough ≥2 weeks (with or without sputum)', 0),
('tuberculosis', 'Evening fever and night sweats', 0),
('tuberculosis', 'Weight loss and anorexia', 0),
('tuberculosis', 'Fatigue and malaise', 0),
('tuberculosis', 'Haemoptysis (blood-stained sputum)', 0),
('tuberculosis', 'Chest pain and breathlessness', 0),
('tuberculosis', 'Cervical lymphadenopathy (TB lymphadenitis)', 0),
('tuberculosis', 'Massive haemoptysis (>200 mL/24h)', 1),
('tuberculosis', 'Respiratory failure or miliary TB pattern on CXR', 1),
('tuberculosis', 'Signs of TB meningitis: stiff neck, headache, altered consciousness', 1);

-- Asthma
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('asthma', 'Episodic wheeze — musical expiratory noise', 0),
('asthma', 'Breathlessness (dyspnoea) — worse at night or early morning', 0),
('asthma', 'Chest tightness', 0),
('asthma', 'Dry cough — often nocturnal', 0),
('asthma', 'Symptoms triggered by allergens, cold air, exercise, infections', 0),
('asthma', 'Reduced peak expiratory flow (PEF)', 0),
('asthma', 'Silent chest on auscultation (severe attack)', 1),
('asthma', 'SpO2 <92%, cyanosis, or inability to speak in sentences', 1),
('asthma', 'Pulsus paradoxus >25 mmHg (life-threatening)', 1),
('asthma', 'Exhaustion, bradycardia, or confusion (near-fatal asthma)', 1);

-- Epilepsy
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('epilepsy', 'Sudden loss of consciousness with tonic-clonic jerking', 0),
('epilepsy', 'Aura — sensory, visual, or déjà vu preceding seizure', 0),
('epilepsy', 'Absence episodes — brief staring with interruption of activity', 0),
('epilepsy', 'Post-ictal confusion, headache, or Todd''s paresis', 0),
('epilepsy', 'Incontinence of urine during an episode', 0),
('epilepsy', 'Tongue biting (lateral tongue laceration)', 0),
('epilepsy', 'Continuous seizures >5 minutes (status epilepticus)', 1),
('epilepsy', 'Serial seizures without recovery of consciousness between attacks', 1),
('epilepsy', 'Fever with focal seizures (consider encephalitis)', 1);

-- Peptic Ulcer Disease
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('peptic_ulcer', 'Epigastric burning pain — often relieved by food or antacids (duodenal)', 0),
('peptic_ulcer', 'Epigastric pain worsened by food (gastric ulcer)', 0),
('peptic_ulcer', 'Heartburn, belching, nausea', 0),
('peptic_ulcer', 'History of NSAID or aspirin use', 0),
('peptic_ulcer', 'Anorexia and early satiety', 0),
('peptic_ulcer', 'Haematemesis or coffee-ground vomitus (upper GI bleed)', 1),
('peptic_ulcer', 'Melaena — black tarry stools', 1),
('peptic_ulcer', 'Sudden severe abdominal pain with guarding/rigidity (perforation)', 1),
('peptic_ulcer', 'Haemodynamic instability: tachycardia, hypotension, pallor', 1);

-- Acute Diarrhoea
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('acute_diarrhoea', '≥3 loose watery stools per day', 0),
('acute_diarrhoea', 'Abdominal cramping and borborygmi', 0),
('acute_diarrhoea', 'Nausea and vomiting', 0),
('acute_diarrhoea', 'Low-grade fever', 0),
('acute_diarrhoea', 'Thirst and dry mouth (mild dehydration)', 0),
('acute_diarrhoea', 'Blood or mucus in stool (dysentery)', 0),
('acute_diarrhoea', 'Sunken eyes, absent tears, poor skin turgor (severe dehydration)', 1),
('acute_diarrhoea', 'Altered consciousness or seizures', 1),
('acute_diarrhoea', 'Signs of shock: tachycardia, hypotension, cold extremities', 1),
('acute_diarrhoea', 'Oliguria or anuria', 1);

-- ─── Protocols ───────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('hypertension',    'Management of Hypertension', 'STG 2013 / GP 3rd Ed', '2013', 2013),
('diabetes_t2',     'Management of Type 2 Diabetes Mellitus', 'STG 2013', '2013', 2013),
('tuberculosis',    'DOTS Regimen — Pulmonary Tuberculosis', 'STG 2013 / RNTCP', '2013', 2013),
('asthma',          'Stepwise Management of Bronchial Asthma', 'STG 2013', '2013', 2013),
('epilepsy',        'Anti-epileptic Drug Therapy', 'STG 2013 / GP 3rd Ed', '2013', 2013),
('peptic_ulcer',    'H. pylori Eradication and PUD Management', 'STG 2013', '2013', 2013),
('acute_diarrhoea', 'ORS-Based Management of Acute Diarrhoea', 'STG 2013', '2013', 2013);

-- ─── Protocol Steps ──────────────────────────────────────────────────────────

-- HYPERTENSION steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='hypertension'), 1,
 'Assessment & Classification',
 'Measure BP accurately: 2 readings after 5 minutes rest, both arms, supine and erect. Classify stage and assess for target organ damage.',
 '[{"item":"BP <140/90: normal; 140–159/90–99: Stage 1; ≥160/100: Stage 2"},{"item":"Check for TOD: ECG (LVH), urine (microalbuminuria), fundoscopy, renal function"},{"item":"Identify secondary causes if BP poorly controlled or onset <30 years"},{"item":"Calculate 10-year cardiovascular risk using Framingham or WHO risk charts"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='hypertension'), 2,
 'Non-Pharmacological Measures',
 'Lifestyle modification is first-line for Stage 1 and additive to drugs in all stages.',
 '[{"item":"Reduce sodium intake to <2.4 g/day (6 g salt)"},{"item":"DASH diet: fruits, vegetables, low-fat dairy, reduced saturated fat"},{"item":"Aerobic exercise ≥30 min on most days (65–70% max heart rate)"},{"item":"Weight reduction to BMI 18.5–24.9 kg/m²"},{"item":"Limit alcohol: ≤2 units/day men, ≤1 unit/day women"},{"item":"Stop smoking; avoid environmental tobacco smoke"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='hypertension'), 3,
 'Pharmacological Treatment',
 'Start drug therapy if BP ≥140/90 after 3 months lifestyle modification, or immediately if Stage 2 or high cardiovascular risk.',
 '[{"item":"First-line: ACE inhibitor (Enalapril) or CCB (Amlodipine) or thiazide diuretic"},{"item":"If diabetic/proteinuric: ACE inhibitor preferred (renal protection)"},{"item":"If heart failure: ACE inhibitor + beta-blocker + diuretic"},{"item":"Dual therapy if BP not controlled on monotherapy after 4 weeks"},{"item":"Target BP: <140/90 mmHg; <130/80 if diabetic or CKD"},{"item":"Monitor renal function and electrolytes 4–6 weeks after starting ACE inhibitor"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='hypertension'), 4,
 'Hypertensive Emergency',
 'BP ≥180/120 mmHg with acute end-organ damage. Requires immediate IV treatment and ICU admission.',
 '[{"item":"Admit to ICU; IV access and continuous BP monitoring"},{"item":"Target: reduce MAP by ≤25% in first hour, then to 160/100 over 2–6 hours"},{"item":"IV Labetalol 20 mg bolus, then 40–80 mg every 10 min (max 300 mg) OR"},{"item":"IV Sodium nitroprusside 0.25–10 mcg/kg/min infusion"},{"item":"Avoid rapid BP reduction — risk of ischaemic stroke or coronary event"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='hypertension'), 5,
 'Follow-up & Monitoring',
 'Regular review to assess BP control, adherence, side effects, and TOD progression.',
 '[{"item":"Review every 4 weeks until BP controlled, then every 3 months"},{"item":"Annual: ECG, urine microalbumin, serum creatinine, fasting glucose, lipids"},{"item":"Educate patient on medication adherence and self-monitoring"},{"item":"Reinforce lifestyle measures at every visit"}]',
 'moderate');

-- DIABETES T2 steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='diabetes_t2'), 1,
 'Diagnosis & Initial Assessment',
 'Confirm diagnosis and assess for complications at presentation.',
 '[{"item":"Fasting plasma glucose ≥126 mg/dL on 2 occasions"},{"item":"Random glucose ≥200 mg/dL with classic symptoms"},{"item":"2-hr OGTT ≥200 mg/dL; HbA1c ≥6.5%"},{"item":"Baseline: HbA1c, fasting lipids, urine microalbumin, serum creatinine, fundoscopy, ECG, foot examination"},{"item":"Screen for complications: retinopathy, nephropathy, neuropathy, peripheral vascular disease"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='diabetes_t2'), 2,
 'Non-Pharmacological Treatment',
 'Diet and exercise are first-line and should continue throughout pharmacotherapy.',
 '[{"item":"Caloric target: sedentary 1800–2000 kcal/day; adjust for weight and activity"},{"item":"Carbohydrate 45–65%, protein 10–35%, fat 20–35% (saturated fat <7%)"},{"item":"Avoid high glycaemic index foods, sugary beverages, processed carbohydrates"},{"item":"Exercise: ≥150 min/week moderate aerobic activity; resistance training 2–3×/week"},{"item":"Target weight loss 5–10% if overweight; improves glycaemic control significantly"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='diabetes_t2'), 3,
 'Pharmacological Treatment',
 'Initiate Metformin at diagnosis alongside lifestyle measures unless contraindicated.',
 '[{"item":"Step 1: Metformin 500 mg with meals twice daily; uptitrate to 1–2 g BD"},{"item":"Step 2: Add Glibenclamide 2.5–5 mg OD if HbA1c >7% after 3 months"},{"item":"Step 3: Consider insulin if HbA1c >9% or symptoms of hyperglycaemia persist"},{"item":"Insulin starting dose: 0.2 units/kg/day basal insulin (Isophane/NPH) at bedtime"},{"item":"Monitor fasting glucose daily when starting insulin; adjust dose weekly"},{"item":"HbA1c target: <7% general; <8% elderly/comorbid; avoid hypoglycaemia"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='diabetes_t2'), 4,
 'Complications Management',
 'Proactive screening and treatment of diabetic complications.',
 '[{"item":"Retinopathy: annual fundoscopy; laser photocoagulation if proliferative"},{"item":"Nephropathy: ACE inhibitor if microalbuminuria; target BP <130/80"},{"item":"Neuropathy: amitriptyline 25 mg nocte or pregabalin 75–150 mg BD for pain"},{"item":"Foot care: inspect feet every visit; podiatry referral if callus or ulcer"},{"item":"Cardiovascular: statin (Atorvastatin 20–40 mg) for all T2DM patients >40 years"}]',
 'moderate');

-- TUBERCULOSIS steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='tuberculosis'), 1,
 'Diagnosis',
 'Identify and confirm TB with sputum microscopy, culture, and CXR.',
 '[{"item":"Sputum smear microscopy: 2 samples (spot-early morning) for AFB"},{"item":"CXR: upper lobe infiltrates, cavitation, miliary pattern"},{"item":"Sputum culture and drug sensitivity testing (DST) if smear negative or treatment failure"},{"item":"GeneXpert MTB/RIF if available — confirms diagnosis and detects rifampicin resistance"},{"item":"Mantoux (TST) or IGRA for latent TB; not diagnostic for active disease"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='tuberculosis'), 2,
 'New Case — Intensive Phase (2 months)',
 'Four-drug combination: HRZE given daily under DOTS supervision.',
 '[{"item":"Isoniazid (H) 5 mg/kg/day (max 300 mg)"},{"item":"Rifampicin (R) 10 mg/kg/day (max 600 mg)"},{"item":"Pyrazinamide (Z) 25 mg/kg/day (max 2 g)"},{"item":"Ethambutol (E) 15–25 mg/kg/day (max 1.6 g)"},{"item":"Pyridoxine (B6) 25–50 mg/day with isoniazid to prevent neuropathy"},{"item":"Sputum smear repeat at 2 months — if positive, extend intensive phase by 1 month"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='tuberculosis'), 3,
 'Continuation Phase (4 months)',
 'Two-drug combination: HR daily or 3× weekly under DOTS.',
 '[{"item":"Isoniazid (H) + Rifampicin (R) — continue for 4 months"},{"item":"Total treatment duration: 6 months (2HRZE + 4HR) for new pulmonary TB"},{"item":"Extend to 9–12 months for TB meningitis, bone TB, or cavitary disease with positive 2-month smear"},{"item":"Monitor LFTs monthly if baseline abnormal — discontinue if transaminases >5× ULN"},{"item":"Sputum smear at month 5 and end of treatment — treatment failure if positive"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='tuberculosis'), 4,
 'Drug-Resistant TB',
 'MDR-TB (resistant to H+R) requires longer regimens with second-line drugs.',
 '[{"item":"Suspect if treatment failure, relapse, or contact with known MDR-TB case"},{"item":"Confirm with culture and DST or GeneXpert"},{"item":"Refer to specialist — MDR-TB regimen includes fluoroquinolone (moxifloxacin) + injectable aminoglycoside (amikacin) + PZA + ethionamide"},{"item":"Treatment duration: 18–24 months under strict DOTS-Plus supervision"}]',
 'critical');

-- ASTHMA steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='asthma'), 1,
 'Diagnosis & Severity Assessment',
 'Confirm reversible airflow obstruction and classify severity.',
 '[{"item":"Spirometry: FEV1/FVC <0.7 with ≥12% (or 200 mL) post-bronchodilator improvement"},{"item":"Peak flow: >20% diurnal variability or >20% improvement after salbutamol"},{"item":"Classify: intermittent / mild persistent / moderate persistent / severe persistent"},{"item":"Identify triggers: dust mites, pollen, pets, cold air, exercise, NSAIDs, stress"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='asthma'), 2,
 'Stepwise Chronic Asthma Management',
 'Start at the step matching current severity; step up if uncontrolled, step down after 3 months stable.',
 '[{"item":"Step 1 — Intermittent: SABA (Salbutamol inhaler 100 mcg) as needed"},{"item":"Step 2 — Mild persistent: Add ICS (Budesonide 200–400 mcg/day or Beclomethasone 200 mcg/day)"},{"item":"Step 3 — Moderate persistent: ICS + LABA (Formoterol+Budesonide) or increase ICS dose"},{"item":"Step 4 — Severe persistent: High-dose ICS + LABA + consider oral prednisolone 40 mg/day for 7 days"},{"item":"Use spacer device with MDI for all patients — improves lung deposition"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='asthma'), 3,
 'Acute Asthma Attack',
 'Assess severity and initiate bronchodilator therapy immediately.',
 '[{"item":"Mild-moderate: Salbutamol 2.5 mg nebulised every 20 min for 3 doses, or 4–8 puffs MDI via spacer"},{"item":"Add Ipratropium 0.5 mg nebulised with salbutamol (first 3 doses) for moderate-severe"},{"item":"Prednisolone 40–50 mg oral or IV Hydrocortisone 200 mg if cannot swallow"},{"item":"Oxygen: maintain SpO2 ≥94%"},{"item":"If no improvement or SpO2 <92%: admit, consider IV Magnesium sulphate 1.2–2 g over 20 min"},{"item":"Life-threatening (silent chest, cyanosis, confusion): ICU, consider ventilatory support"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='asthma'), 4,
 'Patient Education & Trigger Avoidance',
 'Self-management education is integral to asthma control.',
 '[{"item":"Provide written Asthma Action Plan — what to do when symptoms worsen"},{"item":"Inhaler technique: check and correct at every visit"},{"item":"Avoid triggers: dust mite-proof mattress covers, no pets in bedroom, stop smoking"},{"item":"Annual influenza vaccination; pneumococcal vaccine for severe asthma"}]',
 'moderate');

-- EPILEPSY steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='epilepsy'), 1,
 'Diagnosis & Classification',
 'Confirm epilepsy and classify seizure type to guide drug selection.',
 '[{"item":"Detailed history: eyewitness account of episode, duration, postictal phase"},{"item":"EEG: perform within 24–48 hours if possible; can be normal between seizures"},{"item":"MRI brain: preferred over CT for structural lesion detection"},{"item":"Blood tests: glucose, electrolytes, calcium, LFTs, FBC to exclude metabolic causes"},{"item":"Classify: generalised tonic-clonic / absence / myoclonic / focal +/- secondary generalisation"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='epilepsy'), 2,
 'Anti-Epileptic Drug (AED) Selection',
 'Select AED based on seizure type; start low and uptitrate slowly.',
 '[{"item":"Generalised tonic-clonic: Valproic acid first-line (women of childbearing age: discuss teratogenicity); Lamotrigine or Levetiracetam as alternatives"},{"item":"Absence seizures: Valproic acid or Ethosuximide first-line"},{"item":"Focal seizures: Carbamazepine or Oxcarbazepine first-line; Lamotrigine, Levetiracetam as alternatives"},{"item":"Myoclonic / atonic: Valproic acid; avoid Carbamazepine (may worsen)"},{"item":"Start single AED at low dose; titrate every 1–2 weeks to effective dose"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='epilepsy'), 3,
 'Status Epilepticus (Emergency)',
 'Seizure ≥5 minutes or 2 seizures without recovery — medical emergency.',
 '[{"item":"0–5 min: Protect airway, lateral position, oxygen, IV/IO access, check glucose"},{"item":"5–20 min: Lorazepam 0.1 mg/kg IV (max 4 mg) OR Diazepam 10 mg IV; may repeat once"},{"item":"20–40 min: If seizure continues — IV Phenytoin 20 mg/kg at ≤50 mg/min (or Fosphenytoin) OR IV Valproate 25 mg/kg"},{"item":"40+ min: Refractory status — Phenobarbital 15 mg/kg IV OR RSI with midazolam/propofol and ICU admission"},{"item":"Investigate and treat underlying cause: head CT, glucose, electrolytes, toxicology"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='epilepsy'), 4,
 'Long-term Management & Driving',
 'Monitoring for drug efficacy, toxicity, and lifestyle implications.',
 '[{"item":"Review seizure diary at every visit; assess breakthrough triggers"},{"item":"Drug levels: check phenytoin, carbamazepine, valproate if poor control or toxicity suspected"},{"item":"LFTs and FBC annually for valproate and carbamazepine"},{"item":"Counsel on driving (report to licensing authority after first seizure; can drive after 1 seizure-free year)"},{"item":"Contraception: enzyme-inducing AEDs (carbamazepine, phenytoin, phenobarbital) reduce OCP efficacy — advise alternative contraception or lamotrigine/levetiracetam"}]',
 'moderate');

-- PEPTIC ULCER steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='peptic_ulcer'), 1,
 'Diagnosis',
 'Endoscopy is gold standard; H. pylori testing essential for all peptic ulcers.',
 '[{"item":"Upper GI endoscopy (OGD): confirms ulcer, site, size, H. pylori biopsy (CLO test)"},{"item":"H. pylori non-invasive: urea breath test (UBT) or stool antigen test"},{"item":"Stop PPIs 2 weeks and antibiotics 4 weeks before H. pylori testing"},{"item":"Biopsy gastric ulcers to exclude malignancy; repeat OGD at 6–8 weeks to confirm healing"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='peptic_ulcer'), 2,
 'H. pylori Eradication (Triple Therapy — 2 weeks)',
 'Standard triple therapy: PPI + 2 antibiotics for 14 days.',
 '[{"item":"Preferred regimen: Omeprazole 20 mg BD + Amoxicillin 1 g BD + Clarithromycin 500 mg BD × 14 days"},{"item":"Penicillin allergy: replace Amoxicillin with Metronidazole 500 mg BD"},{"item":"Confirm eradication with UBT or stool antigen 4 weeks after completing antibiotics"},{"item":"If eradication fails, use quadruple therapy: Bismuth + Tetracycline + Metronidazole + PPI"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='peptic_ulcer'), 3,
 'Maintenance & Non-H. pylori Ulcer',
 'PPI maintenance for NSAID-induced ulcers and non-H. pylori cases.',
 '[{"item":"Continue PPI (Omeprazole 20 mg OD or Pantoprazole 40 mg OD) for 4–8 weeks after eradication"},{"item":"NSAID-induced ulcer: stop NSAID if possible; substitute paracetamol; add PPI if NSAID must continue"},{"item":"Maintenance PPI indefinitely for patients on long-term aspirin, NSAIDs, or with high recurrence risk"},{"item":"Lifestyle: stop smoking, limit alcohol, eat regular meals, avoid foods that aggravate symptoms"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='peptic_ulcer'), 4,
 'Complications',
 'Upper GI haemorrhage and perforation require emergency management.',
 '[{"item":"GI bleed: IV PPI (Omeprazole 80 mg bolus then 8 mg/hr infusion), urgent endoscopy for haemostasis"},{"item":"Resuscitate with IV fluids; cross-match blood; transfuse if Hb <7 g/dL"},{"item":"Perforation: nil by mouth, IV antibiotics (Ceftriaxone + Metronidazole), urgent surgical referral"},{"item":"Rockford/Blatchford score for triage; high-risk features: spurting vessel, visible vessel, clot"}]',
 'critical');

-- ACUTE DIARRHOEA steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='acute_diarrhoea'), 1,
 'Assessment & Dehydration Grading',
 'Classify dehydration severity to guide rehydration strategy.',
 '[{"item":"No dehydration: alert, normal eyes, drinks normally, normal skin turgor"},{"item":"Some dehydration (5–10% body weight): thirsty, sunken eyes, skin pinch recoil 1–2 sec"},{"item":"Severe dehydration (>10%): lethargic/unconscious, very sunken eyes, skin pinch recoil >2 sec, unable to drink"},{"item":"Signs of shock: cold peripheries, weak rapid pulse, capillary refill >3 sec, hypotension"},{"item":"Blood in stool: suggests invasive bacteria (Shigella, Salmonella, E. histolytica) — antibiotic indicated"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='acute_diarrhoea'), 2,
 'Oral Rehydration Therapy (ORT)',
 'ORS is the cornerstone of management for all dehydration states except shock.',
 '[{"item":"Low-osmolarity ORS (Na 75 mmol/L): preferred over high-osmolarity formulation"},{"item":"Some dehydration: give 75 mL/kg ORS over 4 hours; reassess after"},{"item":"Give ORS in small frequent sips; vomiting is not a contraindication unless persistent"},{"item":"Continue breastfeeding; resume normal diet as soon as tolerated"},{"item":"Home fluids: rice water, coconut water, dal soup — acceptable alongside ORS"},{"item":"Zinc supplementation 20 mg/day (10 mg <6 months) for 10–14 days — reduces duration and severity"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='acute_diarrhoea'), 3,
 'IV Fluid Therapy',
 'For severe dehydration, shock, or failure of ORT.',
 '[{"item":"Shock: rapid IV Ringer''s Lactate or Normal Saline 20 mL/kg over 15–30 min; reassess and repeat"},{"item":"Severe dehydration: 100 mL/kg Ringer''s Lactate over 3–4 hours"},{"item":"Some dehydration that fails ORT: N/2 saline 75 mL/kg over 4 hours"},{"item":"Add KCl 20–40 mEq/L to IV fluids once urine output established"},{"item":"Switch to oral ORS as soon as patient tolerates"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='acute_diarrhoea'), 4,
 'Antibiotic Therapy',
 'Antibiotics indicated only for specific organisms or severe dysentery.',
 '[{"item":"Shigella dysentery: Ciprofloxacin 500 mg BD × 3 days (adult); Azithromycin 10 mg/kg/day × 3 days (child)"},{"item":"Cholera: Doxycycline 300 mg single dose (adult); Azithromycin 20 mg/kg single dose (child)"},{"item":"Giardiasis: Metronidazole 400 mg TDS × 5 days"},{"item":"E. histolytica: Metronidazole 800 mg TDS × 5 days then Diloxanide furoate 500 mg TDS × 10 days"},{"item":"No antibiotics for rotavirus or most E. coli diarrhoea — supportive care only"}]',
 'moderate');

-- ─── Rx Entries (from STG 2013 + GP 3rd Ed) ──────────────────────────────────

-- DENGUE Rx (symptomatic only)
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('dengue', 'Paracetamol', 'Antipyretic/Analgesic', 'Fever and pain control', '500 mg (adult); 10–15 mg/kg (child)', 'Every 6 hours', 'Oral', 'As needed during febrile period', 'Maximum 4 doses/day. AVOID aspirin and NSAIDs — risk of gastritis, acidosis, platelet dysfunction', 1, 'STG 2013'),
('dengue', 'Oral Rehydration Solution (ORS)', 'Fluid replacement', 'Maintain hydration and replace losses', '200 mL after each loose stool', 'As needed', 'Oral', 'Until fever-free and haematocrit stable', 'Coconut water and fruit juice also acceptable. IV fluids only if cannot tolerate orally', 1, 'STG 2013'),
('dengue', 'IV Dextrose-Saline (0.45% NaCl in 5% Dextrose)', 'IV Fluid', 'IV resuscitation in DHF with plasma leakage', '1500–2000 mL/m²/day', 'Continuous infusion', 'IV', '24–72 hours or until haematocrit stable', 'Titrate to urine output 0.5–1 mL/kg/hr. Monitor for fluid overload — crackles, hepatomegaly', 1, 'STG 2013'),
('dengue', 'Ondansetron', 'Antiemetic (5-HT3 antagonist)', 'Persistent vomiting in DHF', '0.15 mg/kg (max 8 mg)', 'Every 8 hours', 'IV or Oral', 'As needed', 'Monitor QT interval. Can use oral wafers if IV not available', 2, 'STG 2013');

-- TYPHOID Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('typhoid', 'Ceftriaxone', 'Third-generation cephalosporin', 'First-line empirical treatment (hospitalised)', '2–4 g', 'Once daily', 'IV or IM', '7–14 days', 'Adjust for renal impairment. Switch to oral when clinically stable and afebrile', 1, 'STG 2013'),
('typhoid', 'Cefixime', 'Third-generation cephalosporin', 'Oral step-down or outpatient treatment', '400 mg', 'Twice daily', 'Oral', '14 days', 'Use when clinically stable on IV ceftriaxone. Suitable for fully susceptible and MDR strains', 1, 'STG 2013'),
('typhoid', 'Ciprofloxacin', 'Fluoroquinolone', 'Fully susceptible typhoid (first-line oral)', '500 mg', 'Twice daily', 'Oral or IV', '5–7 days', 'Do not use if nalidixic acid–resistant — inadequate response likely. Avoid in children if possible', 1, 'STG 2013'),
('typhoid', 'Azithromycin', 'Macrolide antibiotic', 'Multidrug-resistant (MDR) typhoid', '1 g', 'Once daily', 'Oral', '5 days', 'Preferred for MDR and nalidixic acid–resistant strains in children and pregnancy', 2, 'STG 2013'),
('typhoid', 'Paracetamol', 'Antipyretic/Analgesic', 'Fever management', '500–1000 mg', 'Every 6–8 hours', 'Oral', 'As needed', 'Avoid NSAIDs — risk of GI bleeding. Tepid sponging for high fever', 1, 'STG 2013'),
('typhoid', 'Omeprazole', 'Proton Pump Inhibitor', 'GI protection (if steroids used or bleeding risk)', '20–40 mg', 'Once daily', 'Oral', '14 days', 'Use with dexamethasone in severe typhoid with toxicity', 2, 'STG 2013');

-- MALARIA Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('malaria', 'Artesunate + Sulfadoxine-Pyrimethamine (ACT-SP)', 'Artemisinin combination therapy', 'P. falciparum malaria (first-line)', 'Artesunate 4 mg/kg/day + SP (25/1.25 mg/kg) on day 1', 'Daily (artesunate); single dose (SP)', 'Oral', 'Artesunate 3 days; SP single dose', 'ACT is first-line for uncomplicated P. falciparum in Bangladesh/India. Confirm species before prescribing', 1, 'STG 2013'),
('malaria', 'Primaquine (P. falciparum)', 'Antiprotozoal', 'Gametocyte clearance in P. falciparum', '0.75 mg/kg', 'Single dose on day 2', 'Oral', 'Single dose', 'Contraindicated in G6PD deficiency, pregnancy, infants. Test G6PD before use', 1, 'STG 2013'),
('malaria', 'Chloroquine', 'Aminoquinoline antimalarial', 'P. vivax malaria', '10 mg/kg day 1; 10 mg/kg day 2; 5 mg/kg day 3', 'Daily', 'Oral', '3 days', 'Effective for vivax; check local chloroquine resistance patterns', 1, 'STG 2013'),
('malaria', 'Primaquine (P. vivax)', 'Antiprotozoal (hypnozoitocidal)', 'Radical cure — prevents P. vivax relapse', '0.25 mg/kg/day', 'Once daily', 'Oral', '14 days', 'Essential to prevent relapse from liver hypnozoites. CONTRAINDICATED in pregnancy and G6PD deficiency. Screen G6PD first', 1, 'STG 2013'),
('malaria', 'IV Artesunate', 'Artemisinin derivative', 'Severe/complicated P. falciparum malaria', '2.4 mg/kg IV at 0, 12, 24 hrs then daily', 'As per protocol', 'IV', 'Until oral tolerated', 'Preferred over IV quinine for severe malaria — lower mortality. Admit to ICU; monitor blood glucose', 1, 'STG 2013'),
('malaria', 'Paracetamol', 'Antipyretic', 'Fever management', '10–15 mg/kg', 'Every 6 hours', 'Oral', 'As needed', 'Avoid aspirin — dengue co-infection risk. Cold sponging for temperature >38.5°C', 1, 'STG 2013');

-- PNEUMONIA Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('pneumonia', 'Amoxicillin', 'Aminopenicillin', 'Non-severe CAP (outpatient)', '500–1000 mg (adult); 20–40 mg/kg/day (child)', 'Three times daily', 'Oral', '7–10 days', 'First-line for outpatient CAP. Cover S. pneumoniae and H. influenzae. Reassess at 48–72 hours', 1, 'STG 2013'),
('pneumonia', 'Co-amoxiclav (Amoxicillin-Clavulanate)', 'Beta-lactam/beta-lactamase inhibitor', 'Moderate CAP or aspiration risk', '625 mg (500+125 mg)', 'Three times daily', 'Oral', '7–10 days', 'Add if atypical pathogens suspected or community Amoxicillin-resistant H. influenzae', 1, 'STG 2013'),
('pneumonia', 'Azithromycin', 'Macrolide antibiotic', 'Atypical CAP or penicillin allergy', '500 mg day 1 then 250 mg', 'Once daily', 'Oral', '5 days', 'Covers Mycoplasma, Chlamydophila, Legionella. Useful in mild-moderate CAP in young adults', 2, 'STG 2013'),
('pneumonia', 'Ceftriaxone', 'Third-generation cephalosporin', 'Severe CAP requiring hospitalisation', '2 g', 'Once daily', 'IV', '7–14 days', 'Combine with Azithromycin or Doxycycline for atypical coverage in hospitalised patients. Switch to oral when afebrile 48 hrs', 1, 'STG 2013'),
('pneumonia', 'Ampicillin + Gentamicin', 'Penicillin + aminoglycoside', 'Severe pneumonia in children <5 years', 'Ampicillin 100 mg/kg/day + Gentamicin 5–7.5 mg/kg/day', 'Divided doses', 'IV', '7–10 days', 'Standard WHO protocol for severe paediatric pneumonia. Monitor renal function and hearing with gentamicin', 1, 'STG 2013');

-- ANAEMIA Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('anaemia', 'Ferrous Sulfate', 'Iron supplement', 'Iron deficiency anaemia — first-line', '200 mg', 'Three times daily', 'Oral', 'Until Hb normal, then 1 tablet daily for ≥3 months', 'Take on empty stomach or with vitamin C for better absorption. Warn about dark stools and constipation. Rise in Hb expected ~1 g/dL/week', 1, 'STG 2013'),
('anaemia', 'Ferrous Fumarate', 'Iron supplement', 'IDA — if ferrous sulfate not tolerated', '200–300 mg', 'Twice or three times daily', 'Oral', 'Until Hb normal + 3 months maintenance', 'Better tolerated GI profile than sulfate for some patients. Equivalent iron content to ferrous sulfate', 2, 'STG 2013'),
('anaemia', 'Folic Acid', 'Water-soluble vitamin (B9)', 'Folic acid deficiency anaemia', '5 mg', 'Once daily', 'Oral', 'Until megaloblastic anaemia resolved (4 months)', 'Adequate even in malabsorption at this dose. Also use in pregnancy, haemolytic anaemia, and pre-conceptually to prevent neural tube defects', 1, 'STG 2013'),
('anaemia', 'IV Iron (Iron Sucrose or Iron Dextran)', 'Parenteral iron', 'IDA when oral iron fails or not tolerated', '100–200 mg in 100 mL NS', 'Infusion over 30 min, 2–3× weekly', 'IV', 'Until calculated iron deficit corrected', 'Indications: malabsorption, intolerance, late pregnancy, ongoing blood loss exceeding oral absorption. Anaphylaxis risk — test dose required for iron dextran, resuscitation equipment at hand', 2, 'STG 2013'),
('anaemia', 'Vitamin B12 (Hydroxocobalamin)', 'Water-soluble vitamin (B12)', 'Vitamin B12 deficiency (pernicious anaemia)', '1000 mcg IM', 'Daily for 7 days, then weekly × 4, then monthly', 'IM', 'Lifelong if pernicious anaemia', 'Do not give folic acid alone in B12 deficiency — can precipitate subacute combined degeneration. Neurological improvement may lag behind haematological response by weeks', 1, 'STG 2013');

-- UTI Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('uti', 'Ciprofloxacin', 'Fluoroquinolone', 'Uncomplicated UTI (cystitis) in adults', '500 mg', 'Twice daily', 'Oral', '5 days', 'First-line in adults. Check local resistance patterns — avoid if >20% E. coli resistance. Not first-line in children', 1, 'STG 2013'),
('uti', 'Co-trimoxazole (Trimethoprim-Sulfamethoxazole)', 'Folate synthesis inhibitor', 'Uncomplicated UTI — if susceptible', '960 mg (double strength)', 'Twice daily', 'Oral', '3–5 days', 'Check susceptibility — high resistance in many regions. Not recommended in first trimester pregnancy', 2, 'STG 2013'),
('uti', 'Cefixime', 'Third-generation cephalosporin', 'Uncomplicated UTI or oral step-down', '200 mg', 'Twice daily', 'Oral', '7–10 days', 'Preferred oral agent for children (8–10 mg/kg/day). Use for community Gram-negative UTI when fluoroquinolone resistance suspected', 1, 'STG 2013'),
('uti', 'Ceftriaxone', 'Third-generation cephalosporin', 'Complicated UTI, pyelonephritis (hospitalised)', '1–2 g', 'Once daily', 'IV', '10–14 days', 'Switch to oral agent once afebrile 48–72 hrs and culture sensitivity available. Ensure adequate hydration', 1, 'STG 2013'),
('uti', 'Paracetamol', 'Antipyretic/Analgesic', 'Fever and dysuria relief', '500–1000 mg', 'Every 6–8 hours', 'Oral', 'As needed', 'Increase oral fluid intake — aim 2–3 L/day. Avoid NSAIDs if renal impairment', 1, 'STG 2013');

-- HYPERTENSION Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('hypertension', 'Amlodipine', 'Calcium channel blocker (CCB)', 'First-line monotherapy for Stage 1–2 HTN', '5 mg; uptitrate to 10 mg after 4 weeks', 'Once daily', 'Oral', 'Lifelong', 'Well tolerated. May cause ankle oedema. Good choice for elderly, isolated systolic HTN, angina. Safe in asthma', 1, 'STG 2013 / GP 3rd Ed'),
('hypertension', 'Enalapril', 'ACE inhibitor', 'First-line: HTN with diabetes, CKD, or heart failure', '5 mg; uptitrate to 20–40 mg', 'Once or twice daily', 'Oral', 'Lifelong', 'Preferred in diabetic nephropathy, proteinuria, systolic heart failure. Monitor K+ and creatinine 1–2 weeks after starting. Contraindicated in bilateral renal artery stenosis and pregnancy', 1, 'STG 2013 / GP 3rd Ed'),
('hypertension', 'Hydrochlorothiazide', 'Thiazide diuretic', 'First-line or combination therapy', '12.5–25 mg', 'Once daily (morning)', 'Oral', 'Lifelong', 'Monitor electrolytes (hypokalaemia, hyponatraemia). May worsen gout and glucose tolerance. Effective in combination with ACE inhibitor or CCB', 1, 'STG 2013'),
('hypertension', 'Atenolol', 'Beta-1 selective blocker', 'HTN with angina, tachyarrhythmia, post-MI', '25–100 mg', 'Once daily', 'Oral', 'Lifelong', 'Avoid in asthma, COPD (use with caution), peripheral arterial disease. Can cause fatigue, cold extremities, erectile dysfunction. Do not stop abruptly — risk of rebound HTN/angina', 2, 'STG 2013 / GP 3rd Ed'),
('hypertension', 'Losartan', 'Angiotensin receptor blocker (ARB)', 'ACE inhibitor-intolerant patients (e.g., cough)', '50 mg; uptitrate to 100 mg', 'Once daily', 'Oral', 'Lifelong', 'Similar renal and cardiac protection to ACE inhibitors without cough side effect. Contraindicated in pregnancy. Monitor K+ and renal function', 2, 'GP 3rd Ed');

-- DIABETES T2 Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('diabetes_t2', 'Metformin', 'Biguanide', 'First-line T2DM (all patients, if tolerated)', '500 mg with meals; titrate to 1–2 g', 'Twice daily', 'Oral', 'Lifelong', 'Take with food to reduce GI side effects. Contraindicated in eGFR <30, severe heart failure, IV contrast within 48 hrs. Cardioprotective; reduces HbA1c by ~1.5%', 1, 'STG 2013'),
('diabetes_t2', 'Glibenclamide', 'Sulfonylurea', 'Add-on to metformin if HbA1c >7%', '2.5–5 mg', 'Once daily before breakfast', 'Oral', 'Lifelong', 'Risk of hypoglycaemia — educate patient. Use with caution in elderly and renal impairment. Reduces HbA1c by ~1.5%', 1, 'STG 2013'),
('diabetes_t2', 'Gliclazide MR', 'Sulfonylurea (modified release)', 'Preferred sulfonylurea (lower hypoglycaemia risk)', '30–120 mg', 'Once daily with breakfast', 'Oral', 'Lifelong', 'Lower hypoglycaemia risk than glibenclamide. Better tolerated in mild-moderate CKD (eGFR >30). Check HbA1c 3-monthly until target', 1, 'GP 3rd Ed'),
('diabetes_t2', 'Human Isophane Insulin (NPH)', 'Intermediate-acting insulin', 'Insulin initiation for poorly controlled T2DM', '0.2 units/kg at bedtime; uptitrate by 2 units every 3 days to fasting glucose 4–7 mmol/L', 'Once daily (bedtime)', 'SC injection', 'Lifelong (if required)', 'Rotate injection sites. Teach self-injection technique. Store opened vial at room temperature (≤28 days); spare vials in fridge. Monitor blood glucose daily. Provide glucagon for family if hypoglycaemia risk high', 2, 'STG 2013'),
('diabetes_t2', 'Atorvastatin', 'HMG-CoA reductase inhibitor (statin)', 'Cardiovascular risk reduction in T2DM ≥40 years', '20–40 mg', 'Once daily (evening)', 'Oral', 'Lifelong', 'Target LDL <2.6 mmol/L (or <1.8 if established CVD). Check LFTs at baseline; repeat if symptoms of myopathy. Do not use in pregnancy', 2, 'GP 3rd Ed');

-- TUBERCULOSIS Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('tuberculosis', 'Isoniazid (H)', 'Isonicotinic acid hydrazide (first-line anti-TB)', 'TB treatment — all new cases', '5 mg/kg/day (max 300 mg)', 'Once daily', 'Oral', '6 months (intensive 2 months + continuation 4 months)', 'Give with Pyridoxine 25–50 mg/day to prevent peripheral neuropathy. Monitor LFTs monthly if baseline abnormal. Hepatotoxic — stop if transaminases >5× ULN', 1, 'STG 2013 / RNTCP'),
('tuberculosis', 'Rifampicin (R)', 'Rifamycin (first-line anti-TB)', 'TB treatment — all new cases', '10 mg/kg/day (max 600 mg)', 'Once daily on empty stomach', 'Oral', '6 months', 'Turns urine/sweat/tears orange-red — warn patient. Potent enzyme inducer — reduces effectiveness of OCP, anticoagulants. Hepatotoxic — check LFTs', 1, 'STG 2013 / RNTCP'),
('tuberculosis', 'Pyrazinamide (Z)', 'Pyrazine derivative (first-line anti-TB)', 'TB treatment — intensive phase only', '25 mg/kg/day (max 2 g)', 'Once daily', 'Oral', '2 months (intensive phase only)', 'Causes hyperuricaemia (common) and arthralgia. Hepatotoxic. Avoid in severe gout or hepatic failure', 1, 'STG 2013 / RNTCP'),
('tuberculosis', 'Ethambutol (E)', 'First-line anti-TB', 'TB treatment — intensive phase (new cases)', '15–25 mg/kg/day (max 1.6 g)', 'Once daily', 'Oral', '2 months (intensive phase)', 'Monitor visual acuity and colour vision monthly — optic neuritis is dose- and duration-dependent. Avoid or reduce dose in renal impairment (eGFR <30)', 1, 'STG 2013 / RNTCP'),
('tuberculosis', 'Pyridoxine (Vitamin B6)', 'Water-soluble vitamin', 'Neuropathy prevention during TB treatment', '25–50 mg', 'Once daily', 'Oral', 'Throughout TB treatment', 'Give to all patients on isoniazid who are: malnourished, HIV+, diabetic, alcoholic, pregnant, or at risk of neuropathy', 1, 'STG 2013');

-- ASTHMA Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('asthma', 'Salbutamol (Albuterol) Inhaler', 'Short-acting beta-2 agonist (SABA)', 'Reliever — acute symptoms and exercise prophylaxis', '100–200 mcg (1–2 puffs)', 'As needed; max 4× daily (every 4–6 hrs)', 'Inhaled (MDI)', 'As needed', 'Use spacer device for better lung delivery. If needed >2×/week, add preventer ICS. Nebulise 2.5 mg in acute attacks. Tremor and tachycardia are common side effects', 1, 'STG 2013'),
('asthma', 'Budesonide Inhaler', 'Inhaled corticosteroid (ICS)', 'Preventer — mild to moderate persistent asthma', '200–400 mcg/day (mild); 800–1600 mcg/day (moderate)', 'Twice daily', 'Inhaled (MDI/DPI)', 'Continuous (review every 3 months)', 'Rinse mouth after use — prevents oral thrush. Use spacer for MDI. Reduces airway inflammation; does not relieve acute attacks. Allow 4–6 weeks for full effect', 1, 'STG 2013'),
('asthma', 'Formoterol + Budesonide (LABA/ICS combination)', 'Long-acting beta-2 agonist + ICS combination', 'Moderate–severe asthma inadequately controlled on ICS alone', '6/100 mcg or 12/400 mcg', 'Twice daily', 'Inhaled (DPI/MDI)', 'Continuous', 'Never use LABA without ICS — risk of fatal exacerbation. Reassess control after 3 months; step down if well controlled', 2, 'STG 2013'),
('asthma', 'Prednisolone', 'Oral corticosteroid', 'Acute moderate-severe exacerbation', '40–50 mg (adult); 1–2 mg/kg (child, max 40 mg)', 'Once daily in the morning', 'Oral', '5–7 days', 'No need to taper if course <14 days. Relieves inflammation in 4–6 hours. Prolonged use causes adrenal suppression, osteoporosis, diabetes — use lowest effective dose', 1, 'STG 2013'),
('asthma', 'Ipratropium Bromide Inhaler', 'Short-acting anticholinergic (SAMA)', 'Add-on in acute moderate-severe asthma', '0.5 mg nebulised or 40–80 mcg MDI', 'Every 20 min for first hour, then every 4 hrs', 'Inhaled', 'Acute attack only', 'Useful addition to SABA in A&E. Not for regular long-term use as sole agent. Combine with salbutamol in nebuliser', 2, 'STG 2013');

-- EPILEPSY Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('epilepsy', 'Sodium Valproate', 'Anti-epileptic (broad-spectrum)', 'Generalised epilepsy (GTC, absence, myoclonic)', '200–500 mg; titrate to 20–30 mg/kg/day', 'Twice or three times daily', 'Oral', 'Lifelong (until 2-year seizure-free then specialist review)', 'TERATOGENIC — high risk of neural tube defects and autism spectrum disorder. Use only if no alternatives in women of childbearing age; mandatory contraception and annual review. Monitor LFTs, FBC, ammonia', 1, 'STG 2013'),
('epilepsy', 'Carbamazepine', 'Anti-epileptic (sodium channel blocker)', 'Focal seizures; GTC in adults', '100–200 mg; titrate to 800–1200 mg/day', 'Twice or three times daily', 'Oral', 'Lifelong', 'Enzyme inducer — reduces efficacy of OCP, other AEDs. Monitor FBC for aplastic anaemia (rare). HLA-B*1502 testing before use in South/East Asian patients (Stevens-Johnson risk). Do not stop abruptly', 1, 'STG 2013 / GP 3rd Ed'),
('epilepsy', 'Lamotrigine', 'Anti-epileptic (sodium channel blocker)', 'Focal seizures; GTC; add-on; preferred in women', 'Start 25 mg/day; titrate slowly to 100–400 mg/day', 'Twice daily', 'Oral', 'Lifelong', 'Titrate VERY slowly — rapid titration causes Stevens-Johnson syndrome. Effective for multiple seizure types. Preferred in women of childbearing age over valproate. Half-dose if added to valproate', 1, 'STG 2013'),
('epilepsy', 'Levetiracetam', 'Anti-epileptic (SV2A modulator)', 'Focal and generalised seizures — add-on or monotherapy', '500 mg; titrate to 1000–3000 mg/day', 'Twice daily', 'Oral or IV', 'Lifelong', 'Good safety profile; no significant drug interactions; safe in pregnancy compared to valproate. Main side effect: irritability, behavioural changes. Available as IV for acute use', 2, 'GP 3rd Ed'),
('epilepsy', 'Phenytoin', 'Anti-epileptic (sodium channel blocker)', 'Status epilepticus IV; focal and GTC (oral)', 'IV: 20 mg/kg at ≤50 mg/min; Oral: 200–400 mg/day', 'Oral: once or twice daily', 'IV (acute) or Oral', 'Lifelong (if oral)', 'Narrow therapeutic index — monitor levels (target 10–20 mcg/mL). Non-linear kinetics. Causes gingival hypertrophy, hirsutism, peripheral neuropathy with chronic use. IV administration: cardiac monitoring required (risk of arrhythmia)', 2, 'STG 2013'),
('epilepsy', 'Diazepam', 'Benzodiazepine (GABA-A agonist)', 'Acute seizures / status epilepticus (first-line)', '10 mg IV; 5–10 mg rectal (child 0.5 mg/kg)', 'May repeat once after 5 min', 'IV or Rectal', 'Acute use only', 'Respiratory depression risk — have resuscitation equipment available. Tolerance develops rapidly — not for regular oral use. Rectal solution useful for home management of prolonged seizures in children', 1, 'STG 2013');

-- PEPTIC ULCER Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('peptic_ulcer', 'Omeprazole', 'Proton pump inhibitor (PPI)', 'Acid suppression and ulcer healing', '20 mg (uncomplicated); 40 mg (complicated)', 'Once daily before breakfast', 'Oral', '4–8 weeks (healing); long-term maintenance if recurrent', 'Take 30–60 min before first meal. Reduces acid by ~90%. Continue for duration of triple therapy then additional 4–8 weeks. Long-term use: risk of hypomagnesaemia, C. difficile, hip fracture', 1, 'STG 2013'),
('peptic_ulcer', 'Amoxicillin', 'Aminopenicillin', 'H. pylori eradication (triple therapy)', '1 g', 'Twice daily', 'Oral', '14 days', 'Part of PPI + Amoxicillin + Clarithromycin triple therapy. If penicillin allergy, substitute Metronidazole 500 mg BD. Confirm eradication 4 weeks after course with UBT or stool antigen', 1, 'STG 2013'),
('peptic_ulcer', 'Clarithromycin', 'Macrolide antibiotic', 'H. pylori eradication (triple therapy)', '500 mg', 'Twice daily', 'Oral', '14 days', 'Part of PPI + Amoxicillin + Clarithromycin triple therapy. Local clarithromycin resistance rates >15–20% reduce efficacy — consider bismuth quadruple therapy in areas of high resistance', 1, 'STG 2013'),
('peptic_ulcer', 'Metronidazole', 'Nitroimidazole', 'H. pylori eradication (penicillin allergy regimen)', '500 mg', 'Twice daily', 'Oral', '14 days', 'Substitute for amoxicillin in penicillin-allergic patients in PPI triple therapy. High resistance rates if previously used. Avoid alcohol during and 48 hrs after course (disulfiram reaction)', 2, 'STG 2013'),
('peptic_ulcer', 'Pantoprazole IV', 'IV Proton pump inhibitor', 'Acute upper GI haemorrhage (ulcer bleeding)', '80 mg IV bolus then 8 mg/hr', 'Continuous infusion for 72 hrs after endoscopic haemostasis', 'IV', '72 hours', 'Reduces re-bleeding and mortality after endoscopic treatment of bleeding ulcer. Start as soon as possible. Switch to oral PPI after 72 hrs', 1, 'STG 2013');

-- ACUTE DIARRHOEA Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('acute_diarrhoea', 'Oral Rehydration Solution (ORS)', 'Electrolyte/fluid replacement', 'First-line treatment for all dehydrating diarrhoea', '75 mL/kg over 4 hours (some dehydration)', 'Sip frequently; 10 mL/kg after each loose stool', 'Oral', 'Until diarrhoea stops', 'Low-osmolarity ORS preferred (Na 75 mmol/L). Not a contraindication if vomiting — give small frequent sips. Continue breast feeding. Resume normal diet as soon as tolerated', 1, 'STG 2013 / WHO'),
('acute_diarrhoea', 'Zinc', 'Micronutrient supplement', 'Reduce duration and severity of diarrhoea', '20 mg (>6 months); 10 mg (<6 months)', 'Once daily', 'Oral', '10–14 days', 'Recommended by WHO/UNICEF for all children with diarrhoea. Reduces recurrence over next 3 months. Dispersible zinc tablet dissolved in breast milk or ORS', 1, 'STG 2013 / WHO'),
('acute_diarrhoea', 'Ciprofloxacin', 'Fluoroquinolone antibiotic', 'Bacterial dysentery (Shigella) in adults', '500 mg', 'Twice daily', 'Oral', '3 days', 'Empirical therapy for bloody diarrhoea (dysentery) in adults. Culture and sensitivity if no improvement at 48 hours. Avoid in children <18 years as first-line', 1, 'STG 2013'),
('acute_diarrhoea', 'Azithromycin', 'Macrolide antibiotic', 'Bacterial dysentery in children and cholera', '10–20 mg/kg/day (child); 1 g single dose (cholera)', 'Once daily', 'Oral', '3 days (dysentery); single dose (cholera)', 'Preferred in children with dysentery (safer than fluoroquinolones). Single dose effective for cholera in adults and children. Check local resistance patterns', 1, 'STG 2013'),
('acute_diarrhoea', 'Metronidazole', 'Nitroimidazole antiprotozoal', 'Giardiasis and amoebiasis', 'Giardia: 400 mg TDS × 5 days; Amoeba: 800 mg TDS × 5 days', 'Three times daily', 'Oral', '5 days', 'Amoebic dysentery: follow with Diloxanide furoate 500 mg TDS × 10 days (luminal agent). Avoid alcohol during and 48 hrs after. Metallic taste, nausea common', 1, 'STG 2013'),
('acute_diarrhoea', 'Doxycycline', 'Tetracycline antibiotic', 'Cholera in adults (second-line after azithromycin)', '300 mg single dose', 'Single dose', 'Oral', 'Single dose', 'Reduces cholera stool volume and duration. Contraindicated in children <8 years and pregnancy. ORS remains the cornerstone — antibiotics are adjunctive', 2, 'STG 2013'),
('acute_diarrhoea', 'Ringer''s Lactate IV', 'Crystalloid IV fluid', 'Severe dehydration / circulatory shock', '20 mL/kg rapid bolus; then 100 mL/kg over 3–4 hrs', 'Rapid infusion for shock; slower for severe dehydration', 'IV', 'Until oral tolerated', 'Preferred isotonic fluid. Add KCl once urine output established. Switch to oral ORS as soon as patient can drink', 1, 'STG 2013');

COMMIT;
