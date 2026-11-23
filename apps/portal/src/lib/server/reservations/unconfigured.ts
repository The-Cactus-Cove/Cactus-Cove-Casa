import type { ReservationSource } from './types.ts';

/**
 * Placeholder until the Rental Control source lands: nobody can sign in.
 * TODO(rental-control): read reservations from Home Assistant.
 */
export class NoReservations implements ReservationSource {
  async byToken() {
    return null;
  }
  async byId() {
    return null;
  }
  async markCheckedOut() {}
}
