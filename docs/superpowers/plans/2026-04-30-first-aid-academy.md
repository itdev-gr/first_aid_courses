# First Aid Academy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Greek-language marketing + booking site for *First Aid Academy* (founder: Σπύρος Τζιρτζιλάκης) that sells and lets visitors book 8 first-aid seminars (6 individual, 2 business) — with a calm, clinically-credible look derived from `DESIGN.md`, the brand's red+cyan heart logo, and real-world training photography.

**Architecture:**
- **Astro 5** (static-first, islands for interactivity) under `web/`
- **Tailwind CSS** (via `@astrojs/tailwind`) with custom design tokens
- **GSAP** (with ScrollTrigger) loaded as client islands for restrained scroll-reveal motion
- **Content collections** (`web/src/content/programs/`) for the 8 seminars — one MDX file per program drives a single dynamic route
- **Static contact + booking forms** posted to a serverless endpoint (Netlify Forms / Astro server endpoint via Node adapter — chosen below)
- **i18n:** Greek-first (`<html lang="el">`); English copy is out-of-scope for v1

**Tech Stack:**
- Astro 5, TypeScript, Tailwind 3.4, GSAP 3 + ScrollTrigger, `@fontsource-variable/poppins`, `@fontsource-variable/open-sans`, `@fontsource/lato`, Astro `<Image />` (sharp), Astro content collections, Zod schemas
- Forms: **Netlify Forms** (primary; chosen for zero-backend simplicity); fallback documented for Astro server endpoint

**Deployment target:** Netlify (static + Netlify Forms). Node adapter is *not* required for v1.

**Repository layout** (created by Task 1):

```
first-aid/                          # already exists, contains source assets
├── company/                        # client logos (raw)
├── first aid academy logos/        # brand logos (raw)
├── προγραμματα κομπλε/             # program photos + .odt descriptions (raw)
├── πτυχια/                          # founder certificates (raw)
├── DESIGN.md                       # design system (amended in Task 2)
├── docs/superpowers/plans/         # this plan
└── web/                            # NEW — Astro project root
    ├── astro.config.mjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── package.json
    ├── public/
    │   ├── favicon.svg
    │   ├── logo.svg                # exported from Print_Transparent.svg
    │   └── og-default.jpg
    └── src/
        ├── assets/                  # optimized images (from Astro <Image />)
        │   ├── brand/
        │   ├── clients/             # 21 client logos
        │   ├── programs/            # per-program training photos
        │   ├── certificates/        # founder credentials (about page)
        │   └── hero/
        ├── components/
        │   ├── layout/
        │   │   ├── Header.astro
        │   │   ├── Footer.astro
        │   │   ├── Container.astro
        │   │   └── Section.astro
        │   ├── home/
        │   │   ├── Hero.astro
        │   │   ├── ValueProps.astro
        │   │   ├── ProgramsTeaser.astro
        │   │   ├── ForBusinesses.astro
        │   │   ├── ClientsStrip.astro
        │   │   ├── CredentialsBand.astro
        │   │   ├── FounderTeaser.astro
        │   │   └── BookingCTA.astro
        │   ├── programs/
        │   │   ├── ProgramCard.astro
        │   │   ├── ProgramHero.astro
        │   │   ├── CurriculumTable.astro
        │   │   ├── DurationBadge.astro
        │   │   ├── BookProgramCTA.astro
        │   │   └── RelatedPrograms.astro
        │   ├── ui/
        │   │   ├── Button.astro
        │   │   ├── Tag.astro
        │   │   ├── IconHeart.astro
        │   │   └── PhoneLink.astro
        │   └── motion/
        │       ├── Reveal.astro      # GSAP ScrollTrigger wrapper
        │       └── HeroSplit.astro   # word-by-word headline reveal
        ├── content/
        │   ├── config.ts             # Zod schemas
        │   ├── programs/             # 8 MDX files
        │   ├── clients/              # 21 client entries (frontmatter)
        │   └── credentials/          # founder certificates
        ├── layouts/
        │   ├── BaseLayout.astro      # <html>, <head>, fonts, GSAP guard
        │   └── PageLayout.astro      # adds Header + Footer
        ├── lib/
        │   ├── seo.ts
        │   ├── motion.ts             # GSAP defaults + reduced-motion guard
        │   └── nav.ts                # nav structure
        ├── pages/
        │   ├── index.astro           # Αρχική
        │   ├── seminaria/
        │   │   ├── index.astro       # programs list
        │   │   └── [slug].astro      # 8 program detail pages
        │   ├── etairikoi.astro       # for businesses
        │   ├── sxetika.astro         # about / founder
        │   ├── kratisi.astro         # booking form
        │   ├── epikoinonia.astro     # contact
        │   └── 404.astro
        ├── styles/
        │   └── global.css
        └── env.d.ts
```

**URL structure (Greek-friendly slugs in Latin transliteration):**

| URL | Greek title | Page file |
|---|---|---|
| `/` | Αρχική | `pages/index.astro` |
| `/seminaria/` | Σεμινάρια | `pages/seminaria/index.astro` |
| `/seminaria/cofat/` | Πλήρης Εκπαίδευση | `pages/seminaria/[slug].astro` |
| `/seminaria/bls/` | Βασική Υποστήριξη Ζωής | (same dynamic) |
| `/seminaria/cpr-aed/` | ΚΑΡΠΑ – Απινιδωτής | (same dynamic) |
| `/seminaria/fa/` | Πρώτες Βοήθειες | (same dynamic) |
| `/seminaria/pfa/` | Παιδιατρικές Π.Β. | (same dynamic) |
| `/seminaria/epfa/` | Επείγουσες Παιδιατρικές Π.Β. | (same dynamic) |
| `/seminaria/faw/` | Π.Β. στην Εργασία (FAW) | (same dynamic) |
| `/seminaria/efaw/` | Π.Β. στην Εργασία (EFAW) | (same dynamic) |
| `/etairikoi/` | Για Επιχειρήσεις | `pages/etairikoi.astro` |
| `/sxetika/` | Σχετικά με τον Εκπαιδευτή | `pages/sxetika.astro` |
| `/kratisi/` | Κράτηση Σεμιναρίου | `pages/kratisi.astro` |
| `/epikoinonia/` | Επικοινωνία | `pages/epikoinonia.astro` |

**DESIGN.md amendment summary** (full diff in Task 2): replace "Caregiver Teal `#007D7E`" with brand-derived **Pulse Crimson `#D7263D`** as primary and **Clinical Cyan `#1FB6E0`** as secondary; everything else (atmosphere, typography roles, motion vocabulary, layout, components, accessibility floor) stays as-is. The original teal-based DESIGN.md was for the *inspiration site* (Maltezos); the live brand identity is red + cyan, anchored by the heart logo.

**Conventions for every task:**
- Each task ends with a commit step. Use Conventional Commits.
- Code blocks in steps are *complete* — copy-paste ready, no placeholders.
- After every UI task, the verification step uses `npm run dev` + a manual browser check at 1440 / 768 / 375 viewport widths. Where automated checks make sense (forms, content schema), they are included.
- All Greek copy is final, not Lorem Ipsum. The plan provides the exact strings.

---

## Sub-plan index

This plan is split into ordered task groups. Implementers should execute groups in order; within a group, tasks may sometimes run in parallel (noted where applicable). The full task body for each group lives in this document below the index.

1. **Foundation** — Task 1 (Astro init), Task 2 (DESIGN.md amendment), Task 3 (Tailwind tokens + fonts), Task 4 (motion library + reduced-motion guard)
2. **Layout primitives** — Task 5 (BaseLayout + PageLayout), Task 6 (Header + nav), Task 7 (Footer)
3. **Content modeling** — Task 8 (content collections schemas), Task 9 (seed 8 program MDX files), Task 10 (seed 21 client entries), Task 11 (seed founder credentials)
4. **Asset pipeline** — Task 12 (logo SVG export + favicon), Task 13 (image organization + optimization)
5. **Reusable UI** — Task 14 (Button, Tag, IconHeart, PhoneLink), Task 15 (Section, Container, Reveal motion wrappers)
6. **Home page** — Tasks 16–23 (one per home section: Hero, ValueProps, ProgramsTeaser, ForBusinesses, ClientsStrip, CredentialsBand, FounderTeaser, BookingCTA) + Task 24 (assemble)
7. **About page** — Task 25 (`sxetika.astro`)
8. **Programs index + detail** — Task 26 (programs index), Task 27 (dynamic program detail page)
9. **For Businesses page** — Task 28 (`etairikoi.astro`)
10. **Booking page + form** — Task 29 (`kratisi.astro` + Netlify form)
11. **Contact page** — Task 30 (`epikoinonia.astro`)
12. **404 + SEO + sitemap** — Tasks 31–32
13. **Motion polish** — Task 33 (apply Reveal across pages)
14. **Accessibility & responsive QA** — Task 34
15. **Build & deploy prep** — Task 35

The detailed task bodies start in the next section. To keep the plan navigable, each task is self-contained: file paths, full code, exact commands, expected output, commit message.

---

(Detailed tasks follow in subsequent sections of this document.)

## Group 1 — Foundation

### Task 1: Initialize Astro project under `web/`

**Files:**
- Create: `web/` (entire scaffold)
- Create: `web/.gitignore`
- Create: `.gitignore` (root, if missing)

- [ ] **Step 1: Initialize git in repo root**

```bash
cd /Users/marios/Desktop/Cursor/first-aid
git init
```

- [ ] **Step 2: Create root `.gitignore`**

Write `/Users/marios/Desktop/Cursor/first-aid/.gitignore`:

```
.DS_Store
.playwright-mcp/
node_modules/
dist/
.astro/
.env
.env.local
*.log
/tmp-extract/
```

- [ ] **Step 3: Scaffold Astro project**

Run from repo root:

```bash
npm create astro@latest web -- --template minimal --no-install --no-git --typescript strict --skip-houston
```

Expected: `web/` directory created with `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`.

- [ ] **Step 4: Install dependencies**

```bash
cd web && npm install
npm install @astrojs/tailwind @astrojs/sitemap @astrojs/mdx tailwindcss@^3.4 gsap@^3.12
npm install @fontsource-variable/poppins @fontsource-variable/open-sans @fontsource/lato
npm install -D @types/node
```

Expected: `web/node_modules/` populated, `package.json` lists the above.

- [ ] **Step 5: Verify dev server boots**

```bash
cd web && npm run dev -- --port 4321
```

Expected: `http://localhost:4321/` returns the default minimal page. Stop the server with Ctrl-C.

- [ ] **Step 6: Commit**

```bash
cd /Users/marios/Desktop/Cursor/first-aid
git add .gitignore web/
git commit -m "chore: scaffold Astro project under web/"
```

---

### Task 2: Amend DESIGN.md for First Aid Academy brand colors

**Files:**
- Modify: `DESIGN.md` (root)

The existing DESIGN.md was synthesized from the Maltezos inspiration site (teal palette). The actual brand logo is **red + cyan**. We replace only the palette and tightly-coupled component color references. All other sections (atmosphere, typography, motion, layout, accessibility, voice) remain intact.

- [ ] **Step 1: Replace section 2 ("Color Palette & Roles") with the brand-aligned palette**

Find in `DESIGN.md` the heading `## 2. Color Palette & Roles` and everything up to (but not including) `## 3. Typography Rules`. Replace that block with:

````markdown
## 2. Color Palette & Roles

The system is built around the **two-color brand mark from the heart logo** — a confident crimson and a clinical cyan — supported by warm-neutral greys and a near-white backdrop. The crimson is the *life* color (the heart, the pulse, the call to act); the cyan is the *trust* color (calm, professional, evidence-based). They are never used together on small text.

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| **Pulse Crimson** | `#D7263D` | Primary brand. Used for the primary CTA fill, "FIRST AID" wordmark, hero accent strokes, urgent badges (Διάρκεια, Πιστοποίηση), pulse-line iconography. The single source of expressive authority. |
| **Crimson Deep** | `#A81B30` | Hover/active state for primary CTAs; deep accent under heroes. |
| **Crimson Wash** | `#FDECEE` | Pale tint for "alert" callouts, schedule chips, certificate ribbon backgrounds. |
| **Clinical Cyan** | `#1FB6E0` | Secondary brand. Used for the "ACADEMY" wordmark accents, secondary CTAs, link hovers, info-tag backgrounds, ECG-line graphics. |
| **Cyan Deep** | `#0E7DA1` | Cyan hover state; small-text safe variant. |
| **Cyan Wash** | `#E6F7FC` | Pale tint for alternating section bands, "Επιχειρήσεις" emphasis blocks. |
| **Pure Snow** | `#FFFFFF` | Default page background; button text on red/cyan; card surfaces. |
| **Frosted Mist** | `#F7FAFC` | Subtle off-white for alternating section delineation when neither cyan nor crimson wash fits. |
| **Charcoal Ink** | `#1F2933` | Default body copy color (slightly cooler than pure black to harmonize with cyan). |
| **Graphite Edge** | `#3B4754` | Strong UI labels, nav links at rest. |
| **Slate Mute** | `#6B7785` | Muted captions, metadata, placeholder copy. |
| **Quiet Border** | `#E4E9EE` | Hairline dividers, input strokes, table rules. |
| **Footer Obsidian** | `#0F1A24` | Footer surface and high-contrast overlays. |
| **Image Veil** | `rgba(15, 26, 36, 0.55)` | Dark scrim over hero photography to keep white headlines legible. |

> **Critical rules:**
> - Pulse Crimson on white passes WCAG AA only for **large text and UI components ≥ 24px or ≥ 18.66px bold**. For body text on white, use Charcoal Ink. For small UI labels in red, switch to Crimson Deep `#A81B30` (passes 4.5:1).
> - Clinical Cyan `#1FB6E0` does **not** pass AA on white for body. Use Cyan Deep `#0E7DA1` for text.
> - Never set crimson + cyan body text on the same surface — pick one accent per block.

### Tailwind config tokens

```js
// web/tailwind.config.mjs — to be wired in Task 3
theme: {
  extend: {
    colors: {
      crimson: {
        DEFAULT: '#D7263D',
        50:  '#FDECEE',
        500: '#D7263D',
        600: '#A81B30',
        700: '#831322',
      },
      cyan: {
        DEFAULT: '#1FB6E0',
        50:  '#E6F7FC',
        500: '#1FB6E0',
        600: '#0E7DA1',
        700: '#0A5E7A',
      },
      ink: {
        DEFAULT: '#1F2933',
        strong:  '#0F1A24',
        edge:    '#3B4754',
        muted:   '#6B7785',
      },
      surface: {
        DEFAULT: '#FFFFFF',
        soft:    '#F7FAFC',
        crimson: '#FDECEE',
        cyan:    '#E6F7FC',
      },
      hairline: '#E4E9EE',
    },
  },
}
```
````

- [ ] **Step 2: Update section 4 ("Component Stylings") button colors**

In `DESIGN.md` under `## 4. Component Stylings` → `### Buttons`, find every `#007D7E` and replace with `#D7263D` (Pulse Crimson). Find `brand-700 #006869` → `crimson-600 #A81B30`. Find `rgba(0,125,126,0.18)` → `rgba(215,38,61,0.22)`. Change "Tertiary / Ghost" border `#007D7E` → `#1FB6E0` and text `#007D7E` → `#0E7DA1`.

- [ ] **Step 3: Update section 5 (Layout) section-rhythm block**

Replace the rhythm code block in `## 5. Layout Principles` → "Section vertical pattern" with:

```
[hero with image + scrim] → white
[Value props / Why us]    → #F7FAFC (Frosted Mist)
[Programs grid]           → white
[Trust band: clients]     → #E6F7FC (Cyan Wash)
[CTA / phone callout]     → #D7263D (Pulse Crimson, white text)
[Founder teaser]          → white
[Footer]                  → #0F1A24
```

- [ ] **Step 4: Update section 6 (Motion) GSAP defaults**

In `## 6. Motion Principles` → "Allowed motion vocabulary", change "ECG-style hero accent" addition: append a new bullet under "Hero headline":

```
- **Pulse line accent** (hero only): a thin ECG-style SVG path animated with `drawSVG` (or `strokeDashoffset` fallback) over 1.2s `power2.inOut`, drawing once on load behind the headline. Single play; no loop. Color: Pulse Crimson `#D7263D`.
```

- [ ] **Step 5: Update section 10 cheat sheet**

Replace the entire "## 10. Quick Reference" code block with:

```
Primary CTA:        bg-crimson text-white rounded-md px-5 py-3.5 hover:bg-crimson-600 hover:shadow-[0_4px_12px_rgba(215,38,61,0.22)] transition
Secondary CTA:      bg-white text-cyan-600 border border-cyan ring-1 ring-cyan/40 rounded-md px-5 py-3.5 hover:bg-cyan-50 transition
Section H2:         text-crimson text-2xl md:text-3xl font-normal
Body paragraph:     text-ink leading-relaxed text-base
Section (default):  bg-white py-16 md:py-24
Section (soft):     bg-surface-soft py-16 md:py-24
Section (cyan):     bg-surface-cyan py-16 md:py-24
Section (brand):    bg-crimson text-white py-20
Container:          mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8
Service tile:       bg-white border border-hairline rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(215,38,61,0.12)] hover:-translate-y-1 transition
Hairline divider:   border-t border-hairline
```

- [ ] **Step 6: Commit**

```bash
git add DESIGN.md
git commit -m "docs: amend DESIGN.md palette to First Aid Academy brand (crimson + cyan)"
```

---

### Task 3: Wire Tailwind, fonts, and global CSS

**Files:**
- Modify: `web/astro.config.mjs`
- Create: `web/tailwind.config.mjs`
- Create: `web/src/styles/global.css`
- Modify: `web/src/pages/index.astro` (smoke test only)

- [ ] **Step 1: Update `web/astro.config.mjs`**

```js
// web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://firstaidacademy.gr',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
  build: { inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
```

- [ ] **Step 2: Create `web/tailwind.config.mjs`**

```js
// web/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#D7263D', 50: '#FDECEE', 500: '#D7263D', 600: '#A81B30', 700: '#831322' },
        cyan:    { DEFAULT: '#1FB6E0', 50: '#E6F7FC', 500: '#1FB6E0', 600: '#0E7DA1', 700: '#0A5E7A' },
        ink:     { DEFAULT: '#1F2933', strong: '#0F1A24', edge: '#3B4754', muted: '#6B7785' },
        surface: { DEFAULT: '#FFFFFF', soft: '#F7FAFC', crimson: '#FDECEE', cyan: '#E6F7FC' },
        hairline: '#E4E9EE',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans:    ['"Open Sans Variable"', '"Open Sans"', 'system-ui', 'sans-serif'],
        accent:  ['Lato', '"Open Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      boxShadow: {
        tile:      '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        tileHover: '0 12px 32px rgba(215,38,61,0.12)',
        cta:       '0 4px 12px rgba(215,38,61,0.22)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Create `web/src/styles/global.css`**

```css
/* web/src/styles/global.css */
@import '@fontsource-variable/open-sans/index.css';
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/600.css';
@import '@fontsource/poppins/700.css';
@import '@fontsource/lato/400.css';
@import '@fontsource/lato/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: light;
  }
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    @apply font-sans text-ink bg-white;
    font-size: 16px;
    line-height: 1.6;
  }
  h1, h2, h3, h4 {
    @apply font-sans;
    text-wrap: balance;
  }
  a {
    @apply text-cyan-600 underline-offset-4 hover:underline;
  }
  ::selection {
    background: #FDECEE;
    color: #831322;
  }
  :focus-visible {
    outline: 3px solid #D7263D;
    outline-offset: 2px;
    border-radius: 2px;
  }
}

@layer components {
  .container-x {
    @apply mx-auto max-w-content px-4 md:px-6 lg:px-8;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Smoke-test by editing `web/src/pages/index.astro`**

```astro
---
import '../styles/global.css';
---
<html lang="el">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>First Aid Academy — Σύντομα κοντά σας</title>
  </head>
  <body class="container-x py-24 text-ink">
    <h1 class="font-display font-bold text-4xl text-crimson uppercase tracking-tight">First Aid Academy</h1>
    <p class="mt-4 text-cyan-600">Tailwind, fonts and tokens are live.</p>
    <button class="mt-8 bg-crimson text-white rounded-md px-5 py-3.5 shadow-cta hover:bg-crimson-600 transition">
      Κάντε Κράτηση
    </button>
  </body>
</html>
```

- [ ] **Step 5: Run dev server and verify**

```bash
cd web && npm run dev -- --port 4321
```

Open `http://localhost:4321/`. Expected: crimson uppercase Poppins headline, cyan paragraph, red rounded button. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add web/
git commit -m "feat(web): wire Tailwind tokens, fonts, global styles"
```

---

### Task 4: Motion library + reduced-motion guard

**Files:**
- Create: `web/src/lib/motion.ts`
- Create: `web/src/components/motion/Reveal.astro`
- Create: `web/src/components/motion/HeroSplit.astro`

- [ ] **Step 1: Create `web/src/lib/motion.ts`**

```ts
// web/src/lib/motion.ts
// Centralized GSAP setup. Imported only by client islands.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.defaults({
    duration: reduce ? 0 : 0.8,
    ease: 'power2.out',
  });

  if (reduce) {
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  }
}

export { gsap, ScrollTrigger };
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

- [ ] **Step 2: Create `web/src/components/motion/Reveal.astro`**

```astro
---
// web/src/components/motion/Reveal.astro
// Wrap any block; on scroll-into-view, fade + rise its direct children with stagger.
interface Props {
  stagger?: number;
  y?: number;
  delay?: number;
  /** child selector to animate; default: > * */
  selector?: string;
}
const { stagger = 0.08, y = 24, delay = 0, selector = '> *' } = Astro.props;
---
<div data-reveal data-stagger={stagger} data-y={y} data-delay={delay} data-selector={selector}>
  <slot />
</div>

<script>
  import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion';

  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  els.forEach((el) => {
    const stagger = parseFloat(el.dataset.stagger ?? '0.08');
    const y       = parseFloat(el.dataset.y ?? '24');
    const delay   = parseFloat(el.dataset.delay ?? '0');
    const selector = el.dataset.selector ?? '> *';
    const targets = el.querySelectorAll<HTMLElement>(selector);

    if (prefersReducedMotion()) {
      targets.forEach((t) => { t.style.opacity = '1'; t.style.transform = 'none'; });
      return;
    }

    gsap.set(targets, { opacity: 0, y });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => gsap.to(targets, { opacity: 1, y: 0, stagger, delay }),
    });
  });
</script>
```

- [ ] **Step 3: Create `web/src/components/motion/HeroSplit.astro`**

```astro
---
// web/src/components/motion/HeroSplit.astro
// Word-by-word headline reveal (no SplitText/Club required).
interface Props {
  text: string;
  as?: 'h1' | 'h2';
  className?: string;
}
const { text, as: Tag = 'h1', className = '' } = Astro.props;
const words = text.split(/\s+/);
---
<Tag class={`hero-split ${className}`} data-hero-split>
  {words.map((w, i) => (
    <span class="inline-block overflow-hidden align-bottom">
      <span class="inline-block translate-y-[110%]" data-hero-word>{w}</span>
    </span>
  )).reduce((acc: any[], el, i) => i === 0 ? [el] : [...acc, ' ', el], [])}
</Tag>

<script>
  import { gsap, prefersReducedMotion } from '../../lib/motion';
  document.querySelectorAll<HTMLElement>('[data-hero-split]').forEach((root) => {
    const words = root.querySelectorAll<HTMLElement>('[data-hero-word]');
    if (prefersReducedMotion()) {
      words.forEach((w) => (w.style.transform = 'translateY(0)'));
      return;
    }
    gsap.to(words, { y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05, delay: 0.1 });
  });
</script>
```

- [ ] **Step 4: Smoke-test in `index.astro`**

Edit `web/src/pages/index.astro` to import and use `Reveal` + `HeroSplit`:

```astro
---
import '../styles/global.css';
import Reveal from '../components/motion/Reveal.astro';
import HeroSplit from '../components/motion/HeroSplit.astro';
---
<html lang="el">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>First Aid Academy</title>
  </head>
  <body class="container-x py-24 text-ink">
    <HeroSplit text="ΓΝΩΣΗ ΠΟΥ ΣΩΖΕΙ ΖΩΕΣ" as="h1" className="font-display font-bold text-5xl text-crimson uppercase" />
    <Reveal>
      <p class="mt-8 text-ink">Πρώτη γραμμή.</p>
      <p class="mt-2 text-ink">Δεύτερη γραμμή.</p>
      <p class="mt-2 text-ink">Τρίτη γραμμή.</p>
    </Reveal>
  </body>
</html>
```

- [ ] **Step 5: Run dev server, verify motion**

```bash
cd web && npm run dev -- --port 4321
```

Open `http://localhost:4321/`. Expected: headline words rise into view on load (~0.9s); paragraphs fade up with 0.08s stagger when scrolled into view. Toggle macOS *Reduce Motion* and reload — content should appear instantly. Stop server.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib web/src/components/motion web/src/pages/index.astro
git commit -m "feat(web): add GSAP motion library with reduced-motion guard"
```

---


## Group 2 — Layout primitives

### Task 5: BaseLayout and PageLayout

**Files:**
- Create: `web/src/lib/seo.ts`
- Create: `web/src/lib/nav.ts`
- Create: `web/src/layouts/BaseLayout.astro`
- Create: `web/src/layouts/PageLayout.astro`

- [ ] **Step 1: Create `web/src/lib/seo.ts`**

```ts
// web/src/lib/seo.ts
export interface SeoProps {
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}

export const siteName = 'First Aid Academy';
export const siteUrl  = 'https://firstaidacademy.gr';
export const defaultOg = '/og-default.jpg';

export const buildTitle = (page: string) =>
  page === siteName ? page : `${page} — ${siteName}`;
```

- [ ] **Step 2: Create `web/src/lib/nav.ts`**

```ts
// web/src/lib/nav.ts
export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Αρχική',       href: '/' },
  { label: 'Σεμινάρια',    href: '/seminaria/' },
  { label: 'Επιχειρήσεις', href: '/etairikoi/' },
  { label: 'Σχετικά',      href: '/sxetika/' },
  { label: 'Επικοινωνία',  href: '/epikoinonia/' },
];

export const ctaNav: NavItem = { label: 'Κράτηση', href: '/kratisi/' };

export const phone = {
  display: '+30 6900 000000',           // placeholder; replace with real number
  tel:     '+306900000000',
  email:   'info@firstaidacademy.gr',   // placeholder; replace
};
```

- [ ] **Step 3: Create `web/src/layouts/BaseLayout.astro`**

```astro
---
// web/src/layouts/BaseLayout.astro
import '../styles/global.css';
import { siteName, siteUrl, defaultOg, buildTitle } from '../lib/seo';
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
}
const {
  title,
  description,
  ogImage = defaultOg,
  noindex = false,
  canonical = Astro.url.pathname,
} = Astro.props;
const fullTitle = buildTitle(title);
const canonUrl  = new URL(canonical, siteUrl).toString();
const ogUrl     = new URL(ogImage, siteUrl).toString();
---
<!doctype html>
<html lang="el">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonUrl} />
    {noindex && <meta name="robots" content="noindex,nofollow" />}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonUrl} />
    <meta property="og:image" content={ogUrl} />
    <meta property="og:locale" content="el_GR" />
    <meta name="twitter:card" content="summary_large_image" />

    <meta name="theme-color" content="#D7263D" />
  </head>
  <body class="bg-white text-ink min-h-screen flex flex-col">
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Create `web/src/layouts/PageLayout.astro`**

```astro
---
// web/src/layouts/PageLayout.astro
import BaseLayout from './BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
}
const props = Astro.props;
---
<BaseLayout {...props}>
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-white text-ink px-4 py-2 rounded shadow z-50">
    Παράλειψη στο κύριο περιεχόμενο
  </a>
  <Header />
  <main id="main" class="flex-1">
    <slot />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
git add web/src/lib web/src/layouts
git commit -m "feat(web): add BaseLayout, PageLayout, SEO + nav config"
```

---

### Task 6: Header with primary nav

**Files:**
- Create: `web/src/components/layout/Header.astro`
- Create: `web/src/components/ui/Button.astro` (used by header CTA)
- Create: `web/src/components/ui/PhoneLink.astro`

- [ ] **Step 1: Create `web/src/components/ui/Button.astro`**

```astro
---
// web/src/components/ui/Button.astro
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
}
const {
  href, variant = 'primary', size = 'md', type = 'button',
  className = '', ariaLabel,
} = Astro.props;

const sizes = {
  sm: 'text-sm px-4 py-2 rounded-md',
  md: 'text-base px-5 py-3.5 rounded-md',
  lg: 'text-base px-6 py-4 rounded-md',
};
const variants = {
  primary:   'bg-crimson text-white hover:bg-crimson-600 hover:shadow-cta no-underline',
  secondary: 'bg-white text-cyan-600 border border-cyan ring-1 ring-cyan/30 hover:bg-cyan-50 no-underline',
  ghost:     'bg-transparent text-ink-edge hover:bg-surface-soft no-underline',
};
const cls = `inline-flex items-center justify-center font-semibold transition-out ${sizes[size]} ${variants[variant]} ${className}`;

const Tag = href ? 'a' : 'button';
---
<Tag class={cls} href={href} type={!href ? type : undefined} aria-label={ariaLabel}>
  <slot />
</Tag>
```

- [ ] **Step 2: Create `web/src/components/ui/PhoneLink.astro`**

```astro
---
// web/src/components/ui/PhoneLink.astro
import { phone } from '../../lib/nav';
interface Props {
  className?: string;
}
const { className = '' } = Astro.props;
---
<a href={`tel:${phone.tel}`} class={`inline-flex items-center gap-2 text-ink-edge hover:text-crimson transition-out ${className}`}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72a2 2 0 0 1 1.72 2z"/>
  </svg>
  <span class="font-semibold">{phone.display}</span>
</a>
```

- [ ] **Step 3: Create `web/src/components/layout/Header.astro`**

```astro
---
// web/src/components/layout/Header.astro
import { primaryNav, ctaNav } from '../../lib/nav';
import Button from '../ui/Button.astro';
import PhoneLink from '../ui/PhoneLink.astro';
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === '/' ? path === '/' : path.startsWith(href);
---
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-hairline">
  <div class="container-x flex items-center justify-between gap-6 h-20 md:h-24">
    <a href="/" class="flex items-center gap-3 no-underline" aria-label="First Aid Academy — Αρχική">
      <img src="/logo.svg" alt="" width="48" height="48" class="h-12 w-12" />
      <span class="hidden sm:flex flex-col leading-tight">
        <span class="font-display font-bold uppercase text-crimson tracking-tight text-sm">First Aid</span>
        <span class="font-display font-bold uppercase text-cyan-600 tracking-tight text-sm">Academy</span>
      </span>
    </a>

    <nav class="hidden lg:flex items-center gap-1" aria-label="Κύρια πλοήγηση">
      {primaryNav.map((item) => (
        <a
          href={item.href}
          class={`px-3 py-2 text-sm font-semibold no-underline transition-out ${isActive(item.href) ? 'text-crimson' : 'text-ink-edge hover:text-crimson'}`}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-4">
      <PhoneLink className="hidden md:inline-flex text-sm" />
      <Button href={ctaNav.href} variant="primary" size="sm">{ctaNav.label}</Button>
      <button id="mobile-menu-btn" class="lg:hidden p-2 -mr-2" aria-label="Άνοιγμα μενού" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>

  <div id="mobile-menu" class="lg:hidden hidden border-t border-hairline bg-white">
    <nav class="container-x py-4 flex flex-col gap-1" aria-label="Κινητή πλοήγηση">
      {primaryNav.map((item) => (
        <a href={item.href} class={`px-3 py-3 rounded text-base font-semibold no-underline ${isActive(item.href) ? 'bg-surface-crimson text-crimson' : 'text-ink-edge hover:bg-surface-soft'}`}>{item.label}</a>
      ))}
      <PhoneLink className="px-3 py-3" />
    </nav>
  </div>
</header>

<script>
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    const open = menu?.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
  });
</script>
```

- [ ] **Step 4: Run dev and verify** — load `/`, resize to 375px, confirm hamburger toggles, ESC + tab order are sane. Stop server.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/ui web/src/components/layout/Header.astro
git commit -m "feat(web): header with sticky nav, mobile drawer, phone CTA"
```

---

### Task 7: Footer

**Files:**
- Create: `web/src/components/layout/Footer.astro`

- [ ] **Step 1: Create `web/src/components/layout/Footer.astro`**

```astro
---
// web/src/components/layout/Footer.astro
import { primaryNav, phone } from '../../lib/nav';
const year = new Date().getFullYear();
---
<footer class="bg-ink-strong text-white mt-24">
  <div class="container-x py-16 md:py-20 grid gap-10 md:grid-cols-12">
    <div class="md:col-span-5">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="" width="56" height="56" class="h-14 w-14 bg-white rounded-full p-1" />
        <div>
          <p class="font-display font-bold uppercase text-white tracking-tight">First Aid Academy</p>
          <p class="text-white/70 text-sm">Σπύρος Τζιρτζιλάκης — Πιστοποιημένος Εκπαιδευτής RTI / ERC</p>
        </div>
      </div>
      <p class="mt-6 text-white/80 leading-relaxed max-w-md">
        Σεμινάρια Πρώτων Βοηθειών για ιδιώτες, γονείς και επιχειρήσεις, βασισμένα στα διεθνή πρωτόκολλα του European Resuscitation Council.
      </p>
    </div>

    <div class="md:col-span-3">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-white/60">Πλοήγηση</h3>
      <ul class="mt-4 space-y-2">
        {primaryNav.map((item) => (
          <li><a href={item.href} class="text-white/85 hover:text-white no-underline">{item.label}</a></li>
        ))}
        <li><a href="/kratisi/" class="text-white/85 hover:text-white no-underline">Κράτηση</a></li>
      </ul>
    </div>

    <div class="md:col-span-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-white/60">Επικοινωνία</h3>
      <ul class="mt-4 space-y-3 text-white/85">
        <li><a href={`tel:${phone.tel}`} class="hover:text-white no-underline">{phone.display}</a></li>
        <li><a href={`mailto:${phone.email}`} class="hover:text-white no-underline">{phone.email}</a></li>
        <li class="text-white/70 text-sm">Σεμινάρια σε όλη την Ελλάδα · Ενδοεπιχειρησιακά κατόπιν συνεννόησης</li>
      </ul>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="container-x py-6 flex flex-col md:flex-row gap-3 justify-between text-white/60 text-sm">
      <p>© {year} First Aid Academy. Όλα τα δικαιώματα διατηρούνται.</p>
      <p>Πιστοποιήσεις: ERC · RTI · Πολιτική Προστασία</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Wire `index.astro` to PageLayout for full visual check**

Replace `web/src/pages/index.astro` with:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---
<PageLayout title="First Aid Academy" description="Σεμινάρια Πρώτων Βοηθειών από πιστοποιημένο εκπαιδευτή. Κρατήστε τη θέση σας σήμερα.">
  <section class="container-x py-24">
    <h1 class="font-display font-bold uppercase text-crimson text-5xl">Welcome scaffold</h1>
    <p class="mt-4 text-ink">Header + Footer should render around this.</p>
  </section>
</PageLayout>
```

- [ ] **Step 3: Verify dev server** — header (sticky), main, footer render correctly at 1440 / 768 / 375. Stop server.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/layout/Footer.astro web/src/pages/index.astro
git commit -m "feat(web): footer with brand summary, nav, contact"
```

---


## Group 3 — Content modeling

### Task 8: Content collection schemas

**Files:**
- Create: `web/src/content/config.ts`

- [ ] **Step 1: Create the config file**

```ts
// web/src/content/config.ts
import { defineCollection, z } from 'astro:content';

const programs = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    slug:        z.string(),                      // url slug, must match filename
    code:        z.string(),                      // 'BLS', 'CPR-AED', 'FA', ...
    titleEl:     z.string(),                      // Greek title
    titleEn:     z.string(),                      // English short label
    audience:    z.enum(['individual', 'business', 'parent']),
    category:    z.enum(['life-support', 'first-aid', 'pediatric', 'workplace', 'comprehensive']),
    durationHours: z.string(),                    // '6 - 7' or '18'
    evaluation: z.string(),                       // assessment description
    summary:    z.string(),                       // 1-2 sentence card description
    description: z.string(),                      // full overview paragraph
    prerequisite: z.string().optional(),
    theory:     z.array(z.string()),              // theory topics
    skills:     z.array(z.string()),              // hands-on skills
    heroImage:  image(),
    galleryImages: z.array(image()).default([]),
    tags:       z.array(z.string()).default([]),
    order:      z.number().default(99),
    featured:   z.boolean().default(false),
  }),
});

const clients = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name:  z.string(),
    logo:  image(),
    url:   z.string().url().optional(),
    sector: z.string().optional(),
  }),
});

const credentials = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    title:    z.string(),
    issuer:   z.string(),
    yearIssued: z.number().optional(),
    summary:  z.string().optional(),
    image:    image(),
    order:    z.number().default(99),
  }),
});

export const collections = { programs, clients, credentials };
```

- [ ] **Step 2: Run typecheck**

```bash
cd web && npx astro check
```

Expected: 0 errors (collections are empty so far; schema validates).

- [ ] **Step 3: Commit**

```bash
git add web/src/content/config.ts
git commit -m "feat(web): content collection schemas (programs, clients, credentials)"
```

---

### Task 9: Seed 8 program MDX files

**Files (create all):**
- `web/src/content/programs/cofat.mdx`
- `web/src/content/programs/bls.mdx`
- `web/src/content/programs/cpr-aed.mdx`
- `web/src/content/programs/fa.mdx`
- `web/src/content/programs/pfa.mdx`
- `web/src/content/programs/epfa.mdx`
- `web/src/content/programs/faw.mdx`
- `web/src/content/programs/efaw.mdx`

> **Note:** Hero/gallery images are referenced from `../../assets/programs/<slug>/<file>` — Task 13 places the actual files. The schema validates image refs at build time, so the Task 13 image-organization step must run before `astro build` succeeds. During development the filenames below must match the files Task 13 creates exactly.

- [ ] **Step 1: Create `cofat.mdx`** (highest-priority comprehensive program)

```mdx
---
slug: cofat
code: CoFAT
titleEl: Πλήρης Εκπαίδευση Πρώτων Βοηθειών
titleEn: Complete First Aid Training (CoFAT)
audience: individual
category: comprehensive
durationHours: '18'
evaluation: Πρακτική και γραπτή εξέταση από τον εκπαιδευτή
summary: Η ολοκληρωμένη εκπαίδευση για όλα τα απειλητικά και μη απειλητικά για τη ζωή περιστατικά — ενήλικες, παιδιά και βρέφη.
description: |
  Η Πλήρης Εκπαίδευση Πρώτων Βοηθειών συμπεριλαμβάνει όλες τις βασικές ενότητες:
  Βασική Υποστήριξη Ζωής, ΚΑΡΠΑ – Αυτόματος Εξωτερικός Απινιδωτής, Πρώτες Βοήθειες
  και Παιδιατρικές Πρώτες Βοήθειες. Είναι σχεδιασμένη ώστε να καθιστά τους
  υποψήφιους πρώτους βοηθούς ικανούς να αντιμετωπίσουν μια πληθώρα περιστατικών
  που αφορούν ενήλικες, παιδιά και βρέφη — από καρδιακή ανακοπή και πνιγμονή έως
  εγκαύματα, εξαρθρώσεις και επιληπτικές κρίσεις.
heroImage: ../../assets/programs/cofat/hero.jpg
galleryImages: []
tags: ['ολοκληρωμένο', 'ενήλικες', 'παιδιά', 'βρέφη']
theory:
  - Βασική Υποστήριξη Ζωής (BLS)
  - Πρώτες Βοήθειες (FA)
  - ΚΑΡΠΑ – Αυτόματος Εξωτερικός Απινιδωτής
  - Παιδιατρικές Πρώτες Βοήθειες (PFA)
skills:
  - Όλες οι δεξιότητες των επιμέρους ενοτήτων
  - Συνδυαστικά σενάρια ενηλίκου και παιδιού
  - Ολοκληρωμένη πρακτική αξιολόγηση
order: 1
featured: true
---

Η Πλήρης Εκπαίδευση είναι η πιο πλήρης διαθέσιμη πρόταση κατάρτισης πρώτων βοηθειών
που προσφέρεται από την First Aid Academy. Απευθύνεται σε όσους επιθυμούν μια
ολοκληρωμένη γνώση που καλύπτει το σύνολο των περιστατικών που μπορούν να συμβούν
στο σπίτι, στον δρόμο, στον χώρο εργασίας ή στην παιδική ηλικία.
```

- [ ] **Step 2: Create `bls.mdx`**

```mdx
---
slug: bls
code: BLS
titleEl: Βασική Υποστήριξη Ζωής
titleEn: Basic Life Support (BLS)
audience: individual
category: life-support
durationHours: '6 - 7'
evaluation: Γραπτή και πρακτική εξέταση από τον εκπαιδευτή
summary: Αναγνώριση και αντιμετώπιση απειλητικών για τη ζωή περιστατικών με ΚΑΡΠΑ — με δυνατότητα προσθήκης Α.Ε.Α.
description: |
  Το πρόγραμμα είναι σχεδιασμένο ώστε όλοι οι ενδιαφερόμενοι να είναι σε θέση να
  αναγνωρίσουν και να αντιμετωπίσουν απειλητικά για τη ζωή περιστατικά εφαρμόζοντας
  Καρδιοπνευμονική Αναζωογόνηση σε περιπτώσεις απώλειας αναπνοής. Η εκπαίδευση
  μπορεί να συνδυαστεί με την διδασκαλία του Αυτόματου Εξωτερικού Απινιδωτή.
heroImage: ../../assets/programs/bls/hero.jpg
galleryImages: []
tags: ['ενήλικες', 'ΚΑΡΠΑ', 'BLS']
theory:
  - Ορισμός των πρώτων βοηθειών
  - Νόμοι του καλού Σαμαρείτη
  - Συναισθηματικές πτυχές
  - Αλυσίδα της επιβίωσης
  - Πίνακας βασικής ανατομίας
  - Έμφραγμα του μυοκαρδίου
  - Κοιλιακή Μαρμαρυγή
  - Έμφραξη αεροφόρου οδού
  - Σοβαρή αιμορραγία
  - Σωματική καταπληξία
  - Εγκεφαλικό επεισόδιο
  - Σοκ αναφυλαξίας
  - Τραυματισμοί σπονδυλικής στήλης
  - Μεταδιδόμενες ασθένειες — χρήση προστατευτικών υλικών
  - Η γραμμή της Ζωής — πρωτοβάθμια εκτίμηση
skills:
  - Καρδιοπνευμονική αναζωογόνηση
  - Θέση ανάνηψης
  - Διαχείριση αναίσθητου πάσχοντα
  - Ασφάλεια σκηνής
  - Διαχείριση αεραγωγού
  - Αντιμετώπιση πνιγμονής
  - Αντιμετώπιση εγκεφαλικού
  - Επιδέσεις
  - Αντιμετώπιση σοβαρής αιμορραγίας
  - Αντιμετώπιση καταπληξίας
  - Χειρισμός θύματος με τραύμα στη σπονδυλική στήλη
order: 2
featured: true
---

Το BLS αποτελεί τη βάση για κάθε ενδιαφερόμενο που θέλει να αποκτήσει αυτοπεποίθηση
στην αντιμετώπιση μιας ξαφνικής καρδιακής ανακοπής. Η ύλη ακολουθεί τα διεθνή
πρωτόκολλα του European Resuscitation Council (ERC).
```

- [ ] **Step 3: Create `cpr-aed.mdx`**

```mdx
---
slug: cpr-aed
code: CPR-AED
titleEl: ΚΑΡΠΑ – Αυτόματος Εξωτερικός Απινιδωτής
titleEn: CPR – AED
audience: individual
category: life-support
durationHours: '5'
evaluation: Γραπτή και πρακτική εξέταση από τον εκπαιδευτή
summary: Έγκαιρη διαπίστωση απώλειας αναπνοής και πλήρης κατάρτιση στη χρήση Αυτόματου Εξωτερικού Απινιδωτή.
description: |
  Το πρόγραμμα είναι σχεδιασμένο έτσι ώστε ο υποψήφιος πρώτος βοηθός να είναι σε
  θέση να διαπιστώσει έγκαιρα την απώλεια αναπνοής σε θύμα ατυχήματος και στη
  συνέχεια να καταρτιστεί επαρκώς στη χρήση του Αυτόματου Εξωτερικού Απινιδωτή.
heroImage: ../../assets/programs/cpr-aed/hero.jpg
galleryImages: []
tags: ['ΚΑΡΠΑ', 'AED', 'απινιδωτής']
theory:
  - Κοιλιακή μαρμαρυγή
  - Ξαφνική καρδιακή ανακοπή
  - Ελευθέρωση αναπνευστικής οδού
  - Αγωνιώδης αναπνοή
  - Καρδιοπνευμονική αναζωογόνηση σε ενήλικα και παιδί
  - Απινίδωση
  - Περιγραφή του Α.Ε.Α.
  - Φωνητικές εντολές
  - Ασφάλεια του Α.Ε.Α.
  - Αποτελέσματα του Α.Ε.Α.
skills:
  - Ασφάλεια σκηνής
  - Εξασφάλιση αναπνευστικής οδού
  - ΚΑΡΠΑ σε ενήλικα και παιδί
  - Θέση ανάνηψης
  - Χρήση Α.Ε.Α. σε ενήλικα
  - Χρήση Α.Ε.Α. σε παιδί
  - Συνδυασμός ΚΑΡΠΑ – Απινίδωσης
order: 3
featured: true
---

Σύντομο και εστιασμένο, το CPR – AED είναι το ιδανικό σεμινάριο για όσους θέλουν να
αποκτήσουν με τον πιο γρήγορο τρόπο την κρίσιμη γνώση που σώζει ζωές.
```

- [ ] **Step 4: Create `fa.mdx`**

```mdx
---
slug: fa
code: FA
titleEl: Πρώτες Βοήθειες
titleEn: First Aid (FA)
audience: individual
category: first-aid
durationHours: '6'
evaluation: Γραπτή και πρακτική εξέταση από τον εκπαιδευτή
prerequisite: Πιστοποιητικό «ΚΑΡΠΑ – Απινίδωση» ή «Απειλητικά Επείγοντα Περιστατικά»
summary: Αντιμετώπιση των πιο συχνών αλλά μη απειλητικών για τη ζωή τραυματισμών — επιδέσεις, κατάγματα, εγκαύματα.
description: |
  Το πρόγραμμα περιλαμβάνει τη διδασκαλία αντιμετώπισης των πιο συχνών αλλά μη
  απειλητικών για τη ζωή κοινών τραυματισμών. Για τη συμμετοχή απαιτείται
  πιστοποιητικό «ΚΑΡΠΑ – Απινίδωση» ή «Απειλητικά Επείγοντα Περιστατικά».
heroImage: ../../assets/programs/fa/hero.jpg
galleryImages: []
tags: ['τραυματισμοί', 'επιδέσεις', 'κατάγματα']
theory:
  - Επανάληψη ΚΑΡΠΑ ενηλίκου
  - Διαφορές ασθενειών και τραυματισμών
  - Αξιολόγηση τραυματισμού
  - Αξιολόγηση ασθένειας
  - Τριγωνικός επίδεσμος
  - Χρήση κυλινδρικού επιδέσμου
  - Μυϊκές θλάσεις, διαστρέμματα
  - Κατάγματα — εφαρμογή νάρθηκα
  - Εξαρθρώσεις
  - Τραυματισμοί οφθαλμών και οδόντων
  - Ηλεκτροπληξία
  - Εγκαύματα — ακραίες θερμοκρασίες
  - Διαβήτης
  - Αλλεργικές αντιδράσεις
  - Δηλητηριάσεις
  - Άσθμα
  - Τραύματα θώρακα
  - Επιληψία
  - Περιποίηση μικρών τραυμάτων
skills:
  - Ασφάλεια σκηνής
  - ΚΑΡΠΑ ενηλίκου
  - Θέση ανάνηψης
  - Αξιολόγηση τραυματισμού και ασθένειας
  - Επιδέσεις — τριγωνικός επίδεσμος
  - Εφαρμογή νάρθηκα
order: 4
featured: false
---
```

- [ ] **Step 5: Create `pfa.mdx`**

```mdx
---
slug: pfa
code: PFA
titleEl: Παιδιατρικές Πρώτες Βοήθειες
titleEn: Pediatric First Aid (PFA)
audience: parent
category: pediatric
durationHours: '12'
evaluation: Γραπτή και πρακτική εξέταση από τον εκπαιδευτή
summary: Η πληρέστερη εκπαίδευση παιδιατρικών πρώτων βοηθειών — πληροί τις προδιαγραφές του Συμβουλίου Διδασκαλίας Δεξιοτήτων (Ofsted GB).
description: |
  Το πρόγραμμα απευθύνεται τόσο σε ιδιώτες όσο και σε επαγγελματίες
  ενασχολούμενους με παιδιά. Πληροί τις προδιαγραφές που θέτει το Συμβούλιο
  Διδασκαλίας Δεξιοτήτων για Παιδιά (Ofsted GB) και αποτελεί ένα από τα πληρέστερα
  εκπαιδευτικά προγράμματα σε διεθνές επίπεδο. Επιλεκτικά διδάσκεται ο Α.Ε.Α. για παιδιά.
heroImage: ../../assets/programs/pfa/hero.jpg
galleryImages: []
tags: ['παιδιά', 'βρέφη', 'Ofsted', 'γονείς']
theory:
  - Πλάνο έκτακτης ανάγκης — φροντίδα του παιδιού
  - Βασική Υποστήριξη Ζωής Παιδιού και Βρέφους
  - Έμφραξη αναπνευστικής οδού — παιδί και βρέφος
  - Τραυματισμοί καταβύθισης
  - Σωματική καταπληξία
  - Σοβαρή και εσωτερική αιμορραγία
  - Άσθμα, μηνιγγίτιδα, σοκ αναφυλαξίας
  - Σπασμοί, κρίσεις πυρετού
  - Διαβήτης, δρεπανοκυτταρική αναιμία, κοκίτης
  - Εγκαύματα — ηλεκτρικά εγκαύματα
  - Τραυματισμοί στα οστά και στην κεφαλή
  - Δαγκώματα και κεντρίσματα
  - Τραυματισμοί οφθαλμών
  - Αναφορά ατυχήματος — κουτί πρώτων βοηθειών
skills:
  - Ασφάλεια σκηνής — αναγνώριση επείγοντος
  - Διαχείριση αεραγωγού
  - ΚΑΡΠΑ παιδιού και βρέφους
  - Πνιγμονή σε παιδί και βρέφος
  - Θέση ανάνηψης
  - Επιδέσεις — αντιμετώπιση αιμορραγίας
  - Διαχείριση κρίσης επιληψίας
  - Εφαρμογή νάρθηκα
  - Χειρισμός θύματος με κάκωση σπονδυλικής στήλης
order: 5
featured: true
---
```

- [ ] **Step 6: Create `epfa.mdx`**

```mdx
---
slug: epfa
code: EPFA
titleEl: Επείγουσες Παιδιατρικές Πρώτες Βοήθειες
titleEn: Emergency Pediatric First Aid (EPFA)
audience: parent
category: pediatric
durationHours: '6'
evaluation: Πρακτική εξέταση από τον εκπαιδευτή
summary: Οι ελάχιστες απαραίτητες γνώσεις υποστήριξης ζωής παιδιού και βρέφους — ιδανικό εντατικό για γονείς.
description: |
  Το πρόγραμμα είναι σχεδιασμένο ώστε όλοι οι συμμετέχοντες να αποκτήσουν τις
  ελάχιστες απαραίτητες γνώσεις προκειμένου να είναι σε θέση να υποστηρίξουν τη
  ζωή ενός παιδιού ή ενός βρέφους. Ο κύριος προσανατολισμός είναι η ΚΑΡΠΑ παιδιού
  και βρέφους και μπορεί να συνδυαστεί με τη χρήση Α.Ε.Α. για παιδιά.
heroImage: ../../assets/programs/epfa/hero.jpg
galleryImages: []
tags: ['παιδιά', 'βρέφη', 'εντατικό']
theory:
  - Πλάνο έκτακτης ανάγκης — φροντίδα του παιδιού
  - Βασική Υποστήριξη Ζωής Παιδιού και Βρέφους
  - Πνιγμονή σε παιδί και βρέφος
  - Σωματική καταπληξία — σοβαρή αιμορραγία
  - Σοκ αναφυλαξίας — κρίσεις με σπασμούς
  - Αναφορά ατυχήματος — κουτί πρώτων βοηθειών
skills:
  - Ασφάλεια σκηνής — αναγνώριση επείγοντος
  - Διαχείριση αεραγωγού
  - ΚΑΡΠΑ παιδιού και βρέφους
  - Πνιγμονή — παιδί και βρέφος
  - Θέση ανάνηψης
  - Επίδεση τραύματος — αντιμετώπιση αιμορραγίας
  - Διαχείριση κρίσης επιληψίας
order: 6
featured: false
---
```

- [ ] **Step 7: Create `faw.mdx`**

```mdx
---
slug: faw
code: FAW
titleEl: Πρώτες Βοήθειες στην Εργασία
titleEn: First Aid at Work (FAW)
audience: business
category: workplace
durationHours: '18'
evaluation: Γραπτή και πρακτική εξέταση από τον εκπαιδευτή
summary: Η πληρέστερη εργασιακή εκπαίδευση πρώτων βοηθειών — υποχρέωση και πλεονέκτημα κάθε εταιρείας.
description: |
  Το πρόγραμμα είναι σχεδιασμένο για να καταρτίσει τους εργαζόμενους που αναλαμβάνουν
  τον ρόλο του πρώτου βοηθού μέσα στον χώρο εργασίας. Καλύπτει τόσο απειλητικά όσο
  και μη απειλητικά για τη ζωή περιστατικά, σύμφωνα με τα διεθνή πρωτόκολλα RTI και ERC.
heroImage: ../../assets/programs/faw/hero.jpg
galleryImages: []
tags: ['εργασία', 'εταιρείες', 'υποχρεωτική κατάρτιση']
theory:
  - Νομικό πλαίσιο — ρόλος πρώτου βοηθού στην επιχείρηση
  - Αλυσίδα της επιβίωσης
  - Έμφραγμα — καρδιακή ανακοπή — εγκεφαλικό
  - Σοβαρή αιμορραγία — σοκ
  - Έμφραξη αεροφόρου οδού
  - Σπασμοί — επιληψία
  - Εγκαύματα — ηλεκτροπληξία
  - Τραυματισμοί στα οστά και στη σπονδυλική στήλη
  - Διαχείριση πολλαπλών θυμάτων
  - Αναφορά ατυχήματος — εξοπλισμός πρώτων βοηθειών
skills:
  - Ασφάλεια σκηνής — αναγνώριση επείγοντος
  - ΚΑΡΠΑ ενηλίκου — Α.Ε.Α.
  - Θέση ανάνηψης
  - Επιδέσεις — διαχείριση αιμορραγίας
  - Εφαρμογή νάρθηκα — μεταφορά τραυματία
  - Διαχείριση εγκαυμάτων και ηλεκτροπληξίας
  - Πρακτικά σενάρια εργασιακού περιβάλλοντος
order: 7
featured: false
---
```

- [ ] **Step 8: Create `efaw.mdx`**

```mdx
---
slug: efaw
code: EFAW
titleEl: Πρώτες Βοήθειες στην Εργασία — Επείγον (EFAW)
titleEn: Emergency First Aid at Work (EFAW)
audience: business
category: workplace
durationHours: '6'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή
summary: Οι ελάχιστες απαραίτητες δεξιότητες αντιμετώπισης επείγοντος για κάθε εργαζόμενο.
description: |
  Σχεδιασμένο ώστε να καταρτίσει κάθε εργαζόμενο με τις ελάχιστες απαραίτητες
  δεξιότητες αντιμετώπισης επείγοντος περιστατικού. Κύριος προσανατολισμός είναι η
  αντιμετώπιση απειλητικών περιστατικών και η ΚΑΡΠΑ.
heroImage: ../../assets/programs/efaw/hero.jpg
galleryImages: []
tags: ['εργασία', 'βασικό', 'εντατικό']
theory:
  - Εισαγωγή — αλυσίδα επιβίωσης
  - Νόμος του καλού Σαμαρείτη — ο ρόλος του πρώτου βοηθού
  - Έμφραγμα — αιφνίδια καρδιακή ανακοπή
  - Σοβαρή αιμορραγία — σωματική καταπληξία
  - Έμφραξη αναπνευστικής οδού
  - Εγκεφαλικό επεισόδιο
  - Επιληπτικές κρίσεις — σοκ αναφυλαξίας
  - Περιποίηση μικρών τραυμάτων
  - Ενεργοποίηση υπηρεσιών υγείας
skills:
  - Ασφάλεια σκηνής — αναγνώριση επείγοντος
  - Διαχείριση αεροφόρου οδού
  - ΚΑΡΠΑ — θέση ανάνηψης
  - Διαχείριση καρδιολογικού/εγκεφαλικού επεισοδίου
  - Επίδεση — διαχείριση σοβαρής αιμορραγίας
  - Αντιμετώπιση επιληψίας
order: 8
featured: false
---
```

- [ ] **Step 9: Verify schema parses (will fail until images exist — that's OK for now, but the YAML must parse)**

```bash
cd web && node -e "const fg=require('fast-glob');console.log(fg.sync('src/content/programs/*.mdx'))"
```

Expected: 8 file paths printed.

- [ ] **Step 10: Commit**

```bash
git add web/src/content/programs/
git commit -m "content: seed 8 program MDX files (CoFAT, BLS, CPR-AED, FA, PFA, EPFA, FAW, EFAW)"
```

---

### Task 10: Seed 21 client entries

**Files (create all):**
- `web/src/content/clients/aetoi.json`
- `web/src/content/clients/avis.json`
- `web/src/content/clients/g4s.json`
- `web/src/content/clients/lidl.json`
- `web/src/content/clients/new-agriculture.json`
- `web/src/content/clients/philips-hellas.json`
- `web/src/content/clients/sidma.json`
- `web/src/content/clients/technomar.json`
- `web/src/content/clients/titan.json`
- `web/src/content/clients/total-hellas.json`
- `web/src/content/clients/visa-europe.json`
- `web/src/content/clients/bodyline.json`
- `web/src/content/clients/deuchschool.json`
- `web/src/content/clients/elpa-plast.json`
- `web/src/content/clients/elpedissos.json`
- `web/src/content/clients/grandhotel-palace.json`
- `web/src/content/clients/iek-delta.json`
- `web/src/content/clients/kaisari.json`
- `web/src/content/clients/kipling-events.json`
- `web/src/content/clients/kolios.json`
- `web/src/content/clients/terna-energy.json`

> Image paths reference `../../assets/clients/<file>` — Task 13 copies the optimized PNGs/JPGs there. Each file follows the pattern below; vary `name`, `logo` (filename), and `sector`.

- [ ] **Step 1: Create the 21 JSON files**

Use this template, one per client. (Sector values are best-effort, swap as needed.)

```json
{
  "name": "Lidl",
  "logo": "../../assets/clients/lidl.jpg",
  "sector": "Λιανεμπόριο"
}
```

Mapping (name | filename | sector):

```
AETOI            | aetoi.png             | Ασφάλεια
AVIS             | avis.jpg              | Ενοικίαση οχημάτων
G4S              | g4s.jpg               | Ασφάλεια
Lidl             | lidl.jpg              | Λιανεμπόριο
New Agriculture  | new-agriculture.jpg   | Αγροτεχνολογία
Philips Hellas   | philips-hellas.png    | Τεχνολογία
SIDMA            | sidma.jpg             | Χάλυβας
TECHNOMAR        | technomar.jpg         | Ναυτιλία
TITAN            | titan.jpg             | Τσιμέντα — Δομικά
Total Hellas     | total-hellas.jpg      | Ενέργεια
VISA Europe      | visa-europe.jpg       | Χρηματοοικονομικές υπηρεσίες
B1 Bodyline      | bodyline.jpg          | Ευεξία
Deutsche Schule  | deuchschool.jpg       | Εκπαίδευση
Elpa-Plast       | elpa-plast.jpg        | Βιομηχανία πλαστικών
Elpedissos       | elpedissos.jpg        | Ενέργεια
Grand Hotel Palace | grandhotel-palace.jpg | Φιλοξενία
IEK Delta        | iek-delta.jpg         | Εκπαίδευση
Kaisari          | kaisari.jpg           | Επιχειρήσεις
Kipling Events   | kipling-events.jpg    | Διοργάνωση εκδηλώσεων
Kolios           | kolios.jpg            | Τρόφιμα
Terna Energy     | terna-energy.jpg      | Ενέργεια
```

- [ ] **Step 2: Commit**

```bash
git add web/src/content/clients/
git commit -m "content: seed 21 client entries"
```

---

### Task 11: Seed founder credentials

**Files:**
- `web/src/content/credentials/erc-bls-aed.json`
- `web/src/content/credentials/civil-protection-burns.json`
- `web/src/content/credentials/civil-protection-general.json`
- `web/src/content/credentials/civil-risk-emergency.json`
- `web/src/content/credentials/hellenic-air-force.json`
- `web/src/content/credentials/cofat-instructor.json`
- `web/src/content/credentials/community-first-aid-patras.json`

- [ ] **Step 1: Create each JSON**

```json
{
  "title": "BLS / AED Provider",
  "issuer": "European Resuscitation Council (ERC)",
  "yearIssued": 2011,
  "summary": "Πιστοποιητικό παρόχου Βασικής Υποστήριξης Ζωής & Αυτόματης Εξωτερικής Απινίδωσης.",
  "image": "../../assets/certificates/erc-bls-aed.jpg",
  "order": 1
}
```

Repeat for each (use the actual image filenames placed in Task 13):

```
title                                                    | image filename                       | order
BLS / AED Provider (ERC)                                 | erc-bls-aed.jpg                       | 1
Civil Protection — Burns & Electrical Injury Care        | civil-protection-burns.jpg            | 2
Civil Protection Certificate                             | civil-protection-general.jpg          | 3
Civil Risk Management — Emergency Situation              | civil-risk-emergency.jpg              | 4
Hellenic Air Force — Disaster Response Diploma           | hellenic-air-force.jpg                | 5
Complete First Aid Training (CoFAT) Instructor           | cofat-instructor.jpg                  | 6
Πρώτες Βοήθειες στην Κοινότητα — Πανεπιστήμιο Πατρών    | community-first-aid-patras.jpg        | 7
```

- [ ] **Step 2: Commit**

```bash
git add web/src/content/credentials/
git commit -m "content: seed founder credentials (ERC, RTI, Civil Protection, Air Force)"
```

---


## Group 4 — Asset pipeline

### Task 12: Logo SVG, favicon, OG image

**Files:**
- Create: `web/public/logo.svg`
- Create: `web/public/favicon.svg`
- Create: `web/public/apple-touch-icon.png`
- Create: `web/public/og-default.jpg`

- [ ] **Step 1: Copy the brand SVG**

The transparent print SVG already exists in the source assets. Copy it.

```bash
cp "/Users/marios/Desktop/Cursor/first-aid/first aid academy logos/Full logo with buffer(transparent)/Print_Transparent.svg" \
   /Users/marios/Desktop/Cursor/first-aid/web/public/logo.svg
```

- [ ] **Step 2: Create a simplified favicon SVG**

Use a heart glyph in Pulse Crimson on transparent background (small enough for 32×32 favicon clarity):

```svg
<!-- web/public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#D7263D" aria-hidden="true">
  <path d="M16 28s-9.5-6.16-12.04-12.4C2.07 11.06 4.92 6 9.85 6c2.4 0 4.51 1.27 6.15 3.27C17.64 7.27 19.75 6 22.15 6 27.08 6 29.93 11.06 28.04 15.6 25.5 21.84 16 28 16 28z"/>
</svg>
```

- [ ] **Step 3: Generate `apple-touch-icon.png` (180×180) from the brand PNG**

```bash
cd web/public
# Use ImageMagick if available; otherwise produce a PNG via Astro at build time.
# Fallback: copy the existing FullLogo PNG sized down using sips (macOS).
sips -Z 180 "/Users/marios/Desktop/Cursor/first-aid/first aid academy logos/Full logo with buffer(transparent)/FullLogo_Transparent.png" --out apple-touch-icon.png
```

Expected: `apple-touch-icon.png` is 180×180. If `sips` is unavailable, run any image tool to produce a 180×180 square PNG and place it here.

- [ ] **Step 4: Create `og-default.jpg` (1200×630) — placeholder for now**

```bash
cd web/public
# Quickest path: use the BLS hero photo. Will be replaced with a designed OG card later.
sips -Z 1200 -c 1200 630 \
  "/Users/marios/Desktop/Cursor/first-aid/προγραμματα κομπλε/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/cpr-training-1024x576.jpg" \
  --out og-default.jpg
```

Expected: 1200×630 jpg in place.

- [ ] **Step 5: Commit**

```bash
git add web/public/
git commit -m "feat(web): add logo.svg, favicon, apple-touch-icon, og-default"
```

---

### Task 13: Image organization + optimization

**Goal:** Place training photography under `web/src/assets/programs/<slug>/hero.jpg` (and a `gallery/` subfolder where ≥2 images exist) so the content-collection schema validates and `<Image />` can optimize at build time. Also place client logos and certificate images.

**Source → destination map:**

```
SOURCE (raw)                                                           DEST
=================================================================================================================================
προγραμματα κομπλε/ατομικα/Πλήρης Εκπαίδευση (CoFAT)/1.png         → web/src/assets/programs/cofat/hero.jpg
προγραμματα κομπλε/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/cpr-training-1024x576.jpg → web/src/assets/programs/bls/hero.jpg
  ...gallery: 31182-2048x1367.jpg, bigstock-first-aid-training-cpr-...1536x1025.jpg, first-aid-training-cpr-P62U7QB-2048x1367.jpg
προγραμματα κομπλε/ατομικα/ΚΑΡΠΑ – Αυτόματος Εξωτερικός Απινιδωτής ( CPR – AED)/20231107111052_cf6b5ed4.jpeg → web/src/assets/programs/cpr-aed/hero.jpg
προγραμματα κομπλε/ατομικα/Πρώτες Βοήθειες (FA)/iStock_000002809004XSmall_thumb_1_nu_8220A7E5.jpg → web/src/assets/programs/fa/hero.jpg
  ...gallery: bleeding_1_nu_11A4DFC1.jpg, fisst-aid-400x250.jpg
προγραμματα κομπλε/ατομικα/Παιδιατρικές Πρώτες Βοήθειες (PFA)/4.png  → web/src/assets/programs/pfa/hero.jpg
προγραμματα κομπλε/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Παιδιατρικές Πρώτες Βοήθειες.jpg → web/src/assets/programs/epfa/hero.jpg
  ...gallery: Παιδιατρικές Πρώτες Βοήθειες2.jpg, 3.jpg, 4.jpg, Paed_6_small_1_nu_7E0046A8.jpg
προγραμματα κομπλε/για επιχειρησεις/Πρώτες Βοήθειες στην Εργασία (FAW)/72469095_104153327712577_6923016501196750848_n.jpg → web/src/assets/programs/faw/hero.jpg
προγραμματα κομπλε/για επιχειρησεις/Πρώτες Βοήθειες στην Εργασία –  (EFAW)/72469095_104153327712577_6923016501196750848_n.jpg → web/src/assets/programs/efaw/hero.jpg
```

**Client logos:** copy each from `company/` into `web/src/assets/clients/` with normalized lowercase-kebab filenames matching the JSON entries from Task 10.

**Certificates:** copy from `πτυχια/` into `web/src/assets/certificates/` with normalized filenames matching Task 11.

- [ ] **Step 1: Create destination folders**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
mkdir -p src/assets/programs/{cofat,bls,cpr-aed,fa,pfa,epfa,faw,efaw}/{,gallery}
mkdir -p src/assets/clients src/assets/certificates src/assets/brand src/assets/hero
```

- [ ] **Step 2: Copy program hero images (rename to `hero.jpg`)**

```bash
SRC="/Users/marios/Desktop/Cursor/first-aid/προγραμματα κομπλε"
DST="/Users/marios/Desktop/Cursor/first-aid/web/src/assets/programs"

cp "$SRC/ατομικα/Πλήρης Εκπαίδευση (CoFAT)/1.png"                                               "$DST/cofat/hero.jpg"  # PNG → re-encoded by Astro at build
cp "$SRC/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/cpr-training-1024x576.jpg"                        "$DST/bls/hero.jpg"
cp "$SRC/ατομικα/ΚΑΡΠΑ – Αυτόματος Εξωτερικός Απινιδωτής ( CPR – AED)/20231107111052_cf6b5ed4.jpeg" "$DST/cpr-aed/hero.jpg"
cp "$SRC/ατομικα/Πρώτες Βοήθειες (FA)/iStock_000002809004XSmall_thumb_1_nu_8220A7E5.jpg"        "$DST/fa/hero.jpg"
cp "$SRC/ατομικα/Παιδιατρικές Πρώτες Βοήθειες (PFA)/4.png"                                      "$DST/pfa/hero.jpg"
cp "$SRC/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Παιδιατρικές Πρώτες Βοήθειες.jpg" "$DST/epfa/hero.jpg"
cp "$SRC/για επιχειρησεις/Πρώτες Βοήθειες στην Εργασία (FAW)/72469095_104153327712577_6923016501196750848_n.jpg" "$DST/faw/hero.jpg"
cp "$SRC/για επιχειρησεις/Πρώτες Βοήθειες στην Εργασία –  (EFAW)/72469095_104153327712577_6923016501196750848_n.jpg" "$DST/efaw/hero.jpg"
```

> If a hero file is actually a PNG, leave the `.jpg` filename — Astro's image service re-encodes by extension hint at build only when called with `format`. Cleanest: rename the truly-PNG source to `hero.png` AND change the matching MDX `heroImage` reference. For consistency, do this:

```bash
mv "$DST/cofat/hero.jpg" "$DST/cofat/hero.png"
mv "$DST/pfa/hero.jpg"   "$DST/pfa/hero.png"
```

Then update `web/src/content/programs/cofat.mdx` `heroImage:` → `../../assets/programs/cofat/hero.png` and `pfa.mdx` likewise.

- [ ] **Step 3: Copy gallery images for programs that have several**

```bash
# BLS gallery
cp "$SRC/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/31182-2048x1367.jpg"                       "$DST/bls/gallery/01.jpg"
cp "$SRC/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/bigstock-first-aid-training-cpr-252555160-1-1536x1025.jpg" "$DST/bls/gallery/02.jpg"
cp "$SRC/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/first-aid-training-cpr-P62U7QB-2048x1367.jpg" "$DST/bls/gallery/03.jpg"

# FA gallery
cp "$SRC/ατομικα/Πρώτες Βοήθειες (FA)/bleeding_1_nu_11A4DFC1.jpg"  "$DST/fa/gallery/01.jpg"
cp "$SRC/ατομικα/Πρώτες Βοήθειες (FA)/fisst-aid-400x250.jpg"      "$DST/fa/gallery/02.jpg"

# EPFA gallery
cp "$SRC/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Παιδιατρικές Πρώτες Βοήθειες2.jpg" "$DST/epfa/gallery/01.jpg"
cp "$SRC/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Παιδιατρικές Πρώτες Βοήθειες3.jpg" "$DST/epfa/gallery/02.jpg"
cp "$SRC/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Παιδιατρικές Πρώτες Βοήθειες4.jpg" "$DST/epfa/gallery/03.jpg"
cp "$SRC/ατομικα/Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (EPFA)/Paed_6_small_1_nu_7E0046A8.jpg"   "$DST/epfa/gallery/04.jpg"
```

For programs that wish to display the gallery, update the MDX `galleryImages: []` array to list the relative paths.

- [ ] **Step 4: Copy client logos with normalized names**

```bash
SRC=/Users/marios/Desktop/Cursor/first-aid/company
DST=/Users/marios/Desktop/Cursor/first-aid/web/src/assets/clients

cp "$SRC/AETOI-logo-200x116.png"                  "$DST/aetoi.png"
cp "$SRC/AVIS_new-200x116.jpg"                    "$DST/avis.jpg"
cp "$SRC/G4S_new-200x116.jpg"                     "$DST/g4s.jpg"
cp "$SRC/Lidl_new-200x116.jpg"                    "$DST/lidl.jpg"
cp "$SRC/NEW-AGRICULTURE-–-NEW-GENERATION-1.jpg"  "$DST/new-agriculture.jpg"
cp "$SRC/PHILIPS-HELLAS_-200x116.png"             "$DST/philips-hellas.png"
cp "$SRC/SIDMA-200x116.jpg"                       "$DST/sidma.jpg"
cp "$SRC/TECHNOMAR-SHIPPING-1-200x116.jpg"        "$DST/technomar.jpg"
cp "$SRC/TITAN__1_nu_908FE394-200x116.jpg"        "$DST/titan.jpg"
cp "$SRC/TOTAL_HELLAS_1_nu_3674BDD4-200x116.jpg"  "$DST/total-hellas.jpg"
cp "$SRC/VISA-EUROPE-GREECE-200x116.jpg"          "$DST/visa-europe.jpg"
cp "$SRC/b1_bodyline_1_nu_833BAE86-200x116.jpg"   "$DST/bodyline.jpg"
cp "$SRC/deuchschool_new-200x116.jpg"             "$DST/deuchschool.jpg"
cp "$SRC/elpa-plast-logo-200x116.jpg"             "$DST/elpa-plast.jpg"
cp "$SRC/elpedissos_new-200x116.jpg"              "$DST/elpedissos.jpg"
cp "$SRC/grandhotellpalace_new.jpg"               "$DST/grandhotel-palace.jpg"
cp "$SRC/iekdelta_new-200x116.jpg"                "$DST/iek-delta.jpg"
cp "$SRC/kaisari_new-200x116.jpg"                 "$DST/kaisari.jpg"
cp "$SRC/kiplingevents.jpg"                       "$DST/kipling-events.jpg"
cp "$SRC/kolios_new-1-200x116.jpg"                "$DST/kolios.jpg"
cp "$SRC/ternaenergy_New-200x116.jpg"             "$DST/terna-energy.jpg"
```

- [ ] **Step 5: Copy certificate images**

```bash
SRC=/Users/marios/Desktop/Cursor/first-aid/πτυχια
DST=/Users/marios/Desktop/Cursor/first-aid/web/src/assets/certificates

cp "$SRC/BLS AED Certificate By ERC.jpg"                                          "$DST/erc-bls-aed.jpg"
cp "$SRC/Civil Protection Burns & Electrical Injury Care Certificate.jpg"         "$DST/civil-protection-burns.jpg"
cp "$SRC/Civil Protection Certificate..jpg"                                       "$DST/civil-protection-general.jpg"
cp "$SRC/Civil Risk Managment Emergency Situation Certificate.jpg"                "$DST/civil-risk-emergency.jpg"
cp "$SRC/Hellienic Air Force Diploma Disaster Responce.jpg"                       "$DST/hellenic-air-force.jpg"
```

For the two PDF-only credentials (`COFAT.pdf`, `ΠΙΣΤΟΠΟΙΗΤΙΚΟ_06_ΠΡΒ.pdf`), generate a JPG preview of the first page (use macOS Preview → Export, or `sips` after a Quick Look render). Save as:

```
$DST/cofat-instructor.jpg
$DST/community-first-aid-patras.jpg
```

If converting on the spot is blocked, temporarily duplicate `civil-protection-general.jpg` to those filenames and flag a follow-up to replace with proper PDF previews.

- [ ] **Step 6: Run `astro build` to validate that all referenced images resolve**

```bash
cd web && npm run build
```

Expected: build succeeds; if any `heroImage` path is unresolved, the build aborts with a clear error pointing to the offending MDX. Fix the path in the MDX or copy the missing file.

- [ ] **Step 7: Commit**

```bash
git add web/src/assets web/src/content/programs/
git commit -m "assets: organize program photos, client logos, founder certificates"
```

---


## Group 5 — Reusable UI

### Task 14: UI primitives (Tag, IconHeart, Section, Container)

**Files:**
- Create: `web/src/components/ui/Tag.astro`
- Create: `web/src/components/ui/IconHeart.astro`
- Create: `web/src/components/layout/Container.astro`
- Create: `web/src/components/layout/Section.astro`

- [ ] **Step 1: Create `Tag.astro`**

```astro
---
// web/src/components/ui/Tag.astro
interface Props {
  variant?: 'crimson' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}
const { variant = 'neutral', size = 'sm', className = '' } = Astro.props;
const sizes = { sm: 'text-xs px-2.5 py-1', md: 'text-sm px-3 py-1.5' };
const variants = {
  crimson: 'bg-surface-crimson text-crimson-700',
  cyan:    'bg-surface-cyan text-cyan-700',
  neutral: 'bg-surface-soft text-ink-edge',
};
---
<span class={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size]} ${variants[variant]} ${className}`}>
  <slot />
</span>
```

- [ ] **Step 2: Create `IconHeart.astro`** (small inline mark, used in nav, hero accents)

```astro
---
interface Props { className?: string; size?: number; }
const { className = '', size = 20 } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 24 24" class={className} fill="currentColor" aria-hidden="true">
  <path d="M12 21s-7.6-4.93-9.63-9.92C1.16 7.45 3.44 3.5 7.38 3.5c1.92 0 3.61 1.02 4.62 2.62 1.01-1.6 2.7-2.62 4.62-2.62 3.94 0 6.22 3.95 5.01 7.58C19.6 16.07 12 21 12 21z"/>
</svg>
```

- [ ] **Step 3: Create `Container.astro`**

```astro
---
interface Props { as?: string; className?: string; }
const { as: Tag = 'div', className = '' } = Astro.props;
---
<Tag class={`container-x ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 4: Create `Section.astro`**

```astro
---
// web/src/components/layout/Section.astro
interface Props {
  tone?: 'default' | 'soft' | 'cyan' | 'crimson' | 'dark';
  pad?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}
const { tone = 'default', pad = 'lg', id, className = '' } = Astro.props;
const tones = {
  default: 'bg-white text-ink',
  soft:    'bg-surface-soft text-ink',
  cyan:    'bg-surface-cyan text-ink',
  crimson: 'bg-crimson text-white',
  dark:    'bg-ink-strong text-white',
};
const pads = { sm: 'py-12 md:py-16', md: 'py-16 md:py-20', lg: 'py-16 md:py-24' };
---
<section id={id} class={`${tones[tone]} ${pads[pad]} ${className}`}>
  <div class="container-x">
    <slot />
  </div>
</section>
```

- [ ] **Step 5: Commit**

```bash
git add web/src/components
git commit -m "feat(web): UI primitives — Tag, IconHeart, Container, Section"
```

---

### Task 15: Program-specific UI (DurationBadge, ProgramCard)

**Files:**
- Create: `web/src/components/programs/DurationBadge.astro`
- Create: `web/src/components/programs/ProgramCard.astro`

- [ ] **Step 1: Create `DurationBadge.astro`**

```astro
---
interface Props { hours: string; }
const { hours } = Astro.props;
---
<span class="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 bg-surface-cyan px-3 py-1.5 rounded-full">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
  {hours} ώρες
</span>
```

- [ ] **Step 2: Create `ProgramCard.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import DurationBadge from './DurationBadge.astro';
import Tag from '../ui/Tag.astro';
interface Props { entry: CollectionEntry<'programs'>; }
const { entry } = Astro.props;
const { titleEl, code, summary, durationHours, audience, heroImage } = entry.data;
const audienceLabel = { individual: 'Ιδιώτες', business: 'Επιχειρήσεις', parent: 'Γονείς' }[audience];
---
<a href={`/seminaria/${entry.slug}/`}
   class="group flex flex-col overflow-hidden rounded-2xl bg-white border border-hairline shadow-tile hover:shadow-tileHover transition-out hover:-translate-y-1 no-underline">
  <div class="relative aspect-[4/3] overflow-hidden bg-surface-soft">
    <Image src={heroImage} alt={titleEl} widths={[480, 768, 1200]} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" class="absolute inset-0 h-full w-full object-cover transition-out group-hover:scale-[1.03]" />
    <span class="absolute top-3 left-3 inline-flex items-center bg-white/95 backdrop-blur-sm text-crimson-700 font-bold tracking-wide text-xs px-2.5 py-1 rounded">{code}</span>
  </div>
  <div class="p-6 flex flex-col gap-3 flex-1">
    <div class="flex items-center gap-2">
      <DurationBadge hours={durationHours} />
      <Tag variant="crimson">{audienceLabel}</Tag>
    </div>
    <h3 class="text-lg md:text-xl font-semibold text-ink-strong group-hover:text-crimson transition-out">{titleEl}</h3>
    <p class="text-ink-muted text-sm leading-relaxed">{summary}</p>
    <span class="mt-auto inline-flex items-center gap-1 text-cyan-700 font-semibold text-sm group-hover:translate-x-1 transition-out">
      Λεπτομέρειες
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </span>
  </div>
</a>
```

- [ ] **Step 3: Commit**

```bash
git add web/src/components/programs
git commit -m "feat(web): program card and duration badge"
```

---


## Group 6 — Home page

The home page is built bottom-up: each section is a self-contained component, then assembled in `pages/index.astro` (Task 24). Section order follows the rhythm in DESIGN.md §5.

### Task 16: Home — Hero

**Files:**
- Create: `web/src/components/home/Hero.astro`
- Create: `web/src/assets/hero/home-hero.jpg` (already copied if you reuse a BLS photo; otherwise pick the cleanest training shot)

- [ ] **Step 1: Pick + copy hero photo**

```bash
cp "/Users/marios/Desktop/Cursor/first-aid/προγραμματα κομπλε/ατομικα/Βασική Υποστήριξη Ζωής (BLS)/first-aid-training-cpr-P62U7QB-2048x1367.jpg" \
   /Users/marios/Desktop/Cursor/first-aid/web/src/assets/hero/home-hero.jpg
```

- [ ] **Step 2: Create `Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../../assets/hero/home-hero.jpg';
import HeroSplit from '../motion/HeroSplit.astro';
import Button from '../ui/Button.astro';
---
<section class="relative isolate overflow-hidden bg-ink-strong text-white">
  <Image
    src={heroImg}
    alt=""
    widths={[768, 1280, 1920, 2400]}
    sizes="100vw"
    class="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
    loading="eager"
    fetchpriority="high"
  />
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-ink-strong/85 via-ink-strong/65 to-crimson/45"></div>

  <div class="container-x py-24 md:py-32 lg:py-40 relative">
    <p class="font-display font-semibold uppercase tracking-[0.2em] text-cyan-50/90 text-xs md:text-sm">
      First Aid Academy · Πιστοποιημένος Εκπαιδευτής RTI / ERC
    </p>
    <HeroSplit
      text="ΓΝΩΣΗ ΠΟΥ ΣΩΖΕΙ ΖΩΕΣ"
      as="h1"
      className="mt-6 font-display font-bold uppercase text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight max-w-4xl"
    />
    <p class="mt-6 text-white/85 text-lg md:text-xl max-w-2xl leading-relaxed">
      Σεμινάρια Πρώτων Βοηθειών σχεδιασμένα από εκπαιδευτή με εμπειρία πεδίου σε
      Πολιτική Προστασία και Πολεμική Αεροπορία. Για ιδιώτες, γονείς και επιχειρήσεις.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-3">
      <Button href="/kratisi/" variant="primary" size="lg">Κράτηση Σεμιναρίου</Button>
      <Button href="/seminaria/" variant="secondary" size="lg" className="bg-white/10 border-white/40 text-white hover:bg-white/20 ring-0">
        Δείτε όλα τα σεμινάρια
      </Button>
    </div>

    <ul class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
      <li class="border-t border-white/15 pt-3"><span class="block font-display font-bold text-2xl text-white">8</span><span class="text-white/70 text-sm">Πιστοποιημένα σεμινάρια</span></li>
      <li class="border-t border-white/15 pt-3"><span class="block font-display font-bold text-2xl text-white">21+</span><span class="text-white/70 text-sm">Εταιρείες πελάτες</span></li>
      <li class="border-t border-white/15 pt-3"><span class="block font-display font-bold text-2xl text-white">ERC</span><span class="text-white/70 text-sm">Διεθνή πρωτόκολλα</span></li>
      <li class="border-t border-white/15 pt-3"><span class="block font-display font-bold text-2xl text-white">2014</span><span class="text-white/70 text-sm">Από το</span></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add web/src/components/home/Hero.astro web/src/assets/hero
git commit -m "feat(web): home hero with full-bleed photography, scrim, key stats"
```

---

### Task 17: Home — ValueProps

**Files:**
- Create: `web/src/components/home/ValueProps.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Section from '../layout/Section.astro';
import Reveal from '../motion/Reveal.astro';
const props = [
  {
    icon: 'shield',
    title: 'Διεθνή Πρωτόκολλα',
    body: 'Κάθε σεμινάριο βασίζεται στα πρότυπα του European Resuscitation Council (ERC) και της Rescue Training International (RTI).',
  },
  {
    icon: 'pulse',
    title: 'Εμπειρία Πεδίου',
    body: 'Εκπαίδευση από επαγγελματία με πραγματική εμπειρία σε Πολιτική Προστασία και Πολεμική Αεροπορία — όχι μόνο θεωρία.',
  },
  {
    icon: 'tools',
    title: 'Επαγγελματικός Εξοπλισμός',
    body: 'Πρόπλασμα ΚΑΡΠΑ, εκπαιδευτικός Α.Ε.Α., παιδιατρικά πρόπλασμα και υλικά τελευταίας τεχνολογίας.',
  },
  {
    icon: 'group',
    title: 'Ιδιώτες & Επιχειρήσεις',
    body: 'Ευέλικτα σχήματα: σεμινάρια ανά τμήμα, ενδοεπιχειρησιακά πακέτα, εξατομικευμένα προγράμματα.',
  },
];
---
<Section tone="soft">
  <div class="max-w-2xl">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Γιατί First Aid Academy</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Τέσσερις λόγοι να επιλέξετε εμάς</h2>
    <p class="mt-4 text-ink-muted text-lg">Δεν είναι απλώς ένα πιστοποιητικό — είναι μια επένδυση στην ασφάλεια της ζωής.</p>
  </div>

  <Reveal stagger={0.1}>
    <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {props.map((p) => (
        <li class="bg-white border border-hairline rounded-2xl p-6 shadow-tile">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-crimson text-crimson">
            {p.icon === 'shield' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            {p.icon === 'pulse'  && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            {p.icon === 'tools'  && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
            {p.icon === 'group'  && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          </div>
          <h3 class="mt-4 font-semibold text-lg text-ink-strong">{p.title}</h3>
          <p class="mt-2 text-ink-muted leading-relaxed">{p.body}</p>
        </li>
      ))}
    </ul>
  </Reveal>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/ValueProps.astro
git commit -m "feat(web): home value-props section with 4 differentiators"
```

---

### Task 18: Home — ProgramsTeaser (3 featured programs)

**Files:**
- Create: `web/src/components/home/ProgramsTeaser.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { getCollection } from 'astro:content';
import Section from '../layout/Section.astro';
import ProgramCard from '../programs/ProgramCard.astro';
import Button from '../ui/Button.astro';
import Reveal from '../motion/Reveal.astro';
const all = await getCollection('programs');
const featured = all.filter(p => p.data.featured).sort((a,b) => a.data.order - b.data.order);
---
<Section tone="default">
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Τα σεμινάριά μας</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Επιλέξτε το πρόγραμμα που σας ταιριάζει</h2>
      <p class="mt-4 text-ink-muted text-lg">Από βασική υποστήριξη ζωής έως ολοκληρωμένη εκπαίδευση 18 ωρών — υπάρχει το κατάλληλο σεμινάριο για κάθε ανάγκη.</p>
    </div>
    <Button href="/seminaria/" variant="ghost" size="md">Όλα τα σεμινάρια →</Button>
  </div>

  <Reveal stagger={0.1}>
    <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featured.map((entry) => (
        <li><ProgramCard entry={entry} /></li>
      ))}
    </ul>
  </Reveal>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/ProgramsTeaser.astro
git commit -m "feat(web): home programs teaser (featured)"
```

---

### Task 19: Home — ForBusinesses

**Files:**
- Create: `web/src/components/home/ForBusinesses.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { Image } from 'astro:assets';
import faw from '../../assets/programs/faw/hero.jpg';
import Section from '../layout/Section.astro';
import Button from '../ui/Button.astro';
import Reveal from '../motion/Reveal.astro';
---
<Section tone="cyan">
  <div class="grid lg:grid-cols-12 gap-10 items-center">
    <Reveal stagger={0.08} className="lg:col-span-6">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Για επιχειρήσεις</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Πρώτες Βοήθειες στον χώρο εργασίας</h2>
      <p class="mt-4 text-ink leading-relaxed text-lg">
        Η εκπαίδευση πρώτου βοηθού δεν είναι μόνο νομική απαίτηση — είναι ουσιαστική
        ασφάλεια για την ομάδα σας. Σχεδιάζουμε ενδοεπιχειρησιακά σεμινάρια ευέλικτης
        διάρκειας (6 ή 18 ώρες) στον δικό σας χώρο, με πρακτικά σενάρια προσαρμοσμένα
        στην καθημερινότητα της επιχείρησής σας.
      </p>
      <ul class="mt-6 space-y-3 text-ink-edge">
        <li class="flex gap-3 items-start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E7DA1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg><span>Διεξαγωγή στον χώρο σας — μηδενικός χρόνος μετακίνησης</span></li>
        <li class="flex gap-3 items-start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E7DA1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg><span>Πιστοποίηση συμμετοχής για κάθε εργαζόμενο</span></li>
        <li class="flex gap-3 items-start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E7DA1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg><span>Σενάρια προσαρμοσμένα στον κλάδο σας</span></li>
        <li class="flex gap-3 items-start"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E7DA1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg><span>Πλήρης εξοπλισμός εκπαίδευσης</span></li>
      </ul>
      <div class="mt-8 flex flex-wrap gap-3">
        <Button href="/etairikoi/" variant="primary">Μάθετε περισσότερα</Button>
        <Button href="/seminaria/faw/" variant="secondary">FAW — 18 ώρες</Button>
        <Button href="/seminaria/efaw/" variant="ghost">EFAW — 6 ώρες</Button>
      </div>
    </Reveal>

    <div class="lg:col-span-6 relative">
      <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-tile">
        <Image src={faw} alt="Εκπαίδευση πρώτων βοηθειών στον χώρο εργασίας" widths={[480, 768, 1024]} sizes="(min-width: 1024px) 50vw, 100vw" class="h-full w-full object-cover" />
      </div>
      <div class="absolute -bottom-6 -left-6 bg-white border border-hairline rounded-2xl shadow-tile px-5 py-4 hidden md:block">
        <p class="font-display font-bold text-2xl text-crimson">21+</p>
        <p class="text-sm text-ink-muted">εταιρείες έχουν εκπαιδευτεί</p>
      </div>
    </div>
  </div>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/ForBusinesses.astro
git commit -m "feat(web): home for-businesses block with FAW/EFAW callouts"
```

---

### Task 20: Home — ClientsStrip

**Files:**
- Create: `web/src/components/home/ClientsStrip.astro`

- [ ] **Step 1: Create the component**

```astro
---
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';
import Section from '../layout/Section.astro';
const clients = (await getCollection('clients')).sort((a, b) => a.data.name.localeCompare(b.data.name));
---
<Section tone="default" pad="md">
  <div class="text-center max-w-2xl mx-auto">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Μας εμπιστεύονται</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-2xl md:text-3xl">Συνεργασίες με κορυφαίες εταιρείες</h2>
  </div>

  <ul class="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 items-center">
    {clients.map((c) => (
      <li class="flex justify-center" title={c.data.name}>
        <Image src={c.data.logo} alt={c.data.name} widths={[120, 200]} sizes="120px" class="max-h-14 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-out" />
      </li>
    ))}
  </ul>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/ClientsStrip.astro
git commit -m "feat(web): clients strip — 21 logos with grayscale-on-rest"
```

---

### Task 21: Home — CredentialsBand (founder certifications)

**Files:**
- Create: `web/src/components/home/CredentialsBand.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Section from '../layout/Section.astro';
import Reveal from '../motion/Reveal.astro';
const items = [
  { label: 'European Resuscitation Council', sub: 'BLS / AED Provider' },
  { label: 'Rescue Training International', sub: 'Πιστοποιημένος Εκπαιδευτής' },
  { label: 'Πολιτική Προστασία', sub: 'Διαχείριση Καταστροφών' },
  { label: 'Πολεμική Αεροπορία', sub: '206 Πτέρυγα Αεροπορικών Υποδομών' },
  { label: 'Πανεπιστήμιο Πατρών', sub: 'Πρώτες Βοήθειες στην Κοινότητα' },
];
---
<Section tone="default" pad="md">
  <div class="max-w-3xl">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Πιστοποιήσεις & Φορείς</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-2xl md:text-3xl">Εκπαίδευση που πατάει σε γερά θεμέλια</h2>
  </div>
  <Reveal stagger={0.06}>
    <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((it) => (
        <li class="border-t-2 border-crimson pt-4">
          <p class="font-display font-bold text-ink-strong text-base leading-snug">{it.label}</p>
          <p class="mt-1 text-ink-muted text-sm">{it.sub}</p>
        </li>
      ))}
    </ul>
  </Reveal>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/CredentialsBand.astro
git commit -m "feat(web): credentials band on home (ERC, RTI, Civil Protection, Air Force, Patras)"
```

---

### Task 22: Home — FounderTeaser

**Files:**
- Create: `web/src/components/home/FounderTeaser.astro`
- Create: `web/src/assets/brand/founder.jpg` (use the heart-anatomy logo as a placeholder, or any portrait the client supplies later — for now use the logo)

- [ ] **Step 1: Use logo as portrait placeholder**

```bash
cp "/Users/marios/Desktop/Cursor/first-aid/first aid academy logos/no buffer(transparent)/FullLogo_Transparent_NoBuffer.png" \
   /Users/marios/Desktop/Cursor/first-aid/web/src/assets/brand/founder.png
```

> When the client provides a real portrait of Spyros, replace `founder.png` and the import path. Flag this in the launch checklist.

- [ ] **Step 2: Create the component**

```astro
---
import { Image } from 'astro:assets';
import founder from '../../assets/brand/founder.png';
import Section from '../layout/Section.astro';
import Button from '../ui/Button.astro';
import Reveal from '../motion/Reveal.astro';
---
<Section tone="default">
  <div class="grid lg:grid-cols-12 gap-10 items-center">
    <div class="lg:col-span-5 order-2 lg:order-1">
      <Reveal stagger={0.08}>
        <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Ο εκπαιδευτής</p>
        <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Σπύρος Τζιρτζιλάκης</h2>
        <p class="mt-2 text-ink-edge font-semibold">Πιστοποιημένος Εκπαιδευτής Πρώτων Βοηθειών — RTI / ERC</p>
        <p class="mt-6 text-ink leading-relaxed text-lg">
          Στην κρίσιμη στιγμή, η διαφορά ανάμεσα στη ζωή και την απώλεια είναι η ψύχραιμη γνώση.
          Με εμπειρία στην Πολιτική Προστασία και εξειδικευμένη εκπαίδευση από κορυφαίους φορείς,
          αποστολή μου είναι να μεταδώσω αυτή τη γνώση σε εσάς — με τα πιο σύγχρονα και ποιοτικά
          μέσα της αγοράς.
        </p>
        <Button href="/sxetika/" variant="secondary" className="mt-8">Διαβάστε το βιογραφικό</Button>
      </Reveal>
    </div>
    <div class="lg:col-span-7 order-1 lg:order-2">
      <div class="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] bg-surface-soft rounded-3xl overflow-hidden flex items-center justify-center p-10">
        <Image src={founder} alt="First Aid Academy — λογότυπο" widths={[400, 600, 800]} sizes="(min-width: 1024px) 40vw, 100vw" class="w-full max-w-md h-auto object-contain" />
      </div>
    </div>
  </div>
</Section>
```

- [ ] **Step 3: Commit**

```bash
git add web/src/components/home/FounderTeaser.astro web/src/assets/brand
git commit -m "feat(web): home founder teaser block"
```

---

### Task 23: Home — BookingCTA (full-bleed crimson band)

**Files:**
- Create: `web/src/components/home/BookingCTA.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Section from '../layout/Section.astro';
import Button from '../ui/Button.astro';
import { phone } from '../../lib/nav';
---
<Section tone="crimson">
  <div class="grid md:grid-cols-12 items-center gap-8">
    <div class="md:col-span-8">
      <h2 class="font-display font-bold uppercase text-white text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
        Έτοιμοι να μάθετε να σώζετε ζωές;
      </h2>
      <p class="mt-4 text-white/90 text-lg max-w-2xl">
        Κρατήστε σήμερα τη θέση σας ή τηλεφωνήστε για προσωπική ενημέρωση. Η επόμενη
        ομαδική εκπαίδευση είναι πάντα στη γωνία.
      </p>
    </div>
    <div class="md:col-span-4 flex flex-col gap-3 md:items-end">
      <Button href="/kratisi/" variant="primary" size="lg" className="bg-white !text-crimson hover:bg-white/90">
        Κάντε Κράτηση
      </Button>
      <a href={`tel:${phone.tel}`} class="text-white/85 hover:text-white font-semibold no-underline">
        ή τηλεφωνήστε στο {phone.display}
      </a>
    </div>
  </div>
</Section>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/home/BookingCTA.astro
git commit -m "feat(web): home final crimson CTA band"
```

---

### Task 24: Assemble Home page

**Files:**
- Modify: `web/src/pages/index.astro`

- [ ] **Step 1: Replace `index.astro` with full assembly**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from '../components/home/Hero.astro';
import ValueProps from '../components/home/ValueProps.astro';
import ProgramsTeaser from '../components/home/ProgramsTeaser.astro';
import ForBusinesses from '../components/home/ForBusinesses.astro';
import ClientsStrip from '../components/home/ClientsStrip.astro';
import CredentialsBand from '../components/home/CredentialsBand.astro';
import FounderTeaser from '../components/home/FounderTeaser.astro';
import BookingCTA from '../components/home/BookingCTA.astro';
---
<PageLayout
  title="First Aid Academy"
  description="Σεμινάρια Πρώτων Βοηθειών για ιδιώτες, γονείς και επιχειρήσεις. Πιστοποιημένος εκπαιδευτής RTI / ERC. Κρατήστε τη θέση σας σήμερα.">
  <Hero />
  <ValueProps />
  <ProgramsTeaser />
  <ForBusinesses />
  <ClientsStrip />
  <CredentialsBand />
  <FounderTeaser />
  <BookingCTA />
</PageLayout>
```

- [ ] **Step 2: Run dev + manual review**

```bash
cd web && npm run dev -- --port 4321
```

Visit `http://localhost:4321/`. Walk every section at 1440 / 1024 / 768 / 375 viewport widths. Verify:
- Hero photo loads, headline animates word-by-word, no CLS.
- Sticky header behaves correctly on scroll.
- All 3 featured program cards link to working slugs (will 404 until Task 27 — note that as expected).
- Reveal animations stagger as you scroll.
- Footer renders.

- [ ] **Step 3: Run a build to surface errors early**

```bash
cd web && npm run build
```

Expected: build succeeds (or fails only on missing `/seminaria/[slug]/` static paths, depending on Task 27 timing — those failures are acceptable here only if they reference missing pages, not missing images/content).

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/index.astro
git commit -m "feat(web): assemble home page (8 sections)"
```

---


## Group 7 — About / Σχετικά page

### Task 25: About page (`sxetika.astro`)

**Files:**
- Create: `web/src/pages/sxetika.astro`

- [ ] **Step 1: Create the page**

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';
import Reveal from '../components/motion/Reveal.astro';
import Tag from '../components/ui/Tag.astro';
import Button from '../components/ui/Button.astro';
import founder from '../assets/brand/founder.png';

const credentials = (await getCollection('credentials')).sort((a, b) => a.data.order - b.data.order);
---
<PageLayout
  title="Σχετικά με τον Εκπαιδευτή"
  description="Σπύρος Τζιρτζιλάκης — Πιστοποιημένος Εκπαιδευτής Πρώτων Βοηθειών RTI / ERC. Εμπειρία πεδίου σε Πολιτική Προστασία και Πολεμική Αεροπορία.">

  <Section tone="default" pad="lg">
    <div class="grid lg:grid-cols-12 gap-12 items-start">
      <div class="lg:col-span-5">
        <div class="aspect-[4/5] bg-surface-soft rounded-3xl overflow-hidden flex items-center justify-center p-10 sticky top-28">
          <Image src={founder} alt="Σπύρος Τζιρτζιλάκης" widths={[400, 600, 800]} sizes="(min-width: 1024px) 40vw, 100vw" class="w-full max-w-sm h-auto object-contain" />
        </div>
      </div>
      <div class="lg:col-span-7">
        <Reveal stagger={0.06}>
          <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Ο Εκπαιδευτής</p>
          <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Σπύρος Τζιρτζιλάκης</h1>
          <p class="mt-2 text-ink-edge font-semibold text-lg">Πιστοποιημένος Εκπαιδευτής Πρώτων Βοηθειών — Διεθνείς Πιστοποιήσεις & Εμπειρία Πεδίου</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <Tag variant="crimson">RTI Instructor</Tag>
            <Tag variant="cyan">ERC BLS/AED</Tag>
            <Tag variant="neutral">Πολιτική Προστασία</Tag>
            <Tag variant="neutral">Πολεμική Αεροπορία</Tag>
          </div>

          <h2 class="mt-10 text-2xl font-semibold text-ink-strong">Η αποστολή μου</h2>
          <p class="mt-3 text-ink leading-relaxed">
            Στην κρίσιμη στιγμή, η διαφορά ανάμεσα στη ζωή και την απώλεια είναι η ψύχραιμη γνώση.
            Με εμπειρία στην Πολιτική Προστασία και εξειδικευμένη εκπαίδευση από κορυφαίους φορείς,
            αποστολή μου είναι να μεταδώσω αυτή τη γνώση σε εσάς, χρησιμοποιώντας τα πιο σύγχρονα
            και ποιοτικά μέσα της αγοράς.
          </p>

          <h2 class="mt-10 text-2xl font-semibold text-ink-strong">Εξειδίκευση & κύρος</h2>
          <ul class="mt-3 space-y-4 text-ink leading-relaxed">
            <li><strong class="text-ink-strong">Πιστοποιημένος Εκπαιδευτής (Instructor):</strong> διαθέτω την επίσημη άδεια από την Rescue Training International (RTI) για εκπαίδευση σε Advanced First Aid και Πρώτες Βοήθειες στον Χώρο Εργασίας.</li>
            <li><strong class="text-ink-strong">Ακαδημαϊκή υπεροχή:</strong> απόφοιτος του εξειδικευμένου προγράμματος «Πρώτες Βοήθειες στην Κοινότητα» του Πανεπιστημίου Πατρών, με εντατική εκπαίδευση σε ΚΑΡΠΑ, παιδιατρικές πρώτες βοήθειες και αντιμετώπιση τραύματος.</li>
            <li><strong class="text-ink-strong">Διεθνή πρωτόκολλα:</strong> κάθε διδασκαλία βασίζεται στα πρότυπα του European Resuscitation Council (ERC) και της RTI — οι πιο έγκυρες μέθοδοι παγκοσμίως.</li>
          </ul>

          <h2 class="mt-10 text-2xl font-semibold text-ink-strong">Εμπειρία σε διαχείριση κρίσεων</h2>
          <p class="mt-3 text-ink leading-relaxed">
            Η θεωρία πάντα είναι απλά θεωρία. Δεν μένουμε μόνο σε αυτή — η εμπειρία μου έχει
            σφυρηλατηθεί μέσα από:
          </p>
          <ul class="mt-3 space-y-2 text-ink list-disc pl-6">
            <li>Εκπαίδευση στην Αντιμετώπιση Καταστροφών από την Πολεμική Αεροπορία (206 Πτέρυγα Αεροπορικών Υποδομών).</li>
            <li>Εθελοντική δράση και εκπαίδευση στη Διαχείριση Κινδύνων και Κρίσεων (Ι.ΝΕ.ΔΙ.ΒΙ.Μ. & Πολιτική Προστασία).</li>
            <li>Εξειδίκευση στην επείγουσα φροντίδα εγκαυμάτων και ηλεκτροπληξίας.</li>
          </ul>

          <h2 class="mt-10 text-2xl font-semibold text-ink-strong">Γιατί να επιλέξετε τα σεμινάριά μου</h2>
          <p class="mt-3 text-ink leading-relaxed">
            Επειδή συνδυάζω τον επαγγελματικό εξοπλισμό τελευταίας τεχνολογίας με την πρακτική
            γνώση που μόνο η εμπειρία στην Rescue Training International μπορεί να προσφέρει.
            Είτε είστε ιδιώτης, γονέας, είτε επιχείρηση — η εκπαίδευση μαζί μου δεν είναι απλώς
            ένα πιστοποιητικό. Είναι μια επένδυση στην ασφάλεια της ζωής, μια εμπειρία ζωής.
          </p>

          <div class="mt-10 flex flex-wrap gap-3">
            <Button href="/seminaria/" variant="primary">Δείτε τα σεμινάρια</Button>
            <Button href="/kratisi/" variant="secondary">Κάντε κράτηση</Button>
          </div>
        </Reveal>
      </div>
    </div>
  </Section>

  <Section tone="soft">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Πιστοποιήσεις & Διπλώματα</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-3xl">Επίσημοι τίτλοι & εκπαιδευτικές πιστοποιήσεις</h2>
      <p class="mt-4 text-ink-muted text-lg">Όλα τα διπλώματα είναι διαθέσιμα προς επιθεώρηση κατόπιν αιτήματος.</p>
    </div>

    <Reveal stagger={0.08}>
      <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {credentials.map((c) => (
          <li class="bg-white border border-hairline rounded-2xl overflow-hidden shadow-tile">
            <div class="aspect-[4/3] bg-surface-soft overflow-hidden">
              <Image src={c.data.image} alt={c.data.title} widths={[400, 600, 800]} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" class="h-full w-full object-cover" />
            </div>
            <div class="p-5">
              <p class="font-semibold text-ink-strong leading-snug">{c.data.title}</p>
              <p class="mt-1 text-ink-muted text-sm">{c.data.issuer}{c.data.yearIssued ? ` · ${c.data.yearIssued}` : ''}</p>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Run dev + visually check at 3 viewports**

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/sxetika.astro
git commit -m "feat(web): about/Σχετικά page with founder bio + credentials grid"
```

---

## Group 8 — Programs index + detail

### Task 26: Programs index page (`/seminaria/`)

**Files:**
- Create: `web/src/pages/seminaria/index.astro`

- [ ] **Step 1: Create the page with category filter (static, no JS — just visual grouping)**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import Section from '../../components/layout/Section.astro';
import ProgramCard from '../../components/programs/ProgramCard.astro';
import Reveal from '../../components/motion/Reveal.astro';

const all = (await getCollection('programs')).sort((a, b) => a.data.order - b.data.order);
const individuals = all.filter(p => p.data.audience !== 'business');
const businesses  = all.filter(p => p.data.audience === 'business');
---
<PageLayout
  title="Σεμινάρια"
  description="Όλα τα σεμινάρια Πρώτων Βοηθειών της First Aid Academy — από Βασική Υποστήριξη Ζωής έως Παιδιατρικές Πρώτες Βοήθειες και ενδοεπιχειρησιακή κατάρτιση.">

  <Section tone="default" pad="lg">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Σεμινάρια</p>
      <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Όλα τα σεμινάρια Πρώτων Βοηθειών</h1>
      <p class="mt-4 text-ink-muted text-lg leading-relaxed">
        Από εντατικά σεμινάρια 5 ωρών έως ολοκληρωμένη κατάρτιση 18 ωρών — επιλέξτε
        το πρόγραμμα που ταιριάζει στις ανάγκες σας. Όλα τα σεμινάρια καταλήγουν σε
        αξιολόγηση και πιστοποιητικό συμμετοχής.
      </p>
    </div>
  </Section>

  <Section tone="soft" pad="lg">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Για ιδιώτες & γονείς</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Ατομικά προγράμματα</h2>
    <Reveal stagger={0.08}>
      <ul class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {individuals.map((p) => <li><ProgramCard entry={p} /></li>)}
      </ul>
    </Reveal>
  </Section>

  <Section tone="cyan" pad="lg">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Για επιχειρήσεις</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Ενδοεπιχειρησιακή εκπαίδευση</h2>
    <Reveal stagger={0.08}>
      <ul class="mt-10 grid gap-6 md:grid-cols-2">
        {businesses.map((p) => <li><ProgramCard entry={p} /></li>)}
      </ul>
    </Reveal>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Verify dev**: `/seminaria/` lists 6 individuals + 2 business cards. Each card link is broken until Task 27.

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/seminaria/index.astro
git commit -m "feat(web): /seminaria index — individual + business categories"
```

---

### Task 27: Program detail dynamic page (`/seminaria/[slug]/`)

**Files:**
- Create: `web/src/pages/seminaria/[slug].astro`
- Create: `web/src/components/programs/ProgramHero.astro`
- Create: `web/src/components/programs/CurriculumTable.astro`
- Create: `web/src/components/programs/RelatedPrograms.astro`
- Create: `web/src/components/programs/BookProgramCTA.astro`

- [ ] **Step 1: Create `ProgramHero.astro`**

```astro
---
import { Image } from 'astro:assets';
import DurationBadge from './DurationBadge.astro';
import Tag from '../ui/Tag.astro';
import Button from '../ui/Button.astro';
interface Props {
  code: string;
  titleEl: string;
  summary: string;
  durationHours: string;
  audience: string;
  prerequisite?: string;
  heroImage: any;
  slug: string;
}
const { code, titleEl, summary, durationHours, audience, prerequisite, heroImage, slug } = Astro.props;
const audienceLabel = { individual: 'Ιδιώτες', business: 'Επιχειρήσεις', parent: 'Γονείς' }[audience] ?? audience;
---
<section class="relative isolate bg-ink-strong text-white overflow-hidden">
  <Image src={heroImage} alt="" widths={[768, 1280, 1920]} sizes="100vw" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" loading="eager" fetchpriority="high" />
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-ink-strong/85 via-ink-strong/60 to-crimson/40"></div>
  <div class="container-x py-20 md:py-28">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <span class="inline-flex items-center bg-white text-crimson font-bold tracking-wide text-xs px-2.5 py-1 rounded">{code}</span>
      <Tag variant="cyan">{audienceLabel}</Tag>
      <DurationBadge hours={durationHours} />
    </div>
    <h1 class="mt-6 font-display font-bold uppercase text-white text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-4xl">{titleEl}</h1>
    <p class="mt-6 text-white/85 text-lg max-w-3xl leading-relaxed">{summary}</p>
    {prerequisite && (
      <p class="mt-4 text-cyan-50 text-sm">
        <strong class="font-semibold">Προαπαιτούμενο:</strong> {prerequisite}
      </p>
    )}
    <div class="mt-8 flex flex-wrap gap-3">
      <Button href={`/kratisi/?program=${slug}`} variant="primary" size="lg">Κάντε κράτηση γι' αυτό το σεμινάριο</Button>
      <Button href="/epikoinonia/" variant="secondary" size="lg" className="bg-white/10 border-white/40 text-white hover:bg-white/20 ring-0">Επικοινωνήστε</Button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `CurriculumTable.astro`**

```astro
---
interface Props { theory: string[]; skills: string[]; }
const { theory, skills } = Astro.props;
---
<div class="grid md:grid-cols-2 gap-8">
  <div>
    <h3 class="text-xl font-semibold text-ink-strong">Ανάπτυξη θεωρίας</h3>
    <p class="mt-2 text-sm text-ink-muted">Όσα θα μάθετε στη θεωρητική ενότητα.</p>
    <ul class="mt-4 space-y-2.5">
      {theory.map((t) => (
        <li class="flex gap-3 items-start">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E7DA1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-1 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-ink leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  </div>
  <div>
    <h3 class="text-xl font-semibold text-ink-strong">Ανάπτυξη δεξιοτήτων</h3>
    <p class="mt-2 text-sm text-ink-muted">Πρακτικά skills που θα εξασκηθείτε.</p>
    <ul class="mt-4 space-y-2.5">
      {skills.map((s) => (
        <li class="flex gap-3 items-start">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D7263D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-1 shrink-0"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span class="text-ink leading-relaxed">{s}</span>
        </li>
      ))}
    </ul>
  </div>
</div>
```

- [ ] **Step 3: Create `RelatedPrograms.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import ProgramCard from './ProgramCard.astro';
interface Props { current: string; entries: CollectionEntry<'programs'>[]; }
const { current, entries } = Astro.props;
const related = entries.filter(e => e.slug !== current).slice(0, 3);
---
<div>
  <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Δείτε επίσης</p>
  <h2 class="mt-3 text-crimson font-display font-semibold text-2xl md:text-3xl">Σχετικά σεμινάρια</h2>
  <ul class="mt-8 grid gap-6 md:grid-cols-3">
    {related.map((e) => <li><ProgramCard entry={e} /></li>)}
  </ul>
</div>
```

- [ ] **Step 4: Create `BookProgramCTA.astro`**

```astro
---
import Button from '../ui/Button.astro';
import { phone } from '../../lib/nav';
interface Props { slug: string; titleEl: string; }
const { slug, titleEl } = Astro.props;
---
<aside class="bg-surface-cyan border border-cyan/20 rounded-3xl p-6 md:p-8">
  <h3 class="font-display font-bold text-crimson text-2xl">Έτοιμοι για συμμετοχή;</h3>
  <p class="mt-2 text-ink leading-relaxed">Κρατήστε τη θέση σας στο επόμενο σεμινάριο "{titleEl}" ή ζητήστε ιδιωτική εκπαίδευση.</p>
  <div class="mt-6 flex flex-col gap-3">
    <Button href={`/kratisi/?program=${slug}`} variant="primary">Κάντε κράτηση</Button>
    <a href={`tel:${phone.tel}`} class="text-cyan-700 font-semibold no-underline">ή τηλεφωνήστε στο {phone.display}</a>
  </div>
</aside>
```

- [ ] **Step 5: Create `[slug].astro`**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import Section from '../../components/layout/Section.astro';
import ProgramHero from '../../components/programs/ProgramHero.astro';
import CurriculumTable from '../../components/programs/CurriculumTable.astro';
import BookProgramCTA from '../../components/programs/BookProgramCTA.astro';
import RelatedPrograms from '../../components/programs/RelatedPrograms.astro';
import Reveal from '../../components/motion/Reveal.astro';

export async function getStaticPaths() {
  const programs = await getCollection('programs');
  return programs.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const all = await getCollection('programs');
const d = { ...entry.data, slug: entry.slug };
---
<PageLayout title={d.titleEl} description={d.summary}>
  <ProgramHero
    code={d.code}
    titleEl={d.titleEl}
    summary={d.summary}
    durationHours={d.durationHours}
    audience={d.audience}
    prerequisite={d.prerequisite}
    heroImage={d.heroImage}
    slug={d.slug}
  />

  <Section tone="default" pad="lg">
    <div class="grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8">
        <Reveal stagger={0.06}>
          <h2 class="text-2xl font-semibold text-ink-strong">Περιγραφή</h2>
          <p class="mt-3 text-ink leading-relaxed text-lg whitespace-pre-line">{d.description}</p>
          <div class="mt-4 prose prose-slate max-w-none"><Content /></div>

          <h2 class="mt-12 text-2xl font-semibold text-ink-strong">Τι θα μάθετε</h2>
          <div class="mt-6">
            <CurriculumTable theory={d.theory} skills={d.skills} />
          </div>

          <div class="mt-12 grid sm:grid-cols-3 gap-6 border-t border-hairline pt-8">
            <div>
              <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Διάρκεια</p>
              <p class="mt-1 font-display font-bold text-crimson text-2xl">{d.durationHours} <span class="text-base text-ink-muted font-normal">ώρες</span></p>
            </div>
            <div>
              <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Αξιολόγηση</p>
              <p class="mt-1 text-ink leading-snug">{d.evaluation}</p>
            </div>
            <div>
              <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Πιστοποίηση</p>
              <p class="mt-1 text-ink leading-snug">Πιστοποιητικό συμμετοχής First Aid Academy</p>
            </div>
          </div>
        </Reveal>
      </div>
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-28">
          <BookProgramCTA slug={d.slug} titleEl={d.titleEl} />
        </div>
      </div>
    </div>
  </Section>

  <Section tone="soft" pad="lg">
    <RelatedPrograms current={d.slug} entries={all} />
  </Section>
</PageLayout>
```

- [ ] **Step 6: Build to validate all 8 routes**

```bash
cd web && npm run build
```

Expected: 8 `/seminaria/<slug>/index.html` files emitted under `dist/`.

- [ ] **Step 7: Commit**

```bash
git add web/src/components/programs web/src/pages/seminaria/\[slug\].astro
git commit -m "feat(web): dynamic program detail page with curriculum + sticky booking CTA"
```

---

## Group 9 — For Businesses page

### Task 28: For Businesses page (`etairikoi.astro`)

**Files:**
- Create: `web/src/pages/etairikoi.astro`

- [ ] **Step 1: Create the page**

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';
import Button from '../components/ui/Button.astro';
import Reveal from '../components/motion/Reveal.astro';
import ProgramCard from '../components/programs/ProgramCard.astro';

const programs = await getCollection('programs');
const business = programs.filter(p => p.data.audience === 'business').sort((a,b) => a.data.order - b.data.order);
const clients = (await getCollection('clients')).sort((a,b) => a.data.name.localeCompare(b.data.name));
---
<PageLayout
  title="Για Επιχειρήσεις"
  description="Ενδοεπιχειρησιακά σεμινάρια Πρώτων Βοηθειών για ομάδες κάθε μεγέθους. Νομική συμμόρφωση, πρακτικά σενάρια, πραγματική ασφάλεια.">

  <Section tone="default" pad="lg">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7">
        <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Για επιχειρήσεις</p>
        <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Πρώτες Βοήθειες στον χώρο εργασίας</h1>
        <p class="mt-4 text-ink-muted text-lg leading-relaxed">
          Η εκπαίδευση πρώτου βοηθού είναι νομική απαίτηση και ταυτόχρονα ένα σημαντικό
          εργαλείο διατήρησης ασφαλούς εργασιακού περιβάλλοντος. Σχεδιάζουμε προγράμματα
          ευέλικτης διάρκειας, στον χώρο σας, με σενάρια προσαρμοσμένα στον κλάδο σας.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button href="/kratisi/" variant="primary">Ζητήστε προσφορά</Button>
          <Button href="/epikoinonia/" variant="secondary">Μιλήστε μαζί μας</Button>
        </div>
      </div>
      <div class="lg:col-span-5">
        <ul class="grid grid-cols-2 gap-4">
          <li class="bg-surface-soft p-6 rounded-2xl"><p class="font-display font-bold text-3xl text-crimson">21+</p><p class="text-sm text-ink-muted mt-1">εταιρείες πελάτες</p></li>
          <li class="bg-surface-soft p-6 rounded-2xl"><p class="font-display font-bold text-3xl text-crimson">100%</p><p class="text-sm text-ink-muted mt-1">on-site εκπαίδευση</p></li>
          <li class="bg-surface-soft p-6 rounded-2xl"><p class="font-display font-bold text-3xl text-crimson">6-18h</p><p class="text-sm text-ink-muted mt-1">ευέλικτη διάρκεια</p></li>
          <li class="bg-surface-soft p-6 rounded-2xl"><p class="font-display font-bold text-3xl text-crimson">RTI</p><p class="text-sm text-ink-muted mt-1">διεθνής πιστοποίηση</p></li>
        </ul>
      </div>
    </div>
  </Section>

  <Section tone="cyan" pad="lg">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Τα προγράμματά μας</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Διαλέξτε το επίπεδο που ταιριάζει στην ομάδα σας</h2>
    </div>
    <Reveal stagger={0.1}>
      <ul class="mt-10 grid gap-6 md:grid-cols-2">
        {business.map((p) => <li><ProgramCard entry={p} /></li>)}
      </ul>
    </Reveal>
  </Section>

  <Section tone="default" pad="lg">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Πώς δουλεύουμε</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Από το πρώτο τηλέφωνο μέχρι την πιστοποίηση</h2>
    </div>
    <Reveal stagger={0.08}>
      <ol class="mt-12 grid gap-6 md:grid-cols-4">
        {[
          { n: '01', t: 'Επικοινωνία',    d: 'Καταγραφή των αναγκών της επιχείρησης, του αριθμού συμμετεχόντων και του κλάδου.' },
          { n: '02', t: 'Σχεδιασμός',     d: 'Πρόταση προγράμματος (FAW ή EFAW) με προσαρμοσμένα σενάρια.' },
          { n: '03', t: 'Εκπαίδευση',     d: 'Διεξαγωγή στον χώρο σας με όλο τον απαραίτητο εξοπλισμό.' },
          { n: '04', t: 'Πιστοποίηση',    d: 'Αξιολόγηση και έκδοση πιστοποιητικών συμμετοχής.' },
        ].map((s) => (
          <li class="border-t-2 border-crimson pt-4">
            <p class="font-display font-bold text-crimson/40 text-3xl">{s.n}</p>
            <p class="mt-2 font-semibold text-ink-strong text-lg">{s.t}</p>
            <p class="mt-2 text-ink-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  </Section>

  <Section tone="soft" pad="md">
    <div class="text-center max-w-2xl mx-auto">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Μας εμπιστεύονται</p>
      <h2 class="mt-3 text-crimson font-display font-semibold text-2xl md:text-3xl">Πελάτες που έχουν εκπαιδεύσει τις ομάδες τους μαζί μας</h2>
    </div>
    <ul class="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 items-center">
      {clients.map((c) => (
        <li class="flex justify-center" title={c.data.name}>
          <Image src={c.data.logo} alt={c.data.name} widths={[120, 200]} sizes="120px" class="max-h-14 w-auto object-contain" />
        </li>
      ))}
    </ul>
  </Section>

  <Section tone="crimson" pad="md">
    <div class="text-center">
      <h2 class="font-display font-bold uppercase text-white text-3xl md:text-4xl">Έτοιμοι να ξεκινήσουμε;</h2>
      <p class="mt-4 text-white/90 text-lg max-w-2xl mx-auto">Στείλτε μας τις ανάγκες σας — θα σας απαντήσουμε με πρόταση εντός 24 ωρών.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/kratisi/?type=business" variant="primary" className="bg-white !text-crimson hover:bg-white/90">Ζητήστε προσφορά</Button>
        <Button href="/epikoinonia/" variant="secondary" className="bg-white/10 border-white/40 text-white hover:bg-white/20 ring-0">Επικοινωνία</Button>
      </div>
    </div>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Verify dev** at all viewports.

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/etairikoi.astro
git commit -m "feat(web): /etairikoi for-businesses page (process, programs, clients, CTA)"
```

---


## Group 10 — Booking page

### Task 29: Booking page (`kratisi.astro`) with Netlify form

**Why Netlify Forms:** zero-backend, free for low volume, built-in spam prevention. The form posts back to the same URL with a `_subject` query and a redirect to `/kratisi/success/` on success.

**Files:**
- Create: `web/src/pages/kratisi.astro`
- Create: `web/src/pages/kratisi/success.astro`
- Modify: `web/public/_redirects` (Netlify)

- [ ] **Step 1: Create `web/src/pages/kratisi.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';
import Button from '../components/ui/Button.astro';
import { phone } from '../lib/nav';

const programs = (await getCollection('programs')).sort((a, b) => a.data.order - b.data.order);
const url = new URL(Astro.request.url);
const preselected = url.searchParams.get('program') ?? '';
const isBusiness = url.searchParams.get('type') === 'business';
---
<PageLayout
  title="Κράτηση Σεμιναρίου"
  description="Κρατήστε τη θέση σας στο επόμενο σεμινάριο της First Aid Academy. Συμπληρώστε τη φόρμα και θα σας απαντήσουμε εντός 24 ωρών.">

  <Section tone="default" pad="lg">
    <div class="grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-7">
        <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Κράτηση</p>
        <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Κάντε κράτηση για το επόμενο σεμινάριο</h1>
        <p class="mt-4 text-ink-muted text-lg leading-relaxed">
          Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για
          να επιβεβαιώσουμε ημερομηνία, τοποθεσία και κόστος. Δεν θα χρεωθείτε τίποτα
          μέχρι την επιβεβαίωση.
        </p>

        <form
          name="booking"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/kratisi/success/"
          class="mt-10 space-y-6"
        >
          <input type="hidden" name="form-name" value="booking" />
          <p class="hidden"><label>Μην συμπληρώνετε αυτό: <input name="bot-field" /></label></p>

          <fieldset class="space-y-4">
            <legend class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Τύπος κράτησης</legend>
            <div class="grid sm:grid-cols-2 gap-3">
              <label class="flex items-start gap-3 border border-hairline rounded-xl p-4 has-[:checked]:border-crimson has-[:checked]:bg-surface-crimson cursor-pointer transition-out">
                <input type="radio" name="type" value="individual" checked={!isBusiness} class="mt-1 accent-crimson"/>
                <span><strong class="block text-ink-strong">Ιδιώτης / Γονέας</strong><span class="text-sm text-ink-muted">Ατομική συμμετοχή σε ομαδικό σεμινάριο.</span></span>
              </label>
              <label class="flex items-start gap-3 border border-hairline rounded-xl p-4 has-[:checked]:border-crimson has-[:checked]:bg-surface-crimson cursor-pointer transition-out">
                <input type="radio" name="type" value="business" checked={isBusiness} class="mt-1 accent-crimson"/>
                <span><strong class="block text-ink-strong">Επιχείρηση</strong><span class="text-sm text-ink-muted">Ενδοεπιχειρησιακή εκπαίδευση.</span></span>
              </label>
            </div>
          </fieldset>

          <div>
            <label for="program" class="block text-sm font-semibold text-ink-edge">Σεμινάριο</label>
            <select id="program" name="program" required class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20">
              <option value="">— Επιλέξτε σεμινάριο —</option>
              {programs.map(p => (
                <option value={p.slug} selected={p.slug === preselected}>
                  {p.data.titleEl} ({p.data.code} · {p.data.durationHours} ώρες)
                </option>
              ))}
              <option value="not-sure">Δεν είμαι σίγουρος/η — θέλω συμβουλή</option>
            </select>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-semibold text-ink-edge">Ονοματεπώνυμο *</label>
              <input id="name" name="name" type="text" required autocomplete="name" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
            <div>
              <label for="email" class="block text-sm font-semibold text-ink-edge">Email *</label>
              <input id="email" name="email" type="email" required autocomplete="email" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="phone" class="block text-sm font-semibold text-ink-edge">Τηλέφωνο *</label>
              <input id="phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
            <div>
              <label for="company" class="block text-sm font-semibold text-ink-edge">Επιχείρηση (αν αφορά)</label>
              <input id="company" name="company" type="text" autocomplete="organization" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="participants" class="block text-sm font-semibold text-ink-edge">Αριθμός συμμετεχόντων</label>
              <input id="participants" name="participants" type="number" min="1" max="200" placeholder="1" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
            <div>
              <label for="preferred-date" class="block text-sm font-semibold text-ink-edge">Προτιμώμενη ημερομηνία</label>
              <input id="preferred-date" name="preferred_date" type="date" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
          </div>

          <div>
            <label for="message" class="block text-sm font-semibold text-ink-edge">Σχόλια / ερωτήσεις</label>
            <textarea id="message" name="message" rows="4" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"></textarea>
          </div>

          <label class="flex items-start gap-3 text-sm text-ink-muted">
            <input type="checkbox" name="consent" required class="mt-1 accent-crimson"/>
            <span>Συμφωνώ με τους όρους και την επεξεργασία των στοιχείων μου για την εξυπηρέτηση της κράτησης. *</span>
          </label>

          <div class="pt-2">
            <Button type="submit" variant="primary" size="lg">Στείλτε αίτημα κράτησης</Button>
          </div>
        </form>
      </div>

      <aside class="lg:col-span-5">
        <div class="lg:sticky lg:top-28 bg-surface-cyan border border-cyan/20 rounded-3xl p-6 md:p-8">
          <h2 class="font-display font-bold text-crimson text-2xl">Τι ακολουθεί;</h2>
          <ol class="mt-6 space-y-5 text-ink leading-relaxed">
            <li class="flex gap-3"><span class="font-display font-bold text-crimson">1.</span><span>Λαμβάνουμε το αίτημά σας και επικοινωνούμε εντός 24 ωρών.</span></li>
            <li class="flex gap-3"><span class="font-display font-bold text-crimson">2.</span><span>Συμφωνούμε ημερομηνία, τοποθεσία και κόστος.</span></li>
            <li class="flex gap-3"><span class="font-display font-bold text-crimson">3.</span><span>Λαμβάνετε επιβεβαίωση και οδηγίες προετοιμασίας.</span></li>
            <li class="flex gap-3"><span class="font-display font-bold text-crimson">4.</span><span>Παρακολουθείτε το σεμινάριο — πιστοποιητικό συμμετοχής στο τέλος.</span></li>
          </ol>
          <hr class="my-6 border-cyan/30" />
          <p class="text-ink leading-relaxed">Προτιμάτε προσωπική επικοινωνία;</p>
          <a href={`tel:${phone.tel}`} class="mt-2 block text-crimson font-display font-bold text-2xl no-underline hover:underline">{phone.display}</a>
          <a href={`mailto:${phone.email}`} class="mt-2 block text-cyan-700 font-semibold no-underline hover:underline">{phone.email}</a>
        </div>
      </aside>
    </div>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Create `web/src/pages/kratisi/success.astro`**

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import Section from '../../components/layout/Section.astro';
import Button from '../../components/ui/Button.astro';
import { phone } from '../../lib/nav';
---
<PageLayout title="Λάβαμε το αίτημά σας" description="Ευχαριστούμε για το αίτημα κράτησης. Θα επικοινωνήσουμε σύντομα." noindex>
  <Section tone="default" pad="lg">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mx-auto h-16 w-16 rounded-full bg-surface-crimson flex items-center justify-center text-crimson">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 class="mt-6 font-display font-bold text-crimson text-3xl md:text-4xl">Ευχαριστούμε — λάβαμε το αίτημά σας</h1>
      <p class="mt-4 text-ink-muted text-lg leading-relaxed">
        Θα επικοινωνήσουμε μαζί σας εντός 24 ωρών για να επιβεβαιώσουμε τις λεπτομέρειες
        της κράτησής σας. Αν χρειάζεστε άμεση απάντηση, καλέστε μας απευθείας.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">Επιστροφή στην αρχική</Button>
        <Button href={`tel:${phone.tel}`} variant="secondary">Καλέστε μας</Button>
      </div>
    </div>
  </Section>
</PageLayout>
```

- [ ] **Step 3: (optional) Add `web/public/_redirects` for clean Netlify form handling**

```
# web/public/_redirects
# Netlify Forms ships a generated bot at /__forms.html in production builds.
# Custom 404
/*    /404.html   404
```

- [ ] **Step 4: Verify build emits the form-detection HTML**

```bash
cd web && npm run build
grep -r 'name="booking"' dist | head
```

Expected: at least one match in `dist/kratisi/index.html`. (Netlify scans built HTML at deploy for forms.)

- [ ] **Step 5: Commit**

```bash
git add web/src/pages/kratisi.astro web/src/pages/kratisi/success.astro web/public/_redirects
git commit -m "feat(web): booking page + Netlify form + thank-you page"
```

---

## Group 11 — Contact page

### Task 30: Contact page (`epikoinonia.astro`)

**Files:**
- Create: `web/src/pages/epikoinonia.astro`

- [ ] **Step 1: Create the page**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';
import Button from '../components/ui/Button.astro';
import { phone } from '../lib/nav';
---
<PageLayout
  title="Επικοινωνία"
  description="Επικοινωνήστε μαζί μας για ερωτήσεις, ιδιαίτερες ανάγκες ή προσφορά για επιχειρήσεις. Απαντάμε εντός 24 ωρών.">

  <Section tone="default" pad="lg">
    <div class="grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5">
        <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Επικοινωνία</p>
        <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Είμαστε εδώ για κάθε ερώτηση</h1>
        <p class="mt-4 text-ink-muted text-lg leading-relaxed">
          Είτε θέλετε να κρατήσετε σεμινάριο, είτε χρειάζεστε εκπαίδευση για την ομάδα σας,
          είτε απλά έχετε μια απορία — γράψτε μας ή τηλεφωνήστε μας.
        </p>

        <ul class="mt-10 space-y-6">
          <li>
            <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Τηλέφωνο</p>
            <a href={`tel:${phone.tel}`} class="mt-1 block font-display font-bold text-crimson text-3xl no-underline hover:underline">{phone.display}</a>
          </li>
          <li>
            <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Email</p>
            <a href={`mailto:${phone.email}`} class="mt-1 block text-cyan-700 font-semibold text-lg no-underline hover:underline">{phone.email}</a>
          </li>
          <li>
            <p class="text-sm uppercase tracking-wider text-cyan-700 font-semibold">Περιοχή δραστηριοποίησης</p>
            <p class="mt-1 text-ink">Σεμινάρια σε όλη την Ελλάδα · Ενδοεπιχειρησιακά κατόπιν συνεννόησης</p>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-7">
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/epikoinonia/?sent=1"
          class="bg-surface-soft rounded-3xl p-6 md:p-8 space-y-5"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p class="hidden"><label>Μην συμπληρώνετε: <input name="bot-field" /></label></p>

          <h2 class="font-display font-bold text-crimson text-2xl">Στείλτε μας μήνυμα</h2>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="c-name" class="block text-sm font-semibold text-ink-edge">Ονοματεπώνυμο *</label>
              <input id="c-name" name="name" type="text" required class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
            <div>
              <label for="c-email" class="block text-sm font-semibold text-ink-edge">Email *</label>
              <input id="c-email" name="email" type="email" required class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
            </div>
          </div>

          <div>
            <label for="c-subject" class="block text-sm font-semibold text-ink-edge">Θέμα</label>
            <input id="c-subject" name="subject" type="text" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
          </div>

          <div>
            <label for="c-message" class="block text-sm font-semibold text-ink-edge">Μήνυμα *</label>
            <textarea id="c-message" name="message" rows="6" required class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"></textarea>
          </div>

          <Button type="submit" variant="primary" size="lg">Αποστολή μηνύματος</Button>
        </form>

        {Astro.url.searchParams.get('sent') === '1' && (
          <p class="mt-6 bg-surface-cyan text-cyan-700 border border-cyan/30 rounded-xl px-4 py-3 font-semibold">
            Το μήνυμά σας στάλθηκε. Θα απαντήσουμε εντός 24 ωρών.
          </p>
        )}
      </div>
    </div>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Verify dev**

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/epikoinonia.astro
git commit -m "feat(web): contact page with Netlify form + direct contact details"
```

---

## Group 12 — 404, SEO, sitemap, structured data

### Task 31: 404 page

**Files:**
- Create: `web/src/pages/404.astro`

- [ ] **Step 1: Create the page**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';
import Button from '../components/ui/Button.astro';
---
<PageLayout title="Η σελίδα δεν βρέθηκε" description="Δυστυχώς η σελίδα που ψάχνετε δεν υπάρχει. Επιστρέψτε στην αρχική ή εξερευνήστε τα σεμινάριά μας." noindex>
  <Section tone="default" pad="lg">
    <div class="max-w-xl mx-auto text-center">
      <p class="font-display font-bold text-crimson text-7xl">404</p>
      <h1 class="mt-4 text-3xl md:text-4xl font-display font-semibold text-ink-strong">Η σελίδα δεν βρέθηκε</h1>
      <p class="mt-4 text-ink-muted text-lg">Δοκιμάστε ξανά από την αρχική ή δείτε τη λίστα σεμιναρίων.</p>
      <div class="mt-8 flex justify-center gap-3">
        <Button href="/" variant="primary">Αρχική</Button>
        <Button href="/seminaria/" variant="secondary">Σεμινάρια</Button>
      </div>
    </div>
  </Section>
</PageLayout>
```

- [ ] **Step 2: Commit**

```bash
git add web/src/pages/404.astro
git commit -m "feat(web): styled 404 page"
```

---

### Task 32: SEO — JSON-LD structured data + robots + sitemap

**Files:**
- Create: `web/src/components/seo/StructuredData.astro`
- Create: `web/public/robots.txt`
- Modify: `web/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `web/public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://firstaidacademy.gr/sitemap-index.xml
```

- [ ] **Step 2: Create `web/src/components/seo/StructuredData.astro`**

```astro
---
interface Props { type: 'home' | 'program' | 'about' | 'organization'; data?: any; }
const { type, data = {} } = Astro.props;

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'First Aid Academy',
  url: 'https://firstaidacademy.gr',
  logo: 'https://firstaidacademy.gr/logo.svg',
  founder: {
    '@type': 'Person',
    name: 'Σπύρος Τζιρτζιλάκης',
    jobTitle: 'Πιστοποιημένος Εκπαιδευτής Πρώτων Βοηθειών',
  },
  sameAs: [],
};

const courseLd = data.titleEl ? {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: data.titleEl,
  description: data.summary,
  provider: { '@type': 'EducationalOrganization', name: 'First Aid Academy', url: 'https://firstaidacademy.gr' },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'in-person',
    courseWorkload: `PT${(data.durationHours || '0').toString().split(/[^\d]/)[0]}H`,
  },
} : null;

const ld = type === 'program' ? courseLd : orgLd;
---
{ld && <script type="application/ld+json" set:html={JSON.stringify(ld)} />}
```

- [ ] **Step 3: Wire `StructuredData` into BaseLayout**

In `web/src/layouts/BaseLayout.astro`, add an import and a slot just before `</head>`:

Add at top of frontmatter:
```ts
import StructuredData from '../components/seo/StructuredData.astro';
```

Add `structuredData?: { type: 'home' | 'program' | 'about' | 'organization'; data?: any }` to the `Props` interface and destructure with `structuredData = { type: 'organization' }`.

Just before `</head>`, add:
```astro
<StructuredData type={structuredData.type} data={structuredData.data} />
```

Pass `structuredData={{ type: 'program', data: d }}` from `[slug].astro` (BaseLayout is reached via PageLayout → forward the prop through PageLayout).

- [ ] **Step 4: Forward prop through PageLayout**

In `PageLayout.astro`, add `structuredData` to its `Props` interface and pass to `<BaseLayout>`.

- [ ] **Step 5: Pass it from program detail**

In `web/src/pages/seminaria/[slug].astro`, change:

```astro
<PageLayout title={d.titleEl} description={d.summary}>
```

to:

```astro
<PageLayout title={d.titleEl} description={d.summary} structuredData={{ type: 'program', data: d }}>
```

- [ ] **Step 6: Build and verify the sitemap is emitted**

```bash
cd web && npm run build
ls dist | grep -E '(sitemap|robots)'
```

Expected: `sitemap-index.xml`, `sitemap-0.xml`, `robots.txt` present in `dist/`.

- [ ] **Step 7: Commit**

```bash
git add web/public/robots.txt web/src/components/seo web/src/layouts web/src/pages/seminaria/\[slug\].astro
git commit -m "feat(web): JSON-LD structured data, robots.txt, sitemap"
```

---


## Group 13 — Motion polish

### Task 33: Apply Reveal across pages, add hero pulse-line accent

**Goal:** Audit each page and ensure content sections that are not yet wrapped in `<Reveal>` get one. Add a single "pulse-line" SVG accent under the homepage hero headline.

**Files:**
- Modify: `web/src/components/home/Hero.astro` (add ECG SVG + draw animation)
- Modify: `web/src/pages/index.astro` and others (verify Reveal wrappers)

- [ ] **Step 1: Add ECG pulse SVG to Hero**

In `web/src/components/home/Hero.astro`, just before the `<HeroSplit>` headline, insert:

```astro
<svg class="pulse-line block w-32 md:w-40 h-6 mt-4" viewBox="0 0 200 24" fill="none" stroke="#D7263D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M0 12 H40 L50 4 L60 20 L72 8 L84 16 L96 12 H200" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" />
</svg>
```

At the end of `Hero.astro`, add a `<script>` block:

```astro
<script>
  import { gsap, prefersReducedMotion } from '../../lib/motion';
  const path = document.querySelector<SVGPathElement>('.pulse-line path');
  if (path && !prefersReducedMotion()) {
    gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.2 });
  } else if (path) {
    path.setAttribute('stroke-dashoffset', '0');
  }
</script>
```

- [ ] **Step 2: Audit Reveal coverage**

Open each page in the dev server and confirm that section-level content fades in on scroll. Pages already wrapped: home (all sections), about (sxetika), programs index, program detail, etairikoi. Add `<Reveal>` wrappers around any section content that animates abruptly.

- [ ] **Step 3: Manually toggle Reduce Motion (System Settings > Accessibility) and reload all pages — content must appear instantly with no animation. Ship-blocker if it doesn't.**

- [ ] **Step 4: Commit**

```bash
git add web/src/components/home/Hero.astro
git commit -m "feat(web): hero pulse-line ECG accent (GSAP draw)"
```

---

## Group 14 — Accessibility & responsive QA

### Task 34: A11y + responsive sweep

**No code changes expected unless issues are found.** This is a verification pass.

- [ ] **Step 1: Run Lighthouse on the production build**

```bash
cd web && npm run build && npm run preview -- --port 4321
# In a second terminal:
npx -y lighthouse http://localhost:4321/ --view --preset=desktop
npx -y lighthouse http://localhost:4321/ --view --preset=mobile
```

Targets:
- Performance ≥ 90 (mobile)
- Accessibility = 100
- Best Practices ≥ 95
- SEO ≥ 95

If accessibility is < 100, fix the flagged issues before proceeding.

- [ ] **Step 2: Keyboard-only audit**

Visit each top-level page. Tab through every interactive element. Verify:
- Skip link appears on first Tab
- Focus rings visible on every interactive element (3px crimson per global.css)
- Mobile menu opens/closes with Enter/Space and ESC
- Form fields announce labels
- No tab traps

- [ ] **Step 3: Screen reader smoke test**

VoiceOver (macOS): `Cmd+F5` to enable. Navigate the home page with VO+→. Verify:
- Logo links read "First Aid Academy — Αρχική"
- H1 announces correctly in Greek
- Buttons announce as buttons with their labels
- Form fields announce label + required state

- [ ] **Step 4: Color contrast spot-check**

Use the Lighthouse contrast results. The known borderline case (Pulse Crimson on white body text) is already mitigated in DESIGN.md — body text uses Charcoal Ink. Spot-check any custom-colored copy.

- [ ] **Step 5: Responsive sweep**

For each page, test at 320px / 375px / 768px / 1024px / 1440px. Look for:
- Text overflow / truncation
- Touch targets ≥ 44px
- Hero headline doesn't break awkwardly
- Tables/lists wrap correctly

- [ ] **Step 6: Greek font subset confirmation**

```bash
grep -r 'subset' web/node_modules/@fontsource-variable/poppins/files | head -3
```

Confirm `greek` files are present. In DevTools → Network, reload the home page and verify `.woff2` files for Greek subset are requested.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "chore(web): accessibility + responsive fixes from QA pass"
```

(If no fixes were needed, skip this commit.)

---

## Group 15 — Build & deploy prep

### Task 35: Final build, deploy config, launch checklist

**Files:**
- Create: `web/netlify.toml`
- Create: `LAUNCH_CHECKLIST.md` (root)

- [ ] **Step 1: Create `web/netlify.toml`**

```toml
[build]
  base = "web/"
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy        = "strict-origin-when-cross-origin"
    X-Frame-Options        = "SAMEORIGIN"
    Permissions-Policy     = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

- [ ] **Step 2: Create `LAUNCH_CHECKLIST.md`** (root of repo)

```markdown
# First Aid Academy — Launch Checklist

## Content (client-supplied — required before public launch)
- [ ] Replace `web/src/lib/nav.ts` `phone.display` and `phone.tel` with the real number
- [ ] Replace `phone.email` with the real address
- [ ] Replace `web/src/assets/brand/founder.png` with a real portrait of Σπύρος Τζιρτζιλάκης
- [ ] Replace `web/public/og-default.jpg` with a designed 1200×630 OG card
- [ ] Confirm 21 client logos use the actual brand assets (not the WordPress thumbnails) where possible
- [ ] Replace certificate placeholders (`cofat-instructor.jpg`, `community-first-aid-patras.jpg`) with proper PDF page exports
- [ ] Confirm the FAW MDX content matches the client's actual training scope (raw `.odt` for FAW was unreadable — the plan uses synthesized RTI-aligned content)
- [ ] Final pricing strategy: decide whether to display prices on program detail pages or keep "request quote" only

## Technical
- [ ] DNS → Netlify
- [ ] HTTPS certificate active
- [ ] Netlify Forms enabled in site settings; "booking" + "contact" forms appear in dashboard
- [ ] Test booking form end-to-end (submit + confirm email arrives)
- [ ] Test contact form end-to-end
- [ ] Submit sitemap to Google Search Console: https://firstaidacademy.gr/sitemap-index.xml
- [ ] Set up Google Analytics 4 / Plausible (decide which)
- [ ] Add fb:app_id and twitter:site to BaseLayout if social profiles exist

## Compliance
- [ ] Add Privacy Policy page (`/aporrhto/`) — required for form submission
- [ ] Add Terms of Service page (`/oroi/`) — best practice for paid bookings
- [ ] Add cookie banner if analytics is added
- [ ] Confirm GDPR consent text on booking + contact forms

## Performance budget
- [ ] LCP < 2.0s on mobile (target)
- [ ] CLS < 0.05
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Total homepage weight < 1MB
```

- [ ] **Step 3: Run final production build**

```bash
cd web && rm -rf dist .astro && npm run build
```

Expected: build completes without errors. Note the bundle size and the static page count (should be ~14: home, sxetika, etairikoi, kratisi, kratisi/success, epikoinonia, seminaria index, 8 program pages, 404).

- [ ] **Step 4: Local preview smoke test**

```bash
cd web && npm run preview -- --port 4321
```

Visit each page. Resubmit the booking form (will 404 the action locally — that's fine; real submission only works after Netlify deploy).

- [ ] **Step 5: Commit**

```bash
git add web/netlify.toml LAUNCH_CHECKLIST.md
git commit -m "chore: netlify config + launch checklist"
```

- [ ] **Step 6: Done — hand off to deploy**

```bash
git log --oneline | head -40
```

Expected: a clean linear history of ~30+ commits, one per task. The repo is ready to push to a remote and connect to Netlify via the dashboard.

---

# Self-Review

This review walks the spec → plan coverage, scans for placeholders, and checks type/name consistency.

## Spec coverage

| User requirement | Covered by |
|---|---|
| Sell + book first-aid seminars | Tasks 23 (BookingCTA), 27 (program detail with `?program=` deep link), 29 (full booking page + Netlify form), 30 (contact form) |
| Use the supplied images (logo, photos) | Tasks 12 (logo), 13 (program photos, client logos, certificates) |
| Astro + Tailwind + GSAP | Task 1 (init), 3 (Tailwind), 4 (GSAP w/ reduced-motion guard) |
| Read everything in root first | Plan opens with full inventory of `/company/`, `/first aid academy logos/`, `/προγραμματα κομπλε/`, `/πτυχια/`, founder bio (`about me της σελιδας.odt`) |
| Build per DESIGN.md | Task 2 amends DESIGN.md to brand colors (red+cyan); all subsequent tasks reference its tokens (Pulse Crimson, Clinical Cyan, section rhythm, motion vocabulary) |
| All pages, all sections planned before building | This document plans 14 distinct pages and lists every section per page before any code is written |
| Be precise and analytic | Every step has exact file paths and copy-paste-ready code; commit messages are written |

## Pages planned (14)

1. `/` — home (8 sections)
2. `/seminaria/` — programs index (2 categories)
3. `/seminaria/cofat/` — program detail
4. `/seminaria/bls/`
5. `/seminaria/cpr-aed/`
6. `/seminaria/fa/`
7. `/seminaria/pfa/`
8. `/seminaria/epfa/`
9. `/seminaria/faw/`
10. `/seminaria/efaw/`
11. `/etairikoi/` — for businesses (5 sections)
12. `/sxetika/` — about (founder bio + credentials)
13. `/kratisi/` — booking
14. `/kratisi/success/` — thank you
15. `/epikoinonia/` — contact
16. `/404`

## Placeholder scan

The plan was written without `TBD`, `TODO`, `implement later`, `fill in details`, or `similar to Task N`. All component code is complete. **Two acknowledged image placeholders are flagged in the launch checklist** and represent real client deliverables: the founder portrait and the OG card.

## Type / name consistency

- Every program slug used in `[slug].astro` route generation matches a slug in the 8 MDX files: `cofat`, `bls`, `cpr-aed`, `fa`, `pfa`, `epfa`, `faw`, `efaw`.
- The `Program` schema fields (`slug`, `code`, `titleEl`, `summary`, `durationHours`, `audience`, `evaluation`, `theory`, `skills`, `heroImage`, `prerequisite`) are referenced consistently in `ProgramCard`, `ProgramHero`, `CurriculumTable`, and `[slug].astro`.
- Component import paths use the layout `web/src/components/<area>/<File>.astro`. Every import in the plan tasks resolves.
- Tailwind tokens (`crimson`, `cyan`, `ink`, `surface`, `hairline`) are defined in Task 3's `tailwind.config.mjs` and used everywhere downstream.

## Known caveats (deliberate, not omissions)

1. **FAW MDX content** is synthesized to align with RTI's standard 18-hour curriculum because the original `.odt` source was corrupted/unreadable. Flagged in launch checklist.
2. **Founder portrait** uses the brand logo as a placeholder until the client supplies a real photo. Flagged.
3. **Phone number and email** are placeholders in `lib/nav.ts`. Flagged at the top of the launch checklist.
4. **Pricing** is intentionally not displayed; the booking flow is "request → confirm". This matches the existing market norm (Maltezos inspiration site, RTI partners) and avoids friction for ad-hoc business pricing.

---

# Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-30-first-aid-academy.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach would you like?
