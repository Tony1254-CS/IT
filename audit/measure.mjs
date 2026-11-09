// Measure horizontal overflow root cause on every page × viewport.
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const PAGES = ["/", "/capabilities", "/approach", "/principles", "/contact"];
const VPS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();

function fmt(r) {
  return `L${Math.round(r.left)} R${Math.round(r.right)} W${Math.round(r.width)}`;
}

for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.waitforTimeout ? null : null;
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600); // let preloader finish + settle

    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const vw = window.innerWidth;
      const out = {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        innerWidth: vw,
        scrollX: window.scrollX,
        bodyMargin: getComputedStyle(document.body).margin,
        bodyWidth: document.body.getBoundingClientRect().width,
        offenders: [],
        overflowers: [],
      };

      const sel = "header, nav, main, footer, section, h1, h2, p, form";
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.left < -1 || r.right > vw + 1) {
          const c = getComputedStyle(el);
          out.offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className).slice(0, 90),
            rect: `L${Math.round(r.left)} R${Math.round(r.right)}`,
            ml: c.marginLeft, mr: c.marginRight,
            pl: c.paddingLeft, pr: c.paddingRight,
          });
        } else if (r.left < 0.5 || r.right > vw - 0.5) {
          out.overflowers.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className).slice(0, 90),
            rect: `L${Math.round(r.left)} R${Math.round(r.right)}`,
          });
        }
      });
      // any element with huge negative margin / 100vw width
      document.querySelectorAll("body *").forEach((el) => {
        const c = getComputedStyle(el);
        if (c.position === "fixed" || c.position === "absolute") return;
        const w = el.getBoundingClientRect().width;
        if (w === 0) return;
        if (Math.abs(parseFloat(c.marginLeft)) > 20 || Math.abs(parseFloat(c.marginRight)) > 20) {
          out.offenders.push({
            tag: `${el.tagName.toLowerCase()}-MARGIN`,
            cls: String(el.className).slice(0, 90),
            rect: `ML${c.marginLeft} MR${c.marginRight} W${Math.round(w)}`,
          });
        }
      });
      // also check html/fs overflow of viewport
      out.htmlStyle = `m:${getComputedStyle(document.body).marginLeft}/${getComputedStyle(document.body).marginRight} w:${getComputedStyle(document.body).width}`;
      return out;
    });

    console.log(`\n=== ${vp.name}w ${p} ===`);
    console.log(`scrollWidth=${m.scrollWidth} clientWidth=${m.clientWidth} innerWidth=${m.innerWidth} scrollX=${m.scrollX} bodyW=${m.bodyWidth}`);
    console.log(`body margin=${m.bodyMargin} styles=${m.htmlStyle}`);
    console.log(`EDGE>CROSSERS (${m.offenders.length}):\n  ${m.offenders.slice(0, 12).map((o) => `${o.tag} ${o.rect} ${o.cls}`).join("\n  ")}`);
    console.log(`AT-EDGE (${m.overflowers.length}):\n  ${m.overflowers.slice(0, 12).map((o) => `${o.tag} ${o.rect} ${o.cls}`).join("\n  ")}`);
  }
  await ctx.close();
}
await browser.close();
console.log("\nDONE");
