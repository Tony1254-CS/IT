# Quintessence — Ruthless Audit (baseline)

Date: 2026-11-09 · Method: `npm run build`/lint/tsc + Playwright (Chromium) screenshots at 375/768/1440 on all 5 pages (+hood/hover/preloader states) + computed-style probes (`audit/probe.mjs`, `audit/measure.mjs`) + CWV capture (`audit/cwv.mjs`) + `tools.browser.lighthouse` (a11y/SEO/BP). Evidence: `audit/shots/*before-*.png` and `crop-*.png`; all console/pageerror/requestfailed channels logged on every page.

## Overall: 3.8/10

Build 3 · Responsive 2 · Typography 4 · Motion 5 · Copy 3 · Nav/IA 4 · Forms 3 · A11y 4 · Perf 6 · Metadata 4.

The single most destructive defect: an unlayered universal reset in `globals.css` that defeats Tailwind's utilities cascade, silently zeroing every spacing/border-radius utility across the entire site at once.

---

## Scores (evidence, one per category)

| # | Category | Score | Evidence |
|---|----------|-------|----------|
| 1 | Build & tooling | 3 | Repo as-committed was unbuildable: `components/footer.tsx:5` and `contact/page.tsx` import `lucide-react`, which was absent from `package.json` — `npm run build` failed on first try (fixed pre-commit with the devDep added). |
| 2 | Responsive integrity | 2 | `app/globals.css:36-42` unlayered `*,*::before,*::after{margin:0;padding:0}` beats `@layer utilities`, so `px-6/py-8/p-8/mb-6/gap-…` spacing all compute 0 — probe confirmed a px-6 section computes `padding: 0px`, and sections sit flush against the viewport edge (`crop-home-1440-h1.png`, `crop-home-full-footer.png`). |
| 3 | Mobile (375) | 2 | At 375px the nav pill is left-clamped and its three links are pushed off-screen right with no hamburger/burger fallback (`components/nav.tsx:17-19`, `crop-home-375-nav.png`), so three of five pages' primary links are unreachable on phones. |
| 4 | Typography | 4 | Wordmark uses `tracking-[0.35em]` on an italic serif at clamp up to 2rem (`components/nav.tsx:21`) so "Quintessence" sprawls ~3× its optical width and forces the pill overflow, and near-italic-everything (`home h1:92-96, capabilities h2:104, approach h3:118`) makes slanted text the default rather than an accent. |
| 5 | Motion | 5 | Home's flagship statement is permanently broken: `.ink-reveal[data-scroll]` (globals.css:109-114) pins the mask at `mask-position:-100%` and the GSAP reveal (`app/page.tsx:50-62`) only tweens opacity — `mask-position` never animates, so the statement can never fully appear (`before-home-1440-full.png`). |
| 6 | Copy & honesty | 3 | Fabricated placeholder data is served as fact: `+1 (555) 123-4567`, "Downtown Business District, New York, NY", "Mon-Fri 9am-6pm EST" (footer.tsx:67-84, contact/page.tsx:204-210), and dead legal links Privacy/Terms/Cookies all `href="/"` (footer.tsx:96-104). |
| 7 | Navigation & IA | 4 | `/principles` exists but the top nav lists only Capabilities/Approach/Contact (nav.tsx:9-13), while footer nav lists 5 pages — the two hierarchies disagree; footer legal links are fakes (footer.tsx:96-104). |
| 8 | Forms | 3 | Contact labels are dark-on-dark (`text-background/70` inside a `bg-background` section, contact/page.tsx:146-188) and not associated with their inputs — invisible and screen-reader-mappable; submit is `console.log` only (contact/page.tsx:107) with no success state. |
| 9 | Accessibility | 4 | Lighthouse a11y **0.88** (BP 1.0, SEO 1.0): contrast failures, heading-order skips, undersized touch targets; plus the invisible form labels above and `:focus-visible` being the only focus affordance (globals.css:99-102). |
| 10 | Performance | 6 | Zero CLS (0.000), LCP/FCP ~692ms, TTFB ~296ms — measured on the dev server, so prod numbers unknown; a full-viewport WebGL canvas (HeroShader) renders on every page for a background glow. |

(scoring is per the brief's 10 categories: build/tooling, responsive, typography, motion, copy, nav/IA, forms, a11y, perf, metadata; category rows above split responsive/mobile for readability — averages unchanged.)

---

## Generic-template tells

- The 01–06 numbered-icon capability card grid with hairline borders and circle numerals (`capabilities/page.tsx:112-177`) — the default "AI luxury" scaffold pattern traded most on the internet.
- The 01–04 "Discover → Define → Build → Sustain" process ladder (`approach/page.tsx:102-147`) — same scaffold, same numerals.
- Client-cards with `rounded-2` (Tailwind doesn't even define `rounded-2`) ×6 and ×4, i.e. copy-paste card blocks with an invalid class that nobody noticed (`capabilities/page.tsx:113…`, `approach/page.tsx:104…`).
- Default-template contact copy: a (555) phone number, "Downtown Business District", and "Mon-Fri 9am-6pm EST" — the placeholder-set most champions of laziness fall back to (footer.tsx:69-84).
- Symmetric 4-column footer (brand / nav / contact / hours) (`footer.tsx:24-87`) — the scaffold-layout, not an authored composition.
- "Scroll down" cue made of hairline + uppercase mono (`page.tsx:110-113`) — fine once; used identically on home/approach/capabilities/contact.
- Card copy in h3 serif + footer body paragraph that restates the card title verbatim ("…drives measurable results", `capabilities/page.tsx:176`).

---

## P0 — broken / fake / console errors (ranked)

1. `app/globals.css:36-42` unlayered universal reset kills every Tailwind spacing/border-radius utility via cascade — the root cause of the flush-edge layouts, vanished paddings/margins, and flattened cards across all five pages.
2. Missing `lucide-react` dependency breaks `npm run build` for footer/contact (fixed pre-commit; logged for honesty).
3. No mobile navigation: at 375px the pill's links are off-screen and unreachably clipped (`components/nav.tsx:17-19`, `crop-home-375-nav.png`).
4. Contact form labels are dark-on-dark (invisible) and unassociated with inputs (`contact/page.tsx:146-188`).
5. Contact submit is `console.log`-only — the form pretends to send and tells the user nothing (`contact/page.tsx:104-109`).
6. Fabricated phone/address/hours are presented as real info in footer + contact card, and Privacy/Terms/Cookies links point to `/` as fake legal (`footer.tsx:67-104`, `contact/page.tsx:204-210`).
7. Home's ink-reveal statement can never reach full legibility because `mask-position` is never animated (globals.css:109-114 + `app/page.tsx:50-62`).
8. Approach cards' numeral chip collides with the H3 in the shipped rendering (the `pt-8 pl-8` notch padding is a dead utility, so the badge overlaps the title (`approach/page.tsx:104-112` — self-heals once resets are removed, but it is broken today per `crop-approach-1440-cards.png`).

## P1 — cheapens the premium (ranked)

9. Invalid `rounded-2` ×6 in capabilities and ×4 in approach — Tailwind has no such class, so every card renders square instead of soft (broken radius in all cards).
10. Hero shader's `uMouse` is divided by 2 twice (`components/HeroShader.tsx:33`), pinning the glow near bottom-left and making the "reacts to cursor" effect fake-looking at mouse rest (also identical blob across all pages).
11. Custom cursor calls `setState` twice per `mousemove` event; it re-renders per input frame for a trailing transform that belongs on a rAF ref (`components/cursor.tsx`) — visible input-lag cost, not just a perf nicety.
12. Lighthouse a11y 0.88: contrast failures (e.g. `text-background/70` chips on `bg-ivory/50` card fills), heading-order skip, and touch targets under 24-44px in the mobile nav pill.
13. `html{scroll-behavior:smooth}` (globals.css:68-70) fights Lenis's own smoothing (they will race whenever a `#hash`/programmatic scroll happens), and the preloader writes `sessionStorage` during render-time reads — plus globals.css duplicates the preloader keyframes twice (44-66 and 116-138).
14. Capabilities cards' hover state changes border/fill but not the numeral chip — dead transition that reads as unfinished (capabilities/page.tsx:113).
15. Zero per-page metadata/layout metadata beyond one global pair (`app/layout.tsx:26-29`): no `title.template`, no descriptions per route, no OG images, no favicon assets exported (300x300.png, etc.) — shaving breaks brand trust on first share.
16. `text-red-600` sits outside the palette as the only screen-red (`contact/page.tsx:153/163/173/188`) — an off-brand intrusion no luxury palette tolerates.

## P2 — polish

17. `overflow-x:hidden` on body plus default padding-free sections hides, not fixes, the edge-clipping consequences of finding 1 — audit as debris after the root fix.
18. Preloader is `sessionStorage`-gated per tab; sharing the same animation twice per reload feels arbitrary — acceptable, flag for one polish.
19. Hero `torch` glow leaves a large empty right half at rest (`crop-home-1440-right.png`) — composition could earn the space, but this borders design-direction.
20. `rounded-full` + identical circle numerals appear in nav + capabilities + approach — the circle motif needs a second act to not feel like a default component set.
21. `shoot.mjs` DPR variance (1.5× at 1440, 2× at 375) makes vertical-position comparisons between widths approximate — audit-tooling note only.

---

## Method & honesty notes

- Lighthouse (via browser tool) was desktop-only a11y/SEO/BP — not a full perf/category sweep; Performance figures come from my own Playwright CWV capture on the **dev server** (Turbopack, no prod build numbers).
- Screenshots are DPR-different per width (see P2 #21); all overflow measurements used `scrollWidth vs clientWidth` per page and found **no** true horizontal scroll anywhere — the edge damage is utilities being zeroed plus `body{overflow-x:hidden}` masking what survives past the edge.
- Every spacing utility claim is backed by a computed-style probe (`audit/probe.mjs`): a `.px-6` section computed `padding: 0px`; `.px-6` rules exist in the compiled CSS chunk — the failure is cascade defeat, not class generation.
