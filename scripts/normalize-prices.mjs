/**
 * Data quality: parse embedded pricing from package_size column.
 *
 * The BD medicine scraper stored pack info as: "(50's pack: ৳ 200.50)"
 * This script parses that pattern and back-populates:
 *   - pack_price_bdt  = the numeric value after ৳
 *   - unit_price_bdt  = pack_price_bdt / pack_count
 *
 * Run: node --experimental-sqlite scripts/normalize-prices.mjs
 * Safe to re-run: only updates rows where unit_price_bdt IS NULL
 * and package_size matches the pattern.
 */

import { DatabaseSync } from "node:sqlite";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dir, "..", "public", "database.sqlite");

const db = new DatabaseSync(DB_PATH);

// Pattern: (50's pack: ৳ 200.50)  — the Taka sign is a multi-byte UTF-8 char
// We'll pull all rows and parse in JS since SQLite REGEXP isn't always available.
const PACK_PATTERN = /\((\d+)'s\s+pack:\s+৳\s*([\d.]+)\)/i;

console.log("Loading unparsed rows…");
const rows = db.prepare(`
  SELECT id, package_size
  FROM medicines
  WHERE unit_price_bdt IS NULL
    AND package_size IS NOT NULL
`).all();

console.log(`  Candidate rows: ${rows.length}`);

const update = db.prepare(`
  UPDATE medicines
  SET unit_price_bdt = ?, pack_price_bdt = ?
  WHERE id = ?
`);

let updated = 0;
let skipped = 0;

db.exec("BEGIN");
try {
  for (const row of rows) {
    const match = PACK_PATTERN.exec(row.package_size);
    if (!match) { skipped++; continue; }

    const packCount = parseInt(match[1], 10);
    const packPrice = parseFloat(match[2]);

    if (!packCount || !packPrice || packCount <= 0 || packPrice <= 0) {
      skipped++;
      continue;
    }

    const unitPrice = Math.round((packPrice / packCount) * 100) / 100;
    update.run(unitPrice, packPrice, row.id);
    updated++;
  }
  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  throw err;
}

// Verify
const priced = db.prepare(`SELECT COUNT(*) AS c FROM medicines WHERE unit_price_bdt IS NOT NULL`).get();

console.log(`\n  Updated:  ${updated}`);
console.log(`  Skipped:  ${skipped} (non-matching package_size)`);
console.log(`  Total medicines with unit_price_bdt: ${priced.c}`);

if (updated === 0 && priced.c > 1000) {
  console.log("\n  Already normalized — nothing to do.");
} else if (updated > 0) {
  console.log("\n  Done. Prices normalized successfully.");
}

// Spot-check 3 rows
const sample = db.prepare(`
  SELECT brand_name, package_size, unit_price_bdt, pack_price_bdt
  FROM medicines
  WHERE unit_price_bdt IS NOT NULL
  LIMIT 3
`).all();
console.log("\n  Sample rows:");
for (const r of sample) {
  console.log(`    ${r.brand_name} | ${r.package_size} → ৳${r.unit_price_bdt}/unit  (pack ৳${r.pack_price_bdt})`);
}
