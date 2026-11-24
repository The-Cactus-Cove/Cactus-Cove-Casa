<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatTime } from '#lib/house/format.ts';
  import type { HouseState } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import Label from '../ui/Label.svelte';

  /** Read-only overview of every door; controls live on the Doors tab. */
  let { house }: { house: HouseState } = $props();
  const portal = getPortal();

  const rows = $derived([
    ...house.locks.map((l) => ({
      id: `lock-${l.id}`,
      name: `${l.name} lock`,
      ok: l.locked,
      state: l.locked ? 'Locked' : l.holdUntil ? `Unlocked until ${formatTime(l.holdUntil, portal.timeZone)}` : 'Unlocked'
    })),
    ...house.doors.map((d) => ({ id: `door-${d.id}`, name: d.name, ok: !d.open, state: d.open ? 'Open' : 'Closed' }))
  ]);
</script>

<Card gap={12} label="Doors">
  <div class="head">
    <Label>Doors</Label>
    <a href="/doors">Door controls</a>
  </div>
  <ul>
    {#each rows as row (row.id)}
      <li><span>{row.name}</span><span class="state" class:warn={!row.ok}>{row.state}</span></li>
    {/each}
  </ul>
</Card>

<style>
  .head { display: flex; align-items: baseline; justify-content: space-between; }
  .head a { font-size: 14px; font-weight: 600; }
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px; }
  li { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 15px; }
  .state { color: var(--cc-saguaro); font-weight: 600; text-align: right; }
  .state.warn { color: var(--cc-warning); }
</style>
