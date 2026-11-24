<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import PageTitle from '#lib/components/app/PageTitle.svelte';
  import AllTvsCard from '#lib/components/tvs/AllTvsCard.svelte';
  import TvPanel from '#lib/components/tvs/TvPanel.svelte';

  const portal = getPortal();
</script>

<PageTitle title="TVs" />
{#if portal.house}
  <AllTvsCard tvs={portal.house.tvs} />
  {#each portal.house.tvs as tv (tv.id)}<TvPanel {tv} />{/each}
{/if}
