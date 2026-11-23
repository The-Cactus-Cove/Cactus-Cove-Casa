<script lang="ts">
  /** Brand on the left, sign out on the right. */
  let { signOut = true }: { signOut?: boolean } = $props();
</script>

<header class="bar">
  <span class="brand">Cactus Cove</span>
  {#if signOut}
    <form method="POST" action="/signout">
      <button type="submit">Sign out</button>
    </form>
  {/if}
</header>

<style>
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: var(--cc-tap); }
  .brand { font-family: var(--cc-font-display); font-size: 18px; color: var(--cc-saguaro); }
  button {
    min-height: var(--cc-tap);
    padding: 0 14px;
    border: 1.5px solid var(--cc-field);
    border-radius: var(--cc-radius-pill);
    background: transparent;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    color: var(--cc-ink);
    cursor: pointer;
  }
</style>
