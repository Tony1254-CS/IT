/* Round-3 supplement v2: line-box count of the hero CTA label via Range rects.
 * A wrapped label yields >= 2 client rects from the range over its text node;
 * the flex container itself is always a single box, so that measure is useless. */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const browser = await chromium.launch();

for (const width of [375, 768, 1440]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: width === 1440 ? 1.5 : 2,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("quintessence:preloader:shown", "1"); } catch {}
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);
  const hero = await page.evaluate(() => {
    const a = [...document.querySelectorAll("main a")].find((e) => e.classList.contains("h-12"));
    if (!a) return null;
    const text = [...a.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    const range = document.createRange();
    if (!text) return { error: "no text node" };
    range.selectNodeContents(text);
    const rects = [...range.getClientRects()].map((r) => ({
      w: Math.round(r.width),
      h: Math.round(r.height),
      y: Math.round(r.y),
    }));
    const pr = a.getBoundingClientRect();
    return {
      labelLines: new Set(rects.map((r) => r.y)).size,
      lineRects: rects,
      pill: { w: Math.round(pr.width), h: Math.round(pr.height) },
      title: rects.length ? (a.textContent || "").trim() : "",
    };
  });
  console.log(`@${width} hero CTA label lines: ${JSON.stringify(hero)}`);
  await ctx.close();
}
await browser.close();
console.log("DONE");
