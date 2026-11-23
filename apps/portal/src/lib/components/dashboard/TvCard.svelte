<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { TvState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import Choice from '../ui/Choice.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import Status from '../ui/Status.svelte';
  import BedtimeLockout from './BedtimeLockout.svelte';
  import SleepTimer from './SleepTimer.svelte';
  import TvRemote from './TvRemote.svelte';

  let { tvs }: { tvs: TvState[] } = $props();
  const portal = getPortal();
  /** Until the guest picks one, show a TV that's on (or the first). */
  let selectedId = $state<string | null>(null);
  const tv = $derived(tvs.find((t) => t.id === selectedId) ?? tvs.find((t) => t.on) ?? tvs[0]);

  const power = () => portal.send({ type: 'tv-power', tvId: tv.id, on: !tv.on }, tv.on ? 'TV turning off…' : 'TV turning on…');
</script>

<Card gap={16} label="TVs">
  <DeviceHeader icon="tv" tint="sky" title="TVs">
    <span class="sub">Remote, sleep timer and bedtime lockout</span>
  </DeviceHeader>

  <Choice label="Choose a TV" options={tvs.map((t) => ({ value: t.id, label: t.label }))} value={tv.id} onchange={(id) => (selectedId = id)} />

  <div class="power">
    <div class="name">
      <span class="tv-name">{tv.name}</span>
      {#if !tv.available}
        <Status tone="warn">Not responding</Status>
      {:else}
        <Status tone={tv.on ? 'ok' : 'muted'}>{tv.on ? 'On' : 'Off'}</Status>
      {/if}
    </div>
    <Button size="sm" block={false} variant={tv.on ? 'dark' : 'blue'} disabled={!tv.available} onclick={power}>
      {tv.on ? 'Turn off' : 'Turn on'}
    </Button>
  </div>

  {#if tv.on && tv.available}<TvRemote {tv} />{/if}
  <SleepTimer {tv} />
  <BedtimeLockout {tv} />
</Card>

<style>
  .sub { font-size: 14px; color: var(--cc-muted); }
  .power { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .name { display: flex; flex-direction: column; gap: 2px; }
  .tv-name { font-weight: 600; font-size: 16px; }
</style>
