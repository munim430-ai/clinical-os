#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const [, , inputDirArg, outputFileArg = "db/migrations/0004_seed_bd_medicine_scraper.sql"] = process.argv;

if (!inputDirArg) {
  console.error("Usage: bun run import:bd-medicine-scraper <csv-export-dir> [output-sql-file]");
  console.error("Example: bun run import:bd-medicine-scraper ./data/bd-medicine-scraper ./db/migrations/0004_seed_bd_medicine_scraper.sql");
  process.exit(1);
}

const inputDir = path.resolve(inputDirArg);
const outputFile = path.resolve(outputFileArg);

if (!fs.existsSync(inputDir) || !fs.statSync(inputDir).isDirectory()) {
  console.error(`Input directory not found: ${inputDir}`);
  process.exit(1);
}

const fileIndex = new Map(
  fs.readdirSync(inputDir).map((name) => [normalizeFileName(name), path.join(inputDir, name)]),
);

const files = {
  manufacturers: findFile(["manufacturer.csv", "manufacturers.csv", "crawler_manufacturer.csv"]),
  dosageForms: findFile(["dosage_form.csv", "dosage forms.csv", "dosage_forms.csv", "crawler_dosageform.csv"]),
  drugClasses: findFile(["drug_class.csv", "drug classes.csv", "drug_classes.csv", "crawler_drugclass.csv"]),
  indications: findFile(["indication.csv", "indications.csv", "crawler_indication.csv"]),
  generics: findFile(["generic.csv", "generics.csv", "crawler_generic.csv"]),
  medicines: findFile(["medicine.csv", "medicines.csv", "crawler_medicine.csv"]),
};

if (!files.medicines) {
  console.error("Could not find medicine.csv/medicines.csv in the export directory.");
  process.exit(1);
}

const manufacturers = parseCsv(files.manufacturers);
const dosageForms = parseCsv(files.dosageForms);
const drugClasses = parseCsv(files.drugClasses);
const indications = parseCsv(files.indications);
const generics = parseCsv(files.generics);
const medicines = parseCsv(files.medicines);

const generatedDosageForms = new Map();
const dosageFormByName = new Map();
const manufacturerByName = new Map();
const genericByName = new Map();
const drugClassByName = new Map();
const indicationByName = new Map();

let nextGeneratedDosageFormId = maxId(dosageForms, ["dosage_form_id", "id"]) + 1;

for (const row of dosageForms) {
  const id = asInt(value(row, ["dosage_form_id", "id"]));
  const name = clean(value(row, ["dosage_form_name", "name", "dosage_form"]));
  if (id && name) dosageFormByName.set(key(name), id);
}

for (const row of manufacturers) {
  const id = asInt(value(row, ["manufacturer_id", "id"]));
  const name = clean(value(row, ["manufacturer_name", "name", "manufacturer"]));
  if (id && name) manufacturerByName.set(key(name), id);
}

for (const row of drugClasses) {
  const id = asInt(value(row, ["drug_class_id", "id"]));
  const name = clean(value(row, ["drug_class_name", "name", "drug_class"]));
  if (id && name) drugClassByName.set(key(name), id);
}

for (const row of indications) {
  const id = asInt(value(row, ["indication_id", "id"]));
  const name = clean(value(row, ["indication_name", "name", "indication"]));
  if (id && name) indicationByName.set(key(name), id);
}

for (const row of generics) {
  const id = asInt(value(row, ["generic_id", "id"]));
  const name = clean(value(row, ["generic_name", "name", "generic"]));
  if (id && name) genericByName.set(key(name), id);
}

for (const row of medicines) {
  const dosageName = clean(value(row, ["dosage_form", "dosage_form_name", "form"]));
  if (!dosageName || dosageFormByName.has(key(dosageName))) continue;
  const id = nextGeneratedDosageFormId++;
  dosageFormByName.set(key(dosageName), id);
  generatedDosageForms.set(key(dosageName), { id, name: dosageName, slug: slugify(dosageName) });
}

const statements = [];

statements.push("PRAGMA foreign_keys = OFF");
statements.push("BEGIN TRANSACTION");

for (const row of manufacturers) {
  const id = asInt(value(row, ["manufacturer_id", "id"]));
  const name = clean(value(row, ["manufacturer_name", "name", "manufacturer"]));
  if (!id || !name) continue;
  statements.push(upsert("manufacturers", ["id", "name", "slug"], [id, name, clean(value(row, ["slug"])) || slugify(name)]));
}

for (const row of dosageForms) {
  const id = asInt(value(row, ["dosage_form_id", "id"]));
  const name = clean(value(row, ["dosage_form_name", "name", "dosage_form"]));
  if (!id || !name) continue;
  statements.push(upsert("dosage_forms", ["id", "name", "slug"], [id, name, clean(value(row, ["slug"])) || slugify(name)]));
}

for (const item of generatedDosageForms.values()) {
  statements.push(upsert("dosage_forms", ["id", "name", "slug"], [item.id, item.name, item.slug]));
}

for (const row of drugClasses) {
  const id = asInt(value(row, ["drug_class_id", "id"]));
  const name = clean(value(row, ["drug_class_name", "name", "drug_class"]));
  if (!id || !name) continue;
  statements.push(upsert("drug_classes", ["id", "name", "slug"], [id, name, clean(value(row, ["slug"])) || slugify(name)]));
}

for (const row of indications) {
  const id = asInt(value(row, ["indication_id", "id"]));
  const name = clean(value(row, ["indication_name", "name", "indication"]));
  if (!id || !name) continue;
  statements.push(upsert("indications", ["id", "name", "slug"], [id, name, clean(value(row, ["slug"])) || slugify(name)]));
}

for (const row of generics) {
  const id = asInt(value(row, ["generic_id", "id"]));
  const name = clean(value(row, ["generic_name", "name", "generic"]));
  if (!id || !name) continue;

  const drugClassId = asInt(value(row, ["drug_class_id", "drug_class"])) || lookupId(drugClassByName, value(row, ["drug_class_name", "drug_class"]));
  const indicationId = asInt(value(row, ["indication_id", "indication"])) || lookupId(indicationByName, value(row, ["indication_name", "indication"]));

  statements.push(upsert("generics", [
    "id", "name", "slug", "drug_class_id", "monograph_link", "indication_text",
    "pharmacology", "dosage_description", "administration_description", "side_effects",
    "contraindications", "interactions", "pregnancy_notes", "pediatric_usage",
    "overdose_effects", "storage_conditions", "precautions",
  ], [
    id,
    name,
    clean(value(row, ["slug"])) || slugify(name),
    drugClassId || null,
    clean(value(row, ["monograph_link", "monographic_link", "pdf_url"])),
    clean(value(row, ["indication_description", "indication_text", "indications"])),
    clean(value(row, ["pharmacology_description", "pharmacology"])),
    clean(value(row, ["dosage_description", "dosage"])),
    clean(value(row, ["administration_description", "administration"])),
    clean(value(row, ["side_effects_description", "side_effects"])),
    clean(value(row, ["contraindications_description", "contraindications"])),
    clean(value(row, ["interaction_description", "interactions"])),
    clean(value(row, ["pregnancy_and_lactation_description", "pregnancy_notes", "pregnancy_category"])),
    clean(value(row, ["pediatric_usage_description", "pediatric_usage"])),
    clean(value(row, ["overdose_effects_description", "overdose_effects", "overdose"])),
    clean(value(row, ["storage_conditions_description", "storage_conditions"])),
    clean(value(row, ["precautions_description", "precautions"])),
  ]));

  if (indicationId) {
    statements.push(`INSERT INTO generic_indications (generic_id, indication_id) SELECT ${id}, ${indicationId} WHERE NOT EXISTS (SELECT 1 FROM generic_indications WHERE generic_id = ${id} AND indication_id = ${indicationId})`);
  }
}

for (const row of medicines) {
  const id = asInt(value(row, ["brand_id", "medicine_id", "id"]));
  const brandName = clean(value(row, ["brand_name", "name", "medicine", "brand"]));
  if (!id || !brandName) continue;

  const genericId = asInt(value(row, ["generic_id"])) || lookupId(genericByName, value(row, ["generic_name", "generic"]));
  const manufacturerId = asInt(value(row, ["manufacturer_id"])) || lookupId(manufacturerByName, value(row, ["manufacturer_name", "manufacturer"]));
  const dosageFormId = asInt(value(row, ["dosage_form_id"])) || lookupId(dosageFormByName, value(row, ["dosage_form", "dosage_form_name", "form"]));

  statements.push(upsert("medicines", [
    "id", "brand_name", "slug", "type", "dosage_form_id", "generic_id", "strength",
    "manufacturer_id", "package_container", "package_size",
  ], [
    id,
    brandName,
    clean(value(row, ["slug"])) || slugify(brandName),
    clean(value(row, ["type", "medicine_type"])) || "allopathic",
    dosageFormId || null,
    genericId || null,
    clean(value(row, ["strength"])),
    manufacturerId || null,
    clean(value(row, ["package_container", "pack_container", "container"])),
    clean(value(row, ["pack_size_info", "package_size", "pack_size", "unit_price"])),
  ]));
}

statements.push(upsert("content_versions", [
  "id", "content_type", "version", "source_name", "source_url", "status", "notes",
], [
  "bd-medicine-scraper-import",
  "drugs",
  new Date().toISOString().slice(0, 10),
  "ahmedshahriar/bd-medicine-scraper CSV export",
  "https://github.com/ahmedshahriar/bd-medicine-scraper",
  "active",
  "Imported from local CSV export. Verify source data rights before distributing the generated migration.",
]));

statements.push("COMMIT");
statements.push("PRAGMA foreign_keys = ON");

const sql = statements.map((s) => `${s};`).join("\n--> statement-breakpoint\n") + "\n";
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, sql, "utf8");

console.log(`Generated ${outputFile}`);
console.log(`Rows: manufacturers=${manufacturers.length}, dosage_forms=${dosageForms.length + generatedDosageForms.size}, drug_classes=${drugClasses.length}, indications=${indications.length}, generics=${generics.length}, medicines=${medicines.length}`);
console.log("Next: register the generated migration in db/migrations/migrations.js and db/migrations/meta/_journal.json after reviewing the SQL size/content.");

function findFile(candidates) {
  for (const candidate of candidates) {
    const hit = fileIndex.get(normalizeFileName(candidate));
    if (hit) return hit;
  }
  return null;
}

function parseCsv(file) {
  if (!file) return [];
  const raw = fs.readFileSync(file, "utf8");
  const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  if (parsed.errors.length) {
    console.warn(`CSV parse warnings in ${file}:`, parsed.errors.slice(0, 3));
  }
  return parsed.data;
}

function value(row, names) {
  const wanted = names.map(normalizeHeader);
  for (const [header, val] of Object.entries(row)) {
    if (wanted.includes(normalizeHeader(header))) return val;
  }
  return null;
}

function clean(v) {
  if (v == null) return null;
  const s = String(v).replace(/\u0000/g, "").trim();
  return s.length ? s : null;
}

function asInt(v) {
  const s = clean(v);
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function maxId(rows, names) {
  return rows.reduce((max, row) => Math.max(max, asInt(value(row, names)) || 0), 0);
}

function lookupId(map, name) {
  const cleaned = clean(name);
  if (!cleaned) return null;
  return map.get(key(cleaned)) ?? null;
}

function key(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeHeader(s) {
  return String(s).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeFileName(s) {
  return String(s).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 250);
}

function sqlValue(v) {
  if (v == null || v === "") return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function quoteColumn(c) {
  return `\`${c}\``;
}

function upsert(table, columns, values) {
  const assignments = columns
    .filter((c) => c !== "id")
    .map((c) => `${quoteColumn(c)} = excluded.${quoteColumn(c)}`)
    .join(", ");

  return `INSERT INTO ${quoteColumn(table)} (${columns.map(quoteColumn).join(", ")}) VALUES (${values.map(sqlValue).join(", ")}) ON CONFLICT(${quoteColumn("id")}) DO UPDATE SET ${assignments}`;
}
