/**
 * QA Smoke Tests — Route-level & DB integrity
 * Run: node --experimental-sqlite scripts/qa-smoke-routes.mjs
 * Exit 0 = all pass, Exit 1 = failures
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const DIST = join(ROOT, "dist");
const DB_PATH = join(ROOT, "public", "database.sqlite");

let passed = 0;
let failed = 0;

function assert(name, condition, detail = "") {
  if (condition) {
    console.log(`  ✓  ${name}`);
    passed++;
  } else {
    console.error(`  ✗  ${name}${detail ? `  →  ${detail}` : ""}`);
    failed++;
  }
}

// ─── 1. Static export: required HTML routes ──────────────────────────────────
console.log("\n── Static Export Routes ─────────────────────────────");

// Expo exports tabs under both (tabs)/ and canonical short paths
const REQUIRED_ROUTES = [
  "(tabs)/home/index.html",
  "(tabs)/gp/index.html",
  "(tabs)/dims/index.html",
  "(tabs)/lab/index.html",
  "(tabs)/profile/index.html",
  "+not-found.html",
];

for (const route of REQUIRED_ROUTES) {
  const full = join(DIST, route);
  assert(`dist/${route} exists`, existsSync(full), full);
}

// Canonical short paths (without group prefix)
const SHORT_ROUTES = ["home", "gp", "dims", "lab", "er", "profile", "wallet"];
for (const dir of SHORT_ROUTES) {
  assert(
    `dist/${dir}/index.html exists`,
    existsSync(join(DIST, dir, "index.html")) ||
      existsSync(join(DIST, `${dir}.html`)),
  );
}

// database.sqlite must be in dist (served to web clients)
assert(
  "dist/database.sqlite exists",
  existsSync(join(DIST, "database.sqlite")),
);

// ─── 2. Database file ─────────────────────────────────────────────────────────
console.log("\n── Database File ────────────────────────────────────");
assert("public/database.sqlite exists", existsSync(DB_PATH), DB_PATH);

if (!existsSync(DB_PATH)) {
  console.error(
    "\nDatabase missing — skipping DB checks. Run: bun run build:db\n",
  );
  console.error(`RESULT: ${passed} passed, ${failed} failed`);
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);

// ─── 3. Table presence ───────────────────────────────────────────────────────
console.log("\n── Table Presence ───────────────────────────────────");

const REQUIRED_TABLES = [
  "systems",
  "conditions",
  "medicines",
  "manufacturers",
  "er_drugs",
  "lab_references",
  "rx_entries",
  "protocol_steps",
  "symptoms",
  "exam_steps",
  "osce_cards",
  "generics",
];

for (const table of REQUIRED_TABLES) {
  try {
    const row = db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get();
    assert(`${table} exists and is readable`, true);
  } catch {
    assert(
      `${table} exists and is readable`,
      false,
      "table missing or unreadable",
    );
  }
}

// ─── 4. Critical row counts ───────────────────────────────────────────────────
console.log("\n── Critical Row Counts ──────────────────────────────");

const MIN_COUNTS = [
  ["medicines", 10_000, "DIMS drug catalog"],
  ["manufacturers", 100, "Manufacturers"],
  ["conditions", 100, "GP conditions"],
  ["systems", 5, "Body systems"],
  ["er_drugs", 5, "ER drugs"],
];

for (const [table, min, label] of MIN_COUNTS) {
  const { c } = db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get();
  assert(`${label}: at least ${min} rows (got ${c})`, c >= min, `actual: ${c}`);
}

// ─── 5. GP data integrity ─────────────────────────────────────────────────────
console.log("\n── GP Data Integrity ────────────────────────────────");

// Every condition must have a system_id that exists in systems
const orphanConditions = db
  .prepare(`
  SELECT COUNT(*) AS c FROM conditions co
  LEFT JOIN systems s ON s.id = co.system_id
  WHERE s.id IS NULL
`)
  .get();
assert(
  "All conditions have a valid system_id",
  orphanConditions.c === 0,
  `${orphanConditions.c} orphan(s)`,
);

// Every rx_entry must reference an existing condition
const orphanRx = db
  .prepare(`
  SELECT COUNT(*) AS c FROM rx_entries r
  LEFT JOIN conditions c ON c.id = r.condition_id
  WHERE c.id IS NULL
`)
  .get();
assert(
  "All rx_entries reference a valid condition",
  orphanRx.c === 0,
  `${orphanRx.c} orphan(s)`,
);

// Every protocol_step must reference a valid protocol
const orphanSteps = db
  .prepare(`
  SELECT COUNT(*) AS c FROM protocol_steps p
  LEFT JOIN protocols pr ON pr.id = p.protocol_id
  WHERE pr.id IS NULL
`)
  .get();
assert(
  "All protocol_steps reference a valid protocol",
  orphanSteps.c === 0,
  `${orphanSteps.c} orphan(s)`,
);

// ─── 6. DIMS integrity ────────────────────────────────────────────────────────
console.log("\n── DIMS Integrity ───────────────────────────────────");

// Every medicine must have a non-empty name
const noNameMeds = db
  .prepare(
    `SELECT COUNT(*) AS c FROM medicines WHERE brand_name IS NULL OR trim(brand_name) = ''`,
  )
  .get();
assert(
  "All medicines have a brand_name",
  noNameMeds.c === 0,
  `${noNameMeds.c} unnamed`,
);

// Medicines with a non-null generic_id must point to a real generic
const orphanMeds = db
  .prepare(`
  SELECT COUNT(*) AS c FROM medicines m
  LEFT JOIN generics g ON g.id = m.generic_id
  WHERE m.generic_id IS NOT NULL AND g.id IS NULL
`)
  .get();
assert(
  "Medicines with generic_id reference a valid generic",
  orphanMeds.c === 0,
  `${orphanMeds.c} orphan(s)`,
);

// Pricing: at least 10,000 medicines should now have unit_price_bdt after normalization
const pricedMeds = db
  .prepare(
    `SELECT COUNT(*) AS c FROM medicines WHERE unit_price_bdt IS NOT NULL`,
  )
  .get();
assert(
  `Pricing populated: at least 10,000 medicines have unit_price_bdt (got ${pricedMeds.c})`,
  pricedMeds.c >= 10_000,
  `actual: ${pricedMeds.c}`,
);

// ─── 7. ER drug data ─────────────────────────────────────────────────────────
console.log("\n── ER Drug Data ─────────────────────────────────────");

const erDrugs = db
  .prepare(`SELECT COUNT(*) AS c FROM er_drugs WHERE dose_per_kg IS NOT NULL`)
  .get();
assert(
  `ER drugs with dose_per_kg: at least 5 (got ${erDrugs.c})`,
  erDrugs.c >= 5,
);

const erDrugSample = db
  .prepare(`SELECT name, dose_per_kg, route FROM er_drugs LIMIT 3`)
  .all();
assert(
  "ER drugs have name, dose_per_kg, route",
  erDrugSample.every((r) => r.name && r.dose_per_kg && r.route),
);

// ─── 8. Lab references ────────────────────────────────────────────────────────
console.log("\n── Lab References ───────────────────────────────────");

const labTotal = db.prepare(`SELECT COUNT(*) AS c FROM lab_references`).get();
assert(
  `Lab references exist: at least 50 (got ${labTotal.c})`,
  labTotal.c >= 50,
);

const labWithCondition = db
  .prepare(
    `SELECT COUNT(*) AS c FROM lab_references WHERE condition_id IS NOT NULL`,
  )
  .get();
assert(
  `Lab references with condition_id: at least 1 (got ${labWithCondition.c})`,
  labWithCondition.c >= 1,
);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(52)}`);
const total = passed + failed;
console.log(
  `RESULT  ${passed}/${total} passed${
    failed > 0 ? `  (${failed} FAILED)` : "  — all green"
  }`,
);
console.log("─".repeat(52) + "\n");

process.exit(failed > 0 ? 1 : 0);
