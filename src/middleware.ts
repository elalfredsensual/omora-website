import { defineMiddleware } from 'astro:middleware';
import { COOKIE_NAME, verifySession } from './lib/auth';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const url = new URL(ctx.request.url);
  const path = url.pathname.replace(/\/$/, '') || '/';

  // Pages inside /admin (except the login page itself) require a session.
  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  const isLogin = path === '/admin/login';
  if (isAdmin && !isLogin) {
    const token = ctx.cookies.get(COOKIE_NAME)?.value;
    if (!verifySession(token)) {
      return ctx.redirect('/admin/login', 302);
    }
  }
  return next();
});
