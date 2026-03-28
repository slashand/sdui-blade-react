import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SduiRenderer } from './SduiRenderer';
import { SduiElementType, SduiNode } from '@slashand/sdui-blade-core';

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

    render(<SduiRenderer node={node} />);

    // Check if the title is correctly piped into BladeHeader and rendered
    expect(screen.getByText('User Profile Matrix')).toBeInTheDocument();
    expect(screen.getByText('View user details')).toBeInTheDocument();
    
    // Check if children mapped correctly
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });


});
