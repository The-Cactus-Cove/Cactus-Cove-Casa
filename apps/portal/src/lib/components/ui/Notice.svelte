<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<p class="notice">{@render children()}</p>

<style>
  .notice {
    margin: 0;
    background: var(--cc-notice);
    border: 1.5px dashed var(--cc-notice-border);
    border-radius: var(--cc-radius);
    padding: 14px 16px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--cc-notice-ink);
  }
</style>
