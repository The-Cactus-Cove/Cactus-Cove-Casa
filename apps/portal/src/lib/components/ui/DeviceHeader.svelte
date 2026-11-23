<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon, { type IconName } from './Icon.svelte';

  type Tint = 'sage' | 'clay' | 'honey' | 'sky';
  interface Props {
    icon: IconName;
    tint: Tint;
    title: string;
    /** Status line(s) under the title. */
    children?: Snippet;
    /** Content on the right, e.g. a power button. */
    aside?: Snippet;
  }
  let { icon, tint, title, children, aside }: Props = $props();
</script>

<div class="head">
  <div class="tile {tint}"><Icon name={icon} size={26} stroke={1.8} /></div>
  <div class="text">
    <h3>{title}</h3>
    {@render children?.()}
  </div>
  {@render aside?.()}
</div>

<style>
  .head { display: flex; align-items: center; gap: 14px; }
  .tile {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sage { background: var(--cc-tint-sage); color: var(--cc-saguaro); }
  .clay { background: var(--cc-tint-clay); color: var(--cc-adobe); }
  .honey { background: var(--cc-tint-honey); color: var(--cc-honey); }
  .sky { background: var(--cc-tint-sky); color: var(--cc-tv); }
  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  h3 {
    margin: 0;
    font-family: var(--cc-font-body);
    font-weight: 600;
    font-size: 17px;
  }
</style>
