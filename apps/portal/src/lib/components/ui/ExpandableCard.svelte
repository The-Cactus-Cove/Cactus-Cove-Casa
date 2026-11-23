<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  interface Props {
    open?: boolean;
    /** Always-visible header (tap to expand). */
    header: Snippet;
    children: Snippet;
  }
  let { open = $bindable(false), header, children }: Props = $props();
</script>

<details class="card" bind:open>
  <summary>
    <div class="header">{@render header()}</div>
    <span class="chevron" aria-hidden="true"><Icon name="chevron-down" size={22} stroke={2.2} /></span>
  </summary>
  <div class="body">{@render children()}</div>
</details>

<style>
  .card {
    background: var(--cc-paper);
    border: 1.5px solid var(--cc-line);
    border-radius: 20px;
  }
  summary {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px;
    cursor: pointer;
    list-style: none;
    border-radius: 20px;
  }
  summary::-webkit-details-marker { display: none; }
  .header { flex: 1; min-width: 0; }
  .chevron {
    display: flex;
    color: var(--cc-muted);
    transition: transform 0.2s ease;
  }
  details[open] .chevron { transform: rotate(180deg); }
  .body { display: flex; flex-direction: column; gap: 16px; padding: 0 18px 18px; }
  @media (prefers-reduced-motion: reduce) {
    .chevron { transition: none; }
  }
</style>
