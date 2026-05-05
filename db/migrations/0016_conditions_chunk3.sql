-- Chunk 3: 15 more conditions from GP 3rd Ed & Gujarat STG 2013
-- Conditions: GORD, IBS, Cellulitis, Eczema, Urticaria, Osteoarthritis,
--             Rheumatoid Arthritis, Gout, Low Back Pain, GAD, BPPV,
--             Bell's Palsy, Hepatitis B, Dyslipidaemia, BPH

-- ── Systems (add if missing) ─────────────────────────────────────────────────
INSERT OR IGNORE INTO systems (id, name, icon, color, order_index) VALUES
  ('gastroenterology','Gastroenterology','stomach','#FF9F0A',9),
  ('musculoskeletal','Musculoskeletal','bone','#BEF264',10),
  ('neurology','Neurology','brain','#BF5AF2',11),
  ('urology','Urology','droplets','#0A84FF',12),
  ('infectious','Infectious Disease','virus','#FF453A',13),
  ('metabolic','Metabolic','activity','#FFD60A',14);

-- ── Conditions ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('gord','Gastro-Oesophageal Reflux Disease','gastroenterology','K21.0',
   'Retrograde flow of gastric contents into the oesophagus causing heartburn, regurgitation, and mucosal injury. Common in adults; exacerbated by obesity, pregnancy, and certain foods.','gord'),
  ('ibs','Irritable Bowel Syndrome','gastroenterology','K58',
   'Functional bowel disorder characterised by chronic abdominal pain with altered bowel habit (diarrhoea, constipation, or mixed) without structural pathology. Diagnosis of exclusion.','ibs'),
  ('cellulitis','Cellulitis','dermatology','L03.9',
   'Acute spreading bacterial infection of dermis and subcutaneous tissue, typically caused by Streptococcus pyogenes or Staphylococcus aureus. Presents with erythema, warmth, swelling, and tenderness.','cellulitis'),
  ('eczema','Atopic Dermatitis (Eczema)','dermatology','L20',
   'Chronic relapsing inflammatory skin condition with intense pruritus, xerosis, and eczematous lesions. Associated with personal or family history of atopy (asthma, allergic rhinitis).','eczema'),
  ('urticaria','Urticaria (Hives)','dermatology','L50',
   'Transient wheals (hives) with or without angioedema caused by mast cell degranulation. May be acute (<6 weeks) or chronic. Common triggers: foods, drugs, infections, physical stimuli.','urticaria'),
  ('osteoarthritis','Osteoarthritis','musculoskeletal','M19.9',
   'Degenerative joint disease characterised by cartilage breakdown, subchondral bone changes, and osteophyte formation. Most common in knees, hips, hands. Pain worsens with activity, improves with rest.','osteoarthritis'),
  ('rheumatoid_arthritis','Rheumatoid Arthritis','musculoskeletal','M06.9',
   'Chronic systemic autoimmune disease causing symmetric inflammatory polyarthritis predominantly affecting small joints of hands and feet. Associated with RF, anti-CCP antibodies, and extra-articular features.','rheumatoid-arthritis'),
  ('gout','Gout','musculoskeletal','M10',
   'Crystal arthropathy caused by deposition of monosodium urate crystals in joints and periarticular tissues due to hyperuricaemia. Classic presentation: acute monoarthritis of first MTP joint (podagra).','gout'),
  ('low_back_pain','Low Back Pain','musculoskeletal','M54.5',
   'Mechanical or non-specific pain in the lumbosacral region, often multifactorial. Majority resolve within 6 weeks; red flags (tumour, fracture, infection, cauda equina) require urgent evaluation.','low-back-pain'),
  ('gad','Generalised Anxiety Disorder','psychiatry','F41.1',
   'Chronic excessive worry about multiple domains (health, finances, relationships) with associated somatic symptoms (tension, insomnia, poor concentration). Must be present >6 months.','gad'),
  ('bppv','Benign Paroxysmal Positional Vertigo','ent','H81.1',
   'Most common cause of vertigo. Brief episodes of intense vertigo triggered by head position changes due to displaced otoconia in semicircular canals. Diagnosed by Dix-Hallpike test.','bppv'),
  ('bells_palsy','Bell''s Palsy','neurology','G51.0',
   'Acute idiopathic peripheral facial nerve (CN VII) palsy causing unilateral lower motor neurone facial weakness. Most cases recover fully within 3 months. Probable HSV-1 reactivation aetiology.','bells-palsy'),
  ('hepatitis_b','Hepatitis B','infectious','B18.1',
   'Viral hepatitis caused by HBV transmitted via blood, sexual contact, or mother-to-child. Can cause acute hepatitis, chronic infection, cirrhosis, and hepatocellular carcinoma. Preventable by vaccination.','hepatitis-b'),
  ('dyslipidaemia','Dyslipidaemia','metabolic','E78.5',
   'Abnormal lipid levels including elevated LDL, elevated triglycerides, or low HDL. Major modifiable cardiovascular risk factor. Management includes lifestyle modification and statin therapy.','dyslipidaemia'),
  ('bph','Benign Prostatic Hyperplasia','urology','N40',
   'Non-malignant enlargement of the prostate gland causing lower urinary tract symptoms (LUTS): nocturia, hesitancy, poor stream, post-void dribbling, urgency. Common in men >50 years.','bph');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- GORD
  ('gord','Heartburn (burning retrosternal discomfort after meals)',0,'typical'),
  ('gord','Regurgitation of acid or food',0,'typical'),
  ('gord','Dysphagia or odynophagia',1,'alarm'),
  ('gord','Hoarseness, chronic cough, laryngitis',0,'atypical'),
  ('gord','Nocturnal symptoms disrupting sleep',0,'typical'),
  ('gord','Unintentional weight loss',1,'alarm'),
  -- IBS
  ('ibs','Recurrent abdominal pain or cramping (relieved by defecation)',0,'core'),
  ('ibs','Altered stool form (loose/hard) or frequency',0,'core'),
  ('ibs','Bloating and abdominal distension',0,'core'),
  ('ibs','Mucus in stool',0,'typical'),
  ('ibs','Rectal bleeding (if present — red flag, NOT IBS)',1,'red_flag'),
  ('ibs','Nocturnal diarrhoea waking from sleep',1,'red_flag'),
  -- Cellulitis
  ('cellulitis','Localised redness (erythema) with well-defined or spreading borders',0,'local'),
  ('cellulitis','Warmth and oedema over affected area',0,'local'),
  ('cellulitis','Tenderness and pain',0,'local'),
  ('cellulitis','Fever and systemic upset',0,'systemic'),
  ('cellulitis','Lymphangitis (red streaking) or lymphadenopathy',1,'severe'),
  ('cellulitis','Bullae, necrosis, or crepitus (suggest necrotising fasciitis)',1,'emergency'),
  -- Eczema
  ('eczema','Intense pruritus (itch — hallmark)',0,'core'),
  ('eczema','Dry scaly skin (xerosis)',0,'core'),
  ('eczema','Flexural involvement (antecubital, popliteal fossae in older children/adults)',0,'distribution'),
  ('eczema','Oozing, crusting, excoriation during flares',0,'acute'),
  ('eczema','Lichenification with chronic scratching',0,'chronic'),
  ('eczema','Secondary bacterial infection (impetigo)',1,'complication'),
  -- Urticaria
  ('urticaria','Transient pruritic wheals (hives) anywhere on body',0,'core'),
  ('urticaria','Angioedema (swelling of lips, tongue, face, throat)',1,'severe'),
  ('urticaria','Stridor or dyspnoea (laryngeal oedema — anaphylaxis)',1,'emergency'),
  ('urticaria','Resolves within 24 hours (individual lesions)',0,'characteristic'),
  -- Osteoarthritis
  ('osteoarthritis','Joint pain worsening with activity, relieved by rest',0,'core'),
  ('osteoarthritis','Morning stiffness <30 minutes',0,'core'),
  ('osteoarthritis','Crepitus on movement',0,'sign'),
  ('osteoarthritis','Bony swelling and deformity (Heberden''s, Bouchard''s nodes in hands)',0,'sign'),
  ('osteoarthritis','Restricted range of motion',0,'sign'),
  -- Rheumatoid Arthritis
  ('rheumatoid_arthritis','Symmetric polyarthritis (MCP, PIP, wrist joints)',0,'core'),
  ('rheumatoid_arthritis','Morning stiffness >1 hour',0,'core'),
  ('rheumatoid_arthritis','Soft tissue swelling of joints',0,'core'),
  ('rheumatoid_arthritis','Rheumatoid nodules over bony prominences',0,'extraarticular'),
  ('rheumatoid_arthritis','Fatigue and systemic malaise',0,'systemic'),
  ('rheumatoid_arthritis','Atlantoaxial instability causing neck pain/myelopathy',1,'complication'),
  -- Gout
  ('gout','Acute severe monoarthritis (first MTP joint — podagra)',0,'classic'),
  ('gout','Joint intensely hot, red, swollen, exquisitely tender',0,'classic'),
  ('gout','Onset often overnight; peaks 24–48 hours',0,'pattern'),
  ('gout','Tophi (urate deposits) in ears, tendons, joints',0,'chronic'),
  ('gout','Fever during acute attack',0,'systemic'),
  -- Low Back Pain
  ('low_back_pain','Dull aching lumbosacral pain, may radiate to buttocks',0,'typical'),
  ('low_back_pain','Sciatica — pain radiating below knee along dermatomal distribution',0,'radicular'),
  ('low_back_pain','Neurological deficit (weakness, numbness in lower limb)',1,'red_flag'),
  ('low_back_pain','Bowel or bladder dysfunction (cauda equina)',1,'emergency'),
  ('low_back_pain','Pain worse at night, constitutional symptoms (malignancy/infection)',1,'red_flag'),
  -- GAD
  ('gad','Excessive uncontrollable worry about multiple topics',0,'core'),
  ('gad','Muscle tension and restlessness',0,'somatic'),
  ('gad','Sleep disturbance (difficulty falling or staying asleep)',0,'somatic'),
  ('gad','Poor concentration, mind going blank',0,'cognitive'),
  ('gad','Irritability, fatigue',0,'affective'),
  -- BPPV
  ('bppv','Brief intense vertigo triggered by head position change',0,'core'),
  ('bppv','Nystagmus on Dix-Hallpike test',0,'sign'),
  ('bppv','Nausea and vomiting during attack',0,'associated'),
  ('bppv','Duration <1 minute per episode',0,'characteristic'),
  -- Bell's Palsy
  ('bells_palsy','Acute unilateral facial weakness affecting forehead and lower face',0,'core'),
  ('bells_palsy','Inability to close eye (lagophthalmos) — corneal exposure risk',1,'complication'),
  ('bells_palsy','Loss of taste on anterior 2/3 of tongue',0,'associated'),
  ('bells_palsy','Post-auricular pain preceding weakness',0,'prodrome'),
  ('bells_palsy','Hyperacusis (sensitivity to sound)',0,'associated'),
  -- Hepatitis B
  ('hepatitis_b','Jaundice, dark urine, pale stools',0,'icteric'),
  ('hepatitis_b','Nausea, vomiting, anorexia',0,'prodrome'),
  ('hepatitis_b','Right upper quadrant discomfort',0,'typical'),
  ('hepatitis_b','Fatigue and malaise',0,'typical'),
  ('hepatitis_b','Signs of hepatic failure (encephalopathy, coagulopathy)',1,'severe'),
  -- Dyslipidaemia
  ('dyslipidaemia','Usually asymptomatic — detected on screening',0,'note'),
  ('dyslipidaemia','Xanthelasma (yellowish plaques on eyelids)',0,'sign'),
  ('dyslipidaemia','Tendon xanthomata in familial hypercholesterolaemia',0,'sign'),
  ('dyslipidaemia','Acute pancreatitis with severe hypertriglyceridaemia',1,'complication'),
  -- BPH
  ('bph','Nocturia (waking to void at night)',0,'storage'),
  ('bph','Urinary frequency and urgency',0,'storage'),
  ('bph','Hesitancy and poor urinary stream',0,'voiding'),
  ('bph','Post-void dribbling and incomplete emptying',0,'voiding'),
  ('bph','Urinary retention (acute or chronic)',1,'complication');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('gord','GORD Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('ibs','IBS Management Protocol','Murtagh GP 3rd Ed',2001),
  ('cellulitis','Cellulitis Management Protocol','Gujarat STG 2013',2013),
  ('eczema','Atopic Dermatitis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('urticaria','Urticaria Management Protocol','Gujarat STG 2013',2013),
  ('osteoarthritis','Osteoarthritis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('rheumatoid_arthritis','Rheumatoid Arthritis Management Protocol','Gujarat STG 2013',2013),
  ('gout','Gout Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('low_back_pain','Low Back Pain Management Protocol','Murtagh GP 3rd Ed',2001),
  ('gad','GAD Management Protocol','Murtagh GP 3rd Ed',2001),
  ('bppv','BPPV Management Protocol','Murtagh GP 3rd Ed',2001),
  ('bells_palsy','Bell''s Palsy Management Protocol','Murtagh GP 3rd Ed / Gujarat STG 2013',2013),
  ('hepatitis_b','Hepatitis B Management Protocol','Gujarat STG 2013',2013),
  ('dyslipidaemia','Dyslipidaemia Management Protocol','Gujarat STG 2013',2013),
  ('bph','BPH Management Protocol','Gujarat STG 2013 / Murtagh',2013);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- GORD (protocol rowid follows insert order; use subquery trick not available in SQLite simply)
  -- We'll use last_insert_rowid()-based offset — instead just hardcode relative to protocol insert order
  -- Protocol for GORD is the (SELECT id FROM protocols WHERE condition_id='gord') row
  ((SELECT id FROM protocols WHERE condition_id='gord'),1,'Lifestyle Modification',
   'Weight loss if BMI >25. Elevate head of bed 15–20 cm. Avoid meals 2–3 hours before lying down. Reduce alcohol, caffeine, fatty foods, citrus, chocolate, mints. Quit smoking.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gord'),2,'Step-Up Pharmacotherapy',
   'Step 1: Antacids (Mg/Al hydroxide) or alginate for mild intermittent symptoms. Step 2: H2-receptor antagonists (ranitidine 150 mg BD) for moderate symptoms. Step 3: PPI (omeprazole 20 mg OD before breakfast) for frequent or oesophagitis — 4–8 weeks.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gord'),3,'Alarm Symptoms — Refer/Investigate',
   'Refer for endoscopy if: dysphagia, haematemesis, unintentional weight loss, anaemia, persistent symptoms despite 8 weeks PPI, age >55 with new onset.','severe'),

  ((SELECT id FROM protocols WHERE condition_id='ibs'),1,'Diagnosis',
   'Rome IV criteria: recurrent abdominal pain ≥1 day/week for ≥3 months, with ≥2 of: related to defecation; onset with change in stool frequency; onset with change in stool form. Exclude red flags (bleeding, nocturnal symptoms, weight loss, family history of IBD/colorectal cancer).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='ibs'),2,'Lifestyle & Dietary',
   'Regular meals; avoid large meals. Reduce insoluble fibre, caffeine, fizzy drinks, sorbitol, alcohol. IBS-D: low FODMAP diet. IBS-C: adequate fluid, soluble fibre (ispaghula husk). Regular exercise.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='ibs'),3,'Pharmacotherapy',
   'IBS-D: loperamide 2–4 mg PRN (max 16 mg/day). IBS-C: ispaghula husk, laxatives (lactulose). Antispasmodics: mebeverine 135 mg TDS or hyoscine butylbromide 10–20 mg TDS for pain. Antidepressants (low-dose TCA amitriptyline 10–25 mg nocte) for refractory cases. Probiotics may help.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='cellulitis'),1,'Classification & Initial Assessment',
   'Assess severity: Class 1 (no systemic signs, no comorbidities) — oral antibiotics; Class 2 (mild systemic signs or comorbidity) — consider IV; Class 3 (significant systemic sepsis or limb-threatening) — IV antibiotics, hospitalise; Class 4 (septic shock or necrotising fasciitis) — emergency surgery.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='cellulitis'),2,'Antibiotic Treatment',
   'Non-purulent: oral cloxacillin/flucloxacillin 500 mg QID for 5–7 days (covers streptococci and staphylococci). Amoxicillin-clavulanate (625 mg TDS) if uncertain. IV benzylpenicillin + cloxacillin if severe. Mark border with pen to monitor spread. Elevate affected limb.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='cellulitis'),3,'When to Hospitalise',
   'Admit if: severe or rapidly spreading; facial cellulitis; immunocompromised; treatment failure after 48 hours; signs of necrotising fasciitis (pain out of proportion, crepitus, skin necrosis).','severe'),

  ((SELECT id FROM protocols WHERE condition_id='eczema'),1,'Emollients — Cornerstone of Treatment',
   'Apply liberal emollient (aqueous cream, white soft paraffin, or commercial moisturiser) at least twice daily to all affected skin, even between flares. Apply before topical steroids.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='eczema'),2,'Topical Corticosteroids',
   'Mild (face, skin folds): hydrocortisone 1% cream BD during flares. Moderate (trunk, limbs): betamethasone valerate 0.1% or triamcinolone 0.1%. Apply thinly once or twice daily; step down as soon as control achieved. Avoid prolonged use on face/skin folds.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='eczema'),3,'Antihistamines & Anti-itch',
   'Sedating antihistamine (chlorphenamine 4 mg nocte) for nocturnal itch. Non-sedating (cetirizine 10 mg OD) for daytime. Treat secondary infection with oral flucloxacillin or erythromycin if impetigo present.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='urticaria'),1,'Acute Management',
   'Remove/avoid identifiable trigger. First-line: non-sedating antihistamine (cetirizine 10 mg OD or loratadine 10 mg OD) — continue for ≥3 months in chronic urticaria. Second-line: up-dose to 4x standard dose under specialist guidance.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='urticaria'),2,'Angioedema / Anaphylaxis',
   'If angioedema with laryngeal involvement or anaphylaxis: IM adrenaline 0.5 mg (1:1000) immediately. Antihistamine IV + hydrocortisone IV 200 mg. Maintain airway. Transfer to emergency facility.','severe'),

  ((SELECT id FROM protocols WHERE condition_id='osteoarthritis'),1,'Non-Pharmacological',
   'Weight loss (1 kg loss = 4 kg reduction in knee load). Low-impact exercise (swimming, walking, cycling). Physiotherapy for quadriceps strengthening. Assistive devices: walking stick (contralateral hand), knee sleeve. Heat/cold therapy for pain.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='osteoarthritis'),2,'Pharmacotherapy',
   'Step 1: Paracetamol 1 g TDS-QID (regular). Step 2: Topical NSAID (diclofenac gel) or oral NSAID (ibuprofen 400 mg TDS with food) if paracetamol insufficient — add PPI if GI risk. Step 3: Intra-articular steroid injection for severe flares. Step 4: Refer orthopaedics for joint replacement if severe functional impairment.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='rheumatoid_arthritis'),1,'Early Diagnosis & DMARD Initiation',
   'Refer to rheumatology early (within 3 months of symptom onset). Start methotrexate 7.5–25 mg weekly (with folic acid 5 mg weekly on non-MTX day) as anchor DMARD. Target: remission or low disease activity (DAS28 <2.6 or <3.2).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='rheumatoid_arthritis'),2,'Bridging & Symptomatic Treatment',
   'NSAIDs (ibuprofen 400–800 mg TDS or diclofenac 75 mg BD) for symptom relief. Short-course prednisolone 10–15 mg/day during flares or as bridge. Hydroxychloroquine 200–400 mg/day or sulfasalazine 1–3 g/day as additional DMARDs.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='rheumatoid_arthritis'),3,'Monitoring',
   'Monthly LFT, FBC while on MTX for first 6 months, then 3-monthly. Screen for TB before biologic therapy. Annual ophthalmology review on hydroxychloroquine.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='gout'),1,'Acute Attack Management',
   'Rest and elevate affected joint. Ice pack. First-line: NSAID (indomethacin 50 mg TDS or naproxen 500 mg BD with food) for 5–7 days. Alternative: colchicine 1 mg stat then 0.5 mg after 1 hour (or 0.5 mg BD-TDS). If NSAID/colchicine contraindicated: prednisolone 30–40 mg/day for 5 days.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gout'),2,'Urate-Lowering Therapy (ULT)',
   'Initiate after ≥2 attacks per year, tophi, or uric acid nephropathy. Do not start during acute attack (wait 2–4 weeks). Allopurinol 100 mg/day initially, increase by 100 mg every 4 weeks to target serum urate <360 µmol/L (6 mg/dL). Titrate up to 900 mg/day if needed. Cover with colchicine 0.5 mg OD or NSAID for first 3–6 months of ULT.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gout'),3,'Lifestyle Modification',
   'Reduce red meat, organ meat, shellfish, beer, spirits. Increase water intake >2L/day. Avoid high-fructose corn syrup. Low-fat dairy is protective. Treat hypertension with losartan (mild uricosuric effect) rather than thiazides. Avoid aspirin (low-dose impairs urate excretion).','mild'),

  ((SELECT id FROM protocols WHERE condition_id='low_back_pain'),1,'Initial Assessment & Red Flags',
   'Screen for red flags: age <20 or >55 with new pain, trauma, constant progressive pain, thoracic pain, past history of malignancy, systemic steroids, IV drug use, HIV, unexplained weight loss, neurological signs. If present: urgent imaging and specialist referral.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='low_back_pain'),2,'Acute Management (0–6 weeks)',
   'Reassure: 90% resolve within 6 weeks. Advise to stay active (bed rest harmful). Paracetamol 1 g QID as first-line. Add NSAID (ibuprofen 400 mg TDS with food) if insufficient. Short-course muscle relaxant (diazepam 2–5 mg nocte) for muscle spasm. Physiotherapy.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='low_back_pain'),3,'Chronic / Subacute (>6 weeks)',
   'Physiotherapy and supervised exercise programme. Consider low-dose TCA (amitriptyline 10–25 mg nocte) for neuropathic component. Refer for nerve root injection or surgical opinion if radiculopathy with neurological deficit not improving. Avoid prolonged opioids.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='gad'),1,'Psychoeducation & Lifestyle',
   'Explain the nature of anxiety — normalise. Sleep hygiene. Regular aerobic exercise (30 min, 5x/week). Reduce caffeine and alcohol. Teach relaxation techniques (progressive muscle relaxation, diaphragmatic breathing, mindfulness).','mild'),
  ((SELECT id FROM protocols WHERE condition_id='gad'),2,'Psychological Therapy',
   'CBT (Cognitive Behavioural Therapy) is first-line — 12–15 sessions. Effective for both short- and long-term. If unavailable, guided self-help CBT workbooks or digital programmes.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gad'),3,'Pharmacotherapy',
   'First-line: SSRI (sertraline 50 mg OD, increase to 100–200 mg; or escitalopram 10 mg OD). Takes 4–6 weeks for full effect. Second-line: SNRI (venlafaxine 75–225 mg). Buspirone 10–20 mg BD as alternative. Avoid long-term benzodiazepines (reserve for short-term crisis only: diazepam 2–5 mg). Review at 4 weeks.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='bppv'),1,'Epley Manoeuvre (Canalith Repositioning)',
   'Posterior canal BPPV (most common): perform Epley manoeuvre. Patient sits upright, head turned 45° to affected side, rapidly laid to supine with head extended 20° — wait 30 seconds. Rotate head 90° to opposite side — wait 30 seconds. Roll body to side — wait 30 seconds. Sit up. Success rate >80% with 1–3 sessions. Patient should avoid lying on affected side for 48 hours.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='bppv'),2,'Supportive / Pharmacotherapy',
   'Vestibular suppressants (prochlorperazine 5–10 mg TDS or cinnarizine 25 mg TDS) for acute nausea/vomiting only — do not use long-term (impairs central compensation). Reassure: BPPV is benign, recurrence common (50% within 5 years). Refer if no improvement after 3 Epley attempts.','mild'),

  ((SELECT id FROM protocols WHERE condition_id='bells_palsy'),1,'Corticosteroids (Within 72 Hours)',
   'Prednisolone 50 mg/day for 10 days (or 60 mg/day for 5 days, then taper 10 mg/day) — start within 72 hours of onset for best outcome. Improves rate and completeness of recovery.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='bells_palsy'),2,'Eye Protection',
   'Eye care is essential: artificial tear drops (hydroxyethylcellulose) during day; eye ointment at night; moisture chamber or tape eye shut at night to prevent corneal exposure and ulceration. If unable to close eye, urgent ophthalmology review.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='bells_palsy'),3,'Antivirals & Follow-Up',
   'Add acyclovir 400 mg 5x/day for 7 days if Bell''s palsy is severe (complete paralysis, House-Brackmann grade V–VI). Most patients recover within 3–6 months. Refer if no improvement by 3 months or features suggest non-idiopathic cause (bilateral, recurrent, other cranial nerve involvement).','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='hepatitis_b'),1,'Acute Hepatitis B',
   'Supportive care: rest, adequate nutrition, avoid hepatotoxic drugs and alcohol. Antiviral therapy not routinely indicated in acute hepatitis B (most immunocompetent adults clear spontaneously). Monitor LFTs. Isolation precautions. Notify contacts for HBsAg testing and vaccination.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='hepatitis_b'),2,'Chronic Hepatitis B — When to Treat',
   'Treat if: HBV DNA >2000 IU/mL with elevated ALT, or advanced fibrosis/cirrhosis regardless of viral load, or HBeAg-positive with HBV DNA >20000 IU/mL. Refer to hepatologist. First-line: tenofovir 300 mg OD or entecavir 0.5 mg OD.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='hepatitis_b'),3,'Prevention',
   'HBV vaccination (3-dose: 0, 1, 6 months). Post-exposure prophylaxis: HBIg + vaccine within 24 hours. Screen all pregnant women for HBsAg — neonatal HBIg + vaccine within 12 hours of birth if positive. Screen household and sexual contacts.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='dyslipidaemia'),1,'Cardiovascular Risk Assessment',
   'Calculate 10-year CVD risk (Framingham or WHO/ISH chart). High risk: established CVD, diabetes, CKD stage 3+, very high LDL (>5 mmol/L). Treat all high-risk regardless of lipid values. Moderate/low risk: lifestyle first, treat if LDL remains elevated.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='dyslipidaemia'),2,'Lifestyle Modification (3–6 months)',
   'Dietary: reduce saturated fat (<7% total calories), increase fibre, plant sterols, omega-3 fatty acids. Weight loss if overweight. Physical activity 30 min moderate intensity 5x/week. Quit smoking. Reduce alcohol.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='dyslipidaemia'),3,'Statin Therapy',
   'High-risk: start statin regardless of baseline LDL. Moderate-risk: start if LDL >3 mmol/L after lifestyle. Atorvastatin 10–80 mg OD (high-intensity); rosuvastatin 5–40 mg OD; simvastatin 10–40 mg nocte. Target: LDL <2.6 mmol/L (high risk) or <1.8 mmol/L (very high risk). Monitor LFTs, CK. Add ezetimibe 10 mg if target not reached.','moderate'),

  ((SELECT id FROM protocols WHERE condition_id='bph'),1,'Initial Assessment',
   'IPSS score to quantify severity (mild ≤7, moderate 8–19, severe ≥20). DRE to assess prostate size. PSA if life expectancy >10 years or result would change management. Urinalysis, serum creatinine. Post-void residual ultrasound. Watchful waiting appropriate for mild symptoms.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='bph'),2,'Alpha-Blockers (First-Line)',
   'Alpha-1 blocker: tamsulosin 0.4 mg OD (after meals) or alfuzosin 10 mg OD. Reduce smooth muscle tone in prostate and bladder neck — onset of benefit within 1–2 weeks. Side effects: orthostatic hypotension, retrograde ejaculation (tamsulosin less so).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='bph'),3,'5-Alpha Reductase Inhibitors & Surgery',
   'Add finasteride 5 mg OD or dutasteride 0.5 mg OD if prostate >30 g or PSA >1.5 ng/mL — reduces prostate volume over 3–6 months. Combination therapy (alpha-blocker + 5-ARI) for large prostate with moderate-severe symptoms. Refer urology for: acute urinary retention, renal impairment, recurrent UTI, bladder stones, failed medical therapy (consider TURP).','moderate');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- GORD
  ('gord','Omeprazole','Proton Pump Inhibitor','GORD with oesophagitis or frequent symptoms','20–40 mg','Once daily (before breakfast)','Oral','4–8 weeks (then review)',1,
   'Continue maintenance 20 mg OD if symptoms recur. Take 30 min before food.','Gujarat STG 2013'),
  ('gord','Ranitidine','H2 Receptor Antagonist','Mild-moderate GORD','150 mg','Twice daily','Oral','4–8 weeks',2,
   'Alternative if PPI not available or not tolerated.','Murtagh GP 3rd Ed'),
  ('gord','Antacid (Mg/Al hydroxide)','Antacid','Symptom relief','10–20 mL or 1–2 tablets','As needed after meals and at bedtime','Oral','As needed',3,
   'First-line for mild intermittent heartburn; avoid in renal failure.','Gujarat STG 2013'),

  -- IBS
  ('ibs','Mebeverine','Antispasmodic','IBS with abdominal cramps','135 mg','Three times daily (20 min before meals)','Oral','4 weeks then review',1,
   'Well tolerated; no anticholinergic side effects.','Murtagh GP 3rd Ed'),
  ('ibs','Loperamide','Antidiarrhoeal','IBS-D (diarrhoea predominant)','2 mg after each loose stool (max 16 mg/day)','As needed','Oral','As needed',1,
   'Use for diarrhoea predominant IBS; do not use in IBS-C.','Murtagh GP 3rd Ed'),
  ('ibs','Ispaghula husk','Bulk-forming laxative','IBS-C (constipation predominant)','One sachet (3.5 g)','1–2 times daily with water','Oral','Ongoing',1,
   'Must take with plenty of water to avoid oesophageal obstruction.','Murtagh GP 3rd Ed'),
  ('ibs','Amitriptyline','Tricyclic Antidepressant','Refractory IBS (pain, urgency)','10–25 mg','Once daily at night','Oral','3–6 months then review',2,
   'Sub-analgesic dose for visceral analgesia; not for antidepressant effect.','Murtagh GP 3rd Ed'),
  ('ibs','Hyoscine butylbromide','Antispasmodic','IBS with spasmodic pain','10–20 mg','Three times daily','Oral','Short-term',2,
   'Alternative antispasmodic.','Gujarat STG 2013'),

  -- Cellulitis
  ('cellulitis','Cloxacillin (Flucloxacillin)','Penicillinase-resistant Penicillin','Non-purulent cellulitis (mild-moderate)','500 mg','Four times daily (30 min before food)','Oral','5–7 days',1,
   'Covers both streptococci and staphylococci. Ensure patient not penicillin-allergic.','Gujarat STG 2013'),
  ('cellulitis','Amoxicillin-Clavulanate','Beta-lactam/beta-lactamase inhibitor','Cellulitis with uncertain pathogen','625 mg (500/125)','Three times daily','Oral','5–7 days',2,
   'Broad cover including anaerobes; useful for bite wounds or diabetic foot.','Gujarat STG 2013'),
  ('cellulitis','Clindamycin','Lincosamide','Penicillin-allergic patient','300–450 mg','Three times daily','Oral','5–7 days',2,
   'Cover for MRSA in community settings.','Murtagh GP 3rd Ed'),
  ('cellulitis','Benzylpenicillin + Cloxacillin','Penicillin combination','Severe cellulitis requiring IV therapy','1.2 g BD + 1–2 g QID','IV every 6 hours','IV','Until clinically improving then switch oral',1,
   'Use in hospital. Monitor renal function.','Gujarat STG 2013'),

  -- Eczema
  ('eczema','Hydrocortisone 1%','Mild Topical Corticosteroid','Mild eczema (face, skin folds)','Apply thinly','Twice daily during flare','Topical','Limit to 2 weeks on face',1,
   'Safest steroid for face and skin folds in children and adults.','Gujarat STG 2013'),
  ('eczema','Betamethasone valerate 0.1%','Moderate Topical Corticosteroid','Moderate eczema (trunk, limbs)','Apply thinly','Once or twice daily','Topical','Reduce to lowest effective potency',1,
   'Step down to milder steroid once control achieved.','Gujarat STG 2013'),
  ('eczema','Cetirizine','Non-sedating Antihistamine','Pruritus / urticaria component','10 mg','Once daily','Oral','During flares',2,
   'Reduces itch; less sedating than chlorphenamine.','Gujarat STG 2013'),
  ('eczema','Chlorphenamine','Sedating Antihistamine','Nocturnal itch disrupting sleep','4 mg','At bedtime','Oral','As needed',2,
   'Sedating effect helps with sleep; avoid in elderly (falls risk).','Murtagh GP 3rd Ed'),
  ('eczema','Emollient (aqueous cream)','Emollient','Moisturisation (cornerstone therapy)','Liberally','At least twice daily and after bathing','Topical','Ongoing',1,
   'Apply before topical steroids. Non-irritating base recommended.','Gujarat STG 2013'),

  -- Urticaria
  ('urticaria','Cetirizine','Non-sedating Antihistamine','Urticaria (hives)','10 mg','Once daily','Oral','Until resolution; 3–6 months for chronic',1,
   'First-line; may need 4x standard dose in chronic urticaria under specialist guidance.','Gujarat STG 2013'),
  ('urticaria','Loratadine','Non-sedating Antihistamine','Urticaria (alternative)','10 mg','Once daily','Oral','Until resolution',1,
   'Non-sedating; suitable for daytime use.','Gujarat STG 2013'),
  ('urticaria','Prednisolone','Systemic Corticosteroid','Severe urticaria or angioedema','40–60 mg','Once daily','Oral','3–5 days',2,
   'Short course only; not for chronic urticaria.','Gujarat STG 2013'),

  -- Osteoarthritis
  ('osteoarthritis','Paracetamol','Analgesic','Osteoarthritis pain (mild-moderate)','1 g','Three to four times daily (regular)','Oral','Ongoing as needed',1,
   'Safest first-line analgesic; avoid in hepatic impairment.','Gujarat STG 2013'),
  ('osteoarthritis','Ibuprofen','NSAID','OA pain uncontrolled by paracetamol','400 mg','Three times daily with food','Oral','Short courses — reassess',2,
   'Add PPI (omeprazole) if age >65, GI history, or prolonged use.','Gujarat STG 2013'),
  ('osteoarthritis','Diclofenac gel 1%','Topical NSAID','Knee/hand OA with localised pain','Apply 2–4 g to joint','Three to four times daily','Topical','Up to 12 weeks',1,
   'Similar efficacy to oral NSAID for knee OA with fewer systemic effects.','Murtagh GP 3rd Ed'),
  ('osteoarthritis','Glucosamine sulfate','Nutraceutical','Symptom relief in knee OA','1500 mg','Once daily','Oral','3 months trial',3,
   'Evidence modest; may benefit subgroup with moderate pain. Stop if no benefit after 3 months.','Murtagh GP 3rd Ed'),

  -- Rheumatoid Arthritis
  ('rheumatoid_arthritis','Methotrexate','DMARD (anchor)','Active rheumatoid arthritis','7.5–25 mg','Once weekly','Oral/SC','Long-term (indefinitely if tolerated)',1,
   'Always co-prescribe folic acid 5 mg once weekly (on non-MTX day). Monitor FBC, LFT monthly x 6 months then 3-monthly.','Gujarat STG 2013'),
  ('rheumatoid_arthritis','Hydroxychloroquine','Antimalarial DMARD','Mild RA or combination DMARD','200–400 mg','Once daily','Oral','Long-term',2,
   'Annual ophthalmology review (retinal toxicity risk with prolonged use >5 years).','Gujarat STG 2013'),
  ('rheumatoid_arthritis','Sulfasalazine','DMARD','Moderate RA (combination)','500 mg increasing to 1–3 g','Twice daily (start low, increase weekly)','Oral','Long-term',2,
   'Monitor FBC, LFT 3-monthly.','Gujarat STG 2013'),
  ('rheumatoid_arthritis','Prednisolone','Corticosteroid','Bridging while DMARD takes effect; flares','10–15 mg (bridge) / 5 mg (maintenance)','Once daily','Oral','Bridge: taper over 3 months',2,
   'Use minimum effective dose; osteoporosis prophylaxis with bisphosphonate if long-term.','Gujarat STG 2013'),
  ('rheumatoid_arthritis','Ibuprofen','NSAID','Symptomatic relief during flares','400–800 mg','Three times daily with food','Oral','Short-term',3,
   'Add PPI; does not modify disease course.','Gujarat STG 2013'),

  -- Gout
  ('gout','Indomethacin','NSAID','Acute gout attack','50 mg','Three times daily with food','Oral','5–7 days',1,
   'Most effective NSAID for acute gout; avoid in renal impairment, elderly, peptic ulcer disease.','Gujarat STG 2013'),
  ('gout','Naproxen','NSAID','Acute gout (alternative to indomethacin)','500 mg','Twice daily with food','Oral','5–7 days',1,
   'Better tolerated than indomethacin.','Murtagh GP 3rd Ed'),
  ('gout','Colchicine','Antigout','Acute gout (especially if NSAID contraindicated)','1 mg stat, then 0.5 mg after 1 hour (max 1.5 mg first day)','Then 0.5 mg BD-TDS','Oral','5–7 days',1,
   'Reduce dose in renal/hepatic impairment. GI side effects (diarrhoea, vomiting) common.','Gujarat STG 2013'),
  ('gout','Allopurinol','Xanthine oxidase inhibitor','Prophylaxis — urate lowering','100 mg initially, increase by 100 mg every 4 weeks','Once daily','Oral','Indefinite',1,
   'Start 2–4 weeks AFTER acute attack resolves. Cover initiation with colchicine 0.5 mg OD x 6 months. Target urate <360 µmol/L.','Gujarat STG 2013'),
  ('gout','Prednisolone','Corticosteroid','Acute gout if NSAID and colchicine contraindicated','30–40 mg','Once daily','Oral','5 days',2,
   'Suitable for patients with renal impairment or heart failure where NSAIDs are dangerous.','Murtagh GP 3rd Ed'),

  -- Low Back Pain
  ('low_back_pain','Paracetamol','Analgesic','Acute low back pain — first-line','1 g','Four times daily (regular)','Oral','1–2 weeks',1,
   'Regular dosing more effective than PRN. Safe for most patients.','Gujarat STG 2013'),
  ('low_back_pain','Ibuprofen','NSAID','Low back pain unresponsive to paracetamol','400 mg','Three times daily with food','Oral','1–2 weeks',2,
   'Add PPI if risk factors. Short course recommended.','Gujarat STG 2013'),
  ('low_back_pain','Diazepam','Muscle Relaxant/Benzodiazepine','Acute muscle spasm in LBP','2–5 mg','At night','Oral','3–5 days maximum',2,
   'Short course only for muscle spasm; risk of dependence with prolonged use.','Murtagh GP 3rd Ed'),
  ('low_back_pain','Amitriptyline','Tricyclic Antidepressant','Chronic LBP with neuropathic component','10–25 mg','At night','Oral','3 months then review',3,
   'Low-dose for pain modulation, not antidepressant effect.','Murtagh GP 3rd Ed'),

  -- GAD
  ('gad','Sertraline','SSRI','Generalised Anxiety Disorder','50 mg (start), increase to 100–200 mg','Once daily','Oral','Minimum 6–12 months',1,
   'Takes 4–6 weeks for full anxiolytic effect. May cause initial jitteriness — warn patient. Do not stop abruptly.','Murtagh GP 3rd Ed'),
  ('gad','Escitalopram','SSRI','GAD (alternative SSRI)','10 mg (start), increase to 20 mg','Once daily','Oral','Minimum 6–12 months',1,
   'Well tolerated; fewer drug interactions than other SSRIs.','Murtagh GP 3rd Ed'),
  ('gad','Venlafaxine XR','SNRI','GAD refractory to SSRI','75 mg (start), increase to 225 mg','Once daily','Oral','Minimum 6–12 months',2,
   'Monitor blood pressure. Taper slowly on discontinuation.','Murtagh GP 3rd Ed'),
  ('gad','Buspirone','Azapirone','GAD (non-benzodiazepine)','10–15 mg','Twice to three times daily','Oral','6 months',2,
   'Takes 2–4 weeks to work; not effective PRN. No dependence risk.','Murtagh GP 3rd Ed'),
  ('gad','Diazepam','Benzodiazepine','Short-term crisis management only','2–5 mg','As needed (max 10 days)','Oral','Maximum 2–4 weeks',3,
   'NOT for long-term use — dependence and tolerance. Use only for acute crisis while waiting for SSRI to work.','Murtagh GP 3rd Ed'),

  -- BPPV
  ('bppv','Prochlorperazine','Vestibular suppressant','Acute nausea/vomiting with BPPV','5–10 mg','Three times daily','Oral','3–5 days maximum',2,
   'For symptomatic relief of nausea only. Do not use long-term — impairs vestibular compensation.','Murtagh GP 3rd Ed'),
  ('bppv','Cinnarizine','Antihistamine/vestibular suppressant','Vestibular symptoms with BPPV','25 mg','Three times daily','Oral','Short-term only',2,
   'Alternative antivertigo agent. Sedating — caution driving.','Murtagh GP 3rd Ed'),

  -- Bell's Palsy
  ('bells_palsy','Prednisolone','Corticosteroid','Bell''s palsy — initiate within 72 hours','50–60 mg','Once daily for 5–10 days then taper','Oral','10–14 days total',1,
   'Start as early as possible after onset. Improves recovery rate and completeness.','Murtagh GP 3rd Ed'),
  ('bells_palsy','Acyclovir','Antiviral','Severe Bell''s palsy (complete paralysis)','400 mg','Five times daily','Oral','7–10 days',2,
   'Add to prednisolone for House-Brackmann grade V–VI. Benefit modest but low risk.','Murtagh GP 3rd Ed'),
  ('bells_palsy','Hypromellose eye drops','Ocular lubricant','Corneal protection (lagophthalmos)','1–2 drops','Every 2–4 hours during day','Topical (eye)','Until eye closure returns',1,
   'Eye protection is critical. Use ointment at night and tape eye shut.','Murtagh GP 3rd Ed'),

  -- Hepatitis B
  ('hepatitis_b','Tenofovir disoproxil fumarate','Nucleotide reverse transcriptase inhibitor','Chronic hepatitis B treatment','300 mg','Once daily','Oral','Long-term (indefinite)' ,1,
   'First-line. Monitor renal function and bone density. Excellent safety profile.','Gujarat STG 2013'),
  ('hepatitis_b','Entecavir','Nucleoside analogue','Chronic hepatitis B (alternative)','0.5 mg (naïve); 1 mg (lamivudine-resistant)','Once daily (fasting)','Oral','Long-term',1,
   'High barrier to resistance. Take 2 hours before or after meals.','Gujarat STG 2013'),
  ('hepatitis_b','Hepatitis B Immunoglobulin (HBIg)','Immunoglobulin','Post-exposure prophylaxis; neonatal','0.06 mL/kg','Single dose (with vaccine)','IM','Single dose',1,
   'Give within 24 hours of exposure. Administer at different site from HBV vaccine.','Gujarat STG 2013'),

  -- Dyslipidaemia
  ('dyslipidaemia','Atorvastatin','Statin (high-intensity)','Dyslipidaemia with high CVD risk','10–80 mg','Once daily (any time)','Oral','Long-term',1,
   'High-intensity statin reduces LDL by >50%. Check LFTs at baseline and 3 months. Check CK if myalgia.','Gujarat STG 2013'),
  ('dyslipidaemia','Rosuvastatin','Statin (high-intensity)','High CVD risk dyslipidaemia','5–40 mg','Once daily','Oral','Long-term',1,
   'More potent than atorvastatin mg for mg. Renally excreted — reduce dose in CKD.','Murtagh GP 3rd Ed'),
  ('dyslipidaemia','Simvastatin','Statin (moderate-intensity)','Moderate CVD risk','10–40 mg','Once daily at night','Oral','Long-term',2,
   'Take at night (hepatic cholesterol synthesis peaks overnight). Avoid grapefruit.','Gujarat STG 2013'),
  ('dyslipidaemia','Ezetimibe','Cholesterol absorption inhibitor','Add-on if statin target not reached','10 mg','Once daily','Oral','Long-term',2,
   'Reduces LDL by ~20% additional. Well tolerated. Use with statin.','Murtagh GP 3rd Ed'),
  ('dyslipidaemia','Fenofibrate','Fibrate','Isolated hypertriglyceridaemia or mixed dyslipidaemia','160 mg (micronised)','Once daily with food','Oral','Long-term',2,
   'Best for high triglycerides. Avoid with statins (myopathy risk); if combined — use carefully.','Gujarat STG 2013'),

  -- BPH
  ('bph','Tamsulosin','Alpha-1 adrenergic blocker','BPH-associated LUTS','0.4 mg','Once daily (after meal)','Oral','Long-term',1,
   'Uroselective — less hypotension than non-selective alpha-blockers. May cause retrograde ejaculation.','Gujarat STG 2013'),
  ('bph','Alfuzosin','Alpha-1 adrenergic blocker','BPH-associated LUTS','10 mg (SR)','Once daily (after meal)','Oral','Long-term',1,
   'Alternative alpha-blocker; similar efficacy to tamsulosin.','Gujarat STG 2013'),
  ('bph','Finasteride','5-Alpha reductase inhibitor','BPH with prostate volume >30 g','5 mg','Once daily','Oral','Minimum 6 months (effects take 3–6 months)',2,
   'Reduces prostate volume; prevents urinary retention and need for surgery. Lowers PSA by ~50%.','Gujarat STG 2013'),
  ('bph','Dutasteride','5-Alpha reductase inhibitor','BPH (alternative 5-ARI)','0.5 mg','Once daily','Oral','Long-term',2,
   'Inhibits both type 1 and 2 5-ARI. Similar efficacy to finasteride.','Gujarat STG 2013'),
  ('bph','Solifenacin','Antimuscarinic','BPH with overactive bladder component','5 mg','Once daily','Oral','3 months then review',3,
   'Only add when storage symptoms (urgency, frequency) predominate; ensure adequate bladder emptying first.','Murtagh GP 3rd Ed');
