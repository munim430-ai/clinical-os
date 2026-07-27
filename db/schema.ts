import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── DIMS: Drug Information & Management System ──────────────────────────────

export const manufacturers = sqliteTable("manufacturers", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
});

export const dosageForms = sqliteTable("dosage_forms", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
});

export const drugClasses = sqliteTable("drug_classes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
});

export const indications = sqliteTable("indications", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
});

export const generics = sqliteTable("generics", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
  drugClassId: integer("drug_class_id").references(() => drugClasses.id),
  monographLink: text("monograph_link"),
  indicationText: text("indication_text"),
  pharmacology: text("pharmacology"),
  dosageDescription: text("dosage_description"),
  administrationDescription: text("administration_description"),
  sideEffects: text("side_effects"),
  contraindications: text("contraindications"),
  interactions: text("interactions"),
  pregnancyNotes: text("pregnancy_notes"),
  pediatricUsage: text("pediatric_usage"),
  overdoseEffects: text("overdose_effects"),
  storageConditions: text("storage_conditions"),
  precautions: text("precautions"),
});

export const medicines = sqliteTable("medicines", {
  id: integer("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  slug: text("slug"),
  type: text("type"),
  dosageFormId: integer("dosage_form_id").references(() => dosageForms.id),
  genericId: integer("generic_id").references(() => generics.id),
  strength: text("strength"),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id),
  packageContainer: text("package_container"),
  packageSize: text("package_size"),
  unitPriceBdt: real("unit_price_bdt"),
  packPriceBdt: real("pack_price_bdt"),
  priceUpdatedAt: text("price_updated_at"),
});

export const genericIndications = sqliteTable("generic_indications", {
  genericId: integer("generic_id")
    .notNull()
    .references(() => generics.id),
  indicationId: integer("indication_id")
    .notNull()
    .references(() => indications.id),
});

// ─── GP Master ───────────────────────────────────────────────────────────────

export const systems = sqliteTable("systems", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  orderIndex: integer("order_index"),
});

export const conditions = sqliteTable("conditions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  systemId: text("system_id").references(() => systems.id),
  overview: text("overview"),
  icd10Code: text("icd10_code"),
  slug: text("slug"),
});

export const symptoms = sqliteTable("symptoms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: text("condition_id").references(() => conditions.id),
  text: text("text").notNull(),
  isWarnSign: integer("is_warn_sign", { mode: "boolean" }).default(false),
  category: text("category"),
});

export const protocols = sqliteTable("protocols", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: text("condition_id").references(() => conditions.id),
  title: text("title").notNull(),
  source: text("source"),
  version: text("version"),
  year: integer("year"),
});

export const protocolSteps = sqliteTable("protocol_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  protocolId: integer("protocol_id").references(() => protocols.id),
  stepNumber: integer("step_number").notNull(),
  heading: text("heading"),
  body: text("body").notNull(),
  subStepsJson: text("sub_steps_json"),
  tableJson: text("table_json"),
  severity: text("severity"),
});

export const examSteps = sqliteTable("exam_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: text("condition_id").references(() => conditions.id),
  category: text("category").notNull(), // inspection | palpation | percussion | auscultation
  text: text("text").notNull(),
  orderIndex: integer("order_index"),
});

export const labReferences = sqliteTable("lab_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  unit: text("unit"),
  normalMin: real("normal_min"),
  normalMax: real("normal_max"),
  criticalLow: real("critical_low"),
  criticalHigh: real("critical_high"),
  notes: text("notes"),
  conditionId: text("condition_id").references(() => conditions.id),
});

export const ecgPatterns = sqliteTable("ecg_patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  keyFeaturesJson: text("key_features_json"),
  conditionId: text("condition_id").references(() => conditions.id),
});

export const cxrFindings = sqliteTable("cxr_findings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  conditionId: text("condition_id"),
});

export const osceCards = sqliteTable("osce_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: text("condition_id").references(() => conditions.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  stationType: text("station_type"), // history | examination | management | data-interpretation
});

// ─── GP Master Rx ────────────────────────────────────────────────────────────

export const rxEntries = sqliteTable("rx_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: text("condition_id").references(() => conditions.id),
  drugName: text("drug_name").notNull(),
  drugClass: text("drug_class"),
  indication: text("indication"),
  dosage: text("dosage"),
  frequency: text("frequency"),
  route: text("route"),
  duration: text("duration"),
  notes: text("notes"),
  priority: integer("priority").default(1), // 1=first-line, 2=second-line, 3=alternative
  source: text("source"),
});

// ─── ER Module ───────────────────────────────────────────────────────────────

export const erDrugs = sqliteTable("er_drugs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  indication: text("indication"),
  dosePerKg: real("dose_per_kg"),
  maxDoseMg: real("max_dose_mg"),
  route: text("route"),
  concentrationMgPerMl: real("concentration_mg_per_ml"),
  dilutionNotes: text("dilution_notes"),
  warningNote: text("warning_note"),
  isPaediatricSafe: integer("is_paediatric_safe", { mode: "boolean" }).default(
    true,
  ),
  orderIndex: integer("order_index"),
});

// ─── Surveillance (anonymous, no patient data) ───────────────────────────────

export const caseLogs = sqliteTable("case_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  diseaseType: text("disease_type").notNull(), // dengue | typhoid | malaria | cholera
  district: text("district"),
  loggedAt: text("logged_at").default(sql`(CURRENT_TIMESTAMP)`),
  synced: integer("synced", { mode: "boolean" }).default(false),
});

// ─── Wallet: Clinic Locations & Visit Logs ───────────────────────────────────

export const clinics = sqliteTable("clinics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  nameBn: text("name_bn"),
  address: text("address"),
  schedule: text("schedule"),
  feeBdt: integer("fee_bdt").notNull().default(500),
  color: text("color").default("#00D7B5"),
  active: integer("active", { mode: "boolean" }).default(true),
  feeModel: text("fee_model").default("FULL"), // FULL | SPLIT | RENT
  splitPercent: real("split_percent"),
  monthlyRent: integer("monthly_rent"),
  nextSerial: integer("next_serial").default(1),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const visitLogs = sqliteTable("visit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clinicId: integer("clinic_id")
    .notNull()
    .references(() => clinics.id),
  date: text("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  patients: integer("patients").notNull().default(0),
  earningsBdt: integer("earnings_bdt").notNull().default(0),
  notes: text("notes"),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Patient Registry ─────────────────────────────────────────────────────────

export const patients = sqliteTable("patients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone"),
  ageYears: integer("age_years"),
  ageMonths: integer("age_months"),
  gender: text("gender"), // male | female | other
  bloodGroup: text("blood_group"),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  drugAllergies: text("drug_allergies"), // comma-separated generics
  chronicConditions: text("chronic_conditions"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Prescriptions ────────────────────────────────────────────────────────────

export const prescriptions = sqliteTable("prescriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rxNumber: text("rx_number").notNull().unique(),
  patientId: integer("patient_id").references(() => patients.id),
  patientName: text("patient_name").notNull(),
  patientAge: text("patient_age"),
  patientGender: text("patient_gender"),
  patientPhone: text("patient_phone"),
  clinicId: integer("clinic_id").references(() => clinics.id),
  chiefComplaints: text("chief_complaints"),
  onExamination: text("on_examination"),
  investigations: text("investigations"),
  diagnoses: text("diagnoses"),
  medicinesJson: text("medicines_json"),
  advice: text("advice"),
  followUpDate: text("follow_up_date"),
  visitFee: integer("visit_fee").default(0),
  bp: text("bp"),
  pulse: integer("pulse"),
  temperature: real("temperature"),
  spo2: real("spo2"),
  weightKg: real("weight_kg"),
  qrToken: text("qr_token").unique(),
  pdfPath: text("pdf_path"),
  status: text("status").default("active"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Quick-pick data ──────────────────────────────────────────────────────────

export const chiefComplaints = sqliteTable("chief_complaints", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").default(0),
});

export const diagnosisQuickPicks = sqliteTable("diagnosis_quick_picks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  icd10Code: text("icd10_code"),
  category: text("category"),
  sortOrder: integer("sort_order").default(0),
});

export const adviceQuickPicks = sqliteTable("advice_quick_picks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").default(0),
});

// ─── Serial Queue ─────────────────────────────────────────────────────────────

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clinicId: integer("clinic_id")
    .notNull()
    .references(() => clinics.id),
  patientId: integer("patient_id").references(() => patients.id),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone"),
  serialNumber: integer("serial_number").notNull(),
  date: text("date").notNull(),
  timeSlot: text("time_slot"),
  status: text("status").default("waiting"), // waiting | in_progress | done | no_show
  prescriptionId: integer("prescription_id").references(() => prescriptions.id),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Doctor Profile ───────────────────────────────────────────────────────────

export const doctorProfile = sqliteTable("doctor_profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name"),
  qualifications: text("qualifications"),
  specialty: text("specialty"),
  bmdcReg: text("bmdc_reg"),
  bmdcVerified: integer("bmdc_verified", { mode: "boolean" }).default(false),
  phone: text("phone"),
  email: text("email"),
  chamberLine1: text("chamber_line1"),
  chamberLine2: text("chamber_line2"),
  signatureImageUri: text("signature_image_uri"),
  logoImageUri: text("logo_image_uri"),
  letterheadTemplate: text("letterhead_template").default("default"),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Vitals Log (for patient history trends) ─────────────────────────────────

export const vitalsLog = sqliteTable("vitals_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id),
  bp: text("bp"),
  pulse: integer("pulse"),
  temperature: real("temperature"),
  spo2: real("spo2"),
  weightKg: real("weight_kg"),
  heightCm: real("height_cm"),
  recordedAt: text("recorded_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Data Version Registry (for backup/restore system) ───────────────────────

export const dataVersions = sqliteTable("data_versions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  version: text("version").notNull(), // "2026.07.27-v1"
  type: text("type").notNull(), // "auto" | "manual" | "pre-migration"
  entity: text("entity").notNull(), // "full_db" | "prescriptions" | "patients"
  recordCount: integer("record_count"),
  fileSizeBytes: integer("file_size_bytes"),
  filePath: text("file_path"), // relative to app documents dir
  checksum: text("checksum"), // sha256
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  notes: text("notes"),
});

// ─── Content sync, legal imports, and offline media ──────────────────────────

export const contentVersions = sqliteTable("content_versions", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(), // drugs | protocols | media | alerts | labs
  version: text("version").notNull(),
  sourceName: text("source_name"),
  sourceUrl: text("source_url"),
  checksum: text("checksum"),
  appliedAt: text("applied_at").default(sql`(CURRENT_TIMESTAMP)`),
  status: text("status").default("active"),
  notes: text("notes"),
});

export const syncManifest = sqliteTable("sync_manifest", {
  id: text("id").primaryKey(),
  module: text("module").notNull(), // gp | dims | er | media | alerts
  remoteUrl: text("remote_url").notNull(),
  localVersion: text("local_version"),
  remoteVersion: text("remote_version"),
  checksum: text("checksum"),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  lastCheckedAt: text("last_checked_at"),
  lastSyncedAt: text("last_synced_at"),
  notes: text("notes"),
});

export const mediaAssets = sqliteTable("media_assets", {
  id: text("id").primaryKey(),
  module: text("module").notNull(), // gp | dims | er
  entityType: text("entity_type").notNull(), // condition | generic | ecg | cxr | protocol
  entityId: text("entity_id").notNull(),
  title: text("title"),
  remoteUrl: text("remote_url"),
  localUri: text("local_uri"),
  mimeType: text("mime_type"),
  checksum: text("checksum"),
  sizeBytes: integer("size_bytes"),
  lastSyncedAt: text("last_synced_at"),
  offlineAvailable: integer("offline_available", { mode: "boolean" }).default(
    false,
  ),
});

export const appAlerts = sqliteTable("app_alerts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  module: text("module"), // gp | dims | er | system
  severity: text("severity").default("info"), // info | warning | critical
  startsAt: text("starts_at"),
  endsAt: text("ends_at"),
  sourceName: text("source_name"),
  sourceUrl: text("source_url"),
  dismissed: integer("dismissed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
