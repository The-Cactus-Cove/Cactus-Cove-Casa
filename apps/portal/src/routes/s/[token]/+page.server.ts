import { fail, redirect } from '@sveltejs/kit';
import { config } from '#lib/server/config.ts';
import { sessionExpiry, signIn } from '#lib/server/auth.ts';
import { startSession } from '#lib/server/session.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, params }) => {
  if (locals.guest?.token === params.token) redirect(303, '/');
  return { hostPhone: config().houseInfo.hostPhone };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await event.request.formData();
    const pin = String(form.get('pin') ?? '').replace(/\D/g, '');
    if (pin.length !== 4) return fail(400, { error: 'Enter all 4 digits to continue.' });

    const result = await signIn(event.params.token, pin, event.getClientAddress());
    if (!result.ok) {
      return fail(result.reason === 'limited' ? 429 : 400, {
        error:
          result.reason === 'limited'
            ? 'Too many tries. Wait 15 minutes, or text your host.'
            : 'Those digits don’t match this stay link. Check your booking phone number.'
      });
    }
    startSession(event.cookies, result.reservation.id, sessionExpiry(result.reservation));
    redirect(303, '/');
  }
};
