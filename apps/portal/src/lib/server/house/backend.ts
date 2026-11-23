import type { Command } from '#lib/house/commands.ts';
import type { HouseState, Stay } from '#lib/house/types.ts';

export interface CommandContext {
  stay: Stay;
  now: Date;
}

/** The house as the portal sees it. Mock in development, Home Assistant in production. */
export interface HouseBackend {
  /** Current state of every device. */
  state(): HouseState;
  /** Carry out a validated, stage-checked command. Throws CommandError for bad targets. */
  run(command: Command, ctx: CommandContext): Promise<void>;
  /** Called whenever any device state changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

/** Tiny listener set shared by backends. */
export class Listeners {
  #set = new Set<() => void>();
  add(fn: () => void) {
    this.#set.add(fn);
    return () => void this.#set.delete(fn);
  }
  emit() {
    for (const fn of this.#set) fn();
  }
}
