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
