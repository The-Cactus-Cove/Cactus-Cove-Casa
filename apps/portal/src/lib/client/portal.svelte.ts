import { getContext, setContext } from 'svelte';
import type { Command } from '#lib/house/commands.ts';
import type { PortalSnapshot } from '#lib/house/types.ts';
import { toast } from './toast.svelte.ts';

const KEY = Symbol('portal');
const CLOCK_MS = 15_000;

/** The signed-in guest's live view of their stay and the house. */
export class Portal {
  snapshot = $state() as PortalSnapshot;
  now = $state(new Date());

  constructor(initial: PortalSnapshot) {
    this.snapshot = initial;
  }

  get stay() {
    return this.snapshot.stay;
  }
  get stage() {
    return this.snapshot.stage;
  }
  get house() {
    return this.snapshot.house;
  }
  get timeZone() {
    return this.snapshot.stay.timeZone;
  }

  /** Send a command. Shows `done` (or the server's message) as a toast. Resolves true on success. */
  async send(command: Command, done?: string): Promise<boolean> {
    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(command)
      });
      if (res.redirected) {
        location.assign(res.url); // session ended
        return false;
      }
      const body = await res.json();
      if (!res.ok) {
        toast.show(body.message ?? 'Something went wrong. Try again.');
        return false;
      }
      this.snapshot = body;
      if (done) toast.show(done);
      return true;
    } catch {
      toast.show('No connection. Check your Wi-Fi and try again.');
      return false;
    }
  }

  /** Live updates and the countdown clock. Returns a cleanup function. */
  connect(): () => void {
    const events = new EventSource('/api/events');
    events.addEventListener('snapshot', (e) => (this.snapshot = JSON.parse((e as MessageEvent).data)));
    const clock = setInterval(() => (this.now = new Date()), CLOCK_MS);
    return () => {
      events.close();
      clearInterval(clock);
    };
  }
}

export const setPortal = (portal: Portal) => setContext(KEY, portal);
export const getPortal = () => getContext<Portal>(KEY);
