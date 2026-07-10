import { describe, it, expect } from 'vitest';
import {
  productComparisons,
  aiInferenceVsRhoai,
  getProductComparisonById,
  getProductComparisonList,
  isComparisonDraft
} from './productComparisons';
import { products } from './products';
import { getComparisonById } from './deploymentComparisons';

// Data-shape invariants for the product-comparison dual-view model. The most important
// group is "data fence" below: it makes quietly promoting illustrative placeholder rows to
// look like confirmed product truth a RED test (see src/data/CURATION-TODO.md for the human gate).

const INCLUDED_VOCAB = ['included', 'add-on', 'not-included', 'confirm'];
const SUPPORT_VOCAB = ['yes', 'partial', 'no', 'confirm'];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const productIds = new Set(products.map((p) => p.id));
const comparisonIds = new Set(productComparisons.map((c) => c.id));

describe('productComparisons data model', () => {
  it('every comparison id is unique and kebab-case', () => {
    const ids = productComparisons.map((c) => c.id);
    expect(new Set(ids).size, 'comparison ids must be unique').toBe(ids.length);
    for (const id of ids) {
      expect(id, `id "${id}" is not kebab-case`).toMatch(KEBAB);
    }
  });

  it('every comparison references two distinct, real product ids', () => {
    for (const comp of productComparisons) {
      const a = comp.products?.a?.productId;
      const b = comp.products?.b?.productId;
      expect(productIds.has(a), `${comp.id}: product a "${a}" not in products catalog`).toBe(true);
      expect(productIds.has(b), `${comp.id}: product b "${b}" not in products catalog`).toBe(true);
      expect(a, `${comp.id}: products a and b must differ`).not.toBe(b);
    }
  });

  it('every comparison has the dual-view type and non-empty text fields', () => {
    for (const comp of productComparisons) {
      expect(comp.comparisonType, `${comp.id}: wrong comparisonType`).toBe('product-dual-view');
      for (const field of ['title', 'description', 'audience']) {
        expect(typeof comp[field], `${comp.id}.${field} must be a string`).toBe('string');
        expect(comp[field].trim().length, `${comp.id}.${field} must be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('every BOM row has an area and a valid inclusion value on both sides', () => {
    for (const comp of productComparisons) {
      expect(Array.isArray(comp.bomRows), `${comp.id}.bomRows must be an array`).toBe(true);
      for (const row of comp.bomRows) {
        expect(typeof row.area === 'string' && row.area.trim().length > 0, `${comp.id}: a BOM row is missing "area"`).toBe(true);
        for (const side of ['a', 'b']) {
          expect(row[side], `${comp.id} BOM "${row.area}" side ${side} missing`).toBeTruthy();
          expect(INCLUDED_VOCAB, `${comp.id} BOM "${row.area}" side ${side} included="${row[side]?.included}"`).toContain(row[side].included);
        }
      }
    }
  });

  it('every capability row has a capability, valid support values, and boolean overlap', () => {
    for (const comp of productComparisons) {
      expect(Array.isArray(comp.capabilityRows), `${comp.id}.capabilityRows must be an array`).toBe(true);
      for (const row of comp.capabilityRows) {
        expect(typeof row.capability === 'string' && row.capability.trim().length > 0, `${comp.id}: a capability row is missing "capability"`).toBe(true);
        for (const side of ['a', 'b']) {
          expect(row[side], `${comp.id} capability "${row.capability}" side ${side} missing`).toBeTruthy();
          expect(SUPPORT_VOCAB, `${comp.id} capability "${row.capability}" side ${side} support="${row[side]?.support}"`).toContain(row[side].support);
        }
        expect(typeof row.overlap, `${comp.id} capability "${row.capability}" overlap must be boolean`).toBe('boolean');
      }
    }
  });

  it('data fence: illustrative rows are flagged, sourced, and consistent with the draft flag', () => {
    for (const comp of productComparisons) {
      const rows = [...comp.bomRows, ...comp.capabilityRows];
      for (const row of rows) {
        expect(typeof row.illustrative, `${comp.id}: every row must carry a boolean "illustrative"`).toBe('boolean');
        if (row.illustrative === true) {
          expect(
            typeof row.sourceRef === 'string' && row.sourceRef.trim().length > 0,
            `${comp.id}: an illustrative row is missing a non-empty "sourceRef"`
          ).toBe(true);
        }
      }
      const hasIllustrative = rows.some((r) => r.illustrative === true);
      if (comp.draft === false) {
        expect(hasIllustrative, `${comp.id}: draft is false but illustrative rows remain (curate or re-flag)`).toBe(false);
      }
      if (hasIllustrative) {
        expect(comp.draft, `${comp.id}: illustrative rows present but draft is not true`).toBe(true);
      }
    }
  });

  it('helper functions resolve, list, and detect draft correctly', () => {
    expect(getProductComparisonById('ai-inference-vs-rhoai')).toBe(aiInferenceVsRhoai);
    expect(getProductComparisonById('does-not-exist')).toBeUndefined();
    for (const item of getProductComparisonList()) {
      expect(Object.keys(item).sort()).toEqual(['audience', 'description', 'draft', 'id', 'title']);
    }
    expect(isComparisonDraft(aiInferenceVsRhoai)).toBe(true);
    expect(isComparisonDraft(undefined)).toBe(false);
  });

  it('every docsLinks url is https', () => {
    for (const comp of productComparisons) {
      for (const link of comp.docsLinks ?? []) {
        expect(link.url.startsWith('https://'), `${comp.id}: docs link is not https: ${link.url}`).toBe(true);
      }
    }
  });

  it('every relatedComparisons id resolves to a real deployment or product comparison', () => {
    for (const comp of productComparisons) {
      for (const relId of comp.relatedComparisons ?? []) {
        const resolves = Boolean(getComparisonById(relId)) || comparisonIds.has(relId);
        expect(resolves, `${comp.id}: related comparison "${relId}" does not resolve anywhere`).toBe(true);
      }
    }
  });
});
