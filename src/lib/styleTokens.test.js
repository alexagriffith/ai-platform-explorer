import { describe, it, expect } from 'vitest';
import { typeScale } from './styleTokens';

/**
 * Type-scale vocabulary integrity.
 *
 * The role-token set is meant to be a tight semantic vocabulary, not a catalog of
 * near-identical size strings. When two roles resolve to the SAME literal, that shared
 * tier must be declared once (via a shared `_const` in styleTokens.js) and the pairing
 * must be an intentional, documented alias — listed below. Any duplicate NOT on this
 * list is accidental proliferation (the exact failure that motivated this check) and
 * fails the gate, forcing a decision: consolidate, or differentiate.
 *
 * To intentionally add a shared tier: route both roles through one `_const` in
 * styleTokens.js AND add the group here with a one-line reason.
 */
const APPROVED_ALIAS_GROUPS = [
  { names: ['pageTitle', 'monoTitle'], reason: 'largest bold heading; mono variant shares the tier' },
  { names: ['primaryHeading', 'recommendationHeading'], reason: 'recommendationHeading is the deprecated alias' },
  { names: ['componentName', 'subPanelTitle'], reason: 'sm bold identity heading, shared by component + sub-panel' },
  { names: ['caption', 'tableCell', 'secondary'], reason: 'smallest supporting-text tier; secondary is deprecated alias' },
];

describe('typeScale vocabulary', () => {
  it('has no accidental duplicate literals (every duplicate is an approved, documented alias)', () => {
    const byValue = new Map();
    for (const [name, value] of Object.entries(typeScale)) {
      if (!byValue.has(value)) byValue.set(value, []);
      byValue.get(value).push(name);
    }

    const approvedKeys = new Set(
      APPROVED_ALIAS_GROUPS.map((g) => [...g.names].sort().join('|')),
    );

    const unexpected = [];
    for (const [value, names] of byValue) {
      if (names.length < 2) continue;
      const key = [...names].sort().join('|');
      if (!approvedKeys.has(key)) unexpected.push({ value, names });
    }

    expect(
      unexpected,
      `Unapproved duplicate type-scale literals (consolidate or differentiate, then update ` +
        `APPROVED_ALIAS_GROUPS): ${JSON.stringify(unexpected)}`,
    ).toEqual([]);
  });

  it('every approved alias group is still actually a duplicate (prune stale entries)', () => {
    for (const group of APPROVED_ALIAS_GROUPS) {
      const values = new Set(group.names.map((n) => typeScale[n]));
      expect(
        values.size,
        `Alias group ${group.names.join('/')} no longer shares one literal — prune it from APPROVED_ALIAS_GROUPS`,
      ).toBe(1);
    }
  });
});
