import { adminAuth } from './admin';

const COOKIE_NAME = 'admin_session';
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export async function createSessionCookie(idToken: string): Promise<{ value: string; maxAge: number }> {
  const value = await adminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
  return { value, maxAge: FIVE_DAYS_MS / 1000 };
}

export async function verifySessionCookie(cookie: string | undefined): Promise<{ uid: string; email: string } | null> {
  if (!cookie) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    return { uid: decoded.uid, email: decoded.email ?? '' };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
