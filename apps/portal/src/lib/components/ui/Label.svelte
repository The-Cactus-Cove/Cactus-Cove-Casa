<script lang="ts">
  import type { Snippet } from 'svelte';
  /** Small uppercase section label used inside cards and the ticket. */
  let { tone = 'muted', children }: { tone?: 'muted' | 'ticket' | 'gold'; children: Snippet } = $props();
</script>

<span class="label {tone}">{@render children()}</span>

<style>
  .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
  .muted { color: var(--cc-muted); }
  .ticket { color: var(--cc-ticket-label); }
  .gold { color: var(--cc-gold); letter-spacing: 2.5px; font-weight: 600; }
</style>
