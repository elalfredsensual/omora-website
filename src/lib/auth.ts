// ─────────────────────────────────────────────────────────────
//  Simple cookie-based auth for the /admin panel.
//  One password, signed-cookie session (HMAC-SHA256), 30-day expiry.
// ─────────────────────────────────────────────────────────────

import crypto from 'node:crypto';

const SECRET =
  process.env.SESSION_SECRET ||
  'omora-default-session-secret-change-me-in-production';
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

export const COOKIE_NAME = 'omora_session';

function hmac(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

/** Build a signed session token (expiry + HMAC). */
export function signSession(): string {
  const expiry = Date.now() + SESSION_LIFETIME_MS;
  const payload = String(expiry);
  return `${payload}.${hmac(payload)}`;
}

/** Verify a session token from the cookie. */
export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = hmac(payload);
  try {
    if (
      !crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
    ) {
      return false;
    }
  } catch {
    return false;
  }
  const expiry = Number(payload);
  if (Number.isNaN(expiry) || expiry < Date.now()) return false;
  return true;
}

/** Constant-time password comparison against env var. */
export function passwordMatches(submitted: string): boolean {
  const stored = process.env.ADMIN_PASSWORD || '';
  if (!stored) return false;
  if (submitted.length !== stored.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(submitted), Buffer.from(stored));
  } catch {
    return false;
  }
}

/** Cookie options used when setting the session. */
export function cookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  };
}
