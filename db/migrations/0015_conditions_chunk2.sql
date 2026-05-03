-- Chunk 2: Psychiatry, ENT, GI, Respiratory, Infectious Disease
BEGIN TRANSACTION;

-- ─── CONDITIONS ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview) VALUES
('depression',    'Major Depressive Disorder',  'psychiatry',  'F32', 'Persistent low mood, loss of interest or pleasure, fatigue, sleep disturbance, poor concentration, feelings of guilt, and suicidal ideation lasting ≥2 weeks. Biopsychosocial aetiology. Treatment: antidepressants (SSRIs first-line) plus psychotherapy. Risk of suicide must be assessed at every visit.'),
('bipolar',       'Bipolar Mood Disorder',      'psychiatry',  'F31', 'Episodic disorder alternating between mania (elevated/irritable mood, grandiosity, decreased sleep, reckless behaviour) and depression. Requires mood stabiliser (lithium, valproate, or carbamazepine) for long-term prophylaxis. Lithium reduces suicide risk.'),
('schizophrenia', 'Schizophrenia',              'psychiatry',  'F20', 'Chronic psychotic disorder characterised by delusions, hallucinations, disorganised speech and behaviour, and negative symptoms (flat affect, avolition). Onset typically 18–25 years. Antipsychotics are the cornerstone of treatment; psychosocial rehabilitation is essential.'),
('allergic_rhinitis','Allergic Rhinitis',       'ent',         'J30', 'IgE-mediated hypersensitivity of the nasal mucosa. Seasonal (hay fever) or perennial. Presents with sneezing, watery rhinorrhoea, nasal obstruction, and itching. Often associated with asthma and allergic conjunctivitis. Management: allergen avoidance, antihistamines, intranasal corticosteroids.'),
('acute_otitis',  'Acute Suppurative Otitis Media','ent',      'H66', 'Acute pyogenic infection of the middle ear, common in children. Presents with otalgia, fever, and otorrhoea if tympanic membrane perforates. Most cases resolve spontaneously but antibiotics required for children <2 years, bilateral disease, or systemic illness.'),
('acute_sinusitis','Acute Sinusitis',           'ent',         'J01', 'Inflammation of paranasal sinuses, usually following viral URTI. Presents with headache, facial pain, nasal obstruction, and purulent discharge. Bacterial sinusitis persists >10 days or worsens after initial improvement. Treated with decongestants, saline irrigation, and antibiotics if bacterial.'),
('acute_tonsillitis','Acute Tonsillitis',       'ent',         'J03', 'Inflammation of the palatine tonsils, usually viral (adenovirus, EBV) or bacterial (Group A streptococcus). Presents with sore throat, dysphagia, fever, tonsillar exudate, and cervical lymphadenopathy. Antibiotics only if bacterial (positive rapid strep test or Centor score ≥3).'),
('copd',          'COPD',                       'respiratory', 'J44', 'Progressive, preventable airflow limitation caused by tobacco smoke and biomass fuel exposure. Presents with chronic productive cough, exertional dyspnoea, and frequent chest infections. Spirometry (FEV1/FVC <0.7 post-bronchodilator) confirms diagnosis. GOLD staging guides treatment.'),
('acute_pancreatitis','Acute Pancreatitis',     'gi',          'K85', 'Acute inflammation of the pancreas ranging from self-limiting oedematous to life-threatening necrotising pancreatitis. Most common causes: gallstones and alcohol. Presents with severe epigastric pain radiating to back, nausea, vomiting. Raised serum amylase/lipase >3× ULN. Treatment: aggressive IV fluids, analgesia, bowel rest.'),
('cholelithiasis', 'Cholelithiasis',            'gi',          'K80', 'Gallstone disease. Cholesterol stones most common. Classic presentation: right upper quadrant or epigastric pain after fatty meals, nausea, vomiting. Complications: acute cholecystitis, choledocholithiasis, cholangitis, pancreatitis. Definitive treatment: cholecystectomy.'),
('chikungunya',   'Chikungunya',                'infectious',  'A92', 'Arboviral illness caused by chikungunya alphavirus, transmitted by Aedes mosquito. Presents with abrupt fever (2–7 days), severe polyarthralgia, and maculopapular rash. Arthralgia can persist for months to years. No specific antiviral — treatment is supportive (paracetamol, physiotherapy).'),
('chickenpox',    'Chickenpox (Varicella)',      'infectious',  'B01', 'Highly contagious primary infection with varicella-zoster virus (VZV). Presents with fever and characteristic centripetal pruritic vesicular rash in different stages. Usually self-limiting in children. Severe in adults, neonates, and immunocompromised — acyclovir indicated.'),
('herpes_zoster', 'Herpes Zoster (Shingles)',   'infectious',  'B02', 'Reactivation of latent varicella-zoster virus in dorsal root ganglia. Presents with prodromal pain followed by unilateral dermatomal vesicular rash. Post-herpetic neuralgia is the most feared complication. Antiviral therapy (acyclovir/valacyclovir) most effective if started within 72 hours of rash onset.'),
('ckd',           'Chronic Kidney Disease',     'nephrology',  'N18', 'Irreversible, progressive loss of renal function for >3 months. Common causes: diabetes, hypertension, chronic glomerulonephritis. Stages I–V based on eGFR. Complications: anaemia, hypertension, metabolic acidosis, hyperphosphataemia, cardiovascular disease. ESRD requires dialysis or transplant.');

-- ─── SYMPTOMS ────────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Depression
('depression','Persistently low mood or sadness for ≥2 weeks',0),
('depression','Loss of interest or pleasure in previously enjoyed activities (anhedonia)',0),
('depression','Fatigue and loss of energy',0),
('depression','Sleep disturbance (insomnia or hypersomnia)',0),
('depression','Poor concentration and indecisiveness',0),
('depression','Feelings of worthlessness or excessive guilt',0),
('depression','Change in appetite or weight',0),
('depression','Psychomotor agitation or retardation',0),
('depression','Active suicidal ideation or plan',1),
('depression','Psychotic features: delusions or hallucinations',1),
('depression','Refusal to eat or drink (severe depression)',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Bipolar
('bipolar','Elevated, expansive or irritable mood lasting ≥1 week (manic episode)',0),
('bipolar','Decreased need for sleep (feels rested after 3 hours)',0),
('bipolar','Grandiosity or inflated self-esteem',0),
('bipolar','Pressured speech and flight of ideas',0),
('bipolar','Increased goal-directed activity and reckless behaviour',0),
('bipolar','Depressive episodes alternating with mania',0),
('bipolar','Suicidal ideation during depressive phase',1),
('bipolar','Psychosis (delusions/hallucinations) during severe mania',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Schizophrenia
('schizophrenia','Fixed false beliefs not amenable to reasoning (delusions)',0),
('schizophrenia','Hearing voices when alone (auditory hallucinations)',0),
('schizophrenia','Disorganised speech and thought',0),
('schizophrenia','Bizarre or disorganised behaviour',0),
('schizophrenia','Flat affect, avolition, alogia (negative symptoms)',0),
('schizophrenia','Social and occupational dysfunction',0),
('schizophrenia','Active suicidal ideation or command hallucinations',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Allergic Rhinitis
('allergic_rhinitis','Sneezing — often in bouts',0),
('allergic_rhinitis','Watery nasal discharge (rhinorrhoea)',0),
('allergic_rhinitis','Nasal obstruction and itching',0),
('allergic_rhinitis','Itchy, watery eyes (allergic conjunctivitis)',0),
('allergic_rhinitis','Post-nasal drip and throat clearing',0),
('allergic_rhinitis','Associated asthma wheeze or skin rash (atopic triad)',0);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Acute Otitis Media
('acute_otitis','Ear pain (otalgia) — often severe in children',0),
('acute_otitis','Fever',0),
('acute_otitis','Ear discharge (otorrhoea) if tympanic membrane perforates',0),
('acute_otitis','Hearing impairment and tinnitus',0),
('acute_otitis','Irritability, poor feeding, and ear tugging in infants',0),
('acute_otitis','Mastoid tenderness or swelling (mastoiditis)',1),
('acute_otitis','Facial nerve palsy',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Acute Sinusitis
('acute_sinusitis','Facial pain and pressure — worse leaning forward',0),
('acute_sinusitis','Nasal obstruction and purulent nasal discharge',0),
('acute_sinusitis','Headache — frontal or behind the eyes',0),
('acute_sinusitis','Post-nasal drip and cough',0),
('acute_sinusitis','Symptoms persisting >10 days or biphasic worsening',0),
('acute_sinusitis','Periorbital oedema or proptosis (orbital cellulitis)',1),
('acute_sinusitis','Severe headache with neck stiffness (intracranial extension)',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Acute Tonsillitis
('acute_tonsillitis','Sore throat and odynophagia',0),
('acute_tonsillitis','Fever',0),
('acute_tonsillitis','Tonsillar enlargement with erythema or exudate',0),
('acute_tonsillitis','Anterior cervical lymphadenopathy',0),
('acute_tonsillitis','Trismus and uvular deviation (peritonsillar abscess)',1),
('acute_tonsillitis','Airway obstruction — drooling, stridor (rare)',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- COPD
('copd','Chronic productive cough — worse in winter',0),
('copd','Progressive exertional dyspnoea',0),
('copd','Purulent sputum during exacerbations',0),
('copd','Barrel chest, prolonged expiration, pursed-lip breathing',0),
('copd','Reduced FEV1/FVC <0.7 on spirometry',0),
('copd','SpO2 <88% at rest or during exertion (severe COPD)',1),
('copd','Acute exacerbation: increased dyspnoea, sputum, and wheeze',1),
('copd','Cor pulmonale: peripheral oedema, raised JVP, cyanosis',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Acute Pancreatitis
('acute_pancreatitis','Sudden severe epigastric pain radiating to the back',0),
('acute_pancreatitis','Nausea and vomiting',0),
('acute_pancreatitis','Fever and tachycardia',0),
('acute_pancreatitis','Epigastric tenderness and guarding',0),
('acute_pancreatitis','Serum amylase/lipase >3× upper limit of normal',0),
('acute_pancreatitis','Cullen''s sign (periumbilical bruising) — haemorrhagic pancreatitis',1),
('acute_pancreatitis','Grey Turner''s sign (flank bruising) — haemorrhagic pancreatitis',1),
('acute_pancreatitis','Shock: tachycardia, hypotension, oliguria',1),
('acute_pancreatitis','Respiratory failure (ARDS)',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Cholelithiasis
('cholelithiasis','Right upper quadrant or epigastric pain after fatty meals',0),
('cholelithiasis','Nausea and vomiting',0),
('cholelithiasis','Murphy''s sign positive (acute cholecystitis)',0),
('cholelithiasis','Jaundice with pale stools and dark urine (choledocholithiasis)',0),
('cholelithiasis','Charcot''s triad: RUQ pain, fever, jaundice (cholangitis)',1),
('cholelithiasis','Reynold''s pentad: Charcot''s triad + hypotension + confusion (severe cholangitis)',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Chikungunya
('chikungunya','Abrupt onset high fever (38–40°C)',0),
('chikungunya','Severe, symmetrical polyarthralgia — wrists, ankles, fingers, toes',0),
('chikungunya','Maculopapular rash on trunk and limbs after 2–5 days',0),
('chikungunya','Headache, myalgia, conjunctival injection',0),
('chikungunya','Arthralgia may persist for months to years',0);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Chickenpox
('chickenpox','Low-grade fever and malaise 1–2 days before rash',0),
('chickenpox','Characteristic vesicular rash: macule → papule → vesicle → crust',0),
('chickenpox','Centripetal distribution: trunk > face > extremities',0),
('chickenpox','Lesions in all stages simultaneously (pathognomonic)',0),
('chickenpox','Intense pruritus',0),
('chickenpox','Pneumonitis: dyspnoea, cough, tachypnoea (adults)',1),
('chickenpox','Encephalitis: ataxia, seizures, altered consciousness',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- Herpes Zoster
('herpes_zoster','Prodromal burning or shooting pain in a dermatomal distribution (1–5 days before rash)',0),
('herpes_zoster','Unilateral grouped vesicles on erythematous base in a dermatomal band',0),
('herpes_zoster','Does not cross the midline',0),
('herpes_zoster','Post-herpetic neuralgia: persistent pain >3 months after rash',0),
('herpes_zoster','Herpes zoster ophthalmicus: rash on forehead and nose (V1 dermatome)',1),
('herpes_zoster','Ramsay Hunt syndrome: facial palsy, ear vesicles, hearing loss',1);

INSERT OR IGNORE INTO symptoms (condition_id, text, is_warn_sign) VALUES
-- CKD
('ckd','Fatigue, lethargy, and reduced exercise tolerance',0),
('ckd','Ankle oedema',0),
('ckd','Hypertension — often severe and resistant',0),
('ckd','Nocturia and polyuria (early); oliguria (late)',0),
('ckd','Pallor (anaemia of CKD)',0),
('ckd','Pruritus and uraemic frost (severe CKD)',0),
('ckd','Uraemic encephalopathy: confusion, seizures, asterixis',1),
('ckd','Acute fluid overload: pulmonary oedema',1),
('ckd','Hyperkalaemia: ECG changes, cardiac arrhythmia',1);

-- ─── PROTOCOLS ───────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('depression',       'Management of Major Depressive Disorder',  'STG 2013 / GP 3rd Ed', '2013', 2013),
('bipolar',          'Management of Bipolar Mood Disorder',       'STG 2013',             '2013', 2013),
('schizophrenia',    'Antipsychotic Management of Schizophrenia', 'STG 2013',             '2013', 2013),
('allergic_rhinitis','Management of Allergic Rhinitis',           'STG 2013',             '2013', 2013),
('acute_otitis',     'Management of Acute Otitis Media',          'STG 2013',             '2013', 2013),
('acute_sinusitis',  'Management of Acute Sinusitis',             'STG 2013',             '2013', 2013),
('acute_tonsillitis','Management of Acute Tonsillitis',           'STG 2013',             '2013', 2013),
('copd',             'Stepwise Management of COPD',               'STG 2013 / GOLD',      '2013', 2013),
('acute_pancreatitis','Management of Acute Pancreatitis',         'STG 2013',             '2013', 2013),
('cholelithiasis',   'Management of Gallstone Disease',           'STG 2013',             '2013', 2013),
('chikungunya',      'Symptomatic Management of Chikungunya',     'STG 2013',             '2013', 2013),
('chickenpox',       'Management of Varicella (Chickenpox)',      'STG 2013',             '2013', 2013),
('herpes_zoster',    'Management of Herpes Zoster',               'STG 2013',             '2013', 2013),
('ckd',              'Management of Chronic Kidney Disease',      'STG 2013',             '2013', 2013);

-- ─── PROTOCOL STEPS ──────────────────────────────────────────────────────────

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='depression'), 1, 'Assessment & Risk Stratification',
 'Assess severity using PHQ-9 and evaluate suicide risk at every consultation.',
 '[{"item":"PHQ-9 score: 5–9 mild; 10–14 moderate; 15–19 moderately severe; ≥20 severe"},{"item":"Ask directly about suicidal ideation, plan, intent, and means — do not avoid the question"},{"item":"Assess for bipolar disorder (if manic episodes present, SSRIs alone can precipitate mania)"},{"item":"Rule out medical causes: thyroid disease, anaemia, vitamin B12/D deficiency"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='depression'), 2, 'Pharmacological Treatment',
 'SSRIs are first-line for all severities requiring medication.',
 '[{"item":"Fluoxetine 20 mg OD (or Sertraline 50 mg OD) — start low, uptitrate after 2–4 weeks if tolerated"},{"item":"Allow 4–6 weeks for full antidepressant response before changing drug"},{"item":"Continue for minimum 6 months after remission — 2 years if recurrent depression"},{"item":"If inadequate response at 4–6 weeks: increase dose, switch SSRI, or add augmentation (mirtazapine, lithium)"},{"item":"Venlafaxine or Duloxetine for comorbid anxiety or chronic pain"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='depression'), 3, 'Psychotherapy & Follow-up',
 'CBT is as effective as antidepressants for mild-moderate depression.',
 '[{"item":"Cognitive Behavioural Therapy (CBT) — 12–20 sessions for mild-moderate depression"},{"item":"Combined medication + CBT superior to either alone for moderate-severe depression"},{"item":"Review at 2 weeks (for side effects), 4–6 weeks (efficacy), then monthly until remission"},{"item":"Refer to psychiatry: severe depression, psychosis, suicidal intent, treatment resistance"}]',
 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='copd'), 1, 'GOLD Stage-Based Treatment',
 'Stepwise inhaler therapy based on GOLD spirometric stage.',
 '[{"item":"GOLD I (FEV1 ≥80%): SABA (Salbutamol) as needed"},{"item":"GOLD II (50–79%): LAMA (Tiotropium 18 mcg OD) + SABA as needed"},{"item":"GOLD III (30–49%): LAMA + LABA (Formoterol/Indacaterol); consider ICS if frequent exacerbations"},{"item":"GOLD IV (<30%): Triple therapy (LAMA + LABA + ICS); assess for home oxygen if PaO2 <7.3 kPa at rest"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='copd'), 2, 'Acute COPD Exacerbation',
 'Increased dyspnoea, sputum, and wheeze — may require hospital admission.',
 '[{"item":"Controlled oxygen: target SpO2 88–92% (avoid high-flow — risk of CO2 retention)"},{"item":"Nebulised Salbutamol 2.5–5 mg + Ipratropium 0.5 mg every 4–6 hrs"},{"item":"Prednisolone 30–40 mg oral for 5 days"},{"item":"Antibiotics if purulent sputum or signs of infection: Amoxicillin 500 mg TDS or Doxycycline 200 mg day 1 then 100 mg OD"},{"item":"NIV (BiPAP) if pH <7.35 and pCO2 >6 kPa — prevents intubation"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='copd'), 3, 'Non-Pharmacological',
 'Smoking cessation is the only intervention proven to slow COPD progression.',
 '[{"item":"Smoking cessation: most important — refer to cessation programme, NRT or varenicline"},{"item":"Annual influenza and pneumococcal vaccination"},{"item":"Pulmonary rehabilitation: 6–12 weeks supervised exercise — improves quality of life"},{"item":"Nutritional support if BMI <20"}]',
 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='acute_pancreatitis'), 1, 'Initial Management',
 'Aggressive IV fluid resuscitation and analgesia are the cornerstone of treatment.',
 '[{"item":"Nil by mouth — nasogastric tube if vomiting"},{"item":"Aggressive IV fluid resuscitation: Ringer''s Lactate 250–500 mL/hr for first 12–24 hrs"},{"item":"Analgesia: Morphine 2.5–5 mg IV or Tramadol 50–100 mg IV/IM every 6 hrs"},{"item":"IV Pantoprazole 40 mg twice daily"},{"item":"Monitor urine output (target >0.5 mL/kg/hr), vitals, and blood glucose"},{"item":"Ranson''s score or APACHE II to predict severity"}]',
 'critical'),
((SELECT id FROM protocols WHERE condition_id='acute_pancreatitis'), 2, 'Severe/Necrotising Pancreatitis',
 'ICU admission; antibiotics for infected necrosis only.',
 '[{"item":"ICU monitoring, oxygen, urinary catheter"},{"item":"Antibiotics ONLY for infected necrosis (not prophylactic): IV Meropenem 1 g every 8 hrs"},{"item":"IV Octreotide 100 mcg every 6–12 hrs to reduce pancreatic secretions"},{"item":"Early enteral nutrition via nasojejunal tube (superior to TPN) within 48 hrs if tolerated"},{"item":"ERCP for gallstone pancreatitis with choledocholithiasis within 72 hrs"}]',
 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
((SELECT id FROM protocols WHERE condition_id='ckd'), 1, 'Slow Progression',
 'Target underlying cause and optimise BP, glucose, and proteinuria.',
 '[{"item":"BP target: <130/80 mmHg; ACE inhibitor or ARB first-line (reduces proteinuria and slows CKD progression)"},{"item":"Diabetes: tight glycaemic control HbA1c <7%; SGLT2 inhibitors have additional renoprotective effect"},{"item":"Dietary protein restriction: 0.6–0.8 g/kg/day in CKD stages 3–4"},{"item":"Avoid NSAIDs, contrast agents, aminoglycosides without close monitoring"},{"item":"Adjust drug doses for eGFR"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='ckd'), 2, 'Complication Management',
 'Treat anaemia, bone disease, acidosis, and hyperkalaemia.',
 '[{"item":"Anaemia: target Hb 10–12 g/dL; IV/oral iron first; Erythropoietin if Hb <10 and iron-replete"},{"item":"Renal bone disease: restrict phosphate; phosphate binders (calcium carbonate) with meals; alfacalcidol (active vitamin D)"},{"item":"Metabolic acidosis: oral sodium bicarbonate 500 mg–2 g three times daily if bicarbonate <22 mmol/L"},{"item":"Hyperkalaemia: dietary restriction; review medications (ACE inhibitor, K-sparing diuretics); calcium resonium"},{"item":"Hypertension: loop diuretic (furosemide) preferred in CKD stages 3–5"}]',
 'moderate'),
((SELECT id FROM protocols WHERE condition_id='ckd'), 3, 'Renal Replacement Therapy',
 'Prepare for dialysis or transplant when eGFR approaches 15 mL/min.',
 '[{"item":"Refer to nephrology when eGFR <30 mL/min (CKD stage 4)"},{"item":"Create AV fistula for haemodialysis at eGFR <20 mL/min (requires 6 months to mature)"},{"item":"Peritoneal dialysis or haemodialysis — start when symptomatic uraemia or eGFR <10"},{"item":"Renal transplant: optimal therapy — refer early for pre-emptive assessment"}]',
 'moderate');

-- ─── RX ENTRIES ──────────────────────────────────────────────────────────────

-- Depression Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('depression','Sertraline','SSRI antidepressant','First-line antidepressant — preferred in cardiac disease','50 mg; uptitrate to 100–200 mg after 2–4 weeks','Once daily','Oral','Minimum 6 months after remission','Best tolerated SSRI. Start with 25 mg in elderly. Side effects: GI upset (take with food), sexual dysfunction, initial anxiety. Do not stop abruptly — taper over 4 weeks',1,'GP 3rd Ed'),
('depression','Fluoxetine','SSRI antidepressant','First-line antidepressant — preferred in young adults','20 mg; uptitrate to 40–60 mg','Once daily (morning)','Oral','Minimum 6 months','Long half-life — less discontinuation syndrome. Most activating SSRI — may worsen anxiety initially. Drug interactions via CYP2D6',1,'STG 2013'),
('depression','Amitriptyline','Tricyclic antidepressant (TCA)','Depression with insomnia or chronic pain','25–75 mg nocte; max 150 mg','Once at night','Oral','Minimum 6 months','High anticholinergic side effects: dry mouth, constipation, urinary retention, sedation. Cardiotoxic in overdose — avoid in high suicide risk. Useful for comorbid neuropathic pain',2,'STG 2013'),
('depression','Mirtazapine','Noradrenergic antidepressant','Depression with insomnia or weight loss','15 mg nocte; uptitrate to 30–45 mg','Once at night','Oral','Minimum 6 months','Sedating — beneficial if insomnia. Increases appetite — useful if weight loss. Low sexual dysfunction risk. Good augmentation agent',2,'GP 3rd Ed');

-- Bipolar Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('bipolar','Lithium Carbonate','Mood stabiliser','Bipolar prophylaxis and acute mania','400–600 mg BD; titrate to serum level 0.6–1.0 mmol/L','Twice daily','Oral','Lifelong','Narrow therapeutic index — monitor serum lithium levels, renal function, TFTs every 6 months. Toxicity: tremor, polyuria, diarrhoea, confusion. Teratogenic (Ebstein anomaly) — contraception essential',1,'STG 2013'),
('bipolar','Sodium Valproate','Anticonvulsant mood stabiliser','Bipolar prophylaxis and acute mania','600–2000 mg/day in divided doses','Two to three times daily','Oral','Lifelong','Highly teratogenic — avoid in women of childbearing age (neural tube defects, autism). Monitor LFTs and FBC. Weight gain common',1,'STG 2013'),
('bipolar','Olanzapine','Atypical antipsychotic','Acute manic episode','5–20 mg','Once daily','Oral','Acute phase only then review','Rapid onset in acute mania. Significant metabolic side effects: weight gain, diabetes, dyslipidaemia. Monitor glucose and lipids',2,'STG 2013'),
('bipolar','Lamotrigine','Anticonvulsant mood stabiliser','Bipolar depression prevention (not acute mania)','25 mg/day → 100–200 mg/day (titrate VERY slowly)','Once or twice daily','Oral','Lifelong','Titrate slowly — risk of Stevens-Johnson syndrome with rapid escalation. Preferred in women of reproductive age over valproate for depression prevention',2,'STG 2013');

-- Schizophrenia Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('schizophrenia','Risperidone','Atypical antipsychotic (D2+5HT2 antagonist)','Schizophrenia — first-line','2 mg; uptitrate to 4–8 mg/day','Once or twice daily','Oral','Lifelong','Lower EPS than typical antipsychotics at therapeutic doses. Side effects: hyperprolactinaemia, weight gain, QT prolongation. Available as long-acting injection (Consta) for non-compliance',1,'STG 2013'),
('schizophrenia','Olanzapine','Atypical antipsychotic','Schizophrenia — first-line','5–20 mg/day','Once daily','Oral or IM','Lifelong','Effective for both positive and negative symptoms. Significant metabolic side effects — monitor weight, glucose, lipids. IM for acute agitation',1,'STG 2013'),
('schizophrenia','Haloperidol','Typical antipsychotic (D2 antagonist)','Acute psychosis or IM for agitation','Oral: 2–10 mg/day; IM: 5 mg stat','Once to three times daily','Oral or IM','Acute phase or long-term','High EPS risk (dystonia, akathisia, tardive dyskinesia) — add trihexyphenidyl 2–6 mg/day to prevent. Available as depot (Decanoate) for monthly injection',2,'STG 2013'),
('schizophrenia','Trihexyphenidyl (Benzhexol)','Anticholinergic','Prevent EPS from typical antipsychotics','2–6 mg/day','Two to three times daily','Oral','During typical antipsychotic use','Co-prescribe with typical antipsychotics. Reduces dystonia, rigidity, tremor. Can cause confusion, urinary retention in elderly',2,'STG 2013');

-- Allergic Rhinitis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('allergic_rhinitis','Cetirizine','Non-sedating H1 antihistamine','Symptomatic relief of sneezing and rhinorrhoea','10 mg','Once daily','Oral','During allergen season or continuous','Minimal sedation compared to older antihistamines. Also available as 5 mg for children. Effective for ocular symptoms too',1,'STG 2013'),
('allergic_rhinitis','Beclomethasone Nasal Spray','Intranasal corticosteroid','Nasal obstruction and rhinorrhoea — best for chronic/perennial','50 mcg per nostril (2 puffs each)','Twice daily','Intranasal','Continuous during exposure','Most effective treatment for nasal symptoms. Takes 2–4 weeks for full effect. Rinse nose after use. Minimal systemic absorption',1,'STG 2013'),
('allergic_rhinitis','Xylometazoline Nasal Drops','Alpha-adrenergic nasal decongestant','Short-term nasal decongestion','0.1% — 2–3 drops each nostril','Two to three times daily','Intranasal','Maximum 5–7 days','Use for short-term relief only — prolonged use causes rhinitis medicamentosa (rebound congestion). Do not use in children <6 years',2,'STG 2013');

-- Acute Otitis Media Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('acute_otitis','Amoxicillin','Aminopenicillin antibiotic','Bacterial AOM — first-line antibiotic','500 mg (adult); 40–90 mg/kg/day (child)','Three times daily','Oral','5–7 days (child <2 yr: 10 days)','Antibiotics only if: <2 years, bilateral disease, severe otalgia, systemic illness, no improvement at 72 hrs. 70% resolve spontaneously',1,'STG 2013'),
('acute_otitis','Paracetamol','Analgesic/Antipyretic','Pain and fever relief','500–1000 mg (adult); 10–15 mg/kg (child)','Every 6 hours','Oral','As needed','Always prescribe analgesic regardless of antibiotic decision. Ibuprofen is equally effective for pain',1,'STG 2013'),
('acute_otitis','Xylometazoline Nasal Drops','Nasal decongestant','Reduce eustachian tube congestion','2 drops each nostril','Twice daily','Intranasal','5 days maximum','Reduces eustachian tube oedema. Use with antibiotic therapy',2,'STG 2013');

-- Acute Sinusitis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('acute_sinusitis','Amoxicillin','Aminopenicillin antibiotic','Bacterial sinusitis (symptoms >10 days or biphasic worsening)','500 mg','Three times daily','Oral','5–7 days','Most viral sinusitis resolves without antibiotics. Use antibiotics only if bacterial features. If penicillin-allergic: Doxycycline or Azithromycin',1,'STG 2013'),
('acute_sinusitis','Ibuprofen','NSAID analgesic','Facial pain and fever','400 mg','Three times daily with food','Oral','5 days','Take with food. Effective for facial pain and fever. Avoid if peptic ulcer, renal impairment, or pregnancy',1,'STG 2013'),
('acute_sinusitis','Saline Nasal Irrigation','Non-pharmacological adjunct','Mucociliary clearance and symptom relief','Isotonic saline nasal wash','2–3 times daily','Intranasal','Duration of symptoms','Normal saline 0.9% or commercial saline spray. Effective adjunct to antibiotics. Reduces symptom duration',1,'STG 2013');

-- Acute Tonsillitis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('acute_tonsillitis','Amoxicillin','Aminopenicillin','Group A streptococcal tonsillitis','500 mg','Three times daily','Oral','5–7 days','Do NOT use in glandular fever (EBV) — risk of amoxicillin rash. Check for penicillin allergy. Phenoxymethylpenicillin (Pen V) is alternative',1,'STG 2013'),
('acute_tonsillitis','Azithromycin','Macrolide antibiotic','Penicillin allergy or resistant strep','500 mg day 1 then 250 mg','Once daily','Oral','5 days','Use if penicillin-allergic. Check local resistance patterns for Group A strep. Also covers atypicals',2,'STG 2013'),
('acute_tonsillitis','Paracetamol','Analgesic/Antipyretic','Throat pain and fever','500–1000 mg','Every 6–8 hours','Oral','As needed','Dissolve in water and gargle before swallowing for local pain relief. Ibuprofen equally effective',1,'STG 2013');

-- COPD Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('copd','Salbutamol Inhaler','Short-acting beta-2 agonist (SABA)','Reliever for acute dyspnoea in COPD','100–200 mcg (1–2 puffs)','As needed','Inhaled','As needed','Use with spacer. Also nebulise 2.5 mg for acute exacerbations. If needed >4×/day — step up maintenance therapy',1,'STG 2013'),
('copd','Tiotropium Inhaler','Long-acting anticholinergic (LAMA)','Maintenance bronchodilation — GOLD II and above','18 mcg (HandiHaler) or 2.5 mcg (Respimat 2 puffs)','Once daily','Inhaled','Lifelong','Superior to ipratropium for COPD maintenance. Reduces exacerbations, improves exercise tolerance. Do not use HandiHaler capsules in spiriva Respimat device',1,'STG 2013 / GOLD'),
('copd','Prednisolone','Oral corticosteroid','Acute COPD exacerbation','30–40 mg','Once daily (morning)','Oral','5 days','Does NOT improve long-term COPD outcomes — acute exacerbation only. Prolonged use causes osteoporosis, diabetes, immunosuppression',1,'STG 2013'),
('copd','Amoxicillin','Antibiotic','Acute COPD exacerbation with purulent sputum','500 mg','Three times daily','Oral','5–7 days','Antibiotics only if purulent sputum or fever. Alternatives: Doxycycline 100 mg BD or Co-amoxiclav if resistant strains suspected',2,'STG 2013');

-- Acute Pancreatitis Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('acute_pancreatitis','Ringer''s Lactate IV','Isotonic crystalloid','Aggressive fluid resuscitation','250–500 mL/hr for first 12–24 hrs then adjusted','Continuous infusion','IV','Until oral tolerated','Preferred over normal saline (reduces inflammatory response). Target urine output >0.5 mL/kg/hr. Monitor for fluid overload',1,'STG 2013'),
('acute_pancreatitis','Tramadol','Opioid analgesic','Pain management in pancreatitis','50–100 mg','Every 6–8 hours','IV or IM','As needed','Preferred over morphine historically (less sphincter of Oddi spasm). Titrate to pain relief. IV morphine is also acceptable and commonly used',1,'STG 2013'),
('acute_pancreatitis','Pantoprazole','Proton pump inhibitor','Stress ulcer prophylaxis and reduce acid secretion','40 mg','Twice daily','IV','Duration of hospitalisation','Switch to oral when tolerating diet',1,'STG 2013'),
('acute_pancreatitis','Meropenem','Carbapenem antibiotic','Infected pancreatic necrosis only','1 g','Every 8 hours','IV','14 days minimum','Use ONLY for confirmed infected necrosis — not prophylactic. Prophylactic antibiotics do NOT reduce mortality in acute pancreatitis',2,'STG 2013');

-- Chikungunya Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('chikungunya','Paracetamol','Antipyretic/Analgesic','Fever and acute arthralgia — first-line','500–1000 mg','Three to four times daily','Oral','As needed during acute phase','AVOID aspirin and NSAIDs in first 5 days — risk of Reye''s syndrome and dengue co-infection bleeding risk. Can add NSAIDs after day 5 if dengue excluded',1,'STG 2013'),
('chikungunya','Hydroxychloroquine','Antimalarial/DMARD','Persistent arthralgia >4 weeks (post-chikungunya arthritis)','200 mg','Once daily','Oral','4 weeks','For refractory arthralgia. Monitor visual acuity — retinal toxicity risk. Check G6PD if relevant',2,'STG 2013'),
('chikungunya','Ibuprofen','NSAID','Arthralgia after dengue excluded (>day 5)','400 mg','Three times daily with food','Oral','As needed','Only use after dengue excluded (due to bleeding risk). Take with food. Avoid if peptic ulcer or renal impairment',2,'STG 2013');

-- Chickenpox Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('chickenpox','Acyclovir (oral)','Antiviral (nucleoside analogue)','Chickenpox in adults, adolescents >12 yr, and high-risk children','800 mg (adult); 20 mg/kg (child, max 800 mg)','Five times daily','Oral','7 days (adult); 5 days (child)','Start within 24 hrs of rash onset for maximum benefit. Indicated for all adults and adolescents (severe disease). Neonates, immunocompromised, and severe cases need IV acyclovir',1,'STG 2013'),
('chickenpox','Calamine Lotion','Topical antipruritic','Pruritus relief','Apply to rash','Two to three times daily','Topical','Until crusting','Soothing and antipruritic. Keep nails short to reduce scratch infection. Avoid aspirin in children (Reye''s syndrome)',1,'STG 2013'),
('chickenpox','Chlorphenamine (Chlorpheniramine)','H1 antihistamine','Pruritus relief','4 mg (adult); 0.1 mg/kg (child)','Three to four times daily','Oral','As needed','Sedating — may help with night-time pruritus and sleep. Caution in young children',2,'STG 2013');

-- Herpes Zoster Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('herpes_zoster','Valacyclovir','Antiviral prodrug of acyclovir','Herpes zoster — first-line (better bioavailability than acyclovir)','1000 mg','Three times daily','Oral','7 days','Start within 72 hrs of rash onset. Reduces duration of rash, pain, and post-herpetic neuralgia. Preferred over acyclovir due to simpler dosing',1,'STG 2013'),
('herpes_zoster','Acyclovir (oral)','Antiviral','Herpes zoster — alternative to valacyclovir','800 mg','Five times daily','Oral','7 days','Start within 72 hrs. 5× daily dosing makes compliance difficult — valacyclovir preferred when available',2,'STG 2013'),
('herpes_zoster','Amitriptyline','Tricyclic antidepressant','Post-herpetic neuralgia prevention and treatment','10–25 mg nocte; uptitrate to 75 mg','Once at night','Oral','3–6 months','Start prophylactically at rash onset in elderly (>60 yr) to reduce post-herpetic neuralgia. Also effective for established PHN',2,'GP 3rd Ed'),
('herpes_zoster','Pregabalin','Alpha-2 delta ligand anticonvulsant','Post-herpetic neuralgia','75–150 mg','Twice daily','Oral','Review at 3 months','Effective for neuropathic pain. Causes dizziness and sedation — start low. Gabapentin is alternative at 300–1200 mg three times daily',2,'GP 3rd Ed');

-- CKD Rx
INSERT OR IGNORE INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
('ckd','Enalapril','ACE inhibitor','Reduce proteinuria and slow CKD progression in diabetic/hypertensive CKD','5 mg; uptitrate to 10–20 mg','Once or twice daily','Oral','Lifelong','Monitor K+ and creatinine 1–2 weeks after starting or dose increase. Acceptable if creatinine rises <30% from baseline and K+ <6.0',1,'STG 2013'),
('ckd','Furosemide','Loop diuretic','Fluid overload and hypertension in CKD stages 3–5','40–160 mg','Once or twice daily','Oral','Lifelong','Thiazides ineffective at eGFR <30 — use loop diuretic instead. Monitor electrolytes. Reduce dose if excessive volume depletion',1,'STG 2013'),
('ckd','Calcium Carbonate','Phosphate binder','Hyperphosphataemia in CKD stages 3–5','500–1500 mg elemental calcium with meals','With each meal','Oral','Lifelong','Binds dietary phosphate in gut. Take WITH food. Monitor calcium — avoid if hypercalcaemic. Sevelamer is alternative if calcium >2.6 mmol/L',2,'STG 2013'),
('ckd','Erythropoietin (EPO)','Erythropoiesis-stimulating agent','Anaemia of CKD (Hb <10 g/dL despite iron-replete)','50–100 units/kg','3× weekly SC','SC injection','Ongoing — review monthly','Correct iron deficiency before starting EPO. Target Hb 10–12 g/dL — do not exceed 13 (increased stroke/thrombosis risk). Monitor BP — can cause hypertension',2,'STG 2013'),
('ckd','Sodium Bicarbonate','Alkalinising agent','Metabolic acidosis (serum bicarbonate <22 mmol/L)','500 mg','Two to three times daily','Oral','Lifelong','Reduces rate of CKD progression and muscle wasting. Avoid if fluid overloaded (sodium load)',2,'STG 2013');

COMMIT;
