import { error } from '@sveltejs/kit';
import { GUIDE_DIR } from '$app/env/private';
import { requireGuest } from '#lib/server/guest.ts';
import { requireLiveStay } from '#lib/server/portal.ts';
import { loadStaticFile } from '#lib/server/static-files.ts';
import type { RequestHandler } from './$types';

// Starlight's links all end in "/", so let them through untouched.
export const trailingSlash = 'ignore';

/** Serve the prebuilt Starlight guide, only to signed-in guests. */
export const GET: RequestHandler = async (event) => {
  // The guide holds house details (Wi-Fi and the like): only during the stay.
  requireLiveStay(requireGuest(event));
  const path = event.params.path;
  if (!path.includes('.') && !event.url.pathname.endsWith('/')) {
    return new Response(null, { status: 308, headers: { location: `${event.url.pathname}/` } });
  }

  const found = await loadStaticFile(GUIDE_DIR, path);
  const file = found ?? (await loadStaticFile(GUIDE_DIR, '404.html'));
  if (!file) error(404, 'Not found');

  const hashed = path.startsWith('_astro/');
  return new Response(new Uint8Array(file.body), {
    status: found ? 200 : 404,
    headers: {
      'content-type': file.type,
      // Private: the guide sits behind sign-in, so shared caches must not keep it.
      'cache-control': hashed ? 'private, max-age=31536000, immutable' : 'private, no-cache'
    }
  });
};
