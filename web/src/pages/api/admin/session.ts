import type { APIRoute } from 'astro';
import { createSessionCookie, SESSION_COOKIE_NAME } from '../../../lib/firebase/session';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null) as { idToken?: string } | null;
  if (!body?.idToken) {
    return new Response(JSON.stringify({ error: 'idToken required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const { value, maxAge } = await createSessionCookie(body.idToken);
    cookies.set(SESSION_COOKIE_NAME, value, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'invalid token' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
