import type { APIRoute } from 'astro';
import { parseWebhook } from '../../../../lib/viva';
import { findBookingByPaymentRef } from '../../../../lib/firebase/bookings';
import { markBookingPaid, markBookingFailed } from '../../../../lib/payments';

/**
 * Viva calls GET first to verify the URL is reachable; the response body is the
 * verification key configured in the Viva dashboard. Then payment events come
 * via POST.
 */
export const GET: APIRoute = async () => {
  const key = import.meta.env.VIVA_WEBHOOK_KEY ?? '';
  if (!key) {
    return new Response('VIVA_WEBHOOK_KEY not configured', { status: 503 });
  }
  return new Response(JSON.stringify({ Key: key }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-viva-signature') ?? null;

  const event = await parseWebhook(rawBody, signature);
  if (!event) {
    return new Response(JSON.stringify({ error: 'unparsed' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const booking = await findBookingByPaymentRef(event.orderCode);
  if (!booking) {
    return new Response(JSON.stringify({ error: 'booking-not-found' }), { status: 404, headers: { 'content-type': 'application/json' } });
  }

  if (event.status === 'paid') {
    await markBookingPaid(booking.id, event.transactionId || event.orderCode);
  } else if (event.status === 'failed' || event.status === 'cancelled') {
    await markBookingFailed(booking.id, event.transactionId || event.orderCode, 'cancelled');
  }

  // Always 200 so Viva doesn't retry endlessly even if our app errored after recording the event.
  return new Response(JSON.stringify({ ok: true, status: event.status }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
