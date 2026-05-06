import type { APIRoute } from 'astro';
import { getBooking, updateBooking } from '../../../lib/firebase/bookings';
import { createOrder, isMock } from '../../../lib/viva';

export const POST: APIRoute = async ({ request, url }) => {
  const body = (await request.json().catch(() => null)) as { bookingId?: string } | null;
  if (!body?.bookingId) {
    return new Response(JSON.stringify({ error: 'bookingId required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const booking = await getBooking(body.bookingId);
  if (!booking) return new Response(JSON.stringify({ error: 'booking-not-found' }), { status: 404, headers: { 'content-type': 'application/json' } });
  if (booking.status === 'paid') return new Response(JSON.stringify({ error: 'already-paid' }), { status: 409, headers: { 'content-type': 'application/json' } });
  if (booking.status === 'cancelled' || booking.status === 'expired') return new Response(JSON.stringify({ error: 'booking-not-active' }), { status: 409, headers: { 'content-type': 'application/json' } });

  const origin = url.origin;
  const successUrl = `${origin}/kratisi/paid/?id=${booking.id}`;
  const failureUrl = `${origin}/kratisi/payment-failed/?id=${booking.id}`;

  try {
    const order = await createOrder({
      bookingId: booking.id,
      amountEur: booking.totalEur,
      customerEmail: booking.contact.email,
      customerFullName: booking.contact.name,
      customerPhone: booking.contact.phone,
      description: `Κράτηση ${booking.programSlug} — ${booking.participantCount} άτομα`,
      successUrl,
      failureUrl,
    });
    await updateBooking(booking.id, { paymentRef: order.orderCode });
    return new Response(JSON.stringify({ checkoutUrl: order.checkoutUrl, orderCode: order.orderCode, mock: isMock() }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('create-order error', err);
    return new Response(JSON.stringify({ error: 'create-order-failed' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
