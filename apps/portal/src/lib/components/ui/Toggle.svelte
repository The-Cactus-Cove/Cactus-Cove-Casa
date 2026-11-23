<script lang="ts">
  interface Props {
    on: boolean;
    /** id of the element that names this switch. */
    labelledby: string;
    onchange: (on: boolean) => void;
  }
  let { on, labelledby, onchange }: Props = $props();
</script>

<button type="button" role="switch" aria-checked={on} aria-labelledby={labelledby} onclick={() => onchange(!on)}>
  {on ? 'On' : 'Off'}
</button>

<style>
  button {
    min-width: 64px;
    min-height: var(--cc-tap);
    border: 2px solid var(--cc-field);
    border-radius: var(--cc-radius-pill);
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }
  button[aria-checked='true'] { background: var(--cc-saguaro); border-color: var(--cc-saguaro); color: var(--cc-paper); }
</style>
