// Scrolled section captures so IntersectionObserver reveals fire before the shot.
import { chromium } from "playwright";
import { join } from "path";
const SHOTS = join(import.meta.dirname, "shots");
const BASE = "http://localhost:3000";

async function shoot(browser, width, hash, names) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/" + (hash || ""), { waitUntil: "domcontentloaded" });
  // wait for preloader to finish
  try { await page.waitForFunction(() => document.body.classList.contains("ready"), { timeout: 8000 }); } catch {}
  await page.waitForTimeout(500);
  // slow scroll to bottom to trigger reveals + scrub, then back to each shot target
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 250) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  });
  await page.waitForTimeout(800);
  for (const [label, sel] of names) {
    const el = page.locator(sel).first();
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(SHOTS, `r0-scroll-${label}-${width}.png`), clip: { x: 0, y: 0, width, height: 900 } });
  }
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  await shoot(browser, 1440, "", [
    ["manifesto", "#manifesto"], ["capabilities", "#capabilities"],
    ["approach", "#approach"], ["contact", "#contact"], ["footer", "footer"],
  ]);
  await shoot(browser, 375, "", [
    ["manifesto", "#manifesto"], ["capabilities", "#capabilities"],
    ["contact", "#contact"], ["footer", "footer"],
  ]);
  await browser.close();
  console.log("DONE r0-scroll");
})();
