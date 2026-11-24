<script lang="ts">
  import { GarageControl } from '#lib/client/garage.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import GarageStatus from './GarageStatus.svelte';

  const garage = new GarageControl(getPortal());
</script>

<Card label="Garage door">
  <DeviceHeader icon="garage" tint="sage" title="Garage door">
    <GarageStatus {garage} />
  </DeviceHeader>
  <Button variant="green" size="lg" busy={garage.moving !== null} onclick={() => garage.toggle()}>{garage.actionLabel}</Button>
  <small>No remote needed: this button is your garage opener. The wall button inside the garage works too.</small>
</Card>

<style>
  small { font-size: 13px; color: var(--cc-muted); }
</style>
