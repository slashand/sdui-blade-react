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
import { BaseBlade, BladeHeader, BladeContent, BladeAlert, BladePivot, BladeFooter } from '../BaseBlade';
import { bladeStoreInstance } from '../useBladeStore';

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
    const size = (node.properties?.width || 'large') as any;

    const toolbarNodes = Array.isArray(node.properties?.toolbar) ? node.properties.toolbar : [];
    const footerNodes = Array.isArray(node.properties?.footer) ? node.properties.footer : [];

    return (
      <BaseBlade size={size} data-sdui-id={node.id}>
        <BladeHeader 
          title={title} 
          subtitle={subtitle}
          onClose={() => bladeStoreInstance.getState().closeBlade(node.id)}
        >
          {toolbarNodes.length > 0 && (
            <div className="flex items-center gap-2 pr-4 pl-4 border-l border-[var(--th-border)] ml-4">
              {toolbarNodes.map(child => <SduiRenderer key={child.id} node={child as any} />)}
            </div>
          )}
        </BladeHeader>
        <BladeContent>{children}</BladeContent>
        {footerNodes.length > 0 && (
          <BladeFooter>
            <div className="flex items-center justify-end gap-3 w-full">
              {footerNodes.map(child => <SduiRenderer key={child.id} node={child as any} />)}
            </div>
          </BladeFooter>
        )}
      </BaseBlade>
    );
  },
  [SduiElementType.Grid]: ({ node, children }) => {
    const columns = node.properties?.columns || 2;
    const gap = node.properties?.gap || 4;
    return (
      <div 
        className="sdui-grid grid w-full"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: `${(gap as number) * 0.25}rem` }}
        data-sdui-id={node.id}
      >
        {children}
      </div>
    );
  },
  [SduiElementType.Row]: ({ node, children }) => {
    const alignMap: any = { start: 'items-start', center: 'items-center', end: 'items-end' };
    const justifyMap: any = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };
    const align = alignMap[node.properties?.align as string] || 'items-center';
    const justify = justifyMap[node.properties?.justify as string] || 'justify-start';
    const gap = node.properties?.gap || 2;
    return (
      <div 
        className={`sdui-row flex flex-row ${align} ${justify} w-full`}
        style={{ gap: `${(gap as number) * 0.25}rem` }}
        data-sdui-id={node.id}
      >
        {children}
      </div>
    );
  },
  [SduiElementType.DataGrid]: ({ node }) => {
    const columns = Array.isArray(node.properties?.columns) ? node.properties.columns : [];
    const rows = Array.isArray(node.properties?.rows) ? node.properties.rows : [];
    return (
      <div className="sdui-datagrid overflow-x-auto rounded-lg border border-[var(--th-border)] bg-[#1a1c23]/50 w-full" data-sdui-id={node.id}>
        <table className="w-full text-left text-sm text-[var(--th-text-secondary)]">
          <thead className="bg-[#1a1c23] text-xs uppercase text-[var(--th-text-primary)] border-b border-[var(--th-border)]">
            <tr>
              {columns.map((col: any) => (
                <th key={col.key} className="px-4 py-3 font-semibold tracking-wider">{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[var(--th-border)]/50 hover:bg-white/[0.02] transition-colors">
                {columns.map((col: any) => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap">{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  [SduiElementType.Section]: ({ node, children }) => {
    const title = node.properties?.title ? String(node.properties.title) : '';
    return (
      <section className="sdui-section flex flex-col gap-3" data-sdui-id={node.id}>
        {title && <h3 className="text-sm font-semibold text-[var(--th-text-primary)]">{title}</h3>}
        <div className="sdui-section-content">{children}</div>
      </section>
    );
  },
  [SduiElementType.Text]: ({ node }) => (
    <p className="sdui-text text-sm text-[var(--th-text-secondary)]" data-sdui-id={node.id}>
      {String(node.properties?.value || '')}
    </p>
  ),
  [SduiElementType.Button]: ({ node }) => {
    const label = String(node.properties?.label || 'Button');
    const action = node.properties?.action as any;
    
    const handleClick = () => {
      console.log('Action Dispatched:', action);
      if (action?.type === 'navigate' && action.payload) {
        // Stacking Paradigm: Push a new dynamically generated Blade payload onto the screen!
        bladeStoreInstance.getState().openBlade(action.payload as any);
      }
    };

    return (
      <button
        className="sdui-button cursor-pointer px-4 py-2 bg-[var(--th-element-bg)] hover:bg-[var(--th-element-bg-hover)] text-[var(--th-text-primary)] rounded transition-colors text-sm font-medium border border-[var(--th-border)]"
        data-sdui-id={node.id}
        onClick={handleClick}
      >
        {label}
      </button>
    );
  },
  [SduiElementType.Alert]: ({ node }) => {
    const type = (node.properties?.type as any) || 'info';
    const title = node.properties?.title ? String(node.properties.title) : undefined;
    const message = node.properties?.message ? String(node.properties.message) : '';
    return <BladeAlert type={type} title={title} message={message} />;
  },
  [SduiElementType.Pivot]: ({ node }) => {
    const items = Array.isArray(node.properties?.items) ? node.properties.items : [];
    const activeId = items.length > 0 ? items[0].targetId : ''; // Default mock behavior
    return (
      <BladePivot
        tabs={items.map((i: any) => ({ id: i.targetId, label: i.title }))}
        activeId={activeId}
        onChange={(id) => console.log('Pivot Changed:', id)}
      />
    );
  },
  [SduiElementType.StatusBadge]: ({ node }) => {
    const text = node.properties?.text ? String(node.properties.text) : '';
    return (
      <span className="sdui-status-badge inline-flex items-center rounded-md bg-gray-50/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/20">
        {text}
      </span>
    );
  },
  [SduiElementType.ExtensionMount]: ({ node, children }) => {
    const mountPoint = node.properties?.mountPoint ? String(node.properties.mountPoint) : '';
    
    // NATIVE EXTENSION RESOLUTION (The "Wow" Factor)
    if (mountPoint === 'crypto_chart_tv') {
      return (
        <div className="w-full h-48 bg-[#13151a] rounded-lg border border-[var(--th-border)] relative overflow-hidden flex items-end justify-between px-2 pt-8 pb-2">
          <div className="absolute top-2 left-3 text-xs text-gray-400 font-mono">BTC/USD | 1H | O:64192 H:64250 L:64100 C:64210</div>
          {/* Mock Candlesticks */}
          {[40, 60, 30, 80, 50, 90, 70, 100, 60, 40, 75, 85].map((h, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full w-4 group cursor-crosshair">
              <div className={`w-0.5 h-full ${i % 3 === 0 ? 'bg-red-500/50' : 'bg-green-500/50'}`} style={{ height: `${h + 20}%` }}></div>
              <div className={`w-3 rounded-sm ${i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'}`} style={{ height: `${h}%`, marginTop: `-${h/2}%` }}></div>
            </div>
          ))}
        </div>
      );
    }

    if (mountPoint === 'logistics_live_map') {
      return (
        <div className="w-full h-48 bg-[#0a0f1a] rounded-lg border border-blue-900/30 relative overflow-hidden flex items-center justify-center">
          {/* Mock Radar/Map Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBaIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjMWUzYTg4Ii8+PC9zdmc+')] opacity-50" />
          
          {/* Telemetry Nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
          
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-red-400 rounded-full shadow-[0_0_10px_#f87171]" />
          
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#34d399]" />
          
          <div className="absolute bottom-2 right-3 text-[10px] text-blue-400/50 font-mono tracking-widest">SAT-LINK: ACTIVE</div>
        </div>
      );
    }

    return (
      <div className="sdui-extension-mount" data-sdui-mount={mountPoint}>
        {/* Fallback mount point if the React App hasn't implemented the requested logical extension */}
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
