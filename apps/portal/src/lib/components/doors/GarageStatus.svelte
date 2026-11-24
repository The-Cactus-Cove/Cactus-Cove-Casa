<script lang="ts">
  import type { GarageControl } from '#lib/client/garage.svelte.ts';
  import Status from '../ui/Status.svelte';

  let { garage }: { garage: GarageControl } = $props();
</script>

{#if garage.moving !== null}
  <Status tone="honey">{garage.moving ? 'Opening…' : 'Closing…'}</Status>
{:else if garage.open}
  <Status tone="warn">Open</Status>
{:else}
  <Status tone="ok">Closed</Status>
{/if}
