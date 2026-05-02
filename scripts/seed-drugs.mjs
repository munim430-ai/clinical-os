/**
 * Drug data import script.
 * Run: node scripts/seed-drugs.mjs
 *
 * Reads Drug Data CSVs and generates a seed SQL migration file.
 * Output: db/migrations/0001_seed_drugs.sql
 * After running, update migrations.js to import the new file.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Papa = require("papaparse");

const DRUG_DATA = path.resolve("../../Drug Data");
const OUTPUT = path.resolve("db/migrations/0001_seed_drugs.sql");

function escape(val) {
  if (val === null || val === undefined || val === "") return "NULL";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function readCSV(filename) {
  const content = fs.readFileSync(path.join(DRUG_DATA, filename), "utf8");
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  console.log(`  ${filename}: ${result.data.length} rows`);
  return result.data;
}

console.log("Reading CSVs...");
const manufacturers = readCSV("manufacturer.csv");
const dosageForms = readCSV("dosage form.csv");
const drugClasses = readCSV("drug class.csv");
const indicationsData = readCSV("indication.csv");
const genericsData = readCSV("generic.csv");
const medicinesData = readCSV("medicine.csv");

const lines = ["-- Auto-generated drug seed migration", "-- Do not edit manually\n"];
const BATCH = 500;

function insertBatch(table, columns, rows, mapper) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const values = batch.map(mapper).join(",\n  ");
    lines.push(`INSERT OR IGNORE INTO ${table} (${columns}) VALUES\n  ${values};`);
  }
}

// Manufacturers
console.log("Generating manufacturers...");
insertBatch(
  "manufacturers", "id, name, slug",
  manufacturers,
  (r) => `(${escape(r["manufacturer id"])}, ${escape(r["manufacturer name"])}, ${escape(r["slug"])})`
);

// Dosage Forms
console.log("Generating dosage forms...");
insertBatch(
  "dosage_forms", "id, name, slug",
  dosageForms,
  (r) => `(${escape(r["dosage form id"])}, ${escape(r["dosage form name"])}, ${escape(r["slug"])})`
);

// Drug Classes
console.log("Generating drug classes...");
insertBatch(
  "drug_classes", "id, name, slug",
  drugClasses,
  (r) => `(${escape(r["drug class id"])}, ${escape(r["drug class name"])}, ${escape(r["slug"])})`
);

// Indications
console.log("Generating indications...");
insertBatch(
  "indications", "id, name, slug",
  indicationsData,
  (r) => `(${escape(r["indication id"])}, ${escape(r["indication name"])}, ${escape(r["slug"])})`
);

// Build lookup maps for foreign keys
const classMap = {};
for (const r of drugClasses) classMap[r["drug class name"]] = r["drug class id"];

const indicationMap = {};
for (const r of indicationsData) indicationMap[r["indication name"]] = r["indication id"];

// Generics
console.log("Generating generics...");
insertBatch(
  "generics",
  "id, name, slug, drug_class_id, monograph_link, indication_text, pharmacology, dosage_description, administration_description, side_effects, contraindications, interactions, pregnancy_notes, pediatric_usage, overdose_effects, storage_conditions, precautions",
  genericsData,
  (r) => {
    const classId = classMap[r["drug class"]] ?? null;
    return `(${escape(r["generic id"])}, ${escape(r["generic name"])}, ${escape(r["slug"])}, ${escape(classId)}, ${escape(r["monograph link"])}, ${escape(r["indication"])}, ${escape(r["pharmacology description"])}, ${escape(r["dosage description"])}, ${escape(r["administration description"])}, ${escape(r["side effects description"])}, ${escape(r["contraindications description"])}, ${escape(r["interaction description"])}, ${escape(r["pregnancy and lactation description"])}, ${escape(r["pediatric usage description"])}, ${escape(r["overdose effects description"])}, ${escape(r["storage conditions description"])}, ${escape(r["precautions description"])})`;
  }
);

// Medicines — build generic name → id map first
const genericMap = {};
for (const r of genericsData) genericMap[r["generic name"]] = r["generic id"];

const mfgMap = {};
for (const r of manufacturers) mfgMap[r["manufacturer name"]] = r["manufacturer id"];

const dosageMap = {};
for (const r of dosageForms) dosageMap[r["dosage form name"]] = r["dosage form id"];

console.log("Generating medicines...");
insertBatch(
  "medicines",
  "id, brand_name, slug, type, dosage_form_id, generic_id, strength, manufacturer_id, package_container, package_size",
  medicinesData,
  (r) => {
    const dosageId = dosageMap[r["dosage form"]] ?? null;
    const genericId = genericMap[r["generic"]] ?? null;
    const mfgId = mfgMap[r["manufacturer"]] ?? null;
    return `(${escape(r["brand id"])}, ${escape(r["brand name"])}, ${escape(r["slug"])}, ${escape(r["type"])}, ${escape(dosageId)}, ${escape(genericId)}, ${escape(r["strength"])}, ${escape(mfgId)}, ${escape(r["package container"])}, ${escape(r["Package Size"])})`;
  }
);

// FTS5 virtual table for fast search
lines.push(`
-- Full-text search index
CREATE VIRTUAL TABLE IF NOT EXISTS medicines_fts USING fts5(
  brand_name, strength, content='medicines', content_rowid='id'
);

INSERT INTO medicines_fts(medicines_fts) VALUES('rebuild');
`);

const sql = lines.join("\n");
fs.writeFileSync(OUTPUT, sql, "utf8");
console.log(`\nDone! Written to ${OUTPUT}`);
console.log(`File size: ${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2)} MB`);
console.log("\nNext: update db/migrations/migrations.js to import 0001_seed_drugs.sql");
