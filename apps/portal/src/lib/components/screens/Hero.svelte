<script lang="ts">
  import type { Snippet } from 'svelte';
  import Mark from '@cactus-cove/theme/logo.svg?raw';

  /** Centered logo, title and line used by the full-screen states. */
  let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<div class="hero">
  <span class="mark" aria-hidden="true">{@html Mark}</span>
  <h1>{title}</h1>
  {@render children?.()}
</div>

<style>
  .hero { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; padding-top: 48px; }
  .mark :global(svg) { width: 72px; height: 72px; }
  h1 { margin: 0; font-size: 34px; }
</style>
