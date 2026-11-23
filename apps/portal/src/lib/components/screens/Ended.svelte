<script lang="ts">
  import type { HouseInfo, Stay } from '#lib/house/types.ts';
  import Icon from '../ui/Icon.svelte';
  import HostLine from './HostLine.svelte';

  let { stay, info }: { stay: Stay; info: HouseInfo } = $props();
</script>

<div class="ended">
  <span class="sun"><Icon name="sunset" size={96} /></span>
  <h1>Happy trails, {stay.guestName}</h1>
  <p>You’re checked out. The door, garage, thermostat and TV controls are now switched off for this link.</p>
  <div class="rule" aria-hidden="true"></div>
  {#if info.reviewUrl}<a class="review" href={info.reviewUrl} target="_blank" rel="noopener">Leave us a review</a>{/if}
  <HostLine lead="Left something behind?" phone={info.hostPhone} />
</div>

<style>
  .ended { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; padding-top: 72px; }
  .sun { color: var(--cc-adobe); display: flex; }
  h1 { margin: 0; font-size: 34px; }
  p { margin: 0; font-size: 16px; line-height: 1.6; color: var(--cc-notice-ink); max-width: 300px; }
  .rule { border-top: 2px dashed var(--cc-dash); width: 100%; margin-top: 12px; }
  .review {
    background: var(--cc-adobe);
    color: var(--cc-paper);
    text-decoration: none;
    padding: 16px 26px;
    border-radius: var(--cc-radius-pill);
    font-weight: 600;
  }
  .review:hover { color: var(--cc-paper); background: var(--cc-adobe-dark); }
</style>
