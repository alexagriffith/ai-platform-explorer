import { describe, it, expect } from 'vitest';
import { buildLedgerModel, readSide, sideTitle } from './ledgerModel';
import { aiInferenceVsRhoai } from '../data/productComparisons';

// These assertions intentionally test PRESENCE and the containment SHAPE, which are derived from the
// `included`/`support` vocabulary — NOT from `tier`. A concurrent "verification tier upgrade" to the
// data (inferred -> clear) must not break these; only a curation flip of an included/support value
// (which the data fence forbids for agents) would, and that would be a legitimate red test.

describe('readSide (presence + confidence derivation)', () => {
  it('maps BOM inclusion to presence', () => {
    expect(readSide({ included: 'included' }, 'bom').present).toBe(true);
    expect(readSide({ included: 'add-on' }, 'bom').present).toBe(true);
    expect(readSide({ included: 'not-included' }, 'bom').present).toBe(false);
    expect(readSide({ included: 'confirm' }, 'bom').present).toBe(false); // not established -> absent
  });

  it('maps capability support to presence', () => {
    expect(readSide({ support: 'yes' }, 'capability').present).toBe(true);
    expect(readSide({ support: 'partial' }, 'capability').present).toBe(true);
    expect(readSide({ support: 'no' }, 'capability').present).toBe(false);
    expect(readSide({ support: 'confirm' }, 'capability').present).toBe(false);
  });

  it('is verified only when present AND clear-tier', () => {
    expect(readSide({ included: 'included', tier: 'clear' }, 'bom').verified).toBe(true);
    expect(readSide({ included: 'included', tier: 'inferred' }, 'bom').verified).toBe(false);
    expect(readSide({ included: 'confirm', tier: 'clear' }, 'bom').verified).toBe(false); // absent
    expect(readSide(null, 'bom')).toEqual({
      present: false,
      verified: false,
      raw: null,
      sourceUrl: null,
      sourceLabel: null
    });
  });
});

describe('buildLedgerModel (shared-spine ledger)', () => {
  const model = buildLedgerModel(aiInferenceVsRhoai);
  const group = (id) => model.find((g) => g.id === id);
  const allRows = model.flatMap((g) => g.rows);

  it('returns the three task groups in order, each non-empty', () => {
    expect(model.map((g) => g.id)).toEqual(['serve', 'build', 'operate']);
    for (const g of model) expect(g.rows.length).toBeGreaterThan(0);
  });

  it('never emits a double-absent row, and every name links to an https source', () => {
    for (const row of allRows) {
      expect(row.a.present || row.b.present, `${row.name} has no present side`).toBe(true);
      expect(row.link, `${row.name} has no source link`).toBeTruthy();
      expect(row.link.url.startsWith('https://'), `${row.name} link not https`).toBe(true);
      expect(typeof row.link.label === 'string' && row.link.label.length > 0).toBe(true);
    }
  });

  it('the serve-models core is shared by both products', () => {
    const shared = new Set(group('serve').rows.filter((r) => r.shared).map((r) => r.name));
    for (const name of ['Inference engine', 'OpenAI API', 'Model serving']) {
      expect(shared.has(name), `${name} should be present in BOTH products`).toBe(true);
    }
  });

  it('containment as shape: build & train is OpenShift-only (left column empty, right column full)', () => {
    for (const row of group('build').rows) {
      expect(row.a.present, `Inference Server should NOT have ${row.name}`).toBe(false);
      expect(row.b.present, `OpenShift AI should have ${row.name}`).toBe(true);
    }
  });

  it("the left column's presence is contained near the top: no build-group row is left-only", () => {
    // The Inference Server (left) only marks present in the shared core + one operate touchpoint;
    // it is never the sole product on a build/operate row.
    const leftOnly = allRows.filter((r) => r.a.present && !r.b.present).map((r) => r.name);
    // Model loading is the one intrinsic-to-the-engine exception; it lives in the serve group.
    expect(group('serve').rows.map((r) => r.name)).toEqual(expect.arrayContaining(leftOnly));
    expect(allRows.some((r) => r.shared)).toBe(true); // at least one shared row (a band exists)
    expect(allRows.some((r) => r.b.present && !r.a.present)).toBe(true); // platform extends beyond
  });
});

describe('sideTitle (tooltip / screen-reader text, never visible row text)', () => {
  it('reads out inclusion and pending state', () => {
    expect(sideTitle('X', { present: true, verified: true, raw: 'included' })).toBe('X: included');
    expect(sideTitle('X', { present: true, verified: false, raw: 'included' })).toBe(
      'X: included — pending verification'
    );
    expect(sideTitle('X', { present: false, verified: false, raw: 'confirm' })).toBe(
      'X: confirm with Red Hat'
    );
  });
});
