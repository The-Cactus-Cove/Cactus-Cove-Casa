<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'primary' | 'green' | 'dark' | 'blue' | 'outline';
  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: 'sm' | 'md' | 'lg';
    /** Stretch to the card's width. */
    block?: boolean;
    busy?: boolean;
    children: Snippet;
  }
  let { variant = 'primary', size = 'md', block = true, busy = false, type = 'button', disabled, children, ...rest }: Props = $props();
</script>

<button {type} class="btn {variant} {size}" class:block disabled={disabled || busy} aria-busy={busy || undefined} {...rest}>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    border-radius: var(--cc-radius-pill);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    color: var(--cc-paper);
  }
  .block { width: 100%; }
  .sm { min-height: var(--cc-tap); padding: 0 18px; font-size: 15px; }
  .md { min-height: 52px; padding: 0 20px; font-size: 16px; }
  .lg { min-height: 54px; padding: 0 24px; font-size: 17px; }
  .primary { background: var(--cc-adobe); }
  .primary:hover:not(:disabled) { background: var(--cc-adobe-dark); }
  .green { background: var(--cc-saguaro); }
  .dark { background: var(--cc-ink); }
  .blue { background: var(--cc-tv); }
  .outline {
    background: transparent;
    color: var(--cc-ink);
    border: 1.5px solid var(--cc-field);
    font-weight: 500;
  }
  .btn:disabled {
    background: var(--cc-disabled);
    color: var(--cc-disabled-ink);
    border-color: transparent;
    cursor: not-allowed;
  }
  .btn[aria-busy='true'] { cursor: progress; }
</style>
