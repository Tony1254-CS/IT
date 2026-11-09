/* Measure [data-scroll] reveal state at scroll-end for every page:
   flags opacity < 1 (dimmed ink) or mask != 0% (stalled scrub) at rest. */
import { chromium } from "playwright";
import path from "node:path";

const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/\//g, "\\"));
const SHOTS = path.join(OUT, "shots");
const BASE = "http://localhost:3000";
const PAGES = [
  ["/", "home"],
  ["/approach", "approach"],
  ["/capabilities", "capabilities"],
  ["/principles", "principles"],
  ["/contact", "contact"],
];
const browser = await chromium.launch();

for (const [route, name] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 812 }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("quintessence:preloader:shown", "1"); } catch {}
  });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);

  // Wheel-scroll to document bottom, stopping when scrollY stops advancing
  let lastY = -1;
  let stable = 0;
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(350);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y === lastY) { stable++; if (stable >= 2) break; } else { stable = 0; }
    lastY = y;
  }
  await page.waitForTimeout(1200); // let any tail tween settle

  const report = await page.evaluate(() => {
    const els = [...document.querySelectorAll("[data-scroll]")];
    return els.map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName + "." + (el.className || "").split(" ").slice(0, 2).join("."),
        opacity: cs.opacity,
        mask: cs.maskPosition || cs.webkitMaskPosition || "-",
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        visible: r.bottom > 0 && r.top < innerHeight,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 36),
      };
    });
  });
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`== ${route} (height ${pageHeight}, scrollY end ${lastY})`);
  for (const r of report) {
    const bad =
      (r.mask !== "-" && r.mask !== "0% 0px") ||
      (r.mask === "-" && Number(r.opacity) < 0.99);
    console.log(`  ${bad ? "FLAG" : " ok "} opacity=${r.opacity} mask=${r.mask} top=${r.top} bottom=${r.bottom} vis=${r.visible} | ${r.tag} | ${r.text}`);
  }
  await page.screenshot({ path: path.join(SHOTS, `after2-${name}-1440-bottomreveal.png`) });
  await ctx.close();
}

await browser.close();
console.log("DONE");
