<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    /** Space between children, px. */
    gap?: number;
    /** Adobe outline for the checkout card. */
    emphasis?: boolean;
    label?: string;
    children: Snippet;
  }
  let { gap = 14, emphasis = false, label, children }: Props = $props();
</script>

<section class="card" class:emphasis style:gap="{gap}px" aria-label={label}>
  {@render children()}
</section>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background: var(--cc-paper);
    border: 1.5px solid var(--cc-line);
    border-radius: 20px;
    padding: 18px;
  }
  .emphasis { border: 2px solid var(--cc-adobe); }
</style>
