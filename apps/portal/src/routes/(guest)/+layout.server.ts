import { config } from '#lib/server/config.ts';
import { snapshot } from '#lib/server/portal.ts';
import { DEMO_STAGES } from '#lib/server/reservations/mock.ts';
import { mockReservations } from '#lib/server/reservations/index.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  const guest = locals.guest;
  if (!guest) return { signedIn: false as const };
  const mock = mockReservations();
  return {
    signedIn: true as const,
    snapshot: snapshot(guest),
    contact: config().contact,
    demo: mock ? { stage: mock.stage, stages: DEMO_STAGES } : null
  };
};
