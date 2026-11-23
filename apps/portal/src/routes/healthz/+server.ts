import { text } from '@sveltejs/kit';

/** Liveness probe for Docker and the reverse proxy. */
export function GET() {
  return text('ok\n', { headers: { 'cache-control': 'no-store' } });
}
