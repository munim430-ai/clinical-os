-- Seed data for the prescription builder quick-picks
INSERT INTO chief_complaints (text, category, sort_order) VALUES
('Fever', 'general', 1), ('Headache', 'general', 2),
('Sore throat', 'resp', 3), ('Cough', 'resp', 4),
('Chest pain', 'cardio', 5), ('Shortness of breath', 'resp', 6),
('Abdominal pain', 'gi', 7), ('Diarrhea', 'gi', 8),
('Nausea', 'gi', 9), ('Vomiting', 'gi', 10),
('Dizziness', 'neuro', 11), ('Back pain', 'general', 12),
('Joint pain', 'general', 13), ('Weakness', 'general', 14),
('Burning urination', 'gu', 15), ('Skin rash', 'derm', 16),
('Itching', 'derm', 17), ('Constipation', 'gi', 18),
('Heartburn', 'gi', 19), ('Leg swelling', 'cardio', 20);
--> statement-breakpoint
INSERT INTO diagnosis_quick_picks (label, icd10_code, category, sort_order) VALUES
('Acute Pharyngitis', 'J02', 'resp', 1),
('Common Cold', 'J00', 'resp', 2),
('Migraine', 'G43.0', 'neuro', 3),
('Hypertension', 'I10', 'cardio', 4),
('DM Type 2', 'E11.9', 'endo', 5),
('GERD', 'K21.9', 'gi', 6),
('Viral Fever', 'A94', 'infect', 7),
('UTI', 'N39.0', 'gu', 8),
('Acute Bronchitis', 'J20.9', 'resp', 9),
('Gastritis', 'K29.7', 'gi', 10),
('Anxiety Disorder', 'F41.1', 'psych', 11),
('Iron Def. Anemia', 'D50.9', 'hem', 12),
('Asthma', 'J45.9', 'resp', 13),
('Hypothyroidism', 'E03.9', 'endo', 14),
('Peptic Ulcer', 'K27.9', 'gi', 15);
--> statement-breakpoint
INSERT INTO advice_quick_picks (text, category, sort_order) VALUES
('Rest and plenty of warm fluids', 'general', 1),
('Low-salt diet', 'diet', 2),
('Brisk walk 30 min daily', 'lifestyle', 3),
('Avoid oily and spicy food', 'diet', 4),
('Drink plenty of water', 'diet', 5),
('Take medicines on time', 'general', 6),
('Complete the full course of antibiotics', 'general', 7),
('Avoid self-medication', 'general', 8),
('Monitor blood pressure regularly', 'general', 9),
('Check blood sugar regularly', 'general', 10),
('Come back if symptoms worsen', 'general', 11),
('Maintain personal hygiene', 'general', 12),
('Use ORS for diarrhea', 'general', 13),
('Avoid cold drinks', 'diet', 14);
--> statement-breakpoint
INSERT INTO doctor_profile (id, name, qualifications, specialty, letterhead_template)
VALUES (1, '', '', '', 'default');
