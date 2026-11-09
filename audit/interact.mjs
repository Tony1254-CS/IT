/* Interactive checks after P0 round: statement reveal on scroll, contact form errors + success. */
import { chromium } from "playwright";
import path from "node:path";

const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\"));
const SHOTS = path.join(OUT, "shots");
const BASE = "http://localhost:3000";
const browser = await chromium.launch();

// 1) Statement reveal on home (scroll down through the session)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 812 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("quintessence:preloader:shown", "1"); } catch {}
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);
  // Wheel-scroll down until the statement section is centered
  await page.evaluate(() => {
    const el = document.querySelector("section.bg-ivory");
    if (el) el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);
  // Keep wheel-stepping until the ink-reveal mask is fully open (0% 0px),
  // capped at 24 x 500px steps, sampling the mask every 3rd step.
  let mask = "?";
  for (let i = 0; i < 24; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(350);
    if (i % 3 === 0) {
      mask = await page.evaluate(() => {
        const el = document.querySelector(".ink-reveal");
        if (!el) return "?";
        const cs = getComputedStyle(el);
        return cs.maskPosition || cs.webkitMaskPosition || "?";
      });
      if (mask === "0% 0px") break;
    }
  }
  await page.waitForTimeout(1200);
  const reveal = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".ink-reveal")];
    return els.map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        mask: cs.maskPosition || cs.webkitMaskPosition || "?",
        opacity: cs.opacity,
        top: Math.round(r.top),
        visible: r.top < 812,
        text: (el.textContent || "").slice(0, 40),
      };
    });
  });
  console.log("STATEMENT:", JSON.stringify(reveal, null, 1));
  await page.screenshot({ path: path.join(SHOTS, "after2-home-1440-statement.png") });
  await ctx.close();
}

// 2) Contact form: invalid submit (errors), then valid submit (success block)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 812 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("quintessence:preloader:shown", "1"); } catch {}
  });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);

  // invalid submit
  await page.click("button[type='submit']");
  await page.waitForTimeout(600);
  const errors = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("form .text-error, form [class*='text-error']")) {
      const cs = getComputedStyle(el);
      out.push({ text: el.textContent.trim().slice(0, 60), color: cs.color, visible: el.offsetParent !== null });
    }
    return out;
  });
  console.log("ERRORS:", JSON.stringify(errors, null, 1));
  await page.locator("form").screenshot({ path: path.join(SHOTS, "after2-contact-1440-errors.png") });

  // valid submit
  await page.fill("#name", "Amara Okafor");
  await page.fill("#email", "amara@studiox.co");
  await page.fill("#message", "Mobile logistics app — 3-month build, Android + iOS.");
  await page.selectOption("#budget", "$100k+");
  await page.click("button[type='submit']");
  await page.waitForTimeout(900);
  const success = await page.evaluate(() => {
    const h = [...document.querySelectorAll("h3, h2, p, h4")].find((e) => (e.textContent || "").includes("Thank you"));
    if (!h) return { found: false };
    const card = h.closest("div");
    return { found: true, text: card?.textContent.replace(/\s+/g, " ").trim().slice(0, 160), visible: h.offsetParent !== null };
  });
  console.log("SUCCESS:", JSON.stringify(success, null, 1));
  // form unmounts on success; the success card is the rounded-2xl box containing "Thank you"
  const successCard = page.locator("div.rounded-2xl", { hasText: "Thank you" }).first();
  await successCard.screenshot({ path: path.join(SHOTS, "after2-contact-1440-success.png") });
  await ctx.close();
}

await browser.close();
console.log("DONE");
