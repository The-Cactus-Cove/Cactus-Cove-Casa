<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatTime } from '#lib/house/format.ts';
  import { holdProblem } from '#lib/house/holds.ts';
  import { nextOccurrence } from '#lib/house/time.ts';
  import type { LockState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import Choice from '../ui/Choice.svelte';
  import TimeField from '../ui/TimeField.svelte';

  /** Lock every door at once, or keep them all unlocked for a while / until a time. */
  let { locks }: { locks: LockState[] } = $props();
  const portal = getPortal();

  let mode = $state<'for' | 'until'>('for');
  let hours = $state(3);
  let untilTime = $state('22:00');

  const allLocked = $derived(locks.every((l) => l.locked));
  const until = $derived(
    mode === 'for' ? new Date(portal.now.getTime() + hours * 3600_000) : nextOccurrence(untilTime, portal.now, portal.timeZone)
  );
  const problem = $derived(holdProblem(until, portal.now, portal.stay));
  const untilLabel = $derived(formatTime(until, portal.timeZone));

  const lockAll = () => portal.send({ type: 'all-locks', locked: true }, 'All doors locked');

  async function holdAll() {
    // Recompute at tap time so "for 3 hours" starts now, not when the page last ticked.
    const end = mode === 'for' ? new Date(Date.now() + hours * 3600_000) : until;
    const yes = await confirmSheet.ask({
      title: 'Keep all doors unlocked?',
      body: `Both doors stay unlocked until ${formatTime(end, portal.timeZone)}, then lock themselves.`,
      cta: `Unlock until ${formatTime(end, portal.timeZone)}`
    });
    if (yes) await portal.send({ type: 'all-locks', locked: false, holdUntil: end.toISOString() }, `Doors unlocked until ${formatTime(end, portal.timeZone)}`);
  }
</script>

<Card gap={14} label="All doors">
  <div class="head">
    <h3>All doors</h3>
    <Button variant="dark" size="sm" block={false} disabled={allLocked} onclick={lockAll}>{allLocked ? 'All locked' : 'Lock all'}</Button>
  </div>

  <div class="hold">
    <span class="title">Keep all doors unlocked</span>
    <Choice
      label="Keep unlocked"
      columns={2}
      value={mode}
      options={[
        { value: 'for', label: 'For a while' },
        { value: 'until', label: 'Until a time' }
      ]}
      onchange={(m) => (mode = m)}
    />
    {#if mode === 'for'}
      <Choice
        label="How long"
        columns={4}
        size="sm"
        value={hours}
        options={[1, 2, 3, 4].map((h) => ({ value: h, label: `${h} hr${h > 1 ? 's' : ''}` }))}
        onchange={(h) => (hours = h)}
      />
    {:else}
      <TimeField id="hold-all-until" label="Until" value={untilTime} onchange={(t) => (untilTime = t)} />
    {/if}
    {#if problem}<span class="problem" role="alert">{problem}</span>{/if}
    <Button variant="outline" disabled={!!problem} onclick={holdAll}>Unlock all until {untilLabel}</Button>
  </div>
</Card>

<style>
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h3 { margin: 0; font-size: 17px; font-weight: 600; }
  .hold { display: flex; flex-direction: column; gap: 12px; border-top: 2px dashed var(--cc-line); padding-top: 14px; }
  .title { font-weight: 600; font-size: 15px; }
  .problem { font-size: 14px; color: var(--cc-warning); }
</style>
