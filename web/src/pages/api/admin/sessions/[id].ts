import type { APIRoute } from 'astro';
import { updateSession, deleteSession, parseAthensLocal, type SessionStatus } from '../../../../lib/firebase/sessions';

const STATUSES: SessionStatus[] = ['scheduled', 'cancelled', 'completed'];

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!locals.admin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.programSlug === 'string') update.programSlug = body.programSlug.trim();
  if (typeof body.location === 'string') update.location = body.location.trim();
  if (typeof body.notes === 'string' || body.notes === null) update.notes = body.notes ? String(body.notes).trim() : null;
  if (body.startsAt !== undefined) {
    const d = parseAthensLocal(String(body.startsAt));
    if (Number.isNaN(d.getTime())) return new Response(JSON.stringify({ error: 'invalid date' }), { status: 400 });
    update.startsAt = d;
  }
  if (body.durationHours !== undefined) {
    const n = Number(body.durationHours);
    if (!Number.isFinite(n)) return new Response(JSON.stringify({ error: 'invalid duration' }), { status: 400 });
    update.durationHours = n;
  }
  if (body.priceEur !== undefined) {
    const n = Number(body.priceEur);
    if (!Number.isFinite(n)) return new Response(JSON.stringify({ error: 'invalid price' }), { status: 400 });
    update.priceEur = n;
  }
  if (body.capacity !== undefined) {
    const v = body.capacity;
    if (v === null || v === '') {
      update.capacity = null;
    } else {
      const n = Number(v);
      if (!Number.isFinite(n) || n < 1) return new Response(JSON.stringify({ error: 'invalid capacity' }), { status: 400 });
      update.capacity = n;
    }
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as SessionStatus)) {
      return new Response(JSON.stringify({ error: 'invalid status' }), { status: 400 });
    }
    update.status = body.status;
  }

  await updateSession(id, update as Parameters<typeof updateSession>[1]);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.admin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });
  await deleteSession(id);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
