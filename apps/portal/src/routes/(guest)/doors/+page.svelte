<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import AllDoorsCard from '#lib/components/doors/AllDoorsCard.svelte';
  import GarageCard from '#lib/components/doors/GarageCard.svelte';
  import LockCard from '#lib/components/doors/LockCard.svelte';
  import PageTitle from '#lib/components/app/PageTitle.svelte';

  const portal = getPortal();
</script>

<PageTitle title="Doors" />
{#if portal.house}
  <AllDoorsCard locks={portal.house.locks} />
  {#each portal.house.locks as lock (lock.id)}<LockCard {lock} />{/each}
  <GarageCard garage={portal.house.garage} />
{/if}
