#!/usr/bin/env node
// QA contract for Sprint 1I — DIMS Company Browser
// Asserts: companies list non-empty, top company has brands, known BD company present
// Exit 0 = all checks pass. Non-zero = failure.

import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "../public/database.sqlite");

if (!existsSync(DB_PATH)) {
  console.error("✗ database.sqlite not found — run `bun run build:db` first");
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
let passed = 0;
let failed = 0;

function check(label, value, assertion) {
  if (assertion(value)) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label} (got: ${JSON.stringify(value)})`);
    failed++;
  }
}

console.log("\nDIMS Company Browser — QA checks\n");

// 1. Manufacturers table has rows
const totalCompanies = db.prepare("SELECT COUNT(*) as n FROM manufacturers").get();
check("manufacturers table is non-empty", totalCompanies.n, (n) => n > 0);

// 2. At least 100 manufacturers (BD dataset is large)
check("at least 100 manufacturers", totalCompanies.n, (n) => n >= 100);

// 3. Top manufacturer by brand count has ≥ 10 brands
const topCompany = db.prepare(`
  SELECT m.name, COUNT(med.id) as brand_count
  FROM manufacturers m
  LEFT JOIN medicines med ON med.manufacturer_id = m.id
  GROUP BY m.id
  ORDER BY brand_count DESC
  LIMIT 1
`).get();
check("top manufacturer has ≥ 10 brands", topCompany?.brand_count, (n) => n >= 10);
console.log(`     → top company: ${topCompany?.name} (${topCompany?.brand_count} brands)`);

// 4. A well-known Bangladeshi manufacturer is present
const knownCompanies = ["Square", "Beximco", "Incepta", "ACI", "Eskayef", "Opsonin", "Renata"];
const found = db.prepare(
  `SELECT name FROM manufacturers WHERE ${knownCompanies.map(() => "name LIKE ?").join(" OR ")}`
).all(...knownCompanies.map((c) => `%${c}%`));
check(
  `at least one known BD manufacturer present (${knownCompanies.join(", ")})`,
  found.length,
  (n) => n >= 1
);
if (found.length > 0) {
  console.log(`     → found: ${found.map((r) => r.name).slice(0, 5).join(", ")}`);
}

// 5. Company-to-brand join works (no null manufacturer brands blown up)
const joinCheck = db.prepare(`
  SELECT COUNT(*) as n
  FROM medicines
  WHERE manufacturer_id IS NOT NULL
`).get();
check("medicines with manufacturer_id are present", joinCheck.n, (n) => n > 0);

// 6. Each medicine with a manufacturer_id has a matching manufacturers row
const orphans = db.prepare(`
  SELECT COUNT(*) as n
  FROM medicines m
  LEFT JOIN manufacturers mfr ON mfr.id = m.manufacturer_id
  WHERE m.manufacturer_id IS NOT NULL AND mfr.id IS NULL
`).get();
check("no orphaned manufacturer_id references", orphans.n, (n) => n === 0);

console.log(`\n${passed + failed} checks — ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
