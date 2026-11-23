import { HA_MOCK, HA_TOKEN, HA_URL, PORTAL_ORIGIN, SESSION_SECRET } from '$app/env/private';

/** Runtime configuration. Validated on first use; hooks.server.ts calls this at startup. */
export interface Config {
  haMock: boolean;
  haUrl: string;
  haToken: string;
  sessionSecret: string;
  portalOrigin: string;
}

let cached: Config | undefined;

export function config(): Config {
  if (cached) return cached;
  if (!HA_MOCK && (!HA_URL || !HA_TOKEN)) {
    throw new Error('HA_URL and HA_TOKEN are required unless HA_MOCK=true');
  }
  if (SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
  cached = {
    haMock: HA_MOCK,
    haUrl: HA_URL,
    haToken: HA_TOKEN,
    sessionSecret: SESSION_SECRET,
    portalOrigin: PORTAL_ORIGIN
  };
  return cached;
}
