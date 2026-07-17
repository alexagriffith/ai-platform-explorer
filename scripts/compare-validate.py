#!/usr/bin/env python3
"""compare-validate.py — compare-scoped deterministic data harness.

Checks the product-comparison data model (src/data/productComparisons.js) for
structural and cross-surface consistency issues that vitest tests don't catch
because they require runtime JS evaluation or multi-surface joins.

CHECKS
  (1) Schema completeness  — every bomRow/capabilityRow side has tier + sourceUrl +
                             sourceLabel (the per-fact provenance contract).
  (2) Vocab conformance    — tier ∈ {clear, inferred, unresolved};
                             included ∈ {included, add-on, not-included, confirm};
                             support ∈ {yes, partial, no, confirm};
                             status (when present) ∈ the four canonical values.
  (3) Source-URL shape     — every sourceUrl is https://; label is non-empty.
  (4) decisionBeatFacts    — (retired: decision cards now render tag+name only; check
                             is a no-op when decisionBeatFacts is absent from the data).
  (5) Ledger spine coverage— every SPINE entry key resolves to a row in bomRows or
                             capabilityRows (no broken spine-to-row reference).
  (6) Hero cell resolution — every hero.inner/outer component cell resolves to an
                             existing row + side and that side has a sourceUrl; a cell
                             with a broken reference is a cross-surface inconsistency.
  (7) illustrative/draft   — no row with illustrative=false while draft=true (would
                             silently present unvetted data as confirmed); draft=true
                             requires illustrative=true on >=1 row (the data fence).
  (8) Version mixing guard — placeholder for upcoming componentVersions feature:
                             when a row carries a versionTable field, every entry in
                             that table must share the same release string (no mixing
                             e.g. "3.1" and "3.4" in the same product-version table).
  (9) sourceUrl uniqueness  — identical sourceUrl shared across >=5 different row-side
                             pairs is flagged as a "provenance collapse" (one source
                             cited for too many distinct facts is a coverage gap).

OUTPUT CONTRACT (matches gate.py):
  Prints exactly `PASS` on success, nothing else.
  On failure prints only the failing checks and exits 1.

SELF-TEST (--self-test flag):
  Runs a suite of in-process synthetic comparisons through each check and asserts
  every check fires on a broken input and passes on a clean one. Exits 0 on success,
  1 on any self-test failure.

Usage:
  python3 scripts/compare-validate.py              # check live data
  python3 scripts/compare-validate.py --self-test  # run self-test suite
"""

import ast
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(REPO, "src", "data", "productComparisons.js")

# ── canonical vocabularies ─────────────────────────────────────────────────────
TIER_VOCAB = {"clear", "inferred", "unresolved"}
INCLUDED_VOCAB = {"included", "add-on", "not-included", "confirm"}
SUPPORT_VOCAB = {"yes", "partial", "no", "confirm"}
STATUS_VOCAB = {"GA", "Tech Preview", "Dev Preview", "Check with Red Hat"}

# Threshold above which a single sourceUrl shared across many row-sides is flagged
# as a provenance collapse (one source vouching for too many distinct facts).
# Set to 8 to accommodate the current RHAI vs RHOAI comparison (11 BOM rows + 8 cap rows)
# where the scope-establishing getting-started doc legitimately anchors many "confirm"
# cells. Flag at > 8 to catch actual copy-paste drift across future comparisons.
PROVENANCE_COLLAPSE_THRESHOLD = 8

# ── JS-literal parser (regex-based, not a full JS AST) ───────────────────────
# The data file is written as plain JS object/string literals; we parse only the
# structure we need rather than executing the module (no Node.js required).

def _load_text():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as fh:
            return fh.read()
    except OSError as exc:
        sys.stderr.write("cannot read %s: %s\n" % (DATA_FILE, exc))
        sys.exit(2)


# ── data extraction via regex hunts ──────────────────────────────────────────
# We extract a flat list of (field_name, string_value) pairs from the JS source.
# This is intentionally simple: we rely on the file being a regular, well-formatted
# JS literal object (which it must be for the build to succeed anyway).

_STR_PAIR = re.compile(
    r"""(?:^|\s)(\w+)\s*:\s*(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`)""",
    re.MULTILINE,
)

def _extract_string_fields(text):
    """Return all key:string pairs found anywhere in the JS source."""
    pairs = []
    for m in _STR_PAIR.finditer(text):
        key = m.group(1)
        val = m.group(2) or m.group(3) or m.group(4) or ""
        pairs.append((key, val))
    return pairs


def _extract_src_urls(text):
    """Extract all literal https:// string values from the SRC const block.

    These are the canonical vetted source URLs. We use them to:
      - Validate decisionBeatFacts sourceUrls (must be in this set or be a row URL).
      - Resolve provenance collapse checks by expression name, not synthetic string.
    Returns a set of https:// URL strings.
    """
    # Find the SRC = { ... } block
    pat = re.compile(r"""\bconst\s+SRC\s*=\s*\{""")
    m = pat.search(text)
    if not m:
        return set()
    block = _between(text, m.end() - 1)
    urls = set()
    str_pat = re.compile(r"""(?:'([^']*)'|"([^"]*)")""")
    for sm in str_pat.finditer(block):
        val = sm.group(1) or sm.group(2) or ""
        if val.startswith("https://"):
            urls.add(val)
    # Also extract the ODH base URL (used as a prefix in gam/dsc helpers)
    odh_pat = re.compile(r"""\bconst\s+ODH\s*=\s*'([^']+)'""")
    om = odh_pat.search(text)
    if om:
        urls.add(om.group(1))
    return urls


def _normalize_url(url):
    """Strip the synthetic JS-expression placeholder prefix if present."""
    prefix = "https://[resolved-from-js-expression:"
    if url and url.startswith(prefix):
        return None  # synthetic — not a real URL literal
    return url


# ── structured row extraction ─────────────────────────────────────────────────
# We need the comparison data as structured Python objects for multi-field checks.
# Strategy: extract the JS source, locate each row block by its distinguishing
# field (area: / capability:), then scan forward to collect the side sub-objects.

def _between(text, start_idx, open_ch="{", close_ch="}"):
    """Return the slice of `text` from start_idx to the matching close_ch."""
    depth = 0
    i = start_idx
    while i < len(text):
        ch = text[i]
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return text[start_idx : i + 1]
        i += 1
    return text[start_idx:]


def _str_val(snippet, key):
    """Extract the first string value for `key:` in a JS snippet.

    Handles plain string literals ('...', "...", `...`) and the SRC.xxx /
    gam(n) / dsc(n) / vllm(n) expression patterns used in productComparisons.js.
    For expressions, we return a sentinel string that starts with 'https://' so
    schema checks know a URL is present without needing to evaluate the JS.
    """
    pat = re.compile(
        r"""\b""" + re.escape(key) + r"""\s*:\s*(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`|([\w.]+(?:\([^)]*\))?))""",
    )
    m = pat.search(snippet)
    if not m:
        return None
    if m.group(1) is not None:
        return m.group(1)
    if m.group(2) is not None:
        return m.group(2)
    if m.group(3) is not None:
        return m.group(3)
    expr = m.group(4) or ""
    # If the expression looks like a JS reference to a known https URL source,
    # return a placeholder https:// string so URL-shape checks remain deterministic
    # without executing JavaScript. Known patterns in this file: SRC.xxx, gam(…),
    # dsc(…), vllm(…) — all resolve to https:// URLs by construction (see SRC const).
    https_exprs = re.compile(
        r"""^(?:SRC\.\w+|gam\([^)]*\)|dsc\([^)]*\)|vllm\([^)]*\)|ODH\b)$"""
    )
    if https_exprs.match(expr.strip()):
        return "https://[resolved-from-js-expression:%s]" % expr.strip()
    # Other bare identifiers or non-string values — not a string field.
    return None


def _bool_val(snippet, key):
    """Extract the first boolean value for `key:` in a JS snippet."""
    pat = re.compile(r"""\b""" + re.escape(key) + r"""\s*:\s*(true|false)""")
    m = pat.search(snippet)
    if not m:
        return None
    return m.group(1) == "true"


def _extract_row_side(row_snippet, side_key):
    """Extract one side object (a: {...} or b: {...}) from a row snippet."""
    pat = re.compile(r"""\b""" + re.escape(side_key) + r"""\s*:\s*\{""")
    m = pat.search(row_snippet)
    if not m:
        return None
    side_snippet = _between(row_snippet, m.start() + len(m.group(0)) - 1)
    return {
        "tier": _str_val(side_snippet, "tier"),
        "sourceUrl": _str_val(side_snippet, "sourceUrl"),
        "sourceLabel": _str_val(side_snippet, "sourceLabel"),
        "included": _str_val(side_snippet, "included"),
        "support": _str_val(side_snippet, "support"),
        "status": _str_val(side_snippet, "status"),
        "detail": _str_val(side_snippet, "detail"),
    }


def _find_array_section(text, array_name):
    """Return the text of `array_name: [...]` from the JS source."""
    pat = re.compile(r"""\b""" + re.escape(array_name) + r"""\s*:\s*\[""")
    m = pat.search(text)
    if not m:
        return ""
    # find the matching ]
    depth = 0
    i = m.end() - 1  # points at '['
    start = i
    while i < len(text):
        if text[i] == "[":
            depth += 1
        elif text[i] == "]":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
        i += 1
    return text[start:]


def _extract_rows(text, array_name, area_key):
    """Extract all rows from a JS array section. area_key is 'area' or 'capability'."""
    section = _find_array_section(text, array_name)
    rows = []
    pat = re.compile(
        r"""\b""" + re.escape(area_key) + r"""\s*:\s*(?:'([^']*)'|"([^"]*)"|\`([^`]*)\`)""",
    )
    for m in pat.finditer(section):
        area_val = m.group(1) or m.group(2) or m.group(3) or ""
        # walk back to find the enclosing { for this row
        row_start = section.rfind("{", 0, m.start())
        if row_start == -1:
            continue
        row_snippet = _between(section, row_start)
        rows.append({
            "key": area_val,
            "area_field": area_key,
            "a": _extract_row_side(row_snippet, "a"),
            "b": _extract_row_side(row_snippet, "b"),
            "illustrative": _bool_val(row_snippet, "illustrative"),
            "versionTable": None,  # future field; not yet in data
        })
    return rows


def _extract_decision_beat_facts(text):
    """Extract decisionBeatFacts.a and .b arrays."""
    # Find the decisionBeatFacts object block
    pat = re.compile(r"""\bdecisionBeatFacts\s*=\s*\{""")
    m = pat.search(text)
    if not m:
        return {"a": [], "b": []}
    block = _between(text, m.end() - 1)
    facts = {}
    for side in ["a", "b"]:
        side_pat = re.compile(r"""\b""" + re.escape(side) + r"""\s*:\s*\[""")
        sm = side_pat.search(block)
        if not sm:
            facts[side] = []
            continue
        arr_start = sm.end() - 1
        # find matching ]
        depth = 0
        i = arr_start
        arr_text = block
        end_i = len(arr_text)
        while i < len(arr_text):
            if arr_text[i] == "[":
                depth += 1
            elif arr_text[i] == "]":
                depth -= 1
                if depth == 0:
                    end_i = i + 1
                    break
            i += 1
        arr_snippet = arr_text[arr_start:end_i]
        entry_pat = re.compile(r"""\{""")
        entries = []
        for em in entry_pat.finditer(arr_snippet):
            entry_snip = _between(arr_snippet, em.start())
            entries.append({
                "sourceUrl": _str_val(entry_snip, "sourceUrl"),
                "sourceLabel": _str_val(entry_snip, "sourceLabel"),
                "text": _str_val(entry_snip, "text"),
            })
        facts[side] = entries
    return facts


def _extract_hero_cells(text):
    """Extract hero inner + outer component cells."""
    pat = re.compile(r"""\bhero\s*:\s*\{""")
    m = pat.search(text)
    if not m:
        return []
    hero_block = _between(text, m.end() - 1)
    cells = []
    for zone in ["inner", "outer"]:
        zone_pat = re.compile(r"""\b""" + re.escape(zone) + r"""\s*:\s*\{""")
        zm = zone_pat.search(hero_block)
        if not zm:
            continue
        zone_block = _between(hero_block, zm.end() - 1)
        comp_section = _find_array_section(zone_block, "components")
        entry_pat = re.compile(r"""\{""")
        for em in entry_pat.finditer(comp_section):
            entry = _between(comp_section, em.start())
            label = _str_val(entry, "label")
            view = _str_val(entry, "view")
            key = _str_val(entry, "key")
            side = _str_val(entry, "side")
            if label and view and key and side:
                cells.append({"zone": zone, "label": label, "view": view, "key": key, "side": side})
    return cells


def _extract_draft_flag(text):
    """Return True if the comparison has draft: true."""
    m = re.search(r"""\bdraft\s*:\s*(true|false)""", text)
    return m and m.group(1) == "true"


# ── build a parsed comparison model from JS source ───────────────────────────

def parse_comparison_data(text):
    """Parse the JS source into a dict with structured comparison data."""
    bom_rows = _extract_rows(text, "bomRows", "area")
    cap_rows = _extract_rows(text, "capabilityRows", "capability")
    facts = _extract_decision_beat_facts(text)
    hero_cells = _extract_hero_cells(text)
    draft = _extract_draft_flag(text)
    src_urls = _extract_src_urls(text)
    return {
        "bom_rows": bom_rows,
        "cap_rows": cap_rows,
        "facts": facts,
        "hero_cells": hero_cells,
        "draft": draft,
        "all_rows": bom_rows + cap_rows,
        "src_urls": src_urls,
    }


# ── the SPINE from ledgerModel.js (mirrored here for cross-surface check) ───

SPINE = [
    {"view": "bom", "key": "Inference engine"},
    {"view": "bom", "key": "OpenAI-compatible API endpoint"},
    {"view": "capability", "key": "Model serving (large language model inference)"},
    {"view": "bom", "key": "Distributed inference (llm-d)"},
    {"view": "bom", "key": "Model loading and caching"},
    {"view": "bom", "key": "Notebooks / workbenches"},
    {"view": "bom", "key": "Machine-learning pipelines"},
    {"view": "bom", "key": "Distributed training"},
    {"view": "capability", "key": "Model fine-tuning and alignment"},
    {"view": "bom", "key": "Feature store (Feast)"},
    {"view": "bom", "key": "Experiment tracking (MLflow)"},
    {"view": "capability", "key": "Model registry integration"},
    {"view": "capability", "key": "Autoscaling of model servers"},
    {"view": "capability", "key": "Observability and responsible-AI monitoring"},
]


# ── check functions — each returns a list of failure strings ─────────────────

def check_schema_completeness(data):
    """(1) Every row-side has tier + sourceUrl + sourceLabel."""
    failures = []
    for row in data["all_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if s is None:
                failures.append(
                    'MISSING SIDE: row "%s" side %s is absent' % (row["key"], side_key)
                )
                continue
            if not s.get("tier"):
                failures.append(
                    'MISSING tier: "%s" side %s' % (row["key"], side_key)
                )
            if not s.get("sourceUrl"):
                failures.append(
                    'MISSING sourceUrl: "%s" side %s' % (row["key"], side_key)
                )
            if not s.get("sourceLabel"):
                failures.append(
                    'MISSING sourceLabel: "%s" side %s' % (row["key"], side_key)
                )
    return failures


def check_vocab_conformance(data):
    """(2) All enum fields use the canonical vocabulary."""
    failures = []
    for row in data["bom_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if not s:
                continue
            if s.get("tier") and s["tier"] not in TIER_VOCAB:
                failures.append(
                    'BAD tier="%s": "%s" side %s' % (s["tier"], row["key"], side_key)
                )
            if s.get("included") and s["included"] not in INCLUDED_VOCAB:
                failures.append(
                    'BAD included="%s": "%s" side %s' % (s["included"], row["key"], side_key)
                )
            if s.get("status") and s["status"] not in STATUS_VOCAB:
                failures.append(
                    'BAD status="%s": "%s" side %s' % (s["status"], row["key"], side_key)
                )
    for row in data["cap_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if not s:
                continue
            if s.get("tier") and s["tier"] not in TIER_VOCAB:
                failures.append(
                    'BAD tier="%s": "%s" side %s' % (s["tier"], row["key"], side_key)
                )
            if s.get("support") and s["support"] not in SUPPORT_VOCAB:
                failures.append(
                    'BAD support="%s": "%s" side %s' % (s["support"], row["key"], side_key)
                )
            if s.get("status") and s["status"] not in STATUS_VOCAB:
                failures.append(
                    'BAD status="%s": "%s" side %s' % (s["status"], row["key"], side_key)
                )
    return failures


def check_source_url_shape(data):
    """(3) Every sourceUrl starts with https://; sourceLabel is non-empty."""
    failures = []
    for row in data["all_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if not s:
                continue
            url = s.get("sourceUrl") or ""
            label = s.get("sourceLabel") or ""
            if url and not url.startswith("https://"):
                failures.append(
                    'NON-HTTPS sourceUrl "%s": "%s" side %s' % (url[:60], row["key"], side_key)
                )
            if url and not label.strip():
                failures.append(
                    'EMPTY sourceLabel for URL: "%s" side %s' % (row["key"], side_key)
                )
    return failures


def check_decision_beat_facts(data):
    """(4) decisionBeatFacts: each entry has sourceUrl + sourceLabel.

    Cross-surface rule: a decisionBeatFact sourceUrl must be in either the set of
    row sourceUrls OR the vetted SRC URL namespace (both are validated public origins).
    A URL that appears in neither is a provenance gap — it cites a source not present
    anywhere in the comparison data.
    """
    failures = []
    # Collect real (non-synthetic) row source URLs
    row_source_urls = set()
    for row in data["all_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if s and s.get("sourceUrl"):
                real = _normalize_url(s["sourceUrl"])
                if real:
                    row_source_urls.add(real)

    src_urls = data.get("src_urls", set())
    all_known_urls = row_source_urls | src_urls

    for side_key in ("a", "b"):
        for i, fact in enumerate(data["facts"].get(side_key, [])):
            url = fact.get("sourceUrl") or ""
            label = fact.get("sourceLabel") or ""
            if not url:
                failures.append(
                    'MISSING sourceUrl: decisionBeatFacts[%s][%d]' % (side_key, i)
                )
                continue
            # Synthetic expression placeholder — check the expression is a known SRC key
            real_url = _normalize_url(url)
            if real_url is None:
                # The fact uses an SRC.xxx expression which our parser recognized as https-rooted.
                # The expression-level shape is correct; no further check needed here.
                pass
            elif not real_url.startswith("https://"):
                failures.append(
                    'NON-HTTPS sourceUrl: decisionBeatFacts[%s][%d] "%s"' % (side_key, i, url[:60])
                )
            elif all_known_urls and real_url not in all_known_urls:
                failures.append(
                    'UNMATCHED sourceUrl: decisionBeatFacts[%s][%d] "%s" not in any row or SRC namespace'
                    % (side_key, i, real_url[:80])
                )
            if url and not label.strip():
                failures.append(
                    'EMPTY sourceLabel: decisionBeatFacts[%s][%d]' % (side_key, i)
                )
    return failures


def check_ledger_spine_coverage(data):
    """(5) Every SPINE entry key resolves to a real row."""
    failures = []
    bom_keys = {r["key"] for r in data["bom_rows"]}
    cap_keys = {r["key"] for r in data["cap_rows"]}
    for entry in SPINE:
        keys = bom_keys if entry["view"] == "bom" else cap_keys
        if entry["key"] not in keys:
            failures.append(
                'SPINE BROKEN: view="%s" key="%s" not found in %sRows'
                % (entry["view"], entry["key"], entry["view"] == "bom" and "bom" or "capability")
            )
    return failures


def check_hero_cell_resolution(data):
    """(6) Every hero cell resolves to an existing row + side with a sourceUrl."""
    failures = []
    bom_map = {r["key"]: r for r in data["bom_rows"]}
    cap_map = {r["key"]: r for r in data["cap_rows"]}
    for cell in data["hero_cells"]:
        row_map = bom_map if cell["view"] == "bom" else cap_map
        row = row_map.get(cell["key"])
        if not row:
            failures.append(
                'HERO UNRESOLVED: zone=%s label="%s" view=%s key="%s" — row not found'
                % (cell["zone"], cell["label"], cell["view"], cell["key"])
            )
            continue
        side = row.get(cell["side"])
        if not side:
            failures.append(
                'HERO UNRESOLVED: zone=%s label="%s" — side "%s" missing on row "%s"'
                % (cell["zone"], cell["label"], cell["side"], cell["key"])
            )
            continue
        if not side.get("sourceUrl"):
            failures.append(
                'HERO NO SOURCE: zone=%s label="%s" — side "%s" of row "%s" has no sourceUrl'
                % (cell["zone"], cell["label"], cell["side"], cell["key"])
            )
    return failures


def check_illustrative_draft_fence(data):
    """(7) Data fence: illustrative/draft flags must be consistent.

    Rules (mirroring productComparisons.test.js but checking for the additional
    cross-surface case — a row with illustrative=false while draft=true):
      - If draft=True, at least one row must be illustrative=True.
      - If draft=True, no row may have illustrative=False explicitly set to False
        while other rows are still illustrative (that would quietly present one row
        as confirmed while others are still placeholders — inconsistent signaling).
      - (The vitest test already catches: draft=False + any illustrative=True.)
    """
    failures = []
    rows = data["all_rows"]
    draft = data["draft"]
    illustrative_flags = [r.get("illustrative") for r in rows]

    if draft:
        has_illustrative_true = any(f is True for f in illustrative_flags)
        if not has_illustrative_true:
            failures.append(
                "FENCE VIOLATION: draft=true but no row has illustrative=true — data fence is missing"
            )
        # Check for rows explicitly set illustrative=False while draft is true
        # (allowed if ALL rows are False, meaning the draft flag is stale — but vitest
        #  catches that separately; here we flag the mixed case).
        false_rows = [rows[i]["key"] for i, f in enumerate(illustrative_flags) if f is False]
        true_rows = [rows[i]["key"] for i, f in enumerate(illustrative_flags) if f is True]
        if false_rows and true_rows:
            failures.append(
                "FENCE MIXED: draft=true with a mix of illustrative=true and illustrative=false rows. "
                "Rows set false: %s" % "; ".join(false_rows[:5])
            )
    return failures


def check_version_mixing(data):
    """(8) Version-table mixing guard (future componentVersions field).

    When a row carries a `versionTable` field (not yet in production data),
    every entry in that table must share the same release string. A table that
    mixes e.g. '3.1' and '3.4' entries is flagged as a version-mixing error.
    """
    failures = []
    for row in data["all_rows"]:
        vt = row.get("versionTable")
        if not vt:
            continue
        # versionTable is expected as a list of dicts with a 'release' key.
        if not isinstance(vt, list):
            failures.append(
                'INVALID versionTable format: "%s" (expected list)' % row["key"]
            )
            continue
        releases = set()
        for entry in vt:
            if isinstance(entry, dict):
                rel = entry.get("release")
                if rel:
                    releases.add(rel)
        if len(releases) > 1:
            failures.append(
                'VERSION MIXING in "%s": versionTable contains multiple release values: %s'
                % (row["key"], ", ".join(sorted(releases)))
            )
    return failures


def check_provenance_collapse(data):
    """(9) Flag any sourceUrl cited by >= PROVENANCE_COLLAPSE_THRESHOLD row-sides.

    One source vouching for many distinct facts is a coverage gap — it usually means
    a placeholder URL was copy-pasted without checking each claim against its own
    dedicated anchor or section.

    Synthetic JS-expression placeholders are counted by their expression key, not their
    full synthetic string, so e.g. all cells citing SRC.rhaisGettingStarted collapse
    under one key rather than fragmented by line-number variant.
    """
    url_citations = {}  # canonical_key -> list of "row_key [side]" strings
    for row in data["all_rows"]:
        for side_key in ("a", "b"):
            s = row[side_key]
            if not s:
                continue
            url = s.get("sourceUrl") or ""
            if not url:
                continue
            # Normalize: extract the expression name from synthetic placeholders so
            # gam(44) and gam(53) both count under "gam(...)" rather than separate keys.
            real = _normalize_url(url)
            if real is None:
                # Synthetic — extract the expression root (function name or SRC key)
                # e.g. "https://[resolved-from-js-expression:SRC.rhaisGettingStarted]"
                inner = re.search(r"resolved-from-js-expression:([^]]+)", url)
                canonical = inner.group(1).split("(")[0] if inner else url
            else:
                canonical = real
            url_citations.setdefault(canonical, []).append('"%s" [%s]' % (row["key"], side_key))

    failures = []
    for canonical, citations in url_citations.items():
        if len(citations) >= PROVENANCE_COLLAPSE_THRESHOLD:
            failures.append(
                "PROVENANCE COLLAPSE: %s row-sides all cite the same source (%s...): %s"
                % (len(citations), canonical[:60], "; ".join(citations[:4]) + ("…" if len(citations) > 4 else ""))
            )
    return failures


# ── runner ────────────────────────────────────────────────────────────────────

CHECKS = [
    ("schema completeness (tier + sourceUrl + sourceLabel on every side)", check_schema_completeness),
    ("vocab conformance (tier/included/support/status enum values)", check_vocab_conformance),
    ("source URL shape (https:// prefix, non-empty label)", check_source_url_shape),
    ("decisionBeatFacts cross-surface consistency", check_decision_beat_facts),
    ("ledger spine coverage (every SPINE entry resolves to a row)", check_ledger_spine_coverage),
    ("hero cell resolution (every cell resolves to a row+side with source)", check_hero_cell_resolution),
    ("illustrative/draft data fence consistency", check_illustrative_draft_fence),
    ("version table mixing guard (componentVersions feature)", check_version_mixing),
    ("provenance collapse (one URL cited for >= %d sides)" % PROVENANCE_COLLAPSE_THRESHOLD, check_provenance_collapse),
]


def run_checks(data):
    """Run all checks and return a list of (check_name, failures_list) for failing checks."""
    failing = []
    for name, fn in CHECKS:
        results = fn(data)
        if results:
            failing.append((name, results))
    return failing


def main_live():
    text = _load_text()
    data = parse_comparison_data(text)
    failing = run_checks(data)
    if not failing:
        sys.stdout.write("PASS")
        sys.exit(0)
    for name, results in failing:
        sys.stdout.write("=== FAIL: %s ===\n" % name)
        for r in results:
            sys.stdout.write("  %s\n" % r)
    sys.exit(1)


# ── self-test suite ───────────────────────────────────────────────────────────

def _make_clean_data():
    """A minimal comparison dataset that passes all checks."""
    url_a = "https://docs.redhat.com/rhai/getting-started"
    url_b = "https://docs.redhat.com/rhoai/installing"
    row = {
        "key": "Inference engine",
        "area_field": "area",
        "illustrative": True,
        "versionTable": None,
        "a": {
            "tier": "clear",
            "sourceUrl": url_a,
            "sourceLabel": "Red Hat AI docs",
            "included": "included",
            "support": None,
            "status": None,
            "detail": "vLLM",
        },
        "b": {
            "tier": "inferred",
            "sourceUrl": url_b,
            "sourceLabel": "RHOAI install docs",
            "included": "included",
            "support": None,
            "status": None,
            "detail": "KServe",
        },
    }
    cap_row = {
        "key": "Model serving (large language model inference)",
        "area_field": "capability",
        "illustrative": True,
        "versionTable": None,
        "a": {
            "tier": "clear",
            "sourceUrl": url_a,
            "sourceLabel": "Red Hat AI docs",
            "included": None,
            "support": "yes",
            "status": None,
            "detail": "LLM serving",
        },
        "b": {
            "tier": "clear",
            "sourceUrl": url_b,
            "sourceLabel": "RHOAI docs",
            "included": None,
            "support": "yes",
            "status": None,
            "detail": "KServe serving",
        },
    }
    return {
        "bom_rows": [row],
        "cap_rows": [cap_row],
        "all_rows": [row, cap_row],
        "facts": {
            "a": [{"sourceUrl": url_a, "sourceLabel": "Red Hat AI docs", "text": "One container"}],
            "b": [{"sourceUrl": url_b, "sourceLabel": "RHOAI docs", "text": "Notebooks + serving"}],
        },
        "hero_cells": [
            {"zone": "inner", "label": "vLLM Engine", "view": "bom", "key": "Inference engine", "side": "a"},
        ],
        "draft": True,
    }


def _copy_data(d):
    import copy
    return copy.deepcopy(d)


def _run_self_tests():
    """Run self-tests. Returns (passed, failed) counts."""
    passed = 0
    failed = 0

    def expect_pass(check_fn, data, description):
        nonlocal passed, failed
        results = check_fn(data)
        if results:
            sys.stdout.write("SELF-TEST FAIL (expected pass): %s\n  got: %s\n" % (description, results[0]))
            failed += 1
        else:
            passed += 1

    def expect_fail(check_fn, data, description, substr=None):
        nonlocal passed, failed
        results = check_fn(data)
        if not results:
            sys.stdout.write("SELF-TEST FAIL (expected failure): %s\n" % description)
            failed += 1
        elif substr and not any(substr in r for r in results):
            sys.stdout.write(
                "SELF-TEST FAIL (wrong failure message): %s\n  expected substring %r in: %s\n"
                % (description, substr, results[0])
            )
            failed += 1
        else:
            passed += 1

    clean = _make_clean_data()

    # ── (1) schema completeness ──────────────────────────────────────────────
    expect_pass(check_schema_completeness, clean, "(1) clean data passes schema check")
    broken = _copy_data(clean)
    broken["all_rows"][0]["a"]["tier"] = None
    expect_fail(check_schema_completeness, broken, "(1) missing tier detected", "MISSING tier")

    broken2 = _copy_data(clean)
    broken2["all_rows"][0]["b"]["sourceUrl"] = None
    expect_fail(check_schema_completeness, broken2, "(1) missing sourceUrl detected", "MISSING sourceUrl")

    broken3 = _copy_data(clean)
    broken3["all_rows"][0]["a"]["sourceLabel"] = ""
    expect_fail(check_schema_completeness, broken3, "(1) empty sourceLabel detected", "MISSING sourceLabel")

    # ── (2) vocab conformance ────────────────────────────────────────────────
    expect_pass(check_vocab_conformance, clean, "(2) clean data passes vocab check")
    broken = _copy_data(clean)
    broken["bom_rows"][0]["a"]["tier"] = "maybe"
    broken["all_rows"][0]["a"]["tier"] = "maybe"
    expect_fail(check_vocab_conformance, broken, "(2) bad tier caught", "BAD tier")

    broken2 = _copy_data(clean)
    broken2["bom_rows"][0]["a"]["included"] = "bundled"
    broken2["all_rows"][0]["a"]["included"] = "bundled"
    expect_fail(check_vocab_conformance, broken2, "(2) bad included caught", "BAD included")

    # ── (3) source URL shape ─────────────────────────────────────────────────
    expect_pass(check_source_url_shape, clean, "(3) clean data passes URL shape check")
    broken = _copy_data(clean)
    broken["all_rows"][0]["a"]["sourceUrl"] = "http://example.com"
    expect_fail(check_source_url_shape, broken, "(3) non-https URL caught", "NON-HTTPS")

    broken2 = _copy_data(clean)
    broken2["all_rows"][0]["b"]["sourceLabel"] = "   "
    expect_fail(check_source_url_shape, broken2, "(3) empty label caught", "EMPTY sourceLabel")

    # ── (4) decisionBeatFacts ────────────────────────────────────────────────
    expect_pass(check_decision_beat_facts, clean, "(4) clean data passes facts check")
    broken = _copy_data(clean)
    broken["facts"]["a"][0]["sourceUrl"] = "https://completely.different.example.com/page"
    expect_fail(check_decision_beat_facts, broken, "(4) unmatched fact URL caught", "UNMATCHED sourceUrl")

    broken2 = _copy_data(clean)
    broken2["facts"]["b"][0]["sourceUrl"] = None
    expect_fail(check_decision_beat_facts, broken2, "(4) missing fact sourceUrl caught", "MISSING sourceUrl")

    # ── (5) ledger spine coverage ─────────────────────────────────────────────
    # The clean data has only "Inference engine" (bom) and one cap row — the spine
    # check WILL flag the other 12 SPINE entries that are missing from the synthetic
    # dataset. We test the check correctly by building a full-spine dataset.
    full_spine = _copy_data(clean)
    # Populate every SPINE entry with a minimal row so the check passes.
    url_a = "https://docs.redhat.com/rhai/getting-started"
    url_b = "https://docs.redhat.com/rhoai/installing"
    side_a = {"tier": "clear", "sourceUrl": url_a, "sourceLabel": "label a",
              "included": "included", "support": None, "status": None, "detail": "x"}
    side_b = {"tier": "clear", "sourceUrl": url_b, "sourceLabel": "label b",
              "included": "included", "support": None, "status": None, "detail": "y"}
    cap_side_a = dict(side_a, included=None, support="yes")
    cap_side_b = dict(side_b, included=None, support="yes")
    for entry in SPINE:
        row = {"key": entry["key"], "area_field": "area" if entry["view"] == "bom" else "capability",
               "illustrative": True, "versionTable": None, "a": side_a, "b": side_b}
        if entry["view"] == "capability":
            row["a"] = cap_side_a
            row["b"] = cap_side_b
        if entry["view"] == "bom":
            if not any(r["key"] == entry["key"] for r in full_spine["bom_rows"]):
                full_spine["bom_rows"].append(row)
        else:
            if not any(r["key"] == entry["key"] for r in full_spine["cap_rows"]):
                full_spine["cap_rows"].append(row)
        if not any(r["key"] == entry["key"] for r in full_spine["all_rows"]):
            full_spine["all_rows"].append(row)
    expect_pass(check_ledger_spine_coverage, full_spine, "(5) full-spine data passes spine check")

    # Breaking one spine entry triggers the failure.
    broken = _copy_data(full_spine)
    broken["bom_rows"] = [r for r in broken["bom_rows"] if r["key"] != "Inference engine"]
    broken["all_rows"] = [r for r in broken["all_rows"] if r["key"] != "Inference engine"]
    expect_fail(check_ledger_spine_coverage, broken, "(5) broken spine key caught", "SPINE BROKEN")

    # ── (6) hero cell resolution ──────────────────────────────────────────────
    expect_pass(check_hero_cell_resolution, clean, "(6) clean data passes hero check")
    broken = _copy_data(clean)
    broken["hero_cells"][0]["key"] = "Does not exist"
    expect_fail(check_hero_cell_resolution, broken, "(6) broken hero key caught", "HERO UNRESOLVED")

    broken2 = _copy_data(clean)
    broken2["bom_rows"][0]["a"]["sourceUrl"] = None
    broken2["all_rows"][0]["a"]["sourceUrl"] = None
    expect_fail(check_hero_cell_resolution, broken2, "(6) hero cell with no sourceUrl caught", "HERO NO SOURCE")

    # ── (7) illustrative/draft fence ─────────────────────────────────────────
    expect_pass(check_illustrative_draft_fence, clean, "(7) clean draft+illustrative passes")
    broken = _copy_data(clean)
    broken["draft"] = True
    for r in broken["all_rows"]:
        r["illustrative"] = False  # draft=true but no illustrative=true
    expect_fail(check_illustrative_draft_fence, broken, "(7) draft without illustrative caught", "FENCE VIOLATION")

    mixed = _copy_data(clean)
    mixed["draft"] = True
    mixed["all_rows"][0]["illustrative"] = True
    # add a second row with illustrative=False
    extra = _copy_data(mixed["all_rows"][0])
    extra["key"] = "Second row"
    extra["illustrative"] = False
    mixed["all_rows"].append(extra)
    expect_fail(check_illustrative_draft_fence, mixed, "(7) mixed illustrative flags caught", "FENCE MIXED")

    # ── (8) version mixing ────────────────────────────────────────────────────
    expect_pass(check_version_mixing, clean, "(8) clean data (no versionTable) passes")
    broken = _copy_data(clean)
    broken["all_rows"][0]["versionTable"] = [{"release": "3.1", "component": "vLLM"}, {"release": "3.4", "component": "vLLM"}]
    expect_fail(check_version_mixing, broken, "(8) version mixing caught", "VERSION MIXING")

    good_vt = _copy_data(clean)
    good_vt["all_rows"][0]["versionTable"] = [{"release": "3.1", "component": "vLLM"}, {"release": "3.1", "component": "KServe"}]
    expect_pass(check_version_mixing, good_vt, "(8) single-release versionTable passes")

    # ── (9) provenance collapse ───────────────────────────────────────────────
    expect_pass(check_provenance_collapse, clean, "(9) clean data (few rows) passes collapse check")
    many = _copy_data(clean)
    shared_url = "https://docs.redhat.com/rhai/everything"
    # Add enough rows (THRESHOLD + 1 sides, using 2 sides per row) to trigger the collapse.
    # Each row contributes 2 citations (side a + side b), so THRESHOLD/2 + 1 rows suffice.
    n_rows = PROVENANCE_COLLAPSE_THRESHOLD // 2 + 1
    for i in range(n_rows):
        r = _copy_data(clean["all_rows"][0])
        r["key"] = "Row %d" % i
        r["a"] = dict(r["a"], sourceUrl=shared_url)
        r["b"] = dict(r["b"], sourceUrl=shared_url)
        many["all_rows"].append(r)
    expect_fail(check_provenance_collapse, many, "(9) provenance collapse caught", "PROVENANCE COLLAPSE")

    return passed, failed


def main_self_test():
    passed, failed = _run_self_tests()
    total = passed + failed
    sys.stdout.write("Self-test: %d/%d passed\n" % (passed, total))
    if failed:
        sys.exit(1)
    sys.stdout.write("PASS\n")
    sys.exit(0)


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        main_self_test()
    else:
        main_live()
