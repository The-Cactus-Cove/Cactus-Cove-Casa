import { addDays, localDate, localTime } from './time.ts';
import type { LocalDate, Lockout } from './types.ts';

/**
 * The night (by its starting date) whose lockout window contains `now`, or null.
 * Windows may cross midnight: 20:30–07:00 on the 21st runs into the morning of the 22nd.
 */
function nightInWindow(lockout: Lockout, now: Date, timeZone: string): LocalDate | null {
  const t = localTime(now, timeZone);
  const today = localDate(now, timeZone);
  const { from, to } = lockout;
  if (from < to) return t >= from && t < to ? today : null;
  if (t >= from) return today;
  if (t < to) return addDays(today, -1);
  return null;
}

/** Whether the TV must stay off right now. */
export function lockedOut(lockout: Lockout, now: Date, timeZone: string): boolean {
  if (!lockout.enabled) return false;
  const night = nightInWindow(lockout, now, timeZone);
  if (!night) return false;
  return lockout.scope.kind === 'stay' || lockout.scope.night === night;
}
