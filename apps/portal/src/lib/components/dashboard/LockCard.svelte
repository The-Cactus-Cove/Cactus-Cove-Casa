<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatTime } from '#lib/house/format.ts';
  import { holdOptions } from '#lib/house/holds.ts';
  import type { LockState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import DeviceHeader from '../ui/DeviceHeader.svelte';
  import Status from '../ui/Status.svelte';

  let { lock, live }: { lock: LockState; live: boolean } = $props();
  const portal = getPortal();
  const lower = $derived(lock.name.toLowerCase());

  async function unlock() {
    const yes = await confirmSheet.ask({
      title: `Unlock the ${lower}?`,
      body: 'It locks itself again shortly after the door closes.',
      cta: 'Yes, unlock it'
    });
    if (yes) await portal.send({ type: 'lock', lockId: lock.id, locked: false, holdUntil: null }, `${lock.name} unlocked`);
  }

  async function hold() {
    const options = holdOptions(new Date(), portal.stay);
    const until = (value: string) => options.find((o) => o.value === value)?.until ?? '';
    const picked = await confirmSheet.ask({
      title: `Keep the ${lower} unlocked?`,
      body: 'Handy when people are coming and going. It locks itself when the time is up.',
      choices: options.map((o) => ({ value: o.value, label: `${o.label} · until ${o.until}` })),
      initial: options[1]?.value ?? options[0]?.value,
      cta: (value) => `Keep unlocked until ${until(value)}`
    });
    if (picked) {
      await portal.send({ type: 'lock', lockId: lock.id, locked: false, holdUntil: picked }, `${lock.name} unlocked until ${until(picked)}`);
    }
  }

  const lockNow = () => portal.send({ type: 'lock', lockId: lock.id, locked: true }, `${lock.name} locked`);
</script>

<Card label={lock.name}>
  <DeviceHeader icon="lock" tint="clay" title={lock.name}>
    {#if lock.locked}
      <Status tone="ok">Locked</Status>
    {:else if lock.holdUntil}
      <Status tone="warn">Unlocked until {formatTime(lock.holdUntil, portal.timeZone)}</Status>
    {:else}
      <Status tone="warn">Unlocked · locks again after the door closes</Status>
    {/if}
  </DeviceHeader>
  {#if !live}
    <Button disabled>Available at check-in</Button>
  {:else if lock.locked}
    <div class="stack">
      <Button onclick={unlock}>Unlock {lower}</Button>
      <Button variant="outline" disabled={holdOptions(portal.now, portal.stay).length === 0} onclick={hold}>Keep unlocked for a while…</Button>
    </div>
  {:else}
    <Button variant="dark" onclick={lockNow}>Lock now</Button>
  {/if}
  <small>{lock.note}</small>
</Card>

<style>
  .stack { display: flex; flex-direction: column; gap: 10px; }
  small { font-size: 13px; color: var(--cc-muted); }
</style>
