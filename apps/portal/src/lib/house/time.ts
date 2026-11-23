import type { ClockTime, LocalDate } from './types.ts';

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
const YMD = /^\d{4}-\d{2}-\d{2}$/;

export const isClockTime = (value: unknown): value is ClockTime => typeof value === 'string' && HHMM.test(value);
export const isLocalDate = (value: unknown): value is LocalDate => typeof value === 'string' && YMD.test(value);

/** Wall-clock parts of an instant in a time zone. */
function parts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });
  const get = (type: string) => Number(fmt.formatToParts(date).find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute'), second: get('second') };
}

/** Local calendar date of an instant, "YYYY-MM-DD". */
export function localDate(date: Date, timeZone: string): LocalDate {
  const p = parts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

/** Offset of a zone from UTC at an instant, in minutes. */
function offsetMinutes(date: Date, timeZone: string): number {
  const p = parts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/** The instant a local date and wall-clock time happen in a zone. */
export function zonedInstant(date: LocalDate, time: ClockTime, timeZone: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  // Two passes settle the offset even across a DST change.
  let instant = new Date(guess - offsetMinutes(new Date(guess), timeZone) * 60000);
  instant = new Date(guess - offsetMinutes(instant, timeZone) * 60000);
  return instant;
}

/** Add days to a local date. */
export function addDays(date: LocalDate, days: number): LocalDate {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Next time a wall-clock time occurs at or after `now`. */
export function nextOccurrence(time: ClockTime, now: Date, timeZone: string): Date {
  const today = localDate(now, timeZone);
  const candidate = zonedInstant(today, time, timeZone);
  return candidate.getTime() > now.getTime() ? candidate : zonedInstant(addDays(today, 1), time, timeZone);
}

/** Each night of a stay, by the local date the night starts on. */
export function nightsOf(checkIn: string, checkOut: string, timeZone: string): LocalDate[] {
  const first = localDate(new Date(checkIn), timeZone);
  const last = localDate(new Date(checkOut), timeZone);
  const nights: LocalDate[] = [];
  for (let d = first; d < last; d = addDays(d, 1)) nights.push(d);
  return nights;
}

/** Local wall-clock time of an instant, "HH:MM". */
export function localTime(date: Date, timeZone: string): ClockTime {
  const p = parts(date, timeZone);
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}
