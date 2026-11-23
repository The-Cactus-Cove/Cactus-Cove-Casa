import { describe, expect, it } from 'vitest';
import { stageOf } from './stage.ts';
import type { Stay } from './types.ts';

const stay: Stay = {
  guestName: 'Sam',
  guests: 4,
  checkIn: '2026-11-20T23:00:00Z', // Fri 4:00 PM Phoenix
  checkOut: '2026-11-23T18:00:00Z', // Mon 11:00 AM Phoenix
  timeZone: 'America/Phoenix',
  checkedOutAt: null
};

describe('stageOf', () => {
  it.each([
    ['2026-11-08T12:00:00Z', 'before'],
    ['2026-11-20T22:59:00Z', 'before'],
    ['2026-11-20T23:00:00Z', 'during'],
    ['2026-11-23T06:59:00Z', 'during'], // 11:59 PM Sunday local
    ['2026-11-23T07:00:00Z', 'checkout-day'], // midnight Monday local
    ['2026-11-23T17:59:00Z', 'checkout-day'],
    ['2026-11-23T18:00:00Z', 'ended']
  ])('at %s is %s', (now, stage) => {
    expect(stageOf(stay, new Date(now))).toBe(stage);
  });

  it('ends early when the guest checked out', () => {
    expect(stageOf({ ...stay, checkedOutAt: '2026-11-22T17:00:00Z' }, new Date('2026-11-22T18:00:00Z'))).toBe('ended');
  });
});
