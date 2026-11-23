#!/usr/bin/env sh
# Screenshots with Playwright in Docker.
#   Static build:  scripts/screenshot.sh <static-dir> <out-dir> [path]
#   Running site:  scripts/screenshot.sh <http-url> <out-dir> [script.mjs]
# The default script captures one page at desktop/tablet/phone widths and
# reports horizontal overflow; portal-screens.mjs walks the guest portal.
set -eu
PW=1.65.1
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$(mkdir -p "$2" && cd "$2" && pwd)"

case "$1" in
  http://*|https://*)
    BASE="$1"; SCRIPT="${3:-screenshot.mjs}"; URL_PATH=/
    SERVE=""; MOUNT=""; NET="--network host" ;;
  *)
    BASE="http://127.0.0.1:8000"; SCRIPT=screenshot.mjs; URL_PATH="${3:-/}"
    SERVE="(cd /site && python3 -m http.server 8000 >/dev/null 2>&1 &); sleep 1;"
    MOUNT="-v $(cd "$1" && pwd):/site:ro"; NET="" ;;
esac

exec docker run --rm $NET -u "$(id -u):$(id -g)" -e HOME=/tmp -e BASE="$BASE" -e URL_PATH="$URL_PATH" \
  $MOUNT -v "$OUT":/out -v "$HERE":/scripts:ro \
  mcr.microsoft.com/playwright:v$PW-noble sh -c "
    cd /tmp && npm i -s --no-audit --no-fund playwright@$PW >/dev/null 2>&1
    $SERVE
    cp /scripts/$SCRIPT /tmp/run.mjs && node /tmp/run.mjs"
