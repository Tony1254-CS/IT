/* Screenshot harness for the Quintessence audit.
 * Usage: node audit/shoot.mjs <prefix> [baseURL]
 * Saves full-page + above-the-fold shots at 375/768/1440, hover states,
 * and preloader frames into audit/shots/.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const PREFIX = process.argv[2] || "before";
const BASE = process.argv[3] || "http://localhost:3000";
const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\"));
const SHOTS = path.join(OUT, "shots");
mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [375, 768, 1440];
const PAGES = [
  ["home", "/"],
  ["capabilities", "/capabilities"],
  ["approach", "/approach"],
  ["principles", "/principles"],
  ["contact", "/contact"],
];

const issueLog = {};

async function snap(pageName, width, { fullPage = false, suppressPreloader = true, hoverSel = null } = {}) {
  const outName = `${PREFIX}-${pageName}-${width}${fullPage ? "-full" : ""}${hoverSel ? "-hover" : ""}.png`;
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: width === 375 ? 2 : 1.5,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      const key = `${pageName}@${width}`;
      (issueLog[key] ||= []).push(`${m.type()}: ${m.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (e) => {
    const key = `${pageName}@${width}`;
    (issueLog[key] ||= []).push(`pageerror: ${String(e.message).slice(0, 300)}`);
  });
  page.on("requestfailed", (r) => {
    const key = `${pageName}@${width}`;
    (issueLog[key] ||= []).push(`requestfailed: ${r.url().slice(0, 200)} (${r.failure()?.errorText})`);
  });

  if (suppressPreloader) {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("quintessence:preloader:shown", "1");
      } catch {}
    });
  }

  await page.goto(BASE + PAGES.find(([n]) => n === pageName)[1], { waitUntil: "networkidle" });
  await page.waitForTimeout(2800); // let preloader finish / shader settle

  if (hoverSel) {
    try {
      await page.hover(hoverSel, { timeout: 5000 });
      await page.waitForTimeout(800);
    } catch {
      console.log(`HOVER FAILED on ${hoverSel}`);
    }
  }
  await page.screenshot({ path: path.join(SHOTS, outName), fullPage });
  await ctx.close();
}

const browser = await chromium.launch();

// 1) Preloader frames at 1440 — commit → 350ms (letters mid) → 1500ms (curtain mid) → end
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 812 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "commit" });
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(SHOTS, `${PREFIX}-preloader-letters.png`) });
  await page.waitForTimeout(1300); // ~1650ms: curtain sliding up mid
  await page.screenshot({ path: path.join(SHOTS, `${PREFIX}-preloader-curtain.png`) });
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(SHOTS, `${PREFIX}-preloader-revealed.png`) });
  await ctx.close();
}

// 2) Fold + full-page shots at 3 widths on all 5 pages
for (const [pageName] of PAGES) {
  for (const w of WIDTHS) {
    await snap(pageName, w, { fullPage: false });
    await snap(pageName, w, { fullPage: true });
  }
}

// 3) Hover states at 1440
await snap("home", 1440, { hoverSel: "nav a[href='/approach']" }); // nav link hover
await snap("home", 1440, { hoverSel: "main a[href='/contact']" }); // hero CTA hover
await snap("capabilities", 1440, { hoverSel: ".group >> nth=0" }); // capability card hover

console.log("=== console/page issues captured ===");
for (const [k, v] of Object.entries(issueLog)) {
  const uniq = [...new Set(v)].slice(0, 5);
  if (uniq.length) console.log(k + ":\n  " + uniq.join("\n  "));
}

await browser.close();
console.log("DONE");
