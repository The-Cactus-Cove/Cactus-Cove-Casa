<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatDay, formatTime } from '#lib/house/format.ts';
  import type { HouseInfo } from '#lib/house/types.ts';
  import Notice from '../ui/Notice.svelte';
  import ArrivalCard from './ArrivalCard.svelte';
  import CheckoutCard from './CheckoutCard.svelte';
  import DoorsCard from './DoorsCard.svelte';
  import GarageCard from './GarageCard.svelte';
  import GuideLink from './GuideLink.svelte';
  import HeadingOutCard from './HeadingOutCard.svelte';
  import HouseInfoCard from './HouseInfoCard.svelte';
  import LockCard from './LockCard.svelte';
  import StayTicket from './StayTicket.svelte';
  import ThermostatCard from './ThermostatCard.svelte';
  import TopBar from './TopBar.svelte';
  import TvCard from './TvCard.svelte';

  let { info }: { info: HouseInfo } = $props();
  const portal = getPortal();
  const checkIn = $derived(`${formatDay(portal.stay.checkIn, portal.timeZone)} at ${formatTime(portal.stay.checkIn, portal.timeZone)}`);
</script>

<TopBar />
<h1>Howdy, {portal.stay.guestName}</h1>
<StayTicket />

{#if portal.house}
  {@const house = portal.house}
  {#if portal.stage === 'checkout-day'}<CheckoutCard {house} />{/if}
  <h2>The ranch controls</h2>
  <HeadingOutCard away={house.away} />
  <GarageCard garage={house.garage} />
  {#each house.locks as lock (lock.id)}<LockCard {lock} />{/each}
  <ThermostatCard thermostat={house.thermostat} />
  <TvCard tvs={house.tvs} />
  <DoorsCard doors={house.doors} />
{:else if portal.snapshot.arrival}
  <h2>Before you arrive</h2>
  <Notice>Door, garage and TV controls switch on at check-in, {checkIn}. You can set your arrival temperature now.</Notice>
  <ArrivalCard setpoint={portal.snapshot.arrival.setpoint} />
{/if}

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
