import type { APIRoute } from 'astro';
import { createSession, parseAthensLocal, type SessionStatus } from '../../../../lib/firebase/sessions';

const STATUSES: SessionStatus[] = ['scheduled', 'cancelled', 'completed'];

export const POST: APIRoute = async ({ request, locals }) => {
  const admin = locals.admin;
  if (!admin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });

  const programSlug = String(body.programSlug ?? '').trim();
  const startsAtStr = String(body.startsAt ?? '');
  const durationHours = Number(body.durationHours);
  const capacityRaw = body.capacity;
  const capacity = capacityRaw === null || capacityRaw === '' || capacityRaw === undefined ? null : Number(capacityRaw);
  const location = String(body.location ?? '').trim();
  const priceEur = Number(body.priceEur);
  const status = String(body.status ?? '') as SessionStatus;
  const notes = body.notes ? String(body.notes).trim() || null : null;

  if (!programSlug || !startsAtStr || !location || !STATUSES.includes(status) || !Number.isFinite(durationHours) || !Number.isFinite(priceEur)) {
    return new Response(JSON.stringify({ error: 'missing or invalid fields' }), { status: 400 });
  }
  if (capacity !== null && (!Number.isFinite(capacity) || capacity < 1)) {
    return new Response(JSON.stringify({ error: 'capacity must be a positive integer or empty' }), { status: 400 });
  }

  const startsAt = parseAthensLocal(startsAtStr);
  if (Number.isNaN(startsAt.getTime())) {
    return new Response(JSON.stringify({ error: 'invalid date' }), { status: 400 });
  }

  const id = await createSession({
    programSlug, startsAt, durationHours, capacity, location, priceEur, status, notes,
  }, admin.uid);

  return new Response(JSON.stringify({ id }), { status: 201, headers: { 'content-type': 'application/json' } });
};
