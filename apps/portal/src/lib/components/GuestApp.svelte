<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Portal, setPortal } from '#lib/client/portal.svelte.ts';
  import type { HouseInfo, PortalSnapshot, Stage } from '#lib/house/types.ts';
  import Dashboard from './dashboard/Dashboard.svelte';
  import DemoBar from './dashboard/DemoBar.svelte';
  import Ended from './screens/Ended.svelte';

  interface Props {
    snapshot: PortalSnapshot;
    info: HouseInfo;
    demo: { stage: Stage; stages: Stage[] } | null;
  }
  let { snapshot, info, demo }: Props = $props();

  const portal = setPortal(new Portal(untrack(() => snapshot)));
  // New page data (e.g. after a form post) replaces the live snapshot.
  $effect(() => {
    portal.snapshot = snapshot;
  });
  onMount(() => portal.connect());
</script>

{#if portal.stage === 'ended' || !portal.house}
  <Ended stay={portal.stay} {info} />
{:else}
  <Dashboard house={portal.house} {info} />
  {#if demo}<DemoBar stage={portal.stage} stages={demo.stages} />{/if}
{/if}
