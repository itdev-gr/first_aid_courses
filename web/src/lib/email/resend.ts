import { Resend } from 'resend';

let client: Resend | null = null;

function getClient(): Resend {
  if (client) return client;
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  client = new Resend(key);
  return client;
}

const ADMIN_EMAIL = 'info@firstaid-academy.gr';
// Resend's onboarding sender — works without verifying a custom domain.
// Replace with a verified sender (e.g. 'no-reply@firstaid-academy.gr') once the domain is added in Resend.
const FROM_EMAIL = 'First Aid Academy <onboarding@resend.dev>';

const fmt = new Intl.DateTimeFormat('el-GR', {
  timeZone: 'Europe/Athens',
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

export interface BookingEmailContext {
  bookingId: string;
  programTitle: string;
  programCode: string;
  sessionStartsAt: Date;
  sessionLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  participantCount: number;
  totalEur: number;
}

/** Notify the admin that a booking has been paid. Called from the Viva webhook (Phase 5). */
export async function sendBookingPaidNotification(ctx: BookingEmailContext): Promise<void> {
  const dateStr = fmt.format(ctx.sessionStartsAt);
  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h2 style="color: #b91c1c; margin: 0 0 16px;">Νέα πληρωμένη κράτηση</h2>
      <p style="line-height: 1.6;">Καταχωρήθηκε νέα κράτηση και ολοκληρώθηκε η πληρωμή στο Viva Wallet.</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden;">
        <tr><td style="padding: 12px 16px; color: #64748b; font-size: 14px;">Σεμινάριο</td><td style="padding: 12px 16px; font-weight: 600; text-align: right;">${ctx.programTitle} <span style="color: #94a3b8; font-weight: 400;">(${ctx.programCode})</span></td></tr>
      <tr><td style="padding: 12px 16px; color: #64748b; font-size: 14px;">Ημερομηνία</td><td style="padding: 12px 16px; font-weight: 600; text-align: right;">${dateStr}</td></tr>
        <tr><td style="padding: 12px 16px; color: #64748b; font-size: 14px;">Τοποθεσία</td><td style="padding: 12px 16px; font-weight: 600; text-align: right;">${ctx.sessionLocation}</td></tr>
        <tr><td style="padding: 12px 16px; color: #64748b; font-size: 14px;">Συμμετέχοντες</td><td style="padding: 12px 16px; font-weight: 600; text-align: right;">${ctx.participantCount}</td></tr>
        <tr><td style="padding: 12px 16px; color: #64748b; font-size: 14px;">Σύνολο</td><td style="padding: 12px 16px; font-weight: 700; color: #b91c1c; text-align: right;">€${ctx.totalEur}</td></tr>
      </table>

      <h3 style="margin: 24px 0 8px; font-size: 16px;">Στοιχεία πελάτη</h3>
      <p style="margin: 4px 0;"><strong>Όνομα:</strong> ${ctx.customerName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${ctx.customerEmail}">${ctx.customerEmail}</a></p>
      <p style="margin: 4px 0;"><strong>Τηλέφωνο:</strong> ${ctx.customerPhone}</p>

      <p style="margin-top: 24px;">
        <a href="https://first-aid-courses.vercel.app/admin/bookings/${ctx.bookingId}" style="background: #b91c1c; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Άνοιγμα στον πίνακα</a>
      </p>

      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Booking ID: ${ctx.bookingId}</p>
    </div>
  `;

  await getClient().emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Νέα πληρωμένη κράτηση — ${ctx.programCode} (${dateStr})`,
    html,
  });
}
