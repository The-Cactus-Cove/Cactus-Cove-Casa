import { formatTime } from './format.ts';
import { MAX_HOLD_HOURS, TONIGHT_HOLD_TIME } from './limits.ts';
import { localDate, zonedInstant } from './time.ts';
import type { Stay } from './types.ts';

export interface HoldOption {
  /** ISO end time, sent as holdUntil. */
  value: string;
  label: string;
  until: string;
}

/** "Keep unlocked" choices that fit the server's rule: future, ≤ MAX_HOLD_HOURS, ≤ checkout. */
export function holdOptions(now: Date, stay: Stay): HoldOption[] {
  const tz = stay.timeZone;
  const latest = Math.min(now.getTime() + MAX_HOLD_HOURS * 3600_000, new Date(stay.checkOut).getTime());
  const tonight = zonedInstant(localDate(now, tz), TONIGHT_HOLD_TIME, tz);
  const candidates: Array<[string, Date]> = [
    ['For 1 hour', new Date(now.getTime() + 3600_000)],
    ['For 3 hours', new Date(now.getTime() + 3 * 3600_000)],
    ['Until tonight', tonight]
  ];
  return candidates
    .filter(([, at]) => at.getTime() > now.getTime() + 30 * 60_000 && at.getTime() <= latest)
    .sort(([, a], [, b]) => a.getTime() - b.getTime())
    .map(([label, at]) => ({ value: at.toISOString(), label, until: formatTime(at, tz) }));
}
