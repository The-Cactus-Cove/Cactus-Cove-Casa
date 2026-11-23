import { config } from '../config.ts';
import { MockReservations } from './mock.ts';
import { NoReservations } from './unconfigured.ts';
import type { ReservationSource } from './types.ts';

export type { Reservation, ReservationSource } from './types.ts';

let source: ReservationSource | undefined;

export function reservations(): ReservationSource {
  source ??= config().haMock ? new MockReservations(config().timeZone) : new NoReservations();
  return source;
}

/** The mock source, when running in mock mode. */
export function mockReservations(): MockReservations | null {
  const s = reservations();
  return s instanceof MockReservations ? s : null;
}
