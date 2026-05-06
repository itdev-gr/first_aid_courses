import { adminDb } from './admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export type SessionStatus = 'scheduled' | 'cancelled' | 'completed';

export interface SessionDoc {
  id: string;
  programSlug: string;
  startsAt: Date;
  durationHours: number;
  capacity: number | null;
  location: string;
  priceEur: number;
  status: SessionStatus;
  notes: string | null;
  createdAt: Date;
  createdBy: string;
}

export interface SessionInput {
  programSlug: string;
  startsAt: Date;
  durationHours: number;
  capacity: number | null;
  location: string;
  priceEur: number;
  status: SessionStatus;
  notes: string | null;
}

const COLLECTION = 'sessions';

function fromDoc(snap: QueryDocumentSnapshot): SessionDoc {
  const data = snap.data();
  return {
    id: snap.id,
    programSlug: data.programSlug,
    startsAt: data.startsAt.toDate(),
    durationHours: data.durationHours,
    capacity: data.capacity ?? null,
    location: data.location,
    priceEur: data.priceEur,
    status: data.status,
    notes: data.notes ?? null,
    createdAt: data.createdAt.toDate(),
    createdBy: data.createdBy,
  };
}

export async function listSessions(): Promise<SessionDoc[]> {
  const snap = await adminDb().collection(COLLECTION).orderBy('startsAt', 'asc').get();
  return snap.docs.map((d) => fromDoc(d as QueryDocumentSnapshot));
}

/**
 * Public-facing query: scheduled sessions for a program in the future, oldest first, capped.
 * Used by the public booking form `/kratisi/`.
 */
export async function listAvailableForProgram(programSlug: string, limit = 12): Promise<SessionDoc[]> {
  const snap = await adminDb()
    .collection(COLLECTION)
    .where('programSlug', '==', programSlug)
    .where('status', '==', 'scheduled')
    .where('startsAt', '>', Timestamp.fromDate(new Date()))
    .orderBy('startsAt', 'asc')
    .limit(limit)
    .get();
  return snap.docs.map((d) => fromDoc(d as QueryDocumentSnapshot));
}

export async function getSession(id: string): Promise<SessionDoc | null> {
  const snap = await adminDb().collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return fromDoc(snap as QueryDocumentSnapshot);
}

export async function createSession(input: SessionInput, adminUid: string): Promise<string> {
  const ref = await adminDb().collection(COLLECTION).add({
    programSlug: input.programSlug,
    startsAt: Timestamp.fromDate(input.startsAt),
    durationHours: input.durationHours,
    capacity: input.capacity,
    location: input.location,
    priceEur: input.priceEur,
    status: input.status,
    notes: input.notes,
    createdAt: Timestamp.now(),
    createdBy: adminUid,
  });
  return ref.id;
}

export async function updateSession(id: string, input: Partial<SessionInput>): Promise<void> {
  const update: Record<string, unknown> = { ...input };
  if (input.startsAt instanceof Date) {
    update.startsAt = Timestamp.fromDate(input.startsAt);
  }
  await adminDb().collection(COLLECTION).doc(id).update(update);
}

export async function deleteSession(id: string): Promise<void> {
  await adminDb().collection(COLLECTION).doc(id).delete();
}

/**
 * Parse a 'YYYY-MM-DDTHH:MM' string as Europe/Athens local time and return the equivalent UTC Date.
 * Needed because `new Date("YYYY-MM-DDTHH:MM")` uses the server's local TZ (UTC on Vercel),
 * which would shift every session 2–3h off intent.
 */
export function parseAthensLocal(input: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(input);
  if (!m) return new Date(NaN);
  const [, ys, mos, ds, hs, mis] = m;
  const utcGuessMs = Date.UTC(Number(ys), Number(mos) - 1, Number(ds), Number(hs), Number(mis));
  // What does Athens think the time is at utcGuessMs?
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Athens',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: false,
  });
  const parts = fmt.formatToParts(new Date(utcGuessMs));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  let h = g('hour');
  if (h === 24) h = 0; // Intl quirk for midnight
  const athensAsUtcMs = Date.UTC(g('year'), g('month') - 1, g('day'), h, g('minute'));
  const offsetMs = athensAsUtcMs - utcGuessMs; // how far Athens is ahead of UTC at that moment
  return new Date(utcGuessMs - offsetMs);
}

/** Format a Date as 'YYYY-MM-DDTHH:MM' in Europe/Athens for <input type="datetime-local">. */
export function toAthensInputValue(date: Date): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/** Format a Date for display in Greek (Athens time). */
export function formatAthensDisplay(date: Date): string {
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: 'Europe/Athens',
    weekday: 'short',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date);
}
