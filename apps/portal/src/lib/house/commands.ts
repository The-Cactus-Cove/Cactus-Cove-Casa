import { HVAC_MODES, SLEEP_HOURS, THERMOSTAT, TV_KEYS } from './limits.ts';
import { controlsLive } from './stage.ts';
import { isClockTime, isLocalDate } from './time.ts';
import type { ClockTime, HvacMode, LocalDate, SleepHours, Stage, TvKey } from './types.ts';

export type SleepRequest = { kind: 'off' } | { kind: 'in'; hours: SleepHours } | { kind: 'at'; time: ClockTime };
export type LockoutRequest = {
  enabled: boolean;
  from: ClockTime;
  to: ClockTime;
  scope: { kind: 'stay' } | { kind: 'night'; night: LocalDate };
};

/** Everything a guest can ask the house to do. */
export type Command =
  | { type: 'garage'; open: boolean }
  | { type: 'lock'; lockId: string; locked: true }
  | { type: 'lock'; lockId: string; locked: false; holdUntil: string | null }
  | { type: 'thermostat'; setpoint: number; mode: HvacMode }
  | { type: 'arrival-temperature'; setpoint: number }
  | { type: 'tv-power'; tvId: string; on: boolean }
  | { type: 'tv-key'; tvId: string; key: TvKey }
  | { type: 'tv-sleep'; tvId: string; sleep: SleepRequest }
  | { type: 'tv-lockout'; tvId: string; lockout: LockoutRequest }
  | { type: 'away-settings'; adjustThermostat: boolean; setpoint: number }
  | { type: 'heading-out' }
  | { type: 'checkout' };

export type CommandType = Command['type'];

export class CommandError extends Error {}

type Obj = Record<string, unknown>;
const fail = (message: string): never => {
  throw new CommandError(message);
};
const obj = (v: unknown, what: string): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : fail(`${what} must be an object`));
const str = (v: unknown, what: string): string => (typeof v === 'string' && v.length > 0 && v.length <= 64 ? v : fail(`${what} must be a string`));
const bool = (v: unknown, what: string): boolean => (typeof v === 'boolean' ? v : fail(`${what} must be true or false`));
const oneOf = <T>(v: unknown, options: readonly T[], what: string): T =>
  options.includes(v as T) ? (v as T) : fail(`${what} must be one of ${options.join(', ')}`);
const clock = (v: unknown, what: string): ClockTime => (isClockTime(v) ? v : fail(`${what} must be HH:MM`));
const instant = (v: unknown, what: string): string =>
  typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : fail(`${what} must be a date-time`);
const setpoint = (v: unknown): number =>
  Number.isInteger(v) && (v as number) >= THERMOSTAT.min && (v as number) <= THERMOSTAT.max
    ? (v as number)
    : fail(`setpoint must be a whole number from ${THERMOSTAT.min} to ${THERMOSTAT.max}`);

function sleep(v: unknown): SleepRequest {
  const s = obj(v, 'sleep');
  switch (s.kind) {
    case 'off':
      return { kind: 'off' };
    case 'in':
      return { kind: 'in', hours: oneOf(s.hours, SLEEP_HOURS, 'hours') };
    case 'at':
      return { kind: 'at', time: clock(s.time, 'time') };
    default:
      return fail('sleep.kind must be off, in or at');
  }
}

function lockout(v: unknown): LockoutRequest {
  const l = obj(v, 'lockout');
  const scope = obj(l.scope, 'scope');
  return {
    enabled: bool(l.enabled, 'enabled'),
    from: clock(l.from, 'from'),
    to: clock(l.to, 'to'),
    scope:
      scope.kind === 'stay'
        ? { kind: 'stay' }
        : scope.kind === 'night' && isLocalDate(scope.night)
          ? { kind: 'night', night: scope.night }
          : fail('scope must be the whole stay or one night (YYYY-MM-DD)')
  };
}

/** Validate untrusted input (a request body) into a Command. Throws CommandError. */
export function parseCommand(input: unknown): Command {
  const c = obj(input, 'command');
  switch (c.type) {
    case 'garage':
      return { type: 'garage', open: bool(c.open, 'open') };
    case 'lock': {
      const lockId = str(c.lockId, 'lockId');
      return bool(c.locked, 'locked')
        ? { type: 'lock', lockId, locked: true }
        : { type: 'lock', lockId, locked: false, holdUntil: c.holdUntil == null ? null : instant(c.holdUntil, 'holdUntil') };
    }
    case 'thermostat':
      return { type: 'thermostat', setpoint: setpoint(c.setpoint), mode: oneOf(c.mode, HVAC_MODES, 'mode') };
    case 'arrival-temperature':
      return { type: 'arrival-temperature', setpoint: setpoint(c.setpoint) };
    case 'tv-power':
      return { type: 'tv-power', tvId: str(c.tvId, 'tvId'), on: bool(c.on, 'on') };
    case 'tv-key':
      return { type: 'tv-key', tvId: str(c.tvId, 'tvId'), key: oneOf(c.key, TV_KEYS, 'key') };
    case 'tv-sleep':
      return { type: 'tv-sleep', tvId: str(c.tvId, 'tvId'), sleep: sleep(c.sleep) };
    case 'tv-lockout':
      return { type: 'tv-lockout', tvId: str(c.tvId, 'tvId'), lockout: lockout(c.lockout) };
    case 'away-settings':
      return { type: 'away-settings', adjustThermostat: bool(c.adjustThermostat, 'adjustThermostat'), setpoint: setpoint(c.setpoint) };
    case 'heading-out':
      return { type: 'heading-out' };
    case 'checkout':
      return { type: 'checkout' };
    default:
      return fail('unknown command type');
  }
}

/** Which commands each stage of the stay allows. */
export function commandAllowed(type: CommandType, stage: Stage): boolean {
  if (type === 'arrival-temperature') return stage === 'before';
  if (type === 'checkout') return stage === 'checkout-day' || stage === 'during';
  return controlsLive(stage);
}
