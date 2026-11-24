<script lang="ts">
  import SignOut from './SignOut.svelte';
</script>

<header class="bar">
  <span class="brand">Cactus Cove</span>
  <SignOut />
</header>

<style>
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: var(--cc-tap); }
  .brand { font-family: var(--cc-font-display); font-size: 18px; color: var(--cc-saguaro); }
</style>
