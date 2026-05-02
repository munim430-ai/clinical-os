-- Link conditions to relevant drugs based on protocols
BEGIN TRANSACTION;

-- Create a junction table for condition-drug relationships
CREATE TABLE IF NOT EXISTS condition_drugs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  condition_id TEXT NOT NULL,
  drug_id INTEGER NOT NULL,
  indication TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  notes TEXT,
  priority INTEGER DEFAULT 1, -- 1=first-line, 2=second-line, 3=alternative
  FOREIGN KEY (condition_id) REFERENCES conditions (id),
  FOREIGN KEY (drug_id) REFERENCES medicines (id),
  UNIQUE(condition_id, drug_id)
);

-- Dengue Fever Drug Links
-- First-line: Paracetamol for fever
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dengue', m.id, 'Fever and pain control', '10-15 mg/kg', 'Every 6 hours', 'As needed during fever', 'Maximum 4 doses/day, avoid NSAIDs due to bleeding risk', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Napa%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- IV Fluids for Dengue
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dengue', m.id, 'IV fluid resuscitation', '1500-2000 mL/m²/day', 'Continuous infusion', '24-72 hours or until stable', 'Dextrose saline or Ringer lactate, monitor for fluid overload', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Dextrose%' AND m.strength LIKE '%5%' LIMIT 1;

-- Anti-emetic for Dengue
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dengue', m.id, 'Persistent vomiting', '0.15 mg/kg', 'Every 8 hours', 'As needed', 'IV or oral, monitor for QT prolongation', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Ondansetron%' AND m.strength LIKE '%4mg%' LIMIT 1;

-- Typhoid Fever Drug Links
-- First-line: Ceftriaxone
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'typhoid', m.id, 'First-line antibiotic therapy', '2-4 g', 'Once daily', '7-14 days', 'IV or IM, adjust for renal impairment', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Ceftriaxone%' AND m.strength LIKE '%1g%' LIMIT 1;

-- Oral alternative: Cefixime
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'typhoid', m.id, 'Oral antibiotic therapy', '400 mg', 'Twice daily', '14 days', 'Switch from IV when clinically stable', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Cefixime%' AND m.strength LIKE '%400mg%' LIMIT 1;

-- Azithromycin for resistant cases
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'typhoid', m.id, 'Resistant or alternative therapy', '1 g', 'Once daily', '5-7 days', 'For multidrug-resistant strains or penicillin allergy', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Azithromycin%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- PPI for GI protection
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'typhoid', m.id, 'GI protection and ulcer prophylaxis', '20-40 mg', 'Once daily', '14 days', 'Especially with steroids or if bleeding risk', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Omeprazole%' AND m.strength LIKE '%20mg%' LIMIT 1;

-- Malaria Drug Links
-- First-line: Artemether-Lumefantrine
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'malaria', m.id, 'First-line ACT therapy', 'Weight-based dosing', 'Twice daily day 1, then once daily', '3 days total', 'Take with food, repeat dose if vomiting within 30 minutes', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Artemether%' LIMIT 1;

-- IV Artesunate for severe malaria
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'malaria', m.id, 'Severe malaria treatment', '2.4 mg/kg', 'At 0, 12, 24 hours, then daily', 'Until able to take oral therapy', 'IV or IM, switch to ACT when stable', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Artesunate%' LIMIT 1;

-- Chloroquine for P. vivax
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'malaria', m.id, 'P. vivax treatment', '25 mg/kg total', 'Split over 3 days', '3 days', '10 mg/kg day 0, 10 mg/kg day 1, 5 mg/kg day 2', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Chloroquine%' LIMIT 1;

-- Primaquine for radical cure
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'malaria', m.id, 'P. vivax radical cure', '0.25 mg/kg', 'Once daily', '14 days', 'G6PD testing required, monitor for hemolysis', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Primaquine%' LIMIT 1;

-- Cholera Drug Links
-- First-line: Doxycycline
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'cholera', m.id, 'Antibiotic therapy', '300 mg', 'Single dose', 'One time', 'Reduces duration of diarrhea and bacterial shedding', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Doxycycline%' AND m.strength LIKE '%100mg%' LIMIT 1;

-- Alternative: Azithromycin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'cholera', m.id, 'Alternative antibiotic', '1 g', 'Single dose', 'One time', 'For pregnant women or doxycycline resistance', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Azithromycin%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- Zinc supplementation
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'cholera', m.id, 'Adjunct therapy', '20 mg', 'Once daily', '14 days', 'Reduces duration and severity of diarrhea', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Zinc%' AND m.strength LIKE '%50mg%' LIMIT 1;

-- Pneumonia Drug Links
-- First-line: Amoxicillin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'pneumonia', m.id, 'First-line outpatient therapy', '1 g', 'Three times daily', '5-7 days', 'For uncomplicated CAP without comorbidities', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Amoxicillin%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- Amoxicillin-Clavulanate
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'pneumonia', m.id, 'Augmented penicillin', '625 mg', 'Three times daily', '7-10 days', 'For comorbidities or recent antibiotic use', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Augmentin%' AND m.strength LIKE '%625mg%' LIMIT 1;

-- IV Ceftriaxone for hospitalized patients
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'pneumonia', m.id, 'IV therapy for hospitalized patients', '2 g', 'Once daily', '7-10 days', 'For moderate-severe CAP or comorbidities', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Ceftriaxone%' AND m.strength LIKE '%1g%' LIMIT 1;

-- Azithromycin for atypical coverage
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'pneumonia', m.id, 'Atypical coverage', '500 mg', 'Once daily', '5 days', 'Add to beta-lactam for atypical pathogens', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Azithromycin%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- ACS Drug Links
-- Aspirin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'Antiplatelet therapy', '300 mg', 'Single dose (loading)', 'Then 75-100 mg daily', 'Chewable for faster absorption, continue indefinitely', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Aspirin%' AND m.strength LIKE '%300mg%' LIMIT 1;

-- Clopidogrel
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'Dual antiplatelet therapy', '300-600 mg', 'Loading dose', 'Then 75 mg daily', 'For 12 months with DES stent, minimum 1 month with BMS', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Clopidogrel%' AND m.strength LIKE '%75mg%' LIMIT 1;

-- Ticagrelor alternative
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'Alternative P2Y12 inhibitor', '180 mg', 'Loading dose', 'Then 90 mg twice daily', 'More potent than clopidogrel, no loading needed if already on', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Ticagrelor%' AND m.strength LIKE '%90mg%' LIMIT 1;

-- Atorvastatin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'High-intensity statin therapy', '80 mg', 'Once daily', 'Indefinitely', 'Start regardless of baseline LDL, aim for LDL <70 mg/dL', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Atorvastatin%' AND m.strength LIKE '%80mg%' LIMIT 1;

-- Metoprolol
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'Beta-blocker therapy', '25-50 mg', 'Twice daily', 'Indefinitely', 'Start within 24 hours if no contraindications', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Metoprolol%' AND m.strength LIKE '%50mg%' LIMIT 1;

-- Ramipril
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'acs', m.id, 'ACE inhibitor therapy', '2.5-5 mg', 'Once daily', 'Indefinitely', 'Start within 24 hours if no contraindications, titrate to 10 mg', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Ramipril%' AND m.strength LIKE '%5mg%' LIMIT 1;

-- DKA Drug Links
-- Regular Insulin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dka', m.id, 'Insulin therapy', '0.1 units/kg/hour', 'Continuous infusion', 'Until resolution', 'Start after potassium >3.3 mEq/L, add dextrose when glucose <250', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Insulin%' AND m.strength LIKE '%Regular%' LIMIT 1;

-- IV Fluids
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dka', m.id, 'Fluid resuscitation', '1-1.5 L', 'First hour', 'Then based on hydration', '0.9% saline initially, switch to 0.45% if sodium normal/high', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Saline%' AND m.strength LIKE '%0.9%' LIMIT 1;

-- Potassium replacement
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'dka', m.id, 'Potassium replacement', '20-40 mEq/L', 'Added to IV fluids', 'Until potassium >4 mEq/L', 'Monitor potassium q2-4 hours initially', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Potassium%' AND m.strength LIKE '%20mEq%' LIMIT 1;

-- UTI Drug Links
-- Nitrofurantoin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'uti', m.id, 'Uncomplicated cystitis', '100 mg', 'Twice daily', '5 days', 'Avoid in renal impairment (eGFR <30)', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Nitrofurantoin%' AND m.strength LIKE '%100mg%' LIMIT 1;

-- TMP-SMX
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'uti', m.id, 'Alternative cystitis therapy', '160/800 mg', 'Twice daily', '3 days', 'DS strength, check local resistance rates', 1
FROM medicines m 
WHERE m.brand_name LIKE '%TMP%' LIMIT 1;

-- Ciprofloxacin
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'uti', m.id, 'Pyelonephritis or resistant UTI', '500 mg', 'Twice daily', '7-14 days', 'Avoid in pregnancy, increasing resistance concerns', 2
FROM medicines m 
WHERE m.brand_name LIKE '%Ciprofloxacin%' AND m.strength LIKE '%500mg%' LIMIT 1;

-- Stroke Drug Links
-- Alteplase
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'stroke', m.id, 'Thrombolysis for ischemic stroke', '0.9 mg/kg', 'IV infusion over 60 minutes', 'One time', '10% given as bolus over 1 minute, must be within 4.5 hours', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Alteplase%' LIMIT 1;

-- Aspirin for stroke prevention
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'stroke', m.id, 'Secondary stroke prevention', '75-100 mg', 'Once daily', 'Indefinitely', 'Start 24 hours after thrombolysis or immediately if no thrombolysis', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Aspirin%' AND m.strength LIKE '%100mg%' LIMIT 1;

-- Atorvastatin for stroke prevention
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'stroke', m.id, 'Statin therapy for stroke prevention', '80 mg', 'Once daily', 'Indefinitely', 'High-intensity statin regardless of baseline LDL', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Atorvastatin%' AND m.strength LIKE '%80mg%' LIMIT 1;

-- Anemia Drug Links
-- Ferrous Sulfate
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'anaemia', m.id, 'Iron deficiency anemia', '325 mg', 'Three times daily', '3-6 months', 'Take with vitamin C, between meals, continue 3 months after normalization', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Ferrous%' AND m.strength LIKE '%325mg%' LIMIT 1;

-- Folic Acid
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'anaemia', m.id, 'Megaloblastic anemia', '1-5 mg', 'Once daily', '3-6 months', 'For folate deficiency, prophylaxis in pregnancy', 1
FROM medicines m 
WHERE m.brand_name LIKE '%Folic Acid%' AND m.strength LIKE '%5mg%' LIMIT 1;

-- Vitamin B12
INSERT OR IGNORE INTO condition_drugs (condition_id, drug_id, indication, dosage, frequency, duration, notes, priority) 
SELECT 'anaemia', m.id, 'B12 deficiency anemia', '1000 mcg', 'Daily or weekly', 'Indefinitely for pernicious anemia', 'IM injection initially, then oral maintenance if possible', 1
FROM medicines m 
WHERE m.brand_name LIKE '%B12%' AND m.strength LIKE '%1000mcg%' LIMIT 1;

-- Update timestamp for all entries
UPDATE condition_drugs SET notes = notes || ' | Updated: ' || datetime('now') WHERE notes IS NOT NULL;

COMMIT;
