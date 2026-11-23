/** Hold a draft while the guest is still tapping, then apply it once they stop. */
export class Settle<T> {
  draft = $state<T | null>(null);
  status = $state<'idle' | 'pending' | 'saved'>('idle');
  #timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly apply: (value: T) => Promise<boolean>,
    private readonly ms = 1000
  ) {}

  set(value: T) {
    this.draft = value;
    this.status = 'pending';
    this.#restart(() => this.#flush(), this.ms);
  }

  async #flush() {
    if (this.draft === null) return;
    const ok = await this.apply(this.draft);
    this.draft = null;
    this.status = ok ? 'saved' : 'idle';
    if (ok) this.#restart(() => (this.status = 'idle'), 3000);
  }

  #restart(fn: () => void, ms: number) {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(fn, ms);
  }
}
