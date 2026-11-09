import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const r = await p.evaluate(() => {
  const sec = document.querySelector("section");
  const h1 = document.querySelector("h1");
  const nav = document.querySelector("header nav") || document.querySelector("nav");
  const pill = nav ? nav.firstElementChild : null;
  const g = (el) =>
    el
      ? {
          cls: String(el.className).slice(0, 140),
          rect: `L${Math.round(el.getBoundingClientRect().left)} R${Math.round(
            el.getBoundingClientRect().right
          )}`,
          pl: getComputedStyle(el).paddingLeft,
          pr: getComputedStyle(el).paddingRight,
          w: Math.round(el.getBoundingClientRect().width),
          maxW: getComputedStyle(el).maxWidth,
          disp: getComputedStyle(el).display,
        }
      : null;
  let padRules = 0;
  let sheetN = 0;
  let cssLen = 0;
  for (const s of document.styleSheets) {
    sheetN++;
    try {
      for (const rule of s.cssRules) {
        if (rule.style && (rule.style.paddingLeft || rule.style.paddingRight)) padRules++;
        if (rule.cssRules)
          for (const rr of rule.cssRules)
            if (rr.style && (rr.style.paddingLeft || rr.style.paddingRight)) padRules++;
      }
      cssLen += s.cssRules?.length || 0;
    } catch {}
  }
  return { sec: g(sec), h1: g(h1), nav: g(nav), pill: g(pill), padRules, sheetN, cssLen };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
