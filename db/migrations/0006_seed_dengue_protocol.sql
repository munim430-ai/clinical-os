-- DGHS Dengue 2025 Protocol with comprehensive steps
BEGIN TRANSACTION;

-- Insert the main protocol
INSERT OR IGNORE INTO protocols (condition_id, title, source, version, year) VALUES
('dengue', 'DGHS National Guidelines for Management of Dengue 2025', 'Directorate General of Health Services, Bangladesh', '2025', 2025);

-- Get the protocol ID for Dengue
-- Note: In actual implementation, we'd get this from the previous insert
-- For now, we'll use a fixed ID assuming it's 1 (adjust if needed)

-- Step 1: Initial Assessment and Diagnosis
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 1, 'Initial Assessment', 'Complete clinical evaluation and laboratory confirmation of suspected dengue cases', '[
  {"item": "Take detailed history including fever onset, warning signs, bleeding manifestations"},
  {"item": "Perform complete physical examination with vital signs"},
  {"item": "Check for warning signs: severe abdominal pain, persistent vomiting, clinical fluid accumulation"},
  {"item": "Assess hydration status and hemodynamic stability"},
  {"item": "Order baseline investigations: CBC, liver function tests, coagulation profile"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 2, 'Laboratory Diagnosis', 'Confirm dengue infection through appropriate laboratory tests', '[
  {"item": "NS1 antigen test - positive from day 1-5 of fever"},
  {"item": "IgM ELISA - positive from day 5-7 of fever"},
  {"item": "IgG ELISA - indicates past infection or secondary dengue"},
  {"item": "RT-PCR - gold standard, expensive, limited availability"},
  {"item": "Repeat CBC daily for 3-5 days to monitor platelet count and hematocrit"}
]', 'moderate');

-- Step 2: Disease Classification
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 3, 'Disease Classification', 'Classify dengue according to WHO 2009 classification', '[
  {"item": "Dengue without warning signs: fever plus 2 of: nausea/vomiting, rash, aches/pains, leukopenia, positive tourniquet test"},
  {"item": "Dengue with warning signs: fever plus any warning sign plus thrombocytopenia (<100,000) and rising hematocrit"},
  {"item": "Severe dengue: any of: severe plasma leakage, severe bleeding, severe organ impairment"},
  {"item": "Monitor for progression from one category to next"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 4, 'Warning Signs Assessment', 'Identify patients at high risk for complications', '[
  {"item": "Abdominal pain or tenderness"},
  {"item": "Persistent vomiting (≥3 times in 24 hours)"},
  {"item": "Clinical fluid accumulation (ascites, pleural effusion)"},
  {"item": "Mucosal bleed (gum bleed, nose bleed)"},
  {"item": "Lethargy or restlessness"},
  {"item": "Liver enlargement >2 cm"},
  {"item": "Rapid increase in hematocrit with rapid decrease in platelet count"}
]', 'high');

-- Step 3: Management of Dengue without Warning Signs
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 5, 'Outpatient Management', 'Home care for mild cases without warning signs', '[
  {"item": "Ensure adequate oral fluid intake: 2-3 liters/day or 75 mL/kg/day for children"},
  {"item": "Paracetamol for fever: 10-15 mg/kg/dose every 6 hours (max 4 doses/day)"},
  {"item": "Avoid NSAIDs (ibuprofen, aspirin) due to bleeding risk"},
  {"item": "Monitor temperature twice daily"},
  {"item": "Watch for warning signs - return immediately if any develop"},
  {"item": "Daily CBC until platelet count shows rising trend"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 6, 'Discharge Criteria', 'When patients can be safely discharged', '[
  {"item": "Afebrile for 48 hours without antipyretics"},
  {"item": "Platelet count >50,000 cells/mm³ with rising trend"},
  {"item": "No warning signs present"},
  {"item": "Adequate oral intake maintained"},
  {"item": "Hematocrit stable and decreasing"},
  {"item": "Patient able to follow up if needed"}
]', 'low');

-- Step 4: Management of Dengue with Warning Signs
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 7, 'Hospital Admission', 'Admit patients with warning signs for close monitoring', '[
  {"item": "Admit to hospital or dengue ward"},
  {"item": "Vital signs monitoring every 2-4 hours"},
  {"item": "Strict input-output monitoring"},
  {"item": "Daily CBC with hematocrit and platelet count"},
  {"item": "Liver function tests and coagulation profile"},
  {"item": "Maintain intravenous access"}
]', 'high');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 8, 'Fluid Management', 'Careful fluid replacement to prevent shock', '[
  {"item": "Start IV fluids: Dextrose saline or Ringer lactate"},
  {"item": "Calculate maintenance fluid: 1500-2000 mL/m²/day or 2-3 mL/kg/hour"},
  {"item": "Add deficit: 5-7% body weight loss"},
  {"item": "Monitor for signs of fluid overload: pulmonary edema, ascites"},
  {"item": "Adjust fluids based on hematocrit trends and urine output"},
  {"item": "Target urine output: 0.5-1 mL/kg/hour"}
]', 'high');

-- Step 5: Management of Severe Dengue
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 9, 'Dengue Shock Management', 'Emergency management of dengue shock syndrome', '[
  {"item": "Immediate IV access - two large-bore cannulas"},
  {"item": "Rapid fluid bolus: 20 mL/kg over 20 minutes"},
  {"item": "Reassess after each bolus - repeat if still in shock"},
  {"item": "Maximum 3 boluses before considering vasopressors"},
  {"item": "Monitor vital signs, capillary refill, urine output"},
  {"item": "Transfer to ICU if available"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 10, 'Severe Bleeding Management', 'Management of life-threatening bleeding', '[
  {"item": "Transfuse packed red blood cells: 10 mL/kg"},
  {"item": "Transfuse platelets: 1 unit/10 kg if platelets <20,000"},
  {"item": "Transfuse fresh frozen plasma: 10-15 mL/kg"},
  {"item": "Transfuse cryoprecipitate if fibrinogen low"},
  {"item": "Consider tranexamic acid: 10 mg/kg IV over 15 minutes"},
  {"item": "Monitor for transfusion reactions"}
]', 'critical');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 11, 'Organ Impairment Management', 'Management of severe organ involvement', '[
  {"item": "Hepatic impairment: monitor LFTs, avoid hepatotoxic drugs"},
  {"item": "Renal impairment: monitor creatinine, adjust fluids"},
  {"item": "Myocarditis: cardiac monitoring, avoid fluid overload"},
  {"item": "Encephalitis: neurological monitoring, supportive care"},
  {"item": "Consider specialist consultation for organ-specific management"}
]', 'critical');

-- Step 6: Specific Complications
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 12, 'Fluid Overload Management', 'Management of iatrogenic fluid overload', '[
  {"item": "Stop IV fluids immediately"},
  {"item": "Diuretics: Furosemide 1 mg/kg IV/IM"},
  {"item": "Consider albumin if severe hypoalbuminemia"},
  {"item": "Oxygen therapy if pulmonary edema"},
  {"item": "Consider hemodialysis if refractory"},
  {"item": "Monitor electrolytes and renal function"}
]', 'high');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 13, 'Hemorrhagic Complications', 'Management of various bleeding manifestations', '[
  {"item": "Epistaxis: nasal packing, local pressure"},
  {"item": "Gum bleeding: local pressure, ice packs"},
  {"item": "GI bleeding: PPI, monitor hemoglobin"},
  {"item": "Menorrhagia: tranexamic acid, hormonal therapy"},
  {"item": "Intracranial hemorrhage: neurosurgical consultation"}
]', 'high');

-- Step 7: Monitoring Parameters
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 14, 'Vital Signs Monitoring', 'Regular assessment of hemodynamic status', '[
  {"item": "Blood pressure: every 2-4 hours (more frequent if unstable)"},
  {"item": "Heart rate: every 2-4 hours"},
  {"item": "Respiratory rate: every 2-4 hours"},
  {"item": "Temperature: every 4-6 hours"},
  {"item": "Capillary refill time: every 2 hours if in shock"},
  {"item": "Oxygen saturation: if respiratory symptoms"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 15, 'Laboratory Monitoring', 'Regular laboratory investigations', '[
  {"item": "CBC with hematocrit and platelets: daily until stable"},
  {"item": "Liver function tests: every 2-3 days"},
  {"item": "Coagulation profile: if bleeding or abnormal LFTs"},
  {"item": "Electrolytes and renal function: daily if on IV fluids"},
  {"item": "Blood glucose: if altered consciousness"},
  {"item": "Blood gas analysis: if respiratory distress"}
]', 'moderate');

-- Step 8: Discharge Planning
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 16, 'Recovery Phase', 'Management during recovery phase', '[
  {"item": "Continue oral fluids for 2-3 days after discharge"},
  {"item": "Avoid strenuous activity for 2 weeks"},
  {"item": "Paracetamol for residual fever/body aches"},
  {"item": "Monitor for post-dengue fatigue syndrome"},
  {"item": "Follow-up CBC after 1 week"},
  {"item": "Educate about warning signs for future infections"}
]', 'low');

-- Step 9: Special Populations
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 17, 'Pediatric Management', 'Specific considerations for children', '[
  {"item": "Higher risk of severe disease and shock"},
  {"item": "More aggressive fluid resuscitation needed"},
  {"item": "Weight-based dosing for all medications"},
  {"item": "Watch for febrile seizures"},
  {"item": "Pediatric ICU referral for severe cases"},
  {"item": "Parent education on warning signs in children"}
]', 'moderate');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 18, 'Pregnancy Management', 'Management of dengue in pregnant women', '[
  {"item": "Higher risk of severe disease and complications"},
  {"item": "Fetal monitoring throughout illness"},
  {"item": "Avoid medications harmful to fetus"},
  {"item": "Obstetric consultation for delivery planning"},
  {"item": "Monitor for vertical transmission risk"},
  {"item": "Postpartum monitoring for maternal complications"}
]', 'moderate');

-- Step 10: Prevention and Control
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 19, 'Vector Control', 'Prevention of dengue transmission', '[
  {"item": "Eliminate standing water around home"},
  {"item": "Use mosquito nets and repellents"},
  {"item": "Wear protective clothing during outbreak"},
  {"item": "Community awareness programs"},
  {"item": "Report to health authorities for outbreak control"},
  {"item": "Screening of blood donors during outbreaks"}
]', 'low');

INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 20, 'Patient Education', 'Key messages for patients and families', '[
  {"item": "Recognize warning signs requiring immediate medical attention"},
  {"item": "Maintain adequate hydration during fever"},
  {"item": "Use only paracetamol for fever"},
  {"item": "Complete follow-up appointments"},
  {"item": "Protect family members from mosquito bites"},
  {"item": "Seek early medical care for future febrile illnesses"}
]', 'low');

-- Drug recommendations for Dengue
INSERT OR IGNORE INTO protocol_steps (protocol_id, step_number, heading, body, sub_steps_json, severity) VALUES
(1, 21, 'Recommended Medications', 'Drug therapy for dengue management', '[
  {"item": "Paracetamol: 10-15 mg/kg/dose every 6 hours (max 4g/day)"},
  {"item": "IV Fluids: Dextrose saline or Ringer lactate"},
  {"item": "Tranexamic acid: 10 mg/kg IV for severe bleeding"},
  {"item": "Furosemide: 1 mg/kg for fluid overload"},
  {"item": "Ondansetron: 0.15 mg/kg IV for persistent vomiting"},
  {"item": "Avoid: NSAIDs, aspirin, corticosteroids"}
]', 'moderate');

COMMIT;
