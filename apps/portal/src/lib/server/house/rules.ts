import { CommandError, type SleepRequest } from '#lib/house/commands.ts';
import { MAX_HOLD_HOURS } from '#lib/house/limits.ts';
import { nextOccurrence } from '#lib/house/time.ts';
import { formatClock } from '#lib/house/format.ts';
import { lockedOut } from '#lib/house/lockout.ts';
import type { SleepTimer, TvState } from '#lib/house/types.ts';
import type { CommandContext } from './backend.ts';

/** A "keep unlocked" hold must end in the future, within MAX_HOLD_HOURS and before checkout. */
export function checkHold(holdUntil: string | null, { now, stay }: CommandContext): Date | null {
  if (!holdUntil) return null;
  const until = new Date(holdUntil);
  const latest = Math.min(now.getTime() + MAX_HOLD_HOURS * 3600_000, new Date(stay.checkOut).getTime());
  if (until.getTime() <= now.getTime()) throw new CommandError('That time has already passed');
  if (until.getTime() > latest) throw new CommandError(`Doors can be held unlocked for up to ${MAX_HOLD_HOURS} hours, and not past checkout`);
  return until;
}

/** Turn a sleep-timer request into a timer with an end time. */
export function resolveSleep(request: SleepRequest, { now, stay }: CommandContext): SleepTimer {
  switch (request.kind) {
    case 'off':
      return { kind: 'off' };
    case 'in':
      return { kind: 'in', hours: request.hours, endsAt: new Date(now.getTime() + request.hours * 3600_000).toISOString() };
    case 'at':
      return { kind: 'at', time: request.time, endsAt: nextOccurrence(request.time, now, stay.timeZone).toISOString() };
  }
}

/** Find a device by id, or reject the command. */
export function byId<T extends { id: string }>(list: T[], id: string, what: string): T {
  const found = list.find((item) => item.id === id);
  if (!found) throw new CommandError(`Unknown ${what}`);
  return found;
}

/** Turning a TV on during its bedtime lockout is refused. */
export function assertNotLockedOut(tv: TvState, { now, stay }: CommandContext) {
  if (lockedOut(tv.lockout, now, stay.timeZone)) {
    throw new CommandError(`Bedtime lockout is on for the ${tv.label.toLowerCase()} TV until ${formatClock(tv.lockout.to)}`);
  }
}
