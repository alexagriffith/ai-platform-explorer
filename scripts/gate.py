#!/usr/bin/env python3
"""gate.py — the sprint's quiet deterministic gate for the AI Platform Explorer.

ONE command:  python3 scripts/gate.py

Runs four sections in order:
  (a) npm run check            — eslint + vitest + vite build
  (b) npm run validate:links   — every pinned source link renders
  (c) leak scan                — customer names, the banned product acronym, secrets
  (d) style checks (Playwright)— the anti-box law, cell geometry, radii, no h-scroll,
                                 draft-banner visible in both themes (scripts/style-audit.mjs)

OUTPUT CONTRACT (strict):
  * On success prints exactly `PASS` and nothing else, exit 0.
  * On the first failing section prints ONLY that section's logs, exit 1.

Notes on the leak scan (see inline comments):
  * The scan targets the SHIPPED / source surface (src, public, docs, index.html,
    README, root config) — not internal `planning/` notes or this gate's own files.
  * The banned product acronym is matched case-SENSITIVELY as a whole-word token, so a
    legitimate lowercase registry namespace inside a data source label is not a hit.
    (The banned literal is assembled from fragments below so this scanner does not
    itself contain the string it forbids — matching the repo's denylist convention.)
  * The customer denylist is read at RUNTIME from the work-log customers directory
    (no customer names are hard-coded in this repo).
"""

import os
import re
import subprocess
import sys
import time
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _run(cmd, cwd=REPO, env=None):
    """Run a command, capturing combined output. Returns (ok, output)."""
    p = subprocess.run(
        cmd, cwd=cwd, env=env,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
    )
    return p.returncode == 0, p.stdout


def fail(section, logs):
    """Print only the failing section's logs and exit non-zero."""
    sys.stdout.write("=== gate failed: %s ===\n" % section)
    sys.stdout.write(logs if logs.endswith("\n") else logs + "\n")
    sys.exit(1)


# ── (a) npm run check ────────────────────────────────────────────────────────
def section_check():
    ok, out = _run(["npm", "run", "check"])
    if not ok:
        fail("npm run check (lint + tests + build)", out)


# ── (b) npm run validate:links ───────────────────────────────────────────────
def section_links():
    ok, out = _run(["npm", "run", "validate:links"])
    if not ok:
        fail("npm run validate:links (source links render)", out)


# ── (c) leak scan ────────────────────────────────────────────────────────────
TEXT_EXT = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".css", ".html",
            ".md", ".json", ".svg", ".txt", ".yml", ".yaml"}
SCAN_DIRS = ["src", "public", "docs"]
SCAN_FILES = ["index.html", "README.md", "tailwind.config.js", "vite.config.js",
              "postcss.config.js", "eslint.config.js", "package.json"]
# Excluded from leak scanning: dependency/build output, internal planning notes,
# and this gate's own files (which necessarily contain the patterns below).
SELF_FILES = {os.path.join("scripts", "gate.py"), os.path.join("scripts", "style-audit.mjs")}

# Generic customer-dir names that are NOT company names (would false-positive).
CUSTOMER_SKIP = {"insights"}

SECRET_PATTERNS = [
    ("Slack token", re.compile(r"xox[abprs]-")),
    ("GitHub token", re.compile(r"ghp_[A-Za-z0-9]{10,}")),
    ("AWS access key", re.compile(r"AKIA[0-9A-Z]{12,}")),
    ("private key", re.compile(r"BEGIN [A-Z ]*PRIVATE KEY")),
]
# Banned product-acronym, assembled from fragments so this tracked file does not itself contain
# the forbidden literal. Case-sensitive whole-word match — a lowercase registry namespace is NOT a hit.
BANNED_ACRONYM = re.compile(r"\b" + "RHA" + "II" + r"\b")


def _customer_terms():
    """Whole-word regexes for customer names, derived at runtime from the work-log
    customers directory. Never hard-codes names in this repo. Returns [] if the
    directory is unavailable (soft-skip)."""
    base = os.environ.get("WORKLOG_CUSTOMERS_DIR",
                          os.path.expanduser("~/work-log/external/customers"))
    if not os.path.isdir(base):
        return []
    terms = set()
    for name in os.listdir(base):
        if not os.path.isdir(os.path.join(base, name)):
            continue
        slug = name.lower()
        if slug in CUSTOMER_SKIP:
            continue
        # slug + hyphen->space + hyphen-removed variants
        for v in {slug, slug.replace("-", " "), slug.replace("-", "")}:
            v = v.strip()
            if len(v) >= 3:
                terms.add(v)
    return [re.compile(r"\b" + re.escape(t) + r"\b", re.IGNORECASE) for t in sorted(terms)]


def _scan_files():
    files = []
    for d in SCAN_DIRS:
        root = os.path.join(REPO, d)
        for dp, _, fns in os.walk(root):
            for fn in fns:
                if os.path.splitext(fn)[1].lower() in TEXT_EXT:
                    files.append(os.path.join(dp, fn))
    for f in SCAN_FILES:
        p = os.path.join(REPO, f)
        if os.path.isfile(p):
            files.append(p)
    out = []
    for p in files:
        rel = os.path.relpath(p, REPO)
        if rel in SELF_FILES:
            continue
        out.append(p)
    return out


def section_leaks():
    customer_terms = _customer_terms()
    hits = []
    for path in _scan_files():
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        for i, line in enumerate(lines, 1):
            for rx in customer_terms:
                if rx.search(line):
                    hits.append("%s:%d customer-name leak: %s" % (rel, i, line.strip()[:160]))
            if BANNED_ACRONYM.search(line):
                hits.append("%s:%d banned product acronym (use full product names): %s" % (rel, i, line.strip()[:160]))
            for label, rx in SECRET_PATTERNS:
                if rx.search(line):
                    hits.append("%s:%d %s pattern: %s" % (rel, i, label, line.strip()[:80]))
    if hits:
        fail("leak scan (customer names / banned acronym / secrets)", "\n".join(hits))


# ── (d) style checks (Playwright against a preview server) ───────────────────
PORT = int(os.environ.get("GATE_PORT", "4390"))
BASE_URL = "http://localhost:%d/ai-platform-explorer/" % PORT


def _wait_ready(url, timeout=45):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status < 500:
                    return True
        except Exception:
            time.sleep(0.4)
    return False


def section_style():
    # Serve the freshly built dist (section (a) already ran `vite build`).
    server = subprocess.Popen(
        ["npm", "run", "preview", "--", "--port", str(PORT), "--strictPort"],
        cwd=REPO, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
        start_new_session=True,
    )
    try:
        if not _wait_ready(BASE_URL):
            try:
                os.killpg(os.getpgid(server.pid), 15)
            except Exception:
                pass
            out = ""
            try:
                out = server.communicate(timeout=5)[0] or ""
            except Exception:
                pass
            fail("style checks (preview server did not start)", out or "preview server timeout")
        ok, out = _run(["node", os.path.join("scripts", "style-audit.mjs"), BASE_URL])
        if not ok:
            fail("style checks (anti-box law / geometry / themes)", out)
    finally:
        try:
            os.killpg(os.getpgid(server.pid), 15)
        except Exception:
            pass


def main():
    section_check()
    section_links()
    section_leaks()
    section_style()
    sys.stdout.write("PASS")


if __name__ == "__main__":
    main()
