/** One short message at a time, shown at the top of the screen. */
class Toast {
  message = $state('');
  #timer: ReturnType<typeof setTimeout> | undefined;

  show(message: string, ms = 2600) {
    clearTimeout(this.#timer);
    this.message = message;
    this.#timer = setTimeout(() => (this.message = ''), ms);
  }
}

// Only ever changed from browser event handlers, so sharing it is safe under SSR.
export const toast = new Toast();
