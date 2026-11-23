import type { Lockout } from '#lib/house/types.ts';

/**
 * The devices at Cactus Cove. Ids are the portal's own; the Home Assistant
 * backend maps them to entities.
 */
export const LOCKS = [
  { id: 'front', name: 'Front door', note: 'Your 4 digits also work on the door keypad.' },
  { id: 'entry', name: 'Garage entry door', note: 'The door between the garage and the house.' }
] as const;

const lockout = (enabled: boolean, from = '22:00'): Lockout => ({ enabled, from, to: '07:00', scope: { kind: 'stay' } });

export const TVS = [
  { id: 'living', label: 'Living room', lockout: lockout(false) },
  { id: 'family', label: 'Family room', lockout: lockout(false) },
  { id: 'master', label: 'Master bedroom', lockout: lockout(false) },
  { id: 'secondary', label: 'Secondary bedroom', lockout: lockout(false) },
  { id: 'kids', label: "Kid's room", lockout: lockout(true, '20:30') }
] as const;

/** Contact sensors. The garage door's sensor also drives the garage card. */
export const DOORS = [
  { id: 'front', name: 'Front door' },
  { id: 'entry', name: 'Garage entry door' },
  { id: 'patio', name: 'Back patio door' },
  { id: 'garage', name: 'Garage door' }
] as const;

export const tvName = (label: string) => `${label} TV`;
