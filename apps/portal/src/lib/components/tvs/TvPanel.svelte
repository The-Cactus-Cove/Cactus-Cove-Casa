<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatClock, formatTime } from '#lib/house/format.ts';
  import type { TvState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import ExpandableCard from '../ui/ExpandableCard.svelte';
  import Status from '../ui/Status.svelte';
  import LockoutEditor from './LockoutEditor.svelte';
  import SleepTimer from './SleepTimer.svelte';
  import TvRemote from './TvRemote.svelte';

  /** One TV: a compact header that expands to power, remote, sleep timer and bedtime lockout. */
  let { tv, open = false }: { tv: TvState; open?: boolean } = $props();
  const portal = getPortal();

  const details = $derived(
    [
      tv.sleep.kind !== 'off' ? `Sleep ${formatTime(tv.sleep.endsAt, portal.timeZone)}` : null,
      tv.lockout.enabled ? `Lockout ${formatClock(tv.lockout.from)}` : null
    ].filter(Boolean)
  );

  const power = () => portal.send({ type: 'tv-power', tvId: tv.id, on: !tv.on }, tv.on ? 'TV turning off…' : 'TV turning on…');
</script>

<ExpandableCard {open}>
  {#snippet header()}
    <DeviceHeader icon="tv" tint="sky" title={tv.name}>
      <span class="line">
        {#if !tv.available}
          <Status tone="warn">Not responding</Status>
        {:else}
          <Status tone={tv.on ? 'ok' : 'muted'}>{tv.on ? 'On' : 'Off'}</Status>
        {/if}
        {#each details as d (d)}<span class="detail">· {d}</span>{/each}
      </span>
    </DeviceHeader>
  {/snippet}

  <Button variant={tv.on ? 'dark' : 'blue'} disabled={!tv.available} onclick={power}>
    {tv.on ? `Turn off the ${tv.label.toLowerCase()} TV` : `Turn on the ${tv.label.toLowerCase()} TV`}
  </Button>
  {#if tv.on && tv.available}<TvRemote {tv} />{/if}
  <SleepTimer {tv} />
  <div class="rule"></div>
  <LockoutEditor id="lockout-{tv.id}" lockout={tv.lockout} onchange={(lockout) => portal.send({ type: 'tv-lockout', tvId: tv.id, lockout })} />
</ExpandableCard>

<style>
  .line { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 6px; }
  .detail { font-size: 13px; color: var(--cc-muted); }
  .rule { border-top: 2px dashed var(--cc-line); }
</style>
