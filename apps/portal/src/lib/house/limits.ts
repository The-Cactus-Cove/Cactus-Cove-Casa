/** House rules the portal enforces on both the client and the server. */
export const THERMOSTAT = { min: 68, max: 80 } as const;
export const HVAC_MODES = ['cool', 'heat', 'off'] as const;
export const SLEEP_HOURS = [1, 2, 3] as const;
/** Longest a guest can hold a door unlocked. */
export const MAX_HOLD_HOURS = 12;
/** "Until tonight" hold option. */
export const TONIGHT_HOLD_TIME = '22:00';
/** Arrival temperature is applied this long before check-in. */
export const PRECONDITION_HOURS = 3;
export const TV_KEYS = ['up', 'down', 'left', 'right', 'select', 'back', 'home', 'play', 'volume_up', 'volume_down', 'volume_mute'] as const;
