-- DGHS Malaria Protocol with comprehensive steps
BEGIN TRANSACTION;

-- Insert the main protocol for Malaria
INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('malaria', 'DGHS National Guidelines for Management of Malaria 2025', 'Directorate General of Health Services, Bangladesh', '2025', 2025);

-- Get the protocol ID for Malaria (assuming it's 3 after Dengue and Typhoid)

-- Step 1: Initial Assessment and Diagnosis
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 1, 'Initial Assessment', 'Complete clinical evaluation for suspected malaria', '[
  {"item": "Take detailed history: fever pattern, travel to endemic areas, prophylaxis use"},
  {"item": "Perform complete physical examination with vital signs"},
  {"item": "Check for malaria signs: splenomegaly, jaundice, anemia"},
  {"item": "Assess for severe malaria complications: cerebral malaria, severe anemia, renal failure"},
  {"item": "Order rapid diagnostic test and/or thick/thin blood smear"},
  {"item": "Baseline CBC, LFT, renal function, blood glucose"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 2, 'Laboratory Diagnosis', 'Confirm malaria infection through appropriate tests', '[
  {"item": "Rapid Diagnostic Test (RDT): results in 15 minutes, detects HRP2 and pLDH"},
  {"item": "Microscopy: gold standard, species identification and parasite count"},
  {"item": "Thick smear: sensitive for parasite detection"},
  {"item": "Thin smear: species identification and parasite stage"},
  {"item": "Quantitative Buffy Coat (QBC): alternative microscopy method"},
  {"item": "PCR: confirmatory test, species identification, research settings"},
  {"item": "Parasite density calculation: parasites/μL of blood"}
]', 'moderate');

-- Step 2: Disease Classification
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 3, 'Malaria Classification', 'Classify malaria by species and severity', '[
  {"item": "P. falciparum malaria: most severe, common in Bangladesh (68% cases)"},
  {"item": "P. vivax malaria: less severe but can cause complications (32% cases)"},
  {"item": "Uncomplicated malaria: fever + positive test without organ dysfunction"},
  {"item": "Severe malaria: any of: cerebral malaria, severe anemia, hypoglycemia, renal failure, pulmonary edema, acidosis"},
  {"item": "Mixed infection: both P. falciparum and P. vivax"},
  {"item": "Treatment failure: recurrent parasitemia after adequate therapy"}
]', 'moderate');

-- Step 3: Uncomplicated P. falciparum Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 4, 'ACT Therapy for P. falciparum', 'Artemisinin-based combination therapy', '[
  {"item": "Artemether-Lumefantrine (AL): 4 doses over 3 days, weight-based dosing"},
  {"item": "Dihydroartemisinin-Piperaquine (DP): once daily for 3 days, weight-based"},
  {"item": "Artesunate-Mefloquine (AS-MQ): once daily for 3 days"},
  {"item": "Artesunate-Amodiaquine (AS-AQ): once daily for 3 days"},
  {"item": "Take with food to improve absorption"},
  {"item": "Complete full 3-day course even if symptoms improve"},
  {"item": "Vomiting within 30 minutes: repeat full dose"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 5, 'Supportive Care', 'Non-antimalarial management measures', '[
  {"item": "Antipyretics: paracetamol 500-1000 mg every 6 hours for fever"},
  {"item": "IV fluids: maintain hydration, correct electrolyte abnormalities"},
  {"item": "Anti-emetics: ondansetron 4 mg IV for vomiting"},
  {"item": "Nutrition: regular diet as tolerated"},
  {"item": "Monitor vital signs every 4-6 hours"},
  {"item": "Daily temperature chart to track response"},
  {"item": "Monitor for treatment failure or complications"}
]', 'low');

-- Step 4: Uncomplicated P. vivax Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 6, 'P. vivax Treatment', 'Treatment for P. vivax malaria', '[
  {"item": "Chloroquine: 25 mg/kg total over 3 days (10 mg/kg day 0, 10 mg/kg day 1, 5 mg/kg day 2)"},
  {"item": "Primaquine radical cure: 0.25 mg/kg daily for 14 days (G6PD normal)"},
  {"item": "Alternative ACT if chloroquine resistance suspected"},
  {"item": "Test for G6PD deficiency before primaquine"},
  {"item": "Monitor for hemolysis in G6PD deficient patients"},
  {"item": "Consider higher primaquine dose for resistant strains"},
  {"item": "Follow-up blood smear on day 28 to confirm cure"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 7, 'Relapse Prevention', 'Preventing P. vivax relapse', '[
  {"item": "Complete 14-day primaquine course essential"},
  {"item": "G6PD testing mandatory before primaquine"},
  {"item": "Weekly G6PD testing during primaquine in high-risk patients"},
  {"item": "Alternative regimens for G6PD deficient patients"},
  {"item": "Patient education on relapse symptoms"},
  {"item": "Consider weekly primaquine for 8 weeks if 14-day not possible"},
  {"item": "Monitor hemoglobin during primaquine therapy"}
]', 'moderate');

-- Step 5: Severe Malaria Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 8, 'Severe Malaria Emergency', 'Immediate management of severe malaria', '[
  {"item": "Immediate IV artesunate: 2.4 mg/kg IV at 0, 12, 24 hours, then daily"},
  {"item": "If artesunate unavailable: IV quinine 20 mg/kg loading then 10 mg/kg q8h"},
  {"item": "Admit to ICU or high-dependency unit"},
  {"item": "Secure IV access (two large-bore cannulas)"},
  {"item": "Continuous vital signs monitoring"},
  {"item": "Hourly neurological assessment if cerebral malaria"},
  {"item": "Blood glucose monitoring every 2-4 hours"},
  {"item": "Transfer to tertiary center if facilities unavailable"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 9, 'Cerebral Malaria Management', 'Specific management of cerebral involvement', '[
  {"item": "Maintain airway, breathing, circulation"},
  {"item": "Treat seizures: diazepam 0.3 mg/kg IV or phenytoin loading"},
  {"item": "Manage raised intracranial pressure: head elevation, mannitol if indicated"},
  {"item": "Avoid corticosteroids (not beneficial)"},
  {"item": "Monitor GCS hourly"},
  {"item": "Protect airway if GCS < 8"},
  {"item": "Consider lumbar puncture to exclude meningitis"},
  {"item": "Neurological monitoring for 48-72 hours"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 10, 'Severe Anemia Management', 'Management of malaria-induced anemia', '[
  {"item": "Transfuse packed RBCs: 10 mL/kg if Hb < 5 g/dL or < 7 g/dL with respiratory distress"},
  {"item": "Transfuse slowly to avoid fluid overload"},
  {"item": "Furosemide 1 mg/kg after transfusion if needed"},
  {"item": "Monitor for transfusion reactions"},
  {"item": "Iron supplementation after acute phase"},
  {"item": "Folic acid supplementation"},
  {"item": "Monitor hemoglobin daily"},
  {"item": "Consider exchange transfusion in very severe cases"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 11, 'Renal Failure Management', 'Management of malaria-associated renal failure', '[
  {"item": "Aggressive IV hydration: 3-4 L/m²/day"},
  {"item": "Diuretics: furosemide 1-2 mg/kg if oliguria persists"},
  {"item": "Monitor urine output hourly"},
  {"item": "Monitor creatinine, BUN, electrolytes daily"},
  {"item": "Early dialysis if refractory to medical management"},
  {"item": "Avoid nephrotoxic drugs"},
  {"item": "Adjust antimalarial doses for renal function"},
  {"item": "Continue antimalarial therapy despite renal failure"}
]', 'critical');

-- Step 6: Special Populations
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 12, 'Pediatric Management', 'Specific considerations for children', '[
  {"item": "Higher risk of severe disease and mortality"},
  {"item": "Weight-based dosing for all medications"},
  {"item": "Artemether-Lumefantrine: standard weight-based dosing"},
  {"item": "IV artesunate: 3 mg/kg for severe malaria (children < 20 kg)"},
  {"item": "Higher risk of hypoglycemia, monitor glucose closely"},
  {"item": "Severe anemia more common, lower transfusion threshold"},
  {"item": "Pediatric ICU referral for severe cases"},
  {"item": "Growth monitoring after recovery"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 13, 'Pregnancy Management', 'Management of malaria in pregnant women', '[
  {"item": "First trimester: quinine + clindamycin (ACT safety concerns)"},
  {"item": "Second/third trimester: ACT considered safe"},
  {"item": "Higher risk of maternal mortality and adverse outcomes"},
  {"item": "More frequent monitoring for complications"},
  {"item": "Fetal monitoring throughout illness"},
  {"item": "Obstetric consultation for delivery planning"},
  {"item": "Treatment of peripheral parasitemia even if asymptomatic"},
  {"item": "Postpartum monitoring for maternal complications"}
]', 'moderate');

-- Step 7: Monitoring and Follow-up
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 14, 'Treatment Response Monitoring', 'Assess response to antimalarial therapy', '[
  {"item": "Temperature chart: should defervesce within 48-72 hours"},
  {"item": "Daily clinical assessment"},
  {"item": "Repeat blood smear on day 3, day 7, and day 28"},
  {"item": "Monitor parasite clearance time"},
  {"item": "CBC: monitor for improvement in anemia"},
  {"item": "LFT and renal function: especially with severe disease"},
  {"item": "Consider treatment failure if persistent parasitemia > day 3"},
  {"item": "Monitor for drug side effects"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 15, 'Discharge Planning', 'Criteria for safe discharge', '[
  {"item": "Afebrile for 24 hours without antipyretics"},
  {"item": "Clinically stable vital signs for 24 hours"},
  {"item": "Able to tolerate oral intake"},
  {"item": "No evidence of complications"},
  {"item": "Negative blood smear or significant parasite reduction"},
  {"item": "Completed antimalarial course"},
  {"item": "Patient education on warning signs"},
  {"item": "Follow-up appointment scheduled"}
]', 'low');

-- Step 8: Complication Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 16, 'Hypoglycemia Management', 'Management of malaria-associated hypoglycemia', '[
  {"item": "Blood glucose monitoring every 2-4 hours in severe malaria"},
  {"item": "Treat glucose < 2.2 mmol/L: 10% dextrose 2 mL/kg bolus"},
  {"item": "Follow with 5% dextrose infusion"},
  {"item": "Monitor for recurrence after treatment"},
  {"item": "Consider continuous dextrose infusion if recurrent"},
  {"item": "Avoid quinine if possible (stimulates insulin secretion)"},
  {"item": "Educate staff on hypoglycemia signs"},
  {"item": "Monitor electrolytes alongside glucose"}
]', 'high');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 17, 'Pulmonary Edema Management', 'Management of malaria-associated pulmonary edema', '[
  {"item": "Sit patient upright, oxygen therapy"},
  {"item": "IV furosemide 1-2 mg/kg"},
  {"item": "Restrict IV fluids to maintenance only"},
  {"item": "Consider nitrates if severe"},
  {"item": "Monitor oxygen saturation continuously"},
  {"item": "Chest X-ray to confirm diagnosis"},
  {"item": "Mechanical ventilation if respiratory failure"},
  {"item": "Treat underlying malaria aggressively"}
]', 'critical');

-- Step 9: Prevention and Control
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 18, 'Vector Control', 'Prevention of malaria transmission', '[
  {"item": "Insecticide-treated bed nets (ITNs) for all at-risk populations"},
  {"item": "Indoor residual spraying (IRS) in endemic areas"},
  {"item": "Personal protection: repellents, protective clothing"},
  {"item": "Environmental management: eliminate breeding sites"},
  {"item": "Larviciding in stagnant water bodies"},
  {"item": "Community awareness programs"},
  {"item": "Surveillance of mosquito resistance to insecticides"},
  {"item": "Integrated vector management approach"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 19, 'Chemoprophylaxis', 'Malaria prevention for travelers', '[
  {"item": "Atovaquone-proguanil: daily, start 1-2 days before, continue 7 days after"},
  {"item": "Doxycycline: daily, start 1-2 days before, continue 4 weeks after"},
  {"item": "Mefloquine: weekly, start 2 weeks before, continue 4 weeks after"},
  {"item": "Choice depends on destination, resistance patterns, contraindications"},
  {"item": "Pregnant women: limited options, consult specialist"},
  {"item": "No prophylaxis provides 100% protection"},
  {"item": "Combine with personal protection measures"},
  {"item": "Seek medical care for any febrile illness despite prophylaxis"}
]', 'low');

-- Step 10: Patient Education
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 20, 'Home Care Instructions', 'Education for patients and families', '[
  {"item": "Complete full course of antimalarial medication"},
  {"item": "Recognize severe malaria warning signs: confusion, severe headache, difficulty breathing"},
  {"item": "Maintain hydration with oral fluids"},
  {"item": "Use bed nets to prevent transmission to others"},
  {"item": "Follow-up blood smear as scheduled"},
  {"item": "Report any recurrence of fever or symptoms"},
  {"item": "Practice personal protection against mosquito bites"},
  {"item": "Inform recent travel companions if diagnosed"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(3, 21, 'Medication Guidelines', 'Complete drug therapy recommendations', '[
  {"item": "Artemether-Lumefantrine: 4 doses over 3 days, weight-based dosing"},
  {"item": "IV Artesunate: 2.4 mg/kg at 0, 12, 24 hours, then daily"},
  {"item": "Chloroquine: 25 mg/kg total over 3 days (P. vivax)"},
  {"item": "Primaquine: 0.25 mg/kg daily for 14 days (P. vivax radical cure)"},
  {"item": "Quinine: 20 mg/kg loading then 10 mg/kg q8h (severe malaria)"},
  {"item": "Paracetamol: 500-1000 mg every 6 hours for fever"},
  {"item": "Avoid aspirin and NSAIDs due to bleeding risk"}
]', 'moderate');

COMMIT;
