<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { TvKey, TvState } from '#lib/house/types.ts';
  import Icon from '../ui/Icon.svelte';
  import RoundButton from '../ui/RoundButton.svelte';

  let { tv }: { tv: TvState } = $props();
  const portal = getPortal();
  const press = (key: TvKey) => portal.send({ type: 'tv-key', tvId: tv.id, key });

  const pad: Array<{ key: TvKey; label: string; icon?: 'chevron-up' | 'chevron-down' | 'chevron-left' | 'chevron-right'; area: string }> = [
    { key: 'up', label: 'Up', icon: 'chevron-up', area: 'up' },
    { key: 'left', label: 'Left', icon: 'chevron-left', area: 'left' },
    { key: 'select', label: 'OK', area: 'ok' },
    { key: 'right', label: 'Right', icon: 'chevron-right', area: 'right' },
    { key: 'down', label: 'Down', icon: 'chevron-down', area: 'down' }
  ];
  const extras: Array<{ key: TvKey; label: string }> = [
    { key: 'back', label: 'Back' },
    { key: 'home', label: 'Home' },
    { key: 'play', label: 'Play/Pause' }
  ];
</script>

<div class="remote" role="group" aria-label="{tv.name} remote">
  <div class="pad">
    {#each pad as b (b.key)}
      <div style:grid-area={b.area}>
        {#if b.icon}
          <RoundButton aria-label={b.label} onclick={() => press(b.key)}><Icon name={b.icon} size={22} stroke={2.2} /></RoundButton>
        {:else}
          <RoundButton aria-label={b.label} tone="blue" onclick={() => press(b.key)}>{b.label}</RoundButton>
        {/if}
      </div>
    {/each}
  </div>
  <div class="extras">
    {#each extras as b (b.key)}
      <button type="button" onclick={() => press(b.key)}>{b.label}</button>
    {/each}
  </div>
  <div class="volume">
    <RoundButton size={52} aria-label="Volume down" onclick={() => press('volume_down')}>−</RoundButton>
    <button type="button" class="mute" onclick={() => press('volume_mute')}>Mute</button>
    <RoundButton size={52} aria-label="Volume up" onclick={() => press('volume_up')}>+</RoundButton>
  </div>
</div>

<style>
  .remote {
    background: var(--cc-remote);
    border-radius: 18px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .pad {
    display: grid;
    grid-template-columns: repeat(3, 56px);
    grid-template-rows: repeat(3, 56px);
    grid-template-areas: '. up .' 'left ok right' '. down .';
    gap: 6px;
  }
  .extras { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  .extras button,
  .mute {
    min-height: 48px;
    padding: 0 22px;
    border: 1.5px solid var(--cc-field);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .extras button { padding: 0 18px; }
  .volume { display: flex; align-items: center; gap: 14px; }
</style>
