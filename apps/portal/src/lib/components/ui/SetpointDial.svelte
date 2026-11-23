<script lang="ts">
  import { THERMOSTAT } from '#lib/house/limits.ts';
  import RoundButton from './RoundButton.svelte';

  interface Props {
    value: number;
    /** What the number means, for screen readers ("Arrival temperature"). */
    label: string;
    size?: 'lg' | 'md';
    onchange: (value: number) => void;
  }
  let { value, label, size = 'lg', onchange }: Props = $props();
  const step = (delta: number) => onchange(Math.max(THERMOSTAT.min, Math.min(THERMOSTAT.max, value + delta)));
  const button = $derived(size === 'lg' ? 56 : 48);
</script>

<div class="dial {size}">
  <RoundButton size={button} aria-label="Cooler" disabled={value <= THERMOSTAT.min} onclick={() => step(-1)}>−</RoundButton>
  <div class="value">
    <span class="temp" aria-label="{label}: {value} degrees" aria-live="polite">{value}°</span>
    <span class="range">Allowed range {THERMOSTAT.min}–{THERMOSTAT.max}°</span>
  </div>
  <RoundButton size={button} aria-label="Warmer" disabled={value >= THERMOSTAT.max} onclick={() => step(1)}>+</RoundButton>
</div>

<style>
  .dial { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .value { display: flex; flex-direction: column; align-items: center; }
  .temp { font-family: var(--cc-font-display); line-height: 1; }
  .lg .temp { font-size: 56px; }
  .md .temp { font-size: 40px; }
  .range { font-size: 12px; color: var(--cc-muted); padding-top: 6px; }
</style>
