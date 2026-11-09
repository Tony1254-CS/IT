// Round-1 verification captures.
import { chromium } from "playwright";
import { join } from "path";
const SHOTS = join(import.meta.dirname, "shots");
const BASE = "http://localhost:3000";
(async () => {
  const b = await chromium.launch({ headless: true });
  // hero 1440
  const c1 = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p1 = await c1.newPage();
  const errs = [];
  p1.on("pageerror", e => errs.push(e.message));
  await p1.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  try { await p1.waitForFunction(() => document.body.classList.contains("ready"), { timeout: 8000 }); } catch {}
  await p1.waitForTimeout(600);
  await p1.screenshot({ path: join(SHOTS, "r1-home-1440-atf.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // approach nav contrast
  await p1.locator("#approach").scrollIntoViewIfNeeded(); await p1.waitForTimeout(800);
  await p1.screenshot({ path: join(SHOTS, "r1-approach-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // contact: sum hidden pristine, appears when dirty
  await p1.locator("#contact").scrollIntoViewIfNeeded(); await p1.waitForTimeout(800);
  const sumHidden = await p1.evaluate(() => getComputedStyle(document.querySelector("#sum")).display);
  await p1.fill("input[name=name]", "Test User"); await p1.waitForTimeout(400);
  const sumShown = await p1.evaluate(() => document.querySelector("#sum").classList.contains("show"));
  await p1.screenshot({ path: join(SHOTS, "r1-contact-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // submit copies (no mailto navigation)
  console.log(JSON.stringify({ sumHidden, sumShown, pageErrors: errs }));
  await c1.close();
  // mobile menu open
  const c2 = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const p2 = await c2.newPage();
  await p2.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  try { await p2.waitForFunction(() => document.body.classList.contains("ready"), { timeout: 8000 }); } catch {}
  await p2.waitForTimeout(600);
  await p2.click("#sb"); await p2.waitForTimeout(400);
  await p2.screenshot({ path: join(SHOTS, "r1-mobile-navopen-375.png"), clip: { x: 0, y: 0, width: 375, height: 812 } });
  await c2.close();
  await b.close();
  console.log("DONE r1");
})();
