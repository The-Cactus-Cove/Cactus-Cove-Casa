import { redirect } from '@sveltejs/kit';
import { endSession } from '#lib/server/session.ts';
import type { RequestHandler } from './$types';

/** Sign out, landing back on this stay's sign-in page. */
export const POST: RequestHandler = ({ cookies, locals }) => {
  const token = locals.guest?.token;
  endSession(cookies);
  redirect(303, token ? `/s/${encodeURIComponent(token)}` : '/');
};
