-- Lab reference values for Bangladeshi population
BEGIN TRANSACTION;

-- Complete Blood Count (CBC)
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Hemoglobin (Hb)', 'g/dL', 12.0, 16.0, 7.0, 18.0, 'Adult female: 12.0-15.5 g/dL, Adult male: 13.5-17.5 g/dL'),
('Hematocrit (Hct)', '%', 37.0, 47.0, 25.0, 55.0, 'Adult female: 37-47%, Adult male: 42-52%'),
('RBC Count', 'million/µL', 4.2, 5.4, 3.0, 6.0, 'Adult female: 4.2-5.4, Adult male: 4.7-6.1'),
('MCV', 'fL', 80.0, 100.0, 70.0, 105.0, 'Mean Corpuscular Volume'),
('MCH', 'pg', 27.0, 33.0, 20.0, 35.0, 'Mean Corpuscular Hemoglobin'),
('MCHC', 'g/dL', 32.0, 36.0, 30.0, 38.0, 'Mean Corpuscular Hemoglobin Concentration'),
('RDW', '%', 11.5, 14.5, 10.0, 17.0, 'Red Cell Distribution Width'),
('WBC Count', 'thousand/µL', 4.0, 11.0, 1.0, 25.0, 'Total White Blood Cell Count'),
('Neutrophils', '%', 40.0, 74.0, 20.0, 85.0, 'Absolute: 1.8-7.7 x 10^9/L'),
('Lymphocytes', '%', 20.0, 45.0, 10.0, 60.0, 'Absolute: 1.0-4.8 x 10^9/L'),
('Monocytes', '%', 2.0, 8.0, 0.0, 12.0, 'Absolute: 0.1-0.8 x 10^9/L'),
('Eosinophils', '%', 0.0, 5.0, 0.0, 10.0, 'Absolute: 0.0-0.5 x 10^9/L'),
('Basophils', '%', 0.0, 1.0, 0.0, 2.0, 'Absolute: 0.0-0.2 x 10^9/L'),
('Platelet Count', 'thousand/µL', 150.0, 450.0, 50.0, 1000.0, 'Critical bleeding < 50k, severe < 20k'),
('MPV', 'fL', 7.5, 11.5, 6.0, 13.0, 'Mean Platelet Volume'),
('PDW', '%', 15.0, 17.0, 10.0, 20.0, 'Platelet Distribution Width'),
('Plateletcrit', '%', 0.15, 0.35, 0.05, 0.50, 'Platelet Crit');

-- Electrolytes & Renal Function
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Sodium', 'mmol/L', 135.0, 145.0, 120.0, 160.0, 'Hyponatremia < 135, Hypernatremia > 145'),
('Potassium', 'mmol/L', 3.5, 5.1, 2.5, 6.5, 'Hypokalemia < 3.5, Hyperkalemia > 5.5'),
('Chloride', 'mmol/L', 98.0, 106.0, 85.0, 115.0, 'Serum Chloride'),
('Bicarbonate', 'mmol/L', 22.0, 28.0, 12.0, 35.0, 'Serum Bicarbonate/HCO3-'),
('Anion Gap', 'mmol/L', 8.0, 16.0, 4.0, 20.0, 'Calculated: Na - (Cl + HCO3)'),
('Blood Urea Nitrogen (BUN)', 'mg/dL', 7.0, 20.0, 5.0, 50.0, 'Convert to urea: BUN x 2.14'),
('Creatinine', 'mg/dL', 0.6, 1.2, 0.4, 2.0, 'Adult female: 0.6-1.1, Adult male: 0.7-1.3'),
('eGFR', 'mL/min/1.73m²', 90.0, 120.0, 15.0, null, 'Estimated Glomerular Filtration Rate'),
('Uric Acid', 'mg/dL', 3.5, 7.2, 2.0, 10.0, 'Adult female: 2.5-7.5, Adult male: 4.0-8.5'),
('Calcium', 'mg/dL', 8.5, 10.5, 7.0, 12.5, 'Corrected Ca = Ca + 0.8*(4.0 - Albumin)'),
('Phosphorus', 'mg/dL', 2.5, 4.5, 1.5, 6.0, 'Serum Phosphate'),
('Magnesium', 'mg/dL', 1.7, 2.2, 1.2, 3.0, 'Serum Magnesium');

-- Liver Function Tests (LFT)
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Alanine Aminotransferase (ALT/SGPT)', 'U/L', 7.0, 55.0, 5.0, 200.0, 'Hepatocellular enzyme'),
('Aspartate Aminotransferase (AST/SGOT)', 'U/L', 8.0, 48.0, 5.0, 200.0, 'Hepatocellular enzyme'),
('Alkaline Phosphatase (ALP)', 'U/L', 40.0, 129.0, 20.0, 400.0, 'Cholestatic enzyme'),
('Gamma Glutamyl Transferase (GGT)', 'U/L', 8.0, 61.0, 5.0, 300.0, 'Alcohol and cholestasis marker'),
('Total Bilirubin', 'mg/dL', 0.3, 1.2, 0.2, 5.0, 'Direct > 0.3 mg/dL = conjugated'),
('Direct Bilirubin', 'mg/dL', 0.0, 0.3, 0.0, 2.0, 'Conjugated bilirubin'),
('Indirect Bilirubin', 'mg/dL', 0.2, 0.9, 0.1, 3.0, 'Unconjugated bilirubin'),
('Total Protein', 'g/dL', 6.4, 8.3, 5.0, 10.0, 'Serum total protein'),
('Albumin', 'g/dL', 3.5, 5.0, 2.0, 6.0, 'Serum albumin'),
('Globulin', 'g/dL', 2.0, 3.5, 1.0, 5.0, 'Calculated: Total protein - Albumin'),
('A/G Ratio', '', 1.1, 2.2, 0.8, 3.0, 'Albumin/Globulin ratio'),
('LDH', 'U/L', 100.0, 250.0, 80.0, 500.0, 'Lactate Dehydrogenase'),
('5''-Nucleotidase', 'U/L', 2.0, 17.0, 1.0, 30.0, 'Cholestatic enzyme');

-- Cardiac Markers
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Troponin I', 'ng/mL', 0.0, 0.04, null, 0.5, 'High sensitivity: < 0.01 ng/mL'),
('Troponin T', 'ng/mL', 0.0, 0.01, null, 0.1, 'High sensitivity: < 0.003 ng/mL'),
('CK-MB', 'ng/mL', 0.0, 3.6, null, 10.0, 'Creatine Kinase-MB'),
('CK Total', 'U/L', 25.0, 200.0, 10.0, 1000.0, 'Creatine Kinase total'),
('Myoglobin', 'ng/mL', 10.0, 85.0, null, 200.0, 'Early cardiac marker'),
('BNP', 'pg/mL', 0.0, 100.0, null, 500.0, 'B-type Natriuretic Peptide'),
('NT-proBNP', 'pg/mL', 0.0, 300.0, null, 900.0, 'N-terminal pro-BNP'),
('D-Dimer', 'ng/mL FEU', 0.0, 500.0, null, 2000.0, 'Fibrin degradation products');

-- Lipid Profile
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Total Cholesterol', 'mg/dL', null, 200.0, null, 300.0, 'Desirable: < 200 mg/dL'),
('LDL Cholesterol', 'mg/dL', null, 130.0, null, 190.0, 'Optimal: < 100 mg/dL'),
('HDL Cholesterol', 'mg/dL', 40.0, null, 30.0, null, 'Protective: > 60 mg/dL'),
('Triglycerides', 'mg/dL', null, 150.0, null, 500.0, 'Normal: < 150 mg/dL'),
('VLDL Cholesterol', 'mg/dL', null, 40.0, null, 60.0, 'Calculated: Triglycerides/5');

-- Thyroid Function
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('TSH', 'mIU/L', 0.4, 4.0, 0.1, 10.0, 'Thyroid Stimulating Hormone'),
('Free T4', 'ng/dL', 0.8, 1.8, 0.5, 2.5, 'Free thyroxine'),
('Free T3', 'pg/mL', 2.3, 4.2, 1.5, 5.0, 'Free triiodothyronine'),
('Total T4', 'µg/dL', 5.0, 12.0, 3.0, 15.0, 'Total thyroxine'),
('Total T3', 'ng/dL', 80.0, 200.0, 60.0, 250.0, 'Total triiodothyronine');

-- Blood Glucose
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Fasting Blood Glucose', 'mg/dL', 70.0, 99.0, 50.0, 126.0, 'Fasting: 8+ hours'),
('Random Blood Glucose', 'mg/dL', 70.0, 139.0, 50.0, 200.0, 'Any time of day'),
('Post-Prandial Glucose', 'mg/dL', 70.0, 139.0, 50.0, 200.0, '2 hours after meal'),
('HbA1c', '%', 4.0, 5.6, null, 6.5, 'Glycated hemoglobin'),
('C-Peptide', 'ng/mL', 0.5, 2.0, 0.1, 5.0, 'Beta cell function');

-- Arterial Blood Gas (ABG)
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('pH', '', 7.35, 7.45, 7.20, 7.60, 'Arterial blood pH'),
('PaCO2', 'mmHg', 35.0, 45.0, 25.0, 55.0, 'Partial pressure CO2'),
('PaO2', 'mmHg', 80.0, 100.0, 55.0, 120.0, 'Partial pressure O2'),
('HCO3', 'mmol/L', 22.0, 26.0, 15.0, 35.0, 'Bicarbonate'),
('SaO2', '%', 95.0, 100.0, 85.0, 100.0, 'Oxygen saturation'),
('Base Excess', 'mmol/L', -2.0, 2.0, -10.0, 10.0, 'Base excess/deficit');

-- Coagulation Profile
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Prothrombin Time (PT)', 'seconds', 11.0, 13.5, 8.0, 20.0, 'Extrinsic pathway'),
('INR', '', 0.8, 1.2, 0.5, 3.0, 'International Normalized Ratio'),
('Activated Partial Thromboplastin Time (aPTT)', 'seconds', 25.0, 35.0, 15.0, 60.0, 'Intrinsic pathway'),
('Bleeding Time', 'minutes', 2.0, 7.0, 1.0, 15.0, 'Template bleeding time'),
('Clotting Time', 'minutes', 5.0, 10.0, 3.0, 20.0, 'Whole blood clotting time'),
('Fibrinogen', 'mg/dL', 200.0, 400.0, 100.0, 600.0, 'Factor I');

-- Urine Analysis
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Urine pH', '', 5.0, 7.0, 4.5, 8.0, 'Random urine sample'),
('Urine Specific Gravity', '', 1.003, 1.035, 1.001, 1.050, 'Concentration ability'),
('Urine Protein', 'mg/dL', 0.0, 10.0, null, 300.0, 'Normal: < 10 mg/dL'),
('Urine Albumin', 'mg/dL', 0.0, 5.0, null, 30.0, 'Microalbuminuria: 30-300 mg/dL'),
('Urine Glucose', 'mg/dL', 0.0, 5.0, null, 1000.0, 'Glycosuria: > 100 mg/dL'),
('Urine Ketones', 'mg/dL', 0.0, 5.0, null, 150.0, 'Ketonuria: > 10 mg/dL'),
('Urine Blood', 'RBC/HPF', 0.0, 3.0, null, 50.0, 'Hematuria: > 3 RBC/HPF'),
('Urine WBC', 'WBC/HPF', 0.0, 5.0, null, 50.0, 'Pyuria: > 5 WBC/HPF'),
('Urine Epithelial Cells', 'cells/HPF', 0.0, 5.0, null, 20.0, 'Epithelial cells'),
('Urine Casts', 'casts/LPF', 0.0, 5.0, null, 20.0, 'Hyline/granular casts'),
('Urine Crystals', '', 'none', 'few', null, 'many', 'Crystal types vary'),
('Urine Bacteria', '', 'none', 'few', null, 'many', 'Bacteriuria assessment'),
('24-hour Protein', 'mg/24h', 0.0, 150.0, null, 3000.0, 'Nephrotic: > 3500 mg/24h'),
('24-hour Creatinine Clearance', 'mL/min', 85.0, 135.0, 15.0, null, 'Renal function test');

-- Inflammatory Markers
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('ESR', 'mm/hr', 0.0, 20.0, null, 100.0, 'Erythrocyte Sedimentation Rate'),
('CRP', 'mg/L', 0.0, 5.0, null, 50.0, 'C-Reactive Protein'),
('Procalcitonin', 'ng/mL', 0.0, 0.5, null, 10.0, 'Bacterial infection marker'),
('Ferritin', 'ng/mL', 15.0, 300.0, 10.0, 1000.0, 'Iron stores, acute phase reactant');

-- Vitamins and Minerals
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Vitamin B12', 'pg/mL', 200.0, 900.0, 100.0, 2000.0, 'Cobalamin'),
('Vitamin D (25-OH)', 'ng/mL', 30.0, 100.0, 10.0, 150.0, 'Deficiency: < 20 ng/mL'),
('Folate', 'ng/mL', 3.0, 17.0, 2.0, 20.0, 'Folic acid'),
('Iron', 'µg/dL', 60.0, 170.0, 30.0, 300.0, 'Serum iron'),
('Ferritin', 'ng/mL', 15.0, 150.0, 10.0, 400.0, 'Iron stores'),
('TIBC', 'µg/dL', 250.0, 450.0, 200.0, 600.0, 'Total Iron Binding Capacity'),
('Transferrin Saturation', '%', 20.0, 50.0, 10.0, 80.0, 'Iron/TIBC x 100');

-- Hormones
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('Cortisol (8 AM)', 'µg/dL', 6.0, 23.0, 2.0, 50.0, 'Morning cortisol'),
('Cortisol (4 PM)', 'µg/dL', 3.0, 16.0, 1.0, 30.0, 'Afternoon cortisol'),
('Testosterone (Male)', 'ng/mL', 300.0, 1000.0, 200.0, 1500.0, 'Total testosterone'),
('Testosterone (Female)', 'ng/mL', 15.0, 70.0, 10.0, 100.0, 'Total testosterone'),
('Estradiol', 'pg/mL', 30.0, 400.0, 20.0, 600.0, 'Varies by menstrual cycle'),
('Progesterone', 'ng/mL', 1.0, 20.0, 0.5, 30.0, 'Luteal phase: 5-20 ng/mL'),
('Prolactin', 'ng/mL', 2.0, 29.0, 1.0, 100.0, 'Prolactin hormone'),
('LH', 'mIU/mL', 1.0, 12.0, 0.5, 50.0, 'Luteinizing hormone'),
('FSH', 'mIU/mL', 3.0, 12.0, 1.0, 50.0, 'Follicle stimulating hormone');

-- Tumor Markers
INSERT OR IGNORE INTO lab_references (name, unit, normal_min, normal_max, critical_low, critical_high, notes) VALUES
('CEA', 'ng/mL', 0.0, 3.0, null, 10.0, 'Carcinoembryonic antigen'),
('CA 19-9', 'U/mL', 0.0, 37.0, null, 120.0, 'Pancreatic cancer marker'),
('CA 125', 'U/mL', 0.0, 35.0, null, 200.0, 'Ovarian cancer marker'),
('AFP', 'ng/mL', 0.0, 10.0, null, 400.0, 'Alpha-fetoprotein'),
('PSA', 'ng/mL', 0.0, 4.0, null, 10.0, 'Prostate specific antigen');

COMMIT;
