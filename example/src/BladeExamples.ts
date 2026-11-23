import { SduiElementType } from '@slashand/sdui-blade-core';
import type { SduiNode } from '@slashand/sdui-blade-core';

export type ExampleSize = 'full' | 'xlarge' | 'large' | 'medium' | 'small' | 'menu';
export interface ExampleCard {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  payload: { version: string; blade: SduiNode };
}

export const sizingExamples = {
  full: { name: 'Full-Width (Default)', description: 'Full work-area blade that preserves navigation.', next: 'large' },
  xlarge: { name: 'X-Large (1125px)', description: 'Wide workspace for detailed content.', next: 'large' },
  large: { name: 'Large (855px)', description: 'A spacious side panel.', next: 'medium' },
  medium: { name: 'Medium (585px)', description: 'Configuration with nested smaller blades.', next: 'small' },
  small: { name: 'Small (315px)', description: 'Compact secondary information.', next: 'menu' },
  menu: { name: 'Menu (265px)', description: 'Narrow contextual commands.', next: null },
} satisfies Record<ExampleSize, { name: string; description: string; next: ExampleSize | null }>;

export function isExampleSize(value: unknown): value is ExampleSize {
  return typeof value === 'string' && Object.hasOwn(sizingExamples, value);
}

export function createSizingBlade(size: ExampleSize): SduiNode {
  return {
    id: `demo-blade-${size}`,
    type: SduiElementType.Blade,
    properties: {
      title: sizingExamples[size].name,
      exampleKind: 'sizing',
      ...(size === 'full' ? {} : { width: size }),
    },
    children: [],
  };
}

export function createJourneyBlade(depth: number, size: ExampleSize): SduiNode {
  return {
    id: `demo-journey-${depth}-${size}`,
    type: SduiElementType.Blade,
    properties: { title: `Journey level ${depth}`, exampleKind: 'journey', depth, width: size },
    children: [],
  };
}

export const BLADE_EXAMPLES: ExampleCard[] = [
  ...(Object.keys(sizingExamples) as ExampleSize[]).map((size) => ({
    id: `demo-blade-${size}`,
    name: sizingExamples[size].name,
    category: 'Sizing',
    description: sizingExamples[size].description,
    icon: '[]',
    payload: { version: '1.0', blade: createSizingBlade(size) },
  })),
  ...[
    {
      id: 'demo-kitchen-sink',
      name: 'Kitchen Sink (Scroll)',
      description: 'Scrollable content and fixed controls.',
      kind: 'kitchen',
      width: 'large',
    },
    {
      id: 'demo-limited-scroll',
      name: 'Limited Scroll Block',
      description: 'Independent content scrolling.',
      kind: 'limited',
      width: 'medium',
    },
    {
      id: 'demo-journey-1-xlarge',
      name: 'Journey Parallax Stack',
      description: 'Nested navigation through the real host.',
      kind: 'journey',
      width: 'xlarge',
    },
    {
      id: 'demo-naked',
      name: 'Naked Decoupling',
      description: 'Custom content within SDK geometry.',
      kind: 'naked',
      width: 'large',
    },
    {
      id: 'demo-footer',
      name: 'Footer Alignments',
      description: 'Explore footer action placement.',
      kind: 'footer',
      width: 'medium',
    },
  ].map((example) => ({
    id: example.id,
    name: example.name,
    category: 'Behavior',
    description: example.description,
    icon: '<>',
    payload: {
      version: '1.0',
      blade: {
        id: example.id,
        type: SduiElementType.Blade,
        properties: {
          title: example.name,
          exampleKind: example.kind,
          width: example.width,
          ...(example.kind === 'journey' ? { depth: 1 } : {}),
        },
        children: [],
      },
    },
  })),
];
