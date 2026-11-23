<script lang="ts">
  import GuestApp from '#lib/components/GuestApp.svelte';
  import NoLink from '#lib/components/screens/NoLink.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Cactus Cove · Your stay</title>
</svelte:head>

{#if data.signedIn}
  <GuestApp snapshot={data.snapshot} info={data.info} demo={data.demo} />
{:else}
  <NoLink />
{/if}
