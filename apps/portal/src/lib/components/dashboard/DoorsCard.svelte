<script lang="ts">
  import type { DoorState } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import Label from '../ui/Label.svelte';

  let { doors }: { doors: DoorState[] } = $props();
</script>

<Card gap={12} label="Doors">
  <Label>Doors</Label>
  <ul>
    {#each doors as door (door.id)}
      <li><span>{door.name}</span><span class:open={door.open} class="state">{door.open ? 'Open' : 'Closed'}</span></li>
    {/each}
  </ul>
</Card>

<style>
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px; }
  li { display: flex; align-items: center; justify-content: space-between; font-size: 15px; }
  .state { color: var(--cc-saguaro); font-weight: 600; }
  .state.open { color: var(--cc-warning); }
</style>
