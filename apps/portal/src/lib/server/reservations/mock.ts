import type { Stage } from '#lib/house/types.ts';
import type { Reservation, ReservationSource } from './types.ts';

export type DemoStage = Exclude<Stage, 'ended'>;
export const DEMO_STAGES: DemoStage[] = ['before', 'during', 'checkout-day'];
export const DEMO_TOKEN = 'demo';
export const DEMO_PIN = '1234';

const HOUR = 3600_000;
const DAY = 24 * HOUR;

/** Stay dates that put "now" in the chosen stage, matching the mockup's countdowns. */
function datesFor(stage: DemoStage, now: number) {
  switch (stage) {
    case 'before': {
      const checkIn = now + 12 * DAY + 4 * HOUR + 31 * 60_000;
      return { checkIn, checkOut: checkIn + 3 * DAY - 5 * HOUR };
    }
    case 'during': {
      const checkOut = now + 1 * DAY + 18 * HOUR + 5 * 60_000;
      return { checkIn: checkOut - 3 * DAY + 5 * HOUR, checkOut };
    }
    case 'checkout-day': {
      const checkOut = now + 2 * HOUR + 15 * 60_000;
      return { checkIn: checkOut - 3 * DAY + 5 * HOUR, checkOut };
    }
  }
}

/** In-memory demo reservation for mock mode. */
export class MockReservations implements ReservationSource {
  #stage: DemoStage = 'during';
  #reservation: Reservation;

  constructor(private timeZone: string) {
    this.#reservation = this.#build();
  }

  get stage() {
    return this.#stage;
  }

  /** Switch the demo stay to a stage (and undo any checkout). */
  setStage(stage: DemoStage) {
    this.#stage = stage;
    this.#reservation = this.#build();
  }

  #build(): Reservation {
    const { checkIn, checkOut } = datesFor(this.#stage, Date.now());
    return {
      id: 'demo-reservation',
      token: DEMO_TOKEN,
      pin: DEMO_PIN,
      stay: {
        guestName: 'Sam',
        guests: 4,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        timeZone: this.timeZone,
        checkedOutAt: null
      }
    };
  }

  async byToken(token: string) {
    return token === this.#reservation.token ? this.#reservation : null;
  }

  async byId(id: string) {
    return id === this.#reservation.id ? this.#reservation : null;
  }

  async markCheckedOut(id: string, at: Date) {
    if (id === this.#reservation.id) {
      this.#reservation = { ...this.#reservation, stay: { ...this.#reservation.stay, checkedOutAt: at.toISOString() } };
    }
  }
}
