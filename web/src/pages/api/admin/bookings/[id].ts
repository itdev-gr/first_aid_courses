import type { APIRoute } from 'astro';
import { updateBooking, deleteBooking, type BookingStatus } from '../../../../lib/firebase/bookings';

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'paid', 'cancelled', 'expired'];

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  if (!locals.admin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });

  const update: Parameters<typeof updateBooking>[1] = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as BookingStatus)) {
      return new Response(JSON.stringify({ error: 'invalid status' }), { status: 400 });
    }
    update.status = body.status as BookingStatus;
  }
  if (body.paymentRef !== undefined) {
    update.paymentRef = body.paymentRef === null ? null : String(body.paymentRef);
  }

  await updateBooking(id, update);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.admin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });
  await deleteBooking(id);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
