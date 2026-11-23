import { error, redirect } from '@sveltejs/kit';
import { DEMO_STAGES, type DemoStage } from '#lib/server/reservations/mock.ts';
import { mockReservations } from '#lib/server/reservations/index.ts';
import type { RequestHandler } from './$types';

/** Mock mode only: move the demo stay to another stage. */
export const POST: RequestHandler = async ({ request }) => {
  const mock = mockReservations();
  if (!mock) error(404, 'Not found');
  const stage = String((await request.formData()).get('stage'));
  if (!DEMO_STAGES.includes(stage as DemoStage)) error(400, 'Unknown stage');
  mock.setStage(stage as DemoStage);
  redirect(303, '/');
};
