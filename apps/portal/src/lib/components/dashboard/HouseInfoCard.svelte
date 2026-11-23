<script lang="ts">
  import type { HouseInfo } from '#lib/house/types.ts';
  import Card from '../ui/Card.svelte';
  import Label from '../ui/Label.svelte';

  let { info }: { info: HouseInfo } = $props();
</script>

<Card label="House info">
  <div class="grid">
    <div class="cell">
      <Label>Wi-Fi</Label>
      {#if info.wifi}
        <strong>{info.wifi.ssid}</strong>
        <span class="pw">{info.wifi.password}</span>
      {:else}
        <span class="pw">See the house guide</span>
      {/if}
    </div>
    <div class="cell">
      <Label>Need a hand?</Label>
      {#if info.hostPhone}<a class="strong" href="sms:{info.hostPhone}">Text the host</a>{/if}
      <a href="/guide/">House guide</a>
    </div>
  </div>
</Card>

<style>
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .cell { display: flex; flex-direction: column; gap: 3px; min-width: 0; overflow-wrap: anywhere; }
  strong, .strong { font-weight: 600; font-size: 15px; }
  .pw { font-size: 14px; color: var(--cc-notice-ink); }
  a { font-size: 14px; }
</style>
