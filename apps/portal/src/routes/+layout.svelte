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

<main class="shell">{@render children()}</main>
<Toast />
<Sheet />

<style>
  .shell {
    min-height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    padding: 20px 18px 40px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
</style>
