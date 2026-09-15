#!/usr/bin/env bash
# Dev server with live reload.
#
#   - watches the sources, rebuilds through scripts/build.sh on every change
#   - serves _site/ with browser-sync, which reloads the browser when the
#     rebuilt files change
#
# Usage: bash scripts/dev.sh      ->  http://localhost:4000
set -uo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-4000}"
export npm_config_cache="$PWD/.tmp-npm-cache"
STAMP=".dev-stamp"
touch "$STAMP"

echo "dev: initial build..."
bash scripts/build.sh

# source watcher -> rebuild (only paths that affect the built site)
(
    WATCH="_config.yml _posts _layouts _includes _data index.html feed.xml assets"
    while true; do
        CHANGED=$(find $WATCH -newer "$STAMP" -type f -print 2>/dev/null | head -5)
        if [ -n "$CHANGED" ]; then
            touch "$STAMP"
            echo "dev: change detected ->"
            echo "$CHANGED" | sed 's/^/  /'
            # a changed post also refreshes its share card (skips fresh ones)
            if echo "$CHANGED" | grep -q '^_posts/'; then
                node tools/gen-og.mjs 2>/dev/null || echo "dev: card generation skipped (no Chromium)"
            fi
            bash scripts/build.sh
        fi
        sleep 1
    done
) &
WATCHER=$!
trap 'kill "$WATCHER" 2>/dev/null' EXIT

echo "dev: serving http://localhost:$PORT (live reload)"
PORT="$PORT" npx --yes browser-sync start --config bs-config.js
