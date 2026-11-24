import type { HouseState } from './types.ts';

export interface TabBadges {
  /** Unlocked doors, plus the garage door when it's open. */
  doors: number;
  /** Indoor temperature, when known. */
  thermostat: number | null;
  /** TVs that are on. */
  tvs: number;
}

/** Quick-glance numbers for the tab bar. */
export function tabBadges(house: HouseState): TabBadges {
  return {
    doors: house.locks.filter((l) => !l.locked).length + (house.garage.open ? 1 : 0),
    thermostat: house.thermostat.current,
    tvs: house.tvs.filter((t) => t.on).length
  };
}
