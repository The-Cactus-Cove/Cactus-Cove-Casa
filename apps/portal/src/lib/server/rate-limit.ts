/** Fixed-window attempt counter, in memory (one portal process). */
export class RateLimiter {
  #hits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private max: number,
    private windowMs: number
  ) {}

  /** Record an attempt. Returns false when the key is over its limit. */
  attempt(key: string, now = Date.now()): boolean {
    const entry = this.#hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.#hits.set(key, { count: 1, resetAt: now + this.windowMs });
      this.#prune(now);
      return true;
    }
    entry.count += 1;
    return entry.count <= this.max;
  }

  reset(key: string) {
    this.#hits.delete(key);
  }

  #prune(now: number) {
    if (this.#hits.size < 1000) return;
    for (const [key, entry] of this.#hits) if (entry.resetAt <= now) this.#hits.delete(key);
  }
}
