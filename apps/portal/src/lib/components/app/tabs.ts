import type { IconName } from '../ui/Icon.svelte';
import type { TabBadges } from '#lib/house/badges.ts';

export interface Tab {
  href: string;
  label: string;
  icon: IconName;
  /** Badge text from the live counts, or null for none. */
  badge: (b: TabBadges) => string | null;
}

const count = (n: number) => (n > 0 ? String(n) : null);

export const TABS: Tab[] = [
  { href: '/', label: 'Home', icon: 'home', badge: () => null },
  { href: '/doors', label: 'Doors', icon: 'lock', badge: (b) => count(b.doors) },
  { href: '/thermostat', label: 'Thermostat', icon: 'thermometer', badge: (b) => (b.thermostat != null ? `${b.thermostat}°` : null) },
  { href: '/tvs', label: 'TVs', icon: 'tv', badge: (b) => count(b.tvs) }
];

/** Screen-reader wording for a badge. */
export const badgeLabel: Record<string, (v: string) => string> = {
  '/doors': (v) => `${v} unlocked or open`,
  '/thermostat': (v) => `${v} inside`,
  '/tvs': (v) => `${v} on`
};
