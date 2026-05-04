# Seminaria Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `/seminaria/` grid (mixed-style ProgramCards with photo heroes) with a 6-card "RTI badge" grid that matches the user's screenshot — round badge logo on top, centered title + code, duration/evaluation block, price, and a single red "Επιλογή Ημερομηνίας" CTA that always routes to `/kratisi/`.

**Architecture:**
- New presentational component `SeminarCard.astro` rendered only on `/seminaria/` (the existing `ProgramCard.astro` stays untouched — it's still consumed by `home/ProgramsTeaser.astro`, `programs/RelatedPrograms.astro`, and `etairikoi.astro`).
- Two new optional fields on the `programs` content collection: `badgeImage` (round logo, fully visible via `object-contain`) and `priceEur` (number, e.g. `230`). When `badgeImage` is missing the card falls back to `heroImage` so the page never breaks while the user is sourcing badge files.
- Card content (title text, code label, duration, evaluation copy, price, "tag note" like *Δεν περιέχει παιδιατρικά*) is read entirely from MDX frontmatter — no hardcoded strings in the component. We update the 6 individual/parent program MDX files with the exact copy from the screenshot.

**Tech Stack:** Astro 4 content collections, Tailwind CSS, `astro:assets` `<Image>` with `object-contain` for badge fidelity.

---

## File Structure

**Create:**
- `web/src/components/programs/SeminarCard.astro` — new card matching the screenshot
- `web/src/assets/programs/<slug>/badge.png` — placeholder badge files (one per slug; user replaces with real RTI artwork later). Use a temporary copy of `hero.*` so the build is green from day one.

**Modify:**
- `web/src/content/config.ts` — add optional `badgeImage`, `priceEur`, `evaluationNote` fields to the `programs` schema
- `web/src/content/programs/cofat.mdx` — update `titleEl`, add `priceEur: 230`, `evaluationNote`, `badgeImage`
- `web/src/content/programs/bls.mdx` — same pattern, `priceEur: 115`
- `web/src/content/programs/cpr-aed.mdx` — `priceEur: 75`
- `web/src/content/programs/fa.mdx` — `priceEur: 90`
- `web/src/content/programs/pfa.mdx` — `priceEur: 185`
- `web/src/content/programs/epfa.mdx` — `priceEur: 125`
- `web/src/pages/seminaria/index.astro` — render new `SeminarCard` for individual+parent programs in a 3-column grid; keep the business section using existing `ProgramCard` so corporate listings are not affected

**Untouched (intentionally):**
- `web/src/components/programs/ProgramCard.astro` — used by 4 other pages
- `web/src/content/programs/faw.mdx`, `efaw.mdx` — business programs, not in screenshot

**Routing for CTA:** Every card's button links to `/kratisi/?program=<slug>` — `kratisi.astro:65-77` already reads the `program` URL param and pre-selects the program in the booking form, so no booking-page changes are needed.

---

## Self-Review Checklist (run after writing the plan)

1. Spec coverage — did all 6 cards from the screenshot get exact title/code/duration/price/note copy in their MDX? ✅ (Tasks 3–8)
2. Placeholder scan — every step contains real code, real paths, real commands. ✅
3. Type consistency — `badgeImage` / `priceEur` / `evaluationNote` names match across schema (Task 1), MDX (Tasks 3–8), and component (Task 2). ✅

---

## Task 1: Extend the `programs` content collection schema

**Files:**
- Modify: `web/src/content/config.ts:5-25`

- [ ] **Step 1: Edit the schema**

In `web/src/content/config.ts`, inside the `programs` schema object (between `evaluation` and `summary`), add three optional fields. Final schema block looks like this:

```ts
const programs = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    code:        z.string(),
    titleEl:     z.string(),
    titleEn:     z.string(),
    audience:    z.enum(['individual', 'business', 'parent']),
    category:    z.enum(['life-support', 'first-aid', 'pediatric', 'workplace', 'comprehensive']),
    durationHours: z.string(),
    evaluation: z.string(),
    evaluationNote: z.string().optional(),
    priceEur:   z.number().optional(),
    summary:    z.string(),
    description: z.string(),
    prerequisite: z.string().optional(),
    theory:     z.array(z.string()),
    skills:     z.array(z.string()),
    heroImage:  image(),
    badgeImage: image().optional(),
    galleryImages: z.array(z.string()).default([]),
    tags:       z.array(z.string()).default([]),
    order:      z.number().default(99),
    featured:   z.boolean().default(false),
  }),
});
```

- [ ] **Step 2: Verify the build still passes (no MDX consumes the new fields yet, so existing content stays valid)**

Run: `cd web && npx astro check`
Expected: `0 errors, 0 warnings` (or unchanged from baseline). If a hint warning appears about unused fields, ignore.

- [ ] **Step 3: Commit**

```bash
git add web/src/content/config.ts
git commit -m "feat(web): add badgeImage/priceEur/evaluationNote fields to programs collection"
```

---

## Task 2: Build the `SeminarCard.astro` component

**Files:**
- Create: `web/src/components/programs/SeminarCard.astro`

- [ ] **Step 1: Create the component file**

Write `web/src/components/programs/SeminarCard.astro` with this exact content:

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import Button from '../ui/Button.astro';

interface Props { entry: CollectionEntry<'programs'>; }
const { entry } = Astro.props;
const {
  code, titleEl, durationHours, evaluation, evaluationNote, priceEur, badgeImage, heroImage,
} = entry.data;

const logo = badgeImage ?? heroImage;
const ctaHref = `/kratisi/?program=${entry.slug}`;
---
<article class="flex flex-col items-center text-center bg-white rounded-2xl border border-hairline p-6 md:p-8 shadow-tile h-full">
  <div class="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white flex items-center justify-center overflow-hidden">
    <Image
      src={logo}
      alt={`Λογότυπο σεμιναρίου ${titleEl}`}
      widths={[160, 240, 320]}
      sizes="160px"
      class="w-full h-full object-contain p-2"
    />
  </div>

  <h3 class="mt-5 font-display font-semibold text-ink-strong text-lg md:text-xl leading-tight">
    {titleEl}
  </h3>
  <p class="mt-1 text-ink-strong font-semibold">
    (κωδικός {code})
  </p>

  <p class="mt-5 text-ink-muted text-sm leading-relaxed">
    <span class="font-semibold text-ink-strong">Διάρκεια:</span> {durationHours} ώρες,
    <span class="font-semibold text-ink-strong">Αξιολόγηση:</span> {evaluation}
    {evaluationNote && (
      <span class="block mt-2 text-crimson font-semibold">({evaluationNote})</span>
    )}
  </p>

  {priceEur !== undefined && (
    <p class="mt-6 font-display font-bold text-ink-strong text-2xl">
      €{priceEur} <span class="text-base font-normal">/ άτομο</span>
    </p>
  )}

  <Button href={ctaHref} variant="primary" size="md" className="mt-6">
    Επιλογή Ημερομηνίας
  </Button>
</article>
```

Key design choices, locked in:
- `object-contain p-2` inside a fixed-size circular wrapper guarantees the badge is **fully visible** (not cropped) regardless of the source image's aspect ratio.
- `bg-white` on the wrapper keeps the surface clean if a transparent PNG badge is supplied.
- The CTA always points to `/kratisi/?program=<slug>` — `web/src/pages/kratisi.astro:65-77` reads the param and pre-selects the program.
- No internal hover/scale on the badge — matches the screenshot's static, info-card aesthetic.

- [ ] **Step 2: Type-check the component in isolation**

Run: `cd web && npx astro check`
Expected: `0 errors`. If there is an error about `entry.slug` typing, the Astro version may need `entry.id` — check `ProgramCard.astro:14` which uses `entry.slug`; mirror whatever works there.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/programs/SeminarCard.astro
git commit -m "feat(web): add SeminarCard component for /seminaria grid"
```

---

## Task 3: Update `cofat.mdx` frontmatter (Πλήρης Εκπαίδευση)

**Files:**
- Modify: `web/src/content/programs/cofat.mdx` (frontmatter only)
- Create: `web/src/assets/programs/cofat/badge.png` (temporary — copy of `hero.png`)

- [ ] **Step 1: Create the placeholder badge file**

Run: `cp web/src/assets/programs/cofat/hero.png web/src/assets/programs/cofat/badge.png`
Expected: file created, no output. (User will replace with real RTI "Complete First Aid" round badge later.)

- [ ] **Step 2: Update the frontmatter**

In `web/src/content/programs/cofat.mdx`, edit only the frontmatter block. Set/replace these keys:

```yaml
code: Co.F.A.T.
titleEl: Πλήρης Εκπαίδευση Πρώτων Βοηθειών
durationHours: '18'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή και Γραπτή εξέταση πολλαπλής επιλογής
evaluationNote: Περιέχει ΟΛΑ τα προγράμματα
priceEur: 230
heroImage: ../../assets/programs/cofat/hero.png
badgeImage: ../../assets/programs/cofat/badge.png
```

Leave every other key (`titleEn`, `audience`, `category`, `summary`, `description`, `theory`, `skills`, `tags`, `order`, `featured`) **unchanged**. The `code` value changes from `CoFAT` → `Co.F.A.T.` to match the screenshot's display format.

- [ ] **Step 3: Verify the file parses**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/cofat/badge.png web/src/content/programs/cofat.mdx
git commit -m "content(cofat): add badge image, price, and evaluation note for seminar card"
```

---

## Task 4: Update `bls.mdx` frontmatter (Βασική Υποστήριξη Ζωής)

**Files:**
- Modify: `web/src/content/programs/bls.mdx` (frontmatter only)
- Create: `web/src/assets/programs/bls/badge.png`

- [ ] **Step 1: Create the placeholder badge**

Run: `cp web/src/assets/programs/bls/hero.jpg web/src/assets/programs/bls/badge.jpg`
Expected: file created.

- [ ] **Step 2: Update the frontmatter**

```yaml
code: B.L.S
titleEl: Βασική Υποστήριξη Ζωής
durationHours: '7'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή και Γραπτή εξέταση πολλαπλής επιλογής
evaluationNote: Δεν περιέχει παιδιατρικά
priceEur: 115
heroImage: ../../assets/programs/bls/hero.jpg
badgeImage: ../../assets/programs/bls/badge.jpg
```

(Note: `durationHours` was previously `'6 - 7'` — the screenshot shows just `7 ώρες`, so we set `'7'`.)

- [ ] **Step 3: Verify**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/bls/badge.jpg web/src/content/programs/bls.mdx
git commit -m "content(bls): set 7h duration, price 115, evaluation note, badge image"
```

---

## Task 5: Update `cpr-aed.mdx` frontmatter (ΚΑΡΠΑ – Α.Ε.Α.)

**Files:**
- Modify: `web/src/content/programs/cpr-aed.mdx`
- Create: `web/src/assets/programs/cpr-aed/badge.jpg`

- [ ] **Step 1: Create the placeholder badge**

Run: `cp web/src/assets/programs/cpr-aed/hero.jpg web/src/assets/programs/cpr-aed/badge.jpg`

- [ ] **Step 2: Update the frontmatter**

```yaml
code: C.P.R - A.E.D.
titleEl: Καρδιοπνευμονική Αναζωογόνηση και Απινίδωση
durationHours: '5'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή και Γραπτή εξέταση πολλαπλής επιλογής
evaluationNote: Δεν περιέχει παιδιατρικά
priceEur: 75
heroImage: ../../assets/programs/cpr-aed/hero.jpg
badgeImage: ../../assets/programs/cpr-aed/badge.jpg
```

- [ ] **Step 3: Verify**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/cpr-aed/badge.jpg web/src/content/programs/cpr-aed.mdx
git commit -m "content(cpr-aed): set 5h, price 75, evaluation note, badge image"
```

---

## Task 6: Update `fa.mdx` frontmatter (Πρώτες Βοήθειες — Κοινοί Τραυματισμοί)

**Files:**
- Modify: `web/src/content/programs/fa.mdx`
- Create: `web/src/assets/programs/fa/badge.jpg`

- [ ] **Step 1: Create the placeholder badge**

Run: `cp web/src/assets/programs/fa/hero.jpg web/src/assets/programs/fa/badge.jpg`

- [ ] **Step 2: Update the frontmatter**

```yaml
code: F.A.
titleEl: Πρώτες Βοήθειες Αντιμετώπιση Κοινών/Συχνών Τραυματισμών
durationHours: '6'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή και Γραπτή εξέταση πολλαπλής επιλογής
evaluationNote: Δεν περιέχει ΚΑΡ.Π.Α.
priceEur: 90
heroImage: ../../assets/programs/fa/hero.jpg
badgeImage: ../../assets/programs/fa/badge.jpg
```

- [ ] **Step 3: Verify**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/fa/badge.jpg web/src/content/programs/fa.mdx
git commit -m "content(fa): set updated title, price 90, evaluation note, badge image"
```

---

## Task 7: Update `pfa.mdx` frontmatter (Παιδιατρικές + Α.Ε.Α.)

**Files:**
- Modify: `web/src/content/programs/pfa.mdx`
- Create: `web/src/assets/programs/pfa/badge.png`

- [ ] **Step 1: Create the placeholder badge**

Run: `cp web/src/assets/programs/pfa/hero.png web/src/assets/programs/pfa/badge.png`

- [ ] **Step 2: Update the frontmatter**

```yaml
code: P.F.A. + A.E.D.
titleEl: Παιδιατρικές Πρώτες Βοήθειες και Απινίδωση
durationHours: '12'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή και Γραπτή εξέταση πολλαπλής επιλογής
priceEur: 185
heroImage: ../../assets/programs/pfa/hero.png
badgeImage: ../../assets/programs/pfa/badge.png
```

(No `evaluationNote` for this card per the screenshot.)

- [ ] **Step 3: Verify**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/pfa/badge.png web/src/content/programs/pfa.mdx
git commit -m "content(pfa): set updated title with AED, price 185, badge image"
```

---

## Task 8: Update `epfa.mdx` frontmatter (Επείγουσες Παιδιατρικές + Α.Ε.Α.)

**Files:**
- Modify: `web/src/content/programs/epfa.mdx`
- Create: `web/src/assets/programs/epfa/badge.jpg`

- [ ] **Step 1: Create the placeholder badge**

Run: `cp web/src/assets/programs/epfa/hero.jpg web/src/assets/programs/epfa/badge.jpg`

- [ ] **Step 2: Update the frontmatter**

```yaml
code: E.P.F.A.+ A.E.D.
titleEl: Επείγουσες Παιδιατρικές Πρώτες Βοήθειες και Απινίδωση
durationHours: '6'
evaluation: Πρακτική αξιολόγηση από τον εκπαιδευτή
priceEur: 125
heroImage: ../../assets/programs/epfa/hero.jpg
badgeImage: ../../assets/programs/epfa/badge.jpg
```

(Card 6's evaluation copy is shorter — only "Πρακτική αξιολόγηση από τον εκπαιδευτή" — no written multi-choice exam, no `evaluationNote`.)

- [ ] **Step 3: Verify**

Run: `cd web && npx astro check`
Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add web/src/assets/programs/epfa/badge.jpg web/src/content/programs/epfa.mdx
git commit -m "content(epfa): set updated title with AED, price 125, badge image"
```

---

## Task 9: Wire `SeminarCard` into `/seminaria/`

**Files:**
- Modify: `web/src/pages/seminaria/index.astro`

- [ ] **Step 1: Replace the page contents**

Overwrite `web/src/pages/seminaria/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import Section from '../../components/layout/Section.astro';
import ProgramCard from '../../components/programs/ProgramCard.astro';
import SeminarCard from '../../components/programs/SeminarCard.astro';
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
        Επιλέξτε σεμινάριο και πατήστε <strong>«Επιλογή Ημερομηνίας»</strong> για να δείτε διαθεσιμότητα και να κλείσετε τη θέση σας.
      </p>
    </div>
  </Section>

  <Section tone="soft" pad="lg">
    <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Για ιδιώτες & γονείς</p>
    <h2 class="mt-3 text-crimson font-display font-semibold text-3xl md:text-4xl">Ατομικά προγράμματα</h2>
    <Reveal stagger={0.08}>
      <ul class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {individuals.map((p) => <li><SeminarCard entry={p} /></li>)}
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

What changed vs. the previous file:
- Imports `SeminarCard` alongside the existing `ProgramCard`.
- Intro paragraph rewritten to direct visitors to "Επιλογή Ημερομηνίας" (matches the user's screenshot annotation: *"όλα τα κουμπιά θα οδηγούν στην ίδια σελίδα με τις ημερομηνίες"*).
- **Individuals/parents grid uses `<SeminarCard>`** — the new badge-style layout.
- Business grid still uses `<ProgramCard>` — corporate listings have no fixed price (custom quotes), so the photo-card style remains correct.

- [ ] **Step 2: Build and inspect**

Run: `cd web && npm run build`
Expected: build succeeds, no schema errors. The `dist/seminaria/index.html` should be regenerated.

- [ ] **Step 3: Visually verify in dev server**

Run: `cd web && npm run dev`
Open: `http://localhost:4321/seminaria/`
Check, in this order:
  1. The "Ατομικά προγράμματα" section shows **6 cards** in a 3-column grid on desktop, 2-column on tablet, 1-column on mobile.
  2. Each card shows the round badge image **fully visible** (no cropping, no zoom — the entire image fits inside the circle).
  3. Titles, codes, durations, prices, and evaluation notes match the screenshot row-by-row (Co.F.A.T. €230, B.L.S €115, C.P.R - A.E.D. €75, F.A. €90, P.F.A. + A.E.D. €185, E.P.F.A.+ A.E.D. €125).
  4. Click "Επιλογή Ημερομηνίας" on any card → lands on `/kratisi/?program=<slug>` and the program is pre-selected in the booking form.
  5. The "Ενδοεπιχειρησιακή εκπαίδευση" section below still renders the FAW/EFAW cards in the original photo-card style (regression check).

If the badge images look stretched or cropped, the bug is in `SeminarCard.astro` — confirm `object-contain` is on the `<Image>` and `overflow-hidden` is on the wrapper.

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/seminaria/index.astro
git commit -m "feat(web): redesign /seminaria grid with badge-style SeminarCard"
```

---

## Task 10: Final QA pass

- [ ] **Step 1: Make sure no other page broke**

Run: `cd web && npm run build`
Expected: 0 errors.

Spot-check pages that import `ProgramCard.astro`:
- `/` (home — `ProgramsTeaser.astro`)
- `/etairikoi/` (corporate)
- Any program detail page (`/seminaria/<slug>/`) — should still show "RelatedPrograms" with old-style cards.

Run: `cd web && npm run dev`, open each in the browser.

- [ ] **Step 2: Confirm CTA wiring on every card**

In the browser, click the CTA on **all 6** cards. Each must land on `/kratisi/?program=<slug>` with the matching program pre-selected. If any card 404s, the slug in `kratisi.astro:65-77` lookup may differ from the file's slug — check `entry.slug` matches the `<select>`'s `<option>` values.

- [ ] **Step 3: Hand-off note for the user**

Add a one-line note in your end-of-task summary telling the user:
> *"Replace the placeholder `badge.png` / `badge.jpg` files in `web/src/assets/programs/<slug>/` with the real round RTI badge artwork when you have them — the layout already crops them to a circle and renders them fully visible."*

(No commit for this step — it's a verification gate, not a code change.)

---

## Notes for the executing agent

- **Do not modify `ProgramCard.astro`.** It's load-bearing for `/`, `/etairikoi/`, related-programs blocks. Any change there is out of scope.
- **Do not touch `kratisi.astro`.** The `?program=<slug>` query-param handling already exists at lines 65–77.
- **Do not add Greek prerequisite text or theory edits** to the MDX files — only the listed frontmatter keys change. The page body (description, theory, skills) stays untouched so the program detail pages (`/seminaria/[slug]/`) continue to read correctly.
- **If `npx astro check` fails on `image().optional()`** — the running Astro version may require `image().nullish()` instead. Try that as a fallback.
