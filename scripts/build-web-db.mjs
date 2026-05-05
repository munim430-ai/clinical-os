/**
 * Builds public/database.sqlite for the web version using Node.js built-in SQLite.
 * Requires Node.js >= 22. Run: node --experimental-sqlite scripts/build-web-db.mjs
 * Auto-discovers ALL .sql migration files in db/migrations/ in sort order.
 */
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "database.sqlite");

// Remove existing file so we start fresh
if (fs.existsSync(OUT)) fs.unlinkSync(OUT);

const db = new DatabaseSync(OUT);
db.exec("PRAGMA journal_mode=WAL;");
db.exec("PRAGMA synchronous=OFF;");
db.exec("PRAGMA cache_size=10000;");

// Auto-discover all .sql migration files in order
const migDir = path.join(ROOT, "db", "migrations");
const migrations = fs.readdirSync(migDir)
  .filter(f => f.endsWith(".sql"))
  .sort()
  .map(f => path.join(migDir, f));

for (const mig of migrations) {
  const label = path.relative(ROOT, mig);
  const sql = fs.readFileSync(mig, "utf8");
  console.log(`Running ${label}...`);
  db.exec(sql);
  console.log(`  ✓ done`);
}

// Normalize prices from embedded package_size values
console.log("\nNormalizing medicine prices…");
const PACK_PATTERN = /\((\d+)'s\s+pack:\s+৳\s*([\d.]+)\)/i;
const pricedRows = db.prepare(`
  SELECT id, package_size FROM medicines
  WHERE unit_price_bdt IS NULL AND package_size IS NOT NULL
`).all();
const priceUpdate = db.prepare(`UPDATE medicines SET unit_price_bdt=?, pack_price_bdt=? WHERE id=?`);
let priceUpdated = 0;
db.exec("BEGIN");
for (const row of pricedRows) {
  const m = PACK_PATTERN.exec(row.package_size);
  if (!m) continue;
  const packCount = parseInt(m[1], 10);
  const packPrice = parseFloat(m[2]);
  if (!packCount || !packPrice) continue;
  const unitPrice = Math.round((packPrice / packCount) * 100) / 100;
  priceUpdate.run(unitPrice, packPrice, row.id);
  priceUpdated++;
}
db.exec("COMMIT");
console.log(`  ✓ Prices normalized: ${priceUpdated} medicines`);

db.close();
const size = fs.statSync(OUT).size;
console.log(`\n✓ Written: ${OUT}`);
console.log(`  Size: ${(size / 1024 / 1024).toFixed(2)} MB`);

// Also copy to dist/ if it exists (web export output)
const DIST_DB = path.join(ROOT, "dist", "database.sqlite");
if (fs.existsSync(path.join(ROOT, "dist"))) {
  fs.copyFileSync(OUT, DIST_DB);
  console.log(`  ✓ Copied to dist/database.sqlite`);
}
