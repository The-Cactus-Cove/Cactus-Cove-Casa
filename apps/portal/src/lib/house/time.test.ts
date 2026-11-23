import { describe, expect, it } from 'vitest';
import { addDays, localDate, nextOccurrence, nightsOf, zonedInstant } from './time.ts';

const PHX = 'America/Phoenix'; // UTC-7, no DST
const NY = 'America/New_York';

describe('time helpers', () => {
  it('finds the local date in the property zone', () => {
    // 05:30 UTC on the 21st is 22:30 on the 20th in Phoenix.
    expect(localDate(new Date('2026-11-21T05:30:00Z'), PHX)).toBe('2026-11-20');
  });

  it('turns local date + time into an instant', () => {
    expect(zonedInstant('2026-11-20', '16:00', PHX).toISOString()).toBe('2026-11-20T23:00:00.000Z');
    // Across DST: New York is UTC-4 in July, UTC-5 in December.
    expect(zonedInstant('2026-07-04', '12:00', NY).toISOString()).toBe('2026-07-04T16:00:00.000Z');
    expect(zonedInstant('2026-12-04', '12:00', NY).toISOString()).toBe('2026-12-04T17:00:00.000Z');
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
  });

  it('finds the next occurrence of a time', () => {
    const now = new Date('2026-11-21T04:00:00Z'); // 21:00 on the 20th
    expect(nextOccurrence('22:00', now, PHX).toISOString()).toBe('2026-11-21T05:00:00.000Z');
    expect(nextOccurrence('07:00', now, PHX).toISOString()).toBe('2026-11-21T14:00:00.000Z');
  });

  it('lists the nights of a stay', () => {
    expect(nightsOf('2026-11-20T23:00:00Z', '2026-11-23T18:00:00Z', PHX)).toEqual(['2026-11-20', '2026-11-21', '2026-11-22']);
  });
});
