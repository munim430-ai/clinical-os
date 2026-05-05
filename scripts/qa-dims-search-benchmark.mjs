#!/usr/bin/env node
// Sprint 1J — DIMS Search Benchmark
// Tests common Bangladeshi brand, generic, misspelling, and company queries.
// Reports: result count, first result, latency per query.
// Exit 0 = all benchmark assertions pass. Non-zero = failure.

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

const brandSearch = db.prepare(`
  SELECT m.brand_name, g.name as generic_name, mfr.name as manufacturer
  FROM medicines m
  LEFT JOIN generics g ON g.id = m.generic_id
  LEFT JOIN manufacturers mfr ON mfr.id = m.manufacturer_id
  WHERE m.brand_name LIKE ? OR g.name LIKE ?
  LIMIT 20
`);

const manufacturerSearch = db.prepare(`
  SELECT mfr.name, COUNT(m.id) as brand_count
  FROM manufacturers mfr
  LEFT JOIN medicines m ON m.manufacturer_id = mfr.id
  WHERE mfr.name LIKE ?
  GROUP BY mfr.id
  ORDER BY brand_count DESC
  LIMIT 10
`);

const BENCHMARKS = [
  // Common Bangladeshi brand names
  { type: "brand", query: "Napa",        minResults: 1, note: "Paracetamol — highest-selling BD brand" },
  { type: "brand", query: "Moxacil",     minResults: 1, note: "Amoxicillin brand (Beximco)" },
  { type: "brand", query: "Filmet",      minResults: 1, note: "Metronidazole brand" },
  { type: "brand", query: "Ceporex",     minResults: 1, note: "Cephalexin brand" },
  { type: "brand", query: "Losectil",    minResults: 1, note: "Omeprazole brand (Incepta)" },
  // Generic molecule names
  { type: "generic", query: "Amoxicillin",  minResults: 5,  note: "High-volume antibiotic" },
  { type: "generic", query: "Metformin",    minResults: 3,  note: "Diabetes — many BD generics" },
  { type: "generic", query: "Amlodipine",   minResults: 3,  note: "Antihypertensive" },
  { type: "generic", query: "Omeprazole",   minResults: 3,  note: "PPI — very common" },
  { type: "generic", query: "Salbutamol",   minResults: 3,  note: "Bronchodilator" },
  // Common misspellings / partial matches
  { type: "brand", query: "Napas",       minResults: 1, note: "Misspelling of Napa" },
  { type: "brand", query: "Amox",        minResults: 1, note: "Partial match for Amoxicillin brands" },
  { type: "brand", query: "Metfo",       minResults: 1, note: "Partial match for Metformin brands" },
  // Manufacturer searches
  { type: "company", query: "Square",    minResults: 1, note: "Square Pharmaceuticals" },
  { type: "company", query: "Beximco",   minResults: 1, note: "Beximco Pharmaceuticals" },
  { type: "company", query: "Incepta",   minResults: 1, note: "Incepta Pharmaceuticals" },
];

let passed = 0;
let failed = 0;
const results = [];

console.log("\nDIMS Search Benchmark — Sprint 1J\n");
console.log("─".repeat(72));

for (const bench of BENCHMARKS) {
  const start = performance.now();
  let rows;

  if (bench.type === "company") {
    rows = manufacturerSearch.all(`%${bench.query}%`);
  } else {
    const term = `%${bench.query}%`;
    rows = brandSearch.all(term, term);
  }

  const ms = (performance.now() - start).toFixed(1);
  const count = rows.length;
  const ok = count >= bench.minResults;

  if (ok) passed++; else failed++;

  const status = ok ? "✓" : "✗";
  const first = rows[0]
    ? bench.type === "company"
      ? `${rows[0].name} (${rows[0].brand_count} brands)`
      : `${rows[0].brand_name} / ${rows[0].generic_name ?? "?"}`
    : "—";

  console.log(`${status} [${bench.type.padEnd(7)}] "${bench.query}" → ${count} results in ${ms}ms`);
  console.log(`    first: ${first}`);
  console.log(`    note:  ${bench.note}`);

  results.push({ query: bench.query, type: bench.type, count, ms: Number(ms), ok });
}

console.log("─".repeat(72));

const avgMs = (results.reduce((s, r) => s + r.ms, 0) / results.length).toFixed(1);
const maxMs = Math.max(...results.map((r) => r.ms)).toFixed(1);
const slowest = results.find((r) => r.ms === Math.max(...results.map((x) => x.ms)));

console.log(`\nSummary: ${passed + failed} queries — ${passed} passed, ${failed} failed`);
console.log(`Latency: avg ${avgMs}ms  max ${maxMs}ms (query: "${slowest?.query}")\n`);

if (failed > 0) {
  console.error(`✗ ${failed} benchmark assertion(s) failed\n`);
  process.exit(1);
}
process.exit(0);
