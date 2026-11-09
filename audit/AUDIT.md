# Quintessence — Ruthless Creative Director & Senior Engineering Audit

**Standard:** Apple, Gucci, Louis Vuitton level restraint and craft.  
**Evaluation Date:** 2026-11-09  
**Methodology:** Full `next build` static export check + ESLint (`next lint`) + `tsc --noEmit` + Playwright (Chromium) multi-device capture at 375px, 768px, and 1440px wide + mobile Lighthouse audit via Chrome CLI (`audit/lh-mobile.json`) + layout shift / performance observation.

---

## 1. Overall Score

- **Baseline Score:** **3.8 / 10**
- **After Round 1 (P0 Fixes):** **5.9 / 10**
- **After Round 2 (P1 Fixes):** **7.3 / 10**
- **After Round 3 (P2 Polish):** **7.4 / 10**
- **Current Score (Round 4 - Craft & Accessibility):** **8.5 / 10**

---

## 2. Category Scores (0–10 with Evidence)

| # | Category | Baseline | Current | Specific Evidence & File / Screenshot |
|---|----------|----------|---------|--------------------------------------|
| 1 | **Premium feel** | 3/10 | **8.0/10** | Faux bolding eliminated; subtle WebGL champagne/graphite sheen; principles page now has proper footer hierarchy. Card layout remains a conventional 3-column agency grid. (`audit/shots/home-1440-full.png`, `audit/shots/capabilities-1440-full.png`) |
| 2 | **Typography** | 4/10 | **8.5/10** | `Instrument_Serif` only exists in 400 weight; previous `font-semibold` triggered browser synthetic bolding that deformed delicate serifs into ragged shapes (`audit/shots/after3-capabilities-1440-hover.png`). Removed faux bolding across all headings (`app/page.tsx:122`, `app/capabilities/page.tsx:89`, `components/footer.tsx:28`, `components/nav.tsx:28`), restoring crisp, razor-sharp hairlines. |
| 3 | **Spacing & composition** | 3/10 | **8.0/10** | Unlayered CSS reset in baseline zeroed all spacing across the site. Now layered properly; footer added to `app/principles/page.tsx` resolving layout abruptness; 32px gutters and fluid clamp scaling maintain alignment. (`audit/shots/principles-1440-full.png`) |
| 4 | **Color and light** | 6/10 | **8.5/10** | Strict 3-color palette: Graphite (`#0B0B0C`), Ivory (`#F2EEE6`), Champagne Accent (`#C8B28A`). Nav pill uses realistic glass physics (`backdrop-blur-xl backdrop-saturate-150 border-white/10`). (`components/nav.tsx:24`, `audit/shots/home-1440-atf.png`) |
| 5 | **Motion** | 4/10 | **9.0/10** | GSAP ink-reveal scrub completes edge-to-edge (`mask-position: 0% 0`); full `prefers-reduced-motion` accessibility implemented across CSS keyframes (`app/globals.css:79-93`), preloader bypass (`components/preloader.tsx:41-48`), HeroShader canvas pause (`components/HeroShader.tsx:84-128`), and Lenis scroll disablement (`app/page.tsx:21-23`). |
| 6 | **Hero impact** | 5/10 | **8.0/10** | Typographic statement "Engineered with intent." commands attention; custom WebGL shader tracks pointer with restrained silk-like sheen; Next.js dev indicator badge purged (`next.config.ts:6`). Empty right-hand void in desktop viewport remains somewhat unanchored. (`audit/shots/home-1440-atf.png`) |
| 7 | **Copy** | 3/10 | **9.0/10** | All fabricated placeholder data (555 phone number, fake New York address, fake business hours, dead legal links) purged; capability descriptions rewritten from generic agency buzzwords ("drives measurable results", "seamlessly") into disciplined, confident engineering prose. (`data/capabilities.ts:1-55`) |
| 8 | **Responsiveness** | 2/10 | **8.5/10** | Mobile 375px nav adapts into an ergonomic 2-row pill with all 4 routes and CTA directly touch-accessible without a hamburger menu (`audit/shots/home-375-full.png`); zero horizontal overflow across 15 viewport combinations (375/768/1440). |
| 9 | **Performance & A11y** | 4/10 | **9.0/10** | Lighthouse Mobile: **Accessibility 100/100, Best Practices 100/100, SEO 100/100, Performance 65/100** (CLS: 0.000, FCP: 1.0s, LCP: 1.0s on dev Turbopack). All interactive elements provide visible `:focus-visible` styling; all form labels properly linked to inputs. (`audit/lh-mobile.json`) |
| 10 | **Code quality** | 4/10 | **8.5/10** | All content extracted from hardcoded JSX into strictly typed data files (`data/capabilities.ts`, `data/approach.ts`, `data/principles.ts`, `data/navigation.ts`); clean Next.js 16 build (11 static routes), 0 ESLint errors, 0 TypeScript errors. (`npm run build`, `npm run lint`) |

---

## 3. Generic-Template Tells Found & Status

1. **Three-up numbered card grid with circular badges (`01`–`06`)** — *capabilities/page.tsx*: Retained structure per no-design-direction-rewrite rule, but typography cleaned of faux bolding and copy elevated from agency fluff to technical precision.
2. **01–04 process ladder ("Discover → Define → Build → Sustain")** — *approach/page.tsx*: Common agency scaffold; refined into strictly typed data and restrained descriptions.
3. **Murky mouse-following spotlight glow** — *components/HeroShader.tsx*: Mouse tracking math corrected, reduced-motion bypass added.
4. **Faux bolding on serif fonts** — *site-wide*: `font-semibold` on `Instrument_Serif` caused synthetic raster smearing; eliminated in favor of pristine optical 400 weights.
5. **Inlined page content** — *site-wide*: Resolved; all content now organized in typed data modules under `/data`.
6. **Missing footer on `/principles`** — *app/principles/page.tsx*: Resolved; added `<Footer />` matching the rest of the site.
7. **Missing accessibility motion preferences** — *site-wide*: Resolved; `prefers-reduced-motion` respected in CSS, JS, Lenis, and WebGL shader.

---

## 4. Ranked Fix List

### P0 (Broken / Fake Claims / Console Errors) — ALL RESOLVED
- **P0.1 [Resolved]**: Unlayered universal reset in `globals.css` that broke all Tailwind utility padding and border-radius site-wide.
- **P0.2 [Resolved]**: Missing `lucide-react` dependency breaking production build.
- **P0.3 [Resolved]**: Mobile navigation clipped off-screen at 375px.
- **P0.4 [Resolved]**: Contact form labels dark-on-dark (invisible) and unassociated with input elements.
- **P0.5 [Resolved]**: Contact form submission was dead `console.log` with no UI feedback.
- **P0.6 [Resolved]**: Fabricated placeholder phone numbers, fake office addresses, and fake legal links.
- **P0.7 [Resolved]**: Home ink-reveal statement mask pinned at -100% and never completing animation.
- **P0.8 [Resolved]**: `/principles` route completely omitted the site footer.

### P1 (Cheapens the Premium Feel) — ALL RESOLVED
- **P1.1 [Resolved]**: Synthetic faux-bolding on `Instrument_Serif` headings (`font-semibold` on a 400-only font).
- **P1.2 [Resolved]**: Hardcoded JSX content replaced with strictly typed data models in `/data`.
- **P1.3 [Resolved]**: Missing `prefers-reduced-motion` handling in CSS, Lenis, Preloader, and HeroShader.
- **P1.4 [Resolved]**: Generic marketing buzzwords in capabilities copy replaced with concise technical prose.
- **P1.5 [Resolved]**: Next.js development indicator "N" overlay visible in viewport captures.
- **P1.6 [Resolved]**: Invalid `rounded-2` CSS classes in capabilities and approach cards.
- **P1.7 [Resolved]**: Hero shader `uMouse` coordinates double-divided, pinning the glow off-center.
- **P1.8 [Resolved]**: Custom cursor firing React `setState` on every mousemove event without rAF throttling.

### P2 (Polish Remaining)
- **P2.1**: The 3-up card grid layout remains structurally familiar; an editorial or staggered masonry arrangement would elevate it closer to bespoke luxury.
- **P2.2**: The hero right half is visually quiet; introducing subtle typographic coordinates or secondary editorial metadata would anchor the composition.
- **P2.3**: Contact form backend integration (currently clean client-side validation and confirmation state).

---

## 5. Round History Summary

- **Round 1:** Restored Tailwind cascade root, reachable 2-row mobile nav, purged fake contact/footer data, fixed ink-reveal mask tween. Score: **3.8 → 5.9**
- **Round 2:** Complete contrast audit (100% WCAG AA), darkened nav backdrop, full metadata bundle (OG, Twitter, icon.svg), contact textarea, rAF cursor optimization, statement mask geometry fix. Score: **5.9 → 7.3**
- **Round 3:** Content-sized hero CTA pill (preventing multi-line wrap at all widths), lifted `overflow-x: hidden` crutch, canonical link tags, valid `/robots.txt`. Score: **7.3 → 7.4**
- **Round 4:** Extracted all content into typed data files (`data/*.ts`), purged faux-bolding across all serif headings for optical purity, added full `prefers-reduced-motion` support across all animation layers, disabled dev overlay badge, added missing footer to `/principles`, refined capability copy. Score: **7.4 → 8.5**
