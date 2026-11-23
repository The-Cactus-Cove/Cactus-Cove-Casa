#!/usr/bin/env sh
# Run npm/npx inside the Node image so the host needs only Docker.
# Usage: scripts/npm.sh install
#        scripts/npm.sh run build -w apps/landing
#        scripts/npm.sh npx <tool> ...
#        PORT=4321 scripts/npm.sh run dev -w apps/landing
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORTS=""
[ -n "${PORT:-}" ] && PORTS="-p ${PORT}:${PORT}"
TTY=""
[ -t 0 ] && TTY="-it"
CMD="$1"; shift
case "$CMD" in
  npx) BIN=npx ;;
  *) BIN=npm; set -- "$CMD" "$@" ;;
esac
exec docker run --rm $TTY $PORTS -u "$(id -u):$(id -g)" \
  -e HOME=/tmp -e npm_config_update_notifier=false -e ASTRO_TELEMETRY_DISABLED=1 \
  -v "$ROOT":/repo -w /repo node:24-alpine "$BIN" "$@"
