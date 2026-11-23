import { error, json } from '@sveltejs/kit';
import { CommandError, parseCommand } from '#lib/house/commands.ts';
import { requireGuest } from '#lib/server/guest.ts';
import { execute, refreshGuest, snapshot } from '#lib/server/portal.ts';
import type { RequestHandler } from './$types';

/** Run one command. Responds with the new snapshot, or 400/403 with a message. */
export const POST: RequestHandler = async (event) => {
  const guest = requireGuest(event);
  let body: unknown;
  try {
    body = await event.request.json();
  } catch {
    error(400, 'Expected a JSON body');
  }
  try {
    await execute(guest, parseCommand(body));
  } catch (err) {
    if (err instanceof CommandError) return json({ message: err.message }, { status: 400 });
    console.error('[portal] command failed', err);
    return json({ message: 'The house didn’t respond. Try again in a moment.' }, { status: 502 });
  }
  const fresh = (await refreshGuest(guest)) ?? guest;
  return json(snapshot(fresh));
};
