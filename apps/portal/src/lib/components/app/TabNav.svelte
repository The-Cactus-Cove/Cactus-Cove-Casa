<script lang="ts">
  import { page } from '$app/state';
  import type { TabBadges } from '#lib/house/badges.ts';
  import Icon from '../ui/Icon.svelte';
  import { TABS, badgeLabel } from './tabs.ts';

  let { badges }: { badges: TabBadges } = $props();
  const active = (href: string) => page.url.pathname === href;
</script>

<nav aria-label="Sections">
  <ul>
    {#each TABS as tab (tab.href)}
      {@const badge = active(tab.href) ? null : tab.badge(badges)}
      <li>
        <a href={tab.href} aria-current={active(tab.href) ? 'page' : undefined}>
          <Icon name={tab.icon} size={24} stroke={1.9} />
          <span class="label">{tab.label}</span>
          {#if badge}
            <span class="badge" class:wide={badge.length > 2}>
              <span aria-hidden="true">{badge}</span>
              <span class="sr-only">, {badgeLabel[tab.href]?.(badge) ?? badge}</span>
            </span>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  ul { margin: 0; padding: 0; list-style: none; display: flex; }
  li { flex: 1; }
  a {
    position: relative;
    min-height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: var(--cc-muted);
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    border-radius: 14px;
  }
  a:hover { color: var(--cc-ink); }
  a[aria-current='page'] { color: var(--cc-adobe); }
  .badge {
    position: absolute;
    top: 4px;
    left: calc(50% + 6px);
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--cc-adobe);
    color: var(--cc-paper);
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
  }
  .badge.wide { background: var(--cc-ink); }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* Desktop: the tabs become a vertical sidebar list. */
  @media (min-width: 900px) {
    ul { flex-direction: column; gap: 4px; }
    a {
      flex-direction: row;
      justify-content: flex-start;
      gap: 12px;
      padding: 0 14px;
      font-size: 16px;
    }
    a[aria-current='page'] { background: var(--cc-paper); color: var(--cc-ink); }
    .badge { position: static; margin-left: auto; }
  }
</style>
