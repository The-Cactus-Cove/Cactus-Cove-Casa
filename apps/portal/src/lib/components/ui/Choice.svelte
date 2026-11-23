<script lang="ts" generics="T extends string | number">
  interface Option {
    value: T;
    label: string;
  }
  interface Props {
    options: Option[];
    value: T;
    /** Accessible name for the group. */
    label: string;
    /** Fixed number of columns; omit to wrap to content width. */
    columns?: number;
    size?: 'sm' | 'md';
    disabled?: boolean;
    onchange: (value: T) => void;
  }
  let { options, value, label, columns, size = 'md', disabled = false, onchange }: Props = $props();
</script>

<div class="choice {size}" class:grid={!!columns} style:--cols={columns} role="group" aria-label={label}>
  {#each options as option (option.value)}
    <button
      type="button"
      aria-pressed={option.value === value}
      {disabled}
      onclick={() => option.value !== value && onchange(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .choice { display: flex; flex-wrap: wrap; gap: 8px; }
  .grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); }
  button {
    min-height: var(--cc-tap);
    padding: 0 14px;
    border: 2px solid var(--cc-field);
    border-radius: 12px;
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }
  .grid button { padding: 0 4px; }
  .sm button { font-size: 13px; }
  button[aria-pressed='true'] {
    border-color: var(--cc-ink);
    background: var(--cc-ink);
    color: var(--cc-paper);
    font-weight: 600;
  }
  button:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
