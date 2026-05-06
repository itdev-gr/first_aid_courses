/**
 * Payment-completion logic shared by the webhook + the mock-confirm endpoint.
 * Updates booking status, sends the admin email, returns the new status.
 */

import { getCollection } from 'astro:content';
import { getBooking, updateBooking } from './firebase/bookings';
import { getSession } from './firebase/sessions';
import { sendBookingPaidNotification } from './email/resend';

export async function markBookingPaid(bookingId: string, paymentRef: string): Promise<{ ok: boolean; reason?: string }> {
  const booking = await getBooking(bookingId);
  if (!booking) return { ok: false, reason: 'booking-not-found' };

  if (booking.status === 'paid') {
    // Idempotent — webhook may fire twice
    return { ok: true };
  }

  await updateBooking(bookingId, { status: 'paid', paymentRef });

  try {
    const session = await getSession(booking.sessionId);
    const programs = await getCollection('programs');
    const program = programs.find((p) => p.slug === booking.programSlug);
    if (session && program) {
      await sendBookingPaidNotification({
        bookingId: booking.id,
        programTitle: program.data.titleEl,
        programCode: program.data.code,
        sessionStartsAt: session.startsAt,
        sessionLocation: session.location,
        customerName: booking.contact.name,
        customerEmail: booking.contact.email,
        customerPhone: booking.contact.phone,
        participantCount: booking.participantCount,
        totalEur: booking.totalEur,
      });
    }
  } catch (err) {
    // Don't fail the payment confirmation just because the email failed
    console.error('booking-paid email failed', err);
  }

  return { ok: true };
}

export async function markBookingFailed(bookingId: string, paymentRef: string, status: 'cancelled' | 'expired' = 'cancelled'): Promise<void> {
  const booking = await getBooking(bookingId);
  if (!booking || booking.status === 'paid' || booking.status === 'cancelled') return;
  await updateBooking(bookingId, { status, paymentRef });
}
