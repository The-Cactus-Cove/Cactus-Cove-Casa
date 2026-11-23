#!/usr/bin/env sh
# Full-page screenshots of a built static site at desktop and phone widths,
# using Playwright in Docker. Also reports horizontal overflow.
# Usage: scripts/screenshot.sh <static-dir> <out-dir> [path]
#   scripts/screenshot.sh apps/landing/dist /tmp/shots /
set -eu
SITE="$(cd "$1" && pwd)"
OUT="$(mkdir -p "$2" && cd "$2" && pwd)"
URL_PATH="${3:-/}"
PW=1.65.1
HERE="$(cd "$(dirname "$0")" && pwd)"
exec docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -e URL_PATH="$URL_PATH" \
  -v "$SITE":/site:ro -v "$OUT":/out -v "$HERE/screenshot.mjs":/tmp/shot.mjs:ro \
  mcr.microsoft.com/playwright:v$PW-noble sh -c "
    cd /tmp && npm i -s --no-audit --no-fund playwright@$PW >/dev/null 2>&1
    (cd /site && python3 -m http.server 8000 >/dev/null 2>&1 &)
    sleep 1 && node /tmp/shot.mjs"
