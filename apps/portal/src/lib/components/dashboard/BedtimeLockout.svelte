<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { LockoutRequest } from '#lib/house/commands.ts';
  import { formatClock, formatCountdown, formatLocalDate } from '#lib/house/format.ts';
  import { lockedOut } from '#lib/house/lockout.ts';
  import { localDate, nextOccurrence, nightsOf, zonedInstant } from '#lib/house/time.ts';
  import type { TvState } from '#lib/house/types.ts';
  import Choice from '../ui/Choice.svelte';
  import TimeField from '../ui/TimeField.svelte';

  let { tv }: { tv: TvState } = $props();
  const portal = getPortal();
  const tz = $derived(portal.timeZone);
  const lockout = $derived(tv.lockout);

  /** Nights the guest can pick, from tonight on. */
  const nights = $derived.by(() => {
    const today = localDate(portal.now, tz);
    const all = nightsOf(portal.stay.checkIn, portal.stay.checkOut, tz);
    const upcoming = all.filter((n) => n >= today);
    return upcoming.length ? upcoming : all.slice(-1);
  });

  const save = (patch: Partial<LockoutRequest>) => portal.send({ type: 'tv-lockout', tvId: tv.id, lockout: { ...lockout, ...patch } });

  const scopeValue = $derived(lockout.scope.kind === 'stay' ? 'stay' : 'night');
  const night = $derived(lockout.scope.kind === 'night' ? lockout.scope.night : (nights[0] ?? localDate(portal.now, tz)));

  const summary = $derived.by(() => {
    const window = `${formatClock(lockout.from)} to ${formatClock(lockout.to)}`;
    const when = lockout.scope.kind === 'stay' ? 'every night of your stay' : `the night of ${formatLocalDate(lockout.scope.night)}`;
    if (lockedOut(lockout, portal.now, tz)) return `Locked out now. ${window}, ${when}.`;
    const starts =
      lockout.scope.kind === 'night' ? zonedInstant(lockout.scope.night, lockout.from, tz) : nextOccurrence(lockout.from, portal.now, tz);
    if (starts.getTime() <= portal.now.getTime()) return `Locked out ${window}, ${when}. That night has passed.`;
    return `Locked out ${window}, ${when}. Starts in ${formatCountdown(starts.getTime() - portal.now.getTime())}.`;
  });
</script>

<div class="lockout">
  <div class="head">
    <div class="text">
      <span class="title" id="lockout-{tv.id}">Bedtime lockout</span>
      <span class="sub">If someone turns this TV on during these hours, it switches itself back off.</span>
    </div>
    <button type="button" class="toggle" aria-pressed={lockout.enabled} aria-labelledby="lockout-{tv.id}" onclick={() => save({ enabled: !lockout.enabled })}>
      {lockout.enabled ? 'On' : 'Off'}
    </button>
  </div>

  {#if lockout.enabled}
    <div class="times">
      <TimeField stacked id="lock-from-{tv.id}" label="From" value={lockout.from} onchange={(from) => save({ from })} />
      <TimeField stacked id="lock-to-{tv.id}" label="Until" value={lockout.to} onchange={(to) => save({ to })} />
    </div>
    <Choice
      label="Which nights"
      options={[
        { value: 'stay', label: 'Every night' },
        { value: 'night', label: 'One night' }
      ]}
      value={scopeValue}
      columns={2}
      onchange={(v) => save({ scope: v === 'stay' ? { kind: 'stay' } : { kind: 'night', night } })}
    />
    {#if lockout.scope.kind === 'night'}
      <div class="night">
        <label for="lock-night-{tv.id}">Night of</label>
        <select id="lock-night-{tv.id}" value={night} onchange={(e) => save({ scope: { kind: 'night', night: e.currentTarget.value } })}>
          {#each nights as n (n)}<option value={n}>{formatLocalDate(n)}</option>{/each}
        </select>
      </div>
    {/if}
    <span class="summary" aria-live="polite">{summary}</span>
  {/if}
</div>

<style>
  .lockout { border-top: 2px dashed var(--cc-line); padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .title { font-weight: 600; font-size: 16px; }
  .sub { font-size: 13px; color: var(--cc-muted); line-height: 1.4; }
  .toggle {
    min-width: 64px;
    min-height: var(--cc-tap);
    border: 2px solid var(--cc-field);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .toggle[aria-pressed='true'] { background: var(--cc-saguaro); border-color: var(--cc-saguaro); color: var(--cc-paper); }
  .times { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .night { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .night label { font-size: 15px; }
  select {
    height: var(--cc-tap);
    border: 2px solid var(--cc-field);
    border-radius: 12px;
    background: var(--cc-field-bg);
    font: inherit;
    font-size: 16px;
    color: var(--cc-ink);
    padding: 0 10px;
  }
  .summary { font-size: 14px; color: var(--cc-warning); font-weight: 600; }
</style>
