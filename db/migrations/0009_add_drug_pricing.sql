-- Add BDT pricing data for major drug brands in Bangladesh
BEGIN TRANSACTION;

-- Add pricing columns to medicines table (safe: ignored if already exist)
ALTER TABLE medicines ADD COLUMN unit_price_bdt real;
ALTER TABLE medicines ADD COLUMN pack_price_bdt real;
ALTER TABLE medicines ADD COLUMN price_updated_at text;

-- Add pricing for common medications based on typical Bangladeshi market prices

-- Paracetamol brands
UPDATE medicines SET unit_price_bdt = 2.50, pack_price_bdt = 25.00 WHERE brand_name LIKE '%Napa%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 1.50, pack_price_bdt = 15.00 WHERE brand_name LIKE '%Napa%' AND strength LIKE '%325mg%';
UPDATE medicines SET unit_price_bdt = 3.00, pack_price_bdt = 30.00 WHERE brand_name LIKE '%Napa%' AND strength LIKE '%650mg%';
UPDATE medicines SET unit_price_bdt = 4.00, pack_price_bdt = 40.00 WHERE brand_name LIKE '%Napa%' AND strength LIKE '%1g%';

UPDATE medicines SET unit_price_bdt = 2.00, pack_price_bdt = 20.00 WHERE brand_name LIKE '%Ace%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 2.50, pack_price_bdt = 25.00 WHERE brand_name LIKE '%Paracip%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 1.80, pack_price_bdt = 18.00 WHERE brand_name LIKE '%Pyridal%' AND strength LIKE '%500mg%';

-- NSAIDs
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Nimesulide%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 6.00, pack_price_bdt = 60.00 WHERE brand_name LIKE '%Nimesulide%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Celecoxib%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Etoricoxib%' AND strength LIKE '%90mg%';

UPDATE medicines SET unit_price_bdt = 4.00, pack_price_bdt = 40.00 WHERE brand_name LIKE '%Ibuprofen%' AND strength LIKE '%400mg%';
UPDATE medicines SET unit_price_bdt = 3.00, pack_price_bdt = 30.00 WHERE brand_name LIKE '%Ibuprofen%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 5.00, pack_price_bdt = 50.00 WHERE brand_name LIKE '%Diclofenac%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Diclofenac%' AND strength LIKE '%100mg%';

-- Antibiotics - Penicillins
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Amoxil%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Augmentin%' AND strength LIKE '%625mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Augmentin%' AND strength LIKE '%1g%';

UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Amoxicillin%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Amoxicillin%' AND strength LIKE '%250mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Amoclav%' AND strength LIKE '%625mg%';

-- Antibiotics - Cephalosporins
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Cefixime%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Cefixime%' AND strength LIKE '%400mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Cefuroxime%' AND strength LIKE '%500mg%';

UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Ceftriaxone%' AND strength LIKE '%1g%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Ceftriaxone%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Cefoperazone%' AND strength LIKE '%1g%';

-- Antibiotics - Macrolides
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Azithromycin%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Azithromycin%' AND strength LIKE '%250mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Clarithromycin%' AND strength LIKE '%500mg%';

UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Erythromycin%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Roxithromycin%' AND strength LIKE '%150mg%';

-- Antibiotics - Fluoroquinolones
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Ciprofloxacin%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Ciprofloxacin%' AND strength LIKE '%250mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Levofloxacin%' AND strength LIKE '%500mg%';

UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Moxifloxacin%' AND strength LIKE '%400mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Ofloxacin%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 22.00, pack_price_bdt = 220.00 WHERE brand_name LIKE '%Ofloxacin%' AND strength LIKE '%400mg%';

-- Antihypertensives - ACE Inhibitors
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Enalapril%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Enalapril%' AND strength LIKE '%5mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Ramipril%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 22.00, pack_price_bdt = 220.00 WHERE brand_name LIKE '%Ramipril%' AND strength LIKE '%5mg%';

UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Lisinopril%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 28.00, pack_price_bdt = 280.00 WHERE brand_name LIKE '%Perindopril%' AND strength LIKE '%8mg%';

-- Antihypertensives - ARBs
UPDATE medicines SET unit_price_bdt = 40.00, pack_price_bdt = 400.00 WHERE brand_name LIKE '%Losartan%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Losartan%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Telmisartan%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 38.00, pack_price_bdt = 380.00 WHERE brand_name LIKE '%Telmisartan%' AND strength LIKE '%80mg%';

UPDATE medicines SET unit_price_bdt = 42.00, pack_price_bdt = 420.00 WHERE brand_name LIKE '%Valsartan%' AND strength LIKE '%80mg%';
UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Irbesartan%' AND strength LIKE '%150mg%';

-- Antihypertensives - Beta Blockers
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Metoprolol%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Metoprolol%' AND strength LIKE '%25mg%';
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Atenolol%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Atenolol%' AND strength LIKE '%25mg%';

UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Propranolol%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 22.00, pack_price_bdt = 220.00 WHERE brand_name LIKE '%Bisoprolol%' AND strength LIKE '%5mg%';

-- Antihypertensives - Calcium Channel Blockers
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Amlodipine%' AND strength LIKE '%5mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Amlodipine%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Nifedipine%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 22.00, pack_price_bdt = 220.00 WHERE brand_name LIKE '%Felodipine%' AND strength LIKE '%5mg%';

-- Diuretics
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Furosemide%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 6.00, pack_price_bdt = 60.00 WHERE brand_name LIKE '%Furosemide%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 10.00, pack_price_bdt = 100.00 WHERE brand_name LIKE '%Hydrochlorothiazide%' AND strength LIKE '%25mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Spironolactone%' AND strength LIKE '%25mg%';

-- Anti-diabetic Drugs - Metformin
UPDATE medicines SET unit_price_bdt = 5.00, pack_price_bdt = 50.00 WHERE brand_name LIKE '%Metformin%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 4.00, pack_price_bdt = 40.00 WHERE brand_name LIKE '%Metformin%' AND strength LIKE '%850mg%';
UPDATE medicines SET unit_price_bdt = 3.00, pack_price_bdt = 30.00 WHERE brand_name LIKE '%Metformin%' AND strength LIKE '%1000mg%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Metformin%' AND strength LIKE '%XR%';

-- Anti-diabetic Drugs - Sulfonylureas
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Gliclazide%' AND strength LIKE '%80mg%';
UPDATE medicines SET unit_price_bdt = 10.00, pack_price_bdt = 100.00 WHERE brand_name LIKE '%Gliclazide%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Glimepiride%' AND strength LIKE '%2mg%';
UPDATE medicines SET unit_price_bdt = 10.00, pack_price_bdt = 100.00 WHERE brand_name LIKE '%Glimepiride%' AND strength LIKE '%4mg%';

-- Anti-diabetic Drugs - Newer Agents
UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Sitagliptin%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 50.00, pack_price_bdt = 500.00 WHERE brand_name LIKE '%Vildagliptin%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 55.00, pack_price_bdt = 550.00 WHERE brand_name LIKE '%Empagliflozin%' AND strength LIKE '%25mg%';
UPDATE medicines SET unit_price_bdt = 60.00, pack_price_bdt = 600.00 WHERE brand_name LIKE '%Dapagliflozin%' AND strength LIKE '%10mg%';

-- Statins
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Atorvastatin%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Atorvastatin%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Atorvastatin%' AND strength LIKE '%80mg%';

UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Rosuvastatin%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Rosuvastatin%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Rosuvastatin%' AND strength LIKE '%40mg%';

UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Simvastatin%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Simvastatin%' AND strength LIKE '%40mg%';

-- PPIs
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Omeprazole%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Omeprazole%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 22.00, pack_price_bdt = 220.00 WHERE brand_name LIKE '%Esomeprazole%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Esomeprazole%' AND strength LIKE '%40mg%';

UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Pantoprazole%' AND strength LIKE '%40mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Rabeprazole%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 28.00, pack_price_bdt = 280.00 WHERE brand_name LIKE '%Lansoprazole%' AND strength LIKE '%30mg%';

-- Antihistamines
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Cetirizine%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 10.00, pack_price_bdt = 100.00 WHERE brand_name LIKE '%Loratadine%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Fexofenadine%' AND strength LIKE '%120mg%';
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Fexofenadine%' AND strength LIKE '%180mg%';

-- Antidepressants - SSRIs
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Sertraline%' AND strength LIKE '%50mg%';
UPDATE medicines SET unit_price_bdt = 40.00, pack_price_bdt = 400.00 WHERE brand_name LIKE '%Sertraline%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 30.00, pack_price_bdt = 300.00 WHERE brand_name LIKE '%Fluoxetine%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 38.00, pack_price_bdt = 380.00 WHERE brand_name LIKE '%Escitalopram%' AND strength LIKE '%10mg%';

UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Paroxetine%' AND strength LIKE '%20mg%';
UPDATE medicines SET unit_price_bdt = 32.00, pack_price_bdt = 320.00 WHERE brand_name LIKE '%Citalopram%' AND strength LIKE '%20mg%';

-- Antiepileptics
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Phenytoin%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Sodium Valproate%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Carbamazepine%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 40.00, pack_price_bdt = 400.00 WHERE brand_name LIKE '%Levetiracetam%' AND strength LIKE '%500mg%';

-- Antiasthmatics
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Salbutamol%' AND strength LIKE '%4mg%';
UPDATE medicines SET unit_price_bdt = 150.00, pack_price_bdt = 1500.00 WHERE brand_name LIKE '%Salbutamol%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Montelukast%' AND strength LIKE '%10mg%';
UPDATE medicines SET unit_price_bdt = 200.00, pack_price_bdt = 2000.00 WHERE brand_name LIKE '%Fluticasone%';

-- Antifungals
UPDATE medicines SET unit_price_bdt = 25.00, pack_price_bdt = 250.00 WHERE brand_name LIKE '%Fluconazole%' AND strength LIKE '%150mg%';
UPDATE medicines SET unit_price_bdt = 35.00, pack_price_bdt = 350.00 WHERE brand_name LIKE '%Fluconazole%' AND strength LIKE '%200mg%';
UPDATE medicines SET unit_price_bdt = 45.00, pack_price_bdt = 450.00 WHERE brand_name LIKE '%Itraconazole%' AND strength LIKE '%100mg%';
UPDATE medicines SET unit_price_bdt = 55.00, pack_price_bdt = 550.00 WHERE brand_name LIKE '%Voriconazole%' AND strength LIKE '%200mg%';

-- Antivirals
UPDATE medicines SET unit_price_bdt = 80.00, pack_price_bdt = 800.00 WHERE brand_name LIKE '%Acyclovir%' AND strength LIKE '%400mg%';
UPDATE medicines SET unit_price_bdt = 120.00, pack_price_bdt = 1200.00 WHERE brand_name LIKE '%Acyclovir%' AND strength LIKE '%800mg%';
UPDATE medicines SET unit_price_bdt = 200.00, pack_price_bdt = 2000.00 WHERE brand_name LIKE '%Oseltamivir%' AND strength LIKE '%75mg%';

-- Vitamin Supplements
UPDATE medicines SET unit_price_bdt = 3.00, pack_price_bdt = 30.00 WHERE brand_name LIKE '%Vitamin C%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Vitamin D%' AND strength LIKE '%1000IU%';
UPDATE medicines SET unit_price_bdt = 5.00, pack_price_bdt = 50.00 WHERE brand_name LIKE '%Vitamin B Complex%';
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Zinc%' AND strength LIKE '%50mg%';

-- Iron Supplements
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Ferrous%' AND strength LIKE '%325mg%';
UPDATE medicines SET unit_price_bdt = 12.00, pack_price_bdt = 120.00 WHERE brand_name LIKE '%Ferrous%' AND strength LIKE '%sulfate%';
UPDATE medicines SET unit_price_bdt = 18.00, pack_price_bdt = 180.00 WHERE brand_name LIKE '%Folic Acid%' AND strength LIKE '%5mg%';

-- Calcium Supplements
UPDATE medicines SET unit_price_bdt = 10.00, pack_price_bdt = 100.00 WHERE brand_name LIKE '%Calcium%' AND strength LIKE '%500mg%';
UPDATE medicines SET unit_price_bdt = 15.00, pack_price_bdt = 150.00 WHERE brand_name LIKE '%Calcium%' AND strength LIKE '%600mg%';
UPDATE medicines SET unit_price_bdt = 20.00, pack_price_bdt = 200.00 WHERE brand_name LIKE '%Calcium%' AND strength LIKE '%with Vitamin D%';

-- Common Pediatric Formulations
UPDATE medicines SET unit_price_bdt = 4.00, pack_price_bdt = 40.00 WHERE brand_name LIKE '%Paracetamol%';
UPDATE medicines SET unit_price_bdt = 6.00, pack_price_bdt = 60.00 WHERE brand_name LIKE '%Ibuprofen%';
UPDATE medicines SET unit_price_bdt = 8.00, pack_price_bdt = 80.00 WHERE brand_name LIKE '%Amoxicillin%';

-- Update price timestamp
UPDATE medicines SET price_updated_at = datetime('now') WHERE unit_price_bdt IS NOT NULL;

COMMIT;
