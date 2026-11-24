<script lang="ts">
  import { enhance } from '$app/forms';
  import Screen from '#lib/components/app/Screen.svelte';
  import Button from '#lib/components/ui/Button.svelte';
  import Hero from '#lib/components/screens/Hero.svelte';
  import HostLine from '#lib/components/screens/HostLine.svelte';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let busy = $state(false);
</script>

<svelte:head>
  <title>Cactus Cove · Sign in</title>
</svelte:head>

<Screen>
<Hero title="Howdy, partner">
  <p class="lead">Your stay at Cactus Cove</p>
</Hero>

<form
  method="POST"
  class="card"
  use:enhance={() => {
    busy = true;
    return async ({ update }) => {
      await update();
      busy = false;
    };
  }}
>
  <label for="pin">Last 4 digits of your booking phone number</label>
  <input
    id="pin"
    name="pin"
    type="text"
    inputmode="numeric"
    pattern={'[0-9]{4}'}
    maxlength="4"
    autocomplete="off"
    placeholder="••••"
    required
    aria-describedby={form?.error ? 'pin-error' : undefined}
    aria-invalid={form?.error ? 'true' : undefined}
  />
  {#if form?.error}<span id="pin-error" class="error" role="alert">{form.error}</span>{/if}
  <Button type="submit" size="lg" {busy}>Open the gate</Button>
</form>

<HostLine lead="Trouble getting in?" phone={data.hostPhone} />
</Screen>

<style>
  .lead { margin: 0; color: var(--cc-muted); font-size: 16px; }
  .card {
    background: var(--cc-paper);
    border: 1.5px solid var(--cc-line);
    border-radius: 22px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 10px;
  }
  label { font-weight: 600; font-size: 15px; }
  input {
    height: 64px;
    border: 2px solid var(--cc-field);
    border-radius: 14px;
    background: var(--cc-field-bg);
    font: inherit;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 18px;
    text-align: center;
    color: var(--cc-ink);
    padding: 0 0 0 18px;
  }
  input:focus-visible { outline: 3px solid var(--cc-adobe); outline-offset: 1px; }
  .error { color: var(--cc-warning); font-size: 14px; }
</style>
