/* One-off finisher: missing after1 contact shots + hover states + console issue log. */
import { chromium } from "playwright";
import path from "node:path";

const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\"));
const SHOTS = path.join(OUT, "shots");
const BASE = "http://localhost:3000";
const PREFIX = "after1";

const issueLog = {};

async function snap(url, width, outName, { fullPage = false, hoverSel = null, extraWait = 2800 } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: width === 375 ? 2 : 1.5,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      (issueLog[url + "@" + width] ||= []).push(`${m.type()}: ${m.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (e) => {
    (issueLog[url + "@" + width] ||= []).push(`pageerror: ${String(e.message).slice(0, 300)}`);
  });
  page.on("requestfailed", (r) => {
    (issueLog[url + "@" + width] ||= []).push(`requestfailed: ${r.url().slice(0, 200)} (${r.failure()?.errorText})`);
  });

  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("quintessence:preloader:shown", "1");
    } catch {}
  });
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(extraWait);
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
  console.log("shot", outName);
}

const browser = await chromium.launch();

// Missing contact shots (375-full, 768, 768-full, 1440, 1440-full)
await snap("/contact", 375, `${PREFIX}-contact-375-full.png`, { fullPage: true });
await snap("/contact", 768, `${PREFIX}-contact-768.png`);
await snap("/contact", 768, `${PREFIX}-contact-768-full.png`, { fullPage: true });
await snap("/contact", 1440, `${PREFIX}-contact-1440.png`);
await snap("/contact", 1440, `${PREFIX}-contact-1440-full.png`, { fullPage: true });

// Hover states at 1440
await snap("/", 1440, `${PREFIX}-home-1440-authover.png`, { hoverSel: "nav a[href='/approach']" });
await snap("/", 1440, `${PREFIX}-home-1440-ctahover.png`, { hoverSel: "main a[href='/contact']" });
await snap("/capabilities", 1440, `${PREFIX}-capabilities-1440-hover.png`, { hoverSel: ".group >> nth=0" });

// Console issue sweep, fresh sessions, all pages
for (const [name, url] of [["home", "/"], ["capabilities", "/capabilities"], ["approach", "/approach"], ["principles", "/principles"], ["contact", "/contact"]]) {
  await Promise.resolve();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 812 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      (issueLog[name + " (console sweep)"] ||= []).push(`${m.type()}: ${m.text().slice(0, 300)}`);
    }
  });
  page.on("pageerror", (e) => {
    (issueLog[name + " (console sweep)"] ||= []).push(`pageerror: ${String(e.message).slice(0, 300)}`);
  });
  page.on("requestfailed", (r) => {
    (issueLog[name + " (console sweep)"] ||= []).push(`requestfailed: ${r.url().slice(0, 200)} (${r.failure()?.errorText})`);
  });
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("quintessence:preloader:shown", "1");
    } catch {}
  });
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await ctx.close();
}

console.log("=== console/page issues captured ===");
for (const [k, v] of Object.entries(issueLog)) {
  const uniq = [...new Set(v)].slice(0, 6);
  if (uniq.length) console.log(k + ":\n  " + uniq.join("\n  "));
}
if (!Object.keys(issueLog).length) console.log("(none)");

await browser.close();
console.log("DONE");
