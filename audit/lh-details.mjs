/* Print element-level details of failing Lighthouse audits from a saved report. */
import { readFileSync } from "node:fs";

const file = process.argv[2] || "C:\\Users\\sabbi\\AppData\\Local\\Temp\\opencode-browser-tRNQgS\\0\\lighthouse.json";
const auditIds = process.argv.slice(3).length ? process.argv.slice(3) : ["color-contrast", "heading-order"];
const report = JSON.parse(readFileSync(file, "utf8"));

for (const id of auditIds) {
  const a = report.audits?.[id];
  if (!a) { console.log(`audit ${id}: not found`); continue; }
  console.log(`\n=== ${id} (score ${a.score}, displayValue: ${a.displayValue || "n/a"}) ===`);
  for (const item of a.details?.items || []) {
    console.log(`- node: ${JSON.stringify(item.node?.snippet || "").slice(0, 220)}`);
    console.log(`  selector: ${item.node?.selector || "?"}`);
    console.log(`  explanation: ${String(item.node?.explanation || "").replace(/\s+/g, " ").slice(0, 300)}`);
    console.log(`  path: ${(item.node?.path || "").slice(0, 200)}`);
  }
}
