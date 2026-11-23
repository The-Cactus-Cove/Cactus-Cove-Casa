import { redirect, type RequestEvent } from '@sveltejs/kit';
import { config } from './config.ts';

/** A guest with a valid session for one reservation. */
export interface Guest {
  reservationId: string;
  name: string;
  checkIn: Date;
  checkOut: Date;
}

/**
 * Resolve the guest for this request.
 * TODO(auth): read the signed session cookie. Until sign-in lands, only mock
 * mode gets a demo guest; real mode treats everyone as signed out.
 */
export function resolveGuest(_event: RequestEvent): Guest | null {
  if (!config().haMock) return null;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return {
    reservationId: 'demo',
    name: 'Sam',
    checkIn: new Date(now - day),
    checkOut: new Date(now + 2 * day)
  };
}

/** Guard for guest-only routes: redirect to sign-in when signed out. */
export function requireGuest(event: RequestEvent): Guest {
  if (!event.locals.guest) redirect(303, '/');
  return event.locals.guest;
}
