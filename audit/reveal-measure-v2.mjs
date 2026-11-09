/* Round-3 pre-edit probe (v2 — corrects round-2's wrong "dead reveal" finding).
 * 1) Reads the ROUTE-SPECIFIC reveal attributes each page actually wires
 *    (home: [data-scroll]; others: [data-<route>-reveal]) at scroll-end
 *    and reports computed opacity — answers whether the scrub completes
 *    or stalls like the statement mask did before the round-2 fix.
 * 2) Lifts body{overflow-x:hidden} IN-PAGE only (no source edit) and
 *    measures documentElement.scrollWidth vs innerWidth at 375/768/1440
 *    on all 5 routes — answers whether the rule is safe debris to remove.
 * 3) Measures the hero CTA pill's client rects (1 rect = single line,
 *    2 rects = wrapped label) at 375 and 1440.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

const ROUTES = [
  ["/", "[data-scroll]"],
  ["/approach", "[data-approach-reveal]"],
  ["/capabilities", "[data-cap-reveal]"],
  ["/principles", "[data-principles-reveal]"],
  ["/contact", "[data-contact-reveal]"],
];
const VIEWPORTS = [375, 768, 1440];

const browser = await chromium.launch();

async function probe(url, sel, width) {
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: width === 1440 ? 1.5 : 2,
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { sessionStorage.setItem("quintessence:preloader:shown", "1"); } catch {}
  });
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2800);

  // (2) horizontal overflow with the body rule lifted, pre-edit, no source change
  const overflow = await page.evaluate(() => {
    const b = document.body;
    const before = b.style.overflowX;
    b.style.overflowX = ""; // lift body{overflow-x:hidden} for measurement
    const r = {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      scrollX: window.scrollX,
      bodyScrollWidth: b.scrollWidth,
    };
    b.style.overflowX = before;
    return r;
  });
  overflow.overhang = overflow.scrollWidth - overflow.innerWidth;

  // scroll fully to the end, wait for scrub to settle
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);

  // (1) reveal completion with the correct selector
  const reveals = await page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        sel,
        opacity: Number(cs.opacity),
        top: Math.round(r.top),
        aboveViewport: r.bottom < 0,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
      };
    });
  }, sel);

  // (3) CTA pill geometry (home only)
  let cta = null;
  if (url === "/") {
    cta = await page.evaluate(() => {
      const a = [...document.querySelectorAll("a")].find((e) =>
        (e.textContent || "").toLowerCase().includes("begin a project")
      );
      if (!a) return null;
      const rects = [...a.getClientRects()].length;
      const r = a.getBoundingClientRect();
      return {
        clientRects: rects,
        width: Math.round(r.width),
        height: Math.round(r.height),
        wrapped: rects > 1,
      };
    });
  }
  await ctx.close();
  return { url, width, overflow, reveals, cta };
}

const results = [];
for (const [url, sel] of ROUTES) {
  for (const width of VIEWPORTS) {
    results.push(await probe(url, sel, width));
  }
}
await browser.close();

for (const r of results) {
  const flag = (f) => (f ? "  <-- FLAG" : "");
  console.log(`${r.url} @${r.width}`);
  console.log(
    `  overflow lifted: scrollW ${r.overflow.scrollWidth} vs inner ${r.overflow.innerWidth} (overhang ${r.overflow.overhang}, scrollX ${r.overflow.scrollX})${flag(r.overflow.overhang > 0)}`
  );
  for (const x of r.reveals) {
    console.log(
      `  reveal ${x.sel}:${JSON.stringify(x)}${flag(x.opacity < 0.98 && !x.aboveViewport)}`
    );
  }
  if (r.cta) console.log(`  CTA pill: ${JSON.stringify(r.cta)}${flag(r.cta.wrapped)}`);
}
console.log("DONE");
