# Νταντάδες της Γειτονιάς — Sticky Promo Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sitewide promo banner that markets First Aid Academy's Pediatric First Aid training to caregivers entering the new Greek "Νταντάδες της Γειτονιάς" government program. Banner is fixed to the viewport bottom while scrolling, and parks in the gap between the last page section and the footer when the user reaches the bottom.

**Architecture:** Single new Astro component `PromoBanner.astro` rendered once in `PageLayout.astro` between the `<main>` slot and `<Footer />`. Sticky-then-park behavior is achieved with pure CSS via `position: sticky; bottom: 0` on the banner, placed as the last child of a `flex flex-col flex-1` wrapper that contains `<main>`. The wrapper's bottom edge sits just above the footer, so the sticky element naturally "parks" there. Dismissal state persisted to `localStorage` so the banner doesn't reappear on every page load.

**Tech Stack:** Astro 5 (existing SSR setup), Tailwind 3, vanilla `<script>` for dismiss + scroll behaviors. No new deps.

---

## Real-world facts (so the copy is accurate)

Drawn from `ntantades.gov.gr` and recent press (May 2026). Implementer should NOT change these unless they verify against the same sources:

- Program: «Νταντάδες της Γειτονιάς», implemented nationwide for the first time in 2026.
- Beneficiaries: families with infants and children aged **2 months – 2,5 years**.
- Vouchers: €500/month full-time, €300/month part-time.
- **Caregiver requirement** (key for our copy): they must register in the Mητρώο Επιμελητών and **hold a pediatric first-aid certificate for infants and children** (πιστοποιητικό πρώτων βοηθειών για βρέφη και παιδιά).
- Free training is offered by ΕΚΑΒ and the Hellenic Red Cross — but **other certified providers (RTI/ERC) are equally accepted**, which is First Aid Academy's wedge.
- First Aid Academy has two qualifying programs:
  - **PFA (P.F.A. + A.E.D.)** — 12h Παιδιατρικές Πρώτες Βοήθειες και Απινίδωση (`/seminaria/pfa/`)
  - **EPFA (E.P.F.A. + A.E.D.)** — 6h Επείγουσες Παιδιατρικές Πρώτες Βοήθειες (`/seminaria/epfa/`)

Banner CTA points to `/seminaria/pfa/` (the more comprehensive one — meets and exceeds the program's requirement).

---

## Pre-flight (1 decision)

| # | Decision | Default | Why |
|---|---|---|---|
| 1 | Is the banner dismissable? | **Yes**, with `localStorage` key `promo:ntantades-2026` valid for 30 days; respects subsequent updates if the key is bumped to `…-v2` | Sticky elements that can't be closed get rage-closed by users; a dismiss respects them while preserving discoverability |

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `web/src/components/promo/PromoBanner.astro` | **Create** | Self-contained banner with copy, CTA, close button, sticky positioning, dismiss persistence |
| `web/src/layouts/PageLayout.astro` | **Modify** (lines 14–23) | Wrap `<main>` + `<PromoBanner />` in a `flex flex-col flex-1` container so sticky-bottom parents the banner above the footer |

No tests — Astro static-content components in this repo have no test runner; verification is `astro check`, `npm run build`, and a manual scroll-through on the deployed site.

---

## Task 1: Create the PromoBanner component

**Files:**
- Create: `web/src/components/promo/PromoBanner.astro`

- [ ] **Step 1: Create the file with full markup + script**

```astro
---
// web/src/components/promo/PromoBanner.astro
//
// Sticky promo for the «Νταντάδες της Γειτονιάς» program.
// Behavior: position:sticky bottom:0 — floats at viewport bottom while
// scrolling, parks at its natural slot above the footer when reached.
// Dismiss persists in localStorage for 30 days.

const STORAGE_KEY = 'promo:ntantades-2026';
const DISMISS_DAYS = 30;
---
<aside
  id="promo-ntantades"
  data-storage-key={STORAGE_KEY}
  data-dismiss-days={DISMISS_DAYS}
  class="sticky bottom-0 z-30 hidden bg-crimson text-white shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.4)]"
  aria-label="Πρόγραμμα Νταντάδες της Γειτονιάς"
>
  <div class="container-x py-3 md:py-4 flex items-center gap-4">
    <div class="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/30 whitespace-nowrap">
        Νέο πρόγραμμα
      </span>
      <p class="font-display font-bold text-base md:text-lg leading-tight">
        Νταντάδες της Γειτονιάς:
        <span class="font-normal opacity-95">απαιτείται πιστοποιητικό Παιδιατρικών Πρώτων Βοηθειών.</span>
      </p>
    </div>
    <a
      href="/seminaria/pfa/"
      class="hidden sm:inline-flex shrink-0 items-center gap-1.5 bg-white text-crimson font-semibold rounded-md px-4 py-2 text-sm hover:bg-white/90 transition-out no-underline"
    >
      Δείτε το σεμινάριο
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
    <a
      href="/seminaria/pfa/"
      class="inline-flex sm:hidden shrink-0 bg-white text-crimson font-semibold rounded-md px-3 py-2 text-sm no-underline"
      aria-label="Δείτε το σεμινάριο Παιδιατρικών Πρώτων Βοηθειών"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
    <button
      type="button"
      id="promo-ntantades-close"
      aria-label="Κλείσιμο"
      class="shrink-0 -mr-1 w-8 h-8 rounded-full text-white/85 hover:text-white hover:bg-white/15 flex items-center justify-center transition-out"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
</aside>

<script>
  const banner = document.getElementById('promo-ntantades') as HTMLElement | null;
  const closeBtn = document.getElementById('promo-ntantades-close');
  if (banner) {
    const key = banner.dataset.storageKey ?? 'promo:ntantades-2026';
    const days = Number(banner.dataset.dismissDays ?? '30');
    const ttlMs = days * 24 * 60 * 60 * 1000;
    let dismissed = false;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const at = Number(raw);
        if (Number.isFinite(at) && Date.now() - at < ttlMs) dismissed = true;
      }
    } catch { /* ignore — Safari private mode */ }

    if (!dismissed) banner.classList.remove('hidden');

    closeBtn?.addEventListener('click', () => {
      try { localStorage.setItem(key, String(Date.now())); } catch { /* ignore */ }
      banner.classList.add('hidden');
    });
  }
</script>
```

- [ ] **Step 2: Type-check**

Run from `web/`:
```bash
npx astro check 2>&1 | grep -E "PromoBanner" || echo "no errors in PromoBanner"
```
Expected: `no errors in PromoBanner`.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/promo/PromoBanner.astro
git commit -m "feat(promo): add Νταντάδες της Γειτονιάς sticky banner component"
```

---

## Task 2: Wire the banner into PageLayout with sticky-then-park behavior

**Files:**
- Modify: `web/src/layouts/PageLayout.astro`

- [ ] **Step 1: Read the current file**

```bash
cat web/src/layouts/PageLayout.astro
```
Expected: 24-line file starting with `// web/src/layouts/PageLayout.astro` and ending with `</BaseLayout>`. The body slot is currently `<Header /> <main id="main" class="flex-1"> <slot /> </main> <Footer />` (lines 18–22).

- [ ] **Step 2: Replace the contents with the wrapped layout + banner**

```astro
---
// web/src/layouts/PageLayout.astro
import BaseLayout from './BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import PromoBanner from '../components/promo/PromoBanner.astro';
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
  <div class="flex-1 flex flex-col">
    <main id="main" class="flex-1">
      <slot />
    </main>
    <PromoBanner />
  </div>
  <Footer />
</BaseLayout>
```

What changed: the previous `<main class="flex-1">` was the only flex-1 child, so it filled the body. Now we wrap `<main>` + `<PromoBanner />` in a `flex-1 flex flex-col` container so:
- The wrapper takes all space between `<Header />` and `<Footer />`.
- Inside, `<main class="flex-1">` still grows to fill, pushing the banner to the bottom of the wrapper.
- `<PromoBanner>` uses `position: sticky; bottom: 0` — sticks to viewport bottom while scrolling; parks at the wrapper's bottom (= top of footer) once reached.

- [ ] **Step 3: Build to verify**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web && npm run build 2>&1 | tail -3
```
Expected: `[build] Complete!` with no errors.

- [ ] **Step 4: Commit + push**

```bash
git add web/src/layouts/PageLayout.astro
git commit -m "feat(layout): mount Νταντάδες promo banner with sticky-then-park behavior"
git push origin main
```

---

## Task 3: Verify on production

**Files:** none (verification only)

- [ ] **Step 1: Wait for the Vercel deploy**

```bash
npx vercel ls first-aid-courses 2>&1 | head -5
```
Wait until the latest row's status column shows `● Ready`.

- [ ] **Step 2: Headless browser walkthrough**

Open https://first-aid-courses.vercel.app/ in Playwright (or any browser):

1. Banner is visible at the bottom of the viewport on first paint (red, "Νταντάδες της Γειτονιάς: απαιτείται πιστοποιητικό…").
2. Scroll halfway down — banner stays glued to viewport bottom, content scrolling past it.
3. Scroll all the way to the bottom — banner detaches from viewport, parks just above the footer (the gap shown in the spec screenshot).
4. Scroll back up — banner re-attaches to viewport bottom.
5. Click the × close button — banner disappears immediately. Reload the page — banner remains hidden (localStorage hit). Open DevTools → Application → Local Storage → delete `promo:ntantades-2026` → reload → banner returns.
6. Click "Δείτε το σεμινάριο" — navigates to `/seminaria/pfa/`.
7. Repeat steps 1–4 on at least one inner page (e.g. `/timokatalogos/`) to verify the banner is sitewide.
8. On mobile viewport (≤640px), the long CTA collapses to icon-only — verify it's still tappable.

If any step fails, fix and re-deploy. The most likely failure mode: sticky positioning breaking because some ancestor sets `overflow: hidden` or `transform`. If the banner glides through the footer instead of parking, the wrapper isn't structured correctly — re-check Task 2 step 2.

---

## Self-Review Notes

**Spec coverage:**
- "Banner the size of the gap between footer and last section" → banner has natural content height (~60–80px); the wrapper's `flex-1` produces the gap automatically when content is short, and the banner parks at the wrapper's bottom regardless. ✓
- "Sticky to the bottom while scrolling" → `position: sticky; bottom: 0` on the banner inside a flex-1 wrapper. ✓
- "When user reaches end, banner stays in the gap above footer" → the wrapper ends just above `<Footer />`, so sticky bottom parks there. ✓
- "Information about ΠΡΟΓΡΑΜΜΑ ΝΤΑΝΤΑΔΕΣ ΓΕΙΤΟΝΙΑΣ" → researched real program facts; banner copy uses the exact program name + the legally-accurate hook ("απαιτείται πιστοποιητικό Παιδιατρικών Πρώτων Βοηθειών"). ✓

**Placeholder scan:** No TBD / TODO. Every code step has full code. No "similar to Task N" cross-references.

**Type consistency:**
- `STORAGE_KEY` is referenced once in Task 1 step 1 (`promo:ntantades-2026`) and again in Task 3 step 2 (manual verification) — they match exactly.
- `DISMISS_DAYS` (30) only used inside the component.
- `<PromoBanner />` import path in Task 2 (`../components/promo/PromoBanner.astro`) matches the create path in Task 1 (`web/src/components/promo/PromoBanner.astro`).

**Open considerations (not blocking):**
- Banner currently links only to PFA. If you'd rather route by audience to a "compare PFA vs EPFA" page, that's a 1-line change.
- The eyebrow says "Νέο πρόγραμμα" — switch to "Πρόγραμμα ΕΣΠΑ" or similar if you want to convey official/state-funded weight.
- Privacy policy section 9 still claims "no third-party tracking" — unrelated to this banner (no tracking added here), but the cbl.link script from yesterday should be disclosed.

---

## Sources

- [ntantades.gov.gr — official program portal](https://ntantades.gov.gr/)
- [Υπουργείο Κοινωνικής Συνοχής & Οικογένειας — Neighborhood Babysitters Program](https://minscfa.gov.gr/en/demographic-policy/neighborhood-babysitters-program/)
- [Newsbomb — δωρεάν σεμινάρια πρώτων βοηθειών από Ε.Ε.Σ. (May 2026)](https://www.newsbomb.gr/ellada/story/1733542/dantades-tis-geitonias-o-ellinikos-erythros-stavros-ksekinise-ta-dorean-seminaria-proton-voitheion)
- [taxheaven — Q&A from Υπ. Εργασίας](https://www.taxheaven.gr/news/61408/ntantades-ths-geitonias-erwthseis-apanthseis-apo-to-yp-ergasias)
- [Μητρώο Επιμελητών (mitos.gov.gr) — entry requirements incl. first-aid certificate](https://mitos.gov.gr/index.php/%CE%94%CE%94:%CE%88%CE%BD%CF%84%CE%B1%CE%BE%CE%B7_%CF%83%CF%84%CE%BF_%CE%9C%CE%B7%CF%84%CF%81%CF%8E%CE%BF_%CE%95%CF%80%CE%B9%CE%BC%CE%B5%CE%BB%CE%B7%CF%84%CF%8E%CE%BD/-%CF%84%CF%81%CE%B9%CF%8E%CE%BD_%CF%84%CE%B7%CF%82_%CE%B4%CF%81%CE%AC%CF%83%CE%B7%CF%82_%22%CE%9D%CF%84%CE%B1%CE%BD%CF%84%CE%AC%CE%B4%CE%B5%CF%82_%CF%84%CE%B7%CF%82_%CE%93%CE%B5%CE%B9%CF%84%CE%BF%CE%BD%CE%B9%CE%AC%CF%82%22)
