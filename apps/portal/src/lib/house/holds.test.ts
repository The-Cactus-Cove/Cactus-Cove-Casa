import { describe, expect, it } from 'vitest';
import { holdOptions } from './holds.ts';
import type { Stay } from './types.ts';

const stay: Stay = {
  guestName: 'Sam',
  guests: 4,
  checkIn: '2026-11-20T23:00:00Z',
  checkOut: '2026-11-23T18:00:00Z',
  timeZone: 'America/Phoenix',
  checkedOutAt: null
};

describe('holdOptions', () => {
  it('offers 1h, 3h and tonight in the afternoon', () => {
    const now = new Date('2026-11-21T23:42:00Z'); // 4:42 PM
    expect(holdOptions(now, stay).map((o) => `${o.label} · ${o.until}`)).toEqual([
      'For 1 hour · 5:42 PM',
      'For 3 hours · 7:42 PM',
      'Until tonight · 10:00 PM'
    ]);
  });

  it('drops "tonight" once it is close or past', () => {
    const now = new Date('2026-11-22T04:45:00Z'); // 9:45 PM
    expect(holdOptions(now, stay).map((o) => o.label)).toEqual(['For 1 hour', 'For 3 hours']);
  });

  it('never runs past checkout', () => {
    const now = new Date('2026-11-23T16:30:00Z'); // 9:30 AM checkout day
    expect(holdOptions(now, stay).map((o) => o.label)).toEqual(['For 1 hour']);
  });
});
