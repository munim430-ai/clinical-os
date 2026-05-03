-- Chunk 1: New systems + Cardiology, Neurology, Endocrine conditions
BEGIN TRANSACTION;

-- New systems
INSERT OR IGNORE INTO systems (id, name, icon, color, order_index) VALUES
('psychiatry',    'Psychiatry',        'Brain',        '#AA44FF', 11),
('ent',           'ENT',               'Ear',          '#44DDAA', 12),
('dermatology',   'Dermatology',       'Layers',       '#FF8844', 13),
('emergency',     'Emergency',         'Zap',          '#FF2244', 14),
('orthopaedics',  'Orthopaedics',      'Bone',         '#AABB44', 15),
('ophthalmology', 'Ophthalmology',     'Eye',          '#44BBFF', 16);

-- ─── CONDITIONS ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview) VALUES
('angina',        'Angina Pectoris',          'cardiology',  'I20', 'Chest pain due to myocardial ischaemia from critical coronary artery obstruction. Characterised by precordial pain on exertion or emotional stress, relieved by rest and sublingual nitrates. ECG shows ST depression and T-wave inversion. Requires risk factor modification and anti-anginal therapy.'),
('af',            'Atrial Fibrillation',       'cardiology',  'I48', 'Most common sustained cardiac arrhythmia. Characterised by irregularly irregular pulse, palpitations and breathlessness. Risk of thromboembolism and stroke. Rate control is the primary goal; anticoagulation required if CHA2DS2-VASc ≥2.'),
('heart_failure', 'Congestive Heart Failure',  'cardiology',  'I50', 'State in which the heart cannot deliver adequate cardiac output to meet metabolic needs. Presents with exertional dyspnoea, orthopnoea, PND, ankle oedema and raised JVP. Treatment: diuretics, ACE inhibitor, beta-blocker, and aldosterone antagonist.'),
('rheumatic_fever','Acute Rheumatic Fever',   'cardiology',  'I00', 'Autoimmune reaction following Group A streptococcal pharyngitis. Major criteria: carditis, polyarthritis, chorea, erythema marginatum, subcutaneous nodules. Requires penicillin therapy and long-term secondary prophylaxis to prevent recurrent rheumatic heart disease.'),
('migraine',      'Migraine',                  'neurology',   'G43', 'Recurrent episodic headache lasting 4–72 hours. Unilateral, throbbing, moderate-to-severe intensity, worsened by activity, with nausea/vomiting and/or photophobia/phonophobia. Triggered by sleep deprivation, certain foods, hormonal changes, stress.'),
('tension_ha',    'Tension-Type Headache',     'neurology',   'G44', 'Most common headache type. Bilateral, pressing/tightening quality, mild-to-moderate severity, not worsened by routine activity. Episodic or chronic (≥15 days/month). Managed with simple analgesics for acute and amitriptyline for chronic prevention.'),
('meningitis',    'Bacterial Meningitis',      'neurology',   'G00', 'Acute purulent infection of the meninges. Presents with fever, severe headache, neck stiffness, photophobia, and altered consciousness. Most common organisms: S. pneumoniae, N. meningitidis, H. influenzae. Medical emergency requiring immediate antibiotics and dexamethasone.'),
('hypothyroidism','Hypothyroidism',            'endocrine',   'E03', 'Deficiency of thyroid hormone. Primary causes: autoimmune (Hashimoto''s), post-radioiodine, post-thyroidectomy. Presents with fatigue, cold intolerance, weight gain, constipation, bradycardia, dry skin, and myxoedema. Diagnosis: elevated TSH, low free T4. Treatment: lifelong levothyroxine.'),
('hyperthyroidism','Hyperthyroidism',          'endocrine',   'E05', 'Excess thyroid hormone production. Most common cause: Graves disease. Presents with heat intolerance, weight loss, palpitations, tremor, exophthalmos, goitre. Diagnosis: suppressed TSH, elevated free T3/T4. Treatment: antithyroid drugs, radioiodine, or surgery.'),
('anaphylaxis',   'Anaphylaxis',               'emergency',   'T78.2','Severe, life-threatening systemic hypersensitivity reaction. Triggered by drugs, food, insect stings, latex. Presents with urticaria, angioedema, bronchospasm, hypotension within minutes. Adrenaline IM is first-line; delay in treatment is fatal.');

-- ─── SYMPTOMS ────────────────────────────────────────────────────────────────

-- Angina
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('angina','Precordial chest pain or pressure on exertion or emotional stress',0),
('angina','Pain radiates to left arm, jaw, or neck',0),
('angina','Relieved within 5 minutes by rest or sublingual nitrate',0),
('angina','Associated dyspnoea, diaphoresis, or nausea',0),
('angina','ECG: ST depression, T-wave inversion during attack',0),
('angina','Rest pain or pain at minimal exertion (unstable angina)',1),
('angina','Pain not relieved by 3 doses of sublingual nitrate — possible MI',1),
('angina','New onset or rapidly worsening angina pattern',1);

-- AF
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('af','Palpitations — irregularly irregular',0),
('af','Breathlessness and reduced exercise tolerance',0),
('af','Fatigue and light-headedness',0),
('af','Pulse deficit (apex rate > radial rate)',0),
('af','Haemodynamically unstable: hypotension, acute heart failure, chest pain',1),
('af','Sudden neurological deficit (AF-related stroke/TIA)',1);

-- Heart Failure
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('heart_failure','Exertional dyspnoea and reduced exercise tolerance',0),
('heart_failure','Orthopnoea — needs extra pillows to sleep',0),
('heart_failure','Paroxysmal nocturnal dyspnoea',0),
('heart_failure','Bilateral ankle and leg oedema',0),
('heart_failure','Raised JVP, S3 gallop, bibasal crackles',0),
('heart_failure','Hepatomegaly and ascites',0),
('heart_failure','Acute pulmonary oedema: severe dyspnoea, pink frothy sputum, SpO2 <90%',1),
('heart_failure','Cardiogenic shock: hypotension, cold clammy extremities, oliguria',1);

-- Rheumatic Fever
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('rheumatic_fever','Fever and migratory polyarthritis 1–5 weeks after streptococcal sore throat',0),
('rheumatic_fever','Carditis: new murmur, cardiomegaly, pericardial rub',0),
('rheumatic_fever','Erythema marginatum: pink rings on trunk',0),
('rheumatic_fever','Subcutaneous nodules over bony prominences',0),
('rheumatic_fever','Sydenham''s chorea: involuntary writhing movements (late sign)',0),
('rheumatic_fever','Severe carditis with heart failure or haemodynamic compromise',1);

-- Migraine
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('migraine','Unilateral throbbing headache lasting 4–72 hours',0),
('migraine','Nausea and/or vomiting',0),
('migraine','Photophobia and phonophobia',0),
('migraine','Worsened by routine physical activity',0),
('migraine','Aura: visual zigzags, blind spots, or sensory disturbance (20% of cases)',0),
('migraine','Status migrainosus: migraine lasting >72 hours',1),
('migraine','Thunderclap headache — sudden maximum intensity (rule out SAH)',1),
('migraine','New neurological deficit or papilloedema',1);

-- Tension Headache
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('tension_ha','Bilateral pressing or tightening band-like headache',0),
('tension_ha','Mild to moderate intensity, not worsened by activity',0),
('tension_ha','No nausea/vomiting (or only mild nausea)',0),
('tension_ha','Frequent occurrence (episodic or chronic ≥15 days/month)',0),
('tension_ha','Sudden severe headache unlike previous episodes',1),
('tension_ha','Associated fever, neck stiffness, or focal neurological signs',1);

-- Meningitis
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('meningitis','Fever, severe headache, and neck stiffness (classic triad)',0),
('meningitis','Photophobia and phonophobia',0),
('meningitis','Kernig''s sign and Brudzinski''s sign positive',0),
('meningitis','Nausea and vomiting',0),
('meningitis','Non-blanching petechial or purpuric rash (meningococcal)',1),
('meningitis','Altered consciousness or coma (GCS <14)',1),
('meningitis','Seizures',1),
('meningitis','Signs of raised intracranial pressure: papilloedema, Cushing''s triad',1);

-- Hypothyroidism
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('hypothyroidism','Fatigue, lethargy, and weakness',0),
('hypothyroidism','Cold intolerance',0),
('hypothyroidism','Weight gain with poor appetite',0),
('hypothyroidism','Constipation',0),
('hypothyroidism','Dry, coarse skin and hair loss',0),
('hypothyroidism','Bradycardia and delayed relaxation of reflexes',0),
('hypothyroidism','Periorbital puffiness and myxoedema',0),
('hypothyroidism','Myxoedema coma: hypothermia, bradycardia, hypotension, coma',1);

-- Hyperthyroidism
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('hyperthyroidism','Heat intolerance and excessive sweating',0),
('hyperthyroidism','Palpitations and tachycardia',0),
('hyperthyroidism','Weight loss despite increased appetite',0),
('hyperthyroidism','Tremor, irritability, anxiety',0),
('hyperthyroidism','Exophthalmos and lid lag (Graves disease)',0),
('hyperthyroidism','Diffuse goitre with bruit',0),
('hyperthyroidism','Thyroid storm: hyperpyrexia, tachyarrhythmia, agitation, shock',1);

-- Anaphylaxis
INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
('anaphylaxis','Urticaria, flushing, itching within minutes of exposure',0),
('anaphylaxis','Angioedema: lip, tongue, throat swelling',0),
('anaphylaxis','Bronchospasm: wheeze, stridor, dyspnoea',0),
('anaphylaxis','Hypotension and tachycardia',0),
('anaphylaxis','Nausea, vomiting, abdominal cramps',0),
('anaphylaxis','Loss of consciousness, respiratory arrest, cardiac arrest',1),
('anaphylaxis','Stridor with impending airway obstruction',1);

-- ─── PROTOCOLS ───────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('angina',         'Management of Angina Pectoris',           'STG 2013 / GP 3rd Ed', '2013', 2013),
('af',             'Management of Atrial Fibrillation',        'STG 2013 / GP 3rd Ed', '2013', 2013),
('heart_failure',  'Management of Congestive Heart Failure',   'STG 2013',             '2013', 2013),
('rheumatic_fever','Management of Acute Rheumatic Fever',     'STG 2013',             '2013', 2013),
('migraine',       'Management of Migraine',                   'STG 2013 / GP 3rd Ed', '2013', 2013),
('tension_ha',     'Management of Tension-Type Headache',      'STG 2013',             '2013', 2013),
('meningitis',     'Management of Bacterial Meningitis',       'STG 2013',             '2013', 2013),
('hypothyroidism', 'Levothyroxine Replacement Therapy',        'STG 2013',             '2013', 2013),
('hyperthyroidism','Anti-Thyroid Drug Therapy',                'STG 2013',             '2013', 2013),
('anaphylaxis',    'Emergency Management of Anaphylaxis',      'STG 2013 / WHO',       '2013', 2013);

-- ─── PROTOCOL STEPS ──────────────────────────────────────────────────────────

-- Angina steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='angina'), 1, 'Acute Attack',
 'Immediate relief of ischaemic pain with nitrates and rest.',
 '[{"item":"Sit patient up; rest immediately"},{"item":"Sublingual GTN (glyceryl trinitrate) 0.3–0.6 mg or isosorbide dinitrate 5 mg — repeat every 5 min, max 3 doses"},{"item":"If no relief after 3 doses — treat as ACS/MI, call emergency services"},{"item":"Aspirin 300 mg chewed immediately if not already on it"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='angina'), 2, 'Chronic Medical Management',
 'Long-term anti-anginal and anti-platelet therapy to prevent MI and improve symptoms.',
 '[{"item":"Aspirin 75–150 mg/day — antiplatelet"},{"item":"Beta-blocker (Atenolol 50 mg OD or Metoprolol 50 mg BD) — first-line anti-anginal"},{"item":"Long-acting nitrate (Isosorbide mononitrate 30–60 mg OD) if beta-blocker insufficient"},{"item":"Statin (Atorvastatin 40–80 mg) for all angina patients regardless of cholesterol level"},{"item":"ACE inhibitor if concurrent diabetes, heart failure, or CKD"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='angina'), 3, 'Risk Factor Modification',
 'Address all modifiable cardiovascular risk factors.',
 '[{"item":"Stop smoking — most important single intervention"},{"item":"Control BP to <140/90 mmHg (or <130/80 if diabetic)"},{"item":"Optimise lipids: LDL target <1.8 mmol/L with statin"},{"item":"Glycaemic control if diabetic (HbA1c <7%)"},{"item":"Regular aerobic exercise 30 min most days; refer to cardiac rehab"},{"item":"Refer for coronary angiography if symptoms uncontrolled on dual anti-anginal therapy"}]',
 'moderate');

-- AF steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='af'), 1, 'Rate Control',
 'Target resting heart rate <110 bpm (or <80 if symptomatic).',
 '[{"item":"Bisoprolol 2.5–10 mg OD or Atenolol 25–100 mg OD (first-line if no heart failure)"},{"item":"Digoxin 0.125–0.25 mg OD — useful in sedentary patients or heart failure with AF"},{"item":"Diltiazem or Verapamil if beta-blocker not tolerated (not in heart failure)"},{"item":"If haemodynamically unstable — DC cardioversion 200 J immediately"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='af'), 2, 'Anticoagulation (Stroke Prevention)',
 'All AF patients with CHA2DS2-VASc ≥2 require anticoagulation.',
 '[{"item":"Calculate CHA2DS2-VASc score: CHF(1), HTN(1), Age≥75(2), DM(1), Stroke(2), Vascular(1), Age65-74(1), Sex female(1)"},{"item":"Score ≥2: start anticoagulation — Warfarin (target INR 2–3) or DOAC (Rivaroxaban/Apixaban)"},{"item":"Assess bleeding risk with HAS-BLED score before starting"},{"item":"Aspirin alone is NOT adequate for stroke prevention in AF"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='af'), 3, 'Rhythm Control',
 'Consider in younger patients, first presentation, or if rate control fails.',
 '[{"item":"DC cardioversion after ≥3 weeks anticoagulation (or TOE to exclude LA thrombus)"},{"item":"Amiodarone 200 mg TDS for 1 week, then 200 mg BD for 1 week, then 200 mg OD maintenance"},{"item":"Continue anticoagulation for ≥4 weeks after cardioversion regardless of result"},{"item":"Refer to cardiology for ablation if refractory or younger patient"}]',
 'moderate');

-- Heart Failure steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='heart_failure'), 1, 'Diuresis',
 'Reduce fluid overload with loop diuretics.',
 '[{"item":"Furosemide 40 mg OD oral (increase to 80–160 mg if insufficient response)"},{"item":"Add Spironolactone 25–50 mg OD for persistent oedema and to reduce mortality"},{"item":"Monitor renal function and electrolytes 1–2 weeks after dose change"},{"item":"Fluid restriction 1.5 L/day in severe heart failure; weigh daily"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='heart_failure'), 2, 'Neurohormonal Blockade',
 'ACE inhibitor + beta-blocker reduce mortality; start low, titrate up.',
 '[{"item":"ACE inhibitor: Enalapril 2.5 mg BD → titrate to 10–20 mg BD over weeks"},{"item":"Beta-blocker: Carvedilol 3.125 mg BD → titrate to 25 mg BD (start only when stable, not in acute decompensation)"},{"item":"ARB (Losartan/Candesartan) if ACE inhibitor not tolerated due to cough"},{"item":"Check renal function and potassium 1–2 weeks after each dose increase"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='heart_failure'), 3, 'Acute Pulmonary Oedema',
 'Sit patient up, oxygen, IV furosemide, nitrate.',
 '[{"item":"Sit upright; high-flow oxygen 10–15 L/min via non-rebreather mask; target SpO2 ≥94%"},{"item":"IV Furosemide 40–80 mg bolus immediately"},{"item":"Sublingual GTN 0.5 mg if SBP >100 mmHg; IV GTN infusion if no improvement"},{"item":"Morphine 2–5 mg IV slowly for anxiety/dyspnoea (use with caution — may reduce respiratory drive)"},{"item":"ICU/HDU if no rapid improvement; consider CPAP/BiPAP"}]',
 'critical');

-- Rheumatic Fever steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='rheumatic_fever'), 1, 'Eradication of Streptococcus',
 'Penicillin to eliminate Group A strep from the throat.',
 '[{"item":"Benzathine Penicillin G 1.2 million units IM single dose (preferred — ensures compliance)"},{"item":"OR Phenoxymethylpenicillin (Penicillin V) 500 mg BD for 10 days"},{"item":"If penicillin allergy: Erythromycin 250 mg QID for 10 days"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='rheumatic_fever'), 2, 'Anti-Inflammatory Therapy',
 'Aspirin for arthritis; prednisolone for severe carditis.',
 '[{"item":"Arthritis: Aspirin 80–100 mg/kg/day in 4 divided doses until ESR normalises"},{"item":"Carditis without heart failure: Aspirin 80–100 mg/kg/day for 4–8 weeks"},{"item":"Severe carditis with heart failure: Prednisolone 1–2 mg/kg/day for 2–3 weeks, then taper"},{"item":"Chorea: Carbamazepine or Sodium Valproate — Haloperidol as alternative"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='rheumatic_fever'), 3, 'Secondary Prophylaxis',
 'Long-term penicillin to prevent recurrence and progressive valve damage.',
 '[{"item":"Benzathine Penicillin G 1.2 million units IM every 3–4 weeks (preferred)"},{"item":"OR Penicillin V 250 mg BD daily"},{"item":"Duration: no carditis — until age 21 or 5 years (whichever longer); carditis without valve damage — 10 years or age 21; persistent valve disease — 10 years or age 40 (sometimes lifelong)"}]',
 'moderate');

-- Migraine steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='migraine'), 1, 'Acute Attack Treatment',
 'Step-care approach: start with simple analgesics, escalate to triptans.',
 '[{"item":"Step 1: Paracetamol 1000 mg + Metoclopramide 10 mg (take at onset, metoclopramide aids absorption)"},{"item":"Step 2: NSAID — Ibuprofen 400–600 mg or Naproxen 500–1000 mg"},{"item":"Step 3: Triptan — Sumatriptan 50–100 mg oral, or 6 mg SC if vomiting; repeat after 2 hrs if recurrence"},{"item":"Sumatriptan nasal spray 20 mg or Zolmitriptan nasal spray 5 mg if oral route not possible"},{"item":"Rest in quiet, dark room"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='migraine'), 2, 'Prophylaxis (if ≥4 attacks/month)',
 'Preventive treatment to reduce frequency and severity.',
 '[{"item":"Propranolol 40–120 mg BD (most evidence; avoid in asthma)"},{"item":"Sodium Valproate 400–600 mg BD (avoid in women of childbearing age)"},{"item":"Topiramate 25–200 mg/day (weight-reducing side effect can be useful)"},{"item":"Amitriptyline 10–75 mg nocte (useful if comorbid tension headache or depression)"},{"item":"Review prophylaxis after 6 months — step down if well controlled"}]',
 'moderate');

-- Tension Headache steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='tension_ha'), 1, 'Acute Treatment',
 'Simple analgesics are effective for episodic tension headache.',
 '[{"item":"Paracetamol 500–1000 mg — first-line"},{"item":"Ibuprofen 400–600 mg if paracetamol insufficient"},{"item":"Aspirin 600–900 mg — alternative"},{"item":"Avoid opioids and compound analgesics — risk of medication overuse headache (>10 days/month)"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='tension_ha'), 2, 'Chronic Prevention',
 'Amitriptyline is the only proven preventive for chronic tension headache.',
 '[{"item":"Amitriptyline 10 mg nocte — uptitrate by 10 mg every 2 weeks to 50–75 mg"},{"item":"Trial for minimum 3–6 months before declaring ineffective"},{"item":"Mirtazapine 30 mg nocte as alternative"},{"item":"Stress management, relaxation therapy, regular sleep schedule"}]',
 'moderate');

-- Meningitis steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='meningitis'), 1, 'Immediate Management',
 'Antibiotics must not be delayed — give before LP if LP will be delayed >1 hr.',
 '[{"item":"IV Ceftriaxone 2 g immediately (4 g if pneumococcal suspected or immunocompromised)"},{"item":"IV Dexamethasone 0.15 mg/kg every 6 hrs for 4 days — start before or with first antibiotic dose (reduces hearing loss and neurological sequelae in S. pneumoniae)"},{"item":"Blood cultures before antibiotics if possible — but do not delay treatment"},{"item":"IV access, oxygen, continuous monitoring"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='meningitis'), 2, 'Lumbar Puncture & CSF Analysis',
 'LP confirms diagnosis — do not delay antibiotics for LP.',
 '[{"item":"LP safe if: no papilloedema, no focal neurology, GCS >12, no coagulopathy"},{"item":"CSF: bacterial — turbid, high protein (>1 g/L), low glucose (<2.2 mmol/L or <50% plasma), neutrophils"},{"item":"CT head before LP if: papilloedema, focal neurology, immunocompromised, or seizure"},{"item":"Gram stain and culture CSF; also pneumococcal and meningococcal antigen"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='meningitis'), 3, 'Ongoing Treatment & Duration',
 'Antibiotic duration depends on organism.',
 '[{"item":"N. meningitidis: Ceftriaxone 2 g BD for 7 days"},{"item":"S. pneumoniae: Ceftriaxone 2 g BD for 14 days"},{"item":"L. monocytogenes (elderly/immunocompromised): add Amoxicillin 2 g IV 4-hourly"},{"item":"Seizure control: Lorazepam IV; phenytoin for ongoing seizures"},{"item":"Contacts of meningococcal meningitis: Rifampicin 600 mg BD × 2 days prophylaxis"}]',
 'critical');

-- Hypothyroidism steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='hypothyroidism'), 1, 'Levothyroxine Initiation',
 'Start low, uptitrate every 6–8 weeks guided by TSH.',
 '[{"item":"Young healthy adults: Levothyroxine 50–100 mcg/day"},{"item":"Elderly or cardiac disease: start 12.5–25 mcg/day; increase by 12.5 mcg every 4–6 weeks"},{"item":"Take on empty stomach 30 minutes before breakfast"},{"item":"Avoid: iron, calcium, antacids, fibre within 4 hours — reduce absorption"},{"item":"Target TSH: 0.5–2.5 mIU/L"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='hypothyroidism'), 2, 'Monitoring',
 'Check TSH 6–8 weeks after each dose change; annually when stable.',
 '[{"item":"Recheck TSH 6–8 weeks after initiating or changing dose"},{"item":"Once stable: annual TSH check"},{"item":"Pregnancy: TSH target 0.1–2.5 mIU/L; increase dose by 25–30% at confirmation of pregnancy"},{"item":"Drugs that increase levothyroxine requirement: phenytoin, rifampicin, carbamazepine"}]',
 'moderate');

-- Hyperthyroidism steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='hyperthyroidism'), 1, 'Anti-Thyroid Drug Therapy',
 'Carbimazole or propylthiouracil to block thyroid hormone synthesis.',
 '[{"item":"Carbimazole 10–20 mg every 8–12 hrs until euthyroid (6–8 weeks), then reduce to maintenance 5–10 mg OD for 18–24 months"},{"item":"Propylthiouracil 100–150 mg every 6–8 hrs — preferred in pregnancy (first trimester) and thyroid storm"},{"item":"Propranolol 40–120 mg/day for adrenergic symptoms (tremor, palpitations, sweating) — only symptomatic, not definitive"},{"item":"Check TFTs after 4–6 weeks; target TSH and free T4 in normal range"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='hyperthyroidism'), 2, 'Definitive Treatment',
 'Radioiodine or surgery for definitive cure.',
 '[{"item":"Radioiodine (I-131): method of choice in elderly and relapsed/refractory cases; avoid in pregnancy and breastfeeding"},{"item":"Surgery (subtotal thyroidectomy): large goitre, malignancy suspected, patient preference, failed medical therapy"},{"item":"After treatment: monitor for hypothyroidism — start levothyroxine replacement"}]',
 'moderate');

-- Anaphylaxis steps
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='anaphylaxis'), 1, 'Immediate Management',
 'Adrenaline IM is the first and most important treatment — give without delay.',
 '[{"item":"Call for help; lay patient flat with legs elevated (unless respiratory distress — then sit up)"},{"item":"Adrenaline (Epinephrine) 0.5 mg IM (0.5 mL of 1:1000) into outer thigh — IMMEDIATELY"},{"item":"Repeat adrenaline every 5 minutes if no improvement"},{"item":"High-flow oxygen 10–15 L/min via non-rebreather mask"},{"item":"IV access: rapid IV fluids 500 mL–1 L crystalloid if hypotensive"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='anaphylaxis'), 2, 'Secondary Treatment',
 'Antihistamines and steroids are adjuncts only — not first-line.',
 '[{"item":"Chlorphenamine 10 mg IV/IM — antihistamine for urticaria/angioedema"},{"item":"Hydrocortisone 200 mg IV — reduces risk of biphasic reaction (onset of action delayed 4–6 hrs)"},{"item":"Salbutamol nebuliser 2.5–5 mg if bronchospasm persists after adrenaline"},{"item":"Monitor for 6–12 hrs after recovery — biphasic reactions occur in 5–20%"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='anaphylaxis'), 3, 'Discharge & Prevention',
 'All patients need adrenaline auto-injector and allergy referral.',
 '[{"item":"Prescribe 2 adrenaline auto-injectors (EpiPen/Jext 0.3 mg) — train patient on use"},{"item":"Medic-alert bracelet and written anaphylaxis action plan"},{"item":"Refer to allergy specialist for identification of trigger and immunotherapy if appropriate"},{"item":"Avoid known trigger; carry auto-injector at all times"}]',
 'moderate');

-- ─── RX ENTRIES ──────────────────────────────────────────────────────────────

-- Angina Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('angina','Glyceryl Trinitrate (GTN)','Nitrate vasodilator','Acute angina attack relief','0.3–0.5 mg sublingual or 1–2 puffs spray','At onset; repeat every 5 min, max 3 doses','Sublingual','As needed','Causes headache and flushing. Sit down before use — hypotension risk. If no relief after 3 doses treat as ACS. Store in dark airtight container',1,'STG 2013'),
('angina','Aspirin','Antiplatelet','Antiplatelet therapy for all angina patients','75–150 mg','Once daily','Oral','Lifelong','Take with food. Irreversible COX-1 inhibitor. Contraindicated in active peptic ulcer — add PPI',1,'STG 2013 / GP 3rd Ed'),
('angina','Atenolol','Beta-1 blocker','First-line anti-anginal prophylaxis','50–100 mg','Once daily','Oral','Lifelong','Reduces heart rate and myocardial oxygen demand. Contraindicated in severe asthma, decompensated heart failure. Do not stop abruptly',1,'STG 2013'),
('angina','Isosorbide Mononitrate','Long-acting nitrate','Prophylaxis of angina if beta-blocker insufficient','30–60 mg modified-release','Once daily (morning)','Oral','Lifelong','Allow 8-hour nitrate-free interval to prevent tolerance. Causes headache initially. Reduce dose if severe headache',2,'STG 2013'),
('angina','Atorvastatin','Statin','Lipid lowering and plaque stabilisation','40–80 mg','Once daily (evening)','Oral','Lifelong','Target LDL <1.8 mmol/L. Check LFTs baseline; myopathy risk with higher doses. Do not use in pregnancy',1,'GP 3rd Ed'),
('angina','Clopidogrel','P2Y12 antiplatelet','Aspirin alternative or dual antiplatelet after PCI','75 mg','Once daily','Oral','As directed by cardiologist','Use alone if aspirin intolerant. Dual antiplatelet (aspirin + clopidogrel) for 12 months after stent',2,'STG 2013');

-- AF Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('af','Bisoprolol','Beta-1 blocker','Rate control — first-line','2.5–10 mg','Once daily','Oral','Lifelong','Uptitrate every 2 weeks. Target resting HR <110 bpm. Avoid in decompensated heart failure',1,'GP 3rd Ed'),
('af','Digoxin','Cardiac glycoside','Rate control in sedentary patients or heart failure','0.125–0.25 mg','Once daily','Oral','Lifelong','Narrow therapeutic index — check levels (target 0.6–1.2 ng/mL). Toxicity: nausea, visual changes, bradycardia. Reduce dose in renal impairment',1,'STG 2013'),
('af','Warfarin','Vitamin K antagonist','Stroke prevention (CHA2DS2-VASc ≥2)','Dose adjusted to INR','Daily','Oral','Lifelong','Target INR 2.0–3.0. Check INR weekly until stable then monthly. Multiple drug and food interactions (especially vitamin K). Carry anticoagulant alert card',1,'STG 2013'),
('af','Amiodarone','Class III antiarrhythmic','Rhythm control — cardioversion or maintenance','200 mg TDS × 1 week, BD × 1 week, then 200 mg OD','Daily','Oral','Long-term','Multiple toxicities: thyroid, pulmonary, hepatic, corneal deposits, photosensitivity. Annual TFTs, LFTs, CXR. Highly effective but significant side-effect burden',2,'STG 2013');

-- Heart Failure Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('heart_failure','Furosemide','Loop diuretic','Fluid overload in heart failure','40–160 mg','Once or twice daily','Oral or IV','Lifelong','Monitor potassium (hypokalaemia). Weigh daily — target loss 0.5–1 kg/day acutely. IV for acute decompensation',1,'STG 2013'),
('heart_failure','Enalapril','ACE inhibitor','Reduce mortality and morbidity in HFrEF','2.5 mg BD → target 10–20 mg BD','Twice daily','Oral','Lifelong','Start low, titrate up every 2 weeks. Monitor K+ and creatinine. Contraindicated in pregnancy',1,'STG 2013'),
('heart_failure','Carvedilol','Alpha+beta blocker','Reduce mortality in stable HFrEF','3.125 mg BD → target 25 mg BD','Twice daily','Oral','Lifelong','Start ONLY when stable — not in acute decompensation. Uptitrate every 2 weeks if tolerated',1,'GP 3rd Ed'),
('heart_failure','Spironolactone','Aldosterone antagonist','Add-on to reduce mortality','25–50 mg','Once daily','Oral','Lifelong','Monitor K+ and renal function carefully — hyperkalaemia risk especially with ACE inhibitor',2,'GP 3rd Ed');

-- Rheumatic Fever Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('rheumatic_fever','Benzathine Penicillin G','Penicillin antibiotic','Streptococcal eradication and secondary prophylaxis','1.2 million units','Single dose (acute); every 3–4 weeks (prophylaxis)','IM','Lifelong secondary prophylaxis if persistent valve disease','Preferred over oral for prophylaxis — ensures adherence. Give deep IM, Z-track technique to reduce pain. Check for penicillin allergy',1,'STG 2013'),
('rheumatic_fever','Aspirin','Salicylate anti-inflammatory','Arthritis and mild carditis','80–100 mg/kg/day in 4 divided doses (max 4–6 g/day adult)','Four times daily','Oral','Until ESR normalises (4–8 weeks)','Monitor for salicylate toxicity: tinnitus, hyperventilation. Reduce dose as symptoms improve',1,'STG 2013'),
('rheumatic_fever','Prednisolone','Corticosteroid','Severe carditis with heart failure','1–2 mg/kg/day (max 80 mg)','Daily (morning)','Oral','2–3 weeks then taper','Use only for severe carditis with cardiac failure. Do not stop abruptly — taper over 2 weeks after clinical improvement',2,'STG 2013');

-- Migraine Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('migraine','Paracetamol + Metoclopramide','Analgesic + Antiemetic','Mild-moderate migraine (first step)','Paracetamol 1000 mg + Metoclopramide 10 mg','At onset','Oral','Acute attacks','Metoclopramide improves absorption and relieves nausea. Take at earliest warning',1,'STG 2013 / GP 3rd Ed'),
('migraine','Sumatriptan','5-HT1B/1D agonist (triptan)','Moderate-severe migraine or NSAID failure','50–100 mg oral; 6 mg SC; 20 mg nasal spray','At onset; repeat after 2 hrs if headache returns (max 2 doses/24 hrs)','Oral, SC, or Nasal','Acute attacks','Do not use within 24 hrs of ergotamine. Contraindicated in ischaemic heart disease, uncontrolled HTN. SC fastest onset',1,'STG 2013'),
('migraine','Propranolol','Beta-blocker','Migraine prophylaxis (≥4 attacks/month)','40–120 mg','Twice daily','Oral','Minimum 3–6 months','Most evidence for migraine prevention. Avoid in asthma. 50% reduction in attack frequency expected',2,'STG 2013'),
('migraine','Sodium Valproate','Anti-epileptic','Migraine prophylaxis — alternative','400–600 mg','Twice daily','Oral','Minimum 3–6 months','Effective prophylaxis. TERATOGENIC — contraindicated in pregnancy; mandatory contraception in women of reproductive age',2,'STG 2013');

-- Tension Headache Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('tension_ha','Paracetamol','Analgesic/antipyretic','Acute tension headache','500–1000 mg','Up to 4 times daily','Oral','As needed (max 15 days/month)','First-line. Avoid daily use — risk of medication overuse headache (MOH/analgesic rebound)',1,'STG 2013'),
('tension_ha','Ibuprofen','NSAID','Acute tension headache if paracetamol insufficient','400–600 mg','Three times daily with food','Oral','As needed','Avoid in peptic ulcer, renal impairment, heart failure. Take with food',1,'STG 2013'),
('tension_ha','Amitriptyline','Tricyclic antidepressant','Chronic tension headache prevention','10 mg nocte → uptitrate to 50–75 mg','Once daily at night','Oral','Minimum 3–6 months trial','Start low to minimise sedation, dry mouth, constipation side effects. Effective for comorbid depression/insomnia',2,'STG 2013');

-- Meningitis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('meningitis','Ceftriaxone','Third-gen cephalosporin','First-line empirical bacterial meningitis','2 g (4 g if pneumococcal)','Every 12–24 hrs','IV','7–14 days (organism-dependent)','Start IMMEDIATELY without waiting for LP or CT results. Switch based on culture sensitivity',1,'STG 2013'),
('meningitis','Dexamethasone','Corticosteroid','Reduce inflammation and neurological sequelae','0.15 mg/kg (max 10 mg)','Every 6 hrs','IV','4 days','Give before or with FIRST antibiotic dose. Reduces hearing loss and mortality in pneumococcal meningitis. Do not use if already received antibiotics',1,'STG 2013'),
('meningitis','Amoxicillin','Aminopenicillin','Cover Listeria monocytogenes (elderly/immunocompromised)','2 g','Every 4 hours','IV','21 days for Listeria','Add empirically in all patients >50 years, pregnant, or immunocompromised. Cephalosporins do not cover Listeria',2,'STG 2013');

-- Hypothyroidism Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('hypothyroidism','Levothyroxine (T4)','Thyroid hormone replacement','All hypothyroidism','50–100 mcg/day (healthy adult); 12.5–25 mcg/day (elderly/cardiac)','Once daily','Oral','Lifelong','Take 30 min before breakfast on empty stomach. Avoid iron/calcium/antacids within 4 hrs. Titrate by 25 mcg every 6–8 weeks to target TSH 0.5–2.5 mIU/L',1,'STG 2013');

-- Hyperthyroidism Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('hyperthyroidism','Carbimazole','Antithyroid drug (thionamide)','Graves disease and toxic goitre — first-line','10–20 mg every 8–12 hrs; reduce to 5–10 mg OD maintenance','Two to three times daily','Oral','18–24 months','Check FBC if sore throat or fever — risk of agranulocytosis (rare but serious). Contraindicated in second/third trimester — use propylthiouracil instead',1,'STG 2013'),
('hyperthyroidism','Propylthiouracil (PTU)','Antithyroid drug','Hyperthyroidism in pregnancy (first trimester) and thyroid storm','100–150 mg every 6–8 hrs','Three to four times daily','Oral','Minimum 18 months','Drug of choice in first trimester pregnancy. Also preferred in thyroid storm (blocks T4→T3 conversion). Higher hepatotoxicity risk than carbimazole',1,'STG 2013'),
('hyperthyroidism','Propranolol','Beta-blocker','Control adrenergic symptoms while awaiting euthyroidism','40–120 mg','Daily in divided doses','Oral','Until euthyroid','For symptom relief only — does not affect thyroid hormone synthesis. Useful in thyroid storm at high doses',2,'STG 2013');

-- Anaphylaxis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('anaphylaxis','Adrenaline (Epinephrine)','Catecholamine vasopressor','FIRST-LINE treatment for anaphylaxis','0.5 mg (0.5 mL of 1:1000 solution) adult; 0.01 mg/kg child','Repeat every 5 min if no improvement','IM (anterolateral thigh)','Acute emergency','NEVER delay. IM thigh is fastest absorption. IV route only in ICU with monitoring. Auto-injector (EpiPen 0.3 mg) for community use',1,'STG 2013 / WHO'),
('anaphylaxis','Chlorphenamine (Chlorpheniramine)','H1 antihistamine','Adjunct for urticaria and angioedema','10 mg IV/IM','Repeat at 6 hrs if needed','IV or IM','Acute episode','ADJUNCT ONLY — not a substitute for adrenaline. Acts over hours, not minutes',2,'STG 2013'),
('anaphylaxis','Hydrocortisone','Corticosteroid','Prevent biphasic anaphylaxis reaction','200 mg IV','Single dose; repeat 6-hourly','IV','24–48 hrs','Onset delayed 4–6 hrs. Cannot replace adrenaline for acute phase. Reduces risk of biphasic reaction',2,'STG 2013'),
('anaphylaxis','Normal Saline','IV crystalloid','Fluid resuscitation in anaphylactic shock','500 mL–1 L rapid bolus; repeat as needed','Rapid infusion','IV','Until haemodynamically stable','May need 2–4 L in severe anaphylaxis. Monitor closely for pulmonary oedema',1,'STG 2013');

COMMIT;
