import { addDays, localDate, zonedInstant } from '#lib/house/time.ts';
import type { Stage } from '#lib/house/types.ts';
import type { Reservation, ReservationSource } from './types.ts';

export type DemoStage = Exclude<Stage, 'ended'>;
export const DEMO_STAGES: DemoStage[] = ['before', 'during', 'checkout-day'];
export const DEMO_TOKEN = 'demo';
export const DEMO_PIN = '1234';

const CHECK_IN_TIME = '16:00';
const CHECK_OUT_TIME = '11:00';

/** Stay dates (4 PM in, 11 AM out) that put "now" in the chosen stage. */
function datesFor(stage: DemoStage, now: Date, tz: string) {
  const today = localDate(now, tz);
  const at = (days: number, time: string) => zonedInstant(addDays(today, days), time, tz).getTime();
  switch (stage) {
    case 'before':
      return { checkIn: at(12, CHECK_IN_TIME), checkOut: at(15, CHECK_OUT_TIME) };
    case 'during':
      return { checkIn: at(-1, CHECK_IN_TIME), checkOut: at(2, CHECK_OUT_TIME) };
    case 'checkout-day': {
      // Late in the day the real 11 AM has passed, so stretch checkout to keep the demo on checkout day.
      const elevenToday = at(0, CHECK_OUT_TIME);
      const checkOut = now.getTime() < elevenToday - 3600_000 ? elevenToday : at(0, '23:59');
      return { checkIn: at(-3, CHECK_IN_TIME), checkOut };
    }
  }
}

/** In-memory demo reservation for mock mode. */
export class MockReservations implements ReservationSource {
  #stage: DemoStage = 'during';
  #reservation: Reservation;

  constructor(private readonly timeZone: string) {
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
    const { checkIn, checkOut } = datesFor(this.#stage, new Date(), this.timeZone);
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
