# Admin Dashboard — Roadmap & Phase 1 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal (overall project):** Admin dashboard at `/admin/` where the client manages seminar dates, views bookings, and tracks payments. Public booking form is rewritten to read available dates from Firestore and write submissions there. Payments collected via Viva Wallet. No image management.

**Goal (Phase 1, this plan):** Infrastructure + admin login + protected admin shell. Client can sign in at `/admin/login`, see a placeholder dashboard at `/admin/`, log out. Nothing else functional yet.

**Architecture (overall):** Astro switches from static to SSR via the Vercel adapter so we can have API routes and server-rendered protected pages. Firebase provides Firestore (data) and Firebase Auth (admin login). Firebase Admin SDK runs server-side for privileged operations and session-cookie verification. Viva Wallet checkout is server-orchestrated; their webhook hits an Astro API route that updates booking status. No Firebase Storage (you confirmed images stay in the repo).

**Tech Stack:**
- Astro 5 + `@astrojs/vercel` (serverless adapter, SSR)
- Tailwind 3 (existing)
- Firebase 11 (modular client SDK) + `firebase-admin` (server)
- Viva Wallet Smart Checkout API
- Resend for transactional email (recommended; see Decision #8)

---

## Project Roadmap (5 phases)

| # | Phase | Deliverable | Depends on |
|---|---|---|---|
| **1** | **Auth & Admin Shell** *(this plan)* | Client logs in at `/admin/login`, lands on empty `/admin/`, logs out. Vercel SSR + Firebase wired up. | — |
| 2 | Sessions CRUD | Client adds/edits/deletes session dates per program in `/admin/sessions/`. Each session has program, datetime, capacity, location. | 1 |
| 3 | Public Booking Rewrite | `/kratisi/` reads available sessions from Firestore (drops the static select); on submit, writes a `bookings` doc instead of Netlify form. Confirmation page reads back. | 2 |
| 4 | Bookings Dashboard + Email | `/admin/bookings/` lists submissions with filters; admin can mark paid/cancelled. Resend sends email to client on new booking. | 3 |
| 5 | Viva Payment Integration | After booking submit, customer can pay online via Viva. Webhook updates booking status. `/admin/payments/` view joins payments with bookings. | 4 |

Each phase is a separate plan document and a separate PR. Phases 2–5 are summarised at the bottom of this file; their detailed plans get written when their predecessor merges.

---

## Pre-flight: 9 decisions needed from the user before execution

Block on these before starting Task 1. Default values are shown — confirm each, or override.

| # | Decision | Default | Why it matters |
|---|---|---|---|
| 1 | Stay on Vercel as host? | **Yes** | Astro SSR adapter + env vars + webhook URLs all assume Vercel. |
| 2 | Single admin user, or multiple? | **Single** (`info@firstaidacademy.gr`) | If multi-user, we need an "admins" allowlist in env or Firestore. |
| 3 | Login method | **Email + password** | Google OAuth is also easy if preferred; affects login page UI. |
| 4 | Firebase project name & region | **`first-aid-academy` / `europe-west3`** | Used for Firestore + Auth. Region affects latency for Greek users. |
| 5 | Capacity per session | **Yes, optional** (null = unlimited) | Determines whether `/kratisi/` shows "X seats left" and whether to hard-block over-bookings. |
| 6 | Payment timing | **Pay later** (book first, pay on arrival or via Viva when convenient) | Alternative is "must pay to confirm seat" which delays Phase 5 work. |
| 7 | Currency for Viva | **EUR** | Programs are priced in EUR already. |
| 8 | Email provider for notifications | **Resend** (free tier ≤ 3k/mo) | Alternative: Firebase Extensions Mail / SendGrid. Affects Task setup in Phase 4. |
| 9 | What happens to old Netlify form submissions? | **Discard** (assume none in production) | If there are real bookings already collected, we need to migrate them. |

The implementer must not start Task 1 until the user has confirmed these (or said "use defaults"). Decisions get recorded in this file by editing the table above.

---

## Data Model (decided upfront so all phases agree)

### `sessions` collection

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore auto-id |
| `programSlug` | string | matches MDX slug: `cofat` \| `bls` \| `cpr-aed` \| `fa` \| `pfa` \| `epfa` \| `efaw` \| `faw` |
| `startsAt` | Timestamp | session start (UTC, displayed in Europe/Athens) |
| `durationHours` | number | denormalised from program, lets admin override |
| `capacity` | number \| null | null = unlimited |
| `location` | string | e.g. `"First Aid Academy, Θεσσαλονίκη"` or `"Στον χώρο σας — TBD"` |
| `priceEur` | number | denormalised from program; allows admin override per session |
| `status` | `"scheduled"` \| `"cancelled"` \| `"completed"` | |
| `notes` | string \| null | internal admin notes (not shown publicly) |
| `createdAt` | Timestamp | |
| `createdBy` | string | admin uid |

### `bookings` collection (Phase 3 onwards, listed here for ref)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Firestore auto-id |
| `sessionId` | string | FK to sessions doc |
| `programSlug` | string | denormalised for queries |
| `type` | `"individual"` \| `"business"` | |
| `contact.name` | string | |
| `contact.email` | string | |
| `contact.phone` | string | |
| `contact.company` | string \| null | |
| `participantCount` | number | |
| `message` | string \| null | |
| `status` | `"pending"` \| `"confirmed"` \| `"paid"` \| `"cancelled"` | |
| `paymentRef` | string \| null | Viva order id |
| `totalEur` | number | participantCount × session.priceEur, snapshot at booking time |
| `createdAt` | Timestamp | |

Firestore security rules (set in Phase 1, refined later):
- `sessions`: public read for `status == "scheduled"`, admin-only write
- `bookings`: admin read/write, public create-only with field validation
- everything else: deny

---

## File Structure (Phase 1)

| File | Status | Responsibility |
|---|---|---|
| `web/astro.config.mjs` | **Modify** | Add `@astrojs/vercel` adapter, `output: "server"`. |
| `web/package.json` | **Modify** | Add deps: `@astrojs/vercel`, `firebase`, `firebase-admin`. |
| `web/src/lib/firebase/client.ts` | **Create** | Lazy init of client Firebase app + auth instance. |
| `web/src/lib/firebase/admin.ts` | **Create** | Lazy init of `firebase-admin` (uses service-account env vars), exports `auth`, `firestore`. |
| `web/src/lib/firebase/session.ts` | **Create** | Helpers: `createSessionCookie(idToken)`, `verifySessionCookie(cookie)`. Wrap admin SDK. |
| `web/src/middleware.ts` | **Create** | Astro middleware. Protects `/admin/*` (except `/admin/login`). Redirects to login if no valid session cookie. Stamps `Astro.locals.admin = { uid, email }` on success. |
| `web/src/env.d.ts` | **Modify** | Type the `import.meta.env` keys + `App.Locals.admin`. |
| `web/src/pages/admin/login.astro` | **Create** | Client-side form using Firebase Auth → POST id token to `/api/admin/session` → redirect to `/admin/`. |
| `web/src/pages/admin/index.astro` | **Create** | Placeholder dashboard ("Welcome, {email}. Logout"). Server-rendered using `Astro.locals.admin`. |
| `web/src/pages/api/admin/session.ts` | **Create** | POST: exchange Firebase ID token → session cookie. DELETE: clear session cookie. |
| `web/src/components/admin/AdminLayout.astro` | **Create** | Sidebar (links: Πίνακας / Ημερομηνίες / Κρατήσεις / Πληρωμές) + logout button + main slot. |
| `web/.env.example` | **Create** | Document all env vars (no secrets). |
| `web/scripts/seed-admin.mjs` | **Create** | One-off script: `node scripts/seed-admin.mjs <email> <password>` — creates the first admin user via admin SDK. |
| `firestore.rules` | **Create** | Security rules at repo root (Firebase deploy target). |
| `firebase.json` | **Create** | Minimal config so `firebase deploy --only firestore:rules` works locally. |
| `.gitignore` | **Modify** | Ignore `web/.env`, `firebase-debug.log`. |
| `web/CLAUDE.md` | **Modify** | Document the admin login flow + how to run the seed script. |

No tests in Phase 1 — Astro static-content sites in this repo have no test runner. Verification is manual + `astro check` + a real login attempt against the deployed Firebase project. Subsequent phases (especially payments) will introduce a test runner; that's its own task in Phase 5.

---

## Task 1: Confirm decisions with the user, set up Firebase project

**Files:** none (read-only / external)

- [ ] **Step 1: Wait for the 9 decisions to be answered**

Read the "Pre-flight: 9 decisions" table above. Do not proceed until every row is confirmed (`Yes`, the default value, or an override). Edit this file in place to record the user's choices in the `Default` column, prefixing changed rows with `**[USER:]**`.

- [ ] **Step 2: User creates Firebase project (you guide them, you don't do this)**

Send the user this checklist exactly:

```
1. Go to https://console.firebase.google.com → Add project → name it whatever
   you put in Decision #4 (default: first-aid-academy).
2. Disable Google Analytics for this project (we don't need it).
3. After creation: Build → Authentication → Get started → Email/Password →
   Enable. Save.
4. Build → Firestore Database → Create database → Production mode →
   Region matching Decision #4 (default: europe-west3). Click Done.
5. Project settings (gear icon) → General → Your apps → Web app (</> icon).
   Nickname "first-aid-web". Don't enable Firebase Hosting. Register app.
6. Copy the firebaseConfig object that appears. Paste it here in chat —
   we'll use those values to populate web/.env.
7. Project settings → Service accounts → Generate new private key. Download
   the JSON. Send it to me securely (or paste contents here — it'll be moved
   to env vars, never committed).
```

The implementer pauses here and asks the user to perform these steps.

- [ ] **Step 3: Receive Firebase config + service account JSON from user; record env vars**

Once the user has pasted the firebaseConfig object and service account JSON, write `web/.env` with these keys (values from user):

```bash
# Public — bundled into client JS
PUBLIC_FIREBASE_API_KEY="..."
PUBLIC_FIREBASE_AUTH_DOMAIN="..."
PUBLIC_FIREBASE_PROJECT_ID="..."
PUBLIC_FIREBASE_APP_ID="..."

# Server only — never bundled
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="...@...gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Do not commit `web/.env`. It is already covered by the existing `.gitignore` (`/tmp-extract/`, `*.log`) — but verify the file `.env` is ignored before continuing. If not, append to `.gitignore`.

- [ ] **Step 4: Commit `.env.example` (Step done in Task 4)**

(The actual `.env.example` is created in Task 4; this step is a placeholder reminder for the implementer.)

---

## Task 2: Add Vercel SSR adapter to Astro

**Files:**
- Modify: `web/astro.config.mjs`
- Modify: `web/package.json`

- [ ] **Step 1: Install the Vercel adapter**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
npm install @astrojs/vercel
```

- [ ] **Step 2: Update `astro.config.mjs` to use SSR**

Read the current config first (`web/astro.config.mjs`), then add the adapter. The existing config uses Tailwind + MDX integrations and is static. Modified version:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://first-aid-courses.vercel.app',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  integrations: [tailwind({ applyBaseStyles: false }), mdx(), sitemap()],
  prefetch: true,
});
```

If `web/astro.config.mjs` already differs from this in non-trivial ways, only change `output` and add `adapter` — leave the rest alone.

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```
Expected: completes, prints "[build] N page(s) built", no errors. Routes that were previously static now build as SSR functions. Static pages (e.g. `/`, `/seminaria/cofat/`) remain prerendered automatically because they have no dynamic data.

- [ ] **Step 4: Commit**

```bash
git add web/astro.config.mjs web/package.json web/package-lock.json
git commit -m "feat(infra): switch Astro to SSR via Vercel adapter"
```

---

## Task 3: Install Firebase SDKs

**Files:**
- Modify: `web/package.json`

- [ ] **Step 1: Install client + admin SDKs**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
npm install firebase firebase-admin
```

- [ ] **Step 2: Verify install + types resolve**

```bash
npx astro check 2>&1 | tail -3
```
Expected: same 4 pre-existing errors in `HeroSplit.astro` only.

- [ ] **Step 3: Commit**

```bash
git add web/package.json web/package-lock.json
git commit -m "feat(infra): add firebase + firebase-admin dependencies"
```

---

## Task 4: `.env.example` + env types

**Files:**
- Create: `web/.env.example`
- Modify: `web/src/env.d.ts`

- [ ] **Step 1: Create `web/.env.example`**

```bash
# Public — bundled into client JS (PUBLIC_ prefix is required by Astro)
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_APP_ID=

# Server only — Firebase Admin SDK service account
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

- [ ] **Step 2: Type the env vars in `web/src/env.d.ts`**

Read the file first. Then replace its content with:

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_PRIVATE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    admin?: { uid: string; email: string };
  }
}
```

- [ ] **Step 3: Verify type check passes**

```bash
npx astro check 2>&1 | grep -E "env\.d\.ts" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 4: Commit**

```bash
git add web/.env.example web/src/env.d.ts
git commit -m "feat(infra): document admin env vars + type App.Locals.admin"
```

---

## Task 5: Firebase client + admin helpers

**Files:**
- Create: `web/src/lib/firebase/client.ts`
- Create: `web/src/lib/firebase/admin.ts`
- Create: `web/src/lib/firebase/session.ts`

- [ ] **Step 1: Client SDK init**

`web/src/lib/firebase/client.ts`:

```typescript
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getClientApp(): FirebaseApp {
  if (app) return app;
  app = getApps()[0] ?? initializeApp({
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  });
  return app;
}

export function getClientAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getClientApp());
  return auth;
}
```

- [ ] **Step 2: Admin SDK init**

`web/src/lib/firebase/admin.ts`:

```typescript
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_PROJECT_ID,
      clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
      privateKey: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  return app;
}

export function adminAuth(): Auth { return getAuth(getAdminApp()); }
export function adminDb(): Firestore { return getFirestore(getAdminApp()); }
```

- [ ] **Step 3: Session cookie helpers**

`web/src/lib/firebase/session.ts`:

```typescript
import { adminAuth } from './admin';

const COOKIE_NAME = 'admin_session';
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export async function createSessionCookie(idToken: string): Promise<{ value: string; maxAge: number }> {
  const value = await adminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
  return { value, maxAge: FIVE_DAYS_MS / 1000 };
}

export async function verifySessionCookie(cookie: string | undefined): Promise<{ uid: string; email: string } | null> {
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    return { uid: decoded.uid, email: decoded.email ?? '' };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
```

- [ ] **Step 4: Type-check**

```bash
npx astro check 2>&1 | grep -E "lib/firebase" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/firebase/
git commit -m "feat(admin): firebase client + admin + session helpers"
```

---

## Task 6: Astro middleware to protect `/admin/*`

**Files:**
- Create: `web/src/middleware.ts`

- [ ] **Step 1: Write the middleware**

```typescript
import { defineMiddleware } from 'astro:middleware';
import { verifySessionCookie, SESSION_COOKIE_NAME } from './lib/firebase/session';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return next();
  }

  // public routes inside the admin namespace
  if (pathname === '/admin/login' || pathname === '/api/admin/session') {
    return next();
  }

  const cookie = ctx.cookies.get(SESSION_COOKIE_NAME)?.value;
  const admin = await verifySessionCookie(cookie);

  if (!admin) {
    return ctx.redirect('/admin/login', 302);
  }

  ctx.locals.admin = admin;
  return next();
});
```

- [ ] **Step 2: Type-check**

```bash
npx astro check 2>&1 | grep -E "middleware" || echo "no errors"
```
Expected: "no errors".

- [ ] **Step 3: Commit**

```bash
git add web/src/middleware.ts
git commit -m "feat(admin): middleware redirects /admin/* to /admin/login when no session"
```

---

## Task 7: Session API endpoint

**Files:**
- Create: `web/src/pages/api/admin/session.ts`

- [ ] **Step 1: Write the endpoint**

```typescript
import type { APIRoute } from 'astro';
import { createSessionCookie, SESSION_COOKIE_NAME } from '../../../lib/firebase/session';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null) as { idToken?: string } | null;
  if (!body?.idToken) {
    return new Response(JSON.stringify({ error: 'idToken required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  try {
    const { value, maxAge } = await createSessionCookie(body.idToken);
    cookies.set(SESSION_COOKIE_NAME, value, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'invalid token' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
```

- [ ] **Step 2: Type-check + build**

```bash
npx astro check 2>&1 | grep -E "api/admin" || echo "no errors"
npm run build 2>&1 | tail -5
```
Expected: "no errors" + successful build.

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/api/admin/session.ts
git commit -m "feat(admin): /api/admin/session POST creates cookie, DELETE clears it"
```

---

## Task 8: Login page

**Files:**
- Create: `web/src/pages/admin/login.astro`

- [ ] **Step 1: Write the login page**

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import Button from '../../components/ui/Button.astro';
---
<PageLayout title="Σύνδεση Διαχειριστή" description="Είσοδος στον πίνακα διαχείρισης First Aid Academy.">
  <section class="bg-surface-soft min-h-[80vh] flex items-center">
    <div class="container-x max-w-md mx-auto py-20">
      <p class="text-sm font-semibold uppercase tracking-wider text-cyan-700">Διαχειριστής</p>
      <h1 class="mt-3 font-display font-bold text-crimson text-3xl md:text-4xl">Σύνδεση</h1>

      <form id="admin-login-form" class="mt-10 bg-white rounded-2xl border border-hairline p-6 md:p-8 space-y-5 shadow-tile">
        <div>
          <label for="admin-email" class="block text-sm font-semibold text-ink-edge">Email</label>
          <input id="admin-email" name="email" type="email" required autocomplete="email" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
        </div>
        <div>
          <label for="admin-password" class="block text-sm font-semibold text-ink-edge">Κωδικός</label>
          <input id="admin-password" name="password" type="password" required autocomplete="current-password" class="mt-2 w-full rounded-md border border-hairline bg-white px-4 py-3 text-ink focus:border-crimson focus:ring-2 focus:ring-crimson/20"/>
        </div>
        <p id="admin-login-error" class="hidden text-sm text-crimson font-semibold" role="alert"></p>
        <Button type="submit" variant="primary" size="lg" className="w-full">Σύνδεση</Button>
      </form>
    </div>
  </section>

  <script>
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { getClientAuth } from '../../lib/firebase/client';

    const form = document.getElementById('admin-login-form') as HTMLFormElement | null;
    const errEl = document.getElementById('admin-login-error');
    if (form && errEl) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errEl.classList.add('hidden');
        const fd = new FormData(form);
        const email = String(fd.get('email') ?? '');
        const password = String(fd.get('password') ?? '');
        try {
          const cred = await signInWithEmailAndPassword(getClientAuth(), email, password);
          const idToken = await cred.user.getIdToken();
          const res = await fetch('/api/admin/session', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          if (!res.ok) throw new Error('session');
          window.location.href = '/admin/';
        } catch {
          errEl.textContent = 'Λάθος email ή κωδικός. Δοκιμάστε ξανά.';
          errEl.classList.remove('hidden');
        }
      });
    }
  </script>
</PageLayout>
```

- [ ] **Step 2: Build + dev sanity**

```bash
npm run build 2>&1 | tail -5
```
Expected: builds successfully; `/admin/login` is now a server-rendered route.

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/admin/login.astro
git commit -m "feat(admin): /admin/login page using Firebase Auth"
```

---

## Task 9: Admin layout + dashboard placeholder

**Files:**
- Create: `web/src/components/admin/AdminLayout.astro`
- Create: `web/src/pages/admin/index.astro`

- [ ] **Step 1: AdminLayout component**

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
interface Props { title: string; }
const { title } = Astro.props;
const admin = Astro.locals.admin!;
const path = Astro.url.pathname;
const navItems = [
  { href: '/admin/',          label: 'Πίνακας' },
  { href: '/admin/sessions/', label: 'Ημερομηνίες' },
  { href: '/admin/bookings/', label: 'Κρατήσεις' },
  { href: '/admin/payments/', label: 'Πληρωμές' },
];
---
<PageLayout title={`${title} — Διαχείριση`} description="Πίνακας διαχείρισης First Aid Academy.">
  <div class="bg-surface-soft min-h-screen">
    <div class="container-x grid lg:grid-cols-12 gap-8 py-10">
      <aside class="lg:col-span-3">
        <div class="lg:sticky lg:top-28 bg-white rounded-2xl border border-hairline shadow-tile p-5">
          <p class="text-xs font-semibold uppercase tracking-wider text-cyan-700">Συνδεδεμένος ως</p>
          <p class="mt-1 text-ink-strong font-semibold text-sm break-all">{admin.email}</p>
          <nav class="mt-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a href={item.href} class={`px-3 py-2 rounded text-sm font-semibold no-underline transition-out ${path === item.href || (item.href !== '/admin/' && path.startsWith(item.href)) ? 'bg-surface-crimson text-crimson' : 'text-ink-edge hover:bg-surface-soft'}`}>{item.label}</a>
            ))}
          </nav>
          <button id="admin-logout" type="button" class="mt-6 w-full rounded-md bg-ink-strong/5 hover:bg-ink-strong/10 text-ink-edge font-semibold text-sm py-2 transition-out">Αποσύνδεση</button>
        </div>
      </aside>
      <div class="lg:col-span-9">
        <slot />
      </div>
    </div>
  </div>
  <script>
    document.getElementById('admin-logout')?.addEventListener('click', async () => {
      await fetch('/api/admin/session', { method: 'DELETE' });
      window.location.href = '/admin/login';
    });
  </script>
</PageLayout>
```

- [ ] **Step 2: Dashboard index page**

`web/src/pages/admin/index.astro`:

```astro
---
import AdminLayout from '../../components/admin/AdminLayout.astro';
const admin = Astro.locals.admin!;
---
<AdminLayout title="Πίνακας">
  <div class="bg-white rounded-2xl border border-hairline shadow-tile p-8">
    <h1 class="font-display font-bold text-crimson text-3xl">Καλώς ήρθατε</h1>
    <p class="mt-3 text-ink-muted">Συνδεθήκατε ως <strong class="text-ink-strong">{admin.email}</strong>.</p>
    <p class="mt-6 text-ink-muted leading-relaxed">
      Από τον πίνακα μπορείτε να διαχειριστείτε τις διαθέσιμες ημερομηνίες σεμιναρίων, να δείτε τις
      κρατήσεις και τις πληρωμές. Επιλέξτε μια ενότητα από το αριστερό μενού.
    </p>
  </div>
</AdminLayout>
```

- [ ] **Step 3: Build + sanity**

```bash
npm run build 2>&1 | tail -5
```
Expected: builds; `/admin/` is server-rendered and protected.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/admin/ web/src/pages/admin/index.astro
git commit -m "feat(admin): /admin/ dashboard placeholder + sidebar layout + logout"
```

---

## Task 10: Firestore security rules

**Files:**
- Create: `firestore.rules`
- Create: `firebase.json`

- [ ] **Step 1: Write `firestore.rules` at the repo root (not inside web/)**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Sessions: public can read scheduled sessions, admin can write
    match /sessions/{sessionId} {
      allow read: if resource.data.status == 'scheduled';
      allow write: if request.auth != null;
    }

    // Bookings: admin only for now (Phase 3 will open create to public with field validation)
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

The `request.auth != null` rule is a Phase-1 placeholder — it allows ANY signed-in Firebase user to write. Phase 1 only has admin users, so this is acceptable. Phase 3 tightens this to allowlisted UIDs / claims.

- [ ] **Step 2: Write `firebase.json` at the repo root**

```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

- [ ] **Step 3: Document the deploy command**

The implementer is not expected to deploy rules from this machine. Instead, instruct the user to run, after installing the Firebase CLI:

```bash
cd /Users/marios/Desktop/Cursor/first-aid
npx firebase login
npx firebase use <project-id-from-Decision-4>
npx firebase deploy --only firestore:rules
```

Add this paragraph to `web/CLAUDE.md` (Task 12).

- [ ] **Step 4: Commit**

```bash
git add firestore.rules firebase.json
git commit -m "feat(infra): firestore security rules — public read scheduled sessions, auth-only writes"
```

---

## Task 11: Seed-admin script

**Files:**
- Create: `web/scripts/seed-admin.mjs`

- [ ] **Step 1: Write the script**

```javascript
import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password>');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

try {
  const user = await getAuth().createUser({ email, password, emailVerified: true });
  console.log(`Created admin user ${user.email} (uid: ${user.uid})`);
} catch (err) {
  if (err.code === 'auth/email-already-exists') {
    console.log(`User ${email} already exists. Updating password.`);
    const existing = await getAuth().getUserByEmail(email);
    await getAuth().updateUser(existing.uid, { password });
    console.log(`Updated password for ${email} (uid: ${existing.uid}).`);
  } else {
    throw err;
  }
}
```

- [ ] **Step 2: Add `dotenv` as a dev dep so the script can load `.env`**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
npm install --save-dev dotenv
```

- [ ] **Step 3: Run the script with the user's chosen admin credentials**

The user runs (NOT the implementer — credentials are sensitive):

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
node scripts/seed-admin.mjs info@firstaidacademy.gr <strong-password>
```

Expected output: `Created admin user info@firstaidacademy.gr (uid: abc123...)`.

- [ ] **Step 4: Commit**

```bash
git add web/scripts/seed-admin.mjs web/package.json web/package-lock.json
git commit -m "feat(admin): seed-admin.mjs script for one-off admin user creation"
```

---

## Task 12: Document the flow

**Files:**
- Modify: `web/CLAUDE.md` (or create if absent)

- [ ] **Step 1: Read existing `web/CLAUDE.md`**

If it exists, append. If not, create with at least the admin section below.

- [ ] **Step 2: Append the admin section**

```markdown
## Admin Dashboard

The admin lives at `/admin/`. Access requires a Firebase Auth account that exists in the
Firebase project configured by `FIREBASE_PROJECT_ID` (see `.env.example`).

### One-time setup (per environment)

1. Populate `.env` (see `.env.example`).
2. Create the first admin user:
   ```bash
   node scripts/seed-admin.mjs <email> <password>
   ```
3. Deploy Firestore rules from the repo root:
   ```bash
   npx firebase deploy --only firestore:rules
   ```

### Login flow

Client signs in via Firebase Auth (`signInWithEmailAndPassword`). The browser POSTs the
ID token to `/api/admin/session`, which exchanges it for a session cookie via the Firebase
Admin SDK and sets it httpOnly. Astro middleware (`web/src/middleware.ts`) verifies the
cookie on every `/admin/*` request and redirects to `/admin/login` if invalid.

### Vercel env vars

Mirror `web/.env` in the Vercel dashboard (Settings → Environment Variables). The
`FIREBASE_PRIVATE_KEY` value must keep its `\n` escapes; the `.replace(/\\n/g, '\n')` in
`web/src/lib/firebase/admin.ts` decodes them at runtime.
```

- [ ] **Step 3: Commit**

```bash
git add web/CLAUDE.md
git commit -m "docs(admin): document phase-1 admin login flow + seed script"
```

---

## Task 13: Final verification

**Files:** none

- [ ] **Step 1: Type-check + build**

```bash
cd /Users/marios/Desktop/Cursor/first-aid/web
npx astro check 2>&1 | tail -10
npm run build 2>&1 | tail -5
```
Expected: same 4 pre-existing `HeroSplit.astro` errors, no new errors. Successful build.

- [ ] **Step 2: Local dev test (manual, with the user)**

Walk the user through:
1. Run `npm run dev` from `web/`.
2. Visit `http://localhost:4321/admin/` → should redirect to `/admin/login`.
3. Log in with the seeded credentials.
4. Should land on `/admin/` showing "Καλώς ήρθατε" + email.
5. Click sidebar link "Ημερομηνίες" → 404 (expected — Phase 2 work).
6. Click "Αποσύνδεση" → redirects to `/admin/login`. Cookie cleared.
7. Try `/admin/` again → redirects to login.

If any step fails, fix and re-test before pushing.

- [ ] **Step 3: Push**

```bash
git push origin main
```

- [ ] **Step 4: Set Vercel env vars**

The user must mirror every key in `web/.env` to Vercel's Environment Variables UI (Production scope), then trigger a redeploy from the Vercel dashboard.

- [ ] **Step 5: Smoke test on production**

Visit `https://first-aid-courses.vercel.app/admin/` — should redirect to login. Log in with seeded credentials. Should land on the dashboard.

---

## Phases 2–5 (one-paragraph summaries; full plans written later)

### Phase 2 — Sessions CRUD

`/admin/sessions/` lists existing sessions grouped by program with date/time/capacity/status. `/admin/sessions/new` is a form (program select, datetime picker, capacity, location, price override). `/admin/sessions/[id]` is the edit/delete view. All operations go through API routes under `/api/admin/sessions/` that use the admin SDK to write Firestore. Public-side: `/seminaria/<slug>/` and `/kratisi/` start reading sessions from Firestore at request time (SSR) so newly added dates appear immediately.

### Phase 3 — Public Booking Rewrite

`/kratisi/` becomes SSR. The program dropdown stays the same; once a program is selected (URL param or change event), a second select shows the next 6 available sessions (Firestore query: `programSlug == X && status == "scheduled" && startsAt > now`). Submission posts to `/api/bookings` which creates a `bookings` doc with `status: "pending"`, sends a confirmation email (Phase 4 hook), and redirects to `/kratisi/success/`. Old Netlify-Forms attributes deleted. Firestore rules tighten: public can `create` bookings only, with field-level validation (no setting `status` to `paid` from client).

### Phase 4 — Bookings Dashboard + Email

`/admin/bookings/` lists bookings with filters (status, program, date range). Detail view at `/admin/bookings/[id]` shows the full submission and lets admin change status (pending → confirmed → paid → cancelled) via `/api/admin/bookings/[id]/status`. Resend integration: on every new booking (Firestore trigger via Astro API route invoked from Phase 3 submit), email goes to admin with the booking summary. Optional: also email the customer a confirmation.

### Phase 5 — Viva Wallet Payment Integration

After a booking is created, the customer sees a "Πληρώστε τώρα" button on `/kratisi/success/?id=<bookingId>`. Clicking it hits `/api/payments/viva/create-order` which calls Viva's order-creation endpoint (server-side, with merchant credentials in env), gets back a checkout URL, and redirects. After payment, Viva calls `/api/payments/viva/webhook` with the transaction ID; the handler verifies the signature, looks up the booking by `paymentRef`, sets `status: "paid"`. `/admin/payments/` joins payments with bookings for a financial overview. Refunds: out of scope for Phase 5; admin handles via Viva's portal manually.

---

## Self-Review Notes

**Spec coverage:**
- "Add dates" → Phase 2 covers CRUD UI, Phase 3 surfaces them publicly. ✓
- "See requests" → Phase 4 builds `/admin/bookings/`. ✓
- "See payments" → Phase 5 builds `/admin/payments/`. ✓
- "Use Viva" → Phase 5. ✓
- "Use Firebase for db" → Phase 1 sets up Firestore + Auth, Phase 2 onwards stores data there. ✓
- "No image storage" → no Firebase Storage used anywhere; images stay in `web/src/assets/`. ✓

**Placeholder scan:** Two intentional "user must do this" steps (Tasks 1 + 11) are not implementation placeholders — they're the parts only the user can perform (Firebase console clicks; running a credential-bearing script). Everything else has concrete code.

**Type consistency:**
- `SESSION_COOKIE_NAME` used in Tasks 6 + 7. ✓
- `Astro.locals.admin` typed in Task 4, used in Tasks 6 + 9. ✓
- `getClientAuth()` returns `Auth`, used in Task 8 login form. ✓
- `adminAuth()` / `adminDb()` are the only entry points to admin SDK, used in Task 5 helpers. ✓
- Firestore field names in the data model match what Phases 2–5 will use (no rename hazards).

**Open risks:**
- The Decisions table at the top is load-bearing; do not skip Task 1.
- Vercel free tier limits serverless invocation count. With low traffic this site stays well under quota; if traffic grows, monitor Vercel usage.
- Firebase free tier (Spark) supports everything in Phases 1–4. Phase 5 (Viva webhook signature verification) may need crypto operations available on Spark — confirm before Phase 5 detailed plan.
