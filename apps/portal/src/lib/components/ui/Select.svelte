<script lang="ts" generics="T extends string">
  interface Props {
    id: string;
    label: string;
    value: T;
    options: { value: T; label: string }[];
    /** Label above instead of beside. */
    stacked?: boolean;
    onchange: (value: T) => void;
  }
  let { id, label, value, options, stacked = false, onchange }: Props = $props();
</script>

<div class="field" class:stacked>
  <label for={id}>{label}</label>
  <select {id} {value} onchange={(e) => onchange(e.currentTarget.value as T)}>
    {#each options as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
  </select>
</div>

<style>
  .field { display: flex; align-items: center; gap: 10px; }
  .stacked { flex-direction: column; align-items: stretch; gap: 6px; }
  label { font-size: 15px; }
  .stacked label { font-size: 13px; color: var(--cc-muted); }
  select {
    flex: 1;
    min-height: var(--cc-tap);
    border: 2px solid var(--cc-field);
    border-radius: 12px;
    background: var(--cc-field-bg);
    font: inherit;
    font-size: 16px;
    font-weight: 500;
    color: var(--cc-ink);
    padding: 0 10px;
  }
</style>
