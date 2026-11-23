import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BaseBlade, BladeFooter } from './BaseBlade.js';

afterEach(cleanup);

describe('blade sizing and footer presentation', () => {
  it('defaults to the full work area while preserving an explicit side-panel width', () => {
    const { container, rerender } = render(<BaseBlade>Content</BaseBlade>);
    expect(container.firstElementChild).toHaveStyle({ width: '100%', maxWidth: 'none' });
    rerender(<BaseBlade size="medium">Content</BaseBlade>);
    expect((container.firstElementChild as HTMLElement).style.maxWidth).toBe('var(--sdui-blade-w-medium, 585px)');
  });
  it.each([
    ['left', 'flex-start'],
    ['center', 'center'],
    ['right', 'flex-end'],
    ['between', 'space-between'],
  ] as const)('places footer actions at %s without changing their identity', (align, justification) => {
    const { container, rerender } = render(
      <BladeFooter>
        <button type="button">Apply</button>
      </BladeFooter>,
    );
    const action = container.querySelector('button');
    rerender(
      <BladeFooter align={align}>
        <button type="button">Apply</button>
      </BladeFooter>,
    );
    expect((container.firstElementChild as HTMLElement).style.justifyContent).toBe(justification);
    expect(container.querySelector('button')).toBe(action);
  });
  it('preserves consumer footer styles and does not reserve space for an empty footer', () => {
    const { container, rerender } = render(
      <BladeFooter align="left" className="custom-footer" style={{ justifyContent: 'space-around' }}>
        Action
      </BladeFooter>,
    );
    expect(container.firstElementChild).toHaveClass('custom-footer');
    expect((container.firstElementChild as HTMLElement).style.justifyContent).toBe('space-around');
    rerender(<BladeFooter />);
    expect(container.firstElementChild).toBeNull();
  });
});
