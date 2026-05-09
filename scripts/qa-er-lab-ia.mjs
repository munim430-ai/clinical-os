import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const checks = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function check(label, assertion) {
  checks.push({ label, pass: Boolean(assertion) });
}

const tabsLayout = read("app/(tabs)/_layout.tsx");
const rootLayout = read("app/_layout.tsx");
const tabBar = read("components/navigation/CureCurveTabBar.tsx");

check("Lab Report tab route exists", exists("app/(tabs)/lab/index.tsx"));
check("ER exists as root modal route", exists("app/er.tsx"));
check("ER is not registered as a tab", !tabsLayout.includes('name="er/index"'));
check(
  "Lab is registered as the fourth tab",
  tabsLayout.includes('name="lab/index"'),
);
check("Root stack registers /er", rootLayout.includes('name="er"'));
check(
  "Tab bar labels Lab instead of ER",
  tabBar.includes('label: "Lab"') && !tabBar.includes('label: "ER"'),
);
check(
  "Shared EmergencyPill component exists",
  exists("components/navigation/EmergencyPill.tsx"),
);

for (const route of [
  "app/(tabs)/home/index.tsx",
  "app/(tabs)/dims/index.tsx",
  "app/(tabs)/gp/index.tsx",
  "app/(tabs)/lab/index.tsx",
  "app/(tabs)/profile/index.tsx",
]) {
  const body = exists(route) ? read(route) : "";
  check(`${route} renders EmergencyPill`, body.includes("EmergencyPill"));
}

const passed = checks.filter((item) => item.pass).length;

console.log("\nER Action + Lab Report IA QA\n");
for (const item of checks) {
  console.log(`${item.pass ? "✓" : "✗"} ${item.label}`);
}
console.log(`\n${passed}/${checks.length} checks passed`);

if (passed !== checks.length) {
  process.exit(1);
}
