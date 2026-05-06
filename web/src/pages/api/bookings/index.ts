import type { APIRoute } from 'astro';
import { createBooking, BookingError, type BookingType } from '../../../lib/firebase/bookings';

const TYPES: BookingType[] = ['individual', 'business'];

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return new Response(JSON.stringify({ error: 'bad request' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  // Honeypot: if filled, silently accept (no creation)
  if (typeof body.botField === 'string' && body.botField.trim() !== '') {
    return new Response(JSON.stringify({ id: 'honeypot', ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const sessionId = String(body.sessionId ?? '').trim();
  const programSlug = String(body.programSlug ?? '').trim();
  const type = String(body.type ?? '') as BookingType;
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const company = body.company ? String(body.company).trim() || null : null;
  const participantCount = Number(body.participantCount);
  const message = body.message ? String(body.message).trim() || null : null;
  const consent = Boolean(body.consent);

  if (!consent) {
    return new Response(JSON.stringify({ error: 'consent required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  if (!sessionId || !programSlug || !TYPES.includes(type) || !name || !isEmail(email) || !phone) {
    return new Response(JSON.stringify({ error: 'missing or invalid fields' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  if (!Number.isFinite(participantCount) || participantCount < 1 || participantCount > 200) {
    return new Response(JSON.stringify({ error: 'invalid participantCount' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  try {
    const result = await createBooking({
      sessionId,
      programSlug,
      type,
      contact: { name, email, phone, company },
      participantCount,
      message,
    });
    return new Response(JSON.stringify({ id: result.id, totalEur: result.totalEur, sessionStartsAt: result.sessionStartsAt.toISOString() }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    if (err instanceof BookingError) {
      const status = err.code === 'sold-out' ? 409 : err.code === 'session-not-found' ? 404 : 400;
      return new Response(JSON.stringify({ error: err.code }), {
        status,
        headers: { 'content-type': 'application/json' },
      });
    }
    console.error('booking create error', err);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
