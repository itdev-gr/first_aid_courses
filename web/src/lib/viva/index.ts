/**
 * Payment provider abstraction.
 *
 * VIVA_MODE selects the implementation:
 *   - 'mock' (default if unset) — instant-success simulator for dev / pre-credentials
 *   - 'demo' — real Viva Smart Checkout against demo.vivapayments.com
 *   - 'production' — real Viva against www.vivapayments.com (only when ready to take real money)
 */

import * as mock from './mock';
import * as demo from './demo';

export interface CreateOrderInput {
  bookingId: string;
  amountEur: number;
  customerEmail: string;
  customerFullName: string;
  customerPhone: string;
  description: string;
  successUrl: string;
  failureUrl: string;
}

export interface CreateOrderResult {
  /** Where to send the customer to pay. */
  checkoutUrl: string;
  /** Provider-specific order reference, stored on the booking as paymentRef. */
  orderCode: string;
}

export type VivaMode = 'mock' | 'demo' | 'production';

export function getMode(): VivaMode {
  const m = (import.meta.env.VIVA_MODE ?? 'mock').toLowerCase();
  if (m === 'production' || m === 'demo' || m === 'mock') return m;
  return 'mock';
}

export function isMock(): boolean {
  return getMode() === 'mock';
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (getMode() === 'mock') return mock.createOrder(input);
  return demo.createOrder(input);
}

/** Given a webhook request (parsed body + signature header), verify + extract { orderCode, transactionId, status }. */
export interface WebhookPayload {
  orderCode: string;
  transactionId: string;
  status: 'paid' | 'failed' | 'cancelled' | 'pending' | 'unknown';
  rawEventTypeId?: number;
}

export async function parseWebhook(rawBody: string, signature: string | null): Promise<WebhookPayload | null> {
  if (getMode() === 'mock') return mock.parseWebhook(rawBody, signature);
  return demo.parseWebhook(rawBody, signature);
}
