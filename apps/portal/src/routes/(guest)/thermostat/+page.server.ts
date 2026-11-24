import { requireLiveStay } from '#lib/server/portal.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  requireLiveStay(locals.guest);
};
