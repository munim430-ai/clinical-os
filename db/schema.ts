import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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
});

export const genericIndications = sqliteTable("generic_indications", {
  genericId: integer("generic_id").notNull().references(() => generics.id),
  indicationId: integer("indication_id").notNull().references(() => indications.id),
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
  isPaediatricSafe: integer("is_paediatric_safe", { mode: "boolean" }).default(true),
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
  offlineAvailable: integer("offline_available", { mode: "boolean" }).default(false),
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
