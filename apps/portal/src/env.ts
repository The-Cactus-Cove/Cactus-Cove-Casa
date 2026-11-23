import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (fallback: string) => (value: string | undefined) => value || fallback;

/**
 * Runtime environment (see .env.example). Schemas only normalise values: route
 * analysis at build time runs them too, so cross-field and required checks live
 * in #lib/server/config and run from the init hook when the server starts.
 */
export const variables = defineEnvVars({
  HA_MOCK: {
    description: 'Use the built-in fake Home Assistant instead of a real one',
    schema: (value) => value === 'true'
  },
  HA_URL: {
    description: 'Base URL of Home Assistant, e.g. http://host.docker.internal:8123',
    schema: (value) => (value ? value.replace(/\/+$/, '') : '')
  },
  HA_TOKEN: {
    description: 'Long-lived access token for the portal’s Home Assistant user',
    schema: optional('')
  },
  SESSION_SECRET: {
    description: 'Secret (32+ chars) for signing session cookies and stay links',
    schema: optional('')
  },
  GUIDE_DIR: {
    description: 'Directory holding the built Starlight guide',
    schema: optional('../guide/dist')
  },
  PROPERTY_TIMEZONE: {
    description: 'IANA time zone of the property',
    schema: optional('America/Phoenix')
  },
  WIFI_SSID: { description: 'Guest Wi-Fi network name', schema: optional('') },
  WIFI_PASSWORD: { description: 'Guest Wi-Fi password', schema: optional('') },
  HOST_PHONE: { description: 'Host phone number guests can text, e.g. +15205550100', schema: optional('') },
  REVIEW_URL: { description: 'Where the "Leave us a review" link goes', schema: optional('') },
  PORTAL_ORIGIN: {
    description: 'Public origin of the portal, e.g. https://stay.cactuscove.casa',
    schema: optional('http://localhost:3000')
  }
});
