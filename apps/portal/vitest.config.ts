import { defineConfig } from 'vitest/config';

// Unit tests cover pure modules, so they run without the SvelteKit plugin.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
});
