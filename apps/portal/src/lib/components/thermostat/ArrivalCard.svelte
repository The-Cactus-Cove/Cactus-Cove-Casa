<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { Settle } from '#lib/client/settle.svelte.ts';
  import { PRECONDITION_HOURS } from '#lib/house/limits.ts';
  import Card from '../ui/Card.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import SetpointDial from '../ui/SetpointDial.svelte';
  import SettleStatus from '../ui/SettleStatus.svelte';

  /** Before check-in: pick the temperature the house should be when you arrive. No live readings. */
  let { setpoint }: { setpoint: number } = $props();
  const portal = getPortal();
  const settle = new Settle<number>((value) => portal.send({ type: 'arrival-temperature', setpoint: value }));
</script>

<Card gap={16} label="Arrival temperature">
  <DeviceHeader icon="thermometer" tint="honey" title="Arrival temperature">
    <SettleStatus status={settle.status} saved="Saved for your arrival">
      <span class="sub">We’ll start cooling or heating {PRECONDITION_HOURS} hours before check-in</span>
    </SettleStatus>
  </DeviceHeader>
  <SetpointDial label="Arrival temperature" value={settle.draft ?? setpoint} onchange={(v) => settle.set(v)} />
</Card>

<style>
  .sub { font-size: 14px; color: var(--cc-muted); }
</style>
