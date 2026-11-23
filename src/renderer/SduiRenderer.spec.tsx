import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SduiRenderer } from './SduiRenderer.js';
import { SduiElementType, SduiNode } from '@slashand/sdui-blade-core';
import { bladeStoreInstance } from '../useBladeStore.js';

describe('SduiRenderer', () => {
  it('should cleanly map SduiElementType.Blade to BaseBlade with title', () => {
    const node: SduiNode = {
      id: 'test-blade-1',
      type: SduiElementType.Blade,
      properties: {
        title: 'User Profile Matrix',
        subtitle: 'View user details',
      },
      children: [
        {
          id: 'child-text-1',
          type: SduiElementType.Text,
          properties: { value: 'Hello World' },
        },
      ],
    };

    const { container } = render(<SduiRenderer node={node} />);
    expect(container.querySelector('.sdui-base-blade-container')).toHaveStyle({ maxWidth: 'none' });

    // Check if the title is correctly piped into BladeHeader and rendered
    expect(screen.getByText('User Profile Matrix')).toBeInTheDocument();
    expect(screen.getByText('View user details')).toBeInTheDocument();

    // Check if children mapped correctly
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('emits a host action without closing the current blade', () => {
    const store = bladeStoreInstance.getState();
    store.closeAllBlades(true);
    store.openBlade({ id: 'active', type: SduiElementType.Blade, properties: { title: 'Active' } });
    const received: CustomEvent[] = [];
    const listener = (event: Event) => received.push(event as CustomEvent);
    document.addEventListener('sdui:action', listener);

    render(
      <SduiRenderer
        node={{ id: 'sync', type: SduiElementType.Button, properties: { label: 'Sync', action: { type: 'dispatch' } } }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sync' }));

    expect(received[0].detail).toEqual({ nodeId: 'sync', action: { type: 'dispatch' } });
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['active']);
    expect(screen.getByRole('status')).toHaveTextContent('blade remains open');
    document.removeEventListener('sdui:action', listener);
    bladeStoreInstance.getState().closeAllBlades(true);
  });

  it('navigates and closes only for the corresponding declared action', () => {
    bladeStoreInstance.getState().closeAllBlades(true);
    bladeStoreInstance
      .getState()
      .openBlade({ id: 'active', type: SduiElementType.Blade, properties: { title: 'Active' } });
    render(
      <>
        <SduiRenderer
          node={{
            id: 'next',
            type: SduiElementType.Button,
            properties: {
              label: 'Next',
              action: { type: 'navigate', payload: { id: 'child', type: SduiElementType.Blade, properties: {} } },
            },
          }}
        />
        <SduiRenderer
          node={{
            id: 'close',
            type: SduiElementType.Button,
            properties: { label: 'Close', action: { type: 'close' } },
          }}
        />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['active', 'child']);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['active']);
    bladeStoreInstance.getState().closeAllBlades(true);
  });
});
