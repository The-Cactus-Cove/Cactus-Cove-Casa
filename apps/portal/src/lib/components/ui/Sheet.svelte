<script lang="ts">
  import { confirmSheet } from '#lib/client/confirm.svelte.ts';

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (confirmSheet.current && !dialog.open) dialog.showModal();
    if (!confirmSheet.current && dialog.open) dialog.close();
  });
</script>

<dialog
  bind:this={dialog}
  aria-labelledby="sheet-title"
  oncancel={(e) => (e.preventDefault(), confirmSheet.answer(false))}
  onclick={(e) => e.target === dialog && confirmSheet.answer(false)}
>
  {#if confirmSheet.current}
    {@const sheet = confirmSheet.current}
    <div class="panel">
      <div class="grip" aria-hidden="true"></div>
      <h3 id="sheet-title">{sheet.title}</h3>
      <p>{sheet.body}</p>
      {#if sheet.choices}
        <div class="choices" role="radiogroup" aria-label="Options">
          {#each sheet.choices as choice (choice.value)}
            <button
              type="button"
              role="radio"
              aria-checked={confirmSheet.choice === choice.value}
              onclick={() => (confirmSheet.choice = choice.value)}>{choice.label}</button
            >
          {/each}
        </div>
      {/if}
      <div class="actions">
        <button type="button" class="yes" onclick={() => confirmSheet.answer(true)}>{confirmSheet.ctaLabel}</button>
        <button type="button" class="no" onclick={() => confirmSheet.answer(false)}>Never mind</button>
      </div>
    </div>
  {/if}
</dialog>

<style>
  dialog {
    margin: auto auto 0;
    width: 100%;
    max-width: 480px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--cc-ink);
  }
  dialog::backdrop { background: rgb(43 33 26 / 0.55); }
  .panel {
    background: var(--cc-paper);
    border-radius: 26px 26px 0 0;
    padding: 14px 22px 34px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .grip {
    width: 44px;
    height: 5px;
    border-radius: 3px;
    background: var(--cc-dash);
    align-self: center;
  }
  h3 { margin: 6px 0 0; font-family: var(--cc-font-display); font-weight: 400; font-size: 24px; }
  p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--cc-notice-ink); }
  .choices { display: flex; flex-direction: column; gap: 8px; }
  .choices button {
    min-height: 50px;
    padding: 0 16px;
    border: 2px solid var(--cc-field);
    border-radius: 14px;
    background: var(--cc-field-bg);
    color: var(--cc-ink);
    font: inherit;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
  }
  .choices button[aria-checked='true'] {
    border-color: var(--cc-ink);
    background: var(--cc-ink);
    color: var(--cc-paper);
    font-weight: 600;
  }
  .actions { display: flex; flex-direction: column; gap: 10px; padding-top: 6px; }
  .actions button { font: inherit; border-radius: var(--cc-radius-pill); cursor: pointer; }
  .yes { min-height: 54px; border: 0; background: var(--cc-adobe); color: var(--cc-paper); font-size: 17px; font-weight: 600; }
  .no { min-height: 50px; border: 1.5px solid var(--cc-field); background: transparent; color: var(--cc-ink); font-size: 16px; }
</style>
