#!/usr/bin/env bash
# Pre-commit leak check: blocks commits that would publish internal names or channels.
# Install once per clone:
#   cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
#
# Two layers:
#  1. Generic patterns (below): internal Slack channels and SME credit lines.
#  2. Optional local denylist: a gitignored file `.leak-denylist` at the repo root,
#     one case-insensitive term per line (e.g. colleague or customer names).
#     It is never committed, so the names themselves stay off GitHub.

set -euo pipefail

fail=0

# Staged file list (added/copied/modified), excluding this script itself.
staged=$(git diff --cached --name-only --diff-filter=ACM | grep -v '^scripts/pre-commit.sh$' || true)
[ -z "$staged" ] && exit 0

# Layer 1: generic internal-leak signatures.
generic='#forum-|#team-|#wg-|\(SME\)|[A-Za-z]+ \(SME|SME\)'
for f in $staged; do
  if git show ":$f" | grep -nE "$generic" > /dev/null 2>&1; then
    echo "BLOCKED: $f contains an internal Slack channel or SME credit:"
    git show ":$f" | grep -nE "$generic" | head -5
    fail=1
  fi
done

# Layer 2: local denylist (names). Skipped silently if the file doesn't exist.
if [ -f .leak-denylist ]; then
  while IFS= read -r term; do
    [ -z "$term" ] && continue
    case "$term" in \#*) continue;; esac  # allow comments in the denylist
    for f in $staged; do
      if git show ":$f" | grep -in --fixed-strings "$term" > /dev/null 2>&1; then
        echo "BLOCKED: $f contains a denylisted term (see .leak-denylist)"
        fail=1
      fi
    done
  done < .leak-denylist
fi

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "Commit blocked: remove the flagged content (this repo is public)."
  echo "If a hit is a false positive, adjust scripts/pre-commit.sh or .leak-denylist."
  exit 1
fi
exit 0
