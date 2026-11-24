<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { formatDay, formatTime } from '#lib/house/format.ts';
  import StayTicket from '../dashboard/StayTicket.svelte';
  import TopBar from '../dashboard/TopBar.svelte';
  import ArrivalCard from '../thermostat/ArrivalCard.svelte';
  import Notice from '../ui/Notice.svelte';

  /** Before check-in: the stay and the arrival temperature, nothing else. */
  let { setpoint }: { setpoint: number } = $props();
  const portal = getPortal();
  const checkIn = $derived(`${formatDay(portal.stay.checkIn, portal.timeZone)} at ${formatTime(portal.stay.checkIn, portal.timeZone)}`);
</script>

<TopBar />
<h1>Howdy, {portal.stay.guestName}</h1>
<StayTicket />
<Notice>The rest of your stay page (doors, Wi-Fi, TVs and the house guide) opens at check-in, {checkIn}. You can set your arrival temperature now.</Notice>
<ArrivalCard {setpoint} />

<style>
  h1 { margin: 0; font-size: 30px; }
</style>
