<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { SleepRequest } from '#lib/house/commands.ts';
  import { formatTime } from '#lib/house/format.ts';
  import type { TvState } from '#lib/house/types.ts';
  import Choice from '../ui/Choice.svelte';
  import Label from '../ui/Label.svelte';
  import TimeField from '../ui/TimeField.svelte';

  type Pick = 'off' | '1' | '2' | '3' | 'at';
  const OPTIONS: { value: Pick; label: string }[] = [
    { value: 'off', label: 'Off' },
    { value: '1', label: '1 hr' },
    { value: '2', label: '2 hrs' },
    { value: '3', label: '3 hrs' },
    { value: 'at', label: 'At time' }
  ];
  const DEFAULT_AT = '23:00';

  let { tv }: { tv: TvState } = $props();
  const portal = getPortal();

  const picked = $derived<Pick>(tv.sleep.kind === 'in' ? (String(tv.sleep.hours) as Pick) : tv.sleep.kind);
  const atTime = $derived(tv.sleep.kind === 'at' ? tv.sleep.time : DEFAULT_AT);

  const set = (sleep: SleepRequest) => portal.send({ type: 'tv-sleep', tvId: tv.id, sleep });
  function pick(value: Pick) {
    if (value === 'off') set({ kind: 'off' });
    else if (value === 'at') set({ kind: 'at', time: atTime });
    else set({ kind: 'in', hours: Number(value) as 1 | 2 | 3 });
  }

  const summary = $derived(tv.sleep.kind === 'off' ? 'No sleep timer set.' : `${tv.name} turns off at ${formatTime(tv.sleep.endsAt, portal.timeZone)}.`);
</script>

<div class="sleep">
  <Label>Sleep timer</Label>
  <Choice label="Sleep timer for {tv.name}" options={OPTIONS} value={picked} columns={5} size="sm" onchange={pick} />
  {#if picked === 'at'}
    <TimeField id="sleep-at-{tv.id}" label="Turn off at" value={atTime} onchange={(time) => set({ kind: 'at', time })} />
  {/if}
  <span class="summary" aria-live="polite">{summary}</span>
</div>

<style>
  .sleep { display: flex; flex-direction: column; gap: 10px; }
  .summary { font-size: 14px; color: var(--cc-notice-ink); }
</style>
