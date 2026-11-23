# Cactus Cove

Websites for the Cactus Cove rental:

| Site | Path | What it is |
| --- | --- | --- |
| `cactuscove.casa` | `apps/landing` | Public landing page (Astro, static) |
| `stay.cactuscove.casa` | `apps/portal` | Guest portal: sign-in and house controls (SvelteKit, Node) |
| `stay.cactuscove.casa/guide` | `apps/guide` | House guide (Starlight, served by the portal behind sign-in) |

Shared colors, fonts and the logo live in `packages/theme`.
All home data and controls go through Home Assistant; the browser never talks to HA directly.

## Layout

```
apps/        landing, portal, guide
packages/    shared theme
docker/      Dockerfiles and nginx config
homeassistant/  HA package (scripts, helpers, automations) the portal relies on
scripts/     helper scripts (npm.sh runs npm inside Docker)
```

## Development

The host only needs Docker. `scripts/npm.sh` runs npm in a `node:24-alpine` container:

```sh
scripts/npm.sh install
PORT=4321 scripts/npm.sh run dev -w apps/landing
```
