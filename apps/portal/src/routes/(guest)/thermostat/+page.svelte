<script lang="ts">
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import PageTitle from '#lib/components/app/PageTitle.svelte';
  import AwayCard from '#lib/components/thermostat/AwayCard.svelte';
  import ThermostatCard from '#lib/components/thermostat/ThermostatCard.svelte';

  const portal = getPortal();
</script>

<PageTitle title="Thermostat" />
{#if portal.house}
  <ThermostatCard thermostat={portal.house.thermostat} />
  <AwayCard away={portal.house.away} />
{/if}
