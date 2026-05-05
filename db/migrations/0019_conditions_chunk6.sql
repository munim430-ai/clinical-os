-- Chunk 6: 15 more conditions
-- Ectopic Pregnancy, PPH, Bacterial Vaginosis, Vaginal Candidiasis, Syphilis,
-- Otitis Externa, Glaucoma, Trigeminal Neuralgia, Peripheral Neuropathy,
-- Organophosphate Poisoning, Snake Bite, Burns, Acute Pancreatitis (covered),
-- Diverticulitis, Neonatal Jaundice

-- ── Systems ───────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO systems (id, name, icon, color, order_index) VALUES
  ('obstetrics','Obstetrics','baby','#FF6B9D',19),
  ('toxicology','Toxicology / Emergency','alert-triangle','#FF453A',20),
  ('neonatology','Neonatology','heart','#30D158',21);

-- ── Conditions ────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO conditions (id, name, system_id, icd10_code, overview, slug) VALUES
  ('ectopic_pregnancy','Ectopic Pregnancy','obstetrics','O00',
   'Implantation of fertilised ovum outside the uterine cavity, most commonly in the fallopian tube (95%). Life-threatening if rupture occurs. Risk factors: previous ectopic, PID, IUD, tubal surgery. Presents with amenorrhoea, pelvic pain, and vaginal bleeding.','ectopic-pregnancy'),
  ('pph','Postpartum Haemorrhage (PPH)','obstetrics','O72',
   'Blood loss ≥500 mL after vaginal delivery or ≥1000 mL after caesarean section. Primary PPH: within 24 hours (uterine atony most common — 80%). Secondary PPH: 24 hours to 12 weeks post-delivery. Leading cause of maternal mortality worldwide.','pph'),
  ('bacterial_vaginosis','Bacterial Vaginosis (BV)','gynaecology','N76.0',
   'Most common vaginal infection in women of reproductive age. Caused by overgrowth of anaerobic bacteria (Gardnerella, Mobiluncus) with reduction of Lactobacillus. Presents with fishy-smelling grey/white discharge. Not an STI but sexually associated.','bacterial-vaginosis'),
  ('vaginal_candidiasis','Vaginal Candidiasis (Thrush)','gynaecology','B37.3',
   'Fungal infection of vagina and vulva caused by Candida albicans (90%). Presents with thick white curd-like discharge, intense vulvovaginal pruritus, dyspareunia, and dysuria. Triggered by antibiotics, diabetes, pregnancy, immunosuppression.','vaginal-candidiasis'),
  ('syphilis','Syphilis','infectious','A51',
   'Systemic STI caused by Treponema pallidum. Stages: primary (painless genital ulcer/chancre), secondary (rash, condylomata lata), latent, tertiary (gummas, cardiovascular, neurosyphilis). Congenital syphilis devastating. Easily treated with penicillin.','syphilis'),
  ('otitis_externa','Otitis Externa (Swimmer''s Ear)','ent','H60',
   'Acute inflammation of external auditory canal, most often bacterial (Pseudomonas aeruginosa, Staphylococcus aureus). Presents with otalgia (ear pain), otorrhoea, pruritus, and tragus tenderness. Associated with swimming and ear trauma.','otitis-externa'),
  ('glaucoma','Glaucoma','ophthalmology','H40',
   'Group of optic neuropathies characterised by progressive optic nerve damage and visual field loss. Primary open-angle glaucoma (POAG): commonest, insidious, painless. Acute angle-closure glaucoma: medical emergency — sudden painful red eye, haloes, nausea, vomiting.','glaucoma'),
  ('trigeminal_neuralgia','Trigeminal Neuralgia','neurology','G50.0',
   'Severe paroxysmal unilateral facial pain in the distribution of trigeminal nerve (V2/V3 most common). Described as electric shock-like. Triggered by touching face, chewing, talking, cold air. Idiopathic or from vascular compression.','trigeminal-neuralgia'),
  ('peripheral_neuropathy','Peripheral Neuropathy','neurology','G62.9',
   'Damage to peripheral nerves causing weakness, numbness, and pain in hands and feet. Most common causes: diabetes (diabetic peripheral neuropathy), alcohol, B12 deficiency, hypothyroidism, drugs (metronidazole, chemotherapy). Length-dependent pattern (stocking-glove).','peripheral-neuropathy'),
  ('op_poisoning','Organophosphate Poisoning','toxicology','T60.0',
   'Life-threatening toxidrome from organophosphate (pesticide) ingestion, inhalation, or skin absorption. Mechanism: irreversible acetylcholinesterase inhibition causing cholinergic excess. SLUDGE + DUMBELS mnemonics for features. Agricultural settings common.','op-poisoning'),
  ('snake_bite','Venomous Snake Bite','toxicology','T63.0',
   'Snake envenomation causing local tissue effects (swelling, necrosis) and/or systemic effects (coagulopathy, neurotoxicity, renal failure). Common in South Asia. Cobra (neurotoxic), viper (haemotoxic). Antivenom is definitive treatment.','snake-bite'),
  ('burns','Burns','emergency','T30',
   'Thermal, chemical, or electrical injury to skin and deeper tissues. Classified by depth (superficial, partial-thickness, full-thickness) and body surface area (Rule of Nines or Lund-Browder chart). Major burns require fluid resuscitation, airway management, and specialist care.','burns'),
  ('diverticulitis','Acute Diverticulitis','gastroenterology','K57.3',
   'Inflammation of colonic diverticula, typically in sigmoid colon. Presents with left iliac fossa pain, fever, and altered bowel habit. Complications: abscess, perforation, fistula, obstruction. Most cases are uncomplicated and managed conservatively.','diverticulitis'),
  ('neonatal_jaundice','Neonatal Jaundice','neonatology','P59',
   'Yellow discolouration of skin and sclerae from hyperbilirubinaemia in neonates. Physiological jaundice peaks day 3–5, resolves by day 14. Pathological causes: haemolysis (Rh/ABO incompatibility, G6PD deficiency), infection, biliary atresia. High unconjugated bilirubin causes kernicterus.','neonatal-jaundice'),
  ('gerd_silent','Oral Candidiasis (Thrush)','infectious','B37.0',
   'Candida albicans infection of oral mucosa. Presents with white plaques on tongue and buccal mucosa that can be scraped off leaving bleeding surface. Associated with antibiotic use, corticosteroid inhaler, immunosuppression, diabetes, dentures, infancy.','oral-candidiasis');

-- ── Symptoms ──────────────────────────────────────────────────────────────────
INSERT INTO symptoms (condition_id, text, is_warn_sign, category) VALUES
  -- Ectopic Pregnancy
  ('ectopic_pregnancy','Amenorrhoea (missed period) + positive pregnancy test',0,'core'),
  ('ectopic_pregnancy','Unilateral lower abdominal or pelvic pain',0,'core'),
  ('ectopic_pregnancy','Vaginal bleeding (irregular, light — dark brown)',0,'typical'),
  ('ectopic_pregnancy','Shoulder tip pain (diaphragmatic irritation from haemoperitoneum)',1,'rupture'),
  ('ectopic_pregnancy','Hypotension, tachycardia, syncope (ruptured ectopic)',1,'emergency'),
  ('ectopic_pregnancy','Adnexal tenderness and cervical motion tenderness',0,'sign'),
  -- PPH
  ('pph','Excessive uterine bleeding within 24 hours of delivery (primary PPH)',1,'core'),
  ('pph','Soft, boggy, poorly contracted uterus (uterine atony)',1,'atony'),
  ('pph','Tachycardia, hypotension, pallor — haemorrhagic shock',1,'emergency'),
  ('pph','Retained placenta or placental fragments',1,'cause'),
  ('pph','Perineal or vaginal lacerations with ongoing bleeding',1,'cause'),
  -- Bacterial Vaginosis
  ('bacterial_vaginosis','Thin grey-white homogeneous vaginal discharge',0,'core'),
  ('bacterial_vaginosis','Fishy (amine) odour — worse after intercourse',0,'core'),
  ('bacterial_vaginosis','Minimal or no vulval itching (distinguishes from candidiasis)',0,'distinguishing'),
  ('bacterial_vaginosis','Clue cells on wet prep microscopy (pathognomonic)',0,'lab'),
  -- Vaginal Candidiasis
  ('vaginal_candidiasis','Thick white curd-like (cottage cheese) vaginal discharge',0,'core'),
  ('vaginal_candidiasis','Intense vulvovaginal pruritus',0,'core'),
  ('vaginal_candidiasis','Dyspareunia and vulval soreness/erythema',0,'typical'),
  ('vaginal_candidiasis','Dysuria (external dysuria from irritated vulva)',0,'typical'),
  ('vaginal_candidiasis','Recurrence (>4 episodes/year — consider diabetes, immunosuppression)',0,'recurrent'),
  -- Syphilis
  ('syphilis','Primary: painless genital ulcer (chancre) with indurated edges',0,'primary'),
  ('syphilis','Secondary: diffuse maculopapular rash including palms and soles',0,'secondary'),
  ('syphilis','Secondary: condylomata lata, oral mucus patches, generalised lymphadenopathy',0,'secondary'),
  ('syphilis','Latent syphilis: asymptomatic (detected on serology)',0,'latent'),
  ('syphilis','Tertiary: neurosyphilis, aortitis, gummas (late)',1,'tertiary'),
  -- Otitis Externa
  ('otitis_externa','Otalgia (ear pain) — often severe, worsens on jaw movement',0,'core'),
  ('otitis_externa','Tenderness on tragus or pinna traction (pathognomonic)',0,'sign'),
  ('otitis_externa','Otorrhoea (purulent discharge)',0,'typical'),
  ('otitis_externa','Pruritus and canal oedema reducing hearing',0,'typical'),
  ('otitis_externa','Malignant otitis externa (temporal bone osteomyelitis in diabetics)',1,'severe'),
  -- Glaucoma
  ('glaucoma','POAG: gradual painless peripheral vision loss (tunnel vision)',0,'poag'),
  ('glaucoma','POAG: often asymptomatic until late (found on routine screening)',0,'poag'),
  ('glaucoma','AACG: sudden severe eye pain with red eye',1,'aacg'),
  ('glaucoma','AACG: blurred vision with haloes around lights, nausea, vomiting',1,'aacg'),
  ('glaucoma','AACG: rock-hard eye, mid-dilated fixed pupil',1,'emergency'),
  -- Trigeminal Neuralgia
  ('trigeminal_neuralgia','Paroxysmal severe electric shock-like facial pain (seconds to 2 minutes)',0,'core'),
  ('trigeminal_neuralgia','Unilateral in V2 (cheek/lip) or V3 (jaw/teeth) distribution',0,'distribution'),
  ('trigeminal_neuralgia','Triggered by light touch (eating, talking, cold wind, face washing)',0,'trigger'),
  ('trigeminal_neuralgia','Pain-free intervals between attacks',0,'characteristic'),
  -- Peripheral Neuropathy
  ('peripheral_neuropathy','Numbness and tingling (burning/pins and needles) in feet and hands',0,'sensory'),
  ('peripheral_neuropathy','Stocking-glove distribution',0,'distribution'),
  ('peripheral_neuropathy','Burning or stabbing nocturnal pain',0,'painful'),
  ('peripheral_neuropathy','Weakness and wasting (motor neuropathy)',0,'motor'),
  ('peripheral_neuropathy','Loss of ankle reflexes',0,'sign'),
  -- Organophosphate Poisoning
  ('op_poisoning','SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI cramps, Emesis',1,'muscarinic'),
  ('op_poisoning','Miosis (pinpoint pupils)',1,'muscarinic'),
  ('op_poisoning','Bradycardia, bronchospasm, hypersecretions',1,'muscarinic'),
  ('op_poisoning','Muscle fasciculations, weakness, paralysis (nicotinic)',1,'nicotinic'),
  ('op_poisoning','Seizures, coma, respiratory failure (CNS)',1,'emergency'),
  -- Snake Bite
  ('snake_bite','Local swelling, pain, and bruising at bite site (haemotoxic viper)',0,'local'),
  ('snake_bite','Ptosis, diplopia, dysphagia (neurotoxic cobra/krait)',1,'neurotoxic'),
  ('snake_bite','Bleeding from gums, haematuria, haematemesis (coagulopathy)',1,'haemotoxic'),
  ('snake_bite','Respiratory paralysis (neurotoxic — most dangerous)',1,'emergency'),
  ('snake_bite','Fang marks, swelling tracking up limb',0,'sign'),
  -- Burns
  ('burns','Erythema, blistering, or full-thickness skin loss depending on depth',0,'local'),
  ('burns','Pain (less in full-thickness burns — nerve destruction)',0,'pain'),
  ('burns','Inhalation injury: hoarseness, stridor, singed nasal hairs',1,'airway'),
  ('burns','Hypovolemic shock (burns >15% BSA)',1,'systemic'),
  ('burns','Smoke inhalation / carbon monoxide poisoning',1,'emergency'),
  -- Diverticulitis
  ('diverticulitis','Left iliac fossa pain (localised, constant)',0,'core'),
  ('diverticulitis','Fever and leucocytosis',0,'systemic'),
  ('diverticulitis','Change in bowel habit (constipation or diarrhoea)',0,'typical'),
  ('diverticulitis','Nausea and vomiting',0,'associated'),
  ('diverticulitis','Localised peritonitis, abscess, or free perforation',1,'complication'),
  -- Neonatal Jaundice
  ('neonatal_jaundice','Yellow discolouration of skin and sclerae in neonate',0,'core'),
  ('neonatal_jaundice','Jaundice within 24 hours of birth (always pathological)',1,'pathological'),
  ('neonatal_jaundice','Jaundice persisting >14 days in term, >21 days in preterm',1,'prolonged'),
  ('neonatal_jaundice','Poor feeding, lethargy, high-pitched cry (kernicterus precursors)',1,'emergency'),
  ('neonatal_jaundice','Pale stools + dark urine (conjugated jaundice — biliary atresia)',1,'surgical'),
  -- Oral Candidiasis
  ('gerd_silent','White plaques on tongue, palate, or buccal mucosa',0,'core'),
  ('gerd_silent','Plaques bleed when scraped (distinguishes from milk residue)',0,'sign'),
  ('gerd_silent','Burning sensation or oral pain',0,'typical'),
  ('gerd_silent','Dysphagia (oesophageal candidiasis — HIV/immunosuppressed)',1,'severe');

-- ── Protocols ─────────────────────────────────────────────────────────────────
INSERT INTO protocols (condition_id, title, source, year) VALUES
  ('ectopic_pregnancy','Ectopic Pregnancy Management Protocol','Gujarat STG 2013',2013),
  ('pph','Postpartum Haemorrhage (PPH) Management Protocol','Gujarat STG 2013',2013),
  ('bacterial_vaginosis','Bacterial Vaginosis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('vaginal_candidiasis','Vaginal Candidiasis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('syphilis','Syphilis Management Protocol','Gujarat STG 2013',2013),
  ('otitis_externa','Otitis Externa Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('glaucoma','Glaucoma Management Protocol','Murtagh GP 3rd Ed',2001),
  ('trigeminal_neuralgia','Trigeminal Neuralgia Management Protocol','Murtagh GP 3rd Ed',2001),
  ('peripheral_neuropathy','Peripheral Neuropathy Management Protocol','Murtagh GP 3rd Ed / Gujarat STG',2013),
  ('op_poisoning','Organophosphate Poisoning Management Protocol','Gujarat STG 2013',2013),
  ('snake_bite','Snake Bite Management Protocol','Gujarat STG 2013',2013),
  ('burns','Burns Management Protocol','Gujarat STG 2013',2013),
  ('diverticulitis','Acute Diverticulitis Management Protocol','Gujarat STG 2013 / Murtagh',2013),
  ('neonatal_jaundice','Neonatal Jaundice Management Protocol','Gujarat STG 2013',2013),
  ('gerd_silent','Oral Candidiasis Management Protocol','Gujarat STG 2013 / Murtagh',2013);

-- ── Protocol Steps ────────────────────────────────────────────────────────────
INSERT INTO protocol_steps (protocol_id, step_number, heading, body, severity) VALUES
  -- Ectopic Pregnancy
  ((SELECT id FROM protocols WHERE condition_id='ectopic_pregnancy'),1,'Emergency Assessment',
   'Any woman of reproductive age with abdominal pain + amenorrhoea = ectopic until proven otherwise. Urine or serum beta-hCG. Transvaginal USS: empty uterus + adnexal mass + free fluid = ruptured ectopic. IV access x2, FBC, group and crossmatch, clotting. Do not delay if haemodynamically unstable.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='ectopic_pregnancy'),2,'Management by Stability',
   'Haemodynamically unstable (ruptured): emergency laparoscopy/laparotomy. Resuscitate simultaneously. Haemodynamically stable, unruptured (<3.5 cm, beta-hCG <5000 IU/L, no cardiac activity): medical management with methotrexate 50 mg/m2 IM (single dose) — follow beta-hCG to zero. Surgical if criteria not met or patient declining medically.','severe'),

  -- PPH
  ((SELECT id FROM protocols WHERE condition_id='pph'),1,'Initial Resuscitation (HAEMOSTASIS)',
   'H: call for Help. A: Assess ABC, IV access x2, fluid resuscitation. E: Establish cause (4 Ts: Tone, Trauma, Tissue, Thrombin). M: Massage uterus (bimanual compression). O: Oxytocin 10–40 units IV infusion. S: Shift to theatre if needed. T: Transfuse blood products. A: Apply compression (aortic or uterine). S: Surgical options (B-Lynch suture, hysterectomy). I: Interventional radiology.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='pph'),2,'Uterotonic Drugs',
   'Oxytocin 10 IU slow IV bolus (first-line). If fails: ergometrine 0.5 mg IM/IV. If fails: carboprost (15-methyl PGF2α) 0.25 mg IM every 15 min (max 8 doses). Or misoprostol 800 µg rectal/sublingual. Tranexamic acid 1 g IV within 3 hours of delivery onset — reduces mortality.','severe'),

  -- Bacterial Vaginosis
  ((SELECT id FROM protocols WHERE condition_id='bacterial_vaginosis'),1,'Diagnosis (Amsel Criteria)',
   'Amsel criteria (3 of 4): grey-white homogeneous discharge; vaginal pH >4.5; positive whiff test (10% KOH fishy odour); clue cells >20% on wet prep. Nugent score on Gram stain is gold standard.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='bacterial_vaginosis'),2,'Treatment',
   'Metronidazole 400–500 mg BD for 7 days (preferred) OR metronidazole 2 g single dose (less effective). Alternative: metronidazole 0.75% gel intravaginally OD for 5 days or clindamycin 2% vaginal cream OD for 7 days. Avoid alcohol with oral metronidazole. Treat in pregnancy (reduces preterm birth risk). Partner treatment not recommended routinely.','mild'),

  -- Vaginal Candidiasis
  ((SELECT id FROM protocols WHERE condition_id='vaginal_candidiasis'),1,'Uncomplicated Candidiasis',
   'Single-dose topical or oral: clotrimazole 500 mg vaginal pessary (single dose) or fluconazole 150 mg oral single dose. For mild symptoms: clotrimazole 1% cream BD for 7 days. Avoid irritants. Diabetes management if present. No need to treat asymptomatic partner.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='vaginal_candidiasis'),2,'Recurrent Candidiasis (≥4 episodes/year)',
   'Induction: fluconazole 150 mg every 3 days x 3 doses. Maintenance: fluconazole 150 mg weekly for 6 months. Screen for and treat diabetes, HIV. Review medications (antibiotics, OCP, steroids). Advise loose cotton underwear; avoid douching.','moderate'),

  -- Syphilis
  ((SELECT id FROM protocols WHERE condition_id='syphilis'),1,'Treatment by Stage',
   'Primary, secondary, early latent (<2 years): benzathine penicillin G 2.4 million units IM single dose. Late latent or latent of unknown duration: benzathine penicillin G 2.4 million units IM weekly x 3 doses. Neurosyphilis: IV benzylpenicillin 18–24 million units/day for 10–14 days (4 million units IV q4h or continuous infusion).','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='syphilis'),2,'Penicillin Allergy and Contact Tracing',
   'Penicillin allergy (non-pregnant): doxycycline 100 mg BD for 14 days (primary/secondary) or 28 days (latent). Pregnant women MUST be desensitised and treated with penicillin — no acceptable alternative. Treat all contacts from last 90 days for primary/secondary, 1–2 years for latent. Screen for HIV. Jarisch-Herxheimer reaction (fever, rigors within 24 hours) — warn patient; treat with paracetamol.','moderate'),

  -- Otitis Externa
  ((SELECT id FROM protocols WHERE condition_id='otitis_externa'),1,'Treatment',
   'Topical antibiotics: acetic acid 2% drops QID for 7 days (first-line mild-moderate) OR ciprofloxacin 0.2% drops (if tympanic membrane status unknown or perforation risk). Combine with topical hydrocortisone (anti-inflammatory): ciprofloxacin/hydrocortisone combination drops. Gentle aural toilet (microsuction by ENT if canal occluded by debris). Analgesia (ibuprofen/paracetamol). Keep ear dry.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='otitis_externa'),2,'Malignant Otitis Externa',
   'Suspect in elderly diabetics with severe, treatment-resistant otalgia and granulation tissue at floor of canal. CT temporal bone. Oral ciprofloxacin 750 mg BD for 6–8 weeks. Refer ENT urgently for debridement and IV antibiotics. Associated with significant mortality if untreated.','severe'),

  -- Glaucoma
  ((SELECT id FROM protocols WHERE condition_id='glaucoma'),1,'Chronic Open-Angle Glaucoma',
   'Ophthalmology referral for confirmed POAG (IOP >21 mmHg + optic nerve changes + visual field defects). First-line IOP lowering: prostaglandin analogue drops (latanoprost 0.005% OD at night) — reduces IOP by 30%. Add timolol 0.5% BD if insufficient. Laser trabeculoplasty or trabeculectomy for uncontrolled IOP.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='glaucoma'),2,'Acute Angle-Closure Glaucoma (Emergency)',
   'Immediate ophthalmology referral. While awaiting: IV acetazolamide 500 mg stat + pilocarpine 2% drops every 15 min x 1 hour + topical timolol 0.5% + IV mannitol 1–2 g/kg (if available). Do not dilate pupils. Definitive: laser peripheral iridotomy to both eyes.','severe'),

  -- Trigeminal Neuralgia
  ((SELECT id FROM protocols WHERE condition_id='trigeminal_neuralgia'),1,'First-Line Treatment',
   'Carbamazepine 100 mg BD, increasing by 100–200 mg every 2–3 days to 400–800 mg/day in divided doses. Effective in 70–80%. Monitor: FBC, LFTs, sodium (hyponatraemia risk). Check HLA-B*1502 allele in Asian patients before starting (risk of Stevens-Johnson syndrome). Pregabalin 75–300 mg BD as alternative.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='trigeminal_neuralgia'),2,'Refractory Cases',
   'Oxcarbazepine 300–1800 mg/day (better tolerated than carbamazepine). Refer neurosurgery if medically refractory: microvascular decompression (most effective surgical procedure, 80–90% relief), or percutaneous procedures (glycerol injection, balloon compression, stereotactic radiosurgery). MRI brain to exclude secondary cause (MS, posterior fossa tumour, vascular malformation).','moderate'),

  -- Peripheral Neuropathy
  ((SELECT id FROM protocols WHERE condition_id='peripheral_neuropathy'),1,'Treat Underlying Cause',
   'Diabetic neuropathy: optimise glycaemic control (HbA1c <53 mmol/mol). B12 deficiency: IM hydroxocobalamin 1 mg 3x/week x 2 weeks then monthly. Hypothyroid: levothyroxine. Alcohol: abstinence, thiamine 100 mg TDS + B vitamins. Drug-induced: stop offending drug if possible. Identify and correct all reversible causes.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='peripheral_neuropathy'),2,'Pain Management',
   'First-line: amitriptyline 10–75 mg nocte (NNT ~3) OR pregabalin 75–300 mg BD (also effective for sleep). Second-line: duloxetine 60–120 mg/day. Topical capsaicin 0.075% cream (burning on application) for localised pain. Opioids (tramadol 50–100 mg QID) for refractory cases — caution dependence. Avoid conventional NSAIDs (ineffective for neuropathic pain).','moderate'),

  -- Organophosphate Poisoning
  ((SELECT id FROM protocols WHERE condition_id='op_poisoning'),1,'Immediate Decontamination and Airway',
   'Remove from exposure. Remove and bag contaminated clothing (protect staff with gloves and gowns). Wash skin with soap and water x 10–15 minutes. If ingested: do NOT induce vomiting. Secure airway (RSI if unconscious). High-flow oxygen. IV access, ECG monitoring. Check RBC/plasma cholinesterase if available.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='op_poisoning'),2,'Atropine (First Priority)',
   'Atropine 2–4 mg IV every 5–10 minutes until secretions dry (bronchorrhoea resolved) — endpoint is dry lungs, not pupil size or HR. Total doses can be very large (20–100+ mg). Then atropine infusion 10–20% of loading dose per hour.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='op_poisoning'),3,'Pralidoxime (Oxime — Cholinesterase Reactivator)',
   'Pralidoxime (2-PAM) 1–2 g IV over 15–30 minutes, then 200–500 mg/hour infusion. MUST be given within 24–48 hours of poisoning (before cholinesterase ''ageing''). Ineffective after ageing; give regardless if time uncertain. ICU for ventilatory support. Benzodiazepines (diazepam) for seizures.','severe'),

  -- Snake Bite
  ((SELECT id FROM protocols WHERE condition_id='snake_bite'),1,'First Aid and Assessment',
   'Immobilise bitten limb; keep at or below heart level. Remove constrictive clothing/jewellery. NO tourniquet, NO incision, NO suction. IV access, blood for 20-minute whole blood clotting test (WBCT): incoagulable blood = systemic envenomation. Monitor BP, RR, neuro status. Identify snake species if safe to do so.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='snake_bite'),2,'Antivenom (Definitive Treatment)',
   'Polyvalent antivenom IV (not IM) if: systemic envenomation signs (coagulopathy, neurotoxicity, haemolysis, shock, AKI, or local signs progressing rapidly). Dilute 10 vials in 200 mL NS, infuse over 1 hour (start slowly, observe for anaphylaxis — have adrenaline ready). Repeat WBCT at 6 hours; if still incoagulable, repeat antivenom. Pre-medication with adrenaline 0.25 mg SC reduces reaction rates.','severe'),

  -- Burns
  ((SELECT id FROM protocols WHERE condition_id='burns'),1,'Initial Assessment and Fluid Resuscitation',
   'ABCDE. Secure airway early if inhalation injury (intubate before oedema progresses). Parkland formula: 4 mL x weight (kg) x %BSA burned (Ringer''s Lactate). Give half in first 8 hours, half over next 16 hours. All burns >15% BSA (adults) or >10% BSA (children): hospitalise for IV fluids. Analgesia: IV morphine 0.1 mg/kg. Tetanus prophylaxis.','severe'),
  ((SELECT id FROM protocols WHERE condition_id='burns'),2,'Wound Care and Referral',
   'Superficial burns: cool with running water 20 min within 3 hours. Cover with non-adherent dressing (paraffin gauze) + secondary absorbent layer. Partial-thickness: clean with chlorhexidine, silver sulfadiazine 1% cream BD, or antimicrobial dressings. Refer to burns unit: >10% BSA in adults; >5% in children; face, hands, genitalia, joints; full-thickness; circumferential; inhalation injury; electrical or chemical burns.','severe'),

  -- Diverticulitis
  ((SELECT id FROM protocols WHERE condition_id='diverticulitis'),1,'Uncomplicated Diverticulitis (Mild)',
   'Outpatient management if: mild symptoms, tolerating oral fluids, no signs of complications. Clear liquid diet for 2–3 days then low-residue diet as tolerated. Antibiotics: co-amoxiclav 625 mg TDS for 7 days OR ciprofloxacin 500 mg BD + metronidazole 400 mg TDS for 7 days. Adequate analgesia (paracetamol; avoid NSAIDs — increase perforation risk). Review at 48 hours.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='diverticulitis'),2,'Complicated / Severe Diverticulitis',
   'Admit if: unable to tolerate orals, high fever, peritonism, abscess, or immunocompromised. IV fluids, NBM, IV antibiotics (IV cefuroxime + metronidazole). CT abdomen confirms diagnosis and complications. Abscess: CT-guided drainage or IV antibiotics alone if <3 cm. Perforation with peritonitis: emergency surgery (Hartmann''s procedure). Colonoscopy 6–8 weeks after resolution to exclude malignancy.','severe'),

  -- Neonatal Jaundice
  ((SELECT id FROM protocols WHERE condition_id='neonatal_jaundice'),1,'Assessment',
   'Check bilirubin level against hour-specific threshold charts (Bhutani nomogram). Assess: age at onset (first 24 hours = always pathological), rate of rise, degree of jaundice (Kramer zones), feeding, hydration, stool colour, maternal blood group and Coombs test, G6PD status. Direct (conjugated) bilirubin >20% of total = cholestatic — refer.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='neonatal_jaundice'),2,'Phototherapy',
   'Start phototherapy if bilirubin at or above treatment threshold (hour-specific chart). Use intensive phototherapy (narrow-band blue light, close proximity). Ensure adequate hydration; supplement breastfeeding if needed. Check bilirubin every 4–6 hours initially. Discontinue when bilirubin ≥50 µmol/L below exchange threshold and falling. Check rebound bilirubin 12–24 hours after stopping.','moderate'),
  ((SELECT id FROM protocols WHERE condition_id='neonatal_jaundice'),3,'Exchange Transfusion',
   'Exchange transfusion if: bilirubin at or above exchange threshold despite intensive phototherapy, or signs of acute bilirubin encephalopathy (hypertonia, opisthotonos, retrocollis, high-pitched cry). Double volume exchange transfusion (160 mL/kg) with O-negative or type-specific irradiated blood. Monitor: glucose, calcium, electrolytes, FBC.','severe'),

  -- Oral Candidiasis
  ((SELECT id FROM protocols WHERE condition_id='gerd_silent'),1,'Treatment',
   'Oral miconazole gel 2% (licensed for oral use): apply 2.5 mL QID to affected areas; continue for 2 days after resolution. Alternative: nystatin suspension 100,000 units/mL — 1 mL QID, swish and swallow for 14 days. Systemic: fluconazole 50 mg OD for 7 days (if severe, oesophageal involvement, or immunocompromised). Denture hygiene: soak in dilute bleach/chlorhexidine overnight.','mild'),
  ((SELECT id FROM protocols WHERE condition_id='gerd_silent'),2,'Predisposing Factor Management',
   'Rinse mouth after steroid inhaler (prevents steroid-related oropharyngeal candidiasis). Use spacer device with inhaler. Optimise diabetes control. If immunocompromised (HIV, chemotherapy): fluconazole 100–200 mg OD for 2 weeks; consider prophylaxis with fluconazole 50–100 mg OD.','mild');

-- ── Rx Entries ────────────────────────────────────────────────────────────────
INSERT INTO rx_entries (condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, priority, notes, source) VALUES
  -- Ectopic Pregnancy
  ('ectopic_pregnancy','Methotrexate','Antifolate / Antimetabolite','Unruptured ectopic pregnancy (medical management)','50 mg/m² body surface area','Single dose (repeat day 7 if beta-hCG decline <15%)','IM injection','Single or double dose protocol',1,
   'Monitor beta-hCG days 4 and 7. Avoid NSAIDs, folic acid, alcohol, and sun exposure. No pregnancy for 3 months after.','Gujarat STG 2013'),
  ('ectopic_pregnancy','IV fluid resuscitation','Crystalloid','Haemorrhagic shock in ruptured ectopic','1000 mL bolus initially','As fast as possible','IV','Until haemodynamic stability (surgery is definitive)',1,
   'Surgical emergency — fluid resuscitation concurrent with theatre preparation.','Gujarat STG 2013'),

  -- PPH
  ('pph','Oxytocin','Uterotonic','Primary PPH — uterine atony','10 IU slow IV bolus; then 20–40 IU in 500 mL NS infusion','IV infusion','IV','Until uterus contracts',1,
   'Gold standard first-line uterotonic. Avoid rapid IV bolus (hypotension). IM acceptable if IV unavailable.','Gujarat STG 2013'),
  ('pph','Ergometrine','Ergot alkaloid uterotonic','PPH when oxytocin insufficient','0.5 mg','IM or slow IV','IM or IV','Single dose (can repeat once)','2',
   'Avoid in hypertension, pre-eclampsia, cardiac disease (causes vasoconstriction).','Gujarat STG 2013'),
  ('pph','Misoprostol','Prostaglandin E1','PPH when oxytocin/ergometrine unavailable or failed','800 µg','Single dose','Sublingual or rectal','Single dose',2,
   'Thermal stable; useful in low-resource settings. Causes shivering and pyrexia.','Gujarat STG 2013'),
  ('pph','Tranexamic acid','Antifibrinolytic','PPH (reduces mortality if given within 3 hours)','1 g','IV over 10 minutes; repeat at 30 min if ongoing bleeding','IV','Two doses maximum',1,
   'Reduces PPH mortality significantly. WHO recommends for all PPH regardless of cause.','Gujarat STG 2013'),
  ('pph','Carboprost (15-methyl PGF2α)','Prostaglandin F2α','Refractory PPH not responding to oxytocin','0.25 mg','IM every 15 minutes (max 8 doses = 2 mg)','IM','As needed (max 8 doses)',2,
   'Contraindicated in asthma. Causes bronchospasm, diarrhoea, hypertension.','Gujarat STG 2013'),

  -- Bacterial Vaginosis
  ('bacterial_vaginosis','Metronidazole','Antiprotozoal/Antibacterial','Bacterial vaginosis','400–500 mg','Twice daily','Oral','7 days',1,
   'Avoid alcohol during treatment and 48 hours after. Effective in 70–80% of cases.','Gujarat STG 2013'),
  ('bacterial_vaginosis','Metronidazole vaginal gel 0.75%','Topical antibiotic','BV (local treatment)','One applicatorful (5 g)','Once daily at night','Intravaginal','5 nights',2,
   'Similar efficacy to oral; fewer systemic side effects. Cannot be used during menstruation.','Gujarat STG 2013'),
  ('bacterial_vaginosis','Clindamycin vaginal cream 2%','Topical antibiotic','BV (penicillin-related allergy to metronidazole — note: different class)','One applicatorful (5 g)','Once daily at night','Intravaginal','7 nights',2,
   'Can weaken latex condoms and diaphragms during use.','Gujarat STG 2013'),

  -- Vaginal Candidiasis
  ('vaginal_candidiasis','Fluconazole','Triazole antifungal','Uncomplicated vaginal candidiasis','150 mg','Single dose','Oral','Single dose',1,
   'Convenient single oral dose. Avoid in pregnancy (first trimester). Most effective for C. albicans.','Gujarat STG 2013'),
  ('vaginal_candidiasis','Clotrimazole','Imidazole antifungal','Vaginal candidiasis (topical)','500 mg pessary','Single dose','Intravaginal','Single dose',1,
   'Equally effective to oral fluconazole; preferred in pregnancy. Can weaken condoms.','Gujarat STG 2013'),
  ('vaginal_candidiasis','Clotrimazole cream 1%','Topical antifungal','Vulval candidiasis (external)','Apply to vulva','Twice to three times daily','Topical','7 days',1,
   'Use in addition to vaginal treatment for vulval symptoms.','Gujarat STG 2013'),
  ('vaginal_candidiasis','Fluconazole (suppressive)','Antifungal','Recurrent vulvovaginal candidiasis maintenance','150 mg','Weekly','Oral','6 months',2,
   'For recurrent disease (≥4 episodes/year). Effective in 90% during treatment; recurrence common after stopping.','Murtagh GP 3rd Ed'),

  -- Syphilis
  ('syphilis','Benzathine benzylpenicillin','Long-acting penicillin','Primary, secondary, early latent syphilis','2.4 million units','Single dose IM','IM injection','Single dose (or 3 weekly doses for late latent)',1,
   'Drug of choice. Two injection sites if giving full dose (1.2 million units each buttock). Not the same as procaine penicillin.','Gujarat STG 2013'),
  ('syphilis','Doxycycline','Tetracycline','Syphilis (penicillin allergy — non-pregnant)','100 mg','Twice daily','Oral','14 days (primary/secondary) or 28 days (latent)',2,
   'Not for use in pregnancy. Less evidence than penicillin but acceptable alternative.','Gujarat STG 2013'),
  ('syphilis','Benzylpenicillin','Aqueous crystalline penicillin','Neurosyphilis','3–4 million units','Every 4 hours IV (18–24 million IU/day)','IV','10–14 days',1,
   'Hospital admission required. Ensure CSF normalisation with follow-up lumbar puncture at 3–6 months.','Gujarat STG 2013'),

  -- Otitis Externa
  ('otitis_externa','Acetic acid 2% ear drops','Acidifying antibacterial','Mild-moderate otitis externa','3–4 drops','Three to four times daily','Topical (ear)','7 days',1,
   'Safe if tympanic membrane integrity uncertain. Restores normal acidic pH of ear canal.','Gujarat STG 2013'),
  ('otitis_externa','Ciprofloxacin + Hydrocortisone drops','Antibiotic + steroid','Moderate-severe otitis externa','3 drops','Twice daily','Topical (ear)','7 days',1,
   'Ciprofloxacin active against Pseudomonas (commonest pathogen). Safe if perforation.','Gujarat STG 2013'),
  ('otitis_externa','Ciprofloxacin','Fluoroquinolone (systemic)','Malignant otitis externa or severe spreading OE','750 mg','Twice daily','Oral','6–8 weeks',1,
   'Long course for malignant OE — monitor for tenderness resolution.','Gujarat STG 2013'),

  -- Glaucoma
  ('glaucoma','Latanoprost 0.005%','Prostaglandin analogue','Chronic open-angle glaucoma (first-line IOP reduction)','1 drop','Once daily at night','Topical (eye)','Long-term',1,
   'Reduces IOP by 25–35%. Side effect: iris pigmentation, eyelash lengthening. Do not use in uveitis.','Murtagh GP 3rd Ed'),
  ('glaucoma','Timolol 0.5%','Beta-blocker eye drop','POAG adjunct or monotherapy (if prostaglandin contraindicated)','1 drop','Twice daily','Topical (eye)','Long-term',2,
   'Systemic absorption: avoid in asthma, COPD, bradycardia, heart block. Reduces aqueous production.','Murtagh GP 3rd Ed'),
  ('glaucoma','Pilocarpine 2%','Miotic (cholinergic)','Acute angle-closure glaucoma (emergency)','1 drop','Every 15 minutes x 1 hour (acute)','Topical (eye)','Acute phase only',1,
   'Constricts pupil; opens drainage angle in acute angle closure. Not for POAG.','Murtagh GP 3rd Ed'),
  ('glaucoma','Acetazolamide','Carbonic anhydrase inhibitor','Acute angle-closure glaucoma','500 mg stat','Once (IV) or BD (oral for interim)','IV or Oral','Acute phase; until definitive laser treatment',1,
   'Reduces aqueous production rapidly. Sulfonamide — avoid in allergy, renal stones. Causes paraesthesia, polyuria.','Murtagh GP 3rd Ed'),

  -- Trigeminal Neuralgia
  ('trigeminal_neuralgia','Carbamazepine','Anticonvulsant (sodium channel blocker)','Trigeminal neuralgia (first-line)','100 mg BD (start), titrate to 400–800 mg/day','Divided doses (BD-TDS)','Oral','Long-term; taper off when pain free for 6 months',1,
   '70–80% initial response. Monitor FBC, LFTs, sodium. Check HLA-B*1502 in Asian patients (SJS risk).','Murtagh GP 3rd Ed'),
  ('trigeminal_neuralgia','Oxcarbazepine','Anticonvulsant','Trigeminal neuralgia (better tolerated than carbamazepine)','300 mg BD (start), titrate to 600–1800 mg/day','Twice daily','Oral','Long-term',2,
   'Fewer drug interactions and better tolerated than carbamazepine. Monitor sodium (hyponatraemia).','Murtagh GP 3rd Ed'),
  ('trigeminal_neuralgia','Pregabalin','Calcium channel α2δ ligand','Trigeminal neuralgia or carbamazepine intolerance','75 mg BD, titrate to 150–300 mg BD','Twice daily','Oral','Long-term',2,
   'Also effective for generalised neuropathic pain. Sedation common initially.','Murtagh GP 3rd Ed'),

  -- Peripheral Neuropathy
  ('peripheral_neuropathy','Amitriptyline','Tricyclic antidepressant','Painful peripheral neuropathy','10–25 mg (start), titrate to 75 mg','Once daily at night','Oral','3–6 months then review',1,
   'NNT ~3 for diabetic neuropathy. Avoid in elderly (falls, anticholinergic). Cheap and effective.','Gujarat STG 2013'),
  ('peripheral_neuropathy','Pregabalin','Calcium channel α2δ ligand','Painful diabetic peripheral neuropathy','75 mg BD (start), titrate to 300 mg BD','Twice daily','Oral','3 months then review',1,
   'First-line (NICE). Dose-related side effects: dizziness, sedation. Reduce dose in renal impairment.','Gujarat STG 2013'),
  ('peripheral_neuropathy','Duloxetine','SNRI','Painful diabetic neuropathy','30 mg OD (start), increase to 60 mg OD','Once daily','Oral','3 months then review',1,
   'Effective for diabetic neuropathy and fibromyalgia. Avoid in renal impairment (CrCl <30).','Murtagh GP 3rd Ed'),
  ('peripheral_neuropathy','Hydroxocobalamin','Vitamin B12','B12 deficiency neuropathy','1 mg','IM 3x/week for 2 weeks, then monthly','IM injection','Monthly maintenance lifelong (if pernicious anaemia)',1,
   'Essential if B12 deficiency confirmed. Reverses neuropathy if treated early.','Gujarat STG 2013'),

  -- Organophosphate Poisoning
  ('op_poisoning','Atropine','Anticholinergic','Organophosphate poisoning (titrate to dry secretions)','2 mg IV stat, repeated every 5–10 min until secretions dry','Repeated boluses then infusion','IV','Until bronchorrhoea resolved',1,
   'No maximum dose — titrate to endpoint of dry lungs. Very large doses (20–100+ mg) may be needed. Mydriasis is NOT the endpoint.','Gujarat STG 2013'),
  ('op_poisoning','Pralidoxime (2-PAM)','Cholinesterase reactivator','OP poisoning within 24–48 hours','1–2 g over 15–30 minutes, then 200–500 mg/hour','IV infusion','IV','24–48 hours or until clinical improvement',1,
   'Must be given early before ageing of enzyme-OP complex. Give even if time uncertain.','Gujarat STG 2013'),
  ('op_poisoning','Diazepam','Benzodiazepine','Seizures in OP poisoning','5–10 mg IV','As needed','IV','Acute',2,
   'Treat seizures with benzodiazepines; phenytoin is ineffective for OP-induced seizures.','Gujarat STG 2013'),

  -- Snake Bite
  ('snake_bite','Polyvalent antivenom','Antivenom (IgG Fab fragments)','Systemic envenomation from venomous snake','10 vials in 200 mL NS over 1 hour','Single infusion (repeat if WBCT still incoagulable at 6 hours)','IV (slow infusion)','As per clinical response',1,
   'Pre-medicate with adrenaline 0.25 mg SC. Have adrenaline ready for anaphylaxis. NOT indicated for dry bites.','Gujarat STG 2013'),
  ('snake_bite','Adrenaline (Epinephrine)','Vasopressor / anaphylaxis treatment','Anaphylaxis to antivenom','0.5 mg','IM immediately on reaction','IM','As needed',1,
   'Give as prophylactic pre-medication SC. Keep at bedside throughout antivenom infusion.','Gujarat STG 2013'),
  ('snake_bite','Neostigmine + Atropine','Anticholinesterase + anticholinergic','Neurotoxic envenomation (cobra) — trial','Neostigmine 0.02 mg/kg + Atropine 0.6 mg','SC every 30 min','SC','Trial: 3 doses — if improvement continue; if not, stop',2,
   'Neostigmine challenge test for neurotoxic bites when antivenom unavailable. Atropine first to block muscarinic effects.','Gujarat STG 2013'),

  -- Burns
  ('burns','Ringer''s Lactate','Crystalloid IV fluid','Burns fluid resuscitation (Parkland formula)','4 mL x weight(kg) x %BSA burned (first 24 hours)','Half in first 8 hours; half over next 16 hours','IV infusion','First 24 hours post-burn',1,
   'Preferred over normal saline for burns resuscitation. Monitor urine output (target 0.5–1 mL/kg/hour).','Gujarat STG 2013'),
  ('burns','Morphine','Opioid analgesic','Burns pain management','0.1 mg/kg','IV/IM titrated to pain','IV or IM','Acute phase',1,
   'Burns are among the most painful conditions — do not under-treat. IV preferred for reliable absorption.','Gujarat STG 2013'),
  ('burns','Silver sulfadiazine 1% cream','Topical antimicrobial','Partial-thickness burns wound care','Apply to wound under dressing','Once to twice daily','Topical','Until wound healed or grafted',1,
   'Broad-spectrum against Pseudomonas and Staph. Avoid in pregnancy, sulfonamide allergy, G6PD deficiency.','Gujarat STG 2013'),
  ('burns','Tetanus toxoid','Vaccine','Burns wound — tetanus prophylaxis','0.5 mL IM (+ TIG 250 IU if unvaccinated)','Single dose','IM','Once',1,
   'All burns patients require tetanus prophylaxis. Give TIG (tetanus immunoglobulin) if no prior immunisation.','Gujarat STG 2013'),

  -- Diverticulitis
  ('diverticulitis','Co-amoxiclav (Amoxicillin-Clavulanate)','Beta-lactam/beta-lactamase inhibitor','Uncomplicated acute diverticulitis','625 mg (500/125)','Three times daily','Oral','7–10 days',1,
   'Covers Gram-negative enteric bacteria and anaerobes. Take with food.','Gujarat STG 2013'),
  ('diverticulitis','Ciprofloxacin + Metronidazole','Antibiotic combination','Acute diverticulitis (alternative)','Ciprofloxacin 500 mg BD + Metronidazole 400 mg TDS','As per individual drugs','Oral','7–10 days',2,
   'Use if co-amoxiclav not available or penicillin allergy.','Gujarat STG 2013'),
  ('diverticulitis','Paracetamol','Analgesic','Diverticulitis pain management','1 g','Four times daily','Oral','As needed',1,
   'Avoid NSAIDs — increase risk of perforation in diverticulitis.','Murtagh GP 3rd Ed'),

  -- Neonatal Jaundice
  ('neonatal_jaundice','Phototherapy (Bili lights)','Physical treatment','Neonatal hyperbilirubinaemia above treatment threshold','Intensive phototherapy','Continuous (with breaks for feeds)','Transcutaneous (blue LED lights)','Until bilirubin below treatment threshold',1,
   'Ensure eyes protected. Adequate hydration essential. Monitor bilirubin every 4–6 hours. Check rebound bilirubin 12–24 hours after stopping.','Gujarat STG 2013'),
  ('neonatal_jaundice','Intravenous Immunoglobulin (IVIg)','Immunoglobulin','Haemolytic jaundice (Rh or ABO incompatibility)','500 mg/kg','IV over 2–4 hours; can repeat in 12 hours','IV','1–2 doses',2,
   'Reduces rate of haemolysis and need for exchange transfusion in isoimmune haemolytic disease.','Gujarat STG 2013'),

  -- Oral Candidiasis
  ('gerd_silent','Miconazole oral gel 2%','Imidazole antifungal','Oral candidiasis (first-line)','2.5 mL applied to affected area','Four times daily (after meals and bedtime)','Topical (oral gel)','Continue for 2 days after resolution',1,
   'Apply with clean finger or syringe. Hold in mouth before swallowing. Not for neonates <4 months (choking risk).','Gujarat STG 2013'),
  ('gerd_silent','Nystatin suspension','Polyene antifungal','Oral candidiasis (if miconazole unavailable)','1 mL (100,000 IU)','Four times daily — swish and swallow','Oral suspension','14 days',2,
   'Less systemic absorption; very safe. Swish around mouth before swallowing.','Gujarat STG 2013'),
  ('gerd_silent','Fluconazole','Triazole antifungal','Severe or oesophageal candidiasis','50–100 mg (oral), 200 mg (oesophageal)','Once daily','Oral','7–14 days',1,
   'Systemic therapy for immunocompromised patients or oesophageal involvement.','Gujarat STG 2013');
