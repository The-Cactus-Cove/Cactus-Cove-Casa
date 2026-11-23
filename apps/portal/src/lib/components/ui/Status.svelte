<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    tone?: 'ok' | 'warn' | 'muted' | 'honey';
    /** Show the ● dot. */
    dot?: boolean;
    children: Snippet;
  }
  let { tone = 'muted', dot = true, children }: Props = $props();
</script>

<span class="status {tone}">{#if dot}<span aria-hidden="true">●</span>{/if} {@render children()}</span>

<style>
  .status { font-size: 14px; font-weight: 600; }
  .ok { color: var(--cc-saguaro); }
  .warn { color: var(--cc-warning); }
  .muted { color: var(--cc-muted); }
  .honey { color: var(--cc-honey); }
</style>
