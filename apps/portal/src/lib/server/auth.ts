import { timingSafeEqual } from 'node:crypto';
import { RateLimiter } from './rate-limit.ts';
import { reservations, type Reservation } from './reservations/index.ts';

/** 5 wrong tries per stay link per client in 15 minutes, then wait. */
const perClient = new RateLimiter(5, 15 * 60_000);
/** And 20 per stay link overall, so rotating IPs doesn't help much. */
const perLink = new RateLimiter(20, 60 * 60_000);

export type SignInResult = { ok: true; reservation: Reservation } | { ok: false; reason: 'invalid' | 'limited' };

const samePin = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function signIn(token: string, pin: string, clientIp: string): Promise<SignInResult> {
  const clientKey = `${token}|${clientIp}`;
  if (!perClient.attempt(clientKey) || !perLink.attempt(token)) return { ok: false, reason: 'limited' };

  const reservation = await reservations().byToken(token);
  if (!reservation || !/^\d{4}$/.test(pin) || !samePin(pin, reservation.pin)) return { ok: false, reason: 'invalid' };

  perClient.reset(clientKey);
  return { ok: true, reservation };
}

/** Sessions outlive checkout by a day so the "Happy trails" screen still shows. */
export const sessionExpiry = (reservation: Reservation) => new Date(new Date(reservation.stay.checkOut).getTime() + 24 * 3600_000);
