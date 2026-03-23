/**
 * SYSTEM: @slashand/sdui-blade-react
 * FILE: src/renderer/SduiRenderer.tsx
 *
 * CORE RESPONSIBILITIES:
 * 1. Deeply Recursive Server-Driven React Component.
 * 2. Employs the "Inversion of Mount Points" pattern via a Component Registry.
 * 3. Transforms rigorous JSON typings into living DOM elements without hardcoded dependencies.
 *
 * DESIGN PATTERN: RECURSIVE COMPONENT FACTORY / REGISTRY
 */
import React, { useMemo } from 'react';
import { SduiNode, SduiElementType } from '@slashand/sdui-blade-core';

/**
 * The Dependency Inversion dictionary mapping SDUI JSON Node types string constants
 * heavily to strongly-typed React functional components.
 */
export interface SduiComponentRegistry {
  [key: string]: React.ComponentType<{ node: SduiNode; children?: React.ReactNode }>;
}

/**
 * A highly semantic, explicitly unstyled fallback registry.
 * Allows the orchestrator to successfully mount and visualize complex JSON
 * structures during rapid prototyping without requiring massive host app style layers.
 */
export const DefaultSduiRegistry: SduiComponentRegistry = {
  [SduiElementType.Blade]: ({ node, children }) => {
    const title = node.properties?.title ? String(node.properties.title) : '';
    const subtitle = node.properties?.subtitle ? String(node.properties.subtitle) : '';
    return (
      <div className="sdui-blade" data-sdui-id={node.id}>
        <header className="sdui-blade-header">
          <h2>{title}</h2>
          {subtitle && <span>{subtitle}</span>}
        </header>
        <div className="sdui-blade-content">{children}</div>
      </div>
    );
  },
  [SduiElementType.Section]: ({ node, children }) => {
    const title = node.properties?.title ? String(node.properties.title) : '';
    return (
      <section className="sdui-section" data-sdui-id={node.id}>
        {title && <h3>{title}</h3>}
        <div className="sdui-section-content">{children}</div>
      </section>
    );
  },
  [SduiElementType.Text]: ({ node }) => (
    <p className="sdui-text" data-sdui-id={node.id}>
      {String(node.properties?.value || '')}
    </p>
  ),
  [SduiElementType.Button]: ({ node }) => (
    <button
      className="sdui-button cursor-pointer"
      data-sdui-id={node.id}
      onClick={() => console.log('Mock Action Dispatched:', node.properties?.action)}
    >
      {String(node.properties?.label || 'Button')}
    </button>
  ),
  [SduiElementType.ExtensionMount]: ({ node, children }) => {
    const mountPoint = node.properties?.mountPoint ? String(node.properties.mountPoint) : '';
    return (
      <div className="sdui-extension-mount" data-sdui-mount={mountPoint}>
        {/* 
          This is an incredibly crucial Azure paradigm. 
          It allows an ignorant global shell to mount complex logic 
          (e.g., Billing Dashboard) exclusively when its specific JSON payload activates.
        */}
        {children}
      </div>
    );
  },
};

export interface SduiRendererProps {
  /** The isolated JSON tree node to instantly mount. */
  node: SduiNode;
  /** Custom Host App styling definitions preventing Core styling bleeds. */
  registry?: SduiComponentRegistry;
}

/**
 * The absolute Core of the React Matrix Matrix rendering engine.
 */
export const SduiRenderer: React.FC<SduiRendererProps> = ({ node, registry = DefaultSduiRegistry }) => {
  // Resolve the component mapped absolutely to this JSON node type
  const Component = registry[node.type];

  // If the dynamic registry explicitly fails to map this layout constraint
  if (!Component) {
    console.warn(
      `[SDUI Orchestrator] Fatal mapping warning: No Component strictly registered for type '${node.type}'.`,
    );
    return (
      <div className="sdui-unmapped-node text-red-500 border border-red-500 p-2" data-sdui-type={node.type}>
        ⚠️ Unmapped Renderer: {node.type}
      </div>
    );
  }

  // Deeply Map the immediate children
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const renderedChildren = useMemo(() => {
    if (!node.children || !Array.isArray(node.children)) return null;
    return node.children.map((childNode) => <SduiRenderer key={childNode.id} node={childNode} registry={registry} />);
  }, [node.children, registry]);

  return <Component node={node}>{renderedChildren}</Component>;
};
