-- Prescribly upgrade: patient registry, prescriptions, quick-picks, queue,
-- doctor profile, vitals log, backup/version registry, wallet settlement fields.
CREATE TABLE `patients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`age_years` integer,
	`age_months` integer,
	`gender` text,
	`blood_group` text,
	`height_cm` real,
	`weight_kg` real,
	`drug_allergies` text,
	`chronic_conditions` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rx_number` text NOT NULL,
	`patient_id` integer REFERENCES `patients`(`id`),
	`patient_name` text NOT NULL,
	`patient_age` text,
	`patient_gender` text,
	`patient_phone` text,
	`clinic_id` integer REFERENCES `clinics`(`id`),
	`chief_complaints` text,
	`on_examination` text,
	`investigations` text,
	`diagnoses` text,
	`medicines_json` text,
	`advice` text,
	`follow_up_date` text,
	`visit_fee` integer DEFAULT 0,
	`bp` text,
	`pulse` integer,
	`temperature` real,
	`spo2` real,
	`weight_kg` real,
	`qr_token` text,
	`pdf_path` text,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prescriptions_rx_number_unique` ON `prescriptions` (`rx_number`);
--> statement-breakpoint
CREATE UNIQUE INDEX `prescriptions_qr_token_unique` ON `prescriptions` (`qr_token`);
--> statement-breakpoint
CREATE TABLE `chief_complaints` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`category` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `diagnosis_quick_picks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`icd10_code` text,
	`category` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `advice_quick_picks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`category` text,
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clinic_id` integer NOT NULL REFERENCES `clinics`(`id`),
	`patient_id` integer REFERENCES `patients`(`id`),
	`patient_name` text NOT NULL,
	`patient_phone` text,
	`serial_number` integer NOT NULL,
	`date` text NOT NULL,
	`time_slot` text,
	`status` text DEFAULT 'waiting',
	`prescription_id` integer REFERENCES `prescriptions`(`id`),
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `doctor_profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`name` text,
	`qualifications` text,
	`specialty` text,
	`bmdc_reg` text,
	`bmdc_verified` integer DEFAULT false,
	`phone` text,
	`email` text,
	`chamber_line1` text,
	`chamber_line2` text,
	`signature_image_uri` text,
	`logo_image_uri` text,
	`letterhead_template` text DEFAULT 'default',
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `vitals_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` integer NOT NULL REFERENCES `patients`(`id`),
	`prescription_id` integer REFERENCES `prescriptions`(`id`),
	`bp` text,
	`pulse` integer,
	`temperature` real,
	`spo2` real,
	`weight_kg` real,
	`height_cm` real,
	`recorded_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `data_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`version` text NOT NULL,
	`type` text NOT NULL,
	`entity` text NOT NULL,
	`record_count` integer,
	`file_size_bytes` integer,
	`file_path` text,
	`checksum` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`notes` text
);
--> statement-breakpoint
ALTER TABLE `clinics` ADD `fee_model` text DEFAULT 'FULL';
--> statement-breakpoint
ALTER TABLE `clinics` ADD `split_percent` real;
--> statement-breakpoint
ALTER TABLE `clinics` ADD `monthly_rent` integer;
--> statement-breakpoint
ALTER TABLE `clinics` ADD `next_serial` integer DEFAULT 1;
--> statement-breakpoint
ALTER TABLE `visit_logs` ADD `prescription_id` integer REFERENCES `prescriptions`(`id`);
