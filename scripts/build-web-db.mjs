/**
 * Builds public/database.sqlite for the web version using Node.js built-in SQLite.
 * Requires Node.js >= 22. Run: node --experimental-sqlite scripts/build-web-db.mjs
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

const migrations = [
  "db/migrations/0000_quick_psynapse.sql",
  "db/migrations/0001_seed_drugs.sql",
  "db/migrations/0002_seed_clinical.sql",
];

for (const mig of migrations) {
  const sql = fs.readFileSync(path.join(ROOT, mig), "utf8");
  console.log(`Running ${mig}...`);
  db.exec(sql);
  console.log(`  ✓ done`);
}

db.close();
const size = fs.statSync(OUT).size;
console.log(`\n✓ Written: ${OUT}`);
console.log(`  Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
