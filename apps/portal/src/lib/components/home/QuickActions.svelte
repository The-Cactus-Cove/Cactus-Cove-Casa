<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import type { AwaySettings as Away } from '#lib/house/types.ts';
  import AwaySettings from '../thermostat/AwaySettings.svelte';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';

  /** One-tap Heading out (day trips) and Lock up (night time). */
  let { away }: { away: Away } = $props();
  const portal = getPortal();
  let busy = $state<'out' | 'lock' | null>(null);
  let showSettings = $state(false);

  const thermostatLine = $derived(away.adjustThermostat ? `set the thermostat to ${away.setpoint}°` : 'leave the thermostat as it is');
  const GARAGE_WARNING = 'Make sure nothing is under the garage door.';

  async function run(kind: 'out' | 'lock') {
    const yes = await confirmSheet.ask(
      kind === 'out'
        ? {
            title: 'Heading out?',
            body: `We’ll lock both doors, close the garage, turn off every TV and ${thermostatLine}. ${GARAGE_WARNING}`,
            cta: 'Lock up and go'
          }
        : { title: 'Lock up for the night?', body: `We’ll lock both doors and close the garage. ${GARAGE_WARNING}`, cta: 'Lock up' }
    );
    if (!yes) return;
    busy = kind;
    await portal.send(
      kind === 'out' ? { type: 'heading-out' } : { type: 'lock-up' },
      kind === 'out' ? 'Locking up. Enjoy your day out!' : 'Locking up. Good night!'
    );
    busy = null;
  }
</script>

<Card gap={12} label="Quick actions">
  <div class="actions">
    <div class="action">
      <Button variant="green" size="lg" busy={busy === 'out'} onclick={() => run('out')}>Heading out</Button>
      <p>Lock up, close the garage, TVs off and {thermostatLine}.</p>
    </div>
    <div class="action">
      <Button variant="dark" size="lg" busy={busy === 'lock'} onclick={() => run('lock')}>Lock up</Button>
      <p>Lock the doors and close the garage. Handy at bedtime.</p>
    </div>
  </div>

  {#if showSettings}
    <div class="settings" id="away-home"><AwaySettings {away} id="away-home-settings" /></div>
  {/if}
  <button type="button" class="link" aria-expanded={showSettings} aria-controls="away-home" onclick={() => (showSettings = !showSettings)}>
    {showSettings ? 'Done' : 'Change the away temperature'}
  </button>
</Card>

<style>
  .actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .action { display: flex; flex-direction: column; gap: 8px; }
  p { margin: 0; font-size: 13px; line-height: 1.4; color: var(--cc-muted); }
  .settings { border-top: 2px dashed var(--cc-line); padding-top: 14px; }
  .link {
    align-self: center;
    min-height: var(--cc-tap);
    border: 0;
    background: transparent;
    color: var(--cc-adobe);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
