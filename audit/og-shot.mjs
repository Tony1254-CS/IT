/* Renders audit/og.html at exactly 1200x630 (DPR 1) and writes it to
 * app/opengraph-image.png for the Next.js opengraph-image file convention.
 */
import { chromium } from "playwright";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\"));
const htmlPath = path.join(DIR, "og.html");
const outPath = path.join(DIR, "..", "app", "opengraph-image.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`);
await page.waitForTimeout(300); // let system fonts settle
await page.screenshot({ path: outPath, type: "png" });
await browser.close();
console.log(`wrote ${outPath}`);
