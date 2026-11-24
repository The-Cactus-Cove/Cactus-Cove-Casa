<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { GarageState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import Status from '../ui/Status.svelte';

  let { garage }: { garage: GarageState } = $props();
  const portal = getPortal();
  /** The door takes a few seconds to travel; show that until the sensor reports. */
  let moving = $state<boolean | null>(null);
  $effect(() => {
    if (moving !== null && garage.open === moving) moving = null;
  });

  async function toggle() {
    const open = !garage.open;
    const yes = await confirmSheet.ask(
      open
        ? { title: 'Open the garage door?', body: 'The door will start opening as soon as you confirm.', cta: 'Yes, open it' }
        : { title: 'Close the garage door?', body: 'Make sure nothing and nobody is under the door before it comes down.', cta: 'Yes, close it' }
    );
    if (yes && (await portal.send({ type: 'garage', open }, open ? 'Garage door opening…' : 'Garage door closing…'))) {
      moving = open;
      setTimeout(() => (moving = null), 30_000); // give up waiting for the sensor
    }
  }
</script>

<Card label="Garage door">
  <DeviceHeader icon="garage" tint="sage" title="Garage door">
    {#if moving !== null}
      <Status tone="honey">{moving ? 'Opening…' : 'Closing…'}</Status>
    {:else if garage.open}
      <Status tone="warn">Open</Status>
    {:else}
      <Status tone="ok">Closed</Status>
    {/if}
  </DeviceHeader>
  <Button variant="green" busy={moving !== null} onclick={toggle}>{garage.open ? 'Close garage' : 'Open garage'}</Button>
  <small>The wall button inside the garage works too.</small>
</Card>

<style>
  small { font-size: 13px; color: var(--cc-muted); }
</style>
