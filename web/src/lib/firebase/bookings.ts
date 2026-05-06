import { adminDb } from './admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'expired';
export type BookingType = 'individual' | 'business';

export interface BookingContact {
  name: string;
  email: string;
  phone: string;
  company: string | null;
}

export interface BookingDoc {
  id: string;
  sessionId: string;
  programSlug: string;
  type: BookingType;
  contact: BookingContact;
  participantCount: number;
  message: string | null;
  status: BookingStatus;
  paymentRef: string | null;
  totalEur: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface BookingInput {
  sessionId: string;
  programSlug: string;
  type: BookingType;
  contact: BookingContact;
  participantCount: number;
  message: string | null;
}

const COLLECTION = 'bookings';
const PENDING_TTL_MS = 15 * 60 * 1000;
const ACTIVE_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'paid'];

function fromDoc(snap: QueryDocumentSnapshot): BookingDoc {
  const d = snap.data();
  return {
    id: snap.id,
    sessionId: d.sessionId,
    programSlug: d.programSlug,
    type: d.type,
    contact: d.contact,
    participantCount: d.participantCount,
    message: d.message ?? null,
    status: d.status,
    paymentRef: d.paymentRef ?? null,
    totalEur: d.totalEur,
    expiresAt: d.expiresAt.toDate(),
    createdAt: d.createdAt.toDate(),
  };
}

export class BookingError extends Error {
  constructor(public code: 'session-not-found' | 'session-not-available' | 'session-past' | 'program-mismatch' | 'sold-out' | 'invalid-input', message: string) {
    super(message);
    this.name = 'BookingError';
  }
}

/**
 * Create a booking with status='pending' and 15-minute expiresAt.
 * Validates session existence, status, capacity (if set).
 * Returns the booking summary needed for the success page + payment redirect.
 */
export async function createBooking(input: BookingInput): Promise<{
  id: string;
  totalEur: number;
  sessionStartsAt: Date;
}> {
  const db = adminDb();
  const now = new Date();

  const sessionRef = db.collection('sessions').doc(input.sessionId);
  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) throw new BookingError('session-not-found', 'Session not found');
  const session = sessionSnap.data()!;

  if (session.status !== 'scheduled') throw new BookingError('session-not-available', 'Session is not available');
  const startsAt: Date = session.startsAt.toDate();
  if (startsAt.getTime() <= now.getTime()) throw new BookingError('session-past', 'Session is in the past');
  if (session.programSlug !== input.programSlug) throw new BookingError('program-mismatch', 'Program does not match session');

  // Capacity check (if capacity is set)
  if (session.capacity != null) {
    const existing = await db.collection(COLLECTION)
      .where('sessionId', '==', input.sessionId)
      .where('status', 'in', ACTIVE_STATUSES)
      .get();
    const taken = existing.docs.reduce((sum, d) => sum + (d.data().participantCount ?? 0), 0);
    if (taken + input.participantCount > session.capacity) {
      throw new BookingError('sold-out', 'Not enough seats remaining');
    }
  }

  const totalEur = (session.priceEur ?? 0) * input.participantCount;
  const expiresAt = new Date(now.getTime() + PENDING_TTL_MS);

  const ref = await db.collection(COLLECTION).add({
    sessionId: input.sessionId,
    programSlug: input.programSlug,
    type: input.type,
    contact: input.contact,
    participantCount: input.participantCount,
    message: input.message,
    status: 'pending' as BookingStatus,
    paymentRef: null,
    totalEur,
    expiresAt: Timestamp.fromDate(expiresAt),
    createdAt: Timestamp.now(),
  });

  return { id: ref.id, totalEur, sessionStartsAt: startsAt };
}

export async function getBooking(id: string): Promise<BookingDoc | null> {
  const snap = await adminDb().collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return fromDoc(snap as QueryDocumentSnapshot);
}

export async function listBookings(): Promise<BookingDoc[]> {
  const snap = await adminDb().collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => fromDoc(d as QueryDocumentSnapshot));
}
