import { describe, expect, it } from 'vitest';
import { tabBadges } from './badges.ts';
import type { HouseState } from './types.ts';

const house = (patch: Partial<HouseState> = {}): HouseState => ({
  garage: { open: false },
  away: { adjustThermostat: true, setpoint: 78 },
  locks: [
    { id: 'front', name: 'Front door', note: '', locked: true, holdUntil: null },
    { id: 'entry', name: 'Garage entry door', note: '', locked: true, holdUntil: null }
  ],
  thermostat: { current: 77, setpoint: 74, mode: 'cool', arrivalSetpoint: 72 },
  tvs: [],
  doors: [],
  ...patch
});

describe('tabBadges', () => {
  it('counts unlocked doors and an open garage', () => {
    const h = house({ garage: { open: true } });
    h.locks[0].locked = false;
    expect(tabBadges(h).doors).toBe(2);
    expect(tabBadges(house()).doors).toBe(0);
  });

  it('shows the indoor temperature and TVs on', () => {
    const tv = (on: boolean) => ({ on }) as HouseState['tvs'][number];
    expect(tabBadges(house({ tvs: [tv(true), tv(false), tv(true)] }))).toMatchObject({ thermostat: 77, tvs: 2 });
  });
});
