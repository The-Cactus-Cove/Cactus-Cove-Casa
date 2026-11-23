import { config } from '#lib/server/config.ts';
import { snapshot } from '#lib/server/portal.ts';
import { DEMO_STAGES } from '#lib/server/reservations/mock.ts';
import { mockReservations } from '#lib/server/reservations/index.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  const guest = locals.guest;
  if (!guest) return { signedIn: false as const };
  const mock = mockReservations();
  return {
    signedIn: true as const,
    snapshot: snapshot(guest),
    info: config().houseInfo,
    demo: mock ? { stage: mock.stage, stages: DEMO_STAGES } : null
  };
};
