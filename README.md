# Cactus Cove

Websites for the Cactus Cove rental:

| Site | Path | What it is |
| --- | --- | --- |
| `cactuscove.casa` | `apps/landing` | Public landing page (Astro, static, served by nginx) |
| `stay.cactuscove.casa` | `apps/portal` | Guest portal: sign-in and house controls (SvelteKit, Node) |
| `stay.cactuscove.casa/guide` | `apps/guide` | House guide (Starlight, served by the portal during a stay) |

Shared colors, fonts and the logo live in `packages/theme`.
All home data and controls go through Home Assistant; the browser never talks to HA directly.

## Layout

```
apps/           landing, portal, guide
packages/       shared theme
docker/         Dockerfiles and nginx config
homeassistant/  HA package (scripts, helpers, automations) the portal relies on
scripts/        npm.sh (npm in Docker), screenshot.sh (Playwright in Docker)
```

## Deploying with Dockhand

The repo deploys as a single **Git stack** in Dockhand, which builds both images from source.

### 1. Before the first deploy

- **Networks.** The stack joins two networks that must already exist. Dockhand refuses to deploy with a `MISSING_EXTERNAL_RESOURCE` error otherwise:
  - NGINX Proxy Manager's network (default name `npm_default`)
  - Home Assistant's network, `hass`

  Check the names with `docker network ls`. If yours differ, set `PROXY_NETWORK` / `HASS_NETWORK`.
- **Home Assistant user.** In HA, create a dedicated user (e.g. "Cactus Cove portal"), sign in as it, and create a long-lived access token under *Profile → Security*. That token is `HA_TOKEN`.
- **HA address.** The portal reaches HA by container name on the `hass` network. The default is `http://homeassistant:8123`. If your HA container has another name, set `HA_URL`.

### 2. Create the stack

In Dockhand: *Stacks → Add → From Git*.

| Field | Value |
| --- | --- |
| Repository | this repo's URL |
| Branch | `main` |
| Compose file | `docker-compose.yml` |
| Context directory | `.` (the repo root; the Dockerfiles build from there) |
| Build images on deploy | **on** |

### 3. Stack variables

Add these as stack variables. Mark the 🔒 ones as **secrets**: they are stored encrypted and never written to disk. `docker-compose.yml` passes each one to the container through `environment:`, which is how Dockhand variables and secrets reach it (the stack doesn't use `env_file`). `.env.example` describes each one.

| Variable | Required | Default / example |
| --- | --- | --- |
| `SESSION_SECRET` 🔒 | yes | `openssl rand -base64 48` |
| `HA_TOKEN` 🔒 | yes | long-lived token from step 1 |
| `HA_URL` | | `http://homeassistant:8123` |
| `PORTAL_ORIGIN` | | `https://stay.cactuscove.casa` |
| `PROPERTY_TIMEZONE` | | `America/Phoenix` |
| `WIFI_SSID` | | shown to guests during their stay |
| `WIFI_PASSWORD` 🔒 | | shown to guests during their stay |
| `HOST_PHONE` | | e.g. `+15205550100` |
| `REVIEW_URL` | | link on the checked-out screen |
| `PROXY_NETWORK` | | `npm_default` |
| `HASS_NETWORK` | | `hass` |
| `HA_MOCK` | | `false` (set `true` for a demo with a fake house) |

Then deploy. Both containers should report **healthy**.

> Secrets are injected when Dockhand deploys. If you recreate the containers outside Dockhand, the secrets come through empty and the portal stops at startup with a clear error. Redeploy from Dockhand instead.

### 4. NGINX Proxy Manager

The containers publish no ports. Add two proxy hosts:

| Domain | Forward to | Options |
| --- | --- | --- |
| `cactuscove.casa` | `http://cactus-cove-landing:80` | SSL, Force SSL |
| `stay.cactuscove.casa` | `http://cactus-cove-portal:3000` | SSL, Force SSL, **Websockets support** (live updates) |

### 5. Updates

Redeploy from Dockhand after pushing, or automate it:

- **Webhook:** in the GitHub repo add a webhook to `https://<your-dockhand>/api/git/stacks/<id>/webhook`, using the secret Dockhand shows for the stack. It redeploys only when there are new commits.
- **Polling:** schedule a *Git stack sync* in Dockhand's Schedules.

## Local development

The host only needs Docker.

```sh
cp .env.example .env      # set SESSION_SECRET; HA_MOCK defaults to true in dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Landing: http://localhost:8080
- Portal: http://localhost:3000/s/demo, PIN **1234**. A demo bar switches the fake stay between before check-in, during and checkout day.

`scripts/npm.sh` runs npm in a `node:24-alpine` container:

```sh
scripts/npm.sh install
scripts/npm.sh test -w apps/portal          # unit tests
scripts/npm.sh run check -w apps/portal     # type check
PORT=4321 scripts/npm.sh run dev -w apps/landing
```

`scripts/screenshot.sh` takes Playwright screenshots in Docker: of a static build, of a running site, or a full portal walkthrough (`portal-screens.mjs`).
