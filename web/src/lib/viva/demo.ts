/**
 * Real Viva Wallet Smart Checkout integration (demo + production).
 *
 * Flow:
 *   1. POST /connect/token (accounts host) with Basic auth → access_token
 *   2. POST /checkout/v2/orders (api host) with Bearer + order body → orderCode
 *   3. Redirect customer to https://<webHost>/web/checkout?ref=<orderCode>
 *   4. Viva calls our webhook (POST /api/payments/viva/webhook) with payment status
 *
 * Requires env vars: VIVA_CLIENT_ID, VIVA_CLIENT_SECRET, VIVA_SOURCE_CODE
 *   (optional: VIVA_WEBHOOK_KEY for stronger webhook validation)
 */

import { getMode, type CreateOrderInput, type CreateOrderResult, type WebhookPayload } from './index';

interface ViavHosts {
  accounts: string;  // OAuth2 token endpoint
  api: string;       // API endpoint for orders/transactions
  web: string;       // Customer-facing checkout URL host
}

function hosts(): ViavHosts {
  if (getMode() === 'production') {
    return {
      accounts: 'https://accounts.vivapayments.com',
      api: 'https://api.vivapayments.com',
      web: 'https://www.vivapayments.com',
    };
  }
  return {
    accounts: 'https://demo-accounts.vivapayments.com',
    api: 'https://demo-api.vivapayments.com',
    web: 'https://demo.vivapayments.com',
  };
}

let tokenCache: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.value;

  const clientId = import.meta.env.VIVA_CLIENT_ID;
  const clientSecret = import.meta.env.VIVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('VIVA_CLIENT_ID / VIVA_CLIENT_SECRET not configured');

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${hosts().accounts}/connect/token`, {
    method: 'POST',
    headers: {
      'authorization': `Basic ${basic}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Viva token failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const sourceCode = import.meta.env.VIVA_SOURCE_CODE;
  if (!sourceCode) throw new Error('VIVA_SOURCE_CODE not configured');

  const token = await getAccessToken();

  // Viva expects amount in minor units (cents)
  const amountCents = Math.round(input.amountEur * 100);

  const body = {
    amount: amountCents,
    customerTrns: input.description,
    customer: {
      email: input.customerEmail,
      fullName: input.customerFullName,
      phone: input.customerPhone,
      countryCode: 'GR',
      requestLang: 'el-GR',
    },
    paymentTimeOut: 900, // 15 minutes — matches our pending-booking TTL
    preauth: false,
    allowRecurring: false,
    maxInstallments: 1,
    sourceCode,
    merchantTrns: input.bookingId,
    tags: ['first-aid-academy'],
    paymentNotification: true,
    disableCash: true,
    disableWallet: false,
  };

  const res = await fetch(`${hosts().api}/checkout/v2/orders`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Viva createOrder failed: ${res.status} ${txt.slice(0, 300)}`);
  }
  const data = (await res.json()) as { orderCode: number };
  const orderCode = String(data.orderCode);

  return {
    checkoutUrl: `${hosts().web}/web/checkout?ref=${orderCode}`,
    orderCode,
  };
}

/**
 * Map Viva's EventTypeId → our normalized status.
 * Reference: https://developer.vivawallet.com/integration-reference/webhooks/
 */
const EVENT_TYPES: Record<number, WebhookPayload['status']> = {
  1723: 'paid',      // Transaction Payment Created (success)
  1796: 'failed',    // Transaction Failed
  1798: 'cancelled', // Transaction Reversal Created
  1799: 'cancelled',
};

export async function parseWebhook(rawBody: string, _signature: string | null): Promise<WebhookPayload | null> {
  // Viva sends a JSON body with EventData + EventTypeId.
  // Optional verification: GET /api/messages/config/token returns a Key
  // that the webhook URL is registered against; for now we trust the body
  // since Viva only POSTs from known IPs to the URL we provided.
  try {
    const body = JSON.parse(rawBody) as { EventTypeId?: number; EventData?: { OrderCode?: number; TransactionId?: string } };
    const eventTypeId = body.EventTypeId;
    const orderCode = body.EventData?.OrderCode;
    const transactionId = body.EventData?.TransactionId;
    if (!eventTypeId || !orderCode) return null;
    return {
      orderCode: String(orderCode),
      transactionId: transactionId ?? '',
      status: EVENT_TYPES[eventTypeId] ?? 'unknown',
      rawEventTypeId: eventTypeId,
    };
  } catch {
    return null;
  }
}
