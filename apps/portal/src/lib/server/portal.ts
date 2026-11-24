import { CommandError, commandAllowed, type Command } from '#lib/house/commands.ts';
import { controlsLive, stageOf } from '#lib/house/stage.ts';
import type { PortalSnapshot } from '#lib/house/types.ts';
import { redirect } from '@sveltejs/kit';
import { config } from './config.ts';
import type { Guest } from './guest.ts';
import { house } from './house/index.ts';
import { reservations } from './reservations/index.ts';

/**
 * What this guest may see right now. Live house state only during the stay;
 * before check-in just the arrival temperature, after checkout nothing.
 */
export function snapshot(guest: Guest, now = new Date()): PortalSnapshot {
  const stage = stageOf(guest.stay, now);
  const live = controlsLive(stage);
  const state = house().state();
  return {
    stay: guest.stay,
    stage,
    house: live ? state : null,
    arrival: stage === 'before' ? { setpoint: state.thermostat.arrivalSetpoint } : null,
    wifi: live ? config().wifi : null
  };
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

/** Guard for pages that only make sense during the stay. */
export function requireLiveStay(guest: Guest | null): Guest {
  if (!guest || !controlsLive(stageOf(guest.stay, new Date()))) redirect(303, '/');
  return guest;
}

/** Re-read the guest (their reservation can change, e.g. after checkout). */
export const refreshGuest = (guest: Guest) => reservations().byId(guest.id);
