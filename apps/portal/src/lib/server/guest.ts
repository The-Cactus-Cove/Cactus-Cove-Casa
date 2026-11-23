import { redirect, type RequestEvent } from '@sveltejs/kit';
import { reservations, type Reservation } from './reservations/index.ts';
import { sessionReservationId } from './session.ts';

/** A signed-in guest is the reservation their session belongs to. */
export type Guest = Reservation;

/** Resolve the guest from the session cookie. */
export async function resolveGuest(event: RequestEvent): Promise<Guest | null> {
  const id = sessionReservationId(event.cookies);
  return id ? reservations().byId(id) : null;
}

/** Guard for guest-only routes: redirect to the start page when signed out. */
export function requireGuest(event: RequestEvent): Guest {
  if (!event.locals.guest) redirect(303, '/');
  return event.locals.guest;
}
