import type { HVAC_MODES, SLEEP_HOURS, TV_KEYS } from './limits.ts';

/** Where the guest is in their stay. Drives what the portal lets them do. */
export type Stage = 'before' | 'during' | 'checkout-day' | 'ended';

/** Times are ISO-8601 strings so state serialises cleanly to the browser. */
export interface Stay {
  guestName: string;
  guests: number | null;
  checkIn: string;
  checkOut: string;
  /** IANA zone of the property, e.g. America/Phoenix. */
  timeZone: string;
  /** Set when the guest checked out early from the portal. */
  checkedOutAt: string | null;
}

export type HvacMode = (typeof HVAC_MODES)[number];
export type SleepHours = (typeof SLEEP_HOURS)[number];
export type TvKey = (typeof TV_KEYS)[number];
/** Local wall-clock time, "HH:MM" (24h). */
export type ClockTime = string;
/** Local calendar date, "YYYY-MM-DD". */
export type LocalDate = string;

export interface LockState {
  id: string;
  name: string;
  note: string;
  locked: boolean;
  /** When a "keep unlocked" hold ends, or null. */
  holdUntil: string | null;
}

export interface GarageState {
  open: boolean;
}

export interface ThermostatState {
  /** Indoor temperature, when the thermostat reports one. */
  current: number | null;
  setpoint: number;
  mode: HvacMode;
  /** Setpoint applied before check-in. */
  arrivalSetpoint: number;
}

export type SleepTimer =
  | { kind: 'off' }
  | { kind: 'in'; hours: SleepHours; endsAt: string }
  | { kind: 'at'; time: ClockTime; endsAt: string };

export type LockoutScope = { kind: 'stay' } | { kind: 'night'; night: LocalDate };

export interface Lockout {
  enabled: boolean;
  from: ClockTime;
  to: ClockTime;
  scope: LockoutScope;
}

export interface TvState {
  id: string;
  /** Short label for tabs, e.g. "Family room". */
  label: string;
  /** Full name, e.g. "Family room TV". */
  name: string;
  on: boolean;
  /** False when the TV can't be reached (unplugged, off at the wall). */
  available: boolean;
  sleep: SleepTimer;
  lockout: Lockout;
}

export interface DoorState {
  id: string;
  name: string;
  open: boolean;
}

/** What "Heading out" does with the thermostat. Chosen by the guest. */
export interface AwaySettings {
  adjustThermostat: boolean;
  setpoint: number;
}

export interface HouseState {
  garage: GarageState;
  away: AwaySettings;
  locks: LockState[];
  thermostat: ThermostatState;
  tvs: TvState[];
  doors: DoorState[];
}

export interface Wifi {
  ssid: string;
  password: string;
}

/** How to reach the host; shown at every stage. */
export interface Contact {
  hostPhone: string | null;
  reviewUrl: string | null;
}

/** Everything the dashboard needs, sent on load and over the event stream. */
export interface PortalSnapshot {
  stay: Stay;
  stage: Stage;
  /** Live house state, only while the stay is on (during / checkout day). */
  house: HouseState | null;
  /** Before check-in the guest only gets the arrival temperature: no live data. */
  arrival: { setpoint: number } | null;
  /** Guest Wi-Fi, only during the stay. */
  wifi: Wifi | null;
}
