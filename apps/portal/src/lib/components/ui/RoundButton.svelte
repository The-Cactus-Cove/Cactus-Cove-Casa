<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    size?: number;
    tone?: 'plain' | 'blue';
    'aria-label': string;
    children: Snippet;
  }
  let { size = 56, tone = 'plain', children, ...rest }: Props = $props();
</script>

<button type="button" class="round {tone}" style:--size="{size}px" {...rest}>{@render children()}</button>

<style>
  .round {
    width: var(--size);
    height: var(--size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid var(--cc-field);
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 26px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .blue {
    border: 0;
    background: var(--cc-tv);
    color: var(--cc-paper);
    font-size: 16px;
    font-weight: 700;
  }
  .round:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
