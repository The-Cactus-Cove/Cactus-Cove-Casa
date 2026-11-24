<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { tabBadges } from '#lib/house/badges.ts';
  import SignOut from '../dashboard/SignOut.svelte';
  import TabNav from './TabNav.svelte';

  /** Phone: top bar, content, fixed bottom tabs. Desktop: sidebar with the tabs. */
  let { children }: { children: Snippet } = $props();
  const portal = getPortal();
  const badges = $derived(portal.house ? tabBadges(portal.house) : { doors: 0, thermostat: null, tvs: 0 });
</script>

<div class="app">
  <aside class="side">
    <div class="top">
      <span class="brand">Cactus Cove</span>
      <SignOut />
    </div>
    <div class="tabs"><TabNav {badges} /></div>
  </aside>
  <main class="content">{@render children()}</main>
</div>

<style>
  .app { min-height: 100dvh; }
  .top { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: var(--cc-tap); }
  .brand { font-family: var(--cc-font-display); font-size: 18px; color: var(--cc-saguaro); }
  .content {
    max-width: 480px;
    margin: 0 auto;
    padding: 18px 18px calc(96px + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* Phone: brand bar scrolls with the page, tabs pinned to the bottom. */
  .side .top { max-width: 480px; margin: 0 auto; padding: 20px 18px 0; }
  .tabs {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    background: var(--cc-sand);
    border-top: 2px dashed var(--cc-dash);
    padding: 4px 8px env(safe-area-inset-bottom);
  }

  @media (min-width: 900px) {
    .app { display: grid; grid-template-columns: 260px minmax(0, 1fr); }
    .side {
      position: sticky;
      top: 0;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      gap: 28px;
      padding: 28px 18px;
      border-right: 2px dashed var(--cc-dash);
    }
    .side .top { padding: 0; margin: 0; flex-direction: column; align-items: flex-start; gap: 16px; }
    .brand { font-size: 24px; }
    .tabs { position: static; border: 0; padding: 0; background: none; }
    .content { max-width: 640px; padding: 36px 32px 48px; }
  }
</style>
