# Design System: Maltezos Nurse for You
**Source:** https://www.maltezosnfu.com/
**Locale:** Greek (el) — Cyprus market
**Sector:** Home nursing & medical equipment rental
**Target stack:** Astro + Tailwind CSS + GSAP

---

## 1. Visual Theme & Atmosphere

A **calm, clinically-confident, professionally-warm** identity. The aesthetic is *understated medical hospitality* — the page should feel like the waiting area of a private clinic, not a tech startup: airy whitespace, generous use of pale cyan-tinted sections, full-bleed imagery of training in real settings, and a confident two-color accent system (crimson + cyan) carrying every interaction.

Density is **measured and unhurried** — paragraphs breathe, sections separate cleanly with soft cyan or crimson washes, and there are no busy decorative flourishes. The mood adjectives that should guide every decision: **trustworthy, reassuring, dignified, accessible, human, life-affirming**.

When porting to Astro + Tailwind + GSAP, the goal is to preserve this calm professionalism while modernizing the typography rhythm, sharpening the spacing, and introducing motion that *whispers* rather than performs (the original site is mostly static — a tasteful restraint we should honor).

---

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

---

## 3. Typography Rules

The system uses a **three-typeface stack**, each with a distinct job — never overlap their roles.

### Font roles

- **Poppins** (weights 400, 500, 700) — the **Display Voice**. Used exclusively for hero headlines and full-bleed image overlays. Rendered uppercase, tight-tracked, in 700 weight at large sizes (~36–48px). Conveys *authority and clarity at distance*.
- **Open Sans** (weights 400, 600, 700) — the **Body & UI Voice**. Default for paragraphs, navigation, buttons, list items, captions. Calm, neutral, screen-readable.
- **Lato** (weights 400, 700) — the **Callout Voice**. A single inflection used for emotive pull-quotes and contact-info callouts (e.g., "Call us at +357 22 311 100"). Slightly warmer geometry than Open Sans gives these moments a human signature.

### Type scale (synthesized, lightly modernized)

| Role | Family | Weight | Size | Line | Case | Color |
|---|---|---|---|---|---|---|
| **Hero headline** (H1, image overlays) | Poppins | 700 | 38–48px | 48–56px | UPPERCASE | `#FFFFFF` over scrim |
| **Section title** (H2) | Open Sans | 400 | 22–36px | 1.4 | Title Case | `#D7263D` (Pulse Crimson) |
| **Subsection** (H3) | Open Sans | 600 | 18–22px | 1.4 | Title Case | `#0F1A24` (Footer Obsidian, used as ink-strong) |
| **Body** | Open Sans | 400 | 14–16px | 1.6 | Sentence | `#1F2933` (Charcoal Ink) |
| **Callout / phone block** | Lato | 400 | 17px | 1.6 | Mixed | `#6B7785` (Slate Mute) |
| **Nav link / button label** | Open Sans | 600 | 13–14px | 1.2 | UPPERCASE for utility, sentence for primary | `#3B4754` (Graphite Edge) / white |
| **Caption / meta** | Open Sans | 400 | 12–13px | 1.4 | Sentence | `#6B7785` |

### Letter-spacing & tracking

- All text uses **normal letter-spacing** as observed on the source. Do not introduce arbitrary tracking — restraint is part of the calm.
- **One exception:** Poppins display headlines may take a *very subtle* `+0.5%` (`tracking-[0.005em]`) to compensate for uppercase rendering at large sizes. Don't go further.

### Hierarchy principle

Color, not size, carries hierarchy. **Pulse Crimson H2s** are the strongest signal on any non-hero section — keep them at 22–28px and let the crimson do the heavy lifting. Resist the impulse to scale headings up to grab attention.

---

## 4. Component Stylings

### Buttons

- **Primary (CTA)** — *the "Make an Application" button*
  - Surface: `#D7263D` solid fill
  - Text: `#FFFFFF`, Open Sans 400, 14px, sentence case
  - Shape: **subtly rounded corners** (`border-radius: 5px` / `rounded-md`)
  - Padding: `14px 20px` (`py-3.5 px-5`)
  - Border: 1px transparent (reserved for hover state)
  - Shadow: **flat, none** by default
  - Hover state (recommended addition, source has none): crimson-600 `#A81B30` + a `whisper-soft` shadow `0 4px 12px rgba(215,38,61,0.22)`, 200ms ease
- **Utility / Secondary (skip-links, cookie accept)**
  - Surface: `#F3F3F3` (Linen Hush) or `#333333` (cookie accept)
  - Text: 13px Open Sans 600 UPPERCASE, `#3E3E3E` or white
  - Shape: **sharp, squared-off edges** (`border-radius: 0`) — intentionally workmanlike
  - Padding: `5px 20px` (`py-1 px-5`)
- **Tertiary / Ghost** (proposed for the new build, absent on source)
  - Surface: transparent, 1px hairline `#1FB6E0`
  - Text: `#0E7DA1`, same rounded-md shape

### Cards / Containers

The original is mostly **flat full-width sections** — there's no real "card" pattern with elevation. For the rebuild we should preserve that flat philosophy:

- **Section blocks**: alternating `#FFFFFF` and `#F6FDFD` (Frosted Mint) backgrounds; vertical padding 25–80px depending on density; **no shadow, no border, no radius** — sections are delineated by color shift alone.
- **Service tiles** (proposed): generously rounded corners (`rounded-2xl`, ~16px), white surface on Frosted Mint section, hairline `#E9E9E9` border, **whisper-soft diffused shadow** `0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)`. Hover: shadow deepens to `0 12px 32px rgba(0,125,126,0.12)`, 250ms ease.
- **Image-overlay hero block**: full-width image with a **dark scrim** (`rgba(0,0,0,0.4)` linear-gradient or solid), Poppins white headline aligned left or centered, brand-teal CTA below. Sharp edges (no radius) to feel filmic.

### Inputs / Forms

- **Stroke style**: bottom-only or full hairline `#E9E9E9` (1px). The source uses essentially un-styled inputs — for the rebuild, choose a consistent **understated bordered** style:
  - Surface: `#FFFFFF`
  - Border: 1px `#E9E9E9` all sides, `rounded-md` (5px)
  - Padding: `12px 16px`
  - Focus: border `#007D7E`, 3px focus ring `rgba(0,125,126,0.2)`
  - Placeholder: `#767676`, Open Sans 400
- **Search input** in nav: minimal — no border, just an icon and a 14px text field; preserve the source's lightweight feel.

### Navigation

- **Top header**: tall, generous (~137px on desktop on source — feel free to tighten to ~88–96px). White surface, sticky behavior with a soft `0 1px 2px rgba(0,0,0,0.04)` shadow appearing only on scroll.
- **Nav links**: Open Sans 600, 14px, UPPERCASE for primary nav OR Title Case in `#333333` (the source uses Title Case). Hover/active: color shifts to `#007D7E`. No underline.
- **Phone/contact strip** above nav: Lato or Open Sans 13–14px, `#767676`, with phone number in `#333333`.
- **Mobile**: off-canvas drawer, white surface, full-height. Animate in via GSAP from the right.

### Footer

- Surface: `#242424` (Footer Obsidian) — *the only place* dark surface is used.
- Text: `#FFFFFF` for headings, `rgba(255,255,255,0.8)` for body, `rgba(255,255,255,0.6)` for legal/copyright.
- Generous padding `64px 0` desktop, `48px 0` mobile.
- Brand teal used sparingly — only for hover states on links and divider accents.

### Imagery

- Photographic, **never illustrated**. Real caregivers, real patients, soft natural light, hospital-clean settings. Avoid stock-photo cliché (no "doctor pointing at clipboard"). Faces should convey calm attention.
- Aspect ratios: 16:9 for hero, 4:3 or 3:2 for service tiles, 1:1 for staff portraits.
- Treatment: **untinted at rest**; on hover within tile contexts apply a 0.95 brightness fade with a 200ms ease.

---

## 5. Layout Principles

### Container & grid

- **Max content width**: `1200px` (matches source's `.vc_row`). Gutters: `16px` mobile, `24–32px` desktop.
- A single Tailwind utility container: `mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8`.
- Outer chrome (header / footer) may bleed full-width; inner content is always constrained.

### Whitespace strategy

- **Vertical rhythm** is the most powerful design tool here. Section padding: `py-16 md:py-24` (64–96px). Between heading and body inside a section: `mt-4` to `mt-6`. Between body and CTA: `mt-8`.
- **Don't let elements touch.** The original site, despite its WordPress origins, leaves generous space around every block — that breathing room is the brand.
- **One CTA per section, please.** Don't stack buttons; force the eye to a single decision.

### Responsive behavior

- Desktop: 12-column grid implied; service tiles in 3 across at `lg:`, 2 across at `md:`, 1 across at `sm:`.
- Mobile: type scales down by ~10–15% (hero 38px → 32px; section H2 22px → 20px). Section padding reduces to `py-12`.
- Header collapses to 64px tall hamburger.

### Section vertical pattern

Recommended page rhythm — alternating surfaces for cadence:

```
[hero with image + scrim] → white
[Value props / Why us]    → #F7FAFC (Frosted Mist)
[Programs grid]           → white
[Trust band: clients]     → #E6F7FC (Cyan Wash)
[CTA / phone callout]     → #D7263D (Pulse Crimson, white text)
[Founder teaser]          → white
[Footer]                  → #0F1A24
```

---

## 6. Motion Principles (GSAP guidance)

The source site is essentially **static**. Honor that restraint — motion should feel like *the page settling into place*, never like a portfolio reel.

### Allowed motion vocabulary

- **Section entry** (on scroll, via GSAP ScrollTrigger):
  - `y: 24px → 0`, `opacity: 0 → 1`, duration `0.8s`, ease `power2.out`, stagger `0.08` for child elements.
  - Trigger when section top hits 80% of viewport.
- **Hero headline**: word-by-word reveal — `SplitText` per word, `y: 30 → 0`, opacity in, stagger `0.04`, total duration ~`0.9s`.
- **Pulse line accent** (hero only): a thin ECG-style SVG path animated with `drawSVG` (or `strokeDashoffset` fallback) over 1.2s `power2.inOut`, drawing once on load behind the headline. Single play; no loop. Color: Pulse Crimson `#D7263D`.
- **Image hero**: subtle parallax — translate background image `y: -8% → 8%` across the section's scroll range. **Do not** scale or rotate.
- **Buttons**: 200ms hover transitions on color/shadow only. No GSAP needed.
- **Service tile hover**: `y: 0 → -4`, shadow lift, 250ms ease.
- **Nav scroll behavior**: when scroll > 40px, fade in the nav shadow (`0 1px 2px rgba(0,0,0,0.06)`) over 200ms.

### Prohibited motion

- No bouncing eases (`elastic`, `back`) — they read as playful and break the medical-professional tone.
- No scroll-jacking or pinned full-screen sections.
- No autoplay video or aggressive marquees.
- **Always** wrap motion in `prefers-reduced-motion: reduce` checks. For a healthcare audience this is non-negotiable.

```js
// motion.js — global motion guard
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.defaults({ duration: reduce ? 0 : 0.8, ease: 'power2.out' });
```

---

## 7. Accessibility Floor (non-negotiable)

This is a healthcare site serving an older demographic. Build in these guarantees from day one:

- **Contrast**: Brand teal `#007D7E` on white passes AA for large text (4.7:1) but is **borderline** for body (under 4.5:1). Never use teal for body copy. For primary CTA white-on-teal: 4.7:1 — safe.
- **Min font size**: 16px for body on mobile (Tailwind `text-base`). The source's 14px is too small.
- **Tap targets**: minimum 44×44px on mobile.
- **Focus states**: visible, 3px brand-teal ring with 2px white offset on every interactive element.
- **Greek language**: `<html lang="el">`. Verify Poppins/Open Sans/Lato all ship Greek (`subsets: ['latin', 'greek']` if fetching via `@fontsource`).
- **Phone number**: always wrapped in `<a href="tel:+35722311100">` — primary conversion path.

---

## 8. Asset & Stack Notes (Astro + Tailwind + GSAP)

- **Astro setup**: use `@astrojs/tailwind` integration, content collections for "Services" and "News/Articles", `<Image />` component for all photography (AVIF + WebP fallbacks).
- **Fonts**: install via `@fontsource-variable/open-sans`, `@fontsource-variable/poppins`, `@fontsource/lato` — load `latin` and `greek` subsets only. Self-host; preload the two most-used weights (Open Sans 400, Poppins 700).
- **GSAP**: load on the client only via `client:visible` directive on Astro components that need motion. Pull in `ScrollTrigger` and (optionally) `SplitText` (Club GreenSock) — if no Club license, substitute with native `Intl.Segmenter` for the word-split.
- **Tailwind**: enable JIT, use the `@tailwindcss/typography` plugin for long-form article pages with a custom `prose-brand` theme (teal links, charcoal body, comfortable 1.7 line-height).
- **Performance budget**: LCP < 2.0s, CLS < 0.05, total page weight under 1MB on the homepage. The source is heavy with WordPress chrome — the rebuild's biggest gift to users will be speed.

---

## 9. Voice & Tone (content guardrails)

- **Greek-first, Greek-natural** — do not write English-translated-to-Greek. Headlines should feel native.
- Tone: **warm, plainspoken, never marketingy**. "Φροντίζουμε εσάς και τους δικούς σας" beats "Η Νο.1 Λύση Νοσηλείας".
- Avoid clinical jargon in marketing copy; reserve it for service detail pages.
- Always pair an emotive line with a concrete service or phone CTA — every section should answer "what do I do next?"

---

## 10. Quick Reference: Tailwind Class Cheat Sheet

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

---

**Source-of-truth philosophy:** When in doubt, ask "would this feel reassuring to a 70-year-old caregiver booking nursing for their parent?" If the answer involves the word "fancy", strip it back.
