#!/usr/bin/env bash
# Pre-push quality gate: pushes to `main` deploy straight to the public GitHub
# Pages site, so refuse to push a state that lint or tests reject.
# Install once per clone:
#   cp scripts/pre-push.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push
#
# Local hooks only — no cloud CI (locked decision). This mirrors the lint+test
# steps in .github/workflows/deploy.yml so a red state is caught before it ships.

set -euo pipefail

echo "pre-push: running lint..."
npm run lint

echo "pre-push: running tests..."
npm test

echo "pre-push: passed."
