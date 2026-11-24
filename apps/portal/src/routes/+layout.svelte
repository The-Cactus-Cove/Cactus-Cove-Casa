<script lang="ts">
  import '@cactus-cove/theme/base.css';
  import Sheet from '#lib/components/ui/Sheet.svelte';
  import Toast from '#lib/components/ui/Toast.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="theme-color" content="#F6EEDF" />
</svelte:head>

{@render children()}
<Toast />
<Sheet />
