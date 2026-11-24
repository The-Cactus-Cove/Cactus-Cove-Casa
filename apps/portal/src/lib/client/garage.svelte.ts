import { confirmSheet } from './confirm.svelte.ts';
import type { Portal } from './portal.svelte.ts';

/** Give up showing "Opening…" if the sensor never reports. */
const TRAVEL_TIMEOUT_MS = 30_000;

/** Open/close the garage with a confirmation, showing travel until the sensor agrees. */
export class GarageControl {
  #target = $state<boolean | null>(null);
  #timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly portal: Portal) {}

  get open(): boolean {
    return this.portal.house?.garage.open ?? false;
  }

  /** Where the door is heading (true = opening), or null when it's at rest. */
  get moving(): boolean | null {
    return this.#target !== null && this.#target !== this.open ? this.#target : null;
  }

  get actionLabel() {
    return this.open ? 'Close garage' : 'Open garage';
  }

  async toggle() {
    const open = !this.open;
    const yes = await confirmSheet.ask(
      open
        ? { title: 'Open the garage door?', body: 'The door will start opening as soon as you confirm.', cta: 'Yes, open it' }
        : { title: 'Close the garage door?', body: 'Make sure nothing and nobody is under the door before it comes down.', cta: 'Yes, close it' }
    );
    if (!yes || !(await this.portal.send({ type: 'garage', open }, open ? 'Garage door opening…' : 'Garage door closing…'))) return;
    this.#target = open;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => (this.#target = null), TRAVEL_TIMEOUT_MS);
  }
}
