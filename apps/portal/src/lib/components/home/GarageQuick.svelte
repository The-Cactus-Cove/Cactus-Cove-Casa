<script lang="ts">
  import { GarageControl } from '#lib/client/garage.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import GarageStatus from '../doors/GarageStatus.svelte';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';

  /** The garage opener, one tap from the top of Home. */
  const garage = new GarageControl(getPortal());
</script>

<section class="quick" aria-label="Garage door">
  <span class="tile"><Icon name="garage" size={26} stroke={1.8} /></span>
  <div class="text">
    <span class="title">Garage door</span>
    <GarageStatus {garage} />
  </div>
  <Button variant="green" size="md" block={false} busy={garage.moving !== null} onclick={() => garage.toggle()}>
    {garage.moving !== null ? '…' : garage.open ? 'Close' : 'Open'}
  </Button>
</section>

<style>
  .quick {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--cc-paper);
    border: 2px solid var(--cc-saguaro);
    border-radius: 20px;
    padding: 14px 14px 14px 18px;
  }
  .tile {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--cc-tint-sage);
    color: var(--cc-saguaro);
  }
  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .title { font-weight: 600; font-size: 17px; }
  .quick :global(.btn) { min-width: 104px; }
</style>
