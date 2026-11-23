import type { Stay } from '#lib/house/types.ts';

export interface Reservation {
  id: string;
  /** Secret in the guest's stay link: /s/<token>. */
  token: string;
  /** Last 4 digits of the booking phone number. */
  pin: string;
  stay: Stay;
}

/** Where reservations come from (Rental Control in production, a fake in mock mode). */
export interface ReservationSource {
  byToken(token: string): Promise<Reservation | null>;
  byId(id: string): Promise<Reservation | null>;
  /** Record that the guest checked out from the portal. */
  markCheckedOut(id: string, at: Date): Promise<void>;
}
