import { config } from '../config.ts';
import type { HouseBackend } from './backend.ts';
import { MockHouse } from './mock.ts';

export type { HouseBackend, CommandContext } from './backend.ts';

let backend: HouseBackend | undefined;

/** The house backend for this process. */
export function house(): HouseBackend {
  if (!backend) {
    if (!config().haMock) throw new Error('Home Assistant backend not implemented yet; set HA_MOCK=true');
    backend = new MockHouse();
  }
  return backend;
}
