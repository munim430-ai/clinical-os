-- Chunk 8: Final 15 conditions from both handbooks
-- Constipation, Syncope, Acute Liver Failure, Intestinal Obstruction,
-- Pneumothorax, Pleural Effusion, Prostatitis, Epididymo-orchitis,
-- Erectile Dysfunction, Mumps, Rubella, Febrile Convulsion,
-- Fibromyalgia, Polymyalgia Rheumatica, Giant Cell Arteritis

INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('constipation','Constipation (Chronic)','gastroenterology','K59.0',
   'Infrequent bowel movements (<3/week), straining, hard stools, or feeling of incomplete evacuation. Functional (most common) or secondary to drugs (opioids, iron, antidepressants), metabolic (hypothyroidism, hypercalcaemia), neurological, or structural causes. Exclude colorectal cancer with red flags.','constipation'),
  ('syncope','Syncope (Fainting)','cardiology','R55',
   'Transient loss of consciousness due to cerebral hypoperfusion, with rapid spontaneous recovery. Vasovagal (most common — 50%), orthostatic hypotension, cardiac arrhythmia, structural heart disease, or neurological. Cardiac syncope carries highest mortality risk.','syncope'),
  ('acute_liver_failure','Acute Liver Failure','gastroenterology','K72.0',
   'Rapid deterioration of liver function with coagulopathy (INR ≥1.5) and encephalopathy in a patient without prior liver disease. Causes: paracetamol overdose (most common in West), viral hepatitis, drugs, Wilson''s disease. Medical emergency — ICU + transplant assessment.','acute-liver-failure'),
  ('intestinal_obstruction','Intestinal Obstruction','gastroenterology','K56.6',
   'Blockage of the small or large bowel — mechanical (adhesions, hernias, tumours, volvulus) or functional (paralytic ileus). Presents with colicky abdominal pain, distension, vomiting, and absolute constipation (no flatus). X-ray: dilated loops ± fluid levels.','intestinal-obstruction'),
  ('pneumothorax','Pneumothorax','respiratory','J93',
   'Air in the pleural space causing lung collapse. Spontaneous (primary: young tall males; secondary: underlying lung disease COPD/asthma). Traumatic. Tension pneumothorax (air accumulation under pressure — causes mediastinal shift and cardiac arrest) is a life-threatening emergency.','pneumothorax'),
  ('pleural_effusion','Pleural Effusion','respiratory','J90',
   'Fluid accumulation in the pleural space. Transudates: heart failure, cirrhosis, nephrotic syndrome (protein <30 g/L). Exudates: pneumonia, malignancy, TB, PE (Light''s criteria). Presents with dyspnoea, reduced breath sounds, and dull percussion.','pleural-effusion'),
  ('prostatitis','Acute Bacterial Prostatitis','urology','N41.0',
   'Acute bacterial infection of the prostate gland. Presents with fever, rigors, perineal/pelvic pain, dysuria, urinary frequency, and tender boggy prostate on DRE. Most common organisms: E. coli, Klebsiella, Pseudomonas. Do NOT massage prostate (bacteraemia risk).','prostatitis'),
  ('epididymo_orchitis','Epididymo-orchitis','urology','N45',
   'Infection and inflammation of the epididymis ± testis. In <35 years: chlamydia and gonorrhoea. In >35 years: E. coli and coliforms. Presents with acute onset unilateral scrotal pain, swelling, and tenderness. Must exclude testicular torsion (surgical emergency).','epididymo-orchitis'),
  ('erectile_dysfunction','Erectile Dysfunction','urology','N52.9',
   'Persistent inability to achieve or maintain an erection sufficient for satisfactory sexual performance. Vascular (70%), neurological, hormonal (hypogonadism), psychogenic, or medication-related. Major risk factors: diabetes, hypertension, smoking, hyperlipidaemia. Often a sentinel for cardiovascular disease.','erectile-dysfunction'),
  ('mumps','Mumps','paediatric_infections','B26',
   'Viral infection caused by mumps paramyxovirus. Classic presentation: painful unilateral or bilateral parotid swelling. Complications: orchitis (post-pubertal males 20–40%), meningitis, encephalitis, deafness, pancreatitis. Preventable by MMR vaccine.','mumps'),
  ('rubella','Rubella (German Measles)','paediatric_infections','B06',
   'Mild viral infection; serious risk if acquired during pregnancy (congenital rubella syndrome — cataracts, deafness, cardiac defects, microcephaly). In children/adults: mild rash, lymphadenopathy, arthralgia. Preventable by MMR vaccine. Screen all women of childbearing age.','rubella'),
  ('febrile_convulsion','Febrile Convulsion','paediatric_infections','R56.0',
   'Seizure occurring in a febrile child aged 6 months to 5 years without intracranial infection or metabolic cause. Simple (most common): <15 min, generalised, resolves spontaneously. Complex: >15 min, focal, or multiple within 24 hours. Associated with fever — not harmful to brain in simple form.','febrile-convulsion'),
  ('fibromyalgia','Fibromyalgia','musculoskeletal','M79.7',
   'Chronic widespread musculoskeletal pain with fatigue, sleep disturbance, cognitive dysfunction (''fibro fog''), and tenderness at multiple sites. Diagnosis by 2010 ACR criteria: widespread pain index ≥7 + symptom severity score ≥5. No structural pathology.','fibromyalgia'),
  ('pmr','Polymyalgia Rheumatica (PMR)','musculoskeletal','M35.3',
   'Inflammatory condition causing aching and morning stiffness in shoulder and pelvic girdle muscles in patients >50 years. ESR typically >40 mm/hr. Dramatic response to low-dose prednisolone is diagnostic. Associated with giant cell arteritis (GCA) in 15–20%.','pmr'),
  ('gca','Giant Cell Arteritis (Temporal Arteritis)','musculoskeletal','M31.6',
   'Large and medium vessel granulomatous vasculitis affecting branches of external carotid artery in patients >50 years. Headache, jaw claudication, scalp tenderness, visual loss (anterior ischaemic optic neuropathy). MEDICAL EMERGENCY if visual symptoms — treat immediately with high-dose steroids before biopsy.','gca');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- Constipation
  ('constipation','Infrequent bowel movements (<3 per week)',0,'core'),
  ('constipation','Hard, lumpy, or pellet-like stools',0,'core'),
  ('constipation','Straining, incomplete evacuation, or need for manual manoeuvres',0,'typical'),
  ('constipation','Abdominal bloating and discomfort',0,'associated'),
  ('constipation','Red flags: rectal bleeding, unintentional weight loss, change after age 50',1,'red_flag'),
  -- Syncope
  ('syncope','Transient loss of consciousness with rapid spontaneous recovery',0,'core'),
  ('syncope','Prodrome in vasovagal: nausea, sweating, pallor, tunnel vision',0,'vasovagal'),
  ('syncope','Triggered by standing, heat, pain, emotion (vasovagal)',0,'trigger'),
  ('syncope','Syncope on exertion or during exercise (cardiac cause)',1,'cardiac'),
  ('syncope','Palpitations before syncope (arrhythmia)',1,'cardiac'),
  ('syncope','No warning; injury on fall; prolonged recovery (cardiac)',1,'cardiac'),
  -- Acute Liver Failure
  ('acute_liver_failure','Jaundice, coagulopathy (INR ≥1.5)',1,'core'),
  ('acute_liver_failure','Hepatic encephalopathy (confusion, drowsiness, asterixis)',1,'core'),
  ('acute_liver_failure','Right upper quadrant pain, nausea, vomiting',0,'typical'),
  ('acute_liver_failure','Hypoglycaemia, bleeding tendency, acute kidney injury',1,'complication'),
  -- Intestinal Obstruction
  ('intestinal_obstruction','Colicky central abdominal pain',1,'core'),
  ('intestinal_obstruction','Distension (more marked in large bowel obstruction)',1,'core'),
  ('intestinal_obstruction','Vomiting — early (small bowel) or late/faeculent (large bowel)',1,'core'),
  ('intestinal_obstruction','Absolute constipation (no stool or flatus)',1,'core'),
  ('intestinal_obstruction','High-pitched bowel sounds or complete silence (peritonitis)',1,'sign'),
  -- Pneumothorax
  ('pneumothorax','Sudden pleuritic chest pain on affected side',1,'core'),
  ('pneumothorax','Dyspnoea (severity proportional to size and reserve)',1,'core'),
  ('pneumothorax','Decreased breath sounds and hyper-resonance on affected side',0,'sign'),
  ('pneumothorax','Tension: tracheal deviation, hypotension, JVP raised, cyanosis',1,'emergency'),
  -- Pleural Effusion
  ('pleural_effusion','Progressive dyspnoea on exertion',0,'core'),
  ('pleural_effusion','Dull percussion note and absent breath sounds at base',0,'sign'),
  ('pleural_effusion','Pleuritic chest pain (if associated with pleuritis/PE)',0,'associated'),
  ('pleural_effusion','Fever and purulent sputum (parapneumonic effusion / empyema)',1,'infection'),
  -- Prostatitis
  ('prostatitis','Acute onset fever, chills, rigors',1,'systemic'),
  ('prostatitis','Perineal, pelvic, or low back pain',0,'pain'),
  ('prostatitis','Dysuria, urgency, frequency, acute urinary retention',0,'urinary'),
  ('prostatitis','Exquisitely tender, boggy prostate on DRE',0,'sign'),
  ('prostatitis','Bacteraemia and sepsis in severe untreated cases',1,'severe'),
  -- Epididymo-orchitis
  ('epididymo_orchitis','Acute unilateral scrotal pain and swelling',0,'core'),
  ('epididymo_orchitis','Tender, swollen epididymis and testis',0,'sign'),
  ('epididymo_orchitis','Fever and urethral discharge (STI-related)',0,'associated'),
  ('epididymo_orchitis','Must exclude testicular torsion (needs urgent surgical exploration)',1,'emergency'),
  -- Erectile Dysfunction
  ('erectile_dysfunction','Inability to achieve or maintain erection sufficient for intercourse',0,'core'),
  ('erectile_dysfunction','Reduced libido (suggests hormonal cause)',0,'hormonal'),
  ('erectile_dysfunction','Morning erections preserved (suggests psychogenic)',0,'psychogenic'),
  -- Mumps
  ('mumps','Parotid swelling (unilateral then bilateral) — painful',0,'classic'),
  ('mumps','Fever, malaise, anorexia (prodrome)',0,'prodrome'),
  ('mumps','Orchitis — unilateral testicular pain and swelling in post-pubertal males',1,'complication'),
  ('mumps','Aseptic meningitis (may precede parotitis)',1,'complication'),
  -- Rubella
  ('rubella','Fine pink maculopapular rash starting on face spreading downward (fades in 3 days)',0,'rash'),
  ('rubella','Posterior auricular and suboccipital lymphadenopathy (before rash)',0,'characteristic'),
  ('rubella','Arthralgia / arthritis (especially women)',0,'arthritis'),
  ('rubella','Congenital rubella syndrome in fetus if acquired first trimester',1,'obstetric'),
  -- Febrile Convulsion
  ('febrile_convulsion','Generalised tonic-clonic seizure in febrile child (6 months–5 years)',0,'core'),
  ('febrile_convulsion','Seizure typically <5 minutes; resolves spontaneously',0,'simple'),
  ('febrile_convulsion','Fever usually from viral URTI (not the seizure itself causing temperature)',0,'typical'),
  ('febrile_convulsion','Complex FC: >15 min, focal, or >1 in 24 hours',1,'complex'),
  -- Fibromyalgia
  ('fibromyalgia','Widespread musculoskeletal pain (axial + bilateral, above and below waist)',0,'core'),
  ('fibromyalgia','Fatigue (often profound) and non-restorative sleep',0,'core'),
  ('fibromyalgia','Cognitive dysfunction (brain fog, poor memory, concentration)',0,'cognitive'),
  ('fibromyalgia','Multiple tender points at specific anatomical sites',0,'sign'),
  ('fibromyalgia','Comorbid anxiety, depression, IBS, headaches',0,'comorbid'),
  -- PMR
  ('pmr','Bilateral shoulder and pelvic girdle aching and stiffness',0,'core'),
  ('pmr','Morning stiffness >45 minutes',0,'core'),
  ('pmr','Rapid and dramatic response to prednisolone',0,'diagnostic'),
  ('pmr','Elevated ESR (typically >40) and CRP',0,'lab'),
  ('pmr','Associated GCA (headache, jaw claudication, visual symptoms)',1,'gca'),
  -- GCA
  ('gca','Temporal or occipital headache (new onset in >50 years)',1,'core'),
  ('gca','Jaw claudication (pain on chewing)',1,'pathognomonic'),
  ('gca','Scalp tenderness over temporal artery',1,'sign'),
  ('gca','Sudden visual loss — amaurosis fugax or permanent (AION)',1,'emergency'),
  ('gca','Elevated ESR (often >50 mm/hr) and CRP',0,'lab');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('constipation','Constipation Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('syncope','Syncope Management Protocol','Murtagh GP 3rd Ed',2001),
  ('acute_liver_failure','Acute Liver Failure Management Protocol','Gujarat STG 2013',2013),
  ('intestinal_obstruction','Intestinal Obstruction Management Protocol','Gujarat STG 2013',2013),
  ('pneumothorax','Pneumothorax Management Protocol','Murtagh GP 3rd Ed / Gujarat STG',2013),
  ('pleural_effusion','Pleural Effusion Management Protocol','Murtagh GP 3rd Ed',2001),
  ('prostatitis','Acute Prostatitis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('epididymo_orchitis','Epididymo-orchitis Management Protocol','Gujarat STG 2013',2013),
  ('erectile_dysfunction','Erectile Dysfunction Management Protocol','Murtagh GP 3rd Ed',2001),
  ('mumps','Mumps Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('rubella','Rubella Management Protocol','Gujarat STG 2013',2013),
  ('febrile_convulsion','Febrile Convulsion Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('fibromyalgia','Fibromyalgia Management Protocol','Murtagh GP 3rd Ed',2001),
  ('pmr','Polymyalgia Rheumatica Management Protocol','Murtagh GP 3rd Ed',2001),
  ('gca','Giant Cell Arteritis Management Protocol','Murtagh GP 3rd Ed',2001);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- Constipation
  ((SELECT id FROM protocols WHERE condition_id='constipation'),1,'Lifestyle and Dietary Measures (First-line)',
   'Increase dietary fibre to 25–35 g/day (fruits, vegetables, wholegrains, legumes). Fluid intake ≥1.5–2 L/day. Regular physical activity. Establish a regular toileting routine — 15–30 minutes after meals (gastrocolic reflex). Do not ignore the urge to defecate.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='constipation'),2,'Pharmacotherapy',
   'Osmotic laxatives (first-line): macrogol (PEG) 3350 one sachet BD (well tolerated, no tolerance). Lactulose 15 mL BD as alternative. Stimulant laxatives: senna 15 mg nocte, or bisacodyl 5–10 mg nocte (for breakthrough). Bulk-forming: ispaghula husk (must take with plenty of fluid). Review and stop constipating drugs (opioids, iron, antidepressants, calcium channel blockers) if possible.','moderate'),

  -- Syncope
  ((SELECT id FROM protocols WHERE condition_id='syncope'),1,'Assessment and Triage',
   'History of the event (witnesses), prodrome, triggers, duration, recovery. ECG (mandatory in all). Postural BP (lying then standing — drop ≥20 systolic = orthostatic). Cardiac: absent prodrome, exercise-related, previous cardiac disease, ECG abnormality, family history of sudden death. Neurological: focal signs, seizure activity (prolonged twitching, tongue bite, post-ictal confusion).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='syncope'),2,'Vasovagal (Reflex) Management',
   'Reassure. Avoid triggers (prolonged standing, heat, dehydration, crowded rooms). Increase fluid and salt intake. Physical counter-pressure manoeuvres (leg crossing, squatting, handgrip) at warning. Tilt training for recurrent cases. Midodrine 5–10 mg TDS if refractory. Refer cardiology if high-risk features.','mild'),

  -- Acute Liver Failure
  ((SELECT id FROM protocols WHERE condition_id='acute_liver_failure'),1,'Emergency Management and Transplant Assessment',
   'ICU admission. N-acetylcysteine (NAC) IV for paracetamol-induced ALF (even if >24 hours). Treat underlying cause (entecavir for HBV, IV acyclovir for HSV). Manage encephalopathy: lactulose, rifaximin; avoid sedatives. Coagulopathy: fresh frozen plasma only if active bleeding or before procedure. Hypoglycaemia: 10% dextrose infusion. Urgent liver transplant assessment: King''s College Criteria.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='acute_liver_failure'),2,'Monitoring and Supportive Care',
   'Hourly neuro observations (encephalopathy grade). Daily INR, bilirubin, creatinine, glucose, electrolytes. Insert NG tube if grade 3–4 encephalopathy. Vasopressors for haemodynamic instability. Renal replacement if AKI. Intracranial pressure monitoring in grade 3–4. PPI prophylaxis. Early transfer to transplant centre.','severe'),

  -- Intestinal Obstruction
  ((SELECT id FROM protocols WHERE condition_id='intestinal_obstruction'),1,'Initial Management',
   '"Drip and Suck": IV fluids (Hartmann''s), NG tube decompression (large bore, free drainage), urinary catheter (fluid balance), NBM. Blood: FBC, U&E, lactate, amylase, LFT, crossmatch. Erect AXR + CXR (exclude pneumoperitoneum). CT abdomen (gold standard for level and cause of obstruction). Analgesia IV morphine.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='intestinal_obstruction'),2,'Definitive Treatment',
   'Adhesional SBO (most common): 70% resolve with conservative management (NG tube + IV fluids x 24–48 hours). Operative if: failure to resolve, strangulation, or complete obstruction on CT. LBO: colonic stenting (malignant) or surgery. Sigmoid volvulus: urgent flexible sigmoidoscopy for decompression, then elective sigmoid resection. Caecal volvulus: surgical emergency.','severe'),

  -- Pneumothorax
  ((SELECT id FROM protocols WHERE condition_id='pneumothorax'),1,'Tension Pneumothorax (Emergency)',
   'Tension pneumothorax is a clinical diagnosis — DO NOT wait for X-ray. Immediate needle decompression: 14–16G cannula in 2nd intercostal space, mid-clavicular line. Convert to chest drain (Seldinger or blunt dissection) in 4th/5th ICS, mid-axillary line immediately after.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='pneumothorax'),2,'Simple Spontaneous Pneumothorax',
   'Small (<2 cm on CXR) and minimally symptomatic in young fit patient: observation, discharge, re-CXR in 2–4 weeks. Symptomatic or >2 cm: aspiration (14G cannula + 50 mL syringe); if <2.5 L aspirated and lung re-expanded — discharge. If fails or secondary (underlying lung disease): chest drain. Avoid flying and diving until fully resolved. Refer for pleurodesis after second occurrence.','moderate'),

  -- Pleural Effusion
  ((SELECT id FROM protocols WHERE condition_id='pleural_effusion'),1,'Investigation',
   'CXR confirms (>200 mL needed for blunting). USS-guided diagnostic thoracocentesis for all new unilateral effusions (unless clear bilateral transudates). Send fluid: protein, LDH, glucose, pH, cytology, MC&S, AFB. Apply Light''s criteria to distinguish transudate from exudate. Pleural protein:serum protein ratio >0.5 = exudate.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pleural_effusion'),2,'Treatment',
   'Transudate: treat underlying cause (diuretics for cardiac failure, albumin + diuretics for hepatic). Parapneumonic/empyema: antibiotics ± chest drain (tube thoracostomy). Malignant: repeated therapeutic thoracocentesis or pleurodesis (talc). TB effusion: anti-TB treatment. Haemothorax: chest drain. Chylothorax: refer thoracic surgery.','moderate'),

  -- Prostatitis
  ((SELECT id FROM protocols WHERE condition_id='prostatitis'),1,'Antibiotic Treatment',
   'Quinolone penetrates prostate well: ciprofloxacin 500 mg BD for 4 weeks (mild) or 6 weeks (severe). Add IV gentamicin if septic. Alternative: co-trimoxazole 960 mg BD for 4 weeks. Send urine and blood cultures before antibiotics. Do NOT massage prostate (risks bacteraemia). Catheter if urinary retention (suprapubic preferred over urethral to avoid urethral trauma).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='prostatitis'),2,'Supportive Care',
   'Adequate IV fluids if septic. NSAIDs for pain (ibuprofen 400 mg TDS). Laxatives to avoid constipation (straining worsens symptoms). Alpha-blocker (tamsulosin 0.4 mg) can ease voiding symptoms. Review in 2–4 weeks. If no improvement: ultrasound to exclude prostatic abscess (needs drainage).','moderate'),

  -- Epididymo-orchitis
  ((SELECT id FROM protocols WHERE condition_id='epididymo_orchitis'),1,'Exclude Testicular Torsion',
   'Testicular torsion is a surgical emergency (must operate within 6 hours). If unable to clinically differentiate: emergency scrotal USS + Doppler (absent blood flow = torsion). In doubt: surgical exploration is mandatory. Epididymo-orchitis: blood flow preserved on Doppler.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='epididymo_orchitis'),2,'Antibiotic Treatment',
   'STI-related (<35 years): ceftriaxone 500 mg IM stat + doxycycline 100 mg BD for 10–14 days. Non-STI (>35 years, urinary pathogens): ciprofloxacin 500 mg BD for 10–14 days. Scrotal support, bed rest, NSAIDs for pain. Screen and treat sexual contacts for STI-related cases.','moderate'),

  -- Erectile Dysfunction
  ((SELECT id FROM protocols WHERE condition_id='erectile_dysfunction'),1,'Assessment and Lifestyle',
   'History and examination: vascular risk factors, DM, medications (antihypertensives, antidepressants, antiandrogens), smoking, alcohol, testosterone deficiency (reduced libido, small testes). Investigations: fasting glucose, lipids, testosterone. Address cardiovascular risk factors. Stop smoking. Reduce alcohol. Exercise.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='erectile_dysfunction'),2,'Pharmacotherapy',
   'PDE5 inhibitors (first-line): sildenafil 50 mg 1 hour before sex (25–100 mg range); tadalafil 10 mg before sex or 5 mg daily (longer acting). Efficacy ~70%. Take on empty stomach (sildenafil, vardenafil); tadalafil not affected by food. Contraindicated with nitrates (severe hypotension). If testosterone deficient: testosterone replacement. Referral for vacuum devices, intracavernosal injections, or penile prosthesis if pharmacotherapy fails.','moderate'),

  -- Mumps
  ((SELECT id FROM protocols WHERE condition_id='mumps'),1,'Supportive Treatment',
   'No specific antiviral. Paracetamol/ibuprofen for fever and parotid pain. Warm or cold packs to face. Adequate hydration — avoid citrus drinks (stimulate saliva, worsen pain). Soft diet. Isolate from school until 5 days after parotid swelling onset. Notify public health. MMR vaccination of unimmunised contacts (does not prevent if already incubating but protects future).','mild'),
  ((SELECT id FROM protocols WHERE condition_id='mumps'),2,'Orchitis Management',
   'Bed rest, scrotal support (briefs or Jockstrap). Analgesia: ibuprofen 400 mg TDS or paracetamol. Ice packs. Short-course prednisolone 40 mg/day for 5 days (reduces inflammation; does not prevent infertility). Follow up: testicular atrophy occurs in 50% of affected testes but bilateral infertility is uncommon (<10%).','moderate'),

  -- Rubella
  ((SELECT id FROM protocols WHERE condition_id='rubella'),1,'Management and Prevention',
   'Supportive only (no specific antiviral). Rest, paracetamol for fever. Arthralgia: NSAIDs. Infectious from 7 days before to 4 days after rash — isolate from pregnant women. Screen all women of childbearing age for rubella immunity; vaccinate non-immune women (with MMR) before conception. Never vaccinate in pregnancy (live vaccine). If pregnant woman exposed: urgent serology — if non-immune, counselling about risk of congenital rubella syndrome.','mild'),

  -- Febrile Convulsion
  ((SELECT id FROM protocols WHERE condition_id='febrile_convulsion'),1,'Acute Management',
   'Protect airway, recovery position, do not restrain. Time seizure — most stop <5 min. If continues >5 min: buccal midazolam 0.2–0.5 mg/kg (max 10 mg) or diazepam rectal 0.5 mg/kg. Paracetamol/ibuprofen for fever (does not prevent recurrence). After seizure: establish cause of fever (examine — exclude meningitis, encephalitis).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='febrile_convulsion'),2,'Counselling and Follow-up',
   'Reassure parents: simple febrile convulsions are not epilepsy, do not damage the brain, and 95% outgrow by age 5. Recurrence risk ~30%. Supply buccal midazolam for home use if recurrent. Admit: first complex febrile convulsion, LP if <18 months (exclude meningitis), child looks unwell. Routine EEG not indicated for simple febrile convulsion.','mild'),

  -- Fibromyalgia
  ((SELECT id FROM protocols WHERE condition_id='fibromyalgia'),1,'Non-Pharmacological (Most Important)',
   'Education and reassurance (legitimise pain, explain neurobiological basis). Graded aerobic exercise programme — most evidence-based treatment. Hydrotherapy/aquatic exercise. CBT. Sleep hygiene (address non-restorative sleep). Multidisciplinary pain programme for severe cases.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='fibromyalgia'),2,'Pharmacotherapy',
   'Amitriptyline 10–75 mg nocte (improves sleep and pain — most widely used). Pregabalin 75–300 mg BD (FDA-approved, reduces pain and fatigue). Duloxetine 60 mg OD (especially if comorbid depression). SSRIs for comorbid depression. Avoid opioids and NSAIDs (not effective for fibromyalgia). Cyclobenzaprine 5 mg nocte (muscle relaxant, improves sleep).','moderate'),

  -- PMR
  ((SELECT id FROM protocols WHERE condition_id='pmr'),1,'Corticosteroid Treatment (Dramatic Response Confirms Diagnosis)',
   'Prednisolone 15 mg/day (initial dose for uncomplicated PMR). Response within 24–72 hours (diagnostic). If no response in 1 week: reconsider diagnosis. Taper prednisolone by 2.5 mg every 3–4 weeks to 10 mg, then by 1 mg every 4–8 weeks guided by symptoms and ESR. Treatment duration typically 1–3 years.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pmr'),2,'GCA Monitoring and Bone Protection',
   'Screen for GCA symptoms at every visit (new headache, jaw claudication, visual changes — immediately increase prednisolone and refer for temporal artery biopsy). Bone protection: calcium + Vitamin D + bisphosphonate (prolonged steroid use). Monitor glucose (steroid-induced diabetes).','moderate'),

  -- GCA
  ((SELECT id FROM protocols WHERE condition_id='gca'),1,'Emergency: Start Steroids Immediately',
   'DO NOT wait for biopsy results — start steroids immediately if visual symptoms (amaurosis fugax, visual loss) or jaw claudication. Without visual symptoms: prednisolone 40–60 mg/day immediately. With visual symptoms or recent visual loss: methylprednisolone 500–1000 mg IV daily for 3 days then oral prednisolone 60 mg. Refer urgently to ophthalmology and rheumatology. Temporal artery biopsy within 1–2 weeks of starting steroids (does not affect result for 2 weeks).','severe'),
  ((SELECT id FROM protocols WHERE condition_id='gca'),2,'Long-term Management',
   'Prednisolone taper very slowly (reduce by 10 mg/month to 20 mg, then by 2.5 mg every 1–2 months). Treatment duration 2–3 years. Low-dose aspirin 75 mg OD (reduces ischaemic events). PPI gastroprotection. Osteoporosis prophylaxis mandatory (calcium + Vit D + bisphosphonate). Monitor ESR/CRP monthly. Tocilizumab (IL-6 inhibitor) subcutaneous weekly as steroid-sparing agent for relapsing disease.','severe');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- Constipation
  ('constipation','Macrogol 3350 (PEG)','Osmotic laxative','Chronic constipation (first-line)','1 sachet (13.8 g) in 125 mL water','Once or twice daily','Oral','Until regular bowel habit established',1,
   'Well tolerated; no habituation. Safe in pregnancy and elderly. Tastes neutral.','Gujarat STG 2013'),
  ('constipation','Senna','Stimulant laxative','Constipation (short-term or breakthrough)','15 mg (2 tablets)','At night','Oral','Short-term (2–4 weeks); review',2,
   'Acts in 8–12 hours. Useful at night for morning action. Avoid long-term without medical supervision.','Gujarat STG 2013'),
  ('constipation','Lactulose','Osmotic laxative','Constipation (alternative to macrogol)','15 mL','Twice daily','Oral','Until effect achieved',3,
   'Takes 2–3 days to work. Causes flatulence and bloating. Less preferred than macrogol.','Gujarat STG 2013'),
  ('constipation','Bisacodyl','Stimulant laxative','Constipation / pre-procedural bowel preparation','5–10 mg nocte (oral) or 10 mg suppository','At night','Oral or rectal','Short-term',2,
   'Suppository acts within 30–60 min. Tablets act in 8–12 hours.','Gujarat STG 2013'),

  -- Syncope
  ('syncope','Midodrine','Alpha-1 adrenergic agonist','Recurrent vasovagal / orthostatic syncope','5–10 mg','Three times daily (before meals; not at night)','Oral','Long-term trial',2,
   'Increases peripheral vascular resistance and BP. Avoid in hypertension, severe cardiac disease, urinary retention.','Murtagh GP 3rd Ed'),

  -- Acute Liver Failure
  ('acute_liver_failure','N-Acetylcysteine (NAC)','Antidote','Paracetamol-induced acute liver failure','150 mg/kg IV over 1 hour, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours','IV infusion (3-bag regimen)','IV','21-hour course (extend if still encephalopathic)',1,
   'Give even if >24 hours post-ingestion. Also used in non-paracetamol ALF. Monitor for anaphylactoid reactions (more common with initial bolus rate).','Gujarat STG 2013'),
  ('acute_liver_failure','Lactulose','Laxative / Ammonia-lowering','Hepatic encephalopathy in ALF','30–45 mL','Every 1–2 hours until 2–3 loose stools/day, then TDS','Oral/NG','During encephalopathy',1,
   'Target 2–3 soft stools/day. Reduces ammonia absorption from gut.','Gujarat STG 2013'),

  -- Intestinal Obstruction
  ('intestinal_obstruction','IV Hartmann''s Solution','Crystalloid IV fluid','Fluid replacement in intestinal obstruction','1–2 L initially; 150 mL/hour maintenance','IV continuous infusion','IV','Until surgery or resolution',1,
   'Correct electrolytes; monitor urine output and bowel decompression.','Gujarat STG 2013'),
  ('intestinal_obstruction','Morphine','Opioid analgesic','Analgesia in intestinal obstruction','2.5–5 mg','IV every 4 hours or PCA','IV','Peri-operative period',1,
   'Adequate analgesia does not mask peritonism; can be given safely.','Gujarat STG 2013'),

  -- Pneumothorax
  ('pneumothorax','Supplemental oxygen','Oxygen therapy','Spontaneous pneumothorax (accelerates reabsorption)','15 L/min (100% O2 via reservoir mask)','Continuous','Inhalation','Until pneumothorax resolves',1,
   'Breathing 100% O2 increases rate of pneumothorax reabsorption 4-fold. Essential first step.','Murtagh GP 3rd Ed'),

  -- Pleural Effusion
  ('pleural_effusion','Furosemide','Loop diuretic','Transudative pleural effusion from cardiac failure','40–80 mg','Once or twice daily','Oral/IV','Until effusion resolved',1,
   'Treat the underlying cardiac failure to resolve transudative effusion.','Gujarat STG 2013'),

  -- Prostatitis
  ('prostatitis','Ciprofloxacin','Fluoroquinolone','Acute bacterial prostatitis','500 mg','Twice daily','Oral','4–6 weeks',1,
   'Excellent prostate penetration. Adjust dose in renal impairment.','Gujarat STG 2013'),
  ('prostatitis','Co-trimoxazole','Sulfonamide + dihydrofolate reductase inhibitor','Acute prostatitis (alternative)','960 mg (DS)','Twice daily','Oral','4 weeks',2,
   'Good prostate tissue penetration. Check sensitivities. Adequate fluid intake.','Gujarat STG 2013'),

  -- Epididymo-orchitis
  ('epididymo_orchitis','Ceftriaxone + Doxycycline','Cephalosporin + Tetracycline','STI-related epididymo-orchitis (<35 years)','Ceftriaxone 500 mg IM stat + Doxycycline 100 mg BD','As per individual drugs','IM then Oral','10–14 days (doxycycline)',1,
   'Covers gonorrhoea (ceftriaxone) and chlamydia (doxycycline). Treat sexual partners.','Gujarat STG 2013'),
  ('epididymo_orchitis','Ciprofloxacin','Fluoroquinolone','Coliform epididymo-orchitis (>35 years)','500 mg','Twice daily','Oral','10–14 days',1,
   'For urinary pathogen-related orchitis. Send MSU and urethral swab.','Gujarat STG 2013'),

  -- Erectile Dysfunction
  ('erectile_dysfunction','Sildenafil','PDE5 inhibitor','Erectile dysfunction','50 mg (25–100 mg)','1 hour before sexual activity (max once daily)','Oral','As needed',1,
   'Take on empty stomach; high-fat meal delays absorption. Absolute contraindication with nitrates.','Murtagh GP 3rd Ed'),
  ('erectile_dysfunction','Tadalafil','PDE5 inhibitor','Erectile dysfunction (long-acting)','10–20 mg before sex; or 5 mg daily','As needed (lasts 36 hours) or daily','Oral','As needed or daily',1,
   'Not affected by food. Daily low-dose option for spontaneous sex. Also treats BPH.','Murtagh GP 3rd Ed'),
  ('erectile_dysfunction','Testosterone (if hypogonadal)','Androgen','Erectile dysfunction with testosterone deficiency','Gel 50 mg OD or IM depot','Daily (gel) or every 2–4 weeks (IM depot)','Transdermal or IM','Long-term if deficient',2,
   'Only if serum testosterone confirmed low (<8 nmol/L). Check PSA before starting. Monitor haematocrit.','Murtagh GP 3rd Ed'),

  -- Mumps
  ('mumps','Paracetamol','Analgesic/Antipyretic','Fever and parotid pain in mumps','1 g','Four times daily','Oral','During acute illness',1,
   'Supportive treatment only — no antiviral available.','Gujarat STG 2013'),
  ('mumps','Ibuprofen','NSAID','Orchitis pain in mumps','400 mg','Three times daily with food','Oral','5–7 days',2,
   'Anti-inflammatory benefit for orchitis. Scrotal support and ice packs also help.','Gujarat STG 2013'),

  -- Rubella
  ('rubella','Paracetamol','Analgesic/Antipyretic','Fever and arthralgia in rubella','1 g','Four times daily','Oral','During acute illness',1,
   'Supportive treatment only — no antiviral available.','Gujarat STG 2013'),
  ('rubella','MMR vaccine','Combined live attenuated vaccine','Rubella prevention / post-exposure (non-pregnant)','0.5 mL','Once (or check if 2-dose schedule)','SC/IM','Single or two doses',1,
   'Do not give in pregnancy. Check serology before vaccinating; unnecessary if immune.','Gujarat STG 2013'),

  -- Febrile Convulsion
  ('febrile_convulsion','Midazolam buccal','Benzodiazepine','Prolonged febrile convulsion (>5 min)','0.2–0.5 mg/kg (max 10 mg)','Single buccal dose; can repeat once','Buccal','Single dose for acute seizure',1,
   'Home rescue medication for prolonged seizures. Instruct parents/caregivers on use.','Gujarat STG 2013'),
  ('febrile_convulsion','Paracetamol','Antipyretic','Fever management in febrile convulsion','15 mg/kg','Every 4–6 hours','Oral/Rectal','During febrile illness',1,
   'Treats fever and discomfort. Does NOT prevent recurrent febrile convulsions — but still important for comfort.','Gujarat STG 2013'),

  -- Fibromyalgia
  ('fibromyalgia','Amitriptyline','Tricyclic antidepressant','Fibromyalgia — pain and sleep','10–75 mg','Once daily at night (titrate up)','Oral','Long-term with review',1,
   'Most widely used pharmacotherapy for fibromyalgia. Improves sleep, fatigue, and pain. Cheap and effective.','Murtagh GP 3rd Ed'),
  ('fibromyalgia','Pregabalin','Calcium channel α2δ ligand','Fibromyalgia pain','75 mg BD (start), titrate to 150–300 mg BD','Twice daily','Oral','Long-term; review at 3 months',1,
   'FDA-approved for fibromyalgia. Reduces pain and improves function. Sedation and weight gain common.','Murtagh GP 3rd Ed'),
  ('fibromyalgia','Duloxetine','SNRI','Fibromyalgia with comorbid depression','30 mg OD (start), increase to 60 mg','Once daily','Oral','6 months then review',2,
   'FDA-approved for fibromyalgia. Particularly useful when comorbid depression or anxiety present.','Murtagh GP 3rd Ed'),

  -- PMR
  ('pmr','Prednisolone','Corticosteroid','Polymyalgia rheumatica','15 mg/day (initial); taper per protocol','Once daily (morning)','Oral','1–3 years (guided by symptoms and ESR)',1,
   'Dramatic response within 24–72 hours confirms diagnosis. Taper slowly — relapse common if tapered too fast. Bone protection mandatory.','Murtagh GP 3rd Ed'),

  -- GCA
  ('gca','Prednisolone','Corticosteroid','Giant cell arteritis without visual symptoms','40–60 mg/day','Once daily','Oral','Minimum 2–3 years, slow taper',1,
   'Start immediately — do not wait for biopsy. Maintain high dose until symptoms/markers resolve, then taper by 5 mg/month to 20 mg.','Murtagh GP 3rd Ed'),
  ('gca','Methylprednisolone','IV Corticosteroid','GCA with visual symptoms / recent visual loss','500–1000 mg','Once daily for 3 days','IV','3-day course then oral prednisolone 60 mg',1,
   'Emergency treatment to prevent blindness. Give immediately when visual symptoms present.','Murtagh GP 3rd Ed'),
  ('gca','Aspirin (low-dose)','Antiplatelet','GCA — reduce ischaemic events','75 mg','Once daily','Oral','Long-term (with PPI)',2,
   'Reduces risk of visual loss and stroke in GCA. Add PPI for gastric protection.','Murtagh GP 3rd Ed'),
  ('gca','Tocilizumab','IL-6 receptor antagonist','Relapsing or refractory GCA (steroid-sparing)','162 mg weekly','Once weekly','SC injection','Long-term under specialist care',2,
   'Allows faster prednisolone tapering and reduces cumulative steroid dose. Specialist initiation only.','Murtagh GP 3rd Ed');
