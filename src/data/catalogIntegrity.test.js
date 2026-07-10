import { describe, it, expect } from 'vitest';
import { capabilities } from './capabilities';
import { products, thirdPartyOptions } from './products';
import { subComponents } from './subComponents';

// CLAUDE.md locks the status vocabulary. This test fails the build if any catalog
// record drifts outside it (e.g. 'Technology Preview' instead of 'Tech Preview',
// which slips past ProductExplorer's status-color map and the shared badge helper).
// NOTE: `provider` is intentionally NOT vocabulary-checked — it carries vendor/source
// names (NVIDIA, AMD, Intel, Google, AWS, Open Source, ...). Only the color-badge
// grouping collapses provider to Red Hat / Customer / third-party; the raw field is open.
const VALID_STATUS = ['GA', 'Tech Preview', 'Dev Preview', 'Check with Red Hat'];

/** Recursively collect every value of `key` found anywhere in a nested structure, with a path for diagnostics. */
function collect(node, key, path = 'root', out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collect(item, key, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === key && typeof v === 'string') out.push({ value: v, path: `${path}.${k}` });
      else collect(v, key, `${path}.${k}`, out);
    }
  }
  return out;
}

const sources = { capabilities, products, thirdPartyOptions, subComponents };

describe('catalog vocabulary integrity', () => {
  it('every status value is in the canonical set', () => {
    const offenders = [];
    for (const [name, data] of Object.entries(sources)) {
      for (const hit of collect(data, 'status', name)) {
        if (!VALID_STATUS.includes(hit.value)) offenders.push(`${hit.path} = "${hit.value}"`);
      }
    }
    expect(offenders, `status values outside ${JSON.stringify(VALID_STATUS)}:\n${offenders.join('\n')}`).toEqual([]);
  });

});
