<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { TvState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import ExpandableCard from '../ui/ExpandableCard.svelte';
  import Select from '../ui/Select.svelte';
  import Status from '../ui/Status.svelte';
  import BedtimeLockout from './BedtimeLockout.svelte';
  import SleepTimer from './SleepTimer.svelte';
  import TvRemote from './TvRemote.svelte';

  let { tvs }: { tvs: TvState[] } = $props();
  const portal = getPortal();
  /** Until the guest picks one, show a TV that's on (or the first). */
  let selectedId = $state<string | null>(null);
  const tv = $derived(tvs.find((t) => t.id === selectedId) ?? tvs.find((t) => t.on) ?? tvs[0]);

  const summary = $derived.by(() => {
    const on = tvs.filter((t) => t.on);
    const power = on.length === 0 ? 'All TVs off' : on.length === 1 ? `${on[0].name} is on` : `${on.length} TVs on`;
    const locked = tvs.filter((t) => t.lockout.enabled).map((t) => t.label);
    return locked.length ? `${power} · Bedtime lockout on ${locked.join(', ')}` : power;
  });

  const power = () => portal.send({ type: 'tv-power', tvId: tv.id, on: !tv.on }, tv.on ? 'TV turning off…' : 'TV turning on…');
</script>

<ExpandableCard>
  {#snippet header()}
    <DeviceHeader icon="tv" tint="sky" title="TVs">
      <span class="sub">{summary}</span>
    </DeviceHeader>
  {/snippet}

  <Select
    id="tv-picker"
    label="TV"
    stacked
    value={tv.id}
    options={tvs.map((t) => ({ value: t.id, label: `${t.name}${t.on ? ' · On' : ''}` }))}
    onchange={(id) => (selectedId = id)}
  />

  <div class="power">
    {#if !tv.available}
      <Status tone="warn">Not responding</Status>
    {:else}
      <Status tone={tv.on ? 'ok' : 'muted'}>{tv.on ? 'On' : 'Off'}</Status>
    {/if}
    <Button size="sm" block={false} variant={tv.on ? 'dark' : 'blue'} disabled={!tv.available} onclick={power}>
      {tv.on ? 'Turn off' : 'Turn on'}
    </Button>
  </div>

  {#if tv.on && tv.available}<TvRemote {tv} />{/if}
  <SleepTimer {tv} />
  <BedtimeLockout {tv} />
</ExpandableCard>

<style>
  .sub { font-size: 14px; color: var(--cc-muted); line-height: 1.4; }
  .power { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
</style>
