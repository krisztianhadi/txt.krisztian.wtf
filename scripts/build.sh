#!/usr/bin/env bash
# Build the site exactly like CI does (github-pages gem in the
# jekyll-build-pages container) and copy the result into _site/.
#
# The sandbox does not allow bind mounts into containers, so the sources are
# copied in and the output copied back out.
#
# Usage: bash scripts/build.sh
set -uo pipefail
cd "$(dirname "$0")/.."

IMAGE="ghcr.io/actions/jekyll-build-pages:v1.0.13"
# unique per run: the dev watcher may build concurrently, and a shared name
# makes docker fail with "container is marked for removal and cannot be started"
NAME="txt-jekyll-build-$$"
export DOCKER_CONFIG="$PWD/.tmp-docker"
mkdir -p "$DOCKER_CONFIG" _site
trap 'docker rm -f "$NAME" >/dev/null 2>&1' EXIT

# jekyll-github-metadata runs UNAUTHENTICATED here on purpose: nothing in this
# site reads site.github.*, so a stored PAT only adds an expiry date to local
# builds (2026-10-08: an expired fine-grained PAT failed the whole build with
# "The GitHub API credentials you provided aren't valid"). Export
# JEKYLL_GITHUB_TOKEN yourself when a build genuinely needs the API.
TOKEN_ENV=""
if [ -n "${JEKYLL_GITHUB_TOKEN:-}" ]; then
    TOKEN_ENV="JEKYLL_GITHUB_TOKEN='$JEKYLL_GITHUB_TOKEN'"
fi

docker create --name "$NAME" --entrypoint /bin/sh -w /workspace "$IMAGE" -c "tail -f /dev/null" >/dev/null || exit 1
docker cp . "$NAME":/workspace/ >/dev/null || exit 1
docker start "$NAME" >/dev/null || exit 1

docker exec "$NAME" sh -c "cd /workspace && \
    export JEKYLL_ENV=production JEKYLL_BUILD_REVISION=local \
        PAGES_REPO_NWO=krisztianhadi/txt.krisztian.wtf \
        $TOKEN_ENV; \
    github-pages build --source /workspace --destination /workspace/_site > /tmp/build.log 2>&1; \
    echo \$? > /tmp/build.exit; \
    grep -iE 'warning|error' /tmp/build.log | head -5 || true"
EXIT_CODE=$(docker exec "$NAME" cat /tmp/build.exit 2>/dev/null || echo 1)

if [ "$EXIT_CODE" != "0" ]; then
    echo "build: jekyll failed (exit $EXIT_CODE) - _site left untouched" >&2
    docker exec "$NAME" tail -20 /tmp/build.log >&2
    docker rm -f "$NAME" >/dev/null
    exit 1
fi

# Merge into _site (no rm) so a live browser-sync watcher keeps working
docker cp "$NAME":/workspace/_site/. _site/ >/dev/null
cp CNAME _site/CNAME
docker rm -f "$NAME" >/dev/null

# Same post-build pass CI runs
python3 scripts/external-links.py _site
echo "build: _site updated $(date +%H:%M:%S)"
