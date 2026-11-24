<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { Settle } from '#lib/client/settle.svelte.ts';
  import type { AwaySettings } from '#lib/house/types.ts';
  import SetpointDial from '../ui/SetpointDial.svelte';
  import SettleStatus from '../ui/SettleStatus.svelte';
  import Toggle from '../ui/Toggle.svelte';

  /** What "Heading out" does with the thermostat. Shown on Home and on the Thermostat tab. */
  let { away, id }: { away: AwaySettings; id: string } = $props();
  const portal = getPortal();
  const settle = new Settle<AwaySettings>((v) => portal.send({ type: 'away-settings', ...v }));
  const shown = $derived(settle.draft ?? away);
</script>

<div class="away">
  <div class="row">
    <span id="{id}-label" class="label">Adjust the thermostat when I head out</span>
    <Toggle on={shown.adjustThermostat} labelledby="{id}-label" onchange={(adjustThermostat) => settle.set({ ...shown, adjustThermostat })} />
  </div>
  {#if shown.adjustThermostat}
    <SetpointDial size="md" label="Away temperature" value={shown.setpoint} onchange={(setpoint) => settle.set({ ...shown, setpoint })} />
  {/if}
  <SettleStatus status={settle.status} saved="Saved" />
</div>

<style>
  .away { display: flex; flex-direction: column; gap: 14px; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .label { font-size: 15px; font-weight: 500; }
</style>
