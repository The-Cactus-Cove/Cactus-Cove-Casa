import { requireGuest } from '#lib/server/guest.ts';
import { house } from '#lib/server/house/index.ts';
import { refreshGuest, snapshot } from '#lib/server/portal.ts';
import type { RequestHandler } from './$types';

/** Also re-send on a timer so countdowns and stage changes stay right. */
const TICK_MS = 30_000;

/** Server-sent events: a full snapshot on connect and after every change. */
export const GET: RequestHandler = (event) => {
  const guest = requireGuest(event);
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const send = async () => {
        if (closed) return;
        const fresh = (await refreshGuest(guest)) ?? guest;
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`event: snapshot\ndata: ${JSON.stringify(snapshot(fresh))}\n\n`));
        } catch {
          cleanup(); // client went away mid-send
        }
      };
      const unsubscribe = house().subscribe(() => void send());
      const tick = setInterval(() => void send(), TICK_MS);
      cleanup = () => {
        closed = true;
        unsubscribe();
        clearInterval(tick);
      };
      event.request.signal.addEventListener('abort', () => cleanup());
      void send();
    },
    cancel() {
      cleanup();
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      // Stop NGINX buffering the stream.
      'x-accel-buffering': 'no'
    }
  });
};
