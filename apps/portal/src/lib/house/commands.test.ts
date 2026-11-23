import { describe, expect, it } from 'vitest';
import { CommandError, commandAllowed, parseCommand } from './commands.ts';

describe('parseCommand', () => {
  it('accepts valid commands', () => {
    expect(parseCommand({ type: 'thermostat', setpoint: 72, mode: 'cool' })).toEqual({ type: 'thermostat', setpoint: 72, mode: 'cool' });
    expect(parseCommand({ type: 'lock', lockId: 'front', locked: false, holdUntil: '2026-11-21T05:00:00Z' })).toEqual({
      type: 'lock',
      lockId: 'front',
      locked: false,
      holdUntil: '2026-11-21T05:00:00.000Z'
    });
    expect(
      parseCommand({
        type: 'tv-lockout',
        tvId: 'kids',
        lockout: { enabled: true, from: '20:30', to: '07:00', scope: { kind: 'night', night: '2026-11-21' } }
      })
    ).toMatchObject({ lockout: { scope: { kind: 'night', night: '2026-11-21' } } });
  });

  it('drops unknown fields', () => {
    expect(parseCommand({ type: 'garage', open: true, entity: 'lock.everything' })).toEqual({ type: 'garage', open: true });
  });

  it.each([
    [null],
    [{ type: 'nuke' }],
    [{ type: 'thermostat', setpoint: 90, mode: 'cool' }],
    [{ type: 'thermostat', setpoint: 72.5, mode: 'cool' }],
    [{ type: 'thermostat', setpoint: 72, mode: 'auto' }],
    [{ type: 'tv-sleep', tvId: 'living', sleep: { kind: 'in', hours: 5 } }],
    [{ type: 'tv-sleep', tvId: 'living', sleep: { kind: 'at', time: '25:00' } }],
    [{ type: 'tv-key', tvId: 'living', key: 'power_off_everything' }],
    [{ type: 'lock', lockId: 'front', locked: false, holdUntil: 'soon' }]
  ])('rejects %j', (input) => {
    expect(() => parseCommand(input)).toThrow(CommandError);
  });
});

describe('commandAllowed', () => {
  it('only allows the arrival temperature before check-in', () => {
    expect(commandAllowed('arrival-temperature', 'before')).toBe(true);
    expect(commandAllowed('garage', 'before')).toBe(false);
    expect(commandAllowed('tv-power', 'before')).toBe(false);
  });

  it('allows controls during the stay and on checkout day', () => {
    for (const stage of ['during', 'checkout-day'] as const) {
      expect(commandAllowed('garage', stage)).toBe(true);
      expect(commandAllowed('checkout', stage)).toBe(true);
      expect(commandAllowed('arrival-temperature', stage)).toBe(false);
    }
  });

  it('allows nothing after checkout', () => {
    for (const type of ['garage', 'lock', 'thermostat', 'tv-power', 'checkout', 'arrival-temperature'] as const) {
      expect(commandAllowed(type, 'ended')).toBe(false);
    }
  });
});
