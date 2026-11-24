<script lang="ts">
  import type { AwaySettings as Away } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import AwaySettings from './AwaySettings.svelte';

  let { away }: { away: Away } = $props();
</script>

<Card label="When you head out">
  <div class="head">
    <h3>When you head out</h3>
    <p>“Heading out” on the Home tab locks up and can set the thermostat to save energy while you’re away.</p>
  </div>
  <AwaySettings {away} id="away-thermostat" />
</Card>

<style>
  .head { display: flex; flex-direction: column; gap: 4px; }
  h3 { margin: 0; font-size: 17px; font-weight: 600; }
  p { margin: 0; font-size: 14px; line-height: 1.45; color: var(--cc-muted); }
</style>
