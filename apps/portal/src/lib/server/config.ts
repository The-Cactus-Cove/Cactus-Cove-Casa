import {
  HA_MOCK,
  HA_TOKEN,
  HA_URL,
  HOST_PHONE,
  PORTAL_ORIGIN,
  PROPERTY_TIMEZONE,
  REVIEW_URL,
  SESSION_SECRET,
  WIFI_PASSWORD,
  WIFI_SSID
} from '$app/env/private';
import type { HouseInfo } from '#lib/house/types.ts';

/** Runtime configuration. Validated on first use; hooks.server.ts calls this at startup. */
export interface Config {
  haMock: boolean;
  haUrl: string;
  haToken: string;
  sessionSecret: string;
  portalOrigin: string;
  timeZone: string;
  houseInfo: HouseInfo;
}

let cached: Config | undefined;

function validTimeZone(zone: string): string {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return zone;
  } catch {
    throw new Error(`PROPERTY_TIMEZONE "${zone}" is not a valid IANA time zone`);
  }
}

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
    portalOrigin: PORTAL_ORIGIN,
    timeZone: validTimeZone(PROPERTY_TIMEZONE),
    houseInfo: {
      wifi: WIFI_SSID ? { ssid: WIFI_SSID, password: WIFI_PASSWORD } : null,
      hostPhone: HOST_PHONE || null,
      reviewUrl: REVIEW_URL || null
    }
  };
  return cached;
}
