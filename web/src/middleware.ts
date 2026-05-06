import { defineMiddleware } from 'astro:middleware';
import { verifySessionCookie, SESSION_COOKIE_NAME } from './lib/firebase/session';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminRoute) {
    return next();
  }

  // public routes inside the admin namespace
  if (pathname === '/admin/login' || pathname === '/api/admin/session') {
    return next();
  }

  const cookie = ctx.cookies.get(SESSION_COOKIE_NAME)?.value;
  const admin = await verifySessionCookie(cookie);

  if (!admin) {
    return ctx.redirect('/admin/login', 302);
  }

  ctx.locals.admin = admin;
  return next();
});
