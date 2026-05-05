-- Chunk 4: 15 more conditions from GP 3rd Ed & Gujarat STG 2013
-- DVT, PE, PCOS, Dysmenorrhoea, PID, Gonorrhoea, Acne, Psoriasis,
-- Scabies, Influenza, Measles, Pertussis, Renal Calculi, Nephrotic Syndrome, Osteoporosis

-- ── Systems (add if missing) ─────────────────────────────────────────────────
INSERT OR IGNORE INTO systems (id, name, icon, color, order_index) VALUES
  ('gynaecology','Gynaecology','heart','#FF375F',15),
  ('haematology','Haematology','droplet','#FF6B35',16),
  ('paediatric_infections','Paediatric / Infections','stethoscope','#30D158',17),
  ('endocrinology','Endocrinology','zap','#FFD60A',18);

-- ── Conditions ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('dvt','Deep Vein Thrombosis (DVT)','haematology','I80.2',
   'Formation of a thrombus within the deep venous system, usually of the lower limb. Risk factors: prolonged immobility, surgery, malignancy, thrombophilia, combined OCP. Risk of potentially fatal pulmonary embolism.','dvt'),
  ('pe','Pulmonary Embolism','haematology','I26.9',
   'Obstruction of pulmonary vasculature by thrombus (usually from DVT), air, fat, or amniotic fluid. Clinical spectrum: asymptomatic to massive PE with haemodynamic collapse. Medical emergency.','pe'),
  ('pcos','Polycystic Ovary Syndrome (PCOS)','gynaecology','E28.2',
   'Heterogeneous endocrine disorder characterised by ovarian dysfunction, hyperandrogenism, and polycystic ovarian morphology. Most common cause of anovulatory infertility. Associated with metabolic syndrome.','pcos'),
  ('dysmenorrhoea','Dysmenorrhoea','gynaecology','N94.4',
   'Painful menstruation. Primary: no underlying pathology — prostaglandin-mediated uterine contractions. Secondary: due to endometriosis, fibroids, PID, or other pelvic pathology. Common in adolescents and young women.','dysmenorrhoea'),
  ('pid','Pelvic Inflammatory Disease','gynaecology','N73.9',
   'Polymicrobial ascending infection of upper genital tract (uterus, fallopian tubes, ovaries) often caused by Chlamydia trachomatis, Neisseria gonorrhoeae, or vaginal flora. Risk of infertility and ectopic pregnancy.','pid'),
  ('gonorrhoea','Gonorrhoea','infectious','A54.9',
   'Sexually transmitted infection caused by Neisseria gonorrhoeae. In men: urethritis (dysuria, discharge). In women: often asymptomatic; may cause PID, cervicitis. Increasing antimicrobial resistance.','gonorrhoea'),
  ('acne','Acne Vulgaris','dermatology','L70.0',
   'Chronic inflammatory skin disease of pilosebaceous units. Multifactorial: follicular plugging, sebum overproduction, Cutibacterium acnes colonisation, and inflammation. Ranges from comedones to severe nodulocystic acne.','acne'),
  ('psoriasis','Psoriasis','dermatology','L40.0',
   'Chronic immune-mediated skin disease characterised by well-demarcated erythematous plaques with silvery scale. Affects elbows, knees, scalp, and lumbosacral area. Associated with psoriatic arthritis, metabolic syndrome.','psoriasis'),
  ('scabies','Scabies','dermatology','B86',
   'Highly contagious ectoparasitic infestation by Sarcoptes scabiei. Intense nocturnal pruritus from hypersensitivity to mite proteins. Burrows in interdigital spaces, wrists, waist. Spread by close skin contact.','scabies'),
  ('influenza','Influenza','infectious','J11',
   'Acute respiratory illness caused by influenza A or B viruses. Seasonal outbreaks. Sudden onset of fever, myalgia, headache, cough. Potentially severe in elderly, immunocompromised, pregnant, and those with chronic illness.','influenza'),
  ('measles','Measles','paediatric_infections','B05',
   'Highly contagious viral illness caused by paramyxovirus. Prodrome (fever, 3 Cs: cough, coryza, conjunctivitis) followed by maculopapular rash spreading from head downward. Koplik''s spots pathognomonic. Preventable by MMR vaccine.','measles'),
  ('pertussis','Whooping Cough (Pertussis)','paediatric_infections','A37',
   'Highly contagious respiratory infection caused by Bordetella pertussis. Classic: 3 stages — catarrhal (1–2 weeks), paroxysmal (intense coughing fits with inspiratory whoop, post-tussive vomiting), convalescent. Dangerous in infants <6 months.','pertussis'),
  ('renal_calculi','Renal Calculi (Kidney Stones)','urology','N20.0',
   'Mineralised concretions in the renal collecting system. Most common: calcium oxalate (70–80%). Presents with renal colic (severe flank pain radiating to groin), haematuria, nausea. Majority <5 mm pass spontaneously.','renal-calculi'),
  ('nephrotic_syndrome','Nephrotic Syndrome','urology','N04',
   'Clinical syndrome: heavy proteinuria (>3.5 g/day), hypoalbuminaemia, oedema, hyperlipidaemia. Causes: minimal change disease (children), membranous nephropathy (adults), focal segmental glomerulosclerosis, diabetic nephropathy.','nephrotic-syndrome'),
  ('osteoporosis','Osteoporosis','musculoskeletal','M81',
   'Skeletal disorder with compromised bone strength predisposing to fracture. T-score ≤ −2.5 on DXA scan. Risk: postmenopausal women, elderly men, glucocorticoid use, malabsorption, hypogonadism. Fractures cause significant morbidity.','osteoporosis');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- DVT
  ('dvt','Unilateral calf/leg swelling, pain, and tenderness',0,'classic'),
  ('dvt','Warmth and redness over affected area',0,'classic'),
  ('dvt','Pitting oedema of affected limb',0,'sign'),
  ('dvt','Homan''s sign (pain on dorsiflexion — low sensitivity/specificity)',0,'sign'),
  ('dvt','Sudden onset dyspnoea or pleuritic chest pain (suggests PE)',1,'emergency'),
  -- PE
  ('pe','Sudden onset dyspnoea (most common symptom)',1,'core'),
  ('pe','Pleuritic chest pain (worse on inspiration)',1,'core'),
  ('pe','Haemoptysis',1,'warning'),
  ('pe','Tachycardia and tachypnoea',1,'sign'),
  ('pe','Hypotension and collapse (massive PE)',1,'emergency'),
  ('pe','Signs of right heart strain',1,'severe'),
  -- PCOS
  ('pcos','Oligomenorrhoea or amenorrhoea',0,'core'),
  ('pcos','Hirsutism (excessive hair on face, chest, abdomen)',0,'androgen'),
  ('pcos','Acne and greasy skin',0,'androgen'),
  ('pcos','Obesity (central adiposity)',0,'metabolic'),
  ('pcos','Infertility (anovulation)',0,'core'),
  ('pcos','Acanthosis nigricans (insulin resistance marker)',0,'metabolic'),
  -- Dysmenorrhoea
  ('dysmenorrhoea','Crampy lower abdominal pain starting with menstruation',0,'core'),
  ('dysmenorrhoea','Pain radiating to lower back and thighs',0,'typical'),
  ('dysmenorrhoea','Nausea, vomiting, diarrhoea during menstruation',0,'associated'),
  ('dysmenorrhoea','Dyspareunia or pelvic pain between periods (suggests endometriosis)',1,'secondary'),
  -- PID
  ('pid','Lower abdominal or pelvic pain (bilateral)',0,'core'),
  ('pid','Cervical motion tenderness (chandelier sign)',0,'sign'),
  ('pid','Adnexal tenderness',0,'sign'),
  ('pid','Abnormal vaginal discharge',0,'typical'),
  ('pid','Fever and raised inflammatory markers',0,'systemic'),
  ('pid','Tubo-ovarian abscess (severe PID)',1,'severe'),
  -- Gonorrhoea
  ('gonorrhoea','Purulent urethral or vaginal discharge',0,'typical'),
  ('gonorrhoea','Dysuria in men (urethritis)',0,'men'),
  ('gonorrhoea','Often asymptomatic in women',0,'note'),
  ('gonorrhoea','Pharyngeal or rectal infection (depending on exposure)',0,'site'),
  ('gonorrhoea','Disseminated gonococcal infection (septic arthritis, skin pustules)',1,'severe'),
  -- Acne
  ('acne','Comedones (open/blackheads, closed/whiteheads)',0,'mild'),
  ('acne','Papules and pustules on face, back, chest',0,'moderate'),
  ('acne','Nodules and cysts (severe acne)',1,'severe'),
  ('acne','Post-inflammatory hyperpigmentation and scarring',0,'complication'),
  -- Psoriasis
  ('psoriasis','Well-demarcated erythematous plaques with thick silvery scale',0,'core'),
  ('psoriasis','Predominant on elbows, knees, scalp, lumbosacral area',0,'distribution'),
  ('psoriasis','Nail changes: pitting, onycholysis, subungual hyperkeratosis',0,'nails'),
  ('psoriasis','Auspitz sign (pinpoint bleeding on scale removal)',0,'sign'),
  ('psoriasis','Joint pain and swelling (psoriatic arthritis — ~30%)',1,'complication'),
  -- Scabies
  ('scabies','Intense nocturnal pruritus (cardinal symptom)',0,'core'),
  ('scabies','Burrows (linear tracks) in interdigital spaces, wrists, waist',0,'pathognomonic'),
  ('scabies','Papular urticarial rash',0,'typical'),
  ('scabies','Secondary bacterial infection (impetigo)',1,'complication'),
  ('scabies','Crusted/Norwegian scabies (heavily crusted, highly infectious) in immunocompromised',1,'severe'),
  -- Influenza
  ('influenza','Sudden onset high fever (38–40°C)',0,'onset'),
  ('influenza','Severe myalgia, headache, fatigue',0,'systemic'),
  ('influenza','Dry cough, sore throat, coryza',0,'respiratory'),
  ('influenza','Anorexia, malaise',0,'systemic'),
  ('influenza','Pneumonia (bacterial superinfection)',1,'complication'),
  -- Measles
  ('measles','Prodrome: high fever, cough, coryza, conjunctivitis',0,'prodrome'),
  ('measles','Koplik''s spots (white spots on buccal mucosa) — pathognomonic',0,'pathognomonic'),
  ('measles','Maculopapular rash starting on face, spreading downward (day 3–5)',0,'rash'),
  ('measles','Pneumonia, encephalitis, otitis media (complications)',1,'complication'),
  ('measles','SSPE (subacute sclerosing panencephalitis) — rare late complication',1,'severe'),
  -- Pertussis
  ('pertussis','Paroxysmal coughing fits followed by inspiratory whoop',0,'paroxysmal'),
  ('pertussis','Post-tussive vomiting',0,'paroxysmal'),
  ('pertussis','Catarrhal phase: mild cough and coryza (infectious but often unrecognised)',0,'early'),
  ('pertussis','Apnoea in infants <3 months (may present without whoop)',1,'infant'),
  ('pertussis','Cyanosis during coughing fits',1,'severe'),
  -- Renal Calculi
  ('renal_calculi','Severe colicky flank pain radiating to groin/genitalia',1,'classic'),
  ('renal_calculi','Haematuria (visible or microscopic)',0,'sign'),
  ('renal_calculi','Nausea and vomiting',0,'associated'),
  ('renal_calculi','Dysuria and urinary frequency (if stone in lower ureter)',0,'lower'),
  ('renal_calculi','Fever with rigors (infected stone — urological emergency)',1,'emergency'),
  -- Nephrotic Syndrome
  ('nephrotic_syndrome','Generalised pitting oedema (periorbital, lower limb, ascites)',0,'core'),
  ('nephrotic_syndrome','Frothy urine (heavy proteinuria)',0,'core'),
  ('nephrotic_syndrome','Hypoalbuminaemia',0,'lab'),
  ('nephrotic_syndrome','Hyperlipidaemia and lipiduria',0,'lab'),
  ('nephrotic_syndrome','Increased infection risk (loss of immunoglobulins)',1,'complication'),
  ('nephrotic_syndrome','Thromboembolism (loss of anticoagulant proteins)',1,'complication'),
  -- Osteoporosis
  ('osteoporosis','Often asymptomatic until fracture occurs',0,'note'),
  ('osteoporosis','Fragility fracture (from minimal trauma) — hip, vertebra, wrist (Colles'')',1,'core'),
  ('osteoporosis','Back pain and height loss from vertebral compression fractures',0,'vertebral'),
  ('osteoporosis','Kyphosis (dowager''s hump)',0,'sign'),
  ('osteoporosis','Recurrent fractures (if untreated)',1,'complication');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('dvt','DVT Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('pe','Pulmonary Embolism Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('pcos','PCOS Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013),
  ('dysmenorrhoea','Dysmenorrhoea Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('pid','Pelvic Inflammatory Disease Management Protocol','Gujarat STG 2013',2013),
  ('gonorrhoea','Gonorrhoea Management Protocol','Gujarat STG 2013',2013),
  ('acne','Acne Vulgaris Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('psoriasis','Psoriasis Management Protocol','Murtagh GP 3rd Ed',2001),
  ('scabies','Scabies Management Protocol','Gujarat STG 2013',2013),
  ('influenza','Influenza Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('measles','Measles Management Protocol','Gujarat STG 2013',2013),
  ('pertussis','Pertussis Management Protocol','Gujarat STG 2013',2013),
  ('renal_calculi','Renal Calculi Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('nephrotic_syndrome','Nephrotic Syndrome Management Protocol','Gujarat STG 2013',2013),
  ('osteoporosis','Osteoporosis Management Protocol','Gujarat STG 2013 / Murtagh GP 3rd Ed',2013);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- DVT
  ((SELECT id FROM protocols WHERE condition_id='dvt'),1,'Risk Stratification (Wells Score)',
   'Calculate Wells score: active cancer (+1), paralysis/plaster (+1), bedridden >3 days or major surgery <12 weeks (+1), tenderness along deep vein (+1), entire leg swelling (+1), calf swelling >3 cm (+1), pitting oedema (+1), collateral superficial veins (+1), alternative diagnosis equally likely (−2). Score ≥2 = high probability, do USS. Score <2 = low probability, do D-dimer; if negative, DVT excluded.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='dvt'),2,'Treatment',
   'Anticoagulation for confirmed DVT: Low-molecular-weight heparin (LMWH) — enoxaparin 1 mg/kg SC BD or 1.5 mg/kg OD. Start oral anticoagulation simultaneously: warfarin (target INR 2–3) or direct oral anticoagulant (DOAC — rivaroxaban 15 mg BD x 3 weeks then 20 mg OD). Duration: provoked DVT 3 months; unprovoked 6 months; recurrent or malignancy — long-term. Elevate limb; compression stockings.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='dvt'),3,'When to Hospitalise',
   'Admit if: PE suspected, severe symptoms, bilateral DVT, phlegmasia cerulea dolens (limb-threatening), significant comorbidity, unable to manage at home.','severe'),

  -- PE
  ((SELECT id FROM protocols WHERE condition_id='pe'),1,'Emergency Assessment',
   'If clinically suspected PE: oxygen, IV access, ECG (S1Q3T3 pattern, right heart strain, sinus tachycardia), CXR, ABG. If haemodynamically unstable (massive PE): immediate IV alteplase 100 mg over 2 hours (systemic thrombolysis). If stable: CT pulmonary angiogram (CTPA) to confirm.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='pe'),2,'Wells Score & D-dimer',
   'Wells PE score: DVT symptoms (+3), PE most likely diagnosis (+3), HR >100 (+1.5), immobilisation/surgery <4 weeks (+1.5), prior DVT/PE (+1.5), haemoptysis (+1), malignancy (+1). Score >4 = high probability; proceed to CTPA. Score ≤4 = low/intermediate; D-dimer negative rules out PE.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pe'),3,'Anticoagulation Treatment',
   'Stable PE: LMWH (enoxaparin 1 mg/kg BD) bridging to warfarin (INR 2–3) OR rivaroxaban 15 mg BD x 21 days then 20 mg OD (no parenteral bridge needed). Duration: provoked 3 months; unprovoked 6 months; recurrent/malignancy — long-term. Transfer if unstable.','severe'),

  -- PCOS
  ((SELECT id FROM protocols WHERE condition_id='pcos'),1,'Lifestyle Modification',
   'Weight loss of even 5–10% significantly improves menstrual regularity, ovulation, and metabolic parameters. Regular aerobic exercise. Low GI diet. Screen for insulin resistance, dyslipidaemia, and depression.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='pcos'),2,'Menstrual Regulation & Androgen Management',
   'Combined oral contraceptive (OCP): regulates cycles, reduces androgens, improves acne and hirsutism. Use if not wanting pregnancy. Metformin 500–2000 mg/day: improves insulin resistance, menstrual regularity, ovulation. Topical eflornithine or laser for hirsutism.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pcos'),3,'Infertility Treatment',
   'For ovulation induction: letrozole 2.5–7.5 mg (days 3–7) is first-line. Alternative: clomiphene 50–150 mg (days 3–7). If resistant: metformin add-on or gonadotropin therapy under specialist care. IVF if above fail.','moderate'),

  -- Dysmenorrhoea
  ((SELECT id FROM protocols WHERE condition_id='dysmenorrhoea'),1,'Primary Dysmenorrhoea Treatment',
   'NSAIDs are first-line: ibuprofen 400–600 mg TDS starting 1–2 days before expected onset, or naproxen 500 mg BD. Take with food; continue for first 2–3 days of period. Combined OCP (if contraception acceptable) reduces prostaglandin production and menstrual volume — very effective.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='dysmenorrhoea'),2,'Secondary Dysmenorrhoea',
   'Investigate if: onset after age 25, progressive worsening, dyspareunia, intermenstrual pain, abnormal pelvic exam. Refer gynaecology for pelvic ultrasound and laparoscopy to exclude endometriosis, fibroids, or PID. Treat underlying cause.','moderate'),

  -- PID
  ((SELECT id FROM protocols WHERE condition_id='pid'),1,'Outpatient Treatment (Mild-Moderate)',
   'Ceftriaxone 500 mg IM single dose (covers gonorrhoea) PLUS doxycycline 100 mg BD + metronidazole 400 mg BD for 14 days. Advise abstinence until patient and partner(s) treated and asymptomatic. Screen for other STIs (chlamydia, HIV).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pid'),2,'Inpatient Treatment (Severe)',
   'Admit if: tubo-ovarian abscess, surgical emergency not excluded, clinically severe (peritoneal signs, high fever), pregnant, or failure of outpatient therapy. IV: cefoxitin 2 g QID + doxycycline 100 mg BD IV, then switch to oral. Ultrasound to exclude tubo-ovarian abscess (may need drainage).','severe'),

  -- Gonorrhoea
  ((SELECT id FROM protocols WHERE condition_id='gonorrhoea'),1,'Treatment',
   'Single-dose dual therapy (to address resistance): ceftriaxone 500 mg IM (1 g if weight >150 kg) PLUS azithromycin 1 g oral single dose. Treat partner(s) simultaneously. Swab for culture before antibiotics if possible. Retest 2 weeks after treatment.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='gonorrhoea'),2,'Contact Tracing & Co-infections',
   'Screen for chlamydia (very common co-infection — treat empirically with doxycycline 100 mg BD x 7 days if not using azithromycin). HIV testing and syphilis serology for all STI patients. Notify public health as per local guidelines.','moderate'),

  -- Acne
  ((SELECT id FROM protocols WHERE condition_id='acne'),1,'Mild Acne (Comedonal)',
   'Topical retinoid (adapalene 0.1% gel or tretinoin 0.025% cream) applied once daily at night — mainstay of comedonal acne. Topical benzoyl peroxide 2.5–5% (antibacterial, anti-inflammatory). Allow 8–12 weeks for response.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='acne'),2,'Moderate Acne (Inflammatory)',
   'Add topical or oral antibiotic: clindamycin 1% topical BD (combine with BPO to reduce resistance), or doxycycline 100 mg OD orally for 3 months. Combined OCP for women with hormonal acne. Do not continue antibiotics beyond 3 months without review.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='acne'),3,'Severe Nodulocystic Acne',
   'Refer dermatologist for oral isotretinoin 0.5–1 mg/kg/day for 4–6 months. Highly effective but teratogenic — mandatory contraception in women, baseline LFTs, lipids, and regular monitoring. Pregnancy test before starting.','severe'),

  -- Psoriasis
  ((SELECT id FROM protocols WHERE condition_id='psoriasis'),1,'Topical Treatment (Mild-Moderate)',
   'Topical corticosteroids (betamethasone dipropionate 0.05% ointment — moderate-potent) combined with vitamin D analogue (calcipotriol 0.005% ointment) — use on alternating days or as fixed-dose combination (Dovobet). Scalp: use medicated shampoo (ketoconazole, selenium sulfide) + topical steroid scalp solution.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='psoriasis'),2,'Moderate-Severe Psoriasis',
   'PUVA (psoralen + UVA phototherapy) or narrow-band UVB for widespread disease. Systemic: methotrexate 5–25 mg weekly + folic acid. Ciclosporin 2.5–5 mg/kg/day for rapid control. Acitretin for hyperkeratotic variants. Refer dermatologist for biologics (anti-TNF, anti-IL-17) if extensive disease unresponsive.','moderate'),

  -- Scabies
  ((SELECT id FROM protocols WHERE condition_id='scabies'),1,'Topical Treatment',
   'Permethrin 5% cream: apply to entire body below neck (including webspaces, genitalia, under nails) at night; wash off after 8–14 hours. Repeat in 1 week. All household and close contacts must be treated simultaneously. Wash all clothing, bedding, and towels in hot water. Antihistamine (chlorphenamine) for itch.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='scabies'),2,'Alternative / Crusted Scabies',
   'Benzyl benzoate 25% (diluted to 12.5% for children): apply twice on consecutive days, wash off after 24 hours. For crusted (Norwegian) scabies: oral ivermectin 200 µg/kg (days 1, 2, 8, 9, 15) + topical permethrin. Treat secondary bacterial infection with antibiotics.','moderate'),

  -- Influenza
  ((SELECT id FROM protocols WHERE condition_id='influenza'),1,'Symptomatic Management',
   'Rest, adequate fluids, paracetamol 1 g QID or ibuprofen 400 mg TDS for fever and myalgia. Most healthy adults recover within 7 days with supportive care. Avoid aspirin in children (Reye''s syndrome risk).','mild'),
  ((SELECT id FROM protocols WHERE condition_id='influenza'),2,'Antivirals (High-Risk Groups)',
   'Oseltamivir (Tamiflu) 75 mg BD for 5 days — start within 48 hours of symptom onset for maximum benefit. Indicated for: hospitalised patients, high-risk groups (elderly, pregnant, immunocompromised, severe obesity, chronic cardiopulmonary disease), severe illness. Annual influenza vaccination for all high-risk groups.','moderate'),

  -- Measles
  ((SELECT id FROM protocols WHERE condition_id='measles'),1,'Supportive Treatment',
   'No specific antiviral. Supportive: antipyretics, adequate fluids, vitamin A supplementation (WHO recommendation: 200,000 IU for 2 days in children — reduces mortality and complications). Isolate patient until 4 days after rash onset. Notify public health.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='measles'),2,'Complications Management',
   'Bacterial pneumonia: antibiotics (amoxicillin or co-amoxiclav). Otitis media: amoxicillin 500 mg TDS x 5 days. Encephalitis: hospital admission, supportive. Ensure all contacts unimmunised are vaccinated within 72 hours of exposure (post-exposure prophylaxis). MMR vaccine at 12–15 months + booster at 4–6 years.','severe'),

  -- Pertussis
  ((SELECT id FROM protocols WHERE condition_id='pertussis'),1,'Antibiotic Treatment',
   'Azithromycin 500 mg on day 1, then 250 mg OD days 2–5 (adults; weight-based for children). Alternative: clarithromycin 500 mg BD x 7 days, or erythromycin 500 mg QID x 14 days (less tolerated). Antibiotics in catarrhal phase can prevent paroxysmal stage; in paroxysmal phase — reduce infectivity but do not shorten illness. Treat all close contacts prophylactically (same regimen for 5 days).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='pertussis'),2,'Hospital Management (Infants)',
   'Admit all infants <6 months with suspected pertussis. Oxygen, monitoring, IV fluids if unable to feed. Avoid stimulation that triggers coughing. Paediatric HDU if apnoeic episodes. Notify public health. DTaP vaccination of pregnant women (28–32 weeks) provides passive antibody to neonate.','severe'),

  -- Renal Calculi
  ((SELECT id FROM protocols WHERE condition_id='renal_calculi'),1,'Acute Pain Management',
   'NSAID (diclofenac 75 mg IM/IV or 50 mg oral TDS) is first-line for ureteric colic — as effective as opioids. Add IV morphine 5–10 mg if NSAID contraindicated or insufficient. Antiemetic (metoclopramide 10 mg) for nausea. IV fluids and adequate hydration. Strain urine to collect stone for analysis.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='renal_calculi'),2,'Intervention',
   'Stone <5 mm: 90% pass spontaneously with conservative management. Alpha-blocker (tamsulosin 0.4 mg OD) facilitates passage of lower ureteric stones 5–10 mm. Stone >10 mm, infection, single kidney, bilateral obstruction: urgent urology referral for ESWL, ureteroscopy, or PCNL.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='renal_calculi'),3,'Prevention',
   'Increase fluid intake to >2.5 L/day (urine output >2 L/day). Calcium oxalate stones: reduce oxalate (spinach, nuts, chocolate), adequate calcium intake (paradoxically protective). Restrict animal protein and salt. Potassium citrate alkalinises urine (useful for uric acid and calcium oxalate stones).','mild'),

  -- Nephrotic Syndrome
  ((SELECT id FROM protocols WHERE condition_id='nephrotic_syndrome'),1,'General Management',
   'Restrict sodium (<2 g/day) to reduce oedema. Fluid restriction if severe oedema. Loop diuretic: furosemide 40–80 mg OD (cautiously — hypoalbuminaemia reduces drug delivery). Statins for dyslipidaemia. ACE inhibitor or ARB to reduce proteinuria. Anticoagulation if albumin <20 g/L (high thrombosis risk).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='nephrotic_syndrome'),2,'Specific Treatment',
   'Minimal change disease (children, adults): prednisolone 1 mg/kg/day (max 60–80 mg) for 4–8 weeks then taper — 80–90% remission. Adults: renal biopsy to determine cause before immunosuppression. Secondary causes: treat underlying disease (e.g., control diabetes for diabetic nephropathy). Refer nephrology for all adult nephrotic syndrome.','severe'),

  -- Osteoporosis
  ((SELECT id FROM protocols WHERE condition_id='osteoporosis'),1,'Non-Pharmacological',
   'Weight-bearing exercise (walking, dancing) 30 min/day. Resistance training. Fall prevention: home safety, vision correction, medication review (reduce hypnotics, antihypertensives causing hypotension). Calcium 1000–1200 mg/day (diet first; supplement if inadequate). Vitamin D 800–1000 IU/day. Quit smoking, limit alcohol.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='osteoporosis'),2,'Pharmacological Treatment',
   'First-line: bisphosphonate (alendronate 70 mg once weekly, or risedronate 35 mg weekly). Take fasting with full glass of water; remain upright 30 min after. Continue for 5 years (3 years in low-risk). Alternative: zoledronic acid 5 mg IV annually. If bisphosphonate intolerant: denosumab 60 mg SC every 6 months. Strontium ranelate second-line.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='osteoporosis'),3,'Monitoring & Fracture Prevention',
   'Repeat DXA scan after 2 years of treatment to assess response. Hip protectors for those at high falls risk. Vertebral fracture assessment at baseline. Calcium + Vitamin D supplementation mandatory with all antiresorptive therapy. Drug holiday after 5 years bisphosphonate in low-moderate risk.','moderate');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- DVT
  ('dvt','Enoxaparin','Low-molecular-weight heparin','Acute DVT anticoagulation','1 mg/kg','Twice daily (or 1.5 mg/kg OD)','SC injection','5–7 days (bridge to oral anticoagulant)',1,
   'Dose-adjust in renal impairment. Monitor anti-Xa in obesity and renal failure.','Gujarat STG 2013'),
  ('dvt','Rivaroxaban','Direct oral anticoagulant (Factor Xa inhibitor)','DVT treatment','15 mg BD x 21 days, then 20 mg OD','Twice daily initially then once daily','Oral','3–6 months',1,
   'Take with food (evening meal). No routine INR monitoring required. Avoid in severe renal impairment (CrCl <30 mL/min).','Murtagh GP 3rd Ed'),
  ('dvt','Warfarin','Vitamin K antagonist','DVT anticoagulation (long-term)','Dose-adjusted to INR 2–3','Once daily','Oral','3–6 months (recurrent/cancer: longer)',2,
   'Numerous drug and food interactions. Regular INR monitoring required. Overlap with heparin for ≥5 days until INR therapeutic.','Gujarat STG 2013'),

  -- PE
  ('pe','Enoxaparin','LMWH','Stable PE bridging anticoagulation','1 mg/kg','Twice daily SC','SC injection','Until oral anticoagulant therapeutic',1,
   'Bridge to warfarin or DOAC.','Gujarat STG 2013'),
  ('pe','Alteplase','Thrombolytic','Massive PE with haemodynamic instability','100 mg','Over 2 hours IV infusion','IV','Single dose',1,
   'Life-saving in massive PE. Major bleeding risk. Contraindicated if recent surgery, active bleeding, stroke <3 months.','Gujarat STG 2013'),
  ('pe','Rivaroxaban','DOAC','Stable confirmed PE','15 mg BD x 3 weeks, then 20 mg OD','With food','Oral','3–6 months minimum',1,
   'No parenteral heparin bridge required. Avoid in pregnancy.','Murtagh GP 3rd Ed'),

  -- PCOS
  ('pcos','Combined oral contraceptive pill','Combined OCP','Menstrual regulation and androgen reduction in PCOS','Standard OCP tablet','Once daily (21 days on, 7 days off)','Oral','Long-term (while not wanting pregnancy)',1,
   'Choose OCP with anti-androgenic progestogen (e.g. drospirenone or cyproterone) for maximum androgen suppression.','Gujarat STG 2013'),
  ('pcos','Metformin','Biguanide','Insulin resistance in PCOS; improves ovulation','500 mg increasing to 1500–2000 mg/day','With meals','Oral','Long-term',1,
   'Start low (500 mg OD) and titrate to reduce GI side effects. Effective for menstrual irregularity and metabolic risk.','Gujarat STG 2013'),
  ('pcos','Letrozole','Aromatase inhibitor','Ovulation induction in PCOS-associated infertility','2.5–7.5 mg','Once daily on days 3–7 of cycle','Oral','Per ovulation induction cycle',1,
   'First-line for ovulation induction (superior to clomiphene). Monitor with USS in specialist setting.','Murtagh GP 3rd Ed'),
  ('pcos','Clomiphene citrate','SERM','Ovulation induction (alternative to letrozole)','50–150 mg','Days 3–7 of cycle','Oral','Per cycle (max 6 cycles)',2,
   'Risk of multiple pregnancy (5%). Monitor with ultrasound.','Gujarat STG 2013'),

  -- Dysmenorrhoea
  ('dysmenorrhoea','Ibuprofen','NSAID','Primary dysmenorrhoea','400–600 mg','Three times daily starting 1–2 days before period','Oral','First 2–3 days of menstruation',1,
   'Most effective when started prophylactically before pain begins. Take with food.','Gujarat STG 2013'),
  ('dysmenorrhoea','Naproxen','NSAID','Dysmenorrhoea (alternative NSAID)','500 mg initially, then 250 mg','Every 6–8 hours','Oral','2–3 days',1,
   'Longer acting than ibuprofen — twice daily dosing adequate.','Murtagh GP 3rd Ed'),
  ('dysmenorrhoea','Combined OCP','Oral contraceptive pill','Recurrent dysmenorrhoea + contraception desired','Standard dose','Daily (continuous or 21-day cycle)','Oral','Long-term',1,
   'Reduces prostaglandin production and menstrual volume; highly effective for primary dysmenorrhoea.','Murtagh GP 3rd Ed'),
  ('dysmenorrhoea','Mefenamic acid','NSAID (fenamate)','Primary dysmenorrhoea','500 mg','Three times daily','Oral','First 3 days of menses',2,
   'Specifically inhibits prostaglandin synthesis; traditional choice for dysmenorrhoea.','Gujarat STG 2013'),

  -- PID
  ('pid','Ceftriaxone + Doxycycline + Metronidazole','Combined antibiotic regimen','Outpatient PID treatment','Ceftriaxone 500 mg IM stat; then Doxycycline 100 mg BD + Metronidazole 400 mg BD','As per individual drugs','IM then Oral','14 days total (oral phase)',1,
   'Cover gonorrhoea (ceftriaxone), chlamydia (doxycycline), and anaerobes (metronidazole). Partner treatment mandatory.','Gujarat STG 2013'),
  ('pid','Ofloxacin + Metronidazole','Combined antibiotic','PID (penicillin-allergic; outpatient)','Ofloxacin 400 mg BD + metronidazole 400 mg BD','Twice daily','Oral','14 days',2,
   'Use only if gonorrhoea resistance to fluoroquinolones is low in the local area.','Gujarat STG 2013'),

  -- Gonorrhoea
  ('gonorrhoea','Ceftriaxone','3rd generation cephalosporin','Uncomplicated gonorrhoea','500 mg (1 g if weight >150 kg)','Single dose','IM','Single dose',1,
   'Gold standard in era of fluoroquinolone resistance. Ensure allergy history taken.','Gujarat STG 2013'),
  ('gonorrhoea','Azithromycin','Macrolide','Co-treatment for chlamydia co-infection','1 g','Single dose','Oral','Single dose',1,
   'Given alongside ceftriaxone as dual therapy. Growing azithromycin resistance in some regions.','Gujarat STG 2013'),
  ('gonorrhoea','Doxycycline','Tetracycline','Chlamydia co-infection / PID component','100 mg','Twice daily','Oral','7 days',2,
   'Alternative to azithromycin for chlamydia. Not in pregnancy.','Gujarat STG 2013'),

  -- Acne
  ('acne','Adapalene 0.1% gel','Topical retinoid','Mild comedonal and inflammatory acne','Apply pea-sized amount','Once daily (at night)','Topical','8–12 weeks minimum',1,
   'Start 3x/week and increase to nightly as tolerated. Avoid sun exposure; use sunscreen. Do not use in pregnancy.','Gujarat STG 2013'),
  ('acne','Benzoyl peroxide 5%','Keratolytic / Antibacterial','Mild-moderate inflammatory acne','Apply thin layer','Once or twice daily','Topical','12 weeks',1,
   'Reduces C. acnes; prevents antibiotic resistance. Can bleach clothing/bedding.','Murtagh GP 3rd Ed'),
  ('acne','Doxycycline','Tetracycline antibiotic','Moderate inflammatory acne','100 mg','Once daily','Oral','Maximum 3 months',2,
   'Combine with topical BPO to reduce resistance. Take with food. Avoid sunbathing (photosensitivity).','Murtagh GP 3rd Ed'),
  ('acne','Isotretinoin','Systemic retinoid','Severe nodulocystic or scarring acne','0.5–1 mg/kg/day','Once or twice daily with food','Oral','4–6 months (cumulative dose 120–150 mg/kg)',1,
   'Dermatologist prescribed only. Mandatory contraception (highly teratogenic). Monitor LFTs, lipids, FBC, mood.','Gujarat STG 2013'),
  ('acne','Combined OCP (anti-androgenic)','OCP','Female acne with hormonal pattern','Standard dose','Daily','Oral','Long-term',2,
   'Co-cyprindiol (Dianette) or OCP with drospirenone effective for hormonal acne in women.','Murtagh GP 3rd Ed'),

  -- Psoriasis
  ('psoriasis','Calcipotriol + Betamethasone (Dovobet)','Vitamin D analogue + steroid','Mild-moderate plaque psoriasis','Apply to plaques','Once daily for 4 weeks','Topical','4 weeks per course',1,
   'Fixed-dose combination; more effective and convenient than either alone.','Murtagh GP 3rd Ed'),
  ('psoriasis','Betamethasone dipropionate 0.05%','Potent topical corticosteroid','Psoriatic plaques (trunk/limbs)','Apply thinly','Once or twice daily','Topical','Short courses; max 4 weeks continuous',1,
   'Risk of skin atrophy with prolonged use. Do not use on face or flexures.','Gujarat STG 2013'),
  ('psoriasis','Methotrexate','DMARD','Moderate-severe psoriasis / psoriatic arthritis','7.5–25 mg','Once weekly','Oral/SC','Long-term with monitoring',2,
   'Folic acid 5 mg on non-MTX day. Monitor FBC, LFTs, renal function 3-monthly.','Gujarat STG 2013'),
  ('psoriasis','Coal tar 5% solution','Keratolytic','Scalp psoriasis','Apply to scalp','Use as shampoo or leave-on','Topical','As needed',3,
   'Old but effective; reduces scale and itch. Messy and has a strong odour. Good for scalp.','Murtagh GP 3rd Ed'),

  -- Scabies
  ('scabies','Permethrin 5% cream','Scabicide','Scabies first-line treatment','Apply head-to-toe below neck','Overnight (8–14 hours); repeat in 1 week','Topical','2 applications 1 week apart',1,
   'Treat all household contacts simultaneously. Wash clothes and bedding in hot water on same day.','Gujarat STG 2013'),
  ('scabies','Benzyl benzoate 25%','Scabicide','Scabies (alternative)','Apply 25% (12.5% for children) to whole body','Overnight for 2 consecutive nights','Topical','2-night course',2,
   'Less pleasant than permethrin; can cause skin irritation. Dilute appropriately for children.','Gujarat STG 2013'),
  ('scabies','Ivermectin','Antiparasitic','Crusted scabies or when topical therapy fails','200 µg/kg','Days 1, 2, 8, 9, 15','Oral','Multiple doses',1,
   'Highly effective for crusted/Norwegian scabies. Use with topical scabicide for best results.','Gujarat STG 2013'),
  ('scabies','Chlorphenamine','Antihistamine','Post-treatment pruritus (can persist 2–4 weeks)','4 mg','Three times daily or at night','Oral','Until itch resolves',3,
   'Pruritus continuing after successful treatment is a hypersensitivity reaction — does not mean treatment failure.','Murtagh GP 3rd Ed'),

  -- Influenza
  ('influenza','Oseltamivir (Tamiflu)','Neuraminidase inhibitor','Influenza treatment (high-risk patients)','75 mg','Twice daily','Oral','5 days',1,
   'Most effective if started within 48 hours of symptom onset. High-risk groups: elderly, pregnant, immunocompromised, obesity, chronic disease.','Gujarat STG 2013'),
  ('influenza','Paracetamol','Analgesic/Antipyretic','Fever and myalgia in influenza','1 g','Four times daily','Oral','Until symptoms resolve',1,
   'Safe and effective for symptomatic relief. Avoid aspirin in children.','Gujarat STG 2013'),

  -- Measles
  ('measles','Vitamin A','Vitamin supplement','Measles in children (WHO protocol)','200,000 IU (>1 year); 100,000 IU (6–12 months); 50,000 IU (<6 months)','Once daily for 2 days','Oral','2 days',1,
   'WHO recommendation for all children with measles regardless of vitamin A status — reduces mortality and pneumonia complications.','Gujarat STG 2013'),
  ('measles','Paracetamol','Antipyretic','Fever management in measles','15 mg/kg (children) / 1 g (adults)','Every 4–6 hours','Oral','As needed',1,
   'Supportive therapy only — no specific antiviral for measles.','Gujarat STG 2013'),
  ('measles','Amoxicillin','Penicillin antibiotic','Bacterial pneumonia complicating measles','500 mg TDS (adult); 25 mg/kg TDS (child)','Three times daily','Oral/IV','5–7 days',2,
   'For secondary bacterial pneumonia. Hospitalise if severe.','Gujarat STG 2013'),

  -- Pertussis
  ('pertussis','Azithromycin','Macrolide','Pertussis treatment and chemoprophylaxis','500 mg day 1, then 250 mg days 2–5 (adults)','Once daily','Oral','5 days',1,
   'First-line for children and adults. Weight-based dosing for children. Treat close contacts prophylactically.','Gujarat STG 2013'),
  ('pertussis','Clarithromycin','Macrolide','Pertussis (alternative)','500 mg','Twice daily','Oral','7 days',2,
   'Alternative if azithromycin not available.','Gujarat STG 2013'),
  ('pertussis','Erythromycin','Macrolide','Pertussis (alternative, especially in pregnancy)','500 mg','Four times daily','Oral','14 days',2,
   'More side effects (GI) than azithromycin but safe in pregnancy and infants.','Gujarat STG 2013'),

  -- Renal Calculi
  ('renal_calculi','Diclofenac','NSAID','Ureteric colic analgesia','75 mg IM/IV or 50 mg oral TDS','As needed for pain (with food if oral)','IM/IV or Oral','Short-term (pain duration)',1,
   'Equivalent to opioids for ureteric colic. Contraindicated in renal failure, GI bleeding, dehydration.','Gujarat STG 2013'),
  ('renal_calculi','Tamsulosin','Alpha-blocker (medical expulsive therapy)','Ureteric stone 5–10 mm — facilitate passage','0.4 mg','Once daily','Oral','4 weeks or until stone passes',1,
   'Relaxes ureter smooth muscle. Most useful for distal ureteric stones.','Gujarat STG 2013'),
  ('renal_calculi','Morphine','Opioid analgesic','Severe ureteric colic unresponsive to NSAID','5–10 mg','IV/IM as needed','IV/IM','Acute episode',2,
   'Use if NSAID contraindicated or insufficient. Monitor for respiratory depression.','Gujarat STG 2013'),
  ('renal_calculi','Potassium citrate','Alkalinising agent','Prevention — uric acid or calcium oxalate stones','10 mEq (1080 mg)','Three times daily with meals','Oral','Long-term',2,
   'Alkalinises urine, reducing calcium oxalate and uric acid stone formation.','Murtagh GP 3rd Ed'),

  -- Nephrotic Syndrome
  ('nephrotic_syndrome','Prednisolone','Corticosteroid','Minimal change disease / primary nephrotic syndrome','1 mg/kg/day (max 60–80 mg)','Once daily','Oral','4–8 weeks then taper',1,
   'Very effective for minimal change disease. Taper over several months to prevent relapse.','Gujarat STG 2013'),
  ('nephrotic_syndrome','Furosemide','Loop diuretic','Oedema management in nephrotic syndrome','40–80 mg','Once or twice daily','Oral/IV','While oedema present',2,
   'Cautious use — hypoalbuminaemia reduces efficacy. Monitor electrolytes. Combine with aldosterone antagonist.','Gujarat STG 2013'),
  ('nephrotic_syndrome','Enalapril or Losartan','ACE inhibitor / ARB','Reduce proteinuria in nephrotic syndrome','Enalapril 5–40 mg OD or Losartan 50–100 mg OD','Once daily','Oral','Long-term',1,
   'Reduces intraglomerular pressure and proteinuria regardless of BP. Key for renoprotection.','Gujarat STG 2013'),
  ('nephrotic_syndrome','Atorvastatin','Statin','Dyslipidaemia in nephrotic syndrome','10–40 mg','Once daily','Oral','Long-term',2,
   'Treat dyslipidaemia to reduce CVD risk. High LDL in nephrotic syndrome.','Gujarat STG 2013'),

  -- Osteoporosis
  ('osteoporosis','Alendronate','Bisphosphonate','Osteoporosis treatment and fracture prevention','70 mg','Once weekly (fasting, full glass water; upright 30 min)','Oral','5 years',1,
   'First-line bisphosphonate. Avoid if GFR <35 mL/min or oesophageal disease. Must be taken correctly to avoid oesophagitis.','Gujarat STG 2013'),
  ('osteoporosis','Risedronate','Bisphosphonate','Osteoporosis (alternative bisphosphonate)','35 mg','Once weekly','Oral','5 years',1,
   'Similar efficacy to alendronate. Better GI tolerability for some patients.','Murtagh GP 3rd Ed'),
  ('osteoporosis','Calcium + Vitamin D','Supplement','Osteoporosis prevention and adjunct to antiresorptive','Calcium 1000 mg + Vitamin D 800 IU','Once or twice daily','Oral','Long-term',1,
   'Essential adjunct to all osteoporosis pharmacotherapy. Dietary calcium preferred; supplement if insufficient.','Gujarat STG 2013'),
  ('osteoporosis','Denosumab','RANK-L inhibitor','Osteoporosis if bisphosphonate intolerant or ineffective','60 mg','Every 6 months','SC injection','Long-term (do not stop abruptly — rebound fracture risk)',2,
   'Reduce dose in CKD. On stopping, must transition to bisphosphonate to prevent rapid bone loss.','Murtagh GP 3rd Ed'),
  ('osteoporosis','Zoledronic acid','IV Bisphosphonate','Osteoporosis (non-oral, once yearly)','5 mg IV infusion','Once yearly','IV infusion (>15 min)','3–6 years',2,
   'Useful for patients unable to take oral bisphosphonates. Pre-hydrate. Can cause acute phase reaction (flu-like) after first dose.','Gujarat STG 2013');
