<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import CheckoutCard from '#lib/components/dashboard/CheckoutCard.svelte';
  import GuideLink from '#lib/components/dashboard/GuideLink.svelte';
  import StayTicket from '#lib/components/dashboard/StayTicket.svelte';
  import HouseStatus from '#lib/components/home/HouseStatus.svelte';
  import QuickActions from '#lib/components/home/QuickActions.svelte';
  import WifiCard from '#lib/components/home/WifiCard.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const portal = getPortal();
</script>

{#if portal?.house}
  <h1>Howdy, {portal.stay.guestName}</h1>
  <StayTicket />
  {#if portal.stage === 'checkout-day'}<CheckoutCard house={portal.house} />{/if}
  <QuickActions away={portal.house.away} />
  <HouseStatus house={portal.house} />
  <GuideLink />
  {#if data.signedIn}<WifiCard wifi={portal.snapshot.wifi} contact={data.contact} />{/if}
{/if}

<style>
  h1 { margin: 0; font-size: 30px; }
</style>
