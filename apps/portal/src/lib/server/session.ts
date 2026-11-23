import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/env';
import { config } from './config.ts';

const COOKIE = 'cc_session';

interface SessionPayload {
  /** Reservation id. */
  rid: string;
  /** Expiry, epoch ms. */
  exp: number;
}

const sign = (data: string) => createHmac('sha256', config().sessionSecret).update(data).digest('base64url');

function encode(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

function decode(value: string): SessionPayload | null {
  const [data, sig] = value.split('.');
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionPayload;
    return typeof payload.rid === 'string' && typeof payload.exp === 'number' && payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

const cookieOptions = (expires: Date) => ({
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: !dev,
  expires
});

export function startSession(cookies: Cookies, reservationId: string, expires: Date) {
  cookies.set(COOKIE, encode({ rid: reservationId, exp: expires.getTime() }), cookieOptions(expires));
}

export function endSession(cookies: Cookies) {
  cookies.delete(COOKIE, { path: '/' });
}

/** The reservation id in a valid, unexpired session cookie. */
export function sessionReservationId(cookies: Cookies): string | null {
  const value = cookies.get(COOKIE);
  return value ? (decode(value)?.rid ?? null) : null;
}
