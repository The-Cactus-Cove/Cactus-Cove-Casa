<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';
  import { getPortal } from '#lib/client/portal.svelte.ts';
  import { Settle } from '#lib/client/settle.svelte.ts';
  import type { AwaySettings } from '#lib/house/types.ts';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import SetpointDial from '../ui/SetpointDial.svelte';
  import SettleStatus from '../ui/SettleStatus.svelte';
  import Toggle from '../ui/Toggle.svelte';

  /** One tap to lock up when leaving for the day; the guest chooses what the thermostat does. */
  let { away }: { away: AwaySettings } = $props();
  const portal = getPortal();
  let busy = $state(false);
  let showSettings = $state(false);

  const settle = new Settle<AwaySettings>((v) => portal.send({ type: 'away-settings', ...v }));
  const shown = $derived(settle.draft ?? away);
  const thermostatLine = $derived(shown.adjustThermostat ? `set the thermostat to ${shown.setpoint}°` : 'leave the thermostat as it is');

  async function headOut() {
    const yes = await confirmSheet.ask({
      title: 'Heading out?',
      body: `We’ll lock both doors, close the garage, turn off every TV and ${thermostatLine}. Make sure nothing is under the garage door.`,
      cta: 'Lock up and go'
    });
    if (!yes) return;
    busy = true;
    await portal.send({ type: 'heading-out' }, 'Locking up. Enjoy your day out!');
    busy = false;
  }
</script>

<Card gap={12} label="Heading out">
  <div class="head">
    <h3>Heading out</h3>
    <p>Lock up, close the garage, turn off the TVs and {thermostatLine}.</p>
  </div>
  <Button variant="green" size="lg" {busy} onclick={headOut}>Lock up and go</Button>

  {#if showSettings}
    <div class="settings" id="away-settings">
      <div class="row">
        <span id="away-adjust-label" class="label">Adjust the thermostat when I head out</span>
        <Toggle on={shown.adjustThermostat} labelledby="away-adjust-label" onchange={(adjustThermostat) => settle.set({ ...shown, adjustThermostat })} />
      </div>
      {#if shown.adjustThermostat}
        <SetpointDial size="md" label="Away temperature" value={shown.setpoint} onchange={(setpoint) => settle.set({ ...shown, setpoint })} />
      {/if}
      <SettleStatus status={settle.status} saved="Saved" />
    </div>
  {/if}

  <button type="button" class="link" aria-expanded={showSettings} aria-controls="away-settings" onclick={() => (showSettings = !showSettings)}>
    {showSettings ? 'Done' : 'Change thermostat setting'}
  </button>
</Card>

<style>
  .head { display: flex; flex-direction: column; gap: 4px; }
  h3 { margin: 0; font-family: var(--cc-font-display); font-weight: 400; font-size: 22px; }
  p { margin: 0; font-size: 14px; line-height: 1.45; color: var(--cc-muted); }
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
  .settings {
    display: flex;
    flex-direction: column;
    gap: 14px;
    border-top: 2px dashed var(--cc-line);
    padding-top: 14px;
  }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .label { font-size: 15px; font-weight: 500; }
</style>
