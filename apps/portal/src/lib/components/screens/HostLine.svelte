<script lang="ts">
  /** "Trouble getting in? Text your host at …" footer line. */
  let { lead, phone }: { lead: string; phone: string | null } = $props();
</script>

<p class="host">
  {lead}
  {#if phone}<a href="sms:{phone}">Text your host at {phone}</a>{:else}Text your host.{/if}
</p>

<style>
  .host { margin: auto 0 0; padding-top: 24px; text-align: center; font-size: 14px; color: var(--cc-muted); }
</style>
