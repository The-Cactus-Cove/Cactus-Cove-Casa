<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatTime } from '#lib/house/format.ts';
  import type { HouseState } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import Icon from '../ui/Icon.svelte';

  let { house }: { house: HouseState } = $props();
  const portal = getPortal();
  let busy = $state(false);

  const checklist = $derived.by(() => {
    const tvOn = house.tvs.some((t) => t.on);
    return [
      { ok: !house.garage.open, label: house.garage.open ? 'Garage door is open' : 'Garage door closed' },
      ...house.locks.map((l) => ({ ok: l.locked, label: `${l.name} ${l.locked ? 'locked' : 'unlocked'}` })),
      { ok: !tvOn, label: tvOn ? 'A TV is still on' : 'TVs are off' },
      { ok: !house.doors.some((d) => d.open), label: house.doors.some((d) => d.open) ? 'A door is open' : 'All doors closed' }
    ];
  });

  async function checkout() {
    const yes = await confirmSheet.ask({
      title: 'Check out now?',
      body: 'We’ll lock up, close the garage and turn off the TVs behind you. Your access ends right away.',
      cta: 'Yes, check out'
    });
    if (!yes) return;
    busy = true;
    await portal.send({ type: 'checkout' });
    busy = false;
  }
</script>

<Card emphasis gap={12} label="Checking out">
  <h2>Heading out?</h2>
  <ul>
    {#each checklist as item (item.label)}
      <li class:warn={!item.ok}>
        <Icon name={item.ok ? 'check' : 'alert'} size={20} stroke={2.4} label={item.ok ? 'Done' : 'Needs attention'} />
        <span>{item.label}</span>
      </li>
    {/each}
  </ul>
  <Button size="lg" {busy} onclick={checkout}>Check out</Button>
  <small>Your access ends when you check out, or at {formatTime(portal.stay.checkOut, portal.timeZone)} at the latest.</small>
</Card>

<style>
  h2 { margin: 0; font-size: 22px; }
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 15px; }
  li { display: flex; align-items: center; gap: 10px; color: var(--cc-saguaro); }
  li span { color: var(--cc-ink); }
  li.warn { color: var(--cc-warning); }
  small { font-size: 13px; color: var(--cc-muted); }
</style>
