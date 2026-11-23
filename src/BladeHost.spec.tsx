import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BladeHost } from './BladeHost.js';
import { BladeRegistry } from './registry.js';
import { bladeStoreInstance } from './useBladeStore.js';
import { SduiElementType } from '@slashand/sdui-blade-core';

BladeRegistry.register(SduiElementType.Blade, () => <div className="backdrop-fixture">Blade content</div>);

afterEach(() => {
  cleanup();
  bladeStoreInstance.setState({ activeBlades: [] });
  window.history.replaceState({}, '', '/');
});

function openStack() {
  bladeStoreInstance.setState({
    activeBlades: ['parent', 'child'].map((identifier) => ({
      id: identifier,
      type: SduiElementType.Blade,
      properties: { title: identifier },
      children: [],
    })),
  });
}

describe('SDK backdrop defaults and consumer control', () => {
  it('defaults to clear, unblurred and non-dismissing', () => {
    openStack();
    const { container } = render(<BladeHost />);
    const overlay = container.querySelector('.sdui-blade-backdrop') as HTMLElement;
    expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(overlay.style.backdropFilter).toBe('blur(0px)');
    fireEvent.click(overlay);
    expect(bladeStoreInstance.getState().activeBlades).toHaveLength(2);
  });

  it('allows explicit dimming, blur and outside-click dismissal', () => {
    openStack();
    const { container } = render(<BladeHost backdrop={{ opacity: 0.4, blur: 6, closeOnClick: true }} />);
    const overlay = container.querySelector('.sdui-blade-backdrop') as HTMLElement;
    expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0.4)');
    expect(overlay.style.backdropFilter).toBe('blur(6px)');
    fireEvent.click(overlay);
    expect(bladeStoreInstance.getState().activeBlades).toHaveLength(1);
  });

  it('applies the host toggle to the first blade without replacing its content', () => {
    openStack();
    bladeStoreInstance.setState({ activeBlades: bladeStoreInstance.getState().activeBlades.slice(0, 1) });
    const { container, rerender } = render(<BladeHost backdrop={{ enabled: true, opacity: 0.36, blur: 3 }} />);
    const content = container.querySelector('.backdrop-fixture');
    expect(container.querySelector('.sdui-blade-backdrop')).not.toBeNull();
    rerender(<BladeHost backdrop={{ enabled: false, opacity: 0.36, blur: 3 }} />);
    expect(container.querySelector('.sdui-blade-backdrop')).toBeNull();
    rerender(<BladeHost backdrop={{ enabled: true, opacity: 0.36, blur: 3 }} />);
    expect(container.querySelector('.sdui-blade-backdrop')).not.toBeNull();
    expect(container.querySelector('.backdrop-fixture')).toBe(content);
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['parent']);
  });

  it('honors an explicit first-blade override and leaves an unconfigured root clear', () => {
    openStack();
    const root = bladeStoreInstance.getState().activeBlades[0];
    bladeStoreInstance.setState({ activeBlades: [root] });
    const { container, rerender } = render(<BladeHost />);
    expect(container.querySelector('.sdui-blade-backdrop')).toBeNull();
    act(() =>
      bladeStoreInstance.setState({
        activeBlades: [
          {
            ...root,
            properties: {
              ...root.properties,
              backdrop: { enabled: true, opacity: 0.2, blur: 0 },
            },
          },
        ],
      }),
    );
    rerender(<BladeHost backdrop={{ enabled: false, opacity: 0.7 }} />);
    const overlay = container.querySelector('.sdui-blade-backdrop') as HTMLElement;
    expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0.2)');
  });

  it('allows consumers to disable the backdrop entirely', () => {
    openStack();
    const { container } = render(<BladeHost backdrop={{ enabled: false }} />);
    expect(container.querySelector('.sdui-blade-backdrop')).toBeNull();
  });
});

describe('interrupted blade exits', () => {
  it('makes outgoing content inert and reverses a same-ID reopen without remounting', async () => {
    openStack();
    const child = bladeStoreInstance.getState().activeBlades[1];
    const { container } = render(<BladeHost />);
    const original = container.querySelector('[data-blade-id="child"]');
    act(() => bladeStoreInstance.getState().closeTopBlade());
    const exiting = original?.parentElement as HTMLElement;
    expect(exiting.inert).toBe(true);
    expect(exiting.getAttribute('aria-hidden')).toBe('true');
    act(() => bladeStoreInstance.getState().openBlade(child));
    expect(container.querySelector('[data-blade-id="child"]')).toBe(original);
    expect(exiting.inert).toBe(false);
    expect(exiting.hasAttribute('aria-hidden')).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(container.querySelector('[data-blade-id="child"]')).toBe(original);
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['parent', 'child']);
    act(() => bladeStoreInstance.getState().closeTopBlade());
    await waitFor(() => expect(container.querySelector('[data-blade-id="child"]')).toBeNull());
    expect(container.querySelector('[data-blade-id="parent"]')).not.toBeNull();
  });

  it('ignores an outgoing backdrop and keeps per-blade configuration ahead of host defaults', () => {
    openStack();
    const state = bladeStoreInstance.getState();
    state.activeBlades[1].properties.backdrop = { opacity: 0, blur: 0, closeOnClick: true };
    const { container } = render(<BladeHost backdrop={{ opacity: 0.7, blur: 8 }} />);
    const overlay = container.querySelector('.sdui-blade-backdrop') as HTMLElement;
    expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(overlay.style.backdropFilter).toBe('blur(0px)');
    act(() => bladeStoreInstance.getState().closeTopBlade());
    fireEvent.click(overlay);
    expect(bladeStoreInstance.getState().activeBlades.map((blade) => blade.id)).toEqual(['parent']);
  });
});
