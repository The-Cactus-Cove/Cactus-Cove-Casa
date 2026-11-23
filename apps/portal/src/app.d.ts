import type { Guest } from '#lib/server/guest.ts';

declare global {
  namespace App {
    interface Locals {
      /** The signed-in guest, or null. Set in hooks.server.ts. */
      guest: Guest | null;
    }
  }
}

export {};
