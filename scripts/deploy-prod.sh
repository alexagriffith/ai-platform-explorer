#!/usr/bin/env bash
#
# deploy-prod.sh — the ONE blessed way to publish this app to production.
#
# Production is ALWAYS https://rh-ai-platform-explorer.vercel.app — nowhere else.
# This script refuses to run against any other Vercel project, and it bakes the
# root base path in locally (vite.config uses a GitHub-Pages base of
# /ai-platform-explorer/, which would break every asset at the domain root), then
# deploys the prebuilt output so no remote build can override it.
#
# DO NOT run a bare `vercel --prod` — it would remote-build with the wrong base
# and/or target whatever project happens to be linked. Always use this script.
#
# One-time per clone:  vercel link --project rh-ai-platform-explorer
# Then to publish:     scripts/deploy-prod.sh
set -euo pipefail

EXPECTED_PROJECT="rh-ai-platform-explorer"
PROD_URL="https://rh-ai-platform-explorer.vercel.app"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ── Guard: refuse to deploy anywhere but the explorer project ────────────────
LINK=".vercel/project.json"
if [ ! -f "$LINK" ]; then
  echo "ABORT: no Vercel link found. Run: vercel link --project ${EXPECTED_PROJECT}" >&2
  exit 1
fi
LINKED_PROJECT="$(grep -o '"projectName":"[^"]*"' "$LINK" | cut -d'"' -f4)"
if [ "$LINKED_PROJECT" != "$EXPECTED_PROJECT" ]; then
  echo "ABORT: linked to '${LINKED_PROJECT}', not '${EXPECTED_PROJECT}'." >&2
  echo "       Run: vercel link --project ${EXPECTED_PROJECT}" >&2
  exit 1
fi

# ── Build with the ROOT base (override the GitHub-Pages base) ─────────────────
echo "Building with --base=/ ..."
npx vite build --base=/ --outDir dist

# ── Package as prebuilt static output (Build Output API) ──────────────────────
rm -rf .vercel/output
mkdir -p .vercel/output/static
cp -R dist/. .vercel/output/static/
printf '{"version":3}\n' > .vercel/output/config.json

# ── Deploy prebuilt to production ─────────────────────────────────────────────
echo "Deploying prebuilt to ${EXPECTED_PROJECT} (production)..."
vercel deploy --prebuilt --prod --yes

# ── Verify the live alias serves exactly this build ──────────────────────────
LOCAL_HASH="$(grep -o '/assets/index-[^"]*\.js' .vercel/output/static/index.html | head -1)"
LIVE_HASH="$(curl -s "${PROD_URL}/" | grep -o '/assets/index-[^"]*\.js' | head -1)"
rm -rf .vercel/output

if [ "$LOCAL_HASH" = "$LIVE_HASH" ] && [ -n "$LOCAL_HASH" ]; then
  echo "LIVE OK — ${PROD_URL} serves ${LIVE_HASH}"
else
  echo "WARNING: live hash '${LIVE_HASH}' != built '${LOCAL_HASH}' — check the deployment." >&2
  exit 1
fi
