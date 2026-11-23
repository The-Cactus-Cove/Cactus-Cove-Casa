<script lang="ts">
  import { toast } from '#lib/client/toast.svelte.ts';
</script>

<div class="region" role="status" aria-live="polite">
  {#if toast.message}<div class="toast">{toast.message}</div>{/if}
</div>

<style>
  .region {
    position: fixed;
    top: 16px;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    padding: 0 18px;
    pointer-events: none;
  }
  .toast {
    width: 100%;
    max-width: 444px;
    background: var(--cc-saguaro-deep);
    color: var(--cc-paper);
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
  }
</style>
