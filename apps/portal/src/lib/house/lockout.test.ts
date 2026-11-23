import { describe, expect, it } from 'vitest';
import { lockedOut } from './lockout.ts';
import type { Lockout } from './types.ts';

const PHX = 'America/Phoenix';
const at = (local: string) => new Date(`${local}:00-07:00`);
const base: Lockout = { enabled: true, from: '20:30', to: '07:00', scope: { kind: 'stay' } };

describe('lockedOut', () => {
  it('covers windows that cross midnight', () => {
    expect(lockedOut(base, at('2026-11-21T20:29'), PHX)).toBe(false);
    expect(lockedOut(base, at('2026-11-21T20:30'), PHX)).toBe(true);
    expect(lockedOut(base, at('2026-11-22T06:59'), PHX)).toBe(true);
    expect(lockedOut(base, at('2026-11-22T07:00'), PHX)).toBe(false);
  });

  it('handles same-day windows', () => {
    const nap = { ...base, from: '13:00', to: '15:00' };
    expect(lockedOut(nap, at('2026-11-21T14:00'), PHX)).toBe(true);
    expect(lockedOut(nap, at('2026-11-21T16:00'), PHX)).toBe(false);
  });

  it('limits a single-night lockout to that night, including its morning', () => {
    const one: Lockout = { ...base, scope: { kind: 'night', night: '2026-11-21' } };
    expect(lockedOut(one, at('2026-11-21T21:00'), PHX)).toBe(true);
    expect(lockedOut(one, at('2026-11-22T06:00'), PHX)).toBe(true);
    expect(lockedOut(one, at('2026-11-22T21:00'), PHX)).toBe(false);
    expect(lockedOut(one, at('2026-11-20T21:00'), PHX)).toBe(false);
  });

  it('does nothing when disabled', () => {
    expect(lockedOut({ ...base, enabled: false }, at('2026-11-21T22:00'), PHX)).toBe(false);
  });
});
