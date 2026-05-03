-- Chunk 7: 15 more conditions
-- Hypoglycaemia, Hypertensive Emergency, Status Epilepticus, AKI,
-- Acute Severe Asthma, Gestational Diabetes, Preterm Labour,
-- Endometriosis, Menopause, Postnatal Depression,
-- Malnutrition (SAM), Tetanus, Rabies PEP, Carpal Tunnel, Frozen Shoulder

-- ── Systems ───────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO systems (id, name, icon, color, order_index) VALUES
  ('womens_health','Women''s Health','heart','#FF375F',22),
  ('preventive','Preventive / Public Health','shield','#30D158',23);

-- ── Conditions ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('hypoglycaemia','Hypoglycaemia','endocrinology','E16.0',
   'Blood glucose <3.9 mmol/L (70 mg/dL) with or without symptoms. Most common in patients with diabetes on insulin or sulfonylureas. Symptoms progress from autonomic (sweating, tremor, palpitations) to neuroglycopenic (confusion, seizure, coma). Treat immediately.','hypoglycaemia'),
  ('hypertensive_emergency','Hypertensive Emergency / Crisis','cardiology','I10',
   'Severely elevated BP (>180/120 mmHg) with acute end-organ damage (hypertensive emergency) or without end-organ damage (urgency). Emergency: encephalopathy, aortic dissection, acute HF, ACS, eclampsia, renal failure. Urgency: BP reduction over hours (oral); Emergency: minutes (IV).','hypertensive-emergency'),
  ('status_epilepticus','Status Epilepticus','neurology','G41',
   'Continuous seizure activity lasting >5 minutes, or two or more seizures without full recovery of consciousness. Medical emergency. Causes: antiepileptic drug withdrawal, infection (meningitis/encephalitis), metabolic disturbance, stroke, tumour, trauma, toxins.','status-epilepticus'),
  ('aki','Acute Kidney Injury (AKI)','urology','N17',
   'Abrupt decline in renal function — rise in serum creatinine ≥26.5 µmol/L within 48 hours, or ≥1.5x baseline within 7 days, or urine output <0.5 mL/kg/hour for >6 hours. Pre-renal (60%), intrinsic (35%), post-renal (5%). Rapidly reversible if treated early.','aki'),
  ('acute_severe_asthma','Acute Severe Asthma','respiratory','J46',
   'Life-threatening exacerbation of bronchial asthma. Features of severe/life-threatening attack: PEFR <33% predicted, SpO2 <92%, PaCO2 normal/raised, silent chest, cyanosis, exhaustion, altered consciousness, bradycardia. Requires immediate aggressive treatment.','acute-severe-asthma'),
  ('gestational_diabetes','Gestational Diabetes Mellitus (GDM)','obstetrics','O24.4',
   'Glucose intolerance first diagnosed during pregnancy. Risk factors: obesity, family history of T2DM, previous GDM, macrosomic baby, PCOS, South Asian ethnicity. Risks to fetus: macrosomia, shoulder dystocia, hypoglycaemia. Managed by diet, exercise, and insulin if needed.','gestational-diabetes'),
  ('preterm_labour','Preterm Labour','obstetrics','O60',
   'Onset of regular uterine contractions with cervical change before 37 completed weeks of gestation. Significant cause of neonatal mortality and morbidity. Aim: delay delivery to allow corticosteroids for fetal lung maturity and in-utero transfer to tertiary centre.','preterm-labour'),
  ('endometriosis','Endometriosis','womens_health','N80',
   'Presence of endometrial-like tissue outside the uterus (ovaries, pouch of Douglas, peritoneum). Causes chronic pelvic pain, dysmenorrhoea, dyspareunia, and infertility. Diagnosis confirmed by laparoscopy. Oestrogen-dependent — regresses at menopause.','endometriosis'),
  ('menopause','Menopause and Perimenopause','womens_health','N95.1',
   'Permanent cessation of menstruation due to loss of ovarian follicular activity. Defined as 12 months of amenorrhoea. Average age 51 years. Perimenopause: hormonal fluctuations with irregular periods. Symptoms: vasomotor (hot flushes), urogenital atrophy, mood changes, insomnia, bone loss.','menopause'),
  ('postnatal_depression','Postnatal Depression','psychiatry','F53.0',
   'Depressive episode occurring within the first year postpartum. Prevalence ~10–15%. Risk factors: personal/family history of depression, lack of social support, perinatal loss, birth trauma. Distinct from ''baby blues'' (days 3–5, transient) and postpartum psychosis (emergency).','postnatal-depression'),
  ('malnutrition_sam','Severe Acute Malnutrition (SAM)','paediatric_infections','E43',
   'Life-threatening severe malnutrition in children: MUAC <115 mm, weight-for-height Z-score <−3, or bilateral pitting oedema (kwashiorkor). High risk of mortality from sepsis, hypoglycaemia, hypothermia. Managed with F-75/F-100 therapeutic milk formulas and ReSoMal.','sam'),
  ('tetanus','Tetanus','preventive','A35',
   'Acute potentially fatal infectious disease caused by Clostridium tetani toxin (tetanospasmin). Causes painful muscle spasms (trismus, risus sardonicus, opisthotonus) and autonomic instability. Preventable by vaccination. Entry via contaminated wounds.','tetanus'),
  ('rabies_pep','Rabies Post-Exposure Prophylaxis (PEP)','preventive','Z20.3',
   'Rabies is almost universally fatal once symptomatic. Post-exposure prophylaxis (wound washing + RIG + vaccine) is nearly 100% effective if given promptly after animal bite. Stray dog bites are the most common source in South Asia. Immediate wound care is first priority.','rabies-pep'),
  ('carpal_tunnel','Carpal Tunnel Syndrome','musculoskeletal','G56.0',
   'Compression of median nerve within the carpal tunnel at the wrist. Most common peripheral entrapment neuropathy. Presents with numbness, tingling, and pain in median nerve distribution (thumb, index, middle, and radial half of ring finger). Worse at night. Associated with pregnancy, hypothyroidism, diabetes, repetitive wrist use.','carpal-tunnel'),
  ('frozen_shoulder','Frozen Shoulder (Adhesive Capsulitis)','musculoskeletal','M75.0',
   'Gradual onset of painful restriction of glenohumeral joint movement in all planes due to capsular fibrosis. Progresses through 3 phases: freezing (painful, 3–9 months), frozen (stiff, 9–15 months), thawing (resolves, 15–24 months). Associated with diabetes, thyroid disease.','frozen-shoulder');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- Hypoglycaemia
  ('hypoglycaemia','Sweating, tremor, palpitations, anxiety (autonomic symptoms)',0,'autonomic'),
  ('hypoglycaemia','Confusion, slurred speech, blurred vision, difficulty concentrating',1,'neuroglycopenic'),
  ('hypoglycaemia','Seizure or loss of consciousness (severe)',1,'severe'),
  ('hypoglycaemia','Pallor and diaphoresis',0,'sign'),
  ('hypoglycaemia','Hypoglycaemia unawareness (no autonomic warning) in long-standing T1DM',1,'dangerous'),
  -- Hypertensive Emergency
  ('hypertensive_emergency','BP ≥180/120 mmHg',1,'core'),
  ('hypertensive_emergency','Severe headache, altered consciousness (hypertensive encephalopathy)',1,'CNS'),
  ('hypertensive_emergency','Visual disturbance (papilloedema, haemorrhages)',1,'CNS'),
  ('hypertensive_emergency','Chest pain or back pain (aortic dissection)',1,'cardiac'),
  ('hypertensive_emergency','Dyspnoea (acute pulmonary oedema)',1,'pulmonary'),
  ('hypertensive_emergency','Oliguria, haematuria (renal emergency)',1,'renal'),
  -- Status Epilepticus
  ('status_epilepticus','Continuous tonic-clonic seizure activity >5 minutes',1,'core'),
  ('status_epilepticus','Failure to regain consciousness between seizures',1,'core'),
  ('status_epilepticus','Cyanosis, tongue bite, urinary incontinence',1,'associated'),
  ('status_epilepticus','Post-ictal confusion progressing to unresponsiveness',1,'sign'),
  -- AKI
  ('aki','Oliguria (urine output <0.5 mL/kg/hour)',1,'core'),
  ('aki','Rising serum creatinine and urea',1,'lab'),
  ('aki','Fluid overload: oedema, raised JVP, pulmonary oedema',1,'sign'),
  ('aki','Hyperkalaemia: ECG changes (peaked T waves, wide QRS)',1,'dangerous'),
  ('aki','Uraemic encephalopathy, pericarditis (severe AKI)',1,'severe'),
  -- Acute Severe Asthma
  ('acute_severe_asthma','Inability to complete sentences in one breath',1,'severe'),
  ('acute_severe_asthma','PEFR <50% (severe) or <33% (life-threatening)',1,'severity'),
  ('acute_severe_asthma','SpO2 <92% on air',1,'life_threatening'),
  ('acute_severe_asthma','Silent chest on auscultation (life-threatening — exhaustion)',1,'emergency'),
  ('acute_severe_asthma','Cyanosis, confusion, bradycardia, or exhaustion',1,'emergency'),
  -- Gestational Diabetes
  ('gestational_diabetes','Usually asymptomatic — detected on glucose tolerance test',0,'note'),
  ('gestational_diabetes','Polyuria, polydipsia, recurrent candidiasis',0,'symptoms'),
  ('gestational_diabetes','Macrosomic baby (fundal height larger than dates)',0,'fetal'),
  ('gestational_diabetes','Hydramnios (excess amniotic fluid)',0,'fetal'),
  -- Preterm Labour
  ('preterm_labour','Regular uterine contractions before 37 weeks',1,'core'),
  ('preterm_labour','Cervical dilation or effacement on examination',1,'sign'),
  ('preterm_labour','Rupture of membranes before 37 weeks (PPROM)',1,'pprom'),
  ('preterm_labour','Pelvic pressure or low back pain',0,'typical'),
  -- Endometriosis
  ('endometriosis','Dysmenorrhoea (often progressive, increasingly severe)',0,'core'),
  ('endometriosis','Chronic pelvic pain throughout cycle',0,'core'),
  ('endometriosis','Dyspareunia (deep dyspareunia)',0,'typical'),
  ('endometriosis','Subfertility or infertility',0,'reproductive'),
  ('endometriosis','Dyschezia (painful defecation at menstruation)',0,'bowel'),
  -- Menopause
  ('menopause','Hot flushes and night sweats (vasomotor symptoms)',0,'vasomotor'),
  ('menopause','Irregular periods transitioning to amenorrhoea',0,'menstrual'),
  ('menopause','Vaginal dryness, dyspareunia (urogenital atrophy)',0,'urogenital'),
  ('menopause','Mood changes, irritability, low mood',0,'mood'),
  ('menopause','Insomnia and fatigue',0,'sleep'),
  ('menopause','Increased bone loss (osteoporosis risk)',0,'bone'),
  -- Postnatal Depression
  ('postnatal_depression','Persistent low mood or tearfulness (>2 weeks postpartum)',0,'core'),
  ('postnatal_depression','Inability to bond with baby',0,'core'),
  ('postnatal_depression','Anxiety, panic, intrusive thoughts about harming baby',1,'severe'),
  ('postnatal_depression','Insomnia, fatigue beyond normal new mother tiredness',0,'typical'),
  ('postnatal_depression','Postpartum psychosis: hallucinations, delusions (emergency)',1,'emergency'),
  -- SAM
  ('malnutrition_sam','Severe wasting: MUAC <115 mm or WHZ <−3',1,'diagnostic'),
  ('malnutrition_sam','Bilateral pitting oedema of feet (kwashiorkor)',1,'kwashiorkor'),
  ('malnutrition_sam','Visible severe wasting — prominent ribs, loose skin folds (marasmus)',1,'marasmus'),
  ('malnutrition_sam','Failure to thrive, poor appetite, recurrent infections',0,'typical'),
  ('malnutrition_sam','Hypoglycaemia, hypothermia, dehydration (complications)',1,'emergency'),
  -- Tetanus
  ('tetanus','Trismus (lockjaw) — inability to open mouth',1,'core'),
  ('tetanus','Risus sardonicus (spastic facial expression)',1,'classic'),
  ('tetanus','Opisthotonus (spasms of back muscles arching body backward)',1,'classic'),
  ('tetanus','Muscle stiffness and painful generalised spasms triggered by stimuli',1,'core'),
  ('tetanus','Autonomic instability: tachycardia, hypertension, sweating',1,'severe'),
  ('tetanus','Respiratory failure from laryngospasm',1,'emergency'),
  -- Rabies PEP
  ('rabies_pep','Animal bite or scratch (especially dog, bat, monkey)',0,'exposure'),
  ('rabies_pep','Wound location: head/neck bites have highest risk',1,'high_risk'),
  ('rabies_pep','Encephalitic phase if untreated: hydrophobia, aerophobia, agitation (irreversible)',1,'fatal'),
  -- Carpal Tunnel
  ('carpal_tunnel','Numbness and tingling in thumb, index, middle, radial ring finger',0,'core'),
  ('carpal_tunnel','Symptoms worse at night, relieved by shaking hand',0,'characteristic'),
  ('carpal_tunnel','Positive Tinel''s sign (tingling on tapping carpal tunnel)',0,'sign'),
  ('carpal_tunnel','Positive Phalen''s test (wrist flexion reproduces symptoms)',0,'sign'),
  ('carpal_tunnel','Thenar muscle wasting in severe cases',1,'severe'),
  -- Frozen Shoulder
  ('frozen_shoulder','Gradual onset of shoulder pain progressing to severe restriction of movement',0,'core'),
  ('frozen_shoulder','Loss of external rotation most prominent sign',0,'sign'),
  ('frozen_shoulder','Pain at rest and at night, disturbing sleep',0,'painful'),
  ('frozen_shoulder','Global restriction of glenohumeral movement in all planes',0,'sign');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('hypoglycaemia','Hypoglycaemia Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('hypertensive_emergency','Hypertensive Emergency Management Protocol','Gujarat STG 2013',2013),
  ('status_epilepticus','Status Epilepticus Management Protocol','Gujarat STG 2013',2013),
  ('aki','Acute Kidney Injury Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('acute_severe_asthma','Acute Severe Asthma Management Protocol','Gujarat STG 2013',2013),
  ('gestational_diabetes','Gestational Diabetes Management Protocol','Gujarat STG 2013',2013),
  ('preterm_labour','Preterm Labour Management Protocol','Gujarat STG 2013',2013),
  ('endometriosis','Endometriosis Management Protocol','Murtagh GP 3rd Ed',2001),
  ('menopause','Menopause Management Protocol','Murtagh GP 3rd Ed',2001),
  ('postnatal_depression','Postnatal Depression Management Protocol','Murtagh GP 3rd Ed',2001),
  ('malnutrition_sam','SAM Management Protocol (WHO)','Gujarat STG 2013',2013),
  ('tetanus','Tetanus Management Protocol','Gujarat STG 2013',2013),
  ('rabies_pep','Rabies Post-Exposure Prophylaxis Protocol','Gujarat STG 2013',2013),
  ('carpal_tunnel','Carpal Tunnel Syndrome Management Protocol','Murtagh GP 3rd Ed',2001),
  ('frozen_shoulder','Frozen Shoulder Management Protocol','Murtagh GP 3rd Ed',2001);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- Hypoglycaemia
  ((SELECT id FROM protocols WHERE condition_id='hypoglycaemia'),1,'Conscious Patient (Mild-Moderate)',
   '15–20 g fast-acting carbohydrate: 150–200 mL fruit juice or regular (non-diet) fizzy drink, or 4–5 glucose tablets, or 3–4 teaspoons of sugar. Re-check BGL in 15 minutes. Repeat if still <4 mmol/L. Once BGL >4 mmol/L: give long-acting carbohydrate (biscuits, sandwich, meal) to prevent recurrence. Do not give fat-containing foods first (slow absorption).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='hypoglycaemia'),2,'Unconscious or Unable to Swallow',
   'IV dextrose: 50 mL of 50% dextrose IV (or 100 mL of 25%) over 1–3 minutes. If no IV access: glucagon 1 mg IM (not useful in alcoholic hypoglycaemia or prolonged starvation — glycogen depleted). Recover position. Once conscious, give oral carbohydrates. Identify and address cause. Adjust insulin/sulfonylurea regimen.','severe'),

  -- Hypertensive Emergency
  ((SELECT id FROM protocols WHERE condition_id='hypertensive_emergency'),1,'Emergency (End-Organ Damage)',
   'Target: reduce MAP by no more than 25% in first hour, then to 160/100 mmHg over next 2–6 hours. Too rapid lowering causes ischaemia. IV labetalol 20 mg bolus every 10 min (max 300 mg) or infusion 1–2 mg/min. Alternatives: IV hydralazine 5–10 mg (useful in pregnancy), IV GTN infusion (for ACS/pulmonary oedema). Avoid sublingual nifedipine. ICU admission.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='hypertensive_emergency'),2,'Hypertensive Urgency (No End-Organ Damage)',
   'Oral antihypertensives; no need for emergency hospital admission unless symptomatic. Captopril 25 mg oral, or amlodipine 5–10 mg oral, or labetalol 200 mg oral. Reassess in 1–4 hours. Aim for gradual BP reduction over 24–48 hours. Investigate for secondary hypertension if no known cause. Optimise existing medications.','moderate'),

  -- Status Epilepticus
  ((SELECT id FROM protocols WHERE condition_id='status_epilepticus'),1,'Phase 1: Immediate (0–5 min)',
   'Lay patient on side (recovery position), protect head. Time seizure duration. High-flow oxygen. IV access. Blood: glucose, FBC, U&E, calcium, magnesium, LFTs, AED levels. If hypoglycaemia: 50 mL 50% dextrose IV + thiamine 100 mg IV (if alcoholism/malnutrition suspected).','severe'),
  ((SELECT id FROM protocols WHERE condition_id='status_epilepticus'),2,'Phase 2: Early Treatment (5–20 min)',
   'IV lorazepam 4 mg (0.1 mg/kg) over 2 min; can repeat once after 10 min. If no IV: midazolam 10 mg buccal (preferred pre-hospital) or diazepam 10–20 mg rectal. Most seizures terminate within 5 minutes of benzodiazepine.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='status_epilepticus'),3,'Phase 3: Established SE (20–60 min)',
   'If seizure continues after 2 benzodiazepine doses: IV levetiracetam 60 mg/kg (max 4500 mg) over 10 min, or IV phenytoin 20 mg/kg at max 50 mg/min with ECG monitoring, or IV valproate 40 mg/kg over 5–10 min. Anaesthesia and intubation for refractory SE (propofol, thiopental).','severe'),

  -- AKI
  ((SELECT id FROM protocols WHERE condition_id='aki'),1,'STOP and SEARCH (AEIOU)',
   'Stop nephrotoxins (NSAIDs, ACE inhibitors, ARBs, aminoglycosides, iodinated contrast). Check urine output, urinalysis, urine Na/Cr. Identify cause: Pre-renal (dehydration — fluid challenge), Intrinsic (ATN, glomerulonephritis), Post-renal (obstruction — catheter if retention, urgent USS).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='aki'),2,'Fluid Management',
   'Pre-renal AKI: IV fluid challenge 500 mL NS over 30 min — if responds (urine output increases), continue rehydration. Fluid-overloaded: cautious diuresis with furosemide 40–80 mg IV. Monitor fluid balance strictly. Target urine output ≥0.5 mL/kg/hour. Daily weight.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='aki'),3,'Hyperkalaemia and Renal Replacement',
   'K+ >6.5 mmol/L or ECG changes: calcium gluconate 10 mL of 10% IV (cardioprotective, 5 min), insulin + dextrose (actrapid 10 units + 50 mL 50% glucose IV), salbutamol 10–20 mg nebulised, calcium resonium 15–30 g oral/rectal. Renal replacement (dialysis) if: severe hyperkalaemia refractory, severe acidosis, fluid overload, uraemic complications.','severe'),

  -- Acute Severe Asthma
  ((SELECT id FROM protocols WHERE condition_id='acute_severe_asthma'),1,'Immediate Treatment',
   'Sit patient upright. High-flow oxygen (target SpO2 94–98%). Salbutamol 5 mg nebulised (driven with O2) every 15–20 min in first hour, or MDI 10 puffs via spacer every 10–20 min. Add ipratropium 500 µg to each nebuliser in severe/life-threatening attack. Systemic corticosteroid: prednisolone 40–50 mg oral or hydrocortisone 100 mg IV.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='acute_severe_asthma'),2,'Life-Threatening Features',
   'If life-threatening (silent chest, cyanosis, SpO2 <92%, bradycardia): add IV/IM magnesium sulfate 2 g IV over 20 minutes (bronchodilator), start IV aminophylline 5 mg/kg loading dose (if not on theophylline) + continuous salbutamol nebulisation. Prepare for intubation. ICU consultation. Consider single-breath heliox if available. Monitor PEFR, SpO2, ABG.','severe'),

  -- Gestational Diabetes
  ((SELECT id FROM protocols WHERE condition_id='gestational_diabetes'),1,'Screening and Diagnosis',
   'OGTT (75 g) at 24–28 weeks for all pregnant women at risk. GDM diagnosed if: fasting glucose ≥5.1 mmol/L, 1-hour ≥10.0, or 2-hour ≥8.5 mmol/L. High-risk groups tested early (1st trimester): BMI >30, previous GDM, family history, glycosuria.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='gestational_diabetes'),2,'Management',
   'Diet and exercise: DASH/Mediterranean diet, 30 min moderate exercise daily. Self-monitor blood glucose (fasting <5.3, 1-hour post-meal <7.8, 2-hour <6.4 mmol/L). If targets not met within 1–2 weeks: insulin (preferred in pregnancy): start with isophane (NPH) insulin at bedtime or rapid-acting with meals. Metformin acceptable as second-line. Monitor fetal growth by USS at 32 and 36 weeks.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gestational_diabetes'),3,'Postpartum',
   'Stop insulin immediately after delivery. 75 g OGTT 6–12 weeks postpartum. 50% of GDM women develop T2DM within 5 years — lifestyle modification critical. Annual fasting glucose screening lifelong. Breastfeeding encouraged (reduces T2DM risk).','mild'),

  -- Preterm Labour
  ((SELECT id FROM protocols WHERE condition_id='preterm_labour'),1,'Tocolysis (Delay Delivery 48 Hours)',
   'Goal: delay delivery 48 hours to allow corticosteroids to act. Nifedipine 20 mg oral then 10–20 mg every 6 hours (first-line tocolytic). Alternative: atosiban 6.75 mg IV bolus then infusion. Avoid beta-agonists (salbutamol IV) if cardiac disease or multiple pregnancy. Tocolysis not indicated >34 weeks.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='preterm_labour'),2,'Corticosteroids and Transfer',
   'Betamethasone 12 mg IM, repeat after 24 hours — reduces RDS, IVH, NEC in preterm neonate. Give at 24–34+6 weeks. Transfer to centre with NICU before delivery if possible. Magnesium sulfate 4 g IV loading dose for neuroprotection if delivery expected <32 weeks.','severe'),

  -- Endometriosis
  ((SELECT id FROM protocols WHERE condition_id='endometriosis'),1,'Medical Management',
   'First-line: NSAIDs for pain (ibuprofen 400 mg TDS during menses). Combined OCP (continuous or cyclic) reduces pain and slows progression. Progestins: medroxyprogesterone 10–30 mg/day or norethisterone 5 mg TDS. GnRH analogues (goserelin, leuprorelin) — induce medical menopause; use for 3–6 months with add-back HRT; for refractory severe endometriosis.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='endometriosis'),2,'Surgical Management',
   'Laparoscopic ablation or excision of endometriotic lesions — gold standard for diagnosis and treatment. Reduces pain in 70–80%. Ovarian cystectomy for endometrioma (>3 cm). Hysterectomy + bilateral salpingo-oophorectomy for severe disease when family complete. Recurrence common (50% at 5 years) — continue medical suppression post-surgery.','moderate'),

  -- Menopause
  ((SELECT id FROM protocols WHERE condition_id='menopause'),1,'Hormone Replacement Therapy (HRT)',
   'Indications: troublesome vasomotor symptoms, urogenital atrophy, premature menopause (<40). Regimens: oestrogen alone (hysterectomised women); combined oestrogen + progestogen (intact uterus). Oral or transdermal oestrogen (transdermal preferred — lower VTE and stroke risk). Duration: use lowest effective dose for shortest time; review annually. Generally safe for <5 years in women without contraindications.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='menopause'),2,'Non-Hormonal Options and Bone Protection',
   'Hot flushes: venlafaxine 75 mg/day or clonidine 50 µg BD (modest effect). Vaginal dryness: topical oestrogen (local, minimal systemic absorption — safe long-term). Osteoporosis prevention: calcium + Vitamin D + weight-bearing exercise. DEXA scan if risk factors. Bisphosphonate if T-score ≤ −2.5.','mild'),

  -- Postnatal Depression
  ((SELECT id FROM protocols WHERE condition_id='postnatal_depression'),1,'Assessment and Non-Pharmacological',
   'Edinburgh Postnatal Depression Scale (EPDS) ≥12 suggests depression. Assess suicide risk and risk to baby. If mild: enhanced support, psychoeducation, peer support groups, health visitor involvement, CBT. Involve partner and family. Prioritise sleep (shared baby care). Assess safeguarding of infant.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='postnatal_depression'),2,'Antidepressants',
   'Indicate when moderate-severe depression, or inadequate response to psychological therapy, or breastfeeding (discuss risks/benefits). Sertraline 50–200 mg OD: first-line in breastfeeding (lowest milk transfer). Paroxetine 10–20 mg OD: alternative. Start low, titrate slowly. Take 4–6 weeks for full effect. Treat for minimum 6 months. Postpartum psychosis: emergency psychiatric admission.','moderate'),

  -- SAM
  ((SELECT id FROM protocols WHERE condition_id='malnutrition_sam'),1,'Stabilisation Phase (F-75, Weeks 1–2)',
   'Treat complications: hypoglycaemia (10% glucose oral/NG), hypothermia (warm child, skin-to-skin, blankets), dehydration (ReSoMal 5–10 mL/kg/hour — NOT standard ORS, as SAM children at risk of fluid overload and cardiac failure). Treat infections: amoxicillin 50 mg/kg/day + gentamicin if severely ill. Feed F-75 formula 100 mL/kg/day in 8–12 feeds. Micronutrients.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='malnutrition_sam'),2,'Rehabilitation Phase (F-100/RUTF)',
   'Switch to F-100 (130 mL/kg/day) or ready-to-use therapeutic food (RUTF — Plumpy''Nut) when appetite returns and oedema resolving. Allow ad libitum feeding. Target weight gain >10 g/kg/day. Stimulation and play therapy. Vitamin A 200,000 IU single dose on day 1 (avoid in oedematous malnutrition initially). Discharge when WHZ >−2 for 2 consecutive measurements.','moderate'),

  -- Tetanus
  ((SELECT id FROM protocols WHERE condition_id='tetanus'),1,'Immediate Management',
   'Admit to quiet, dark room — minimise stimulation (triggers spasms). Secure airway; early intubation if laryngospasm risk. IV access. Wound debridement (remove necrotic tissue). Human tetanus immunoglobulin (TIG) 3000–6000 units IM as soon as possible (to neutralise unbound toxin; cannot reverse already-bound toxin). Metronidazole 500 mg TDS x 7 days (preferred over penicillin G for spore eradication).','severe'),
  ((SELECT id FROM protocols WHERE condition_id='tetanus'),2,'Muscle Spasm Control',
   'Diazepam 10–40 mg IV/NG QID titrated to spasm control (very large doses may be needed). Alternative: midazolam infusion. Magnesium sulfate 2–3 g/hour infusion for autonomic instability and spasm control. Patients may need mechanical ventilation. Baclofen intrathecal for severe cases. Recover in ICU. Tetanus toxoid vaccine (prevents recurrence — disease does not confer immunity).','severe'),

  -- Rabies PEP
  ((SELECT id FROM protocols WHERE condition_id='rabies_pep'),1,'Immediate Wound Care (First Priority)',
   'Wash wound thoroughly with soap and water for ≥15 minutes — most important step. Apply povidone-iodine 10% or 70% ethanol. Do NOT suture wound immediately (allows virus to drain). Tetanus prophylaxis. Assess risk: Category I (touching, no skin break — no PEP), Category II (minor scratch/abrasion — vaccine only), Category III (bite/scratch through skin, mucous membrane exposure, bat exposure — full PEP).','severe'),
  ((SELECT id FROM protocols WHERE condition_id='rabies_pep'),2,'Rabies PEP Regimen',
   'Category III (or unvaccinated Category II): Rabies immunoglobulin (RIG) 20 IU/kg: infiltrate as much as possible into wound, remainder IM at distant site. PLUS Rabies vaccine: 4-dose IM schedule (days 0, 3, 7, 14) into deltoid. Previously vaccinated: 2 doses only (days 0 and 3) — no RIG needed. Do not delay — start on day of exposure.','severe'),

  -- Carpal Tunnel
  ((SELECT id FROM protocols WHERE condition_id='carpal_tunnel'),1,'Conservative Management',
   'Wrist splint in neutral position at night (and during exacerbating activities) — first-line. Reduces symptoms in 80% at 4 weeks. Address contributing factors: hypothyroidism (treat), diabetes (optimise control), pregnancy (usually resolves after delivery). Corticosteroid injection: methylprednisolone 40 mg into carpal tunnel — effective for 6–12 months.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='carpal_tunnel'),2,'Surgical Decompression',
   'Carpal tunnel decompression (division of flexor retinaculum — open or endoscopic) if: failed 3 months conservative management, severe symptoms, thenar wasting, or neurophysiology showing denervation. High success rate (>85%). May refer if symptoms recur or thenar wasting present at first presentation.','moderate'),

  -- Frozen Shoulder
  ((SELECT id FROM protocols WHERE condition_id='frozen_shoulder'),1,'Physiotherapy and Analgesia',
   'Reassure: most cases resolve fully in 2–3 years. Analgesia: NSAIDs (ibuprofen 400 mg TDS) or paracetamol regularly. Physiotherapy: range-of-motion exercises (pendulum, Codman exercises), stretching — beneficial in all phases but less effective in freezing phase when very painful. Heat before exercise. Ice after.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='frozen_shoulder'),2,'Corticosteroid Injection',
   'Intra-articular or subacromial corticosteroid injection: methylprednisolone 40 mg + lignocaine — most effective in freezing (painful) phase; provides 4–8 weeks of significant pain relief and improves early range of motion. Can repeat once after 6 weeks. Hydrodilatation (distension arthrography) for refractory cases. Manipulation under anaesthesia or arthroscopic capsular release for severe persistent restriction.','moderate');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- Hypoglycaemia
  ('hypoglycaemia','Glucose (Dextrose)','Carbohydrate supplement','Mild conscious hypoglycaemia','15–20 g fast carbohydrate (150 mL juice or 4 glucose tablets)','Once; repeat if BGL <4 mmol/L at 15 min','Oral','Until BGL >4 mmol/L',1,
   'Follow with complex carbohydrate snack to prevent recurrence.','Gujarat STG 2013'),
  ('hypoglycaemia','Dextrose 50%','IV glucose','Severe hypoglycaemia (unconscious/unable to swallow)','50 mL of 50% dextrose','Slow IV bolus over 1–3 minutes','IV','Single bolus; repeat if no response in 10 min',1,
   'If no IV access: glucagon 1 mg IM. Flush cannula with NS after dextrose (sclerosant).','Gujarat STG 2013'),
  ('hypoglycaemia','Glucagon','Hyperglycaemic hormone','Severe hypoglycaemia (no IV access)','1 mg','Single IM dose','IM','Single dose',2,
   'Ineffective if patient has been fasting or alcoholic (depleted glycogen). Patient must eat after recovery.','Gujarat STG 2013'),

  -- Hypertensive Emergency
  ('hypertensive_emergency','Labetalol','Alpha/Beta-blocker','Hypertensive emergency (general)','20 mg IV bolus every 10 min (max 300 mg); or 1–2 mg/min infusion','IV repeated bolus or infusion','IV','Until target BP achieved then oral',1,
   'Avoid in asthma, bradycardia, decompensated heart failure.','Gujarat STG 2013'),
  ('hypertensive_emergency','Hydralazine','Vasodilator','Hypertensive emergency in pregnancy (eclampsia/pre-eclampsia)','5–10 mg IV over 20 min; repeat every 20–30 min (max 20 mg)','IV repeated doses','IV','Until target BP; then switch oral',1,
   'Drug of choice in pregnant hypertensive emergency (evidence-based).','Gujarat STG 2013'),
  ('hypertensive_emergency','GTN (Glyceryl Trinitrate) infusion','Nitrate','Hypertensive emergency with LVF/ACS','Start 5–10 µg/min, titrate to response','IV continuous infusion','IV','Until stabilised',2,
   'For hypertensive emergency complicated by acute LV failure or ACS. Causes headache, hypotension.','Gujarat STG 2013'),
  ('hypertensive_emergency','Captopril','ACE inhibitor','Hypertensive urgency (oral)','25 mg','Oral; reassess 1–4 hours','Oral','Single dose; then routine antihypertensive management',2,
   'Rapid oral agent for urgency. Monitor for first-dose hypotension. Contraindicated in pregnancy.','Gujarat STG 2013'),

  -- Status Epilepticus
  ('status_epilepticus','Lorazepam','Benzodiazepine','Status epilepticus first-line','0.1 mg/kg (typically 4 mg in adult)','IV over 2 min; repeat once after 10 min','IV','Two doses maximum',1,
   'Preferred IV benzodiazepine for SE — longer duration than diazepam. Respiratory depression risk.','Gujarat STG 2013'),
  ('status_epilepticus','Midazolam','Benzodiazepine','SE (no IV access — pre-hospital)','10 mg buccal (adult); 0.2 mg/kg','Buccal or intranasal','Buccal/IN','Single dose; repeat once',1,
   'Preferred pre-hospital route when no IV access. Buccal midazolam as effective as IV diazepam.','Gujarat STG 2013'),
  ('status_epilepticus','Levetiracetam','Antiepileptic','Established SE (failed 2 benzodiazepines)','60 mg/kg IV (max 4500 mg)','Over 10 minutes','IV','Single loading dose',1,
   'Preferred second-line for established SE. No cardiac or hepatic monitoring needed. Can use in children.','Gujarat STG 2013'),
  ('status_epilepticus','Phenytoin','Hydantoin antiepileptic','Established SE (alternative second-line)','20 mg/kg at max 50 mg/min','Slow IV with ECG monitoring','IV','Single loading dose; then maintenance',2,
   'Cardiac monitor required (bradycardia, arrhythmia risk). Do not exceed 50 mg/min. Dilute in NS only.','Gujarat STG 2013'),
  ('status_epilepticus','Dextrose 50%','IV glucose','Hypoglycaemic seizure','50 mL of 50%','IV bolus','IV','Once',1,
   'Always check blood glucose in seizure — exclude hypoglycaemia first.','Gujarat STG 2013'),

  -- AKI
  ('aki','IV Normal Saline','Crystalloid fluid','Pre-renal AKI from dehydration','500 mL bolus, reassess','IV over 15–30 min','IV','Until urine output responds',1,
   'Re-assess fluid status and urine output after each bolus. Avoid fluid overload.','Gujarat STG 2013'),
  ('aki','Furosemide','Loop diuretic','Fluid overload in AKI (not oliguric AKI from dehydration)','40–80 mg IV','IV once or twice','IV','Short-term',2,
   'Do not use to convert oliguric to non-oliguric AKI without evidence of fluid overload.','Gujarat STG 2013'),
  ('aki','Calcium gluconate 10%','Calcium salt','Hyperkalaemia with ECG changes (cardioprotective)','10 mL of 10% solution','IV over 5 minutes','IV','Immediate; repeat in 5–10 min if no ECG improvement',1,
   'Stabilises cardiac membrane — buys time. Does not lower potassium.','Gujarat STG 2013'),
  ('aki','Actrapid (Insulin) + Dextrose','Insulin + glucose','Hyperkalaemia (shift K+ into cells)','10 units Actrapid + 50 mL of 50% dextrose','IV over 15–30 min','IV','Acts within 15–30 min; duration 4–6 hours',1,
   'Monitor BGL every 30 min for 6 hours. Most reliable K+ lowering therapy.','Gujarat STG 2013'),

  -- Acute Severe Asthma
  ('acute_severe_asthma','Salbutamol nebulised','Short-acting beta2 agonist','Acute severe asthma','5 mg','Every 15–20 min (first hour); then hourly','Nebulised (O2-driven)','Until stable PEFR >50%',1,
   'Use oxygen as driving gas (not air — maintains SpO2). Back-to-back nebulisers in life-threatening attack.','Gujarat STG 2013'),
  ('acute_severe_asthma','Ipratropium bromide nebulised','Short-acting anticholinergic','Severe / life-threatening asthma (add to salbutamol)','500 µg','Every 4–6 hours (combine with each salbutamol nebuliser in first hour)','Nebulised','First 24 hours then step down',1,
   'Additive bronchodilation with salbutamol in severe attack. Less effective in maintenance.','Gujarat STG 2013'),
  ('acute_severe_asthma','Hydrocortisone','Systemic corticosteroid','Severe acute asthma (IV — unable to swallow)','100 mg','Every 6 hours IV','IV','Switch to oral prednisolone when able',1,
   'Continue prednisolone 40–50 mg OD for 5 days after acute attack even if PEFR returns to normal.','Gujarat STG 2013'),
  ('acute_severe_asthma','Prednisolone','Systemic corticosteroid','Acute severe asthma (oral)','40–50 mg','Once daily','Oral','5 days minimum',1,
   'Oral as effective as IV if able to swallow. Reduces hospital admission and relapse.','Gujarat STG 2013'),
  ('acute_severe_asthma','Magnesium Sulfate','Bronchodilator (IV)','Life-threatening asthma','2 g','IV over 20 minutes','IV','Single dose',2,
   'Reduces hospital admissions in life-threatening asthma. Safe; minimal side effects. Also indicated for poor response after 1 hour of nebulised treatment.','Gujarat STG 2013'),

  -- Gestational Diabetes
  ('gestational_diabetes','Isophane (NPH) Insulin','Intermediate-acting insulin','GDM — fasting glucose not at target on diet','0.2 units/kg at bedtime (start)','Once daily at night','SC injection','Throughout pregnancy; stop at delivery',1,
   'Insulin is preferred over oral hypoglycaemics in pregnancy. Adjust dose to achieve fasting BGL <5.3 mmol/L.','Gujarat STG 2013'),
  ('gestational_diabetes','Metformin','Biguanide','GDM (second-line if insulin declined or unavailable)','500 mg OD increasing to 2000 mg/day','With meals','Oral','Until delivery; stop at delivery',2,
   'Crosses placenta but no proven fetal harm. Preferred oral agent in pregnancy if insulin refused.','Murtagh GP 3rd Ed'),

  -- Preterm Labour
  ('preterm_labour','Nifedipine','Calcium channel blocker (tocolytic)','Tocolysis in preterm labour 24–34 weeks','20 mg oral stat, then 10–20 mg every 6 hours','Every 6 hours','Oral','48 hours (to allow corticosteroids)',1,
   'First-line tocolytic. Monitor maternal BP and pulse. Avoid if hypotension or cardiac disease.','Gujarat STG 2013'),
  ('preterm_labour','Betamethasone','Antenatal corticosteroid','Fetal lung maturity (24–34+6 weeks)','12 mg IM','Two doses 24 hours apart','IM','Single course',1,
   'Reduces RDS, IVH, NEC. Give to all women at risk of preterm delivery <34+6 weeks. Single repeat dose at 33 weeks if first course >7 days ago.','Gujarat STG 2013'),
  ('preterm_labour','Magnesium Sulfate','Neuroprotectant','Fetal neuroprotection if delivery expected <32 weeks','4 g IV loading, then 1 g/hour','IV infusion','IV','Until delivery (max 24 hours)',1,
   'Reduces cerebral palsy risk in very preterm neonates. Monitor reflexes and RR.','Gujarat STG 2013'),

  -- Endometriosis
  ('endometriosis','Ibuprofen','NSAID','Dysmenorrhoea in endometriosis','400 mg','Three times daily with food (start before menses)','Oral','During menstruation',1,
   'First-line for pain. Start 1–2 days before expected onset.','Murtagh GP 3rd Ed'),
  ('endometriosis','Levonorgestrel IUS (Mirena)','Progestogen IUS','Endometriosis-associated pain and heavy periods','52 mg system inserted by clinician','Continuous local progestogen','Intrauterine device','3–5 years',1,
   'Highly effective for pain and menorrhagia; non-contraceptive benefits. First-line in women who do not want immediate fertility.','Murtagh GP 3rd Ed'),
  ('endometriosis','Norethisterone','Progestogen','Endometriosis suppression','5 mg','Three times daily','Oral','6 months',2,
   'Can cause breakthrough bleeding, acne, mood changes. Effective for pain but not fertility preservation.','Murtagh GP 3rd Ed'),
  ('endometriosis','Goserelin','GnRH analogue','Severe endometriosis / pre-operative','3.6 mg monthly or 10.8 mg 3-monthly','Monthly or 3-monthly SC depot','SC injection','3–6 months (with add-back HRT)',2,
   'Causes menopausal side effects; bone loss with prolonged use — add HRT. Not for >6 months without add-back.','Gujarat STG 2013'),

  -- Menopause
  ('menopause','Estradiol patches (transdermal HRT)','Oestrogen replacement','Vasomotor symptoms of menopause','50 µg/24 hours patch','Twice weekly (change every 3–4 days)','Transdermal','Minimum effective duration; review annually',1,
   'Add oral or intravaginal progestogen if uterus intact (prevents endometrial hyperplasia). Lower VTE risk than oral HRT.','Murtagh GP 3rd Ed'),
  ('menopause','Conjugated oestrogen + MPA','Combined HRT (oral)','Menopausal symptoms (uterus intact)','0.625 mg + 5 mg','Daily continuous or cyclic','Oral','Review annually; shortest effective duration',2,
   'Continuous combined HRT for postmenopause; sequential for perimenopause. Increases breast cancer risk with long-term use.','Murtagh GP 3rd Ed'),
  ('menopause','Vaginal oestradiol (Vagifem)','Local oestrogen','Urogenital atrophy, vaginal dryness, dyspareunia','10 µg tablet inserted vaginally','Daily x 2 weeks, then twice weekly','Intravaginal','Long-term (safe without systemic progestogen)',1,
   'Minimal systemic absorption; very safe long-term. Effective for vaginal dryness and recurrent UTI in postmenopause.','Murtagh GP 3rd Ed'),
  ('menopause','Venlafaxine','SNRI','Hot flushes (when HRT contraindicated)','75 mg','Once daily','Oral','3–6 months then review',2,
   'Non-hormonal option for breast cancer survivors or when HRT contraindicated. 50–60% reduction in flush frequency.','Murtagh GP 3rd Ed'),

  -- Postnatal Depression
  ('postnatal_depression','Sertraline','SSRI','Postnatal depression (first-line in breastfeeding)','50 mg OD (start), increase to 100–200 mg','Once daily','Oral','Minimum 6 months',1,
   'Best studied SSRI in breastfeeding — lowest milk transfer. Takes 4–6 weeks for effect.','Murtagh GP 3rd Ed'),
  ('postnatal_depression','Paroxetine','SSRI','Postnatal depression (alternative)','10–20 mg','Once daily','Oral','Minimum 6 months',2,
   'Relatively lower milk levels. Taper slowly on stopping. Some risk of discontinuation syndrome.','Murtagh GP 3rd Ed'),

  -- SAM
  ('malnutrition_sam','F-75 therapeutic milk','Therapeutic feed','SAM stabilisation phase','100 mL/kg/day in 8–12 feeds','Hourly to 2-hourly feeds via cup or NG','Oral/NG','1–2 weeks until appetite returns',1,
   'Low-osmolarity formula prevents cardiac failure. Never overfeed in stabilisation phase.','Gujarat STG 2013'),
  ('malnutrition_sam','RUTF (Plumpy''Nut)','Ready-to-use therapeutic food','SAM rehabilitation phase','200 kcal/kg/day (ad libitum)','Multiple times daily','Oral','Until WHZ >−2 for 2 measurements',1,
   'Peanut-based RUTF; does not require water preparation. Child-friendly. Micronutrient complete.','Gujarat STG 2013'),
  ('malnutrition_sam','Amoxicillin','Antibiotic','All SAM children (routine antibiotic)','80–90 mg/kg/day','Divided doses','Oral','7 days',1,
   'All SAM children given empirical antibiotics per WHO protocol even without obvious infection.','Gujarat STG 2013'),
  ('malnutrition_sam','Vitamin A','Vitamin supplement','SAM (except oedematous/kwashiorkor at presentation)','200,000 IU (>12 months)','Single dose on day 1','Oral','Once (Day 1 only)',1,
   'Delay in oedematous malnutrition (kwashiorkor) until oedema resolving — risk of toxicity.','Gujarat STG 2013'),

  -- Tetanus
  ('tetanus','Human Tetanus Immunoglobulin (TIG)','Passive immunisation','Tetanus (neutralise circulating toxin)','3000–6000 units','Single IM dose (or infiltrate around wound)','IM','Single dose (as soon as possible)',1,
   'Given even if vaccinated if wound is heavily contaminated. Different site from vaccine injection.','Gujarat STG 2013'),
  ('tetanus','Metronidazole','Nitroimidazole antibiotic','Tetanus (eradicate C. tetani)','500 mg','Every 8 hours','IV or oral','7 days',1,
   'Preferred over penicillin G (metronidazole does not antagonise GABA like penicillin). IV initially.','Gujarat STG 2013'),
  ('tetanus','Diazepam','Benzodiazepine','Tetanus muscle spasm control','10–40 mg','IV/NG QID or continuous infusion (titrate to spasms)','IV or NG','Until spasms controlled',1,
   'Very large doses may be required. Monitor respiratory depression. ICU care essential.','Gujarat STG 2013'),
  ('tetanus','Tetanus Toxoid vaccine','Vaccine','Tetanus prophylaxis (curative — disease does not confer immunity)','0.5 mL','IM (different site from TIG)','IM','Complete 3-dose primary course',1,
   'Give during recovery — tetanus infection does not produce immunity. Schedule: 0, 1 month, 6 months.','Gujarat STG 2013'),

  -- Rabies PEP
  ('rabies_pep','Rabies Immunoglobulin (RIG)','Passive immunisation (heterologous or human)','Category III exposure (previously unvaccinated)','20 IU/kg (human RIG) or 40 IU/kg (equine)','Single dose — infiltrate maximum amount into wound; remainder IM','IM + wound infiltration','Single dose (Day 0 only)',1,
   'Give on Day 0 with first vaccine dose (different sites). Never give after Day 7. Equine RIG: skin test first for hypersensitivity.','Gujarat STG 2013'),
  ('rabies_pep','Rabies vaccine (cell culture)','Vaccine','Rabies post-exposure prophylaxis','1 mL IM in deltoid','Days 0, 3, 7, 14 (Essen 4-dose schedule)','IM (deltoid)','4 doses over 14 days',1,
   'Never inject into gluteal muscle (poor immune response). Pre-exposure prophylaxis (3 doses): days 0, 7, 21/28.','Gujarat STG 2013'),

  -- Carpal Tunnel
  ('carpal_tunnel','Methylprednisolone injection','Corticosteroid (local)','Carpal tunnel syndrome','40 mg (with 1 mL 1% lignocaine)','Single injection into carpal tunnel','Intra-carpal tunnel injection','One injection; can repeat once after 6 weeks',1,
   'Effective for 3–6 months. Ultrasound-guided injection improves accuracy. Avoid repeated injections (tendon damage risk).','Murtagh GP 3rd Ed'),
  ('carpal_tunnel','Splint (wrist orthosis)','Conservative device','Mild-moderate carpal tunnel syndrome','Wear in neutral position at night','Nightly (and with activities if tolerable)','Physical','Minimum 4–6 weeks',1,
   'First-line for mild-moderate CTS. Neutral position splint more effective than wrist-extended splint.','Murtagh GP 3rd Ed'),

  -- Frozen Shoulder
  ('frozen_shoulder','Methylprednisolone injection','Corticosteroid (local)','Frozen shoulder — painful (freezing) phase','40–80 mg (with local anaesthetic)','Intra-articular injection (glenohumeral joint)','IA injection','1–2 injections, 6 weeks apart',1,
   'Most effective treatment for early painful phase. Reduces pain and improves early ROM. Ultrasound-guided preferred.','Murtagh GP 3rd Ed'),
  ('frozen_shoulder','Ibuprofen','NSAID','Frozen shoulder pain management','400–600 mg','Three times daily with food','Oral','4–6 weeks',2,
   'Provides symptomatic relief in freezing phase. Add PPI if risk factors for GI complications.','Murtagh GP 3rd Ed');
