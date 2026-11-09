// Round-0 capture for the single-file Quintessence site (served at / via app/route.ts).
// Targets: 375/768/1440 ATF + full page, hover states, preloader mid-animation, hash pages.
// Saves to audit/shots/r0-* so earlier rounds are not overwritten.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const SHOTS = join(import.meta.dirname, "shots");
mkdirSync(SHOTS, { recursive: true });
const BASE = "http://localhost:3000";
const out = { consoleErrors: [], consoleWarnings: [], pageErrors: [], widths: {} };

async function waitForReady(page) {
  try {
    await page.waitForFunction(
      () => document.body.classList.contains("ready"),
      { timeout: 8000 }
    );
  } catch {}
  await page.waitForTimeout(600);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const WIDTHS = [375, 768, 1440];

  for (const w of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => {
      if (m.type() === "error") errs.push(m.text());
    });
    page.on("pageerror", (e) => errs.push("PAGEERROR: " + e.message));

    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await waitForReady(page);

    // ATF (home)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, `r0-home-${w}-atf.png`), clip: { x: 0, y: 0, width: w, height: 900 } });
    // Full page
    await page.screenshot({ path: join(SHOTS, `r0-home-${w}-full.png`), fullPage: true });

    // Horizontal overflow probe
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }));
    out.widths[w] = overflow;
    if (errs.length) out.consoleErrors.push(`home@${w}: ` + errs.join(" | "));
    await ctx.close();
  }

  // Hash sub-pages (single-file SPA)
  for (const [name, hash] of [["software", "#software"], ["industries", "#industries"], ["trust", "#trust"], ["about", "#about"], ["contact", "#contact"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => out.pageErrors.push(`${name}: ${e.message}`));
    await page.goto(BASE + "/" + hash, { waitUntil: "domcontentloaded" });
    await waitForReady(page);
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(SHOTS, `r0-${name}-1440-atf.png`), clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await page.screenshot({ path: join(SHOTS, `r0-${name}-1440-full.png`), fullPage: true });
    await ctx.close();
  }

  // Hover states @1440 (nav link, primary button, capability row)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await waitForReady(page);

    // Nav hover (Services)
    await page.hover("#sv");
    await page.waitForTimeout(700); // mega menu opens after 60ms + transition
    await page.screenshot({ path: join(SHOTS, "r0-hover-nav.png"), clip: { x: 0, y: 0, width: 1440, height: 500 } });
    // click away to close mega
    await page.mouse.click(720, 800);
    await page.waitForTimeout(400);

    // CTA button hover
    const cta = page.locator("main a.btn", { hasText: "Begin a project" }).first();
    await cta.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, "r0-hover-cta.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });

    // Capability row hover (Applied AI row)
    const row = page.locator(".row").nth(1);
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await row.locator(".rh").hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(SHOTS, "r0-hover-capability.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await ctx.close();
  }

  // Preloader mid-animation
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, "r0-preloader-mid.png") });
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(SHOTS, "r0-preloader-curtain.png") });
    await ctx.close();
  }

  await browser.close();
  writeFileSync(join(import.meta.dirname, "r0-probe.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log("DONE r0-shoot");
})();
