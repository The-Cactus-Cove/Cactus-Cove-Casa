import type { Stage, Stay } from './types.ts';
import { localDate } from './time.ts';

/** Which stage of the stay `now` falls in. */
export function stageOf(stay: Stay, now: Date): Stage {
  const t = now.getTime();
  const checkOut = new Date(stay.checkOut);
  if (stay.checkedOutAt || t >= checkOut.getTime()) return 'ended';
  if (t < new Date(stay.checkIn).getTime()) return 'before';
  return localDate(now, stay.timeZone) === localDate(checkOut, stay.timeZone) ? 'checkout-day' : 'during';
}

/** House controls (doors, garage, TVs, thermostat) are live. */
export const controlsLive = (stage: Stage) => stage === 'during' || stage === 'checkout-day';
