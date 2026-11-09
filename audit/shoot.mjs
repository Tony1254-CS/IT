import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const SHOTS = join(import.meta.dirname, "shots");
mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [375, 768, 1440];
const BASE = "http://localhost:3000";

const PAGES = [
  { path: "/", name: "home" },
  { path: "/capabilities", name: "capabilities" },
  { path: "/approach", name: "approach" },
  { path: "/principles", name: "principles" },
  { path: "/contact", name: "contact" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const { path, name } of PAGES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
        deviceScaleFactor: 2,
      });
      const page = await ctx.newPage();

      // Collect console errors
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });

      // Skip preloader by clicking
      try {
        await page.click("body", { timeout: 1000 });
        await page.waitForTimeout(2500);
      } catch {}

      // Above the fold
      await page.screenshot({
        path: join(SHOTS, `${name}-${w}-atf.png`),
        clip: { x: 0, y: 0, width: w, height: 900 },
      });

      // Full page
      await page.screenshot({
        path: join(SHOTS, `${name}-${w}-full.png`),
        fullPage: true,
      });

      if (consoleErrors.length) {
        console.log(`Console errors on ${name} @${w}:`, consoleErrors);
      }

      await ctx.close();
    }
  }

  // Hover states at 1440
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    try {
      await page.click("body", { timeout: 1000 });
      await page.waitForTimeout(2500);
    } catch {}

    // Nav hover
    const navLink = page.locator("nav a").first();
    await navLink.hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(SHOTS, "hover-nav.png"),
      clip: { x: 0, y: 0, width: 1440, height: 150 },
    });

    // CTA hover
    const cta = page.locator('a:has-text("Begin a project")').first();
    await cta.hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(SHOTS, "hover-cta.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    await ctx.close();
  }

  // Capabilities card hover
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/capabilities`, { waitUntil: "networkidle" });
    try {
      await page.click("body", { timeout: 1000 });
      await page.waitForTimeout(2500);
    } catch {}
    // Scroll to cards
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const card = page.locator(".group").first();
    if (await card.isVisible()) {
      await card.hover();
      await page.waitForTimeout(500);
      await card.screenshot({
        path: join(SHOTS, "hover-card.png"),
      });
    }
    await ctx.close();
  }

  // Preloader mid-animation
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    // Clear session storage to force preloader
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => sessionStorage.removeItem("quintessence:preloader:shown"));
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400); // mid letter reveal
    await page.screenshot({
      path: join(SHOTS, "preloader-mid.png"),
    });
    await page.waitForTimeout(500); // curtain phase
    await page.screenshot({
      path: join(SHOTS, "preloader-curtain.png"),
    });
    await ctx.close();
  }

  await browser.close();
  console.log("Done - screenshots saved to", SHOTS);
})();
