BEGIN TRANSACTION;

INSERT OR IGNORE INTO exam_steps (condition_id, category, text, order_index) VALUES
  ('dengue','inspection','Assess general condition: alert, restless, lethargic, toxic-looking, hydration status',1),
  ('dengue','inspection','Look for rash, petechiae, ecchymosis, gum bleeding, epistaxis, conjunctival suffusion',2),
  ('dengue','palpation','Check pulse volume, capillary refill time, extremity temperature, postural hypotension',3),
  ('dengue','palpation','Palpate abdomen for tenderness, liver enlargement >2 cm, ascites',4),
  ('dengue','percussion','Percuss abdomen for shifting dullness if ascites suspected',5),
  ('dengue','auscultation','Auscultate chest bases for pleural effusion; monitor tachycardia and signs of shock',6),

  ('pneumonia','inspection','Observe respiratory distress: tachypnoea, accessory muscle use, cyanosis, inability to speak full sentences',1),
  ('pneumonia','inspection','Check SpO2 on room air before oxygen if patient is stable',2),
  ('pneumonia','palpation','Assess tracheal position and chest expansion; reduced expansion suggests consolidation/effusion',3),
  ('pneumonia','percussion','Percuss for dullness over affected lobe; stony dullness suggests pleural effusion',4),
  ('pneumonia','auscultation','Listen for bronchial breath sounds, coarse crepitations, pleural rub, reduced air entry',5),

  ('acs','inspection','Assess distress, sweating, pallor, breathlessness, cyanosis, signs of heart failure',1),
  ('acs','palpation','Check pulse rate/rhythm, BP in both arms if dissection suspected, peripheral perfusion',2),
  ('acs','auscultation','Listen for S3, new murmur, basal crepitations; assess for pulmonary oedema',3),

  ('stroke','inspection','Use FAST: facial droop, arm weakness, speech disturbance, time of onset',1),
  ('stroke','inspection','Check consciousness level, gaze deviation, seizure activity, airway risk',2),
  ('stroke','palpation','Check pulse rhythm for atrial fibrillation; record BP and capillary glucose urgently',3),
  ('stroke','auscultation','Listen for carotid bruit if stable; do not delay urgent neuroimaging',4),

  ('cholera','inspection','Classify dehydration: alert/restless/lethargic, sunken eyes, thirst, ability to drink',1),
  ('cholera','palpation','Skin pinch test: returns quickly, slowly, or very slowly',2),
  ('cholera','palpation','Assess pulse volume, capillary refill, extremity temperature, urine output',3),
  ('cholera','auscultation','Auscultation is not diagnostic; focus on dehydration, shock, and stool output monitoring',4),

  ('dka','inspection','Look for dehydration, Kussmaul breathing, fruity breath, altered mental status',1),
  ('dka','palpation','Assess pulse, capillary refill, skin turgor, abdominal tenderness, hydration',2),
  ('dka','auscultation','Assess respiratory pattern and signs of precipitating infection',3);

INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
  ('STEMI — Inferior wall','Acute inferior myocardial infarction pattern. Treat as time-critical ACS.','["ST elevation in II, III, aVF","Reciprocal ST depression in I and aVL","Check right-sided ECG if RV infarct suspected","Avoid nitrates if hypotension/RV infarct"]','acs'),
  ('STEMI — Anterior wall','Acute LAD territory infarction pattern. High-risk ACS requiring urgent reperfusion.','["ST elevation in V1–V4","May extend to V5–V6, I, aVL","Reciprocal inferior ST depression may appear","Risk of cardiogenic shock and ventricular arrhythmia"]','acs'),
  ('NSTEMI / Unstable angina pattern','Ischaemic ECG pattern without diagnostic ST elevation. Correlate with troponin and symptoms.','["ST depression ≥0.5 mm in contiguous leads","T-wave inversion in contiguous leads","Dynamic ECG change increases risk","Normal ECG does not exclude ACS"]','acs'),
  ('Atrial fibrillation','Irregularly irregular rhythm; important stroke risk factor.','["No consistent P waves","Irregularly irregular R-R interval","Variable ventricular rate","Assess anticoagulation need using clinical risk score"]','stroke'),
  ('SVT','Regular narrow-complex tachycardia; unstable cases require synchronized cardioversion.','["Regular narrow QRS tachycardia","Rate often 150–250/min","P waves absent or retrograde","Try vagal manoeuvre if stable; adenosine if appropriate"]',NULL),
  ('Ventricular tachycardia','Wide-complex tachycardia; treat as VT until proven otherwise.','["Broad QRS complexes >120 ms","Rate usually >120/min","AV dissociation/capture beats support VT","If unstable: synchronized DC cardioversion"]',NULL),
  ('Hyperkalaemia ECG','Life-threatening electrolyte ECG pattern. Give IV calcium if ECG changes present.','["Tall tented T waves","PR prolongation","QRS widening","Sine-wave pattern in severe cases"]','dka'),
  ('Complete heart block','AV dissociation with slow escape rhythm; may complicate inferior MI.','["P waves and QRS complexes unrelated","Regular P-P and regular R-R intervals","Ventricular rate often 20–40/min","Assess haemodynamic stability and pacing need"]','acs');

INSERT OR IGNORE INTO cxr_findings (name, description, condition_id) VALUES
  ('Lobar consolidation','Homogeneous opacity limited to a lobe with air bronchograms. Common in bacterial pneumonia.', 'pneumonia'),
  ('Bronchopneumonia pattern','Patchy multifocal air-space opacities, often bilateral and basal.', 'pneumonia'),
  ('Pleural effusion','Blunting of costophrenic angle, meniscus sign, possible mediastinal shift if massive.', 'pneumonia'),
  ('Pulmonary oedema','Bilateral perihilar bat-wing opacities, Kerley B lines, cardiomegaly, pleural effusions.', 'acs'),
  ('Pneumothorax','Visible pleural line with absent peripheral lung markings. Tension signs require immediate decompression.', NULL),
  ('Miliary TB pattern','Diffuse tiny nodular opacities throughout both lung fields. Consider TB in compatible clinical context.', NULL),
  ('Dengue pleural effusion','Small bilateral or right-sided pleural effusion can indicate plasma leakage in dengue.', 'dengue'),
  ('Aspiration pneumonia','Dependent-lobe infiltrates, commonly right lower lobe or posterior upper lobes.', 'pneumonia');

INSERT OR IGNORE INTO osce_cards (condition_id, question, answer, station_type) VALUES
  ('acs','A 55-year-old has crushing chest pain and ST elevation in II, III, aVF. What is the ECG diagnosis and immediate priority?','Inferior STEMI. Immediate priorities: ABC, monitoring, aspirin if not contraindicated, pain control, nitrates only if BP stable and no RV infarct/PDE5 use, urgent reperfusion pathway. Check right-sided leads if hypotension suggests RV infarct.','data-interpretation'),
  ('acs','What ECG leads show anterior STEMI and which artery is usually involved?','ST elevation in V1–V4 indicates anterior/septal STEMI, usually LAD territory. Lateral extension may involve V5–V6, I, aVL.','data-interpretation'),
  ('pneumonia','On chest examination there is reduced right basal expansion, stony dull percussion, and reduced breath sounds. What CXR finding do you expect?','Right pleural effusion. CXR may show blunting of the right costophrenic angle and meniscus sign. If large, consider diagnostic tap and assess for empyema.','examination'),
  ('pneumonia','What are three signs of severe pneumonia requiring hospital admission?','Examples: SpO2 <90–92%, RR ≥30/min, hypotension, confusion, inability to maintain oral intake, cyanosis, severe respiratory distress, CURB-65 score ≥2.','management'),
  ('stroke','A patient arrives with facial droop and arm weakness. What bedside tests must not be missed before thrombolysis referral?','Record exact time last known well, capillary glucose, BP, anticoagulant history, seizure/head trauma history, and urgent non-contrast CT brain to exclude haemorrhage.','management'),
  ('dka','A diabetic patient has vomiting, dehydration, Kussmaul breathing and glucose 28 mmol/L. What are your first management steps?','ABCDE, IV access, fluids first, check ketones/ABG/electrolytes, start fixed-rate insulin after potassium known, monitor potassium closely, identify precipitating cause such as infection or missed insulin.','management'),
  ('cholera','A child with profuse watery diarrhoea is lethargic, unable to drink, with very slow skin pinch. Classify and manage.','Severe dehydration. Start Plan C: IV Ringer lactate 100 ml/kg, reassess frequently, give ORS when able to drink, monitor urine output, and give age/weight-appropriate azithromycin if cholera suspected.','management');

INSERT OR IGNORE INTO content_versions (id, content_type, version, source_name, source_url, status, notes) VALUES
  ('gp-master-interpretation-seed','protocols','2026-05-02','Clinical OS starter clinical content',NULL,'active','Adds ECG, CXR, exam and OSCE starter material for GP Master workflows. Requires doctor review before clinical use.');

COMMIT;
