-- Chunk 5: 15 more conditions from GP 3rd Ed & Gujarat STG 2013
-- Hepatitis A, Cirrhosis, Ulcerative Colitis, Appendicitis, Haemorrhoids,
-- Dementia, Parkinson's, Pre-eclampsia, Genital Herpes, Chlamydia,
-- HIV/AIDS, Conjunctivitis, Vitamin D Deficiency, Obesity, Sepsis

-- ── Conditions ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('hepatitis_a','Hepatitis A','infectious','B15',
   'Acute viral hepatitis caused by HAV, transmitted via faecal-oral route (contaminated food/water). Self-limiting illness; no chronic disease. Severity increases with age. Preventable by vaccination.','hepatitis-a'),
  ('cirrhosis','Liver Cirrhosis','gastroenterology','K74.6',
   'End-stage liver disease characterised by diffuse fibrosis and nodular regeneration replacing normal hepatic architecture. Common causes: alcohol, HBV, HCV, NAFLD. Complications: portal hypertension, ascites, variceal bleeding, hepatic encephalopathy, HCC.','cirrhosis'),
  ('ulcerative_colitis','Ulcerative Colitis','gastroenterology','K51',
   'Chronic inflammatory bowel disease confined to colon and rectum. Characterised by bloody diarrhoea, urgency, and tenesmus. Continuous mucosal inflammation from rectum extending proximally. Associated with colorectal cancer risk.','ulcerative-colitis'),
  ('appendicitis','Acute Appendicitis','gastroenterology','K37',
   'Inflammation of the vermiform appendix — most common cause of acute abdomen requiring surgery. Classical presentation: periumbilical pain migrating to right iliac fossa, fever, vomiting, rebound tenderness. Perforation risk if delayed.','appendicitis'),
  ('haemorrhoids','Haemorrhoids (Piles)','gastroenterology','K64',
   'Engorged venous cushions in the anal canal. Internal haemorrhoids arise above dentate line; external below. Graded I–IV by degree of prolapse. Presents with painless bright red rectal bleeding, prolapse, pruritus ani.','haemorrhoids'),
  ('dementia','Dementia (Alzheimer''s type)','neurology','F00',
   'Progressive neurodegenerative condition causing decline in memory, language, problem-solving, and other cognitive functions sufficient to interfere with daily life. Most common cause: Alzheimer''s disease (60–70%). Other causes: vascular, Lewy body, frontotemporal.','dementia'),
  ('parkinsons','Parkinson''s Disease','neurology','G20',
   'Progressive neurodegenerative disorder caused by loss of dopaminergic neurones in substantia nigra. Classical triad: resting tremor, rigidity, bradykinesia. Also postural instability. Non-motor features include depression, autonomic dysfunction, dementia.','parkinsons'),
  ('pre_eclampsia','Pre-eclampsia','gynaecology','O14',
   'Pregnancy-specific hypertensive disorder (BP ≥140/90 mmHg after 20 weeks with proteinuria or end-organ dysfunction). Spectrum includes severe pre-eclampsia and eclampsia (seizures). Leading cause of maternal and perinatal mortality.','pre-eclampsia'),
  ('genital_herpes','Genital Herpes','infectious','A60',
   'Sexually transmitted infection caused by herpes simplex virus type 2 (HSV-2, primarily) or HSV-1. Presents with painful genital ulcers, dysuria, inguinal lymphadenopathy. Lifelong latency with recurrences. Neonatal herpes risk if primary infection near delivery.','genital-herpes'),
  ('chlamydia','Chlamydia','infectious','A56',
   'Most common bacterial STI; caused by Chlamydia trachomatis. Often asymptomatic. In women: cervicitis, urethritis, PID risk. In men: urethritis, epididymo-orchitis. Annually screen sexually active women <25 years.','chlamydia'),
  ('hiv','HIV/AIDS','infectious','B24',
   'Chronic infection by Human Immunodeficiency Virus causing progressive CD4 T-cell depletion and immune deficiency. AIDS defined as CD4 <200 cells/µL or AIDS-defining illness. Managed with lifelong antiretroviral therapy (ART). Now a manageable chronic condition.','hiv'),
  ('conjunctivitis','Conjunctivitis','ophthalmology','H10',
   'Inflammation of the conjunctiva. Types: bacterial (mucopurulent discharge, sticky eyes), viral (watery discharge, often unilateral then bilateral), allergic (itching, watering, papillae). Most cases self-limiting.','conjunctivitis'),
  ('vit_d_deficiency','Vitamin D Deficiency / Rickets','endocrinology','E55',
   'Deficiency of vitamin D causing impaired calcium and phosphate metabolism. In children: rickets (bone deformity). In adults: osteomalacia (bone pain, proximal myopathy) and increased osteoporosis risk. Common in South Asia due to low sun exposure, dark skin, dietary deficiency.','vitamin-d-deficiency'),
  ('obesity','Obesity','metabolic','E66',
   'Chronic disease defined as BMI ≥30 kg/m². Associated with significant morbidity: type 2 diabetes, hypertension, dyslipidaemia, OSA, non-alcoholic fatty liver disease, OA, and cancers. Multifactorial aetiology.','obesity'),
  ('sepsis','Sepsis','emergency','A41.9',
   'Life-threatening organ dysfunction caused by dysregulated host response to infection. Septic shock: sepsis + vasopressor requirement + lactate >2 mmol/L despite resuscitation. Mortality 20–40%. Hour-1 bundle critical.','sepsis');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- Hepatitis A
  ('hepatitis_a','Prodrome: fever, malaise, nausea, anorexia, right upper quadrant discomfort',0,'prodrome'),
  ('hepatitis_a','Jaundice, dark urine (bilirubinuria), pale stools',0,'icteric'),
  ('hepatitis_a','Hepatomegaly with tender liver',0,'sign'),
  ('hepatitis_a','Fulminant hepatic failure (rare — 1%)',1,'severe'),
  ('hepatitis_a','Cholestatic hepatitis (prolonged jaundice, pruritus)',0,'variant'),
  -- Cirrhosis
  ('cirrhosis','Fatigue, anorexia, weight loss',0,'early'),
  ('cirrhosis','Jaundice, palmar erythema, spider naevi, leukonychia',0,'sign'),
  ('cirrhosis','Ascites and peripheral oedema',0,'decompensation'),
  ('cirrhosis','Haematemesis or melaena (oesophageal varices)',1,'emergency'),
  ('cirrhosis','Hepatic encephalopathy (confusion, asterixis, coma)',1,'severe'),
  ('cirrhosis','Spontaneous bacterial peritonitis (SBP)',1,'emergency'),
  ('cirrhosis','Hepatorenal syndrome',1,'severe'),
  -- Ulcerative Colitis
  ('ulcerative_colitis','Bloody diarrhoea with mucus (cardinal symptom)',0,'core'),
  ('ulcerative_colitis','Urgency and tenesmus (feeling of incomplete evacuation)',0,'core'),
  ('ulcerative_colitis','Crampy lower abdominal pain relieved by defecation',0,'typical'),
  ('ulcerative_colitis','Anaemia, fatigue, weight loss in severe disease',0,'systemic'),
  ('ulcerative_colitis','Toxic megacolon (severe colitis complication)',1,'emergency'),
  ('ulcerative_colitis','Extra-intestinal manifestations: arthritis, uveitis, pyoderma gangrenosum',0,'extra_intestinal'),
  -- Appendicitis
  ('appendicitis','Central or periumbilical pain migrating to right iliac fossa',0,'classic'),
  ('appendicitis','Rebound tenderness at McBurney''s point',0,'sign'),
  ('appendicitis','Nausea, vomiting, fever (low-grade initially)',0,'associated'),
  ('appendicitis','Rovsing''s sign positive',0,'sign'),
  ('appendicitis','Generalised peritonitis (perforation — surgical emergency)',1,'emergency'),
  -- Haemorrhoids
  ('haemorrhoids','Painless bright red rectal bleeding (coating stools or on paper)',0,'core'),
  ('haemorrhoids','Prolapse (tissue protruding through anus)',0,'moderate'),
  ('haemorrhoids','Pruritus ani (anal itching)',0,'typical'),
  ('haemorrhoids','Perianal discomfort or mucus discharge',0,'typical'),
  ('haemorrhoids','Acute pain (thrombosed external haemorrhoid)',1,'acute'),
  -- Dementia
  ('dementia','Progressive memory loss (especially recent events)',0,'core'),
  ('dementia','Disorientation in time, place, and person',0,'moderate'),
  ('dementia','Language difficulties (word-finding, aphasia)',0,'language'),
  ('dementia','Poor judgement, impaired executive function',0,'executive'),
  ('dementia','Behavioural and psychological symptoms: agitation, wandering, aggression',0,'bpsd'),
  -- Parkinson's
  ('parkinsons','Resting tremor (pill-rolling, 4–6 Hz, unilateral onset)',0,'motor'),
  ('parkinsons','Bradykinesia (slowness of movement — required for diagnosis)',0,'motor'),
  ('parkinsons','Cogwheel rigidity (lead-pipe + tremor)',0,'motor'),
  ('parkinsons','Postural instability and gait disorder (festinating gait)',0,'late'),
  ('parkinsons','Micrographia, hypophonia, masked facies',0,'motor'),
  ('parkinsons','Depression, cognitive impairment, autonomic dysfunction',0,'non_motor'),
  -- Pre-eclampsia
  ('pre_eclampsia','Hypertension ≥140/90 mmHg after 20 weeks gestation',1,'diagnostic'),
  ('pre_eclampsia','Proteinuria ≥300 mg/24 hours or PCR ≥30 mg/mmol',1,'diagnostic'),
  ('pre_eclampsia','Headache (severe, persistent)',1,'severe'),
  ('pre_eclampsia','Visual disturbances (photopsia, blurred vision)',1,'severe'),
  ('pre_eclampsia','Epigastric or right upper quadrant pain (HELLP)',1,'severe'),
  ('pre_eclampsia','Eclamptic seizures',1,'emergency'),
  -- Genital Herpes
  ('genital_herpes','Painful genital ulcers (multiple shallow ulcers on erythematous base)',0,'core'),
  ('genital_herpes','Dysuria, urinary retention',0,'associated'),
  ('genital_herpes','Bilateral tender inguinal lymphadenopathy',0,'sign'),
  ('genital_herpes','Prodromal tingling/burning before lesions',0,'prodrome'),
  ('genital_herpes','Neonatal herpes (risk at delivery)',1,'obstetric'),
  -- Chlamydia
  ('chlamydia','Often asymptomatic (especially in women)',0,'note'),
  ('chlamydia','Urethral or vaginal discharge',0,'typical'),
  ('chlamydia','Dysuria in men and women',0,'typical'),
  ('chlamydia','PID, epididymo-orchitis (complications)',1,'complication'),
  ('chlamydia','Reactive arthritis (Chlamydia-triggered)',0,'extra_genital'),
  -- HIV/AIDS
  ('hiv','Acute HIV seroconversion: fever, rash, lymphadenopathy, sore throat (2–4 weeks after exposure)',0,'acute'),
  ('hiv','Prolonged asymptomatic period (years)',0,'latent'),
  ('hiv','Recurrent infections, weight loss, night sweats (symptomatic HIV)',0,'symptomatic'),
  ('hiv','AIDS-defining illness: PCP, cryptococcal meningitis, CMV, Kaposi''s sarcoma, MAC, toxoplasmosis',1,'aids'),
  ('hiv','CD4 <200 cells/µL (AIDS)',1,'aids'),
  -- Conjunctivitis
  ('conjunctivitis','Redness (conjunctival hyperaemia) — bilateral or unilateral',0,'core'),
  ('conjunctivitis','Discharge: purulent (bacterial), watery (viral), stringy/mucoid (allergic)',0,'discharge'),
  ('conjunctivitis','Itching (allergic), burning or grittiness (bacterial/viral)',0,'itch'),
  ('conjunctivitis','Photophobia or blurred vision (suggests iritis or keratitis — refer urgently)',1,'red_flag'),
  -- Vitamin D Deficiency
  ('vit_d_deficiency','Bone pain and tenderness (osteomalacia in adults)',0,'musculoskeletal'),
  ('vit_d_deficiency','Proximal muscle weakness (difficulty rising from chair, climbing stairs)',0,'myopathy'),
  ('vit_d_deficiency','Bony deformities in children: bowed legs, rachitic rosary, widened wrists',0,'rickets'),
  ('vit_d_deficiency','Hypocalcaemia: tetany, perioral tingling, Chvostek''s sign, Trousseau''s sign',1,'severe'),
  ('vit_d_deficiency','Often asymptomatic (detected on screening in high-risk groups)',0,'note'),
  -- Obesity
  ('obesity','BMI ≥30 kg/m² (obese), ≥35 (severely obese), ≥40 (morbidly obese)',0,'definition'),
  ('obesity','Central adiposity: waist circumference >102 cm (men), >88 cm (women)',0,'measurement'),
  ('obesity','Dyspnoea on exertion, reduced exercise tolerance',0,'functional'),
  ('obesity','Associated comorbidities: T2DM, hypertension, OSA, dyslipidaemia, OA',0,'metabolic'),
  ('obesity','Psychosocial impact: depression, low self-esteem',0,'psychological'),
  -- Sepsis
  ('sepsis','Fever >38°C or hypothermia <36°C with source of infection',1,'core'),
  ('sepsis','Tachycardia (HR >90) and tachypnoea (RR >20)',1,'core'),
  ('sepsis','Altered mental status (confusion)',1,'organ'),
  ('sepsis','Hypotension despite fluids (septic shock)',1,'emergency'),
  ('sepsis','Oliguria, raised creatinine, raised lactate, coagulopathy',1,'organ');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('hepatitis_a','Hepatitis A Management Protocol','Gujarat STG 2013',2013),
  ('cirrhosis','Liver Cirrhosis Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('ulcerative_colitis','Ulcerative Colitis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('appendicitis','Acute Appendicitis Management Protocol','Gujarat STG 2013',2013),
  ('haemorrhoids','Haemorrhoids Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('dementia','Dementia Management Protocol','Murtagh GP 3rd Ed',2001),
  ('parkinsons','Parkinson''s Disease Management Protocol','Murtagh GP 3rd Ed / Gujarat STG',2013),
  ('pre_eclampsia','Pre-eclampsia and Eclampsia Protocol','Gujarat STG 2013',2013),
  ('genital_herpes','Genital Herpes Management Protocol','Murtagh GP 3rd Ed',2001),
  ('chlamydia','Chlamydia Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('hiv','HIV/AIDS Management Protocol','Gujarat STG 2013',2013),
  ('conjunctivitis','Conjunctivitis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('vit_d_deficiency','Vitamin D Deficiency Management Protocol','Gujarat STG 2013',2013),
  ('obesity','Obesity Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('sepsis','Sepsis (Hour-1 Bundle) Protocol','Gujarat STG 2013',2013);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- Hepatitis A
  ((SELECT id FROM protocols WHERE condition_id='hepatitis_a'),1,'Supportive Management',
   'No specific antiviral. Rest and adequate nutrition. Small frequent meals; avoid fatty foods in acute phase. Oral rehydration if vomiting. Avoid alcohol and hepatotoxic drugs. Most patients recover fully within 6–8 weeks. Isolate patient during faecal-oral infectious phase (2 weeks around jaundice onset).','mild'),
  ((SELECT id FROM protocols WHERE condition_id='hepatitis_a'),2,'Monitoring and Indications for Admission',
   'Monitor LFTs, INR, bilirubin weekly. Admit if: INR prolonged (suggests hepatic failure), severe vomiting/dehydration, encephalopathy, or fulminant hepatic failure. HAV vaccination for household contacts. Notify public health.','moderate'),

  -- Cirrhosis
  ((SELECT id FROM protocols WHERE condition_id='cirrhosis'),1,'General Management',
   'Treat underlying cause: abstinence from alcohol, antiviral therapy for HBV/HCV. Screen for oesophageal varices at diagnosis (endoscopy) — primary prophylaxis with propranolol 40 mg BD if large varices. Annual HCC surveillance: USS + AFP every 6 months. Screen for and treat SBP promptly.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='cirrhosis'),2,'Ascites Management',
   'Restrict dietary sodium (<2 g/day). First-line: spironolactone 100–400 mg/day ± furosemide 40–160 mg/day (ratio 100:40 to maintain potassium balance). Therapeutic paracentesis with albumin infusion for refractory ascites (6–8 g albumin per litre drained). Antibiotic prophylaxis with norfloxacin 400 mg OD if spontaneous bacterial peritonitis history.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='cirrhosis'),3,'Acute Variceal Bleeding',
   'Resuscitate with IV fluids and blood (target Hb 70–80 g/L to avoid worsening portal hypertension). IV terlipressin 2 mg QID or octreotide 50 µg bolus then 50 µg/h infusion. IV antibiotics (ceftriaxone 1 g OD x 5 days to prevent SBP). Urgent endoscopy (within 12 hours) for variceal banding. Refer gastroenterology/hepatology.','severe'),

  -- Ulcerative Colitis
  ((SELECT id FROM protocols WHERE condition_id='ulcerative_colitis'),1,'Mild-Moderate Active Disease',
   '5-ASA (mesalazine) is cornerstone: oral mesalazine 2.4–4.8 g/day. Rectal mesalazine suppositories or enemas for proctitis and left-sided colitis — more effective than oral alone for distal disease. Add short-course prednisolone 40 mg/day (reducing by 5 mg weekly) for moderate flare unresponsive to 5-ASA after 2 weeks.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='ulcerative_colitis'),2,'Severe Active UC (Hospital)',
   'Admit: stool frequency >6/day with blood, systemic upset, or toxic megacolon. IV hydrocortisone 100 mg QID or methylprednisolone 60 mg OD. IV fluids, correct electrolytes (especially potassium). Nil by mouth if toxic megacolon. Surgical consult on admission. If no response at 72 hours: IV ciclosporin or infliximab.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='ulcerative_colitis'),3,'Maintenance of Remission',
   'Mesalazine 1.2–2.4 g/day long-term — reduces relapse and colorectal cancer risk. Azathioprine 2–2.5 mg/kg/day for steroid-dependent or frequently relapsing UC (check TPMT genotype before starting). Colonoscopy surveillance for dysplasia: 8 years from diagnosis, then every 1–5 years depending on risk.','moderate'),

  -- Appendicitis
  ((SELECT id FROM protocols WHERE condition_id='appendicitis'),1,'Diagnosis',
   'Clinical: Alvarado score. Investigations: WBC (leucocytosis), CRP, urinalysis (exclude UTI). USS abdomen (non-radiating; useful in children and women). CT abdomen if diagnosis uncertain in adults. Alvarado score ≥7 = likely appendicitis; proceed to surgery. Score 4–6 = observe and repeat assessment.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='appendicitis'),2,'Surgical Management',
   'Appendicectomy (open or laparoscopic) is definitive treatment. Pre-operative: IV fluids, IV antibiotics (cefazolin + metronidazole or co-amoxiclav). If perforated: washout, drain; IV antibiotics for 5 days post-op. Early surgery (within 6–12 hours of diagnosis) reduces perforation risk.','severe'),

  -- Haemorrhoids
  ((SELECT id FROM protocols WHERE condition_id='haemorrhoids'),1,'Lifestyle and Conservative Treatment',
   'Increase dietary fibre (25–35 g/day) and fluid intake (>2 L/day) to soften stools. Avoid straining. Sitz baths (warm water 15 min TDS). Topical hydrocortisone + local anaesthetic cream (e.g. Proctosedyl) for short-term symptom relief. Bulk-forming laxatives (ispaghula) for constipation.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='haemorrhoids'),2,'Office Procedures and Surgery',
   'Grade I–II internal haemorrhoids: rubber band ligation (most effective outpatient procedure), sclerotherapy, or infrared coagulation. Grade III–IV or external thrombosed: haemorrhoidectomy. Acute thrombosed external haemorrhoid within 72 hours: surgical excision or incision under LA gives rapid relief.','moderate'),

  -- Dementia
  ((SELECT id FROM protocols WHERE condition_id='dementia'),1,'Diagnosis and Reversible Causes',
   'Cognitive assessment (MMSE, MoCA). Exclude reversible causes: hypothyroidism (TSH), B12 deficiency, folate, calcium, syphilis, depression, drug side effects, normal pressure hydrocephalus. Brain CT/MRI to exclude structural causes (tumour, subdural haematoma, NPH).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='dementia'),2,'Pharmacological Therapy',
   'Cholinesterase inhibitors (mild-moderate Alzheimer''s): donepezil 5–10 mg OD, rivastigmine 3–12 mg/day, galantamine 8–24 mg/day — modest symptomatic benefit. Memantine 10–20 mg/day for moderate-severe Alzheimer''s (NMDA antagonist). Antipsychotics (risperidone 0.25–1 mg OD) for severe agitation/psychosis — short-term only.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='dementia'),3,'Non-Pharmacological and Carer Support',
   'Cognitive stimulation therapy. Structured daily routine. Safety: wander alert systems, stove safety, driving assessment. Support carers with education, respite care, carer support groups. Advance care planning early while patient has capacity. Notify DVLA about driving.','mild'),

  -- Parkinson's
  ((SELECT id FROM protocols WHERE condition_id='parkinsons'),1,'First-Line Therapy (Early Parkinson''s)',
   'Younger patients (<70): dopamine agonist (pramipexole 0.375–4.5 mg/day or ropinirole 0.25–24 mg/day) — delays motor fluctuations. Older patients or significant disability: levodopa-carbidopa (Sinemet 25/100 mg TDS) — most effective. Refer to neurologist or movement disorder specialist for initiation.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='parkinsons'),2,'Symptom Management',
   'Tremor: anticholinergics (benzhexol 2–15 mg/day) for young patients with predominant tremor — avoid in elderly (confusion). Levodopa gradually increased to achieve symptom control with minimum dose. Physiotherapy for gait and balance. Occupational therapy for ADLs. Speech therapy for hypophonia and dysphagia.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='parkinsons'),3,'Advanced Disease',
   'Motor fluctuations (wearing off, dyskinesia): add COMT inhibitor (entacapone 200 mg with each levodopa dose) or MAO-B inhibitor (rasagiline 1 mg OD or selegiline). DBS (deep brain stimulation) for refractory motor fluctuations in suitable patients. Treat depression (SSRIs), autonomic dysfunction, and dementia.','severe'),

  -- Pre-eclampsia
  ((SELECT id FROM protocols WHERE condition_id='pre_eclampsia'),1,'Antihypertensive Treatment',
   'Mild hypertension (140–159/90–109): labetalol 100–200 mg BD (avoid in asthma); or methyldopa 250–500 mg TDS; or nifedipine LA 30–60 mg OD. Target BP <150/100 mmHg. Severe hypertension (≥160/110): IV labetalol 20 mg IV (repeat q15 min up to 80 mg) or oral nifedipine 10 mg; hydralazine 5 mg IV. Urgent to lower within 1 hour.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='pre_eclampsia'),2,'Magnesium Sulfate (Eclampsia Prophylaxis and Treatment)',
   'Loading dose: MgSO4 4 g IV over 15–20 min. Maintenance: 1–2 g/hour infusion. Continue 24 hours post-delivery. Monitor: urine output (>25 mL/hr), respiratory rate (>12/min), knee reflexes. If toxicity: calcium gluconate 10 mL of 10% solution IV slowly as antidote. Indicated if: systolic BP ≥160, symptoms (headache, visual disturbance, hyperreflexia), or to treat eclamptic seizure.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='pre_eclampsia'),3,'Delivery (Definitive Treatment)',
   'Delivery is the only cure. If severe pre-eclampsia ≥37 weeks: deliver. If 34–37 weeks with severe features: deliver. If <34 weeks: consider corticosteroids (betamethasone 12 mg IM x2, 24 hours apart) for fetal lung maturity then deliver if maternal or fetal condition deteriorates. Caesarean section or induction depending on presentation.','severe'),

  -- Genital Herpes
  ((SELECT id FROM protocols WHERE condition_id='genital_herpes'),1,'Primary Episode Treatment',
   'Antiviral therapy reduces duration and severity: acyclovir 400 mg TDS OR 200 mg 5x/day for 5–10 days. Valacyclovir 1 g BD for 7–10 days (better bioavailability, simpler dosing). Saline bathing for ulcers. Topical lidocaine gel for dysuria. Oral analgesia (paracetamol, ibuprofen). Urinary retention: urethral catheter.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='genital_herpes'),2,'Recurrent Episodes and Suppression',
   'Recurrent episodes: episodic therapy — acyclovir 400 mg TDS for 5 days at prodrome. Suppressive therapy (>6 recurrences/year): valacyclovir 500 mg OD indefinitely (reduces frequency by ~75%). Advise condom use and abstinence during outbreaks. Disclose to partners. Screen for other STIs.','moderate'),

  -- Chlamydia
  ((SELECT id FROM protocols WHERE condition_id='chlamydia'),1,'Treatment',
   'Doxycycline 100 mg BD for 7 days (preferred — more effective). Alternative: azithromycin 1 g single dose (not in complex infection or high-prevalence NAAT-positive). Treat all sexual partners from last 6 months. Abstain until patient and partners completed treatment + 7 days. Test of cure not routine (NAAT positive up to 5 weeks post-treatment).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='chlamydia'),2,'Screening and Contact Tracing',
   'Annual NAAT screening for all sexually active women <25 years. Screen at first antenatal visit. Partner notification essential. Screen for co-infections: gonorrhoea, syphilis, HIV. If PID or epididymo-orchitis develops: broader antibiotic regimen.','moderate'),

  -- HIV
  ((SELECT id FROM protocols WHERE condition_id='hiv'),1,'When to Start ART',
   'Antiretroviral therapy (ART) is recommended for ALL HIV-positive individuals regardless of CD4 count or clinical stage. Earlier start improves outcomes and reduces transmission. Urgently initiate ART if: AIDS-defining illness (except TB meningitis — delay 4–8 weeks), CD4 <200, or pregnancy.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='hiv'),2,'First-Line ART Regimen',
   'Preferred: tenofovir + lamivudine + dolutegravir (TLD) — once daily, single pill, highly effective, high barrier to resistance, well tolerated. Alternative if dolutegravir unavailable: efavirenz + tenofovir + emtricitabine (EFV/TDF/FTC). Monitor: CD4 at baseline and 6-monthly, viral load at 3 and 6 months then 6-monthly, renal function, LFTs.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='hiv'),3,'Opportunistic Infection Prophylaxis',
   'CD4 <200: Co-trimoxazole 960 mg OD (prevents PCP, toxoplasmosis). CD4 <50: azithromycin 1.2 g weekly or 600 mg BD for MAC prophylaxis. TB screening at every visit. Fluconazole prophylaxis for cryptococcal meningitis in high-prevalence settings. Vaccinations: pneumococcal, influenza, HBV (if non-immune).','severe'),

  -- Conjunctivitis
  ((SELECT id FROM protocols WHERE condition_id='conjunctivitis'),1,'Treatment by Type',
   'Bacterial: chloramphenicol 0.5% eye drops 1–2 hourly for 48 hours then QID for 5 days (or chloramphenicol 1% ointment at night), or fusidic acid 1% gel BD for 7 days. Viral: self-limiting — supportive only (cool compresses, artificial tears); very contagious — avoid sharing towels/pillowcases. Allergic: antihistamine drops (olopatadine or azelastine BD), sodium cromoglicate 4x/day; treat underlying allergy.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='conjunctivitis'),2,'When to Refer',
   'Urgent referral to ophthalmology if: vision loss, severe photophobia, corneal opacity/infiltrate, eye pain rather than discomfort, history of contact lens use (risk of Pseudomonas), neonatal conjunctivitis (<30 days, treat for gonorrhoea), or no improvement after 7 days.','severe'),

  -- Vitamin D Deficiency
  ((SELECT id FROM protocols WHERE condition_id='vit_d_deficiency'),1,'Treatment',
   'Loading dose (deficiency <25 nmol/L): colecalciferol 300,000 IU over 6–10 weeks (e.g. 50,000 IU weekly for 6 weeks). Or high-dose daily: 4000 IU/day for 10 weeks. Maintenance thereafter: 800–1000 IU/day. Calcium supplementation 1000 mg/day if dietary intake inadequate. Recheck 25-OH vitamin D at 3 months.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='vit_d_deficiency'),2,'Rickets (Children)',
   'Cholecalciferol 6000 IU/day for 12 weeks or 50,000 IU weekly for 6 weeks. Calcium supplementation. Monitor for hypercalcaemia. Bony deformities may require orthopaedic consultation. Ensure adequate sunshine exposure (15–30 min daily). Food fortification education.','moderate'),

  -- Obesity
  ((SELECT id FROM protocols WHERE condition_id='obesity'),1,'Lifestyle Intervention (First-line)',
   'Combined approach: dietary modification (500–750 kcal/day deficit; reduce ultra-processed foods, sugar-sweetened beverages), increased physical activity (at least 150 min/week moderate intensity), and behavioural change support. Target 5–10% weight loss in 3–6 months — even modest loss significantly improves metabolic parameters. Structured weight management programme.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='obesity'),2,'Pharmacotherapy (BMI ≥30 or ≥27 with comorbidity)',
   'Orlistat 120 mg TDS with meals (lipase inhibitor — reduces fat absorption by ~30%). Must maintain reduced-fat diet to avoid GI side effects. Supplement fat-soluble vitamins. Use if lifestyle modification insufficient and BMI ≥28 with risk factors. Expect 5–8% additional weight loss.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='obesity'),3,'Bariatric Surgery (BMI ≥40 or ≥35 with comorbidity)',
   'Refer to bariatric surgery if: BMI ≥40 (or ≥35 with T2DM, OSA, hypertension); failure of supervised weight management programme for ≥6 months; medically fit for surgery. Options: sleeve gastrectomy, Roux-en-Y gastric bypass. Can achieve 30–50% excess weight loss; remission of T2DM in majority.','moderate'),

  -- Sepsis
  ((SELECT id FROM protocols WHERE condition_id='sepsis'),1,'Hour-1 Bundle (Surviving Sepsis Campaign)',
   '1. Measure lactate (if >2 mmol/L, repeat 2-hourly). 2. Blood cultures (at least 2 sets) BEFORE antibiotics. 3. Broad-spectrum IV antibiotics within 1 hour (piperacillin-tazobactam 4.5 g QID + gentamicin 5 mg/kg OD OR meropenem 1 g TDS if high-risk). 4. 30 mL/kg IV crystalloid (normal saline or Hartmann''s) for hypotension or lactate >4. 5. Vasopressors (noradrenaline) if MAP <65 after fluids.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='sepsis'),2,'Antibiotic Principles',
   'De-escalate antibiotics at 48–72 hours based on culture results and clinical response. Duration: 7 days for most sepsis (5 days if source controlled). Remove source of sepsis: drain abscesses, remove infected lines, debride wounds. Measure procalcitonin and CRP to guide duration.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='sepsis'),3,'Organ Support',
   'Fluid resuscitation: balanced crystalloids preferred (limit chloride-rich saline). Maintain MAP ≥65 with vasopressors. Steroids: hydrocortisone 200 mg/day IV continuous infusion for septic shock unresponsive to fluids + vasopressors. Glycaemic control (target 8–10 mmol/L). DVT prophylaxis (LMWH + compression stockings). Stress ulcer prophylaxis (omeprazole). ICU referral for organ failure.','severe');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- Hepatitis A
  ('hepatitis_a','Oral Rehydration Solution','Oral rehydration','Dehydration from nausea/vomiting in hepatitis A','200–400 mL after each loose stool','As needed','Oral','Until hydrated',1,
   'Supportive therapy; no specific antiviral available.','Gujarat STG 2013'),
  ('hepatitis_a','Paracetamol','Analgesic/Antipyretic','Fever and malaise in hepatitis A','500 mg–1 g','Every 6 hours','Oral','As needed — maximum 2 g/day in hepatic involvement',2,
   'Reduce dose in jaundice/hepatic impairment. Avoid higher doses.','Gujarat STG 2013'),

  -- Cirrhosis
  ('cirrhosis','Spironolactone','Aldosterone antagonist','Ascites in liver cirrhosis','100 mg (titrate to 400 mg)','Once daily','Oral','Long-term',1,
   'Potassium-sparing diuretic; add furosemide in ratio 100:40.','Gujarat STG 2013'),
  ('cirrhosis','Furosemide','Loop diuretic','Ascites (add-on to spironolactone)','40 mg (titrate to 160 mg)','Once daily','Oral','Long-term',1,
   'Maintain spironolactone:furosemide ratio 100:40 to preserve potassium balance.','Gujarat STG 2013'),
  ('cirrhosis','Propranolol','Non-selective beta-blocker','Variceal bleeding prophylaxis (large varices)','40 mg','Twice daily (titrate to reduce HR by 25%)','Oral','Long-term',1,
   'Reduces portal pressure. Target resting HR 55–60 bpm. Avoid in asthma, AV block.','Gujarat STG 2013'),
  ('cirrhosis','Lactulose','Laxative/Ammonia-lowering','Hepatic encephalopathy','15–45 mL','Two to three times daily (target 2–3 soft stools/day)','Oral','As needed / long-term for secondary prophylaxis',1,
   'Acidifies colon and reduces ammonia absorption. Essential for HE management.','Gujarat STG 2013'),
  ('cirrhosis','Rifaximin','Non-absorbable antibiotic','Prevention of recurrent hepatic encephalopathy','400 mg','Three times daily','Oral','Long-term',2,
   'Add to lactulose for secondary prevention of HE after second episode.','Gujarat STG 2013'),

  -- Ulcerative Colitis
  ('ulcerative_colitis','Mesalazine (5-ASA)','Aminosalicylate','UC induction and maintenance of remission','2.4–4.8 g/day (induction); 1.2–2.4 g/day (maintenance)','Once or twice daily','Oral','Long-term',1,
   'Add rectal mesalazine for proctitis or left-sided colitis. Reduces colorectal cancer risk.','Gujarat STG 2013'),
  ('ulcerative_colitis','Prednisolone','Systemic corticosteroid','Moderate-severe UC flare','40 mg/day reducing by 5 mg/week','Once daily (morning)','Oral','6–8 weeks (taper)',2,
   'Not for maintenance — only for induction. Bone protection if prolonged (calcium + Vit D, bisphosphonate).','Gujarat STG 2013'),
  ('ulcerative_colitis','Azathioprine','Immunosuppressant DMARD','Steroid-dependent or frequently relapsing UC','2–2.5 mg/kg/day','Once daily','Oral','Long-term',2,
   'Check TPMT genotype/activity before starting. Takes 3–6 months for full effect. Monitor FBC, LFTs.','Gujarat STG 2013'),

  -- Appendicitis
  ('appendicitis','Cefazolin + Metronidazole','Antibiotic combination','Pre/perioperative prophylaxis in appendicitis','Cefazolin 1–2 g IV + Metronidazole 500 mg IV','Single pre-operative dose (or continued if perforated)','IV','Prophylaxis: single dose; perforation: 5 days',1,
   'Covers Gram-negatives and anaerobes. IV to oral switch when clinically improved.','Gujarat STG 2013'),

  -- Haemorrhoids
  ('haemorrhoids','Ispaghula husk','Bulk-forming laxative','Constipation prevention in haemorrhoids','One sachet (3.5 g)','Once or twice daily with water','Oral','Ongoing',1,
   'High-fibre diet and adequate fluid intake most important intervention.','Gujarat STG 2013'),
  ('haemorrhoids','Hydrocortisone + Cinchocaine cream','Topical steroid + LA','Symptomatic relief of haemorrhoid pain and itch','Apply to perianal area','2–3 times daily and after each bowel motion','Topical','Maximum 7 days',2,
   'Short-term use only. Do not use for >7 days — skin atrophy risk.','Gujarat STG 2013'),
  ('haemorrhoids','Lactulose','Osmotic laxative','Constipation with haemorrhoids','15 mL','Twice daily (adjust to effect)','Oral','As needed',3,
   'Soften stools to avoid straining.','Gujarat STG 2013'),

  -- Dementia
  ('dementia','Donepezil','Cholinesterase inhibitor','Mild-moderate Alzheimer''s dementia','5 mg (start), increase to 10 mg after 4 weeks','Once daily at bedtime','Oral','Long-term (review annually)',1,
   'May help cognition and function; GI side effects (nausea, diarrhoea) common at initiation. Try at 10 mg for at least 3 months before judging.','Murtagh GP 3rd Ed'),
  ('dementia','Rivastigmine','Cholinesterase inhibitor','Mild-moderate Alzheimer''s or Lewy body dementia','1.5 mg BD (increase by 1.5 mg BD every 2 weeks to max 6 mg BD)','Twice daily with meals','Oral or transdermal patch','Long-term',2,
   'Transdermal patch (4.6–13.3 mg/24h) better tolerated GI-wise than oral. Useful in Lewy body dementia.','Murtagh GP 3rd Ed'),
  ('dementia','Memantine','NMDA receptor antagonist','Moderate-severe Alzheimer''s dementia','10 mg (start), increase to 20 mg OD','Once daily','Oral','Long-term',2,
   'Slows decline in moderate-severe Alzheimer''s. Can be combined with cholinesterase inhibitor.','Murtagh GP 3rd Ed'),
  ('dementia','Risperidone','Atypical antipsychotic','Severe agitation or psychosis in dementia','0.25–1 mg','Once to twice daily','Oral','Short-term (6–12 weeks maximum)','3',
   'Use lowest effective dose. Increased risk of stroke and death in dementia — use only when non-pharmacological measures fail.','Murtagh GP 3rd Ed'),

  -- Parkinson's
  ('parkinsons','Levodopa + Carbidopa (co-careldopa)','Dopamine precursor','Parkinson''s disease (most effective symptomatic treatment)','25/100 mg (start 1 tablet TDS)','Three times daily (titrate)','Oral','Long-term',1,
   'Gold standard for motor symptoms. Nausea common early — take with food. Motor complications (wearing off, dyskinesia) develop after years of use.','Gujarat STG 2013'),
  ('parkinsons','Pramipexole','Dopamine agonist','Early Parkinson''s or adjunct to levodopa','0.375 mg TDS (start), increase to 0.5–1.5 mg TDS','Three times daily','Oral','Long-term',1,
   'Preferred in younger patients to delay motor complications. Risk of impulse control disorders (gambling, hypersexuality) — warn patient.','Murtagh GP 3rd Ed'),
  ('parkinsons','Rasagiline','MAO-B inhibitor','Early Parkinson''s or adjunct','1 mg','Once daily','Oral','Long-term',2,
   'Can be used as monotherapy in early disease or as add-on in advanced disease. Mild neuroprotective effect.','Murtagh GP 3rd Ed'),
  ('parkinsons','Entacapone','COMT inhibitor','Wearing-off fluctuations in advanced Parkinson''s','200 mg with each levodopa dose','With each dose of levodopa (max 10x/day)','Oral','Long-term',2,
   'Extends duration of each levodopa dose. Causes orange/brown discolouration of urine.','Murtagh GP 3rd Ed'),

  -- Pre-eclampsia
  ('pre_eclampsia','Labetalol','Alpha/Beta-blocker','Antihypertensive in pre-eclampsia','100–200 mg','Twice to three times daily (oral); 20 mg IV bolus repeated for severe','Oral or IV','Until delivery and postpartum normalisation',1,
   'Preferred antihypertensive in pregnancy. Avoid in asthma, heart block. Safe for fetus.','Gujarat STG 2013'),
  ('pre_eclampsia','Methyldopa','Central alpha-agonist','Antihypertensive in pre-eclampsia (especially first trimester)','250–500 mg','Three times daily','Oral','Until delivery',2,
   'Established safety record in pregnancy. Causes sedation and depression with prolonged use.','Gujarat STG 2013'),
  ('pre_eclampsia','Nifedipine LA','Calcium channel blocker','Antihypertensive in pre-eclampsia','30–60 mg','Once daily (LA formulation)','Oral','Until delivery',2,
   'Do not use sublingual nifedipine — rapid drop can cause fetal distress.','Gujarat STG 2013'),
  ('pre_eclampsia','Magnesium sulfate','Anticonvulsant','Eclampsia seizure prevention and treatment','4 g loading IV over 15–20 min, then 1–2 g/hour','IV infusion','IV','24 hours post-delivery',1,
   'Monitor reflexes, urine output, RR. Antidote: calcium gluconate 10 mL of 10% IV.','Gujarat STG 2013'),
  ('pre_eclampsia','Betamethasone','Corticosteroid (antenatal)','Fetal lung maturity if preterm delivery anticipated','12 mg IM','Two doses 24 hours apart','IM','Once per pregnancy course',1,
   'Give if delivery anticipated <34 weeks. Reduces neonatal respiratory distress syndrome.','Gujarat STG 2013'),

  -- Genital Herpes
  ('genital_herpes','Acyclovir','Antiviral','Primary genital herpes episode','400 mg','Five times daily','Oral','5–10 days',1,
   'Start as early as possible. Reduces severity and duration of primary episode.','Murtagh GP 3rd Ed'),
  ('genital_herpes','Valacyclovir','Antiviral (prodrug of acyclovir)','Primary or recurrent genital herpes','1 g','Twice daily','Oral','7–10 days (primary); 5 days (recurrent)',1,
   'Better bioavailability than acyclovir; simpler dosing. Preferred in those with frequent recurrences.','Murtagh GP 3rd Ed'),
  ('genital_herpes','Valacyclovir (suppressive)','Antiviral','Suppression of frequent recurrences (>6/year)','500 mg','Once daily','Oral','Long-term (review annually)',2,
   'Reduces recurrence frequency by ~75%; reduces transmission to partners. Safe long-term.','Murtagh GP 3rd Ed'),

  -- Chlamydia
  ('chlamydia','Doxycycline','Tetracycline','Uncomplicated chlamydia (first-line)','100 mg','Twice daily','Oral','7 days',1,
   'Superior to azithromycin for rectal chlamydia. Avoid in pregnancy. Take with food.','Gujarat STG 2013'),
  ('chlamydia','Azithromycin','Macrolide','Uncomplicated chlamydia (alternative or pregnancy)','1 g','Single dose','Oral','Single dose',2,
   'Use in pregnancy (azithromycin is safe) or when adherence to 7-day doxycycline is a concern.','Gujarat STG 2013'),
  ('chlamydia','Erythromycin','Macrolide','Chlamydia in pregnancy (if azithromycin unavailable)','500 mg','Four times daily','Oral','7 days',2,
   'Safe in pregnancy but GI side effects common.','Gujarat STG 2013'),

  -- HIV
  ('hiv','Tenofovir + Lamivudine + Dolutegravir (TLD)','NRTI + NRTI + INSTI','First-line ART for all HIV-positive adults','One tablet','Once daily','Oral','Lifelong',1,
   'Single-tablet regimen; highly effective; high genetic barrier to resistance; well tolerated. Monitor renal function (tenofovir).','Gujarat STG 2013'),
  ('hiv','Efavirenz + Tenofovir + Emtricitabine (EFV/TDF/FTC)','NNRTIs + NRTIs','Alternative first-line ART','One tablet','Once daily at night','Oral','Lifelong',2,
   'Alternative if dolutegravir not available. Neuropsychiatric side effects (vivid dreams, dizziness) common initially but usually resolve.','Gujarat STG 2013'),
  ('hiv','Co-trimoxazole (TMP-SMX)','Prophylactic antibiotic','OI prophylaxis when CD4 <200','960 mg (double strength)','Once daily','Oral','Until CD4 >200 for 3 months on ART',1,
   'Prevents PCP and toxoplasmosis. Reduce to single strength 480 mg if tolerated. Monitor FBC.','Gujarat STG 2013'),

  -- Conjunctivitis
  ('conjunctivitis','Chloramphenicol 0.5% eye drops','Antibiotic','Bacterial conjunctivitis','1–2 drops','Every 2 hours initially (48 hours), then QID','Topical (eye)','5–7 days',1,
   'Broad-spectrum antibiotic for most common bacteria (Staphylococcus, Haemophilus, Streptococcus). Avoid prolonged use.','Gujarat STG 2013'),
  ('conjunctivitis','Fusidic acid 1% gel','Antibiotic','Bacterial conjunctivitis (alternative)','Apply small amount','Twice daily','Topical (eye)','7 days',2,
   'More convenient BD dosing; particularly good for staphylococcal infection. Suitable for children.','Murtagh GP 3rd Ed'),
  ('conjunctivitis','Olopatadine 0.1% drops','Antihistamine/mast cell stabiliser','Allergic conjunctivitis','1 drop','Twice daily','Topical (eye)','During pollen season or allergen exposure',1,
   'First-line for allergic conjunctivitis; dual mechanism (antihistamine + mast cell stabilisation).','Murtagh GP 3rd Ed'),

  -- Vitamin D Deficiency
  ('vit_d_deficiency','Colecalciferol (Vitamin D3)','Vitamin D supplement','Vitamin D deficiency loading dose','50,000 IU','Weekly for 6 weeks (then maintenance)','Oral','6 weeks loading; then maintenance long-term',1,
   'Recheck 25-OH vitamin D after 3 months. Ensure adequate calcium intake (diet or supplement).','Gujarat STG 2013'),
  ('vit_d_deficiency','Colecalciferol (maintenance)','Vitamin D supplement','Vitamin D maintenance/prevention','800–1000 IU','Once daily','Oral','Long-term',1,
   'After loading course or for prevention in high-risk groups: elderly, veiled women, dark skin, limited sun exposure.','Gujarat STG 2013'),
  ('vit_d_deficiency','Calcium carbonate','Calcium supplement','Rickets or osteomalacia with dietary deficiency','500–1000 mg elemental calcium','Twice daily with meals','Oral','Until deficiency corrected',1,
   'Take with food for best absorption. Avoid with iron supplements (give separately).','Gujarat STG 2013'),

  -- Obesity
  ('obesity','Orlistat','Lipase inhibitor','Obesity (BMI ≥28 with risk factors; ≥30)','120 mg','Three times daily with main meals containing fat','Oral','Long-term (reassess at 3 months — stop if <5% weight loss)','2',
   'Reduces fat absorption by ~30%. GI side effects (steatorrhoea, urgency) if high-fat meals consumed. Supplement fat-soluble vitamins.','Gujarat STG 2013'),

  -- Sepsis
  ('sepsis','Piperacillin-Tazobactam','Extended-spectrum penicillin + beta-lactamase inhibitor','Broad-spectrum empirical sepsis treatment','4.5 g','Every 6 hours IV (or 8-hourly in renal impairment)','IV','7 days or until de-escalation based on cultures',1,
   'Covers Gram-negative (including Pseudomonas), Gram-positive, and anaerobes. De-escalate based on culture results.','Gujarat STG 2013'),
  ('sepsis','Meropenem','Carbapenem','Severe sepsis / high-risk (ICU, prior antibiotics, immunocompromised)','1 g','Every 8 hours IV','IV','7 days (de-escalate as soon as possible)',1,
   'Reserved for severe sepsis with risk of resistant organisms. Broad spectrum including ESBL producers.','Gujarat STG 2013'),
  ('sepsis','Noradrenaline (Norepinephrine)','Vasopressor','Septic shock — hypotension despite resuscitation','0.01–3 µg/kg/min (titrate to MAP ≥65)','Continuous IV infusion','IV (central line)','Until haemodynamic stability',1,
   'Vasopressor of choice in septic shock. Requires ICU, invasive BP monitoring.','Gujarat STG 2013'),
  ('sepsis','Hydrocortisone','Corticosteroid','Refractory septic shock','200 mg/day','Continuous infusion or 50 mg QID','IV','Until vasopressor weaning',2,
   'Use if septic shock not responsive to adequate fluids + vasopressors. Do not use hydrocortisone for sepsis without shock.','Gujarat STG 2013');
