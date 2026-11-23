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

## Running with Docker

```sh
cp .env.example .env   # then fill it in (see comments in the file)
```

**Locally, without NGINX Proxy Manager** (set `HA_MOCK=true` in `.env` to use a fake Home Assistant):

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
# landing → http://localhost:8080   portal → http://localhost:3000
```

**On the server:**

```sh
docker compose up -d --build
```

The containers publish no ports. They join NPM's Docker network (`PROXY_NETWORK`, default `npm_default`; check yours with `docker network ls`). Add two proxy hosts in NPM:

| Domain | Forward to | Options |
| --- | --- | --- |
| `cactuscove.casa` | `http://cactus-cove-landing:80` | SSL, Force SSL |
| `stay.cactuscove.casa` | `http://cactus-cove-portal:3000` | SSL, Force SSL, **Websockets support** (for live updates) |

Home Assistant runs with `network_mode: host`, so the portal reaches it at `http://host.docker.internal:8123`. If that is refused, check that a host firewall (ufw) allows traffic from Docker bridge networks to port 8123.

## Development

The host only needs Docker. `scripts/npm.sh` runs npm in a `node:24-alpine` container:

```sh
scripts/npm.sh install
PORT=4321 scripts/npm.sh run dev -w apps/landing
```
