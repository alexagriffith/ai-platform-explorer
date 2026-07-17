#!/usr/bin/env python3
"""gate.py — the sprint's quiet deterministic gate for the AI Platform Explorer.

ONE command:  python3 scripts/gate.py

Runs five sections in order:
  (a) npm run check            — eslint + vitest + vite build
  (b) npm run validate:links   — every pinned source link renders
  (c) leak scan                — customer names, the banned product acronym, secrets
  (d) design-law static scan   — banned class patterns vs migrated ledger + ratchet
                                 (scripts/style-ledger.json; see docs/DESIGN-LAW.md)
  (e) style checks (Playwright)— the anti-box law, cell geometry, radii, no h-scroll,
                                 draft-banner visible in both themes (scripts/style-audit.mjs)
                                 for every tab listed in the migrated ledger

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

import json
import os
import re
import subprocess
import sys
import time
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER_PATH = os.path.join(REPO, "scripts", "style-ledger.json")


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


# ── (d) design-law static scan (docs/DESIGN-LAW.md) ───────────────────────────
# Variant-prefix-aware hue classes: matches dark:/hover:/group-hover:/dark:hover: etc.
# before text|bg|border|from|via|to|ring + banned hue + shade digit.
DESIGN_BANNED = [
    ("bg-gradient-", re.compile(r"bg-gradient-")),
    ("banned-hue", re.compile(
        r"(?:(?:[\w-]+:)*)?(?:text|bg|border|from|via|to|ring)"
        r"-(?:purple|pink|indigo|violet|fuchsia)-\d"
    )),
    # Blue/brown-tinted "gray" families banned at ALL shades (50–950) in migrated files.
    # Neutral surfaces must come from tokens, not Tailwind's chromatic-gray scales.
    ("blue-tinted-neutral (slate/zinc/stone)", re.compile(
        r"(?:[\w-]*:)*(?:bg|from|via|to|border|text|ring)-(?:slate|zinc|stone)-\d{2,3}"
    )),
    # Raw gray surface classes banned in migrated files — use token bg-page/bg-surface/bg-tint.
    ("gray-surface (use tokens)", re.compile(
        r"(?:[\w-]*:)*(?:bg|from|via|to)-gray-\d{2,3}"
    )),
    ("legacy-surface (bg-white + dark:bg-gray-800)", re.compile(
        r"bg-white\b.*\bdark:bg-gray-800\b|\bdark:bg-gray-800\b.*\bbg-white\b"
    )),
    ("decorative-shadow", re.compile(r"shadow-(?:sm|md|lg|xl|2xl)\b")),
    # Inline gradient in a JSX style prop (CSS gradient function inside style={{ … }})
    ("inline-gradient (style prop)", re.compile(
        r"style=\{\{[^}]*(?:linear|radial)-gradient\("
    )),
    # Inline literal hex color in a JSX style prop — matches style={{ … #rrggbb … }}
    # Data-driven color variables (layer.color) do NOT contain the literal '#' token.
    ("inline-hex-color (style prop)", re.compile(
        r"style=\{\{[^}]*#[0-9a-fA-F]{3,8}"
    )),
    # Inline rgb()/rgba()/hsl() in a JSX style prop
    ("inline-rgb-color (style prop)", re.compile(
        r"style=\{\{[^}]*(?:rgba?|hsla?)\s*\("
    )),
]


def _load_ledger():
    try:
        with open(LEDGER_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError) as exc:
        fail("design-law static scan (ledger)", "cannot read scripts/style-ledger.json: %s" % exc)


def _scan_src_files():
    """Walk src/** for text extensions (same TEXT_EXT as the leak scan)."""
    files = []
    root = os.path.join(REPO, "src")
    for dp, _, fns in os.walk(root):
        for fn in fns:
            if os.path.splitext(fn)[1].lower() in TEXT_EXT:
                files.append(os.path.join(dp, fn))
    return files


def section_design_static():
    ledger = _load_ledger()
    migrated = set(ledger.get("migrated") or [])
    max_legacy = ledger.get("legacyViolatingFilesMax")
    if not isinstance(max_legacy, int):
        fail("design-law static scan (ledger)",
             "legacyViolatingFilesMax must be an integer in scripts/style-ledger.json")

    migrated_hits = []
    legacy_violators = set()

    for path in _scan_src_files():
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        file_has_hit = False
        for i, line in enumerate(lines, 1):
            for label, rx in DESIGN_BANNED:
                m = rx.search(line)
                if not m:
                    continue
                file_has_hit = True
                if rel in migrated:
                    migrated_hits.append("%s:%d %s: %s" % (rel, i, label, m.group(0)))
        if file_has_hit and rel not in migrated:
            legacy_violators.add(rel)

    if migrated_hits:
        fail("design-law static scan (migrated file regression)", "\n".join(migrated_hits))

    if len(legacy_violators) > max_legacy:
        newly = sorted(legacy_violators)
        fail(
            "design-law static scan (legacy ratchet exceeded)",
            "legacy violating files: %d (max %d)\n%s"
            % (len(legacy_violators), max_legacy, "\n".join(newly)),
        )


# ── (e) style checks (Playwright against a preview server) ───────────────────
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
    section_design_static()
    section_style()
    sys.stdout.write("PASS")



if __name__ == "__main__":
    main()
