<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatDay, formatTime } from '#lib/house/format.ts';
  import { controlsLive } from '#lib/house/stage.ts';
  import type { HouseInfo, HouseState } from '#lib/house/types.ts';
  import Notice from '../ui/Notice.svelte';
  import CheckoutCard from './CheckoutCard.svelte';
  import DoorsCard from './DoorsCard.svelte';
  import GarageCard from './GarageCard.svelte';
  import GuideLink from './GuideLink.svelte';
  import HouseInfoCard from './HouseInfoCard.svelte';
  import LockCard from './LockCard.svelte';
  import StayTicket from './StayTicket.svelte';
  import ThermostatCard from './ThermostatCard.svelte';
  import TopBar from './TopBar.svelte';
  import TvCard from './TvCard.svelte';

  let { house, info }: { house: HouseState; info: HouseInfo } = $props();
  const portal = getPortal();
  const live = $derived(controlsLive(portal.stage));
  const before = $derived(portal.stage === 'before');
  const checkIn = $derived(`${formatDay(portal.stay.checkIn, portal.timeZone)} at ${formatTime(portal.stay.checkIn, portal.timeZone)}`);
</script>

<TopBar />
<h1>Howdy, {portal.stay.guestName}</h1>
<StayTicket />

{#if portal.stage === 'checkout-day'}<CheckoutCard {house} />{/if}

<h2>The ranch controls</h2>
{#if before}
  <Notice>Door and garage controls unlock at check-in, {checkIn}. You can set your arrival temperature now.</Notice>
{/if}

<GarageCard garage={house.garage} {live} />
{#each house.locks as lock (lock.id)}<LockCard {lock} {live} />{/each}
<ThermostatCard thermostat={house.thermostat} arrival={before} />

{#if live}
  <TvCard tvs={house.tvs} />
{:else}
  <Notice>TV remotes and sleep timers switch on at check-in.</Notice>
{/if}

<DoorsCard doors={house.doors} />
<GuideLink />
<HouseInfoCard {info} />

<style>
  h1 { margin: 0; font-size: 30px; }
  h2 {
    margin: 6px 0 0;
    font-family: var(--cc-font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--cc-muted);
  }
</style>
