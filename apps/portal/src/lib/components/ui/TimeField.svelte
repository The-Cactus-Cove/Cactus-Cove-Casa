<script lang="ts">
  interface Props {
    id: string;
    label: string;
    value: string;
    disabled?: boolean;
    /** Label above the input instead of beside it. */
    stacked?: boolean;
    onchange: (value: string) => void;
  }
  let { id, label, value, disabled = false, stacked = false, onchange }: Props = $props();
</script>

<div class="field" class:stacked>
  <label for={id}>{label}</label>
  <input
    {id}
    type="time"
    {value}
    {disabled}
    onchange={(e) => e.currentTarget.value && onchange(e.currentTarget.value)}
  />
</div>

<style>
  .field { display: flex; align-items: center; gap: 12px; }
  .stacked { flex-direction: column; align-items: stretch; gap: 6px; }
  label { font-size: 15px; }
  .stacked label { font-size: 13px; color: var(--cc-muted); }
  input {
    height: var(--cc-tap);
    border: 2px solid var(--cc-field);
    border-radius: 12px;
    background: var(--cc-field-bg);
    font: inherit;
    font-size: 16px;
    color: var(--cc-ink);
    padding: 0 10px;
  }
</style>
