<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { PRECONDITION_HOURS, THERMOSTAT } from '#lib/house/limits.ts';
  import type { HvacMode, ThermostatState } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import Choice from '../ui/Choice.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import RoundButton from '../ui/RoundButton.svelte';
  import Status from '../ui/Status.svelte';

  /** Changes apply this long after the last tap. */
  const SETTLE_MS = 1000;
  const MODES: { value: HvacMode; label: string }[] = [
    { value: 'cool', label: 'Cool' },
    { value: 'heat', label: 'Heat' },
    { value: 'off', label: 'Off' }
  ];

  let { thermostat, arrival }: { thermostat: ThermostatState; arrival: boolean } = $props();
  const portal = getPortal();

  // Local draft while the guest is tapping; null means "show the house's value".
  let draft = $state<{ setpoint: number; mode: HvacMode } | null>(null);
  let sync = $state<'idle' | 'pending' | 'saved'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  const shown = $derived(draft ?? { setpoint: arrival ? thermostat.arrivalSetpoint : thermostat.setpoint, mode: thermostat.mode });
  const modeLabel = (mode: HvacMode) => MODES.find((m) => m.value === mode)?.label ?? mode;

  function change(next: { setpoint: number; mode: HvacMode }) {
    draft = { ...next, setpoint: Math.max(THERMOSTAT.min, Math.min(THERMOSTAT.max, next.setpoint)) };
    sync = 'pending';
    clearTimeout(timer);
    timer = setTimeout(apply, SETTLE_MS);
  }

  async function apply() {
    if (!draft) return;
    const { setpoint, mode } = draft;
    const ok = await portal.send(arrival ? { type: 'arrival-temperature', setpoint } : { type: 'thermostat', setpoint, mode });
    draft = null;
    sync = ok ? 'saved' : 'idle';
    if (ok) timer = setTimeout(() => (sync = 'idle'), 3000);
  }

  const savedLabel = $derived(
    arrival ? 'Saved for your arrival' : thermostat.mode === 'off' ? 'Thermostat off' : `Set to ${thermostat.setpoint}° · ${modeLabel(thermostat.mode)}`
  );
</script>

<Card gap={16} label={arrival ? 'Arrival temperature' : 'Thermostat'}>
  <DeviceHeader icon="thermometer" tint="honey" title={arrival ? 'Arrival temperature' : 'Thermostat'}>
    <span aria-live="polite">
      {#if sync === 'pending'}
        <Status tone="honey" dot={false}>Adjusting…</Status>
      {:else if sync === 'saved'}
        <Status tone="ok" dot={false}>✓ {savedLabel}</Status>
      {:else if arrival}
        <span class="sub">Set automatically {PRECONDITION_HOURS} hours before check-in</span>
      {:else}
        <span class="sub">{thermostat.current != null ? `Inside now: ${thermostat.current}° · ` : ''}{modeLabel(thermostat.mode)}</span>
      {/if}
    </span>
  </DeviceHeader>

  <div class="dial">
    <RoundButton aria-label="Cooler" disabled={shown.setpoint <= THERMOSTAT.min} onclick={() => change({ ...shown, setpoint: shown.setpoint - 1 })}>−</RoundButton>
    <div class="value">
      <span class="temp">{shown.setpoint}°</span>
      <span class="range">Allowed range {THERMOSTAT.min}–{THERMOSTAT.max}°</span>
    </div>
    <RoundButton aria-label="Warmer" disabled={shown.setpoint >= THERMOSTAT.max} onclick={() => change({ ...shown, setpoint: shown.setpoint + 1 })}>+</RoundButton>
  </div>

  {#if !arrival}
    <Choice label="Mode" options={MODES} value={shown.mode} columns={3} onchange={(mode) => change({ ...shown, mode })} />
  {/if}
</Card>

<style>
  .sub { font-size: 14px; color: var(--cc-muted); }
  .dial { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .value { display: flex; flex-direction: column; align-items: center; }
  .temp { font-family: var(--cc-font-display); font-size: 56px; line-height: 1; }
  .range { font-size: 12px; color: var(--cc-muted); padding-top: 6px; }
</style>
