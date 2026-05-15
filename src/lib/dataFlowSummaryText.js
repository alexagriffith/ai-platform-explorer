import { collectFlowLayersFromNested, collectFlowStructuralEdges } from './flowVisualizationData';

function displayNameForFlowId(layers, id) {
  for (const layer of layers) {
    const c = layer.components.find((x) => x.id === id);
    if (c) return c.name;
  }
  return id;
}

/**
 * Plain-text summary of the architecture flow view for clipboard paste.
 * Derived from the nested capability shape used by FlowVisualization.
 */
export function generateDataFlowSummaryTextFromNested(selectedCapabilitiesNested) {
  const layers = collectFlowLayersFromNested(selectedCapabilitiesNested);
  const lines = [
    'Data flow summary (workshop)',
    '',
    'Generated from the current stack selection. Intended for customer follow-up notes, not as-built documentation.',
    ''
  ];

  if (layers.length === 0) {
    lines.push('No components in this flow view yet — select capabilities in Build Your Stack.');
    return lines.join('\n');
  }

  layers.forEach((layer) => {
    lines.push(layer.layer.toUpperCase());
    lines.push('');
    layer.components.forEach((c) => {
      lines.push(`  • ${c.name} (${c.optionId || '—'})`);
      lines.push(`    ${c.description}`);
      lines.push('');
    });
  });

  const structuralEdges = collectFlowStructuralEdges(layers);
  if (structuralEdges.length > 0) {
    lines.push('RELATIONSHIPS (WORKSHOP CUES)');
    lines.push('');
    structuralEdges.forEach((e) => {
      const kind = e.required ? 'Spine / platform dependency' : 'Common pairing';
      const fromN = displayNameForFlowId(layers, e.from);
      const toN = displayNameForFlowId(layers, e.to);
      lines.push(`  • ${fromN} → ${toN} (${kind}): ${e.label}`);
    });
    lines.push('');
  }

  const suggested = layers.flatMap((l) => l.components.filter((c) => c.isSuggested));
  if (suggested.length > 0) {
    lines.push('OPTIONAL PAIRINGS (dashed cards in the flow view)');
    lines.push('');
    suggested.forEach((c) => {
      lines.push(`  • ${c.name}: ${c.suggestionHint || 'Typical follow-on topic for the team.'}`);
    });
    lines.push('');
  }

  lines.push('DISCUSSION FRAMING');
  lines.push('');
  lines.push(
    'Narrate from the application edge toward runtime when it helps the room; dashed pairings are common add-ons, not requirements.'
  );
  lines.push('');

  return lines.join('\n').trim();
}
