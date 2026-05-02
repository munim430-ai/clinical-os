CREATE TABLE `case_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disease_type` text NOT NULL,
	`district` text,
	`logged_at` text DEFAULT (CURRENT_TIMESTAMP),
	`synced` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `conditions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`system_id` text,
	`overview` text,
	`icd10_code` text,
	`slug` text,
	FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cxr_findings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`condition_id` text
);
--> statement-breakpoint
CREATE TABLE `dosage_forms` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text
);
--> statement-breakpoint
CREATE TABLE `drug_classes` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text
);
--> statement-breakpoint
CREATE TABLE `ecg_patterns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`key_features_json` text,
	`condition_id` text,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `er_drugs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`indication` text,
	`dose_per_kg` real,
	`max_dose_mg` real,
	`route` text,
	`concentration_mg_per_ml` real,
	`dilution_notes` text,
	`warning_note` text,
	`is_paediatric_safe` integer DEFAULT true,
	`order_index` integer
);
--> statement-breakpoint
CREATE TABLE `exam_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`condition_id` text,
	`category` text NOT NULL,
	`text` text NOT NULL,
	`order_index` integer,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generic_indications` (
	`generic_id` integer NOT NULL,
	`indication_id` integer NOT NULL,
	FOREIGN KEY (`generic_id`) REFERENCES `generics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`indication_id`) REFERENCES `indications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generics` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text,
	`drug_class_id` integer,
	`monograph_link` text,
	`indication_text` text,
	`pharmacology` text,
	`dosage_description` text,
	`administration_description` text,
	`side_effects` text,
	`contraindications` text,
	`interactions` text,
	`pregnancy_notes` text,
	`pediatric_usage` text,
	`overdose_effects` text,
	`storage_conditions` text,
	`precautions` text,
	FOREIGN KEY (`drug_class_id`) REFERENCES `drug_classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `indications` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text
);
--> statement-breakpoint
CREATE TABLE `lab_references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`unit` text,
	`normal_min` real,
	`normal_max` real,
	`critical_low` real,
	`critical_high` real,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `manufacturers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text
);
--> statement-breakpoint
CREATE TABLE `medicines` (
	`id` integer PRIMARY KEY NOT NULL,
	`brand_name` text NOT NULL,
	`slug` text,
	`type` text,
	`dosage_form_id` integer,
	`generic_id` integer,
	`strength` text,
	`manufacturer_id` integer,
	`package_container` text,
	`package_size` text,
	FOREIGN KEY (`dosage_form_id`) REFERENCES `dosage_forms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`generic_id`) REFERENCES `generics`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `osce_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`condition_id` text,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`station_type` text,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `protocol_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`protocol_id` integer,
	`step_number` integer NOT NULL,
	`heading` text,
	`body` text NOT NULL,
	`sub_steps_json` text,
	`table_json` text,
	`severity` text,
	FOREIGN KEY (`protocol_id`) REFERENCES `protocols`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `protocols` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`condition_id` text,
	`title` text NOT NULL,
	`source` text,
	`version` text,
	`year` integer,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`condition_id` text,
	`text` text NOT NULL,
	`is_warn_sign` integer DEFAULT false,
	`category` text,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `systems` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`color` text,
	`order_index` integer
);
