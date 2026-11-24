<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Portal, setPortal } from '#lib/client/portal.svelte.ts';
  import AppShell from '#lib/components/app/AppShell.svelte';
  import Screen from '#lib/components/app/Screen.svelte';
  import DemoBar from '#lib/components/dashboard/DemoBar.svelte';
  import Ended from '#lib/components/screens/Ended.svelte';
  import NoLink from '#lib/components/screens/NoLink.svelte';
  import PreArrival from '#lib/components/screens/PreArrival.svelte';
  import type { PortalSnapshot } from '#lib/house/types.ts';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();

  // One Portal for the whole signed-in app, shared by every tab through context.
  const initial = untrack(() => (data.signedIn ? data.snapshot : null));
  const portal = initial ? setPortal(new Portal(initial)) : null;
  // Fresh page data (e.g. after a form post) replaces the live snapshot.
  $effect(() => {
    if (portal && data.signedIn) portal.snapshot = data.snapshot as PortalSnapshot;
  });
  onMount(() => portal?.connect());
</script>

<svelte:head>
  <title>Cactus Cove · Your stay</title>
</svelte:head>

{#if !data.signedIn || !portal}
  <Screen><NoLink /></Screen>
{:else if portal.stage === 'ended'}
  <Screen><Ended stay={portal.stay} contact={data.contact} /></Screen>
{:else if portal.snapshot.arrival}
  <Screen>
    <PreArrival setpoint={portal.snapshot.arrival.setpoint} />
    {#if data.demo}<DemoBar stage={portal.stage} stages={data.demo.stages} />{/if}
  </Screen>
{:else}
  <AppShell>
    {@render children()}
    {#if data.demo}<DemoBar stage={portal.stage} stages={data.demo.stages} />{/if}
  </AppShell>
{/if}
