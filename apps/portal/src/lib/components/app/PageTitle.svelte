<script lang="ts">
  /** Tab page heading, also sets the document title. */
  let { title }: { title: string } = $props();
</script>

<svelte:head><title>{title} · Cactus Cove</title></svelte:head>
<h1>{title}</h1>

<style>
  h1 { margin: 0; font-size: 30px; }
</style>
