<script lang="ts">
  import type { Snippet } from 'svelte';
  import Status from './Status.svelte';

  /** "Adjusting…" / "✓ saved" feedback for a Settle, falling back to `children`. */
  let { status, saved, children }: { status: 'idle' | 'pending' | 'saved'; saved: string; children?: Snippet } = $props();
</script>

<span aria-live="polite">
  {#if status === 'pending'}
    <Status tone="honey" dot={false}>Adjusting…</Status>
  {:else if status === 'saved'}
    <Status tone="ok" dot={false}>✓ {saved}</Status>
  {:else}
    {@render children?.()}
  {/if}
</span>
