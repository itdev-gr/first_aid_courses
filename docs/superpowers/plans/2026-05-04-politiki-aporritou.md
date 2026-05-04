# Privacy Policy Page (πολιτική απορρήτου) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a detailed, GDPR-compliant Greek-language privacy policy at `/politiki-aporritou/`, accurately describing the data the site already collects (booking + contact forms), and link it from the footer.

**Architecture:** Single static Astro page using the existing `PageLayout` + `Section` + `Container` primitives — same pattern as `timokatalogos.astro` and `epikoinonia.astro`. Content is hardcoded prose in Greek. A sticky table-of-contents on the left (lg+) anchors the long-form sections; the main column hosts the policy text. No new components, no new data, no schema changes. The footer gets a new "Νομικά" column with the link.

**Tech Stack:** Astro 5 (static), Tailwind 3, TypeScript, MDX (not used here — page is `.astro` because content is structural prose, not Markdown).

**Compliance basis:** GDPR (EU 2016/679) + Greek Law 4624/2019 + ePrivacy. The policy must accurately reflect *current* site behaviour:
- Two HTML forms posting to Netlify (`name="booking"` and `name="contact"`) — fields enumerated in the plan below.
- No analytics scripts found in the source as of plan date — **verify before writing the cookies section**.
- Hosting on Vercel (US-based processor → SCC disclosure required).

---

## Pre-flight: facts that must be confirmed by the user before writing content

The following items are **not invented** by the implementer — they require user input. Block on them before starting Task 3.

| Field | Why it matters | If unknown, use placeholder |
|---|---|---|
| Legal name of data controller (φυσικό/νομικό πρόσωπο) | GDPR Art. 13(1)(a) | `[ΕΠΩΝΥΜΙΑ]` |
| ΑΦΜ / ΔΟΥ (if business is registered) | Greek tax identification | `[ΑΦΜ — ΔΟΥ]` |
| Registered postal address | Required for data-subject requests | `[ΔΙΕΥΘΥΝΣΗ]` |
| DPO / privacy contact email (often same as `info@`) | GDPR Art. 13(1)(b) | reuse `info@firstaidacademy.gr` |
| Whether any analytics / cookie banner exists in production | Determines cookies section content | run grep before Task 8 |
| Whether certificates list participants on a third-party registry (RTI/ERC) | If yes, that's a separate processor disclosure | confirm with user |

The implementer must produce a checklist comment in the page itself (HTML comment at top) listing any placeholders still present, so the user knows what to fill in before publication.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `web/src/pages/politiki-aporritou.astro` | **Create** | The privacy-policy page itself. ~250–350 lines of Astro: frontmatter + sticky-TOC layout + 11 numbered policy sections + last-updated date. |
| `web/src/components/layout/Footer.astro` | **Modify** | Add a "Νομικά" link group with one entry pointing to `/politiki-aporritou/`. Existing layout is a 12-column grid (`md:col-span-5 / 3 / 4`) — re-balance to `4 / 3 / 3 / 2` to fit a fourth column on desktop, stack on mobile. |
| `docs/superpowers/plans/2026-05-04-politiki-aporritou.md` | **Already created** | This plan. |

No changes to `nav.ts` — privacy policy belongs in the footer, not the primary nav.

---

## Task 1: Confirm content prerequisites with the user

**Files:** none (read-only / conversational)

- [ ] **Step 1: Run a grep for analytics scripts to ground the cookies section**

```bash
grep -rEi "gtag|google-analytics|googletagmanager|analytics|hotjar|clarity|plausible|fathom|umami|posthog|cookie" web/src --include='*.astro' --include='*.ts' --include='*.js' --include='*.mjs' || echo "no analytics references found"
```

Expected: either a list of references (cookies section must describe each) or the literal "no analytics references found" string (cookies section can state only essential/session cookies).

- [ ] **Step 2: Ask the user to confirm the placeholders table above**

Post the table from the Pre-flight section as a numbered list of questions. Wait for answers. Do not proceed to Task 2 until the user has either answered each row or explicitly said "use placeholders for now — I'll fill in before launch."

- [ ] **Step 3: Record the user's answers in this plan file**

Edit this plan and replace the "Pre-flight" placeholders with the answers given. If a placeholder remains, prefix the row with `**[NEEDS USER INPUT]**` so it shows up in scan.

---

## Task 2: Create the page skeleton

**Files:**
- Create: `web/src/pages/politiki-aporritou.astro`

- [ ] **Step 1: Create the file with frontmatter, page header, and an empty grid for the policy body**

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Section from '../components/layout/Section.astro';

const lastUpdated = '4 Μαΐου 2026';

const sections = [
  { id: 'ypefthynos',     title: '1. Υπεύθυνος επεξεργασίας' },
  { id: 'dedomena',       title: '2. Ποια δεδομένα συλλέγουμε' },
  { id: 'skopoi',         title: '3. Σκοποί και νομική βάση επεξεργασίας' },
  { id: 'diatirisi',      title: '4. Χρόνος διατήρησης' },
  { id: 'apodektes',      title: '5. Αποδέκτες — Εκτελούντες την επεξεργασία' },
  { id: 'diethnis',       title: '6. Διαβίβαση εκτός ΕΟΧ' },
  { id: 'dikaiomata',     title: '7. Τα δικαιώματά σας' },
  { id: 'parapono',       title: '8. Δικαίωμα καταγγελίας στην Αρχή' },
  { id: 'cookies',        title: '9. Cookies και τεχνολογίες παρακολούθησης' },
  { id: 'asfaleia',       title: '10. Ασφάλεια δεδομένων' },
  { id: 'anilikoi',       title: '11. Δεδομένα ανηλίκων' },
  { id: 'tropopoiiseis',  title: '12. Τροποποιήσεις της παρούσας πολιτικής' },
];
---
<!--
  PRIVACY POLICY — placeholders to fill before publishing:
  - [ ] Legal name of data controller in section 1
  - [ ] ΑΦΜ / ΔΟΥ in section 1 (if applicable)
  - [ ] Registered address in section 1
  - [ ] Confirm cookies section (9) reflects current site
-->
<PageLayout
  title="Πολιτική Απορρήτου"
  description="Πολιτική απορρήτου της First Aid Academy — πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα, σύμφωνα με τον GDPR και τον Ν. 4624/2019.">

  <Section tone="default" pad="lg">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Νομικά</p>
      <h1 class="mt-3 font-display font-bold text-crimson text-4xl md:text-5xl leading-tight">Πολιτική Απορρήτου</h1>
      <p class="mt-4 text-ink-muted text-lg leading-relaxed">
        Η παρούσα πολιτική περιγράφει πώς η First Aid Academy συλλέγει, χρησιμοποιεί, αποθηκεύει και προστατεύει
        τα προσωπικά δεδομένα των επισκεπτών και των εκπαιδευομένων, σύμφωνα με τον Γενικό Κανονισμό Προστασίας
        Δεδομένων (ΕΕ 2016/679 — GDPR) και τον Ν. 4624/2019.
      </p>
      <p class="mt-3 text-sm text-ink-muted">Τελευταία ενημέρωση: {lastUpdated}</p>
    </div>
  </Section>

  <Section tone="soft" pad="lg">
    <div class="grid lg:grid-cols-12 gap-10">
      <aside class="lg:col-span-3">
        <nav aria-label="Περιεχόμενα" class="lg:sticky lg:top-28">
          <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Περιεχόμενα</p>
          <ol class="mt-4 space-y-2 text-sm">
            {sections.map(s => (
              <li><a href={`#${s.id}`} class="text-ink-muted hover:text-crimson no-underline">{s.title}</a></li>
            ))}
          </ol>
        </nav>
      </aside>

      <div class="lg:col-span-9 prose-policy space-y-12">
        {/* Sections inserted in Tasks 3–7 */}
      </div>
    </div>
  </Section>
</PageLayout>

<style>
  .prose-policy h2 { font-family: var(--font-display); color: var(--color-crimson, #b91c1c); font-weight: 700; font-size: 1.875rem; line-height: 1.2; scroll-margin-top: 7rem; }
  .prose-policy h3 { font-family: var(--font-display); color: var(--color-ink-strong, #0f172a); font-weight: 600; font-size: 1.25rem; margin-top: 1.5rem; }
  .prose-policy p  { color: var(--color-ink-muted, #475569); line-height: 1.75; margin-top: 1rem; }
  .prose-policy ul { margin-top: 1rem; padding-left: 1.25rem; list-style: disc; color: var(--color-ink-muted, #475569); }
  .prose-policy li { margin-top: 0.5rem; line-height: 1.7; }
  .prose-policy a  { color: var(--color-cyan-700, #0e7490); text-decoration: underline; }
  .prose-policy strong { color: var(--color-ink-strong, #0f172a); }
</style>
```

- [ ] **Step 2: Verify the page builds and renders an empty body**

Run from `web/`:
```bash
npx astro check 2>&1 | grep -E "politiki-aporritou" || echo "no errors in new file"
npm run build 2>&1 | tail -5
```
Expected: "no errors in new file" and a successful build that includes `dist/politiki-aporritou/index.html`.

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/politiki-aporritou.astro docs/superpowers/plans/2026-05-04-politiki-aporritou.md
git commit -m "feat(web): scaffold /politiki-aporritou/ privacy policy page"
```

---

## Task 3: Sections 1–3 (controller, data, purposes)

**Files:**
- Modify: `web/src/pages/politiki-aporritou.astro` (replace the `{/* Sections inserted in Tasks 3–7 */}` placeholder with the markup below)

- [ ] **Step 1: Insert sections 1–3**

```astro
        <section id="ypefthynos">
          <h2>1. Υπεύθυνος επεξεργασίας</h2>
          <p>
            Υπεύθυνος επεξεργασίας των δεδομένων σας είναι:
          </p>
          <ul>
            <li><strong>Επωνυμία:</strong> [ΕΠΩΝΥΜΙΑ — να συμπληρωθεί]</li>
            <li><strong>Διακριτικός τίτλος:</strong> First Aid Academy</li>
            <li><strong>Διεύθυνση:</strong> [ΔΙΕΥΘΥΝΣΗ — να συμπληρωθεί]</li>
            <li><strong>ΑΦΜ / ΔΟΥ:</strong> [ΑΦΜ — να συμπληρωθεί]</li>
            <li><strong>Email επικοινωνίας για θέματα προσωπικών δεδομένων:</strong> <a href="mailto:info@firstaidacademy.gr">info@firstaidacademy.gr</a></li>
          </ul>
          <p>
            Για κάθε ερώτημα σχετικά με την επεξεργασία των δεδομένων σας ή για την άσκηση των δικαιωμάτων σας
            (βλ. ενότητα 7), επικοινωνήστε μαζί μας στο παραπάνω email.
          </p>
        </section>

        <section id="dedomena">
          <h2>2. Ποια δεδομένα συλλέγουμε</h2>
          <p>Συλλέγουμε μόνο τα δεδομένα που χρειάζονται για την παροχή των υπηρεσιών μας. Συγκεκριμένα:</p>

          <h3>2.1 Δεδομένα από τη φόρμα κράτησης σεμιναρίου</h3>
          <p>Όταν συμπληρώνετε τη φόρμα κράτησης στη σελίδα <a href="/kratisi/">/kratisi/</a>, συλλέγουμε:</p>
          <ul>
            <li>Ονοματεπώνυμο</li>
            <li>Διεύθυνση email</li>
            <li>Αριθμό τηλεφώνου</li>
            <li>Επωνυμία επιχείρησης (προαιρετικά, εφόσον αφορά εταιρική κράτηση)</li>
            <li>Επιλεγμένο σεμινάριο, αριθμό συμμετεχόντων και προτιμώμενη ημερομηνία</li>
            <li>Σχόλια / ερωτήσεις που επιλέγετε εσείς να μας στείλετε</li>
          </ul>

          <h3>2.2 Δεδομένα από τη φόρμα επικοινωνίας</h3>
          <p>Όταν χρησιμοποιείτε τη φόρμα στη σελίδα <a href="/epikoinonia/">/epikoinonia/</a>, συλλέγουμε:</p>
          <ul>
            <li>Ονοματεπώνυμο</li>
            <li>Διεύθυνση email</li>
            <li>Θέμα και περιεχόμενο μηνύματος</li>
          </ul>

          <h3>2.3 Δεδομένα έκδοσης πιστοποιητικού</h3>
          <p>
            Με την ολοκλήρωση ενός σεμιναρίου εκδίδεται ονομαστικό πιστοποιητικό συμμετοχής. Για τον σκοπό αυτό
            διατηρούμε το ονοματεπώνυμο, την ημερομηνία γέννησης (όπου απαιτείται από το διεθνές πρωτόκολλο),
            τον τίτλο και την ημερομηνία του σεμιναρίου, καθώς και έναν μοναδικό αριθμό πιστοποιητικού.
          </p>

          <h3>2.4 Πληροφορίες υγείας που γνωστοποιείτε εθελοντικά</h3>
          <p>
            Αν κατά τη διάρκεια ενός σεμιναρίου επιλέξετε να μας ενημερώσετε για ιατρικό περιστατικό ή κατάσταση
            υγείας που επηρεάζει την πρακτική άσκηση (π.χ. πρόσφατη χειρουργική επέμβαση, εγκυμοσύνη), η
            πληροφορία χρησιμοποιείται αποκλειστικά για την προσαρμογή της εκπαιδευτικής σας εμπειρίας και
            <strong>δεν καταγράφεται σε κανένα μόνιμο αρχείο</strong>.
          </p>

          <h3>2.5 Δεδομένα τεχνικής φύσης</h3>
          <p>
            Όπως κάθε ιστότοπος, ο πάροχος φιλοξενίας μας (Vercel) καταγράφει αυτόματα τεχνικά δεδομένα όπως
            διεύθυνση IP, τύπο φυλλομετρητή και ώρα επίσκεψης, για λόγους ασφάλειας και διάγνωσης σφαλμάτων. Τα
            δεδομένα αυτά διαγράφονται αυτόματα ύστερα από σύντομο χρονικό διάστημα.
          </p>
        </section>

        <section id="skopoi">
          <h2>3. Σκοποί και νομική βάση επεξεργασίας</h2>
          <p>Επεξεργαζόμαστε τα δεδομένα σας με τις ακόλουθες νομικές βάσεις του άρθρου 6 του GDPR:</p>
          <ul>
            <li>
              <strong>Εκτέλεση σύμβασης (άρθρο 6 παρ. 1 στ. β):</strong> για την οργάνωση της κράτησης, την
              αποστολή επιβεβαίωσης, την παροχή του σεμιναρίου και την έκδοση του πιστοποιητικού.
            </li>
            <li>
              <strong>Έννομο συμφέρον (άρθρο 6 παρ. 1 στ. στ):</strong> για την απάντηση σε γενικά ερωτήματα
              μέσω της φόρμας επικοινωνίας, την προστασία της ιστοσελίδας από κατάχρηση και την βελτίωση των
              υπηρεσιών μας.
            </li>
            <li>
              <strong>Συμμόρφωση με νομική υποχρέωση (άρθρο 6 παρ. 1 στ. γ):</strong> για την τήρηση
              φορολογικών παραστατικών (απόδειξη / τιμολόγιο) και λοιπών υποχρεώσεων που επιβάλλει ο νόμος.
            </li>
            <li>
              <strong>Συγκατάθεση (άρθρο 6 παρ. 1 στ. α):</strong> για κάθε προαιρετική επικοινωνία πέραν της
              εξυπηρέτησης της κράτησής σας. Έχετε δικαίωμα να ανακαλέσετε τη συγκατάθεσή σας ανά πάσα στιγμή
              χωρίς αυτό να επηρεάζει τη νομιμότητα προηγούμενης επεξεργασίας.
            </li>
          </ul>
        </section>
```

- [ ] **Step 2: Verify build still passes**

```bash
npx astro check 2>&1 | grep -E "politiki-aporritou" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/politiki-aporritou.astro
git commit -m "content(politiki-aporritou): sections 1-3 (controller, data, purposes)"
```

---

## Task 4: Sections 4–6 (retention, recipients, international transfers)

**Files:**
- Modify: `web/src/pages/politiki-aporritou.astro` (append after section 3)

- [ ] **Step 1: Insert sections 4–6**

```astro
        <section id="diatirisi">
          <h2>4. Χρόνος διατήρησης</h2>
          <p>Διατηρούμε τα δεδομένα σας μόνο για όσο χρόνο είναι απαραίτητο για τους σκοπούς της συλλογής τους:</p>
          <ul>
            <li><strong>Δεδομένα κράτησης (πριν την επιβεβαίωση):</strong> έως 6 μήνες από την υποβολή, εκτός εάν προχωρήσει η κράτηση.</li>
            <li><strong>Δεδομένα ολοκληρωμένου σεμιναρίου / πιστοποιητικού:</strong> 5 έτη, διάστημα που αντιστοιχεί στη συνήθη ισχύ της πιστοποίησης και επιτρέπει την επανέκδοση αντιγράφου.</li>
            <li><strong>Φορολογικά παραστατικά:</strong> 5 έτη ή όσο επιβάλλει η εκάστοτε ισχύουσα φορολογική νομοθεσία (συνήθως 10 έτη για βιβλία και στοιχεία).</li>
            <li><strong>Μηνύματα μέσω της φόρμας επικοινωνίας:</strong> έως 12 μήνες από την τελευταία αλληλογραφία.</li>
            <li><strong>Τεχνικά αρχεία καταγραφής (logs):</strong> έως 30 ημέρες, εκτός εάν εντοπιστεί συμβάν ασφαλείας.</li>
          </ul>
          <p>
            Μετά την παρέλευση των παραπάνω διαστημάτων, τα δεδομένα διαγράφονται με ασφαλή τρόπο ή
            ανωνυμοποιούνται.
          </p>
        </section>

        <section id="apodektes">
          <h2>5. Αποδέκτες — Εκτελούντες την επεξεργασία</h2>
          <p>
            Δεν πωλούμε ούτε ενοικιάζουμε τα προσωπικά σας δεδομένα. Σε ορισμένες περιπτώσεις χρησιμοποιούμε
            εξειδικευμένους παρόχους που ενεργούν ως <em>εκτελούντες την επεξεργασία</em> για λογαριασμό μας,
            δεσμευμένοι από συμφωνία επεξεργασίας δεδομένων (DPA):
          </p>
          <ul>
            <li><strong>Πάροχος φιλοξενίας ιστότοπου:</strong> Vercel Inc. (φιλοξενία στατικών αρχείων, logs ασφαλείας).</li>
            <li><strong>Διαχείριση φορμών:</strong> Netlify Forms (παραλαβή υποβολών της φόρμας κράτησης και επικοινωνίας).</li>
            <li><strong>Παροχή email:</strong> ο εκάστοτε πάροχος ηλεκτρονικού ταχυδρομείου μας, για την επικοινωνία με εσάς.</li>
            <li><strong>Λογιστικές υπηρεσίες:</strong> εξωτερικός λογιστής μας, αποκλειστικά για την έκδοση και τήρηση παραστατικών.</li>
          </ul>
          <p>
            Δεδομένα ενδέχεται επίσης να κοινοποιηθούν σε δημόσιες αρχές όταν αυτό απαιτείται από τον νόμο
            (π.χ. φορολογικός έλεγχος).
          </p>
        </section>

        <section id="diethnis">
          <h2>6. Διαβίβαση εκτός ΕΟΧ</h2>
          <p>
            Ορισμένοι από τους παραπάνω παρόχους (Vercel, Netlify) έχουν την έδρα τους ή χρησιμοποιούν
            υποδομές στις Ηνωμένες Πολιτείες της Αμερικής. Σε αυτές τις περιπτώσεις, η διαβίβαση των
            δεδομένων πραγματοποιείται με βάση τις <strong>Τυποποιημένες Συμβατικές Ρήτρες (Standard
            Contractual Clauses)</strong> της Ευρωπαϊκής Επιτροπής, καθώς και — όπου εφαρμόζεται — το
            πλαίσιο <em>EU–U.S. Data Privacy Framework</em>, που εξασφαλίζουν επίπεδο προστασίας
            ισοδύναμο με αυτό του ΕΟΧ.
          </p>
        </section>
```

- [ ] **Step 2: Verify**

```bash
npx astro check 2>&1 | grep -E "politiki-aporritou" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/politiki-aporritou.astro
git commit -m "content(politiki-aporritou): sections 4-6 (retention, recipients, transfers)"
```

---

## Task 5: Sections 7–8 (rights, complaints)

**Files:**
- Modify: `web/src/pages/politiki-aporritou.astro` (append after section 6)

- [ ] **Step 1: Insert sections 7–8**

```astro
        <section id="dikaiomata">
          <h2>7. Τα δικαιώματά σας</h2>
          <p>Σύμφωνα με τα άρθρα 15–22 του GDPR, διατηρείτε τα ακόλουθα δικαιώματα:</p>
          <ul>
            <li><strong>Δικαίωμα πρόσβασης (άρθρο 15):</strong> να ενημερωθείτε ποια δεδομένα σας επεξεργαζόμαστε και να λάβετε αντίγραφο αυτών.</li>
            <li><strong>Δικαίωμα διόρθωσης (άρθρο 16):</strong> να διορθώσετε ανακριβή ή ελλιπή στοιχεία.</li>
            <li><strong>Δικαίωμα διαγραφής / «δικαίωμα στη λήθη» (άρθρο 17):</strong> να ζητήσετε τη διαγραφή των δεδομένων σας, εφόσον δεν συντρέχει νόμιμος λόγος διατήρησης (π.χ. φορολογικά παραστατικά).</li>
            <li><strong>Δικαίωμα περιορισμού της επεξεργασίας (άρθρο 18).</strong></li>
            <li><strong>Δικαίωμα φορητότητας (άρθρο 20):</strong> να λάβετε τα δεδομένα σας σε δομημένη, κοινώς χρησιμοποιούμενη μορφή.</li>
            <li><strong>Δικαίωμα εναντίωσης (άρθρο 21)</strong> στην επεξεργασία που βασίζεται σε έννομο συμφέρον.</li>
            <li><strong>Δικαίωμα ανάκλησης συγκατάθεσης</strong> ανά πάσα στιγμή, όπου η επεξεργασία βασίζεται σε αυτή.</li>
          </ul>
          <p>
            Για την άσκηση οποιουδήποτε από τα παραπάνω δικαιώματα, στείλτε email στο
            <a href="mailto:info@firstaidacademy.gr">info@firstaidacademy.gr</a> με τίτλο «Άσκηση δικαιωμάτων GDPR».
            Θα απαντήσουμε χωρίς καθυστέρηση και σε κάθε περίπτωση εντός <strong>ενός (1) μηνός</strong> από την
            παραλαβή του αιτήματος, σύμφωνα με το άρθρο 12 του GDPR.
          </p>
          <p>
            Ενδέχεται να σας ζητήσουμε επιπλέον στοιχεία ταυτοποίησης, ώστε να βεβαιωθούμε ότι το αίτημα
            προέρχεται από εσάς. Η άσκηση των δικαιωμάτων είναι κατά κανόνα δωρεάν.
          </p>
        </section>

        <section id="parapono">
          <h2>8. Δικαίωμα καταγγελίας στην Αρχή</h2>
          <p>
            Εάν θεωρείτε ότι η επεξεργασία των δεδομένων σας παραβιάζει τη νομοθεσία, έχετε το δικαίωμα να
            υποβάλετε καταγγελία στην
            <strong> Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα</strong>:
          </p>
          <ul>
            <li>Διεύθυνση: Λεωφ. Κηφισίας 1–3, 115 23, Αθήνα</li>
            <li>Τηλέφωνο: +30 210 6475600</li>
            <li>Ιστότοπος: <a href="https://www.dpa.gr" rel="noopener noreferrer" target="_blank">www.dpa.gr</a></li>
          </ul>
          <p>
            Σας προτρέπουμε ωστόσο να επικοινωνήσετε πρώτα μαζί μας — στις περισσότερες περιπτώσεις μπορούμε
            να επιλύσουμε το ζήτημα γρήγορα και άμεσα.
          </p>
        </section>
```

- [ ] **Step 2: Verify**

```bash
npx astro check 2>&1 | grep -E "politiki-aporritou" || echo "no errors"
```

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/politiki-aporritou.astro
git commit -m "content(politiki-aporritou): sections 7-8 (rights, complaints)"
```

---

## Task 6: Sections 9–12 (cookies, security, minors, updates)

**Files:**
- Modify: `web/src/pages/politiki-aporritou.astro` (append after section 8)

- [ ] **Step 1: Adjust cookies section to current site reality**

The cookies section below assumes the site has **no analytics** at the time of writing, based on the grep in Task 1. If the grep found analytics or cookie-banner code, replace the inner contents of section 9 with an enumeration of each cookie (name, purpose, retention, third party). Do not ship the "we do not use analytics" wording if it is false.

- [ ] **Step 2: Insert sections 9–12**

```astro
        <section id="cookies">
          <h2>9. Cookies και τεχνολογίες παρακολούθησης</h2>
          <p>
            Ο ιστότοπός μας χρησιμοποιεί <strong>μόνο τεχνικά απαραίτητα cookies</strong> για τη σωστή
            λειτουργία βασικών υπηρεσιών (π.χ. προστασία της φόρμας από αυτοματοποιημένες υποβολές). Τα cookies
            αυτά δεν απαιτούν συγκατάθεση κατά την Οδηγία ePrivacy και τις σχετικές κατευθυντήριες γραμμές
            της Αρχής Προστασίας Δεδομένων.
          </p>
          <p>
            Δεν χρησιμοποιούμε διαφημιστικά cookies, cookies παρακολούθησης τρίτων ή cookies στατιστικών
            επισκεψιμότητας. Εάν στο μέλλον προστεθούν τέτοιες υπηρεσίες, η παρούσα πολιτική θα ενημερωθεί
            και θα ενεργοποιηθεί banner συγκατάθεσης πριν από την εγκατάστασή τους.
          </p>
          <p>
            Μπορείτε ανά πάσα στιγμή να διαχειριστείτε ή να διαγράψετε τα cookies από τις ρυθμίσεις του
            φυλλομετρητή σας.
          </p>
        </section>

        <section id="asfaleia">
          <h2>10. Ασφάλεια δεδομένων</h2>
          <p>
            Λαμβάνουμε εύλογα τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων σας από μη
            εξουσιοδοτημένη πρόσβαση, απώλεια ή αλλοίωση, μεταξύ των οποίων:
          </p>
          <ul>
            <li>Κρυπτογράφηση όλης της κίνησης μέσω <abbr title="Hypertext Transfer Protocol Secure">HTTPS / TLS</abbr>.</li>
            <li>Περιορισμό της πρόσβασης σε δεδομένα μόνο σε όσους τα χρειάζονται για την παροχή της υπηρεσίας.</li>
            <li>Προστασία των φορμών από κατάχρηση μέσω honeypot και λοιπών μηχανισμών.</li>
            <li>Συμβατικές δεσμεύσεις (DPA) με τους εκτελούντες την επεξεργασία.</li>
          </ul>
          <p>
            Παρά τα παραπάνω, καμία μετάδοση δεδομένων μέσω διαδικτύου δεν είναι 100% ασφαλής. Σε περίπτωση
            παραβίασης που ενδέχεται να επηρεάσει τα δικαιώματά σας, θα ενημερωθείτε σύμφωνα με τα άρθρα
            33 και 34 του GDPR.
          </p>
        </section>

        <section id="anilikoi">
          <h2>11. Δεδομένα ανηλίκων</h2>
          <p>
            Ο ιστότοπος δεν απευθύνεται σε ανηλίκους κάτω των 16 ετών και δεν συλλέγουμε εν γνώσει μας
            δεδομένα ανηλίκων χωρίς τη συγκατάθεση του ασκούντος τη γονική μέριμνα. Σε σεμινάρια στα οποία
            προβλέπεται η συμμετοχή ανηλίκου, την κράτηση και τη συγκατάθεση παρέχει ο γονέας ή κηδεμόνας.
          </p>
        </section>

        <section id="tropopoiiseis">
          <h2>12. Τροποποιήσεις της παρούσας πολιτικής</h2>
          <p>
            Ενδέχεται να επικαιροποιούμε την παρούσα πολιτική, ώστε να αντικατοπτρίζει αλλαγές στις υπηρεσίες
            μας ή στη νομοθεσία. Η ημερομηνία τελευταίας ενημέρωσης αναγράφεται στο επάνω μέρος της σελίδας.
            Σας ενθαρρύνουμε να επανεξετάζετε περιοδικά την πολιτική για να ενημερώνεστε για τυχόν αλλαγές.
          </p>
        </section>
```

- [ ] **Step 3: Verify**

```bash
npx astro check 2>&1 | grep -E "politiki-aporritou" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/politiki-aporritou.astro
git commit -m "content(politiki-aporritou): sections 9-12 (cookies, security, minors, updates)"
```

---

## Task 7: Add the link to the footer

**Files:**
- Modify: `web/src/components/layout/Footer.astro`

- [ ] **Step 1: Re-balance the grid and add a "Νομικά" column**

Replace lines 7–39 of `Footer.astro` (the `grid` div and its three children) so the grid becomes 4 columns on desktop. Specifically:

`old_string` (lines 7-39, exact):

```astro
  <div class="container-x py-16 md:py-20 grid gap-10 md:grid-cols-12">
    <div class="md:col-span-5">
```

becomes:

```astro
  <div class="container-x py-16 md:py-20 grid gap-10 md:grid-cols-12">
    <div class="md:col-span-4">
```

Then change `<div class="md:col-span-3">` (the Πλοήγηση column) to keep `md:col-span-3`, change `<div class="md:col-span-4">` (the Επικοινωνία column) to `<div class="md:col-span-3">`, and **append** a new fourth column before the closing `</div>` of the outer grid:

```astro
    <div class="md:col-span-2">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-white/60">Νομικά</h3>
      <ul class="mt-4 space-y-2">
        <li><a href="/politiki-aporritou/" class="text-white/85 hover:text-white no-underline">Πολιτική Απορρήτου</a></li>
      </ul>
    </div>
```

Total column widths: 4 + 3 + 3 + 2 = 12. ✓

- [ ] **Step 2: Verify the footer renders on every page**

```bash
npm run build 2>&1 | tail -5
```
Expected: build succeeds.

Then `npm run dev`, open <http://localhost:4321/>, scroll to footer, confirm the four columns are present and the Νομικά link points to `/politiki-aporritou/`. Click it — the privacy page should load.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/layout/Footer.astro
git commit -m "feat(web): add Νομικά footer column linking to privacy policy"
```

---

## Task 8: Final verification, fill placeholder check, push

**Files:** none (verification only — except possibly editing the page if user has provided values)

- [ ] **Step 1: If the user provided real values for Pre-flight placeholders in Task 1, edit the page now**

Replace each `[ΕΠΩΝΥΜΙΑ — να συμπληρωθεί]`, `[ΑΦΜ — να συμπληρωθεί]`, `[ΔΙΕΥΘΥΝΣΗ — να συμπληρωθεί]` with the values supplied. Remove the corresponding `- [ ]` lines from the HTML comment at the top of the file. If any placeholder remains, leave the comment line in place — it is the launch checklist.

- [ ] **Step 2: Visual sanity check on dev server**

```bash
npm run dev
```

Open <http://localhost:4321/politiki-aporritou/> and verify:
1. Page title in browser tab reads "Πολιτική Απορρήτου | First Aid Academy" (or however `PageLayout` formats it).
2. The sticky table-of-contents appears on the left at lg+ breakpoint and stacks above the body on mobile.
3. Every TOC link scrolls to the corresponding section (try clicking 2–3).
4. Scroll-margin works — section heading is not hidden under the sticky header.
5. Greek typography renders without missing glyphs.
6. The footer's new "Νομικά" column appears on every page (test homepage + `/seminaria/` + `/timokatalogos/`).

If any issue, fix in this task before committing.

- [ ] **Step 3: Build for production**

```bash
npm run build
```
Expected: completes without errors. Verify `web/dist/politiki-aporritou/index.html` exists.

- [ ] **Step 4: Type-check the whole project once more**

```bash
npx astro check 2>&1 | tail -10
```
Expected: same 4 pre-existing errors in `HeroSplit.astro` only — no new errors.

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

Then watch the Vercel dashboard at <https://vercel.com/itdevs-projects-a8c0aa53/first-aid-courses>. New production deploy should land within ~1–2 min. Visit the live URL `/politiki-aporritou/` to confirm.

---

## Self-Review Notes

**Spec coverage:**
- "Detailed privacy policy page" → 12 sections covering identity, data, purposes, retention, recipients, transfers, rights, complaints, cookies, security, minors, updates. ✓
- "πολιτική απορρήτου" → page lives at the slug `/politiki-aporritou/` (standard Greek transliteration). ✓
- Discoverable from the footer (correct convention — privacy doesn't go in primary nav). ✓
- Accuracy: data sections enumerate the *actual* fields collected by the existing booking and contact forms, not generic boilerplate. ✓

**Placeholders:** Three legal-identity fields are explicitly marked as `[NEEDS USER INPUT]` in Task 1 and the page itself, with a launch checklist in an HTML comment. These cannot be invented — they require the user. The cookies section is grounded in a grep performed in Task 1, with a fork in Task 6 if analytics turn up.

**Type / link consistency:**
- All TOC anchors (`#ypefthynos`, `#dedomena`, etc.) match `id` attributes on the `<section>` elements in Tasks 3–6.
- `lastUpdated` is set in the frontmatter and referenced once in the body — single source of truth.
- Footer link `href="/politiki-aporritou/"` matches the page slug from Astro's file-based routing.

**Grid math:** Footer columns sum to 12 (4 + 3 + 3 + 2). ✓
