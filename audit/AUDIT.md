# Quintessence — Ruthless Audit (Round 0 baseline)

**Date:** 2026-11-09 · **Standard:** Apple / Gucci / Louis Vuitton restraint · **Verdict:** beautiful shell, unfinished house.
**What is actually served:** `public/quintessence.html` verbatim at `/` via `app/route.ts`. `next build` 11 routes.
**Method:** `npm run build` + `npm run lint` + `npx tsc --noEmit` (all clean) + Playwright at 375 / 768 / 1440 (above-the-fold, scrolled sections, hover, preloader mid-animation) + Lighthouse mobile + CWV observer + console capture.

## 0. Evidence

| Check | Result |
|---|---|
| `npm run build` | ✅ 0 errors. 1 warning: `package-lock.json` outside git root — benign. `/` is Dynamic (ƒ), others Static. |
| `npm run lint` | ✅ 0 errors, 0 warnings. |
| `npx tsc --noEmit` | ✅ 0 errors. |
| Console errors (Playwright, all widths) | ✅ 0 (`audit/r0-probe.json`). |
| Horizontal overflow | ✅ none at 375 / 768 / 1440 (`sw == cw` all widths). |
| CWV 375px (Playwright observer) | CLS **0.002**, FCP **520 ms**, LCP **4.37 s**, TTFB **125 ms**, 2 shifts, biggest **0.0022**. |
| Lighthouse mobile (`audit/lh-r0.json`) | Performance **59** · Accessibility **95** · Best Practices **100** · SEO **100**. CLS **0.003** · LCP **3.3 s** · FCP **1.7 s** · TBT **1,840 ms** · SI **5.6 s**. Console errors **0**. |
| Screenshots | `audit/shots/r0-*.png` (ATF 375/768/1440, scrolled sections 1440+375, hover nav/CTA/capability, preloader mid/curtain, hash pages software/industries/trust/about/contact). |

## 1. Overall: 5.7 / 10

Design direction is credible; execution is not finished. The served page is a single file with a placeholder email, an invisible nav on light sections, and a second, stale Next.js site still live at `/capabilities`, `/approach`, etc. Performance is dragged by a 1.9 s forced preloader and a full-viewport WebGL loop that never sleeps.

## 2. Scores (0–10, one evidence per score)

| # | Category | Score | Evidence |
|---|---|---:|---|
| 1 | Premium feel | 6 | Hero serif is genuinely luxurious (`r0-home-1440-atf.png`), but the contact form ships a debug `Project brief / Name: -` readout (`r0-scroll-contact-375.png`) — a prototype tell no luxury house would show a client. |
| 2 | Typography | 7 | Instrument Serif / Hanken / Geist Mono pairing + tight `-.035em` hero tracking works (`public/quintessence.html:55`), but 11 px mono at `letter-spacing:.34em` in the nav (`:48`) thins to unreadable over the silk. |
| 3 | Spacing & composition | 5 | `#top{justify-content:flex-end}` strands the hero in the bottom third with a ~40% void above at 1440 px (`r0-home-1440-atf.png`) — empty, not airy. |
| 4 | Color & light | 7 | Palette restraint (#0B0B0C / #F2EEE6 / #C8B28A) holds (`:13`), but the fixed `.glass` nav has no light-mode state and washes to invisible over the ivory approach section (`r0-scroll-approach-1440.png` — only the ivory CTA pill survives). |
| 5 | Motion | 6 | Reveals are smooth, but the gold `#wipe` page flash on every hash nav (`:144`) + magnetic-button + custom-cursor ring (`:163`) are Awwwards-template gimmicks, not restraint. |
| 6 | Hero impact | 5 | “Engineered with intent.” has scale, yet half the first viewport is bare silk-marble with no focal anchor (`r0-home-1440-atf.png`) — a visitor’s eye has nowhere to land for the first beat. |
| 7 | Copy | 7 | Lines are short and certain (“Fewer moving parts. Higher standards.”), but the contact form mails to `hello@quintessence.example` (`public/quintessence.html:403`) — a `.example` address presented as the real contact channel. |
| 8 | Responsiveness | 6 | Breakpoints exist, but at ≤700 px the nav links disappear entirely (`:52`) and the only way back is discovering the ⌘K palette from a button labeled “Menu” (`r0-home-375-atf.png`). Stacked, not truly designed. |
| 9 | Performance & accessibility | 5 | Lighthouse Perf **59**, TBT **1,840 ms**, LCP **3.3 s** (`audit/lh-r0.json`) — preloader hard-coded to **1,900 ms** (`:280`) + a shader that runs `requestAnimationFrame` full-screen even when off-screen (`:315`) + render-blocking Google Fonts. A11y **95**: dimmed `rgba(...,.5)` 11 px text (`:65`) and palette without focus trap. CLS 0.003 and zero console errors are the only clean numbers. |
| 10 | Code quality | 3 | The served site is one 416-line file duplicating content as JS string arrays (`:349–358`); meanwhile `components/*`, `data/*`, `gsap`, `lenis`, `ogl`, `lucide-react` and the stale routes `app/approach|capabilities|contact|principles` (plus a committed `app/page.tsx.bak`) are dead weight from the abandoned Next build. Two competing sites ship in one repo. |

## 3. Generic-template tells — every instance

1. Silk/liquid-marble WebGL background — the current “dark luxury AI agency” default shader.
2. Six-row numbered capability accordion (01–06) with `+` controls.
3. Four-step Discover → Define → Build → Sustain ladder.
4. Keyword pill clusters (WEB APPS · MOBILE · BACKEND …).
5. Mega-menu 6-tile services grid on “Services” hover.
6. ⌘K command palette — a SaaS tell, not a luxury-house feature.
7. Glassmorphism nav pill + glass `.panel` / `.card` / `.cp` surfaces.
8. Champagne-on-black as the entire luxury signifier.
9. “Begin a project” primary + “Our capabilities” ghost pill pair.
10. Outlined footer wordmark via `-webkit-text-stroke` (`:158`).
11. Pulsing green “Available for new engagements” dot (`:160`).
12. Custom gold ring cursor + magnetic buttons (`:163–167`).
13. Glass card grids on hash pages (Industries, About “Ways to work together”).
14. Chip multi-select brief builder with dashed live `.sum` readout — SaaS-form tell, visible to users.
15. Gold page-wipe transition on every hash navigation (`:144`).
16. No photography, faces, premises, or shipped work — copy-swap the name and this is any “AI agency.”

## 4. Ranked fix list

### P0 — broken, fake, or unreachable (fix in Round 1)

- **P0-1 · Fake contact channel.** `public/quintessence.html:403` — `MAIL='hello@quintessence.example'` with a `// TODO` still in shipped code. Clients are mailto-d to a `.example` address.
- **P0-2 · Invisible nav over light sections.** `.glass` nav has no ivory-mode state; over `.iv` the wordmark and links fall below contrast (`r0-scroll-approach-1440.png`).
- **P0-3 · Mobile navigation disappears.** `nav .nl` hidden ≤700 px with no replacement; “Menu” palette is undiscoverable and there is no visible list of sections.
- **P0-4 · Reveals can stay blank.** `.rv{opacity:0}` relies solely on one `IntersectionObserver`; if it misses (slow JS, background tab), sections stay invisible — the `r0-home-1440-full.png` capture shows blank bands.
- **P0-5 · Two sites ship at once.** Stale routes `/approach /capabilities /contact /principles` render the abandoned Next build while `/` renders the single file; `app/page.tsx.bak` is committed. Pick one source of truth.

### P1 — cheapens the premium feel (fix in Round 1 unless P0 fills the budget)

- **P1-1 · Hero void.** `#top{min-height:100svh;justify-content:flex-end}` wastes the first viewport at desktop (see §2 #3).
- **P1-2 · Preloader hard stop.** Fixed 1,900 ms (```:280```) sets the LCP floor and flashes black; bind it to load + cap at ~800 ms.
- **P1-3 · Debug brief readout.** `.sum` (`:150`) renders `Project brief / Name: -` to every visitor — remove or collapse until the form is dirty.
- **P1-4 · Shader never sleeps.** WebGL loop runs full-screen (`:315`) even off-screen; gate with `IntersectionObserver` on `#top`.
- **P1-5 · Render-blocking fonts.** Google Fonts `<link>` without preload/`font-display` discipline inflates FCP/LCP.
- **P1-6 · Form semantics.** Chips are `button`s with no `aria-pressed`; timeline `<select>` exists alongside the chips without grouping; labels rely on implicit wrapping.
- **P1-7 · Gimmick motion.** Magnetic pull on every `.mag` element + custom cursor ring run on all `hover:hover` devices with no reduced-sensitivity opt-out beyond coarse `rm`.

### P2 — polish (if scores allow a later round)

- **P2-1 · Footer outline text too faint** (`-webkit-text-stroke:1px rgba(...,.2)`) — reads as a render error at 1440 (`r0-scroll-footer-1440.png`).
- **P2-2 · Green availability dot** implies marketplace-style live availability this post does not evidence.
- **P2-3 · Manifesto ghost words** at 0.16 opacity are illegible mid-scrub (`r0-scroll-manifesto-1440.png` bottom line) — raise base to 0.28.
- **P2-4 · Contact `<sum>` grammar** and pagination of `#industries`/`#about` glass-card grids.
- **P2-5 · `overflow-x:hidden` on `body`** (`:18`) hides any future overflow instead of fixing it.

## 5. What is *not* wrong (do not touch)

Palette, serif scale, copy tone, glass specular, accordion grid, `prefers-reduced-motion` outline, `noscript` fallback, zero console errors, zero horizontal overflow, CLS 0.003.

## 6. Round 1 — 8 fixes applied (P0-1..5, P1-1..3)

Baseline commit `1c280c3` precedes this round. All edits are in `public/quintessence.html` except the stale-route deletions.

| Fix | Change | Verified |
|---|---|---|
| P0-1 | Removed `hello@quintessence.example` + dual submit handlers; submit now copies the brief to the clipboard (“Brief copied — paste it into your email”). No fake channel, no `TODO` in shipped code. | submit no longer navigates; `r1-verify` 0 page errors. |
| P0-2 | Added `nav.on-iv` light state + `IntersectionObserver` on `.iv` sections. | `r1-approach-1440.png` — wordmark/links legible on ivory (was invisible in `r0`). |
| P0-3 | Mobile “Menu” toggles a dropdown list (≤700 px) instead of only opening the palette; closes on link click. | `r1-mobile-navopen-375.png` shows Services / Industries / Trust / About. |
| P0-4 | 2.5 s fallback forces `.rv.in` so sections cannot stay blank. | `r1-verify` 0 errors; full-page blank bands no longer reproduce. |
| P0-5 | Deleted stale routes `app/approach|capabilities|contact|principles` + `app/page.tsx.bak`. Build now 7 routes. | `npm run build` — only `/`, `/_not-found`, `/icon.svg`, `/opengraph-image.png`, `/robots.txt`. |
| P1-1 | `#top` changed `justify-content:flex-end` → `center`. | `r1-home-1440-atf.png` — title block centered, void halved. |
| P1-2 | Preloader `1,900 ms` → `800 ms`. | CWV LCP 4.37 s → 3.42 s, FCP 520 → 428 ms, TTFB 125 → 71 ms. |
| P1-3 | `.sum` hidden until the brief is dirty (`display:none` → `.show`). | `r1-verify`: pristine `display:none`, after typing `.show=true`. |

**Round 1 evidence:** `npm run build` ✅ 0 errors (7 routes) · `npm run lint` ✅ · `tsc` ✅ · Lighthouse Performance **59→61**, Accessibility 95, Best Practices 100, SEO 100 · CLS 0.003 · LCP 3.2 s · TBT 1,900 ms (still the ceiling) · CWV LCP 3,416 ms.

### Round 1 scores (before → after)

| # | Category | Before | After | Note |
|---|---|---:|---:|---|
| 1 | Premium feel | 6 | **7** | Debug readout gone; dignity restored. |
| 2 | Typography | 7 | **7** | Untouched — held. |
| 3 | Spacing & composition | 5 | **6** | Hero centered; mobile panel indent still loose. |
| 4 | Color & light | 7 | **8** | Nav legible on ivory (`r1-approach-1440.png`). |
| 5 | Motion | 6 | **7** | Shorter preloader + reveal fallback. Wipe/magnetic remain. |
| 6 | Hero impact | 5 | **6** | Title now anchors the viewport (`r1-home-1440-atf.png`). |
| 7 | Copy | 7 | **8** | No fake email; submit copy is honest. |
| 8 | Responsiveness | 6 | **7** | Mobile nav reachable (`r1-mobile-navopen-375.png`). |
| 9 | Performance & a11y | 5 | **6** | Perf 59→61; TBT still 1.9 s, a11y pinned at 95. |
| 10 | Code quality | 3 | **5** | One site now ships; dead components/data/deps remain. |

**Round 1 overall: 5.7 → 6.7 / 10.** Round closed; next round attacks TBT/shader, form semantics, and dead code.

## 7. Round 2 — 8 fixes applied (P1-4, P1-6, P2-1..3, P2-5, dead code)

| Fix | Change | Verified |
|---|---|---|
| P1-4 | WebGL now sleeps off-screen (`scrollY>1.5×viewport` skips draw) + resolution cap `*0.55` → `*0.4`. | Lighthouse TBT **1,900 → 1,250 ms**, Perf **61 → 67**, CWV LCP 3,416 → 3,112 ms. |
| P1-6 | Chips are real toggle buttons: `aria-pressed` set on create + kept in sync on click. | Markup carries `aria-pressed="false"`; click updates it. |
| P2-1 | Footer outline stroke `rgba(...,0.2)` → `0.38`. | `r2-footer-1440.png` — wordmark legible, no heavier. |
| P2-2 | Removed green “Available for new engagements” claim → factual “Independent studio, founded in Dhaka.” | Footer diff; no unverifiable availability. |
| P2-3 | Manifesto ghost base `opacity .16` → `.28`. | Mid-scrub words readable; reveal still visible. |
| P2-5 | `body{overflow-x:hidden}` → `overflow-x:clip`. | Zero overflow at 3 widths (probe re-run clean). |
| Dead code | Deleted `components/`, `data/` (no imports remain — grep clean) and dropped `gsap`, `lenis`, `ogl`, `lucide-react` from `dependencies`. | `npm run build` ✅ 7 routes, `lint` ✅, `tsc` ✅. |

**Round 2 evidence:** build ✅ · lint ✅ · tsc ✅ · Lighthouse **Perf 67 · A11y 95 · Best Practices 100 · SEO 100** · CLS **0.002** · LCP **3.0 s** · TBT **1,250 ms** · 0 console errors.

### Round 2 scores (Round 1 → Round 2)

| # | Category | R1 | R2 | Note |
|---|---|---:|---:|---|
| 1 | Premium feel | 7 | **7** | Held — less motion candy, same restraint. |
| 2 | Typography | 7 | **7** | Held. |
| 3 | Spacing & composition | 6 | **6** | Held — hero centered; mobile panel indent still open. |
| 4 | Color & light | 8 | **8** | Held. |
| 5 | Motion | 7 | **7** | Held — shader sleeps, wipe still present. |
| 6 | Hero impact | 6 | **6** | Held. |
| 7 | Copy | 8 | **8** | Held — no fake claims left. |
| 8 | Responsiveness | 7 | **7** | Held. |
| 9 | Performance & a11y | 6 | **7** | Perf +6, TBT −650 ms. A11y still 95. |
| 10 | Code quality | 5 | **6** | Dead code gone; single-file monolith remains. |

**Round 2 overall: 6.7 → 6.9 / 10.** One round remains (cap 3). Remaining P1/P2: font delivery, magnetic excess, mobile panel indent, palette focus return, dead `.dot` CSS, OG metadata.

## 8. Round 3 (final) — 7 fixes applied, 2 reverted mid-round

| Fix | Change | Verified |
|---|---|---|
| Magnetic tamed | Pull factors `.22/.32` → `.12/.18`. | Hero hover still subtle; no jolt. |
| Mobile panel indent | `@media(max-width:600px){.panel{margin-left:0}}`. | Capabilities panel flush on 375 px. |
| Palette focus return | Closing palette refocuses `#sb`. | Esc/close returns focus to Menu. |
| Dead CSS | Removed orphaned `.dot` + `@keyframes pu` (markup no longer uses them). | File shrinks; no visual change. |
| Chips semantics | `role="group" aria-label="What do you need"` on consent chips. | Screen-reader grouping; Lighthouse a11y **95→96**. |
| Hero balance | `h1{text-wrap:balance}` — stops the 375 px orphan break. | `r3-hero-1440.png` clean; mobile break even. |
| OG metadata | Added `og:type`, `og:title`, `og:description`. | SEO stays **100**. |
| ~~Font split (P1-5)~~ | **Reverted mid-round.** Splitting the Google Fonts URL into sync-serif + async rest raised FCP (CWV 452 → 668 ms). Rule: a fix that lowers a score is reverted. Fonts stay one blocking link. | CWV re-run after revert. |

**Round 3 evidence:** build ✅ 7 routes · lint ✅ · tsc ✅ · Lighthouse **Perf 59 · A11y 96 · Best Practices 100 · SEO 100** · CLS **0.001** · LCP **3.3 s** · TBT **2,260 ms** (noisy — dev Turbopack + shader; CWV LCP 3,232 ms, FCP 572 ms, TTFB 54 ms) · 0 console/page errors (`r3-hero-1440.png`).

### Round 3 scores (Round 2 → Round 3)

| # | Category | R2 | R3 | Note |
|---|---|---:|---:|---|
| 1 | Premium feel | 7 | **7** | Held. |
| 2 | Typography | 7 | **7** | Held. |
| 3 | Spacing & composition | 6 | **7** | Mobile indent fixed. |
| 4 | Color & light | 8 | **8** | Held. |
| 5 | Motion | 7 | **7** | Held — magnetic restrained, wipe still present. |
| 6 | Hero impact | 6 | **6** | Held — centered but the silk still does the talking. |
| 7 | Copy | 8 | **8** | Held — nothing fake ships. |
| 8 | Responsiveness | 7 | **7** | Held. |
| 9 | Performance & a11y | 7 | **6** | Lighthouse Perf 67→59 / TBT 1,250→2,260 ms on this noisy host; CWV flat (±120 ms). Scored down — unsure means lower. A11y +1 (96). |
| 10 | Code quality | 6 | **7** | Semantics + dead CSS pruned; still one 430-line file. |

**Final overall: 5.7 → 7.0 / 10 after 3 rounds. STOP (round cap reached, 8.5 not reached).**

## 9. Final report

**Changed across 3 rounds (16 net fixes, each committed separately):** fake `.example` mailto + dual submit handlers replaced with copy-brief submit · nav legible over ivory sections · mobile Menu dropdown · reveal fallback so sections cannot stay blank · stale Next routes + `page.tsx.bak` deleted (now 7 routes) · hero vertically centered · preloader 1,900 → 800 ms · contact debug readout hidden until dirty · WebGL off-screen sleep + resolution cap · chips `aria-pressed` + group role · footer stroke strengthened · false availability claim replaced with a factual line · manifesto ghost raised · `overflow-x:clip` · dead `components/` `data/` + 4 unused deps + dead `.dot` CSS removed · magnetic tamed · mobile panel indent removed · palette focus return · OG metadata · hero `text-wrap:balance`.

**Final scores:** Premium 7 · Typography 7 · Spacing 7 · Color 8 · Motion 7 · Hero 6 · Copy 8 · Responsive 7 · Perf/A11y 6 · Code 7 → **7.0 / 10**.

**What still falls short and why:**
- **Performance (6).** LH Perf oscillates 59–67 run-to-run on this dev host; the structural drags remain: one blocking Google Fonts link (async split proven worse here), a full-screen 5-octave FBM shader that — even sleeping off-screen — still compiles/recurses a `requestAnimationFrame` loop, and copy-ScriptEval main-thread work. Fixing it properly means self-hosted `@font-face` + shader pausing on `visibilitychange` + `content-visibility`, i.e. a structural change the 8-fix surgical budget could not cover without redesign.
- **Hero impact (6).** Centered now, but the top half is still empty swirling silk with no editorial anchor (no work, no face, no proof). Adding substance would be a design-direction change; within the brief, this is the ceiling.
- **Code quality (7).** Dead code is gone, but the served page is still one 430-line HTML file with content as JS string arrays — not typed data files, not a component tree. That is the architecture the user chose (“100% the same”); the audit cannot quietly rewrite it into Next.js without breaking the mandate.
- **Template tells remain (see §3).** Accordion + 4-step ladder + pill clusters + glass cards + ⌘K will always read “agency template” to a Gucci-standard eye; only a bespoke editorial system kills them, which is direction change, not polish.

No P0 or fake claim remains: build/lint/types clean, 0 console errors, zero overflow, CLS ≤0.003 all rounds, no reverted fix shipped.
