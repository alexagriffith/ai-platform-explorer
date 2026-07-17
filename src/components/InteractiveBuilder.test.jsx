// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import InteractiveBuilder from './InteractiveBuilder';

afterEach(cleanup);

/**
 * Harness that mirrors how ArchitectureHub hosts the builder: the parent owns
 * the canonical blueprint map, and switching Build Mode unmounts the builder.
 */
function Harness({ initialCaps = {} }) {
  const [caps, setCaps] = useState(initialCaps);
  const [showBuilder, setShowBuilder] = useState(true);
  return (
    <div>
      {showBuilder && (
        <InteractiveBuilder selectedCapabilities={caps} setSelectedCapabilities={setCaps} />
      )}
      <button onClick={() => setShowBuilder((s) => !s)}>toggle-builder-harness</button>
      <pre data-testid="parent-state">{JSON.stringify(caps)}</pre>
    </div>
  );
}

const parentState = () => JSON.parse(screen.getByTestId('parent-state').textContent);

describe('InteractiveBuilder <-> parent blueprint sync', () => {
  it('pushes initial wizard defaults up to the parent immediately (not only on completion)', () => {
    render(<Harness />);
    // Infrastructure defaults include the recommended required option.
    expect(parentState()['container-platform']).toBe('openshift');
  });

  it('syncs a selection change up to the parent as soon as it is made', () => {
    render(<Harness />);
    // getAllByRole: the card (div[role=button]) and the guide button both match the name pattern;
    // the card is always first in DOM order.
    fireEvent.click(screen.getAllByRole('button', { name: /Existing Kubernetes/ })[0]);
    expect(parentState()['container-platform']).toBe('kubernetes');
  });

  it('partial progress survives unmounting and remounting the builder (mode switch)', () => {
    render(<Harness />);
    fireEvent.click(screen.getAllByRole('button', { name: /Existing Kubernetes/ })[0]);
    const toggle = screen.getByRole('button', { name: 'toggle-builder-harness' });
    fireEvent.click(toggle); // unmount (switch away from Interactive Builder)
    expect(parentState()['container-platform']).toBe('kubernetes');
    fireEvent.click(toggle); // remount (switch back)
    // Parent state is not clobbered back to defaults by the remount.
    expect(parentState()['container-platform']).toBe('kubernetes');
  });

  it('hydrates from an existing parent blueprint instead of resetting to defaults', () => {
    render(
      <Harness initialCaps={{ 'container-platform': 'kubernetes', 'ai-platform': 'rhai' }} />
    );
    const state = parentState();
    expect(state['container-platform']).toBe('kubernetes');
    expect(state['ai-platform']).toBe('rhai');
  });
});
