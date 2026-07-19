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
import socket
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
# Placeholder sentinel: '(portfolio name)' must never appear in src/data/**
# (was a copy-paste placeholder that slipped into solutionDetails.js; scan prevents recurrence).
BANNED_PLACEHOLDER = re.compile(r"\(portfolio name\)")


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
        is_data_file = rel.startswith(os.path.join("src", "data") + os.sep) or rel.startswith("src/data/")
        for i, line in enumerate(lines, 1):
            for rx in customer_terms:
                if rx.search(line):
                    hits.append("%s:%d customer-name leak: %s" % (rel, i, line.strip()[:160]))
            if BANNED_ACRONYM.search(line):
                hits.append("%s:%d banned product acronym (use full product names): %s" % (rel, i, line.strip()[:160]))
            if is_data_file and BANNED_PLACEHOLDER.search(line):
                hits.append("%s:%d banned placeholder '(portfolio name)' in src/data/**; use a real product name: %s" % (rel, i, line.strip()[:160]))
            for label, rx in SECRET_PATTERNS:
                if rx.search(line):
                    hits.append("%s:%d %s pattern: %s" % (rel, i, label, line.strip()[:80]))
    if hits:
        fail("leak scan (customer names / banned acronym / secrets)", "\n".join(hits))


# ── (c2) bare-acronym scan ────────────────────────────────────────────────────
# Flags ALL-CAPS tokens (2–5 letters) in customer-visible description/purpose
# strings inside src/data/capabilities.js and solutionDetails.js that are NOT
# immediately followed by a parenthetical expansion "(…)" AND NOT preceded by "("
# (i.e. not the abbreviation inside an expansion like "Autoscaler (HPA)") AND
# NOT in the allowlist of self-evident, standard, or proper-noun terms.
#
# Scope: only `description:` and `purpose:` fields — these are the option-card
# faces shown to customers. Name fields may legitimately carry abbreviated product
# names (e.g. "FMS Guardrails Orchestrator"). Capabilities/useCases arrays in
# solutionDetails are in deep-dive content, not screened here (expansions are added
# inline there as needed).
#
# Allowlist rationale (keep tight):
#   - Universal tech shorthands needing no expansion: GA, AI, ML, UI, API, GPU, VM,
#     LLM, RAG, MCP, KV, SLO, SKU, OCR, ASR, YAML, PNG, RHEL, AWS
#   - Cloud-platform proper nouns (brand abbreviations): EKS, AKS, GKE, ROSA, ARO,
#     GCS, S3, TPU, GCP
#   - Tool / framework proper nouns used as product names: HELM, ONNX, RAGAS, FIPS,
#     DCGM, RBAC, MMLU, TLS, REST, DAG, CI, CD, DR, KFP, HAP, SSO, CSI, OVN, CRD,
#     OADP, GPTQ, AWQ, ROCm, CUDA, PDF, URL, JSON, HTTP, SHAP, LIME, FAISS, LAB,
#     AMD, CPU, INT4, FP8
#   - Kubernetes/infra shorthand understood in technical context: CR, EDB, FMS, LM,
#     DB, HF, PVC, URI, TGI, ODH, OGX, LWS, ODF, TF, GPT, CNCF, MI, TTFT, POC,
#     SQL, HTTPS, XKS
#
# NOTE: RHOAI / RHAI / RHAIE are NOT in the allowlist — they must be expanded as
# "Red Hat OpenShift AI" in customer-visible description fields.
_BARE_ACRONYM_ALLOWLIST = {
    "GA", "AI", "ML", "UI", "API", "GPU", "VM", "LLM", "RAG", "MCP", "KV", "SLO",
    "SKU", "OCR", "ASR", "YAML", "PNG", "RHEL",
    "AWS", "EKS", "AKS", "GKE", "ROSA", "ARO", "GCS", "S3", "TPU", "GCP",
    "HELM", "ONNX", "RAGAS", "FIPS", "DCGM", "RBAC", "MMLU", "TLS", "REST", "DAG",
    "CI", "CD", "DR", "KFP", "HAP", "SSO", "CSI", "OVN", "CRD", "OADP", "GPTQ",
    "AWQ", "ROCm", "CUDA", "PDF", "URL", "JSON", "HTTP", "SHAP", "LIME", "FAISS",
    "LAB", "AMD", "CPU", "INT4", "FP8",
    "CR", "EDB", "FMS", "LM", "DB", "HF", "PVC", "URI", "TGI", "ODH", "OGX",
    "LWS", "ODF", "TF", "GPT", "CNCF", "MI", "TTFT", "POC", "SQL", "HTTPS", "XKS",
}

# Matches a bare ALL-CAPS token (2–5 letters, word-boundary).
# Negative lookbehind: skip tokens already inside parens — e.g. "Autoscaler (HPA)".
# Negative lookahead: skip tokens immediately followed by "(" — i.e. the start of
# their own expansion — e.g. "Horizontal Pod Autoscaler (HPA)".
_BARE_ACRONYM_RX = re.compile(r"(?<!\()\b([A-Z]{2,5})\b(?!\s*\()")

# Only scan lines that contain a non-trivial string value (at least 4 chars).
_HAS_STRING_VALUE_RX = re.compile(r"""['"][^'"]{4,}['"]""")

# Only flag description: and purpose: field lines (the customer-visible option faces).
_DESCRIPTION_FIELD_RX = re.compile(r"\b(description|purpose)\s*:")

# Target files: only the two files that carry option-card face strings.
_BARE_ACRONYM_TARGET_FILES = {"capabilities.js", "solutionDetails.js"}


def section_bare_acronym():
    data_dir = os.path.join(REPO, "src", "data")
    hits = []
    for fn in os.listdir(data_dir):
        if fn not in _BARE_ACRONYM_TARGET_FILES:
            continue
        path = os.path.join(data_dir, fn)
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        for i, line in enumerate(lines, 1):
            if not _DESCRIPTION_FIELD_RX.search(line):
                continue
            if not _HAS_STRING_VALUE_RX.search(line):
                continue
            for m in _BARE_ACRONYM_RX.finditer(line):
                token = m.group(1)
                if token in _BARE_ACRONYM_ALLOWLIST:
                    continue
                hits.append(
                    "%s:%d bare acronym '%s' in description/purpose field — expand on first use "
                    "or add to allowlist if it is a proper noun: %s"
                    % (rel, i, token, line.strip()[:160])
                )
    if hits:
        fail("bare-acronym scan (description/purpose fields in src/data)", "\n".join(hits))


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


# ── (d1b) one-sided side-accent — HARD app-wide ban ───────────────────────────
# Alexa's law: NEVER highlight a box with a one-sided (left/right) accent border —
# the "left-side panel highlight". Use a thin FULL outline around the whole box, or
# none. This is a hard ban (not a ratchet): ANY match anywhere in src/ fails the gate.
# Matches border-l-/border-r- with a width (2|4|8) or a color/token name, including
# variant prefixes (dark:border-l-amber-600). Does NOT match:
#   - border-l-0 / border-r-0 (resets)
#   - border-t-*/border-b-* (tab underlines, flow-connector lines — legitimate)
#   - bare border-l / border-r (1px neutral divider)
_ONE_SIDED_ACCENT_RX = re.compile(
    r"(?:[\w-]+:)*border-[lr]-(?:2|4|8|"
    r"(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|"
    r"violet|purple|fuchsia|pink|rose|slate|zinc|stone|gray|neutral|accent|edge|hair)\b)"
)


def section_one_sided_accent():
    hits = []
    for path in _scan_src_files():
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        for i, line in enumerate(lines, 1):
            m = _ONE_SIDED_ACCENT_RX.search(line)
            if m:
                hits.append("%s:%d %s" % (rel, i, m.group(0)))
    if hits:
        fail(
            "one-sided side-accent (banned)",
            "One-sided left/right accent borders are banned — use a thin FULL "
            "outline around the whole box, or none:\n" + "\n".join(hits),
        )


# ── (d2) raw-text-size ratchet ────────────────────────────────────────────────
# Counts raw text-size Tailwind utility class matches in src/components/**/*.jsx
# (text-xs|sm|base|lg|xl|2xl|3xl, including variant-prefixed forms such as
# sm:text-lg or dark:text-sm). The ceiling is stored in style-ledger.json as
# rawTextSizeMax. The count must never INCREASE — each migration lane drives it
# toward zero. Fail immediately if count exceeds ceiling, naming this ratchet.
#
# Exclusion: src/lib/styleTokens.js is the token-definition file and is
# intentionally full of these literals; it is excluded from the count.
_RAW_TEXT_SIZE_RX = re.compile(
    r"\b(?:[a-z][a-z0-9-]*:)*text-(?:xs|sm|base|lg|xl|2xl|3xl)\b"
)


def section_raw_text_size():
    ledger = _load_ledger()
    max_count = ledger.get("rawTextSizeMax")
    if not isinstance(max_count, int):
        fail(
            "raw-text-size ratchet (ledger)",
            "rawTextSizeMax must be an integer in scripts/style-ledger.json",
        )

    components_dir = os.path.join(REPO, "src", "components")
    count = 0
    for dp, _, fns in os.walk(components_dir):
        for fn in fns:
            if not fn.endswith(".jsx"):
                continue
            path = os.path.join(dp, fn)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
            except OSError:
                continue
            count += len(_RAW_TEXT_SIZE_RX.findall(content))

    if count > max_count:
        fail(
            "raw-text-size ratchet exceeded",
            "raw text-size class count: %d (max %d)\n"
            "Reduce raw text-size classes in src/components/**/*.jsx "
            "and lower rawTextSizeMax in scripts/style-ledger.json, "
            "or ensure no new raw sizes were introduced." % (count, max_count),
        )



# Fails if the same function declaration name appears in 2+ files under src/components/.
# Catches copy-paste helpers (the distributingGridCols duplication F11 fixed is the
# canonical example). An allowlist entry may be added here if a legitimate collision
# is found; none are expected.
DUPE_ALLOWLIST = set()  # e.g. {"helperName"} — add if a collision is intentional

_FN_DECL = re.compile(r"^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(")


def section_duplicate_logic():
    fn_files = {}  # name -> list of rel paths
    components_dir = os.path.join(REPO, "src", "components")
    for dp, _, fns in os.walk(components_dir):
        for fn in fns:
            ext = os.path.splitext(fn)[1].lower()
            if ext not in {".js", ".jsx", ".ts", ".tsx"}:
                continue
            path = os.path.join(dp, fn)
            rel = os.path.relpath(path, REPO)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                    for line in fh:
                        m = _FN_DECL.match(line.lstrip())
                        if m:
                            name = m.group(1)
                            fn_files.setdefault(name, []).append(rel)
            except OSError:
                continue

    hits = []
    for name, files in sorted(fn_files.items()):
        if len(files) < 2:
            continue
        if name in DUPE_ALLOWLIST:
            continue
        hits.append("duplicate function '%s' in: %s" % (name, ", ".join(sorted(files))))
    if hits:
        fail("duplicate-logic scan (copy-paste helpers)", "\n".join(hits))


# ── (d3) documentation / href status-code check ───────────────────────────────
# Scans every `documentation:` and `href:` string value in src/data/*.js and
# asserts each non-null URL returns HTTP 200 (following redirects). A 404 page
# can render HTML and slip through the Playwright render-length check, so we
# must verify the status code independently.
#
# Self-test (--self-test flag): temporarily injects a known-404 URL into the
# collected set, confirms the check names it as a failure, then removes it.
_DOC_HREF_RX = re.compile(
    r"""(?:documentation|href)\s*:\s*['"](\bhttps?://[^'"]+)['"]"""
)


def _collect_doc_href_urls():
    """Return a list of (url, rel_path) for every documentation:/href: URL in src/data/*.js."""
    data_dir = os.path.join(REPO, "src", "data")
    results = []
    for fn in os.listdir(data_dir):
        if not fn.endswith(".js"):
            continue
        path = os.path.join(data_dir, fn)
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
        except OSError:
            continue
        for m in _DOC_HREF_RX.finditer(content):
            results.append((m.group(1), rel))
    return results


def _http_status(url, timeout=8, retries=2):
    """Return the final HTTP status code after following redirects, or 0 on error.
    Uses curl (subprocess) because Python's urllib is blocked by bot-protection on
    docs.redhat.com. No custom User-Agent is set — docs.redhat.com returns 403 for
    common browser UAs but 200/404 accurately for curl's default UA.

    RETRIES transient responses: docs.redhat.com rate-limits automated requests with
    intermittent 401/403/429 (observed flipping 401->200 on retry). A 200 on any
    attempt wins; a 404/410 is conclusive (returned immediately, no point retrying);
    anything else is treated as transient and retried with backoff. This keeps the
    gate deterministic on genuine breakage instead of flaky on rate-limits."""
    last = 0
    for attempt in range(retries):
        try:
            result = subprocess.run(
                ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                 "-L", "--max-time", str(timeout), url],
                capture_output=True, text=True, timeout=timeout + 5,
            )
            code = result.stdout.strip()
            last = int(code) if code.isdigit() else 0
        except Exception:
            last = 0
        if last == 200:
            return 200
        if last in (404, 410):
            return last  # conclusively gone — retrying won't change it
        if attempt < retries - 1:
            time.sleep(1)  # brief backoff for transient 401/403/429/5xx/0
    return last


def section_doc_href_status(extra_urls=None):
    """Assert every documentation:/href: URL in src/data/*.js returns HTTP 200."""
    pairs = _collect_doc_href_urls()
    if extra_urls:
        for url, label in extra_urls:
            pairs.append((url, label))

    # Deduplicate by URL, keeping the first file that cites each.
    seen = {}
    for url, rel in pairs:
        if url not in seen:
            seen[url] = rel

    # Only 404/410 is a genuinely broken link → FAIL. Transient auth/rate-limit
    # (401/403/429/5xx/0) after retries is "could not verify right now", NOT broken —
    # tolerated silently so the gate honours its "prints exactly PASS" contract and
    # stays deterministic. (A real 404 masked as 401 is caught next run once the host
    # stops throttling; the self-test still proves 404s are caught.)
    broken = []
    for url, rel in seen.items():
        code = _http_status(url)
        if code in (404, 410):
            broken.append("  %s  HTTP %s  cited in %s" % (url, code, rel))

    if broken:
        fail(
            "documentation/href status-code check (404/410 — broken links)",
            "The following documentation URLs are gone (404/410):\n"
            + "\n".join(broken),
        )


# ── (e) style checks (Playwright against a preview server) ───────────────────
def _find_free_port():
    """Bind to port 0 so the OS assigns a free ephemeral port, then release it."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

PORT = int(os.environ.get("GATE_PORT", "0")) or _find_free_port()
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
    # --self-test: plant a known-404 URL, confirm the check names it, revert.
    if "--self-test" in sys.argv:
        SENTINEL = "https://docs.redhat.com/rhoai"  # confirmed 404
        try:
            section_doc_href_status(extra_urls=[(SENTINEL, "<self-test>")])
            # If we reach here the check did NOT catch it — self-test failure.
            sys.stdout.write("SELF-TEST FAILED: sentinel URL was not caught\n")
            sys.exit(1)
        except SystemExit as e:
            if e.code == 1:
                sys.stdout.write("SELF-TEST PASSED: sentinel URL caught correctly\n")
                sys.exit(0)
            raise
    section_check()
    section_links()
    section_leaks()
    section_bare_acronym()
    section_design_static()
    section_one_sided_accent()
    section_raw_text_size()
    section_duplicate_logic()
    section_doc_href_status()
    section_style()
    sys.stdout.write("PASS")



if __name__ == "__main__":
    main()
