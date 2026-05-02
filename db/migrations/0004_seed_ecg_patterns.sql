-- ECG patterns with descriptions and key features
BEGIN TRANSACTION;

-- Normal Sinus Rhythm
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Normal Sinus Rhythm', 'Normal cardiac rhythm originating from sinoatrial node', '[
  {"feature": "Heart Rate", "value": "60-100 bpm"},
  {"feature": "Rhythm", "value": "Regular"},
  {"feature": "P waves", "value": "Upright in leads I, II, III, aVL, aVF, V4-V6"},
  {"feature": "PR interval", "value": "120-200 ms"},
  {"feature": "QRS duration", "value": "80-120 ms"},
  {"feature": "QT interval", "value": "Corrected QT < 440 ms"}
]', null);

-- Sinus Tachycardia
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Sinus Tachycardia', 'Sinus rhythm with heart rate > 100 bpm', '[
  {"feature": "Heart Rate", "value": "100-180 bpm"},
  {"feature": "Rhythm", "value": "Regular"},
  {"feature": "P waves", "value": "Upright, consistent morphology"},
  {"feature": "PR interval", "value": "120-200 ms"},
  {"feature": "QRS duration", "value": "80-120 ms"},
  {"feature": "Causes", "value": "Fever, anxiety, exercise, hyperthyroidism, blood loss"}
]', null);

-- Sinus Bradycardia
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Sinus Bradycardia', 'Sinus rhythm with heart rate < 60 bpm', '[
  {"feature": "Heart Rate", "value": "40-60 bpm"},
  {"feature": "Rhythm", "value": "Regular"},
  {"feature": "P waves", "value": "Upright, consistent morphology"},
  {"feature": "PR interval", "value": "120-200 ms"},
  {"feature": "QRS duration", "value": "80-120 ms"},
  {"feature": "Causes", "value": "Athletes, sleep, beta blockers, hypothyroidism, sick sinus"}
]', null);

-- Atrial Fibrillation
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Atrial Fibrillation', 'Irregularly irregular rhythm with absent P waves', '[
  {"feature": "Heart Rate", "value": "Variable, often 100-180 bpm if untreated"},
  {"feature": "Rhythm", "value": "Irregularly irregular"},
  {"feature": "P waves", "value": "Absent, replaced by chaotic baseline"},
  {"feature": "Fibrillatory waves", "value": "Fine (f) or coarse (F) waves"},
  {"feature": "RR intervals", "value": "Irregular, no pattern"},
  {"feature": "QRS duration", "value": "Usually normal unless aberrancy"}
]', null);

-- Atrial Flutter
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Atrial Flutter', 'Regular atrial tachycardia with sawtooth pattern', '[
  {"feature": "Atrial Rate", "value": "250-350 bpm"},
  {"feature": "Ventricular Rate", "value": "Variable depending on AV block"},
  {"feature": "Flutter waves", "value": "Sawtooth pattern in leads II, III, aVF"},
  {"feature": "Rhythm", "value": "Regular atrial, irregular ventricular if variable block"},
  {"feature": "AV block", "value": "Typically 2:1, 3:1, 4:1"},
  {"feature": "QRS duration", "value": "Usually normal"}
]', null);

-- Supraventricular Tachycardia (SVT)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Supraventricular Tachycardia', 'Narrow complex tachycardia originating above ventricles', '[
  {"feature": "Heart Rate", "value": "150-250 bpm"},
  {"feature": "Rhythm", "value": "Regular"},
  {"feature": "P waves", "value": "Often hidden or retrograde in QRS"},
  {"feature": "QRS duration", "value": "Narrow (< 120 ms)"},
  {"feature": "PR interval", "value": "Short or absent"},
  {"feature": "Types", "value": "AVNRT, AVRT, atrial tachycardia"}
]', null);

-- First Degree AV Block
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('First Degree AV Block', 'Prolonged PR interval with 1:1 AV conduction', '[
  {"feature": "PR interval", "value": "> 200 ms"},
  {"feature": "P:QRS ratio", "value": "1:1"},
  {"feature": "Rhythm", "value": "Regular (if underlying sinus)"},
  {"feature": "P waves", "value": "Normal morphology"},
  {"feature": "QRS duration", "value": "Normal"},
  {"feature": "Clinical significance", "value": "Usually benign, monitor"}
]', null);

-- Second Degree AV Block - Mobitz I (Wenckebach)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Second Degree AV Block - Mobitz I', 'Progressive PR prolongation until dropped beat', '[
  {"feature": "PR interval", "value": "Progressively lengthening"},
  {"feature": "Dropped beats", "value": "Periodic non-conducted P waves"},
  {"feature": "P:QRS ratio", "value": "Variable (e.g., 3:2, 4:3, 5:4)"},
  {"feature": "Rhythm", "value": "Irregular due to dropped beats"},
  {"feature": "QRS duration", "value": "Normal"},
  {"feature": "Location", "value": "AV node level"}
]', null);

-- Second Degree AV Block - Mobitz II
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Second Degree AV Block - Mobitz II', 'Sudden dropped beats without PR prolongation', '[
  {"feature": "PR interval", "value": "Constant for conducted beats"},
  {"feature": "Dropped beats", "value": "Sudden non-conducted P waves"},
  {"feature": "P:QRS ratio", "value": "Constant (e.g., 2:1, 3:1)"},
  {"feature": "Rhythm", "value": "Regular when conducted, irregular with dropped beats"},
  {"feature": "QRS duration", "value": "Often wide"},
  {"feature": "Location", "value": "His-Purkinje system"}
]', null);

-- Third Degree AV Block (Complete Heart Block)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Third Degree AV Block', 'Complete AV dissociation, atria and ventricles beat independently', '[
  {"feature": "P:QRS relationship", "value": "No relationship, AV dissociation"},
  {"feature": "Atrial rate", "value": "60-100 bpm (sinus)"},
  {"feature": "Ventricular rate", "value": "20-40 bpm (junctional/ventricular)"},
  {"feature": "PR interval", "value": "Variable, no consistent relationship"},
  {"feature": "QRS duration", "value": "Wide if ventricular escape"},
  {"feature": "P waves", "value": "Regular, marching through QRS"}
]', null);

-- Bundle Branch Block - Left
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Left Bundle Branch Block', 'Delayed left ventricular activation', '[
  {"feature": "QRS duration", "value": "> 120 ms"},
  {"feature": "Lead I", "value": "Broad, notched R wave"},
  {"feature": "Lead V1", "value": "Predominantly negative (QS or rS)"},
  {"feature": "Lead V6", "value": "Broad, notched R wave"},
  {"feature": "ST-T changes", "value": "Opposite direction to QRS"},
  {"feature": "Clinical significance", "value": "Often indicates underlying heart disease"}
]', null);

-- Bundle Branch Block - Right
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Right Bundle Branch Block', 'Delayed right ventricular activation', '[
  {"feature": "QRS duration", "value": "> 120 ms"},
  {"feature": "Lead V1", "value": "rsR'' pattern (bunny ears)"},
  {"feature": "Lead V6", "value": "Broad, slurred S wave"},
  {"feature": "Lead I", "value": "Normal R wave, wide S wave"},
  {"feature": "ST-T changes", "value": "Opposite direction to terminal QRS"},
  {"feature": "Clinical significance", "value": "May be benign or indicate pulmonary disease"}
]', null);

-- Premature Ventricular Contractions (PVCs)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Premature Ventricular Contractions', 'Early ventricular beats with wide QRS', '[
  {"feature": "Timing", "value": "Premature compared to sinus rhythm"},
  {"feature": "QRS duration", "value": "Wide (> 120 ms)"},
  {"feature": "P waves", "value": "Absent before PVC"},
  {"feature": "Compensatory pause", "value": "Usually present"},
  {"feature": "Morphology", "value": "Bizarre, different from normal QRS"},
  {"feature": "ST-T changes", "value": "Opposite direction to QRS"}
]', null);

-- Ventricular Tachycardia
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Ventricular Tachycardia', 'Wide complex tachycardia originating from ventricles', '[
  {"feature": "Heart Rate", "value": "120-250 bpm"},
  {"feature": "QRS duration", "value": "Wide (> 120 ms)"},
  {"feature": "Rhythm", "value": "Regular or slightly irregular"},
  {"feature": "AV dissociation", "value": "May be present"},
  {"feature": "Capture beats", "value": "May be present"},
  {"feature": "Fusion beats", "value": "May be present"}
]', null);

-- Ventricular Fibrillation
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Ventricular Fibrillation', 'Chaotic, disorganized ventricular activity', '[
  {"feature": "Rhythm", "value": "Completely chaotic"},
  {"feature": "QRS complexes", "value": "Absent, replaced by chaotic waves"},
  {"feature": "Rate", "value": "300-600 bpm equivalent"},
  {"feature": "Amplitude", "value": "Variable, coarse or fine"},
  {"feature": "Clinical state", "value": "Cardiac arrest, no pulse"},
  {"feature": "Treatment", "value": "Immediate CPR and defibrillation"}
]', null);

-- Asystole
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Asystole', 'Flatline, no cardiac electrical activity', '[
  {"feature": "Electrical activity", "value": "Absent or flat line"},
  {"feature": "P waves", "value": "Absent"},
  {"feature": "QRS complexes", "value": "Absent"},
  {"feature": "Clinical state", "value": "Cardiac arrest, no pulse"},
  {"feature": "Treatment", "value": "CPR, epinephrine, avoid defibrillation"},
  {"feature": "Prognosis", "value": "Poor unless reversible cause"}
]', null);

-- ST Segment Elevation Myocardial Infarction (STEMI)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('ST Segment Elevation MI', 'Acute myocardial infarction with ST elevation', '[
  {"feature": "ST elevation", "value": "> 1 mm in 2 contiguous leads"},
  {"feature": "Location patterns", "value": "Inferior (II, III, aVF), Anterior (V1-V4), Lateral (I, aVL, V5-V6)"},
  {"feature": "Reciprocal changes", "value": "ST depression in opposite leads"},
  {"feature": "Pathological Q waves", "value": "May appear later"},
  {"feature": "T waves", "value": "Hyperacute early, then inverted"},
  {"feature": "Time sensitivity", "value": "Door-to-balloon < 90 min"}
]', 'acs');

-- Non-ST Segment Elevation MI (NSTEMI)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Non-ST Segment Elevation MI', 'Myocardial infarction without ST elevation', '[
  {"feature": "ST depression", "value": "Horizontal or downsloping > 1 mm"},
  {"feature": "T wave inversion", "value": "Deep, symmetric > 2 mm"},
  {"feature": "ST elevation", "value": "Absent or minimal"},
  {"feature": "Q waves", "value": "Absent in acute phase"},
  {"feature": "Cardiac markers", "value": "Elevated troponin required for diagnosis"},
  {"feature": "Management", "value": "Medical management, early invasive strategy"}
]', 'acs');

-- Pericarditis
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Pericarditis', 'Inflammation of pericardium causing diffuse changes', '[
  {"feature": "ST elevation", "value": "Diffuse, concave, most leads except aVR"},
  {"feature": "PR depression", "value": "Present in most leads"},
  {"feature": "Lead aVR", "value": "PR elevation, ST depression (reciprocal)"},
  {"feature": "T waves", "value": "Initially upright, become inverted later"},
  {"feature": "Distribution", "value": "Widespread, not coronary territory specific"},
  {"feature": "Clinical correlation", "value": "Chest pain, friction rub"}
]', null);

-- Pulmonary Embolism
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Pulmonary Embolism', 'Right heart strain due to pulmonary embolism', '[
  {"feature": "Sinus tachycardia", "value": "Most common finding"},
  {"feature": "S1Q3T3 pattern", "value": "S wave in lead I, Q wave in III, inverted T in III"},
  {"feature": "Right axis deviation", "value": "May be present"},
  {"feature": "Right bundle branch block", "value": "May be present"},
  {"feature": "T wave inversion", "value": "V1-V4"},
  {"feature": "Right atrial enlargement", "value": "Tall P waves in II, III, aVF"}
]', null);

-- Hyperkalemia
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Hyperkalemia', 'Elevated potassium causing progressive ECG changes', '[
  {"feature": "Mild (5.5-6.5)", "value": "Peaked T waves, tall, narrow"},
  {"feature": "Moderate (6.5-7.5)", "value": "PR prolongation, flattened P waves"},
  {"feature": "Severe (7.5-8.5)", "value": "Widened QRS, loss of P waves"},
  {"feature": "Very severe (> 8.5)", "value": "Sine wave pattern, asystole risk"},
  {"feature": "Progression", "value": "Sequential changes with rising K+"},
  {"feature": "Treatment urgency", "value": "Medical emergency"}
]', null);

-- Hypokalemia
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Hypokalemia', 'Low potassium causing characteristic changes', '[
  {"feature": "T waves", "value": "Flattened or inverted"},
  {"feature": "U waves", "value": "Prominent, following T waves"},
  {"feature": "ST depression", "value": "May be present"},
  {"feature": "QT prolongation", "value": "Due to long QU interval"},
  {"feature": "Arrhythmia risk", "value": "Increased ventricular ectopy"},
  {"feature": "Severity correlation", "value": "Changes worsen with lower K+"}
]', null);

-- Digoxin Effect
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Digoxin Effect', 'Therapeutic digoxin causing characteristic changes', '[
  {"feature": "ST depression", "value": "Scooped, reverse tick appearance"},
  {"feature": "T waves", "value": "Low amplitude, flat or inverted"},
  {"feature": "QT interval", "value": "Shortened"},
  {"feature": "U waves", "value": "May be prominent"},
  {"feature": "Rhythm", "value": "May cause ectopy if toxic"},
  {"feature": "Clinical context", "value": "Therapeutic digoxin levels"}
]', null);

-- Digoxin Toxicity
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Digoxin Toxicity', 'Toxic digoxin levels causing arrhythmias', '[
  {"feature": "PVCs", "value": "Frequent, may be multifocal"},
  {"feature": "Atrial tachycardia", "value": "With AV block"},
  {"feature": "Junctional rhythm", "value": "May be present"},
  {"feature": "Ventricular tachycardia", "value": "Life-threatening"},
  {"feature": "Heart block", "value": "Various degrees possible"},
  {"feature": "Bidirectional VT", "value": "Classic but rare finding"}
]', null);

-- Long QT Syndrome
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Long QT Syndrome', 'Prolonged ventricular repolarization', '[
  {"feature": "QTc interval", "value": "> 440 ms (men), > 460 ms (women)"},
  {"feature": "T waves", "value": "May be notched, bifid, or bizarre"},
  {"feature": "T wave alternans", "value": "May be present"},
  {"feature": "Bradycardia", "value": "May trigger torsades"},
  {"feature": "Arrhythmia risk", "value": "Torsades de pointes"},
  {"feature": "Causes", "value": "Congenital, drugs (QT prolonging), electrolyte abnormalities"}
]', null);

-- Wolff-Parkinson-White (WPW)
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Wolff-Parkinson-White', 'Pre-excitation via accessory pathway', '[
  {"feature": "PR interval", "value": "Short (< 120 ms)"},
  {"feature": "Delta wave", "value": "Slurred upslope of QRS"},
  {"feature": "QRS duration", "value": "Wide (> 120 ms)"},
  {"feature": "ST-T changes", "value": "Secondary repolarization abnormalities"},
  {"feature": "Tachyarrhythmias", "value": "AVRT, atrial fibrillation risk"},
  {"feature": "Clinical significance", "value": "Risk of rapid conduction during AF"}
]', null);

-- Early Repolarization
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Early Repolarization', 'Normal variant, common in young healthy adults', '[
  {"feature": "ST elevation", "value": "Concave, most prominent in precordial leads"},
  {"feature": "J point notching", "value": "Notch at end of QRS"},
  {"feature": "T waves", "value": "Tall, prominent, same direction as ST"},
  {"feature": "Distribution", "value": "Widespread, often V2-V5"},
  {"feature": "Clinical context", "value": "Young, healthy, asymptomatic"},
  {"feature": "Differential", "value": "Must distinguish from pericarditis, early MI"}
]', null);

-- Left Ventricular Hypertrophy
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Left Ventricular Hypertrophy', 'Increased LV mass causing voltage criteria', '[
  {"feature": "Sokolow-Lyon", "value": "S V1 + R V5/V6 > 35 mm"},
  {"feature": "Cornell voltage", "value": "R aVL + S V3 > 28 mm (men), > 20 mm (women)"},
  {"feature": "Left axis deviation", "value": "Often present"},
  {"feature": "ST-T changes", "value": "Strain pattern (downsloping ST, inverted T)"},
  {"feature": "QRS duration", "value": "May be slightly prolonged"},
  {"feature": "P waves", "value": "Left atrial enlargement (biphasic P in V1)"}
]', null);

-- Right Ventricular Hypertrophy
INSERT OR IGNORE INTO ecg_patterns (name, description, key_features_json, condition_id) VALUES
('Right Ventricular Hypertrophy', 'Increased RV mass causing characteristic changes', '[
  {"feature": "Right axis deviation", "value": "Often present"},
  {"feature": "R V1 > S V1", "value": "Dominant R in V1"},
  {"feature": "R V1 + S V5/V6 > 10.5 mm", "value": "Voltage criterion"},
  {"feature": "T wave inversion", "value": "V1-V3"},
  {"feature": "Right atrial enlargement", "value": "Tall P waves in II, III, aVF"},
  {"feature": "Causes", "value": "Pulmonary hypertension, COPD, congenital heart disease"}
]', null);

COMMIT;
