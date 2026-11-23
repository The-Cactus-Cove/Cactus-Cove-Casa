<script lang="ts">
  import type { Stage } from '#lib/house/types.ts';

  /** Mock mode only: jump the demo stay between stages. */
  let { stage, stages }: { stage: Stage; stages: Stage[] } = $props();
  const labels: Record<string, string> = { before: 'Before check-in', during: 'During stay', 'checkout-day': 'Checkout day' };
</script>

<form method="POST" action="/demo" class="demo" aria-label="Demo controls">
  <span>Demo · mock house</span>
  <div class="buttons">
    {#each stages as s (s)}
      <button name="stage" value={s} aria-pressed={s === stage}>{labels[s] ?? s}</button>
    {/each}
  </div>
</form>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 1.5px dashed var(--cc-notice-border);
    border-radius: 14px;
    font-size: 12px;
    color: var(--cc-muted);
  }
  .buttons { display: flex; flex-wrap: wrap; gap: 6px; }
  button {
    min-height: 36px;
    padding: 0 10px;
    border: 1.5px solid var(--cc-field);
    border-radius: var(--cc-radius-pill);
    background: transparent;
    font: inherit;
    font-size: 13px;
    color: var(--cc-ink);
    cursor: pointer;
  }
  button[aria-pressed='true'] { background: var(--cc-ink); color: var(--cc-paper); border-color: var(--cc-ink); }
</style>
