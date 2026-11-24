<script lang="ts">
  import type { Snippet } from 'svelte';
  /** Single phone-width column for sign-in, pre-arrival and checked-out screens. */
  let { children }: { children: Snippet } = $props();
</script>

<main class="screen">{@render children()}</main>

<style>
  .screen {
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    padding: 20px 18px 40px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
</style>
