// CWV at mobile viewport: CLS, LCP, FCP, plus preloader duration.
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
const cwv = await p.evaluate(
  () =>
    new Promise((resolve) => {
      const out = { cls: 0, lcp: 0, fcp: 0, ttfb: 0, shiftCount: 0, biggestShift: 0 };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (!e.hadRecentInput) {
            out.cls += e.value;
            out.shiftCount++;
            out.biggestShift = Math.max(out.biggestShift, e.value);
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) out.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (e.name === "first-contentful-paint") out.fcp = e.startTime;
      }).observe({ type: "paint", buffered: true });
      const nav = performance.getEntriesByType("navigation")[0];
      out.ttfb = nav.responseStart;
      setTimeout(() => resolve(out), 6000);
    })
);
console.log(JSON.stringify(cwv, null, 1));
await b.close();
