-- DGHS Typhoid Fever Protocol with comprehensive steps
BEGIN TRANSACTION;

-- Insert the main protocol for Typhoid
INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('typhoid', 'DGHS National Guidelines for Management of Typhoid Fever 2025', 'Directorate General of Health Services, Bangladesh', '2025', 2025);

-- Get the protocol ID for Typhoid (assuming it's 2 after Dengue)

-- Step 1: Initial Assessment and Diagnosis
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 1, 'Initial Assessment', 'Complete clinical evaluation for suspected typhoid fever', '[
  {"item": "Take detailed history: fever pattern, abdominal symptoms, recent travel, food exposure"},
  {"item": "Perform complete physical examination with vital signs"},
  {"item": "Check for characteristic findings: relative bradycardia, rose spots, splenomegaly"},
  {"item": "Assess for complications: GI bleeding, intestinal perforation, encephalopathy"},
  {"item": "Order baseline investigations: CBC, LFT, blood cultures"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 2, 'Laboratory Diagnosis', 'Confirm typhoid infection through appropriate tests', '[
  {"item": "Blood culture: gold standard, positive in 60-80% of cases"},
  {"item": "Widal test: single high titer or four-fold rise in paired samples"},
  {"item": "Typhidot/IgM rapid test: quick results, useful in resource-limited settings"},
  {"item": "Stool culture: useful for carrier detection and convalescent patients"},
  {"item": "Bone marrow culture: higher sensitivity, used in difficult cases"},
  {"item": "CBC: leukopenia with neutropenia, thrombocytopenia"}
]', 'moderate');

-- Step 2: Disease Classification
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 3, 'Disease Classification', 'Classify typhoid fever severity', '[
  {"item": "Uncomplicated typhoid: fever, abdominal symptoms without organ involvement"},
  {"item": "Complicated typhoid: intestinal perforation, severe bleeding, encephalopathy, myocarditis"},
  {"item": "Carrier state: asymptomatic shedding > 12 weeks after acute illness"},
  {"item": "Relapse: recurrence of symptoms after initial recovery"},
  {"item": "Treatment failure: persistent fever > 7 days on appropriate therapy"}
]', 'moderate');

-- Step 3: Uncomplicated Typhoid Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 4, 'First-line Antibiotic Therapy', 'Initial antibiotic selection for uncomplicated cases', '[
  {"item": "Ceftriaxone: 2-4 g IV once daily for 7-14 days (adults)"},
  {"item": "Cefixime: 400 mg orally twice daily for 14 days (outpatient)"},
  {"item": "Azithromycin: 1 g orally once daily for 5-7 days (resistant strains)"},
  {"item": "Ciprofloxacin: 500-750 mg orally twice daily for 10-14 days (if susceptible)"},
  {"item": "Consider local resistance patterns before selection"},
  {"item": "Switch to oral therapy once afebrile for 48 hours"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 5, 'Supportive Care', 'Non-antibiotic management measures', '[
  {"item": "Antipyretics: paracetamol 500-1000 mg every 6 hours for fever"},
  {"item": "IV fluids: maintain hydration, correct electrolyte abnormalities"},
  {"item": "Nutrition: soft, easily digestible diet, avoid irritants"},
  {"item": "Bed rest during febrile phase"},
  {"item": "Monitor vital signs every 4-6 hours"},
  {"item": "Daily temperature chart to track response"}
]', 'low');

-- Step 4: Complicated Typhoid Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 6, 'Intestinal Perforation Management', 'Emergency management of intestinal perforation', '[
  {"item": "Immediate surgical consultation"},
  {"item": "Broad-spectrum antibiotics: ceftriaxone + metronidazole"},
  {"item": "IV fluids: aggressive resuscitation"},
  {"item": "NPO status, nasogastric tube placement"},
  {"item": "Hemodynamic monitoring"},
  {"item": "Surgical intervention: primary repair or resection"},
  {"item": "Post-operative ICU care if available"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 7, 'Severe Bleeding Management', 'Management of gastrointestinal hemorrhage', '[
  {"item": "IV fluids: aggressive volume replacement"},
  {"item": "Blood transfusion: packed RBCs 2-4 units initially"},
  {"item": "PPI infusion: omeprazole 80 mg bolus then 8 mg/hour"},
  {"item": "Endoscopy for localization and treatment"},
  {"item": "Surgical intervention if bleeding uncontrolled"},
  {"item": "Coagulation profile monitoring"},
  {"item": "Hemoglobin monitoring every 6 hours"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 8, 'Encephalopathy Management', 'Management of typhoid encephalopathy', '[
  {"item": "High-dose ceftriaxone: 4 g IV daily"},
  {"item": "Dexamethasone: 3 mg/kg loading then 1 mg/kg q6h for 48 hours"},
  {"item": "Airway protection if consciousness impaired"},
  {"item": "Seizure prophylaxis: phenytoin loading if indicated"},
  {"item": "ICU monitoring of neurological status"},
  {"item": "Manage intracranial hypertension if present"},
  {"item": "Consider alternative diagnoses"}
]', 'critical');

-- Step 5: Special Considerations
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 9, 'Drug-Resistant Typhoid', 'Management of resistant Salmonella Typhi', '[
  {"item": "XDR typhoid: azithromycin + carbapenem (meropenem)"},
  {"item": "MDR typhoid: ceftriaxone or azithromycin"},
  {"item": "Fluoroquinolone-resistant: avoid ciprofloxacin"},
  {"item": "Consider combination therapy for severe cases"},
  {"item": "Consult infectious disease specialist"},
  {"item": "Monitor for treatment response closely"},
  {"item": "Longer treatment duration (14-21 days) for resistant strains"}
]', 'high');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 10, 'Pediatric Management', 'Specific considerations for children', '[
  {"item": "Ceftriaxone: 75-100 mg/kg/day IV divided q12h (max 4 g/day)"},
  {"item": "Cefixime: 8 mg/kg/day orally divided q12h (max 400 mg/dose)"},
  {"item": "Azithromycin: 20 mg/kg/day orally once daily (max 1 g/day)"},
  {"item": "Higher risk of complications and mortality"},
  {"item": "Monitor for dehydration closely"},
  {"item": "Nutritional support crucial for recovery"},
  {"item": "Vaccination for prevention in endemic areas"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 11, 'Pregnancy Management', 'Management of typhoid in pregnant women', '[
  {"item": "Ceftriaxone: 2 g IV daily (safe in pregnancy)"},
  {"item": "Azithromycin: 1 g orally daily (category B)"},
  {"item": "Avoid fluoroquinolones (category C)"},
  {"item": "Higher risk of complications and miscarriage"},
  {"item": "Fetal monitoring throughout illness"},
  {"item": "Obstetric consultation for delivery planning"},
  {"item": "Postpartum monitoring for maternal complications"}
]', 'moderate');

-- Step 6: Monitoring and Follow-up
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 12, 'Treatment Response Monitoring', 'Assess response to antibiotic therapy', '[
  {"item": "Temperature chart: should defervesce within 3-5 days"},
  {"item": "Daily clinical assessment"},
  {"item": "CBC: monitor for improvement in leukopenia"},
  {"item": "LFT: monitor for hepatic involvement"},
  {"item": "Renal function: especially if on IV antibiotics"},
  {"item": "Consider treatment failure if fever > 7 days"},
  {"item": "Repeat cultures if clinically indicated"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 13, 'Discharge Planning', 'Criteria for safe discharge', '[
  {"item": "Afebrile for 48 hours without antipyretics"},
  {"item": "Clinically stable vital signs"},
  {"item": "Able to tolerate oral intake"},
  {"item": "No evidence of complications"},
  {"item": "Completed minimum antibiotic course"},
  {"item": "Patient education on warning signs"},
  {"item": "Follow-up appointment scheduled"}
]', 'low');

-- Step 7: Complication Prevention
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 14, 'Bleeding Prevention', 'Measures to prevent gastrointestinal bleeding', '[
  {"item": "Avoid NSAIDs and aspirin completely"},
  {"item": "Use paracetamol only for fever control"},
  {"item": "Soft diet to avoid GI irritation"},
  {"item": "Monitor platelet count daily"},
  {"item": "PPI prophylaxis in high-risk patients"},
  {"item": "Early recognition of bleeding signs"},
  {"item": "Avoid constipation and straining"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 15, 'Perforation Prevention', 'Measures to prevent intestinal perforation', '[
  {"item": "Early antibiotic therapy to reduce bacterial load"},
  {"item": "Avoid corticosteroids unless encephalopathy"},
  {"item": "Monitor for abdominal pain progression"},
  {"item": "Early surgical consultation if peritonitis suspected"},
  {"item": "Nutritional support to maintain gut integrity"},
  {"item": "Avoid prolonged fever without treatment"},
  {"item": "Patient education on warning abdominal symptoms"}
]', 'moderate');

-- Step 8: Carrier Management
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 16, 'Chronic Carrier Detection', 'Identification and management of carriers', '[
  {"item": "Screening: stool cultures 3 samples 48 hours apart"},
  {"item": "High-risk groups: food handlers, healthcare workers"},
  {"item": "Gallbladder ultrasound to detect stones"},
  {"item": "Treatment: ciprofloxacin 750 mg twice daily for 4 weeks"},
  {"item": "Alternative: azithromycin 1 g daily for 4 weeks"},
  {"item": "Consider cholecystectomy for gallbladder carriers"},
  {"item": "Follow-up cultures to confirm clearance"}
]', 'moderate');

-- Step 9: Prevention and Control
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 17, 'Vaccination', 'Typhoid fever prevention strategies', '[
  {"item": "Vi polysaccharide vaccine: single dose, 2 years protection"},
  {"item": "Ty21a oral vaccine: 4 doses on alternate days, 5 years protection"},
  {"item": "TCV (Typhoid Conjugate Vaccine): single dose, long-term protection"},
  {"item": "Recommended for: travelers, endemic areas, outbreak control"},
  {"item": "Contraindications: immunocompromised, pregnancy (live vaccines)"},
  {"item": "Revaccination according to vaccine type"},
  {"item": "Combine with other preventive measures"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 18, 'Public Health Measures', 'Community-level prevention strategies', '[
  {"item": "Safe water supply and sanitation improvement"},
  {"item": "Food safety regulations and enforcement"},
  {"item": "Health education on food hygiene"},
  {"item": "Screening of food handlers and carriers"},
  {"item": "Outbreak investigation and control"},
  {"item": "Surveillance of antimicrobial resistance"},
  {"item": "School vaccination programs in endemic areas"}
]', 'low');

-- Step 10: Patient Education
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 19, 'Home Care Instructions', 'Education for patients and families', '[
  {"item": "Complete full course of antibiotics"},
  {"item": "Recognize warning signs: severe abdominal pain, bleeding, confusion"},
  {"item": "Maintain hydration with oral fluids"},
  {"item": "Soft, nutritious diet during recovery"},
  {"item": "Hand hygiene to prevent transmission"},
  {"item": "Avoid food preparation for others until cleared"},
  {"item": "Follow-up appointments for monitoring"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(2, 20, 'Medication Guidelines', 'Complete drug therapy recommendations', '[
  {"item": "Ceftriaxone: 2-4 g IV daily (adults), 75-100 mg/kg/day (children)"},
  {"item": "Cefixime: 400 mg orally twice daily (adults), 8 mg/kg/day (children)"},
  {"item": "Azithromycin: 1 g orally daily (adults), 20 mg/kg/day (children)"},
  {"item": "Ciprofloxacin: 500-750 mg orally twice daily (if susceptible)"},
  {"item": "Paracetamol: 500-1000 mg every 6 hours for fever"},
  {"item": "Omeprazole: 20-40 mg orally daily for GI protection"},
  {"item": "Avoid: NSAIDs, aspirin, steroids (unless encephalopathy)"}
]', 'moderate');

COMMIT;
