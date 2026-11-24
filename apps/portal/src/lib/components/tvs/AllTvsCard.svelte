<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { Lockout, TvState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import LockoutEditor from './LockoutEditor.svelte';

  const DEFAULT_LOCKOUT: Lockout = { enabled: true, from: '22:00', to: '07:00', scope: { kind: 'stay' } };

  /** Whole-house TV settings: everything off, and one bedtime lockout for every TV. */
  let { tvs }: { tvs: TvState[] } = $props();
  const portal = getPortal();

  // Start from a lockout already in use, so "apply to all" copies the kid's room schedule by default.
  let draft = $state<Lockout | null>(null);
  const shown = $derived(draft ?? structuredClone($state.snapshot(tvs.find((t) => t.lockout.enabled)?.lockout ?? DEFAULT_LOCKOUT)));
  const anyOn = $derived(tvs.some((t) => t.on));

  async function apply() {
    if (await portal.send({ type: 'tvs-lockout', lockout: shown }, shown.enabled ? 'Lockout set on every TV' : 'Lockout off on every TV')) draft = null;
  }
</script>

<Card gap={14} label="All TVs">
  <div class="head">
    <h3>All TVs</h3>
    <Button variant="dark" size="sm" block={false} disabled={!anyOn} onclick={() => portal.send({ type: 'tvs-off' }, 'Turning off every TV…')}>
      {anyOn ? 'Turn all off' : 'All off'}
    </Button>
  </div>
  <div class="rule"></div>
  <LockoutEditor
    id="lockout-all"
    title="Bedtime lockout for every TV"
    description="Set one schedule for all {tvs.length} TVs. You can still change each TV below."
    lockout={shown}
    onchange={(l) => (draft = l)}
  />
  <Button variant="outline" onclick={apply}>Apply to all TVs</Button>
</Card>

<style>
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h3 { margin: 0; font-size: 17px; font-weight: 600; }
  .rule { border-top: 2px dashed var(--cc-line); }
</style>
