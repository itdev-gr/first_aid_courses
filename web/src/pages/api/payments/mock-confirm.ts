/**
 * Mock-mode-only endpoint: marks a booking paid without going through Viva.
 * Returns 404 in non-mock modes to prevent abuse.
 */

import type { APIRoute } from 'astro';
import { isMock } from '../../../lib/viva';
import { markBookingPaid } from '../../../lib/payments';

export const POST: APIRoute = async ({ request }) => {
  if (!isMock()) {
    return new Response(JSON.stringify({ error: 'not-found' }), { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { bookingId?: string; orderCode?: string } | null;
  if (!body?.bookingId) return new Response(JSON.stringify({ error: 'bookingId required' }), { status: 400 });

  const result = await markBookingPaid(body.bookingId, body.orderCode ?? `MOCK-${Date.now()}`);
  if (!result.ok) return new Response(JSON.stringify({ error: result.reason ?? 'failed' }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};
