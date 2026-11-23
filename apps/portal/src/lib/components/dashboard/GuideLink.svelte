<script lang="ts">
  import Icon from '../ui/Icon.svelte';
</script>

<a href="/guide/" class="guide">
  <span class="icon"><Icon name="book" size={30} stroke={1.8} /></span>
  <span class="text">
    <span class="title">House guide</span>
    <span class="sub">Wi-Fi, trash day, appliances, local tips</span>
  </span>
  <Icon name="chevron-right" size={22} stroke={2.2} />
</a>

<style>
  .guide {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--cc-saguaro);
    color: var(--cc-paper);
    text-decoration: none;
    border-radius: 20px;
    padding: 18px;
  }
  .guide:hover { color: var(--cc-paper); background: var(--cc-saguaro-deep); }
  .icon { color: var(--cc-gold); display: flex; }
  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .title { font-weight: 600; font-size: 17px; }
  .sub { font-size: 14px; color: #DCE6D4; }
</style>
