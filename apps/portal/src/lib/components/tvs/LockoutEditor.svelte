<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatClock, formatCountdown, formatLocalDate } from '#lib/house/format.ts';
  import { lockedOut } from '#lib/house/lockout.ts';
  import { localDate, nextOccurrence, nightsOf, zonedInstant } from '#lib/house/time.ts';
  import type { Lockout } from '#lib/house/types.ts';
  import Choice from '../ui/Choice.svelte';
  import Select from '../ui/Select.svelte';
  import TimeField from '../ui/TimeField.svelte';
  import Toggle from '../ui/Toggle.svelte';

  interface Props {
    /** Unique prefix for element ids. */
    id: string;
    lockout: Lockout;
    title?: string;
    description?: string;
    onchange: (lockout: Lockout) => void;
  }
  let {
    id,
    lockout,
    title = 'Bedtime lockout',
    description = 'If someone turns this TV on during these hours, it switches itself back off.',
    onchange
  }: Props = $props();
  const portal = getPortal();
  const tz = $derived(portal.timeZone);

  /** Nights the guest can pick, from tonight on. */
  const nights = $derived.by(() => {
    const today = localDate(portal.now, tz);
    const all = nightsOf(portal.stay.checkIn, portal.stay.checkOut, tz);
    const upcoming = all.filter((n) => n >= today);
    return upcoming.length ? upcoming : all.slice(-1);
  });
  const night = $derived(lockout.scope.kind === 'night' ? lockout.scope.night : (nights[0] ?? localDate(portal.now, tz)));
  const change = (patch: Partial<Lockout>) => onchange({ ...lockout, ...patch });

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
      <span class="title" id="{id}-title">{title}</span>
      <span class="sub">{description}</span>
    </div>
    <Toggle on={lockout.enabled} labelledby="{id}-title" onchange={(enabled) => change({ enabled })} />
  </div>

  {#if lockout.enabled}
    <div class="times">
      <TimeField stacked id="{id}-from" label="From" value={lockout.from} onchange={(from) => change({ from })} />
      <TimeField stacked id="{id}-to" label="Until" value={lockout.to} onchange={(to) => change({ to })} />
    </div>
    <Choice
      label="Which nights"
      options={[
        { value: 'stay', label: 'Every night' },
        { value: 'night', label: 'One night' }
      ]}
      value={lockout.scope.kind}
      columns={2}
      onchange={(v) => change({ scope: v === 'stay' ? { kind: 'stay' } : { kind: 'night', night } })}
    />
    {#if lockout.scope.kind === 'night'}
      <Select
        id="{id}-night"
        label="Night of"
        value={night}
        options={nights.map((n) => ({ value: n, label: formatLocalDate(n) }))}
        onchange={(n) => change({ scope: { kind: 'night', night: n } })}
      />
    {/if}
    <span class="summary" aria-live="polite">{summary}</span>
  {/if}
</div>

<style>
  .lockout { display: flex; flex-direction: column; gap: 12px; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .title { font-weight: 600; font-size: 16px; }
  .sub { font-size: 13px; color: var(--cc-muted); line-height: 1.4; }
  .times { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .summary { font-size: 14px; color: var(--cc-warning); font-weight: 600; }
</style>
