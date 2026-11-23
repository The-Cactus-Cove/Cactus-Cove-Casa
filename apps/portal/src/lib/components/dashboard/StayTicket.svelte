<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatCountdown, formatDay, formatTime } from '#lib/house/format.ts';
  import { localDate, nightsOf } from '#lib/house/time.ts';
  import Label from '../ui/Label.svelte';

  const portal = getPortal();
  const stay = $derived(portal.stay);
  const tz = $derived(stay.timeZone);
  const before = $derived(portal.stage === 'before');
  const target = $derived(before ? stay.checkIn : stay.checkOut);
  const nights = $derived(nightsOf(stay.checkIn, stay.checkOut, tz));
  const night = $derived(Math.min(nights.length, Math.max(1, nights.indexOf(localDate(portal.now, tz)) + 1)));

  const sub = $derived.by(() => {
    const when = `${formatDay(target, tz)} at ${formatTime(target, tz)}`;
    if (before) return when;
    if (portal.stage === 'checkout-day') return `Today at ${formatTime(target, tz)}`;
    return `Night ${night} of ${nights.length} · ${when}`;
  });
</script>

<section class="ticket" aria-label="Your stay">
  <div class="top">
    <Label tone="gold">{before ? 'Check-in in' : 'Check-out in'}</Label>
    <span class="count">{formatCountdown(new Date(target).getTime() - portal.now.getTime())}</span>
    <span class="sub">{sub}</span>
  </div>
  <div class="rule" aria-hidden="true"></div>
  <dl>
    <div>
      <dt><Label tone="ticket">Check-in</Label></dt>
      <dd><strong>{formatDay(stay.checkIn, tz)}</strong><span>{formatTime(stay.checkIn, tz)}</span></dd>
    </div>
    <div>
      <dt><Label tone="ticket">Check-out</Label></dt>
      <dd><strong>{formatDay(stay.checkOut, tz)}</strong><span>{formatTime(stay.checkOut, tz)}</span></dd>
    </div>
    <div>
      <dt><Label tone="ticket">Length</Label></dt>
      <dd><strong>{nights.length} {nights.length === 1 ? 'night' : 'nights'}</strong></dd>
    </div>
    {#if stay.guests}
      <div>
        <dt><Label tone="ticket">Guests</Label></dt>
        <dd><strong>{stay.guests}</strong></dd>
      </div>
    {/if}
  </dl>
</section>

<style>
  .ticket { background: var(--cc-ticket); color: var(--cc-paper); border-radius: 22px; overflow: hidden; }
  .top { padding: 20px 22px 18px; display: flex; flex-direction: column; gap: 6px; }
  .count { font-family: var(--cc-font-display); font-size: 38px; line-height: 1.1; }
  .sub { font-size: 14px; color: var(--cc-ticket-soft); }
  .rule { border-top: 2px dashed var(--cc-ticket-rule); margin: 0 14px; }
  dl {
    margin: 0;
    padding: 16px 22px 20px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 16px;
  }
  dl div { display: flex; flex-direction: column; gap: 3px; }
  dd { margin: 0; display: flex; flex-direction: column; gap: 3px; }
  strong { font-weight: 600; font-size: 15px; }
  dd span { font-size: 14px; color: var(--cc-ticket-soft); }
</style>
