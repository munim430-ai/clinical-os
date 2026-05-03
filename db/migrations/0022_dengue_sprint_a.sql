-- Sprint A: Dengue Gold-Standard + Sprint B: Condition-specific lab cards
-- Adds: condition_id to lab_references, Dengue lab cards, protocol 6 steps,
--       expanded Rx (NS/RL for DSS, platelet transfusion), post-dengue OSCE cards

-- ─── Sprint B: Add condition_id to lab_references ────────────────────────────
ALTER TABLE lab_references ADD COLUMN condition_id TEXT REFERENCES conditions(id);

-- ─── Sprint A: Dengue-specific lab interpretation cards ──────────────────────
INSERT INTO lab_references (id, name, unit, normal_min, normal_max, critical_low, critical_high, notes, condition_id) VALUES
(135, 'Platelet Count (Dengue)',         '×10⁹/L', 150,  400,  20,   50,
  'DGHS 2022: <100 = monitor closely; <50 = high-risk bleed; <20 = consider platelet transfusion only if active bleeding. Nadir usually day 5–7.', 'dengue'),
(136, 'Haematocrit / PCV (Dengue)',      '%',       37,   47,   NULL, NULL,
  'Rise ≥20% above baseline = plasma leakage (hallmark of DHF). Serial HCT every 4–6 h in Group B. Fall after peak = recovery or hidden bleed.', 'dengue'),
(137, 'NS1 Antigen',                     NULL,      NULL, NULL, NULL, NULL,
  'Positive days 1–5 of fever. High sensitivity in early dengue. Can be negative in secondary infection. Negative NS1 does not exclude dengue.', 'dengue'),
(138, 'Dengue IgM / IgG',               NULL,      NULL, NULL, NULL, NULL,
  'IgM appears day 4–5, peaks week 2. IgG rises earlier in secondary infection. IgM+/IgG- = primary; IgM+/IgG+ = secondary (higher DHF risk).', 'dengue'),
(139, 'Serum Albumin (Dengue)',          'g/dL',    3.5,  5.0,  2.5,  NULL,
  '<3.5 = plasma leakage / capillary leak syndrome. Low albumin with rising HCT strongly predicts DSS progression.', 'dengue'),
(140, 'ALT / SGPT (Dengue)',             'U/L',     7,    56,   NULL, NULL,
  '>10× ULN = dengue hepatitis / severe organ impairment (Group C). Mild elevation (2–5×) common in uncomplicated dengue.', 'dengue'),
(141, 'Urine Output',                    'mL/kg/hr',0.5, 1.0,  0.5,  NULL,
  'Target ≥0.5 mL/kg/hr during IV fluid therapy. Oliguria despite fluids = fluid overload or AKI — reassess immediately.', 'dengue'),
(142, 'Tourniquet Test',                 NULL,      NULL, NULL, NULL, NULL,
  'Inflate BP cuff to midpoint between SBP and DBP for 5 min. ≥20 petechiae per 2.5 cm² = POSITIVE. Indicates capillary fragility.', 'dengue');

-- ─── Sprint A: Protocol 6 — DGHS 2025 content (discharge, follow-up, referral) ─
INSERT INTO protocol_steps (id, protocol_id, step_number, heading, body, sub_steps_json, table_json, severity) VALUES
(358, 6, 1, 'Discharge Criteria',
  'All of the following must be met before discharge (DGHS 2025):',
  '["No fever for at least 48 hours (without antipyretic)","Clinical improvement — no respiratory distress, no abdominal pain","Platelet count ≥50 ×10⁹/L AND trending upward on two consecutive readings","Stable haematocrit (not rising)","Adequate urine output and tolerating oral fluids","No warning signs present for 24+ hours"]',
  NULL, 'low'),

(359, 6, 2, 'Post-Discharge Follow-Up',
  'Schedule follow-up at 24–48 hours after discharge:',
  '["Repeat FBC (CBC) at day-1 post-discharge","Advise to return immediately if: fever recurs, bleeding, severe abdominal pain, vomiting, or drowsiness","Rest for full 7 days post-illness","Maintain high oral fluid intake","Monitor for post-dengue fatigue syndrome (weeks)","Avoid aspirin and NSAIDs for at least 2 weeks"]',
  NULL, 'low'),

(360, 6, 3, 'Referral Criteria to Tertiary Centre',
  'Refer immediately to a higher-level facility if ANY of the following:',
  '["DSS (dengue shock syndrome) — cold extremities, pulse pressure <20 mmHg, MAP falling","Active severe haemorrhage unresponsive to 1 unit platelet transfusion","ALT >10× ULN or acute liver failure signs (jaundice, encephalopathy)","AKI — urine output <0.5 mL/kg/hr despite adequate fluid","Severe CNS involvement — seizures, altered consciousness, focal deficit","Fluid overload unresponsive to furosemide","Pregnancy with any warning sign","Comorbidity decompensation (DM, CKD, cardiac failure)"]',
  NULL, 'critical'),

(361, 6, 4, 'Investigations at Presentation',
  'Order at first contact for all suspected dengue:',
  '["NS1 Antigen — day 1–5 of fever (high sensitivity early disease)","FBC (CBC) — baseline platelet and haematocrit; repeat every 12–24 h","Dengue IgM/IgG serology — if >day 5 or NS1 negative","Blood glucose — hypoglycaemia risk in paediatric dengue","LFT (ALT/AST) — screen for dengue hepatitis","Urine output monitoring from day 3 — document every 4–6 h"]',
  '{"title":"Repeat FBC Frequency by Group","headers":["Group","FBC Frequency"],"rows":[["A (Home)","Day 3, 5, 7 or if any warning sign"],["B (Admitted)","Every 12 hours during critical phase"],["C (Severe)","Every 4–6 hours or as clinically needed"]]}',
  'moderate'),

(362, 6, 5, 'Platelet Transfusion Guidelines',
  'Platelet transfusion is indicated ONLY in specific circumstances (DGHS 2025):',
  '["Platelet <20 ×10⁹/L WITH active clinically significant bleeding","Do NOT transfuse prophylactically for low platelet count alone","One adult dose = 4–6 units random donor OR 1 single-donor apheresis unit","Expected platelet rise: 30–50 ×10⁹/L per unit (less in consumption states)","Repeat FBC 1 hour post-transfusion to assess increment","If increment poor: consider DIC, immune consumption, or incorrect storage"]',
  NULL, 'high'),

(363, 6, 6, 'Vector Control Counselling',
  'Give to every dengue patient and household contact:',
  '["Aedes aegypti breeds in CLEAN stagnant water — not dirty water","Common breeding sites: flower pots, tyres, uncovered water tanks, coolers, birdbaths","Eliminate breeding: tip, toss, cover, clean weekly","Use insect repellent (DEET ≥20%) during day — Aedes bites at dawn and dusk","Long-sleeved clothing during febrile illness to prevent transmission","Screen windows and use bed nets if air-conditioning unavailable","Report clusters of dengue to upazila health office"]',
  NULL, 'low');

-- ─── Sprint A: Additional Dengue Rx entries ──────────────────────────────────
INSERT INTO rx_entries (id, condition_id, drug_name, drug_class, indication, dosage, frequency, route, duration, notes, priority, source) VALUES
(444, 'dengue', 'Normal Saline (0.9% NaCl)',
  'IV Crystalloid',
  'Initial fluid resuscitation in DSS (dengue shock)',
  '5–10 mL/kg over 1 hour (bolus); titrate to clinical response',
  'Bolus then continuous',
  'IV',
  'Until haemodynamic stability (usually 24–48 h)',
  'First choice in DSS. Reassess every 30 min. If no improvement after 2 boluses → consider colloid. Monitor for fluid overload: crackles, hepatomegaly, rising HCT despite fluids.',
  1, 'DGHS 2025'),

(445, 'dengue', 'Ringer''s Lactate (RL)',
  'IV Crystalloid (balanced)',
  'Alternative to NS in DSS; preferred in prolonged resuscitation',
  '5–10 mL/kg over 1 hour; reduce to 3–5 mL/kg/hr once stable',
  'Bolus then continuous',
  'IV',
  '24–72 hours',
  'Preferred over NS for prolonged fluid therapy — less hyperchloraemic acidosis risk. Avoid in liver failure (lactate metabolism impaired).',
  1, 'DGHS 2025'),

(446, 'dengue', 'Platelet Concentrate',
  'Blood product',
  'Active significant bleeding with platelet <20 ×10⁹/L',
  '4–6 units random donor OR 1 single-donor apheresis unit (adult)',
  'Single infusion; repeat only if bleeding persists',
  'IV transfusion',
  'As indicated — do not give prophylactically',
  'Do NOT transfuse for low platelet alone without active bleeding. Check 1-h post-transfusion increment. Report to blood bank if increment <10 ×10⁹/L (suggests consumption or DIC).',
  2, 'DGHS 2025'),

(447, 'dengue', 'Furosemide',
  'Loop diuretic',
  'Fluid overload with pulmonary oedema in recovery phase',
  '0.1–0.5 mg/kg (adult 20–40 mg)',
  'Once or twice daily',
  'IV or Oral',
  'Until fluid balance negative',
  'Use ONLY in recovery phase when HCT falling and patient haemodynamically stable. Do NOT give during leakage phase — worsens hypovolaemia. Monitor electrolytes.',
  2, 'DGHS 2025');
