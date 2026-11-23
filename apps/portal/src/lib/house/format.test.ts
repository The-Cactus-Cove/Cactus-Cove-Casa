import { describe, expect, it } from 'vitest';
import { formatClock, formatCountdown, formatDay, formatLocalDate, formatTime } from './format.ts';

describe('format', () => {
  it('formats clock times', () => {
    expect(formatClock('07:00')).toBe('7:00 AM');
    expect(formatClock('00:05')).toBe('12:05 AM');
    expect(formatClock('20:30')).toBe('8:30 PM');
  });

  it('formats instants in the property zone', () => {
    expect(formatTime('2026-11-20T23:00:00Z', 'America/Phoenix')).toBe('4:00 PM');
    expect(formatDay('2026-11-21T05:00:00Z', 'America/Phoenix')).toBe('Fri, Nov 20');
    expect(formatLocalDate('2026-11-23')).toBe('Mon, Nov 23');
  });

  it('formats countdowns like the mockup', () => {
    expect(formatCountdown((12 * 1440 + 4 * 60 + 31) * 60000)).toBe('12d 04h 31m');
    expect(formatCountdown((2 * 60 + 15) * 60000)).toBe('2h 15m');
    expect(formatCountdown(-5)).toBe('0h 00m');
  });
});
