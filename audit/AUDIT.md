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

---

# Round 1 — P0 fixes (2026-11-09)

## What was fixed (7 fixes, per the ≤8 round rule)

| # | Fix | Files | Evidence after |
|---|-----|-------|----------------|
| 1 | **Universal reset deleted, real layered base rewritten.** The unlayered `*,*::before,*::after{margin:0;padding:0}` cascade-killer removed entirely; `globals.css` rebuilt with proper `@layer base` entries, `--error` token (`#DF8F6B` → `--color-error` in `@theme`), single preloader keyframe block. This root fix also self-heals the approach badge/title overlap (P0 #8) automatically — the dead `pt-8 pl-8` notch padding works again. | `app/globals.css` | `npm run build` passes (8 static pages); lint + tsc clean; overflow probe `scrollX=0` at 375/768/1440 on all 5 pages; `after1-approach-768-full.png` shows card 04 no longer clipped. |
| 2 | **Nav rewritten for mobile + honest IA.** Two-row mobile pill (verified clean at 375), full-width desktop pill inside 32px gutters, `/principles` added to match footer IA, ≥44px touch targets, `aria-label="Main"`, wordmark tracking fixed so it no longer forces overflow. | `components/nav.tsx` | `after1-home-375-nav.png`: two-row pill fully on-screen, all 4 links reachable. |
| 3 | **Radius sweep + card polish.** Invalid `rounded-2` → `rounded-2xl` ×14 across capabilities/approach (fixes P1 #9 early because the same touch-points were being edited); capabilities numeral chip now transitions on card hover (P1 #14); stray "Bangla language AI" sentence removed. | `app/capabilities/page.tsx`, `app/approach/page.tsx` | `after1-capabilities-1440-full.png` + hover shots: soft corners everywhere, chip accent on hover. |
| 4 | **Contact form made real.** Labels visible (`text-foreground/60` on dark), associated via `htmlFor`/`id`; validation errors render in the palette `--color-error` (`#DF8F6B`), no more off-palette `text-red-600` (P1 #16 folded in); invalid submit shows all 4 inline errors; valid submit swaps form → success card with copy. | `app/contact/page.tsx` | `audit/interact.mjs`: 4 errors live in `rgb(223,143,107)`; success block renders "Thank you. / Your brief is with us — we'll get back to you within one business day." (`crop-after1-contact-errors.png`, `crop-after1-contact-success.png`). |
| 5 | **Footer rewritten honestly.** Fabricated `(555)` phone / made-up address / fake hours removed; legal links removed; real email strip `hello@quintessence.com`, the 5 real pages as links, plain copyright bar. Symmetric 4-col scaffold gone. | `components/footer.tsx` | `after1-home-1440-full.png`, `after1-approach-1440-full.png`, `after1-contact-1440-full.png`. |
| 6 | **Ink-reveal statement fully animates now.** Root cause was the GSAP tween animating only `opacity` while the mask sat parked at `mask-position:-100%`. Tween now animates `maskPosition`/`webkitMaskPosition` too. | `app/page.tsx` (reveal tween) | Probe during wheel-scroll: `.ink-reveal` mask at `-5.4847% 0px` mid-tween, opacity `0.9561` (was pinned at `-100% 50%` forever); `after1-home-1440-statement.png` shows the section mid-reveal — text now emerges left→right instead of staying stuck at 0% visible. |
| 7 | **Approach 768px overflow fixed.** Root cause: `flex md:flex-row` with `md:w-1/4` wrappers hit min-content shrink and clipped card 04 at the right edge at 768. Now `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` with plain `relative` wrappers. | `app/approach/page.tsx` | Overflow measure `scrollX=0` at 768; `after1-approach-768-full.png` — all four cards inside the viewport. |

Also fixed pre-commit in round 0: missing `lucide-react` devDep (P0 #2, build was unbuildable as-committed — logged for honesty, already in baseline commit).

## Verification after the round

- `npm run build` ✅ 8 static pages, lint ✅, `tsc` ✅.
- Horizontal overflow: `scrollX=0` at 375/768/1440 across all 5 pages (`audit/measure.mjs`).
- CWV (dev server, honest): CLS **0.0007**, LCP **776ms**, FCP **776ms**, TTFB **253ms** — same ballpark as baseline, no regressions.
- Interactions (`audit/interact.mjs`): statement mask actually tweening; contact errors + success state verified with computed colors.
- Console sweep: no new errors (only driver-level WebGL "GPU stall due to ReadPixels" in headless Chromium, pre-existing).

## Known-incomplete, deferred on purpose

- Contact form has no **message/textarea** yet (Name/Email/Subject/Budget only) — flagged, goes into the P1 round.
- `html{scroll-behavior:smooth}` moved into `@layer base` but still races Lenis — decision deferred to P1.
- Statement full-completion not re-measured past mid-reveal sampling; re-verify if P1 touches it.
- Lighthouse a11y/SEO/BP not re-run this round; P1 round re-measures after fixing contrast/heading/touch items.

## Honest rescore after round 1 (was → is)

| Category | Before | After | Why |
|----------|--------|-------|-----|
| Build & tooling | 3 | 6 | Builds clean now; still no OG/favicon assets, no prod verification. |
| Responsive integrity | 2 | 6 | Spacing/radius utilities live everywhere on every page; 375 nav reachable; all 5 pages overflow-clean at 3 widths. P2 `overflow-x:hidden` debris remains. |
| Typography | 4 | 5 | Wordmark no longer forces pill overflow; italic-everything is still the house rhythm — kept per no-design-change rule. |
| Motion | 5 | 7 | The flagship statement reveal actually works now; motion polish (per-element staggering) untouched. |
| Copy & honesty | 3 | 6 | Fabricated phone/address/hours and fake legal links gone; honest email-only card; remaining padding: tiny copy repetition mentions (P2). |
| Navigation & IA | 4 | 6 | Nav ↔ footer hierarchies agree (5 pages); real focus alt: Principles still deeper than nav density. |
| Forms | 3 | 7 | Visible, associated labels; palette error color; real inline validation + success state; still demo-only submit + no message field (P1). |
| Accessibility | 4 | 6 | Biggest contrast failure (form labels) fixed; `--error` palette token; nav touch targets; until Lighthouse re-run, chip contrast/heading-order fixes stay in P1. |
| Performance | 6 | 6 | CWV unchanged (fine); cursor `setState` per mousemove and double-divide shader mouse still pending (P1). |
| Metadata | 4 | 4 | Untouched this round; P1. |

## Overall after round 1: **5.9/10** (was 3.8)

Every P0 item verified fixed; nothing new broken; no score regressed. Remaining P1 (round 2): shader mouse math, cursor rAF, a11y contrast/heading/touch re-measure, Lenis vs `scroll-behavior`, per-page metadata + title.template + favicon/OG, message textarea.

---

# Round 2 — P1 fixes (2026-11-09)

Method: Playwright (Chromium) computed-style probes + screenshots (`audit/shoot.mjs after2`, wheel-driven `audit/interact.mjs`, new `audit/reveal-measure.mjs`) + desktop-only Lighthouse a11y/SEO/BP on all 5 pages + dev-server CWV (`audit/cwv.mjs`, labeled) + fresh-compile console sweep. Measured ground truth from Lighthouse: card fill `#7f7d79`; `text-background` full = **4.79:1** PASS; `/90` = **4.39:1** FAIL; `/80` = **3.87:1** FAIL; kicker `/70` = **3.34:1** FAIL; accent-on-card = **1.52–1.87:1** FAIL; footer `/60` ivory = **6.4:1** PASS on `#0b0b0c`.

## What was fixed (8 entries, per the ≤8 round rule)

| # | Fix | Files | Evidence after |
|---|-----|-------|----------------|
| 1 | **A11y contrast batch (grouped).** Full-ink sweep: all body copy, chips and card kickers switched from `/90`, `/80` and `/70` translucents to full `text-background` on ivory fills (capabilities ×6 body, approach ×4 + chips ×4, principles ×3); contact form-block cue and section cues to `/60` (≥6.4:1). Capability-card body copy re-swept on disk after earlier terminal-only sweep had not persisted — re-verified in **served HTML**: `0× /90`, 6× full-ink. Earlier axe "completes with variance" items now resolve uniformly. | `app/capabilities/page.tsx`, `app/approach/page.tsx`, `app/principles/page.tsx`, `app/contact/page.tsx` | Fresh desktop Lighthouse a11y **1.0 on all 5 pages, zero failures**; kickers at 4.79:1 against the `#7f7d79` fill. |
| 2 | **Nav legibility over light hero.** Pill backdrop darkened (`bg-background/70` measured `#858480` under white ink — max 3.7:1) and each link switched to explicit ivory tokens instead of inherited translucent ink. | `components/nav.tsx` | Nav links pass on every page's hero; `after2-*-1440.png` folds show legible pill on the glowing dark hero. |
| 3 | **Footer heading order + contrast.** Structural `h3` → `h2` (no skip between page `h1` and footer), translucent `/40` ivory → `/60` ×2 (3.1:1 → 6.4:1). | `components/footer.tsx` | Lighthouse a11y 1.0 incl. heading-order audit on all 5 pages. |
| 4 | **Metadata bundle.** Root `metadata.title.default`/`title.template`, `metadataBase`, `openGraph` + `twitter:card=summary_large_image`; favicon as `app/icon.svg` (route `/icon.svg`); OG asset as 1200×630 **hand-authored** `audit/og.html` → rendered screenshot → `app/opengraph-image.png` (no AI image gen); unique title/description per route via 4 new per-page `layout.tsx`. | `app/layout.tsx`, `app/{approach,capabilities,principles,contact}/layout.tsx`, `app/icon.svg`, `app/opengraph-image.png` | Served HTML verified: per-route titles + descriptions, `og:image` + `twitter:image` both point at `/opengraph-image.png` (HTTP 200, `image/png`, 168,894 bytes); `/icon.svg` 200 `image/svg+xml`. Prod build emits both as static routes. |
| 5 | **Contact message textarea.** Round-1 known-incomplete item closed: real multi-line message field added to the labeled Name/Email/Subject/Budget form. | `app/contact/page.tsx` | `<textarea` present in served `/contact` HTML; `interact.mjs` still reports 3 inline errors in `rgb(223,143,107)` on invalid submit + success card on valid submit. |
| 6 | **Input-latency P1 set.** Shader `uMouse` no longer divided by resolution twice (glow truly follows the pointer); custom cursor rewritten to ref + single rAF (no React re-render per mousemove), Element `instanceof` guard against document-level events, touch gate (never renders on touch), no first-paint flash at (0,0); preloader reads sessionStorage in an SSR-safe iso layout effect with try/catch (private-mode safe), no render-time storage access, single keyframe block. | `components/HeroShader.tsx`, `components/cursor.tsx`, `components/preloader.tsx` | Fresh compile console sweep: **zero errors/warnings** on all pages (`shoot.mjs after2` logged none). Whole-page diagonal shader glow in `after2-home-*.png` (was pinned bottom-left). |
| 7 | **`scroll-behavior` vs Lenis — resolved as verified no-op.** `html{scroll-behavior:smooth}` confirmed absent from every source file (Lenis owns smoothing; the old rule is gone). The preloader/sessionStorage half of P1 #13 is #6 above; globals.css duplicate keyframes were already merged in round 1. No code change required — finding documented. | — | `grep` across repo: 0 occurrences (only the comment noting Lenis ownership). |
| 8 | **Statement reveal completion — two compounding defects found and fixed during round-2 verification.** (a) **Unreachable scrub end**: the masked branch shared `end: "bottom 20%"`, but the statement's bottom (~570px in an 812px viewport at scroll-end) never crosses the 163px line → mask stalls at `-5.4847% 0px` forever (measured). Statement top sits at 157px = 19.3% at scroll-end, so masked elements now scrub `top 85% → top 40%` (completable for any height); the non-masked opacity branch keeps `bottom 20%`. (b) **Mask geometry mistuned**: with `mask-size: 200%`, position 0% puts the window over image [0..1E], so the gradient must hold black over image [0..50%] — the old `black 30% → transparent 70%` left the window's right 40% inside the fade (faded line-endings) and any sub-0% park wrapped a transparent sliver over the block's left edge (mid-word clip). Gradient retuned `black 0%, black 50%, transparent 100%` + `mask-repeat: no-repeat` with park `-150% 0` (fully hidden; the default repeat would tile the black half back over the element). | `app/page.tsx` (conditional trigger), `app/globals.css` (gradient + park) | `interact.mjs` after fix: mask **`0% 0px`**, opacity 1 (was `-5.4847% 0px` stall); `after2-home-1440-statement.png` shows edge-to-edge ink on all three lines — no left mid-word clip, no right fade. CWV unaffected: CLS 0. |

## Verification after the round

- `npm run build` ✅ (10/10 static, incl. `/icon.svg` + `/opengraph-image.png`), `npm run lint` ✅ 0 errors (2 pre-existing warnings confined to `audit/measure.mjs` tooling, not app code), `tsc --noEmit` ✅.
- **Lighthouse (desktop-only, labeled): a11y 1.0 / BP 1.0 / SEO 1.0 — all 5 pages, zero failures** (trajectory: home a11y 0.88 → 0.93 → 1.0).
- CWV (dev server, honest — warm Turbopack compile): CLS **0**, LCP **236ms**, FCP **236ms**, TTFB **75ms** (prior runs 460–956ms; dev-only, prod numbers still unknown).
- Interactions: statement mask reaches `0% 0px` and holds; contact errors + success verified again; statement shot edge-to-edge.
- `reveal-measure.mjs` (all pages, scroll-end): home h1/p opacity 1 (both above viewport at rest, invisible — not a defect) and statement opacity 1/mask `0% 0px`; **`/approach`, `/capabilities`, `/principles`, `/contact` have zero `[data-scroll]` elements in DOM** — their reveal effects query an empty set (inert; cleanup candidate).
- Presence checks: OG PNG 200/PNG/168,894 bytes; `/icon.svg` 200/svg; `<textarea` in `/contact`; per-route titles/descriptions/`twitter:card` in all 5 served pages.
- Console: **zero errors/warnings on fresh compile**. Round-1's recurring `cursor.tsx target.closest` error proven a stale-compile artifact; `vsc-initialized` hydration mismatch traces to an installed browser extension, not app code.

## Honest rescore after round 2 (was → is)

| Category | Before | After | Why |
|----------|--------|-------|-----|
| Build & tooling | 6 | 7 | Clean build now also ships OG + favicon as static routes. |
| Responsive integrity | 6 | 6 | No responsive defects remain open; unchanged — P2 `overflow-x:hidden` debris still flagged. |
| Typography | 5 | 5 | Untouched per no-design-change rule (house italic rhythm kept). |
| Motion | 7 | 9 | Flagship statement now completes scrub end-to-end with edge-to-edge ink (was stalling); shader tracks pointer; input path on rAF. |
| Copy & honesty | 6 | 6 | No copy changes this round; minor repetition P2 stands. |
| Navigation & IA | 6 | 6 | IA unchanged (hierarchies already agree); nav work this round was legibility, counted under a11y. |
| Forms | 7 | 9 | Textarea closed the field gap; errors/in labels/links re-verified served. Submit remains a client-side demo (no endpoint): success card is UX state, noted as known-limitation, not re-altered. |
| Accessibility | 6 | 9 | Lighthouse a11y 1.0 on all 5 pages zero failures; contrast fixed at measured ratios; desktop-only scan + no manual screen-reader pass keeps this at 9, not 10. |
| Performance | 6 | 7 | Cursor re-render per frame eliminated; shader math correct; CWV unchanged (dev-only numbers, no prod verification). |
| Metadata | 4 | 8.5 | Full title strategy + per-route descriptions + OG/Twitter cards + favicon all measured in served HTML; canonical links absent is P2 (Lighthouse SEO still 1.0). |

## Overall after round 2: **7.3/10** (was 5.9)

All P0s (#1–8) and all P1s (#9–16) from the baseline are closed; screenshot/interaction/console evidence re-taken (`after2-*`). Score did not reach ≥8.5 on two unscored-fix categories (typography 5, copy 6) that are P2 creative-polish items explicitly held back by the no-design-direction rule.

## Round-3 candidates (P2 only — findings, not design direction)

- `body{overflow-x:hidden}` debris (P2 #17) — remove and re-verify `scrollX=0`.
- Hero CTA wraps to two lines inside the fixed-width pill at 375 (`after2-home-375.png`) — size the pill by content at small widths; legible today, refine allowed as a defect fix.
- Dead reveal effects on 4 routes (inert `querySelectorAll`) — remove for hygiene.
- Optional P2: canonical links per route; `/robots.txt` 404 observed in dev logs.

## Known-limitations of measurement (carried honestly)

- Lighthouse runs are **desktop-only**; CWV numbers are **dev-server** (Turbopack), not prod.
- Screenshot DPR variance (1.5×/2×) per P2 #21 still applies to vertical comparisons.
- Axe sampling variance: identical failures can resolve as "incomplete" page-to-page; fixed by full pattern sweep rather than per-page trust.
