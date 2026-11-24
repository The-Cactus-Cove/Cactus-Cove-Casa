import type { Command } from '#lib/house/commands.ts';
import { DEFAULT_AWAY_SETPOINT } from '#lib/house/limits.ts';
import type { HouseState, LockState, TvState } from '#lib/house/types.ts';
import { Listeners, type CommandContext, type HouseBackend } from './backend.ts';
import { DOORS, LOCKS, TVS, tvName } from './layout.ts';
import { assertNotLockedOut, byId, checkHold, resolveSleep } from './rules.ts';

const GARAGE_TRAVEL_MS = 3000;
const AUTO_RELOCK_MS = 60_000;

/** In-memory house for development and demos. Behaves like the real one, minus the hardware. */
export class MockHouse implements HouseBackend {
  #listeners = new Listeners();
  #timers = new Map<string, NodeJS.Timeout>();
  #state: HouseState = {
    garage: { open: false },
    away: { adjustThermostat: true, setpoint: DEFAULT_AWAY_SETPOINT },
    locks: LOCKS.map((l) => ({ ...l, locked: true, holdUntil: null })),
    thermostat: { current: 77, setpoint: 74, mode: 'cool', arrivalSetpoint: 72 },
    tvs: TVS.map((t) => ({
      id: t.id,
      label: t.label,
      name: tvName(t.label),
      on: t.id === 'living',
      available: true,
      sleep: { kind: 'off' },
      lockout: structuredClone(t.lockout)
    })),
    doors: DOORS.map((d) => ({ ...d, open: false }))
  };

  state(): HouseState {
    return structuredClone(this.#state);
  }

  subscribe(listener: () => void) {
    return this.#listeners.add(listener);
  }

  async run(command: Command, ctx: CommandContext): Promise<void> {
    const s = this.#state;
    switch (command.type) {
      case 'garage':
        this.#later('garage', GARAGE_TRAVEL_MS, () => this.#setGarage(command.open));
        return; // state changes when the door finishes moving
      case 'lock': {
        const lock = this.#lock(command.lockId);
        if (command.locked) this.#relock(lock);
        else this.#unlock(lock, checkHold(command.holdUntil, ctx));
        break;
      }
      case 'all-locks': {
        const until = command.locked ? null : checkHold(command.holdUntil, ctx);
        for (const lock of s.locks) {
          if (command.locked) this.#relock(lock);
          else this.#unlock(lock, until);
        }
        break;
      }
      case 'lock-up':
        this.#lockUp();
        break;
      case 'tvs-off':
        this.#tvsOff();
        break;
      case 'tvs-lockout':
        for (const tv of s.tvs) tv.lockout = structuredClone(command.lockout);
        break;
      case 'thermostat':
        s.thermostat.setpoint = command.setpoint;
        s.thermostat.mode = command.mode;
        break;
      case 'arrival-temperature':
        s.thermostat.arrivalSetpoint = command.setpoint;
        break;
      case 'tv-power': {
        const tv = this.#tv(command.tvId);
        if (command.on) assertNotLockedOut(tv, ctx);
        tv.on = command.on;
        break;
      }
      case 'tv-key':
        this.#tv(command.tvId); // the mock just accepts the key press
        return;
      case 'tv-sleep': {
        const tv = this.#tv(command.tvId);
        tv.sleep = resolveSleep(command.sleep, ctx);
        if (tv.sleep.kind === 'off') this.#cancel(`sleep:${tv.id}`);
        else this.#later(`sleep:${tv.id}`, Date.parse(tv.sleep.endsAt) - Date.now(), () => this.#sleepFired(tv));
        break;
      }
      case 'tv-lockout':
        this.#tv(command.tvId).lockout = command.lockout;
        break;
      case 'away-settings':
        s.away = { adjustThermostat: command.adjustThermostat, setpoint: command.setpoint };
        break;
      case 'heading-out':
        this.#secure();
        if (s.away.adjustThermostat) s.thermostat.setpoint = s.away.setpoint;
        break;
      case 'checkout':
        this.#secure();
        break;
    }
    this.#listeners.emit();
  }

  #lock(id: string): LockState {
    return byId(this.#state.locks, id, 'lock');
  }

  #tv(id: string): TvState {
    return byId(this.#state.tvs, id, 'TV');
  }

  #setGarage(open: boolean) {
    this.#state.garage.open = open;
    const sensor = this.#state.doors.find((d) => d.id === 'garage');
    if (sensor) sensor.open = open;
    this.#listeners.emit();
  }

  #relock(lock: LockState) {
    this.#cancel(`lock:${lock.id}`);
    lock.locked = true;
    lock.holdUntil = null;
    this.#listeners.emit();
  }

  #sleepFired(tv: TvState) {
    tv.on = false;
    tv.sleep = { kind: 'off' };
    this.#listeners.emit();
  }

  #unlock(lock: LockState, until: Date | null) {
    lock.locked = false;
    lock.holdUntil = until?.toISOString() ?? null;
    this.#later(`lock:${lock.id}`, until ? until.getTime() - Date.now() : AUTO_RELOCK_MS, () => this.#relock(lock));
  }

  /** Lock every door and close the garage (night-time "Lock up"). */
  #lockUp() {
    for (const lock of this.#state.locks) this.#relock(lock);
    this.#setGarage(false);
  }

  #tvsOff() {
    for (const tv of this.#state.tvs) {
      this.#cancel(`sleep:${tv.id}`);
      tv.on = false;
      tv.sleep = { kind: 'off' };
    }
  }

  /** Lock up and switch off every TV (Heading out, checkout). */
  #secure() {
    this.#lockUp();
    this.#tvsOff();
  }

  #later(key: string, ms: number, fn: () => void) {
    this.#cancel(key);
    this.#timers.set(key, setTimeout(() => (this.#timers.delete(key), fn()), Math.max(0, ms)));
  }

  #cancel(key: string) {
    clearTimeout(this.#timers.get(key));
    this.#timers.delete(key);
  }
}
