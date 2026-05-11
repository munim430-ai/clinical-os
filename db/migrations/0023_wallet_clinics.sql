-- Wallet module: clinic locations and visit logs
CREATE TABLE `clinics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`name_bn` text,
	`address` text,
	`schedule` text,
	`fee_bdt` integer NOT NULL DEFAULT 500,
	`color` text DEFAULT '#00D7B5',
	`active` integer DEFAULT true,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `visit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clinic_id` integer NOT NULL REFERENCES `clinics`(`id`),
	`date` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`patients` integer NOT NULL DEFAULT 0,
	`earnings_bdt` integer NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
-- Seed: 3 default clinic locations (mirrors design prototype)
INSERT INTO clinics (name, name_bn, address, schedule, fee_bdt, color) VALUES
  ('Dhaka Medical Chamber', 'ঢাকা মেডিকেল চেম্বার', 'Mirpur Road, Dhaka-1216', 'Sat–Thu  6–9 PM', 600, '#00D7B5'),
  ('Uttara Clinic', 'উত্তরা ক্লিনিক', 'Sector-11, Uttara, Dhaka-1230', 'Fri  10 AM–1 PM', 500, '#C8F53C'),
  ('Gazipur Chamber', 'গাজীপুর চেম্বার', 'Chowrasta, Gazipur-1700', 'Tue & Thu  3–6 PM', 400, '#7B2FBE');
