import React from 'react';
import { SduiBladeNode } from '@slashand/sdui-blade-core';

export type ComponentRegistryMap = Record<string, React.ComponentType<{ node: SduiBladeNode }>>;

/**
 * A singleton registry that binds JSON 'type' strings to lazy-loaded or synchronous React components.
 */
class SduiComponentRegistry {
  private registry: ComponentRegistryMap = {};

  register(type: string, component: React.ComponentType<{ node: SduiBladeNode }>) {
    this.registry[type] = component;
  }

  registerAll(map: ComponentRegistryMap) {
    this.registry = { ...this.registry, ...map };
  }

  resolve(type: string): React.ComponentType<{ node: SduiBladeNode }> | null {
    return this.registry[type] || null;
  }
}

export const BladeRegistry = new SduiComponentRegistry();
