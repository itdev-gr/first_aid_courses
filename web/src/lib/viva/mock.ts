import type { CreateOrderInput, CreateOrderResult, WebhookPayload } from './index';
import { randomBytes } from 'node:crypto';

/** Mock Viva order: just builds a synthetic order code and a redirect to our fake checkout page. */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const orderCode = `MOCK-${randomBytes(6).toString('hex').toUpperCase()}`;
  const url = new URL('/kratisi/mock-pay', input.successUrl);
  url.searchParams.set('order', orderCode);
  url.searchParams.set('bookingId', input.bookingId);
  url.searchParams.set('amount', String(input.amountEur));
  url.searchParams.set('successUrl', input.successUrl);
  url.searchParams.set('failureUrl', input.failureUrl);
  return { checkoutUrl: url.toString(), orderCode };
}

/** Mock webhook: parse a JSON body of the shape mock-confirm sends. */
export async function parseWebhook(rawBody: string, _signature: string | null): Promise<WebhookPayload | null> {
  try {
    const body = JSON.parse(rawBody) as { orderCode?: string; transactionId?: string; status?: string };
    if (!body.orderCode) return null;
    return {
      orderCode: body.orderCode,
      transactionId: body.transactionId ?? `MOCK-TXN-${Date.now()}`,
      status: (body.status === 'paid' || body.status === 'failed' || body.status === 'cancelled') ? body.status : 'unknown',
    };
  } catch {
    return null;
  }
}
