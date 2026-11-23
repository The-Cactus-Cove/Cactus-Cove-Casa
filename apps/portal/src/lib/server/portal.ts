import { CommandError, commandAllowed, type Command } from '#lib/house/commands.ts';
import { stageOf } from '#lib/house/stage.ts';
import type { PortalSnapshot } from '#lib/house/types.ts';
import type { Guest } from './guest.ts';
import { house } from './house/index.ts';
import { reservations } from './reservations/index.ts';

/** What this guest may see right now. */
export function snapshot(guest: Guest, now = new Date()): PortalSnapshot {
  const stage = stageOf(guest.stay, now);
  return { stay: guest.stay, stage, house: stage === 'ended' ? null : house().state() };
}

/** Run a guest's command after checking their stage allows it. */
export async function execute(guest: Guest, command: Command, now = new Date()): Promise<void> {
  const stage = stageOf(guest.stay, now);
  if (!commandAllowed(command.type, stage)) {
    throw new CommandError(stage === 'ended' ? 'Your stay has ended' : 'That isn’t available yet');
  }
  await house().run(command, { stay: guest.stay, now });
  if (command.type === 'checkout') await reservations().markCheckedOut(guest.id, now);
}

/** Re-read the guest (their reservation can change, e.g. after checkout). */
export const refreshGuest = (guest: Guest) => reservations().byId(guest.id);
