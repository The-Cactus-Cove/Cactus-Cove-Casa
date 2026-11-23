<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { Settle } from '#lib/client/settle.svelte.ts';
  import type { HvacMode, ThermostatState } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import Choice from '../ui/Choice.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import SetpointDial from '../ui/SetpointDial.svelte';
  import SettleStatus from '../ui/SettleStatus.svelte';

  const MODES: { value: HvacMode; label: string }[] = [
    { value: 'cool', label: 'Cool' },
    { value: 'heat', label: 'Heat' },
    { value: 'off', label: 'Off' }
  ];
  const modeLabel = (mode: HvacMode) => MODES.find((m) => m.value === mode)?.label ?? mode;

  let { thermostat }: { thermostat: ThermostatState } = $props();
  const portal = getPortal();
  const settle = new Settle<{ setpoint: number; mode: HvacMode }>((v) => portal.send({ type: 'thermostat', ...v }));
  const shown = $derived(settle.draft ?? { setpoint: thermostat.setpoint, mode: thermostat.mode });
  const saved = $derived(thermostat.mode === 'off' ? 'Thermostat off' : `Set to ${thermostat.setpoint}° · ${modeLabel(thermostat.mode)}`);
</script>

<Card gap={16} label="Thermostat">
  <DeviceHeader icon="thermometer" tint="honey" title="Thermostat">
    <SettleStatus status={settle.status} {saved}>
      <span class="sub">{thermostat.current != null ? `Inside now: ${thermostat.current}° · ` : ''}{modeLabel(thermostat.mode)}</span>
    </SettleStatus>
  </DeviceHeader>
  <SetpointDial label="Target temperature" value={shown.setpoint} onchange={(setpoint) => settle.set({ ...shown, setpoint })} />
  <Choice label="Mode" options={MODES} value={shown.mode} columns={3} onchange={(mode) => settle.set({ ...shown, mode })} />
</Card>

<style>
  .sub { font-size: 14px; color: var(--cc-muted); }
</style>
