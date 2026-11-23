import type { ClockTime, LocalDate } from './types.ts';

/** "07:00" → "7:00 AM" */
export function formatClock(time: ClockTime): string {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Instant → "4:00 PM" in the property's zone. */
export const formatTime = (iso: string | Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));

/** Instant → "Fri, Nov 20" in the property's zone. */
export const formatDay = (iso: string | Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso));

/** "2026-11-20" → "Fri, Nov 20" */
export const formatLocalDate = (date: LocalDate) => formatDay(`${date}T12:00:00Z`, 'UTC');

/** Milliseconds → "12d 04h 31m", "1d 18h 05m", "2h 15m". */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${h}h ${pad(m)}m`;
}
