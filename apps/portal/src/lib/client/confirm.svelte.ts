export interface SheetChoice {
  value: string;
  label: string;
}

export interface SheetRequest {
  title: string;
  body: string;
  /** Confirm button text, or a function of the picked choice. */
  cta: string | ((choice: string) => string);
  /** Optional single-choice list shown above the buttons. */
  choices?: SheetChoice[];
  initial?: string;
}

interface Open extends SheetRequest {
  resolve: (answer: string | null) => void;
}

/** Bottom-sheet confirmation. `ask` resolves to the picked choice ("yes" without choices), or null. */
class ConfirmSheet {
  current = $state<Open | null>(null);
  choice = $state('');

  ask(request: SheetRequest): Promise<string | null> {
    this.current?.resolve(null);
    this.choice = request.initial ?? request.choices?.[0]?.value ?? 'yes';
    return new Promise((resolve) => (this.current = { ...request, resolve }));
  }

  answer(confirmed: boolean) {
    const open = this.current;
    this.current = null;
    open?.resolve(confirmed ? this.choice : null);
  }

  get ctaLabel() {
    const c = this.current?.cta;
    return typeof c === 'function' ? c(this.choice) : (c ?? '');
  }
}

export const confirmSheet = new ConfirmSheet();
