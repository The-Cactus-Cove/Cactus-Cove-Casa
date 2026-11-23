import type { Handle, ServerInit } from '@sveltejs/kit/hooks';
import { config } from '#lib/server/config.ts';
import { resolveGuest } from '#lib/server/guest.ts';

/** Fail fast on bad configuration instead of on the first guest request. */
export const init: ServerInit = () => {
  const { haMock } = config();
  console.log(`[portal] started (${haMock ? 'mock Home Assistant' : 'live Home Assistant'})`);
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.guest = resolveGuest(event);
  return resolve(event);
};
