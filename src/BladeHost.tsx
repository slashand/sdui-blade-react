import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, usePresence, useReducedMotion } from 'framer-motion';
import { useBladeStore, bladeStoreInstance } from './useBladeStore.js';
import type { SduiBladeNode } from '@slashand/sdui-blade-core';
import { BladeRegistry } from './registry.js';

export interface BladeBackdropConfig {
  blur?: number;
  closeOnClick?: boolean;
  enabled?: boolean;
  opacity?: number;
}

export interface BladeHostProps {
  backdrop?: BladeBackdropConfig;
  /** Optional per-level background shift in pixels (0–120); disabled by default. */
  parallaxOffset?: number;
}

function boundedBackdropValue(value: unknown, maximum: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;
}

/**
 * The Root Container that mounts the progressive disclosure SDUI Blades.
 * Typically rendered at the top level of the application workspace.
 */
export function BladeHost({ backdrop = {}, parallaxOffset = 0 }: BladeHostProps = {}) {
  const activeBlades = useBladeStore((state) => state.activeBlades);
  const reducedMotion = useReducedMotion();
  const stackOffset = Number.isFinite(parallaxOffset) ? Math.min(120, Math.max(0, parallaxOffset)) : 0;

  // Core URL Syncing logic
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const bladesParam = params.get('blades') || '';
      const currentActiveBlades = bladeStoreInstance.getState().activeBlades;
      const currentStateKeys = currentActiveBlades.map((b) => b.id).join(',');

      if (bladesParam === currentStateKeys) {
        return;
      }

      if (bladesParam) {
        const urlIds = bladesParam.split(',');
        const { payloadCache } = bladeStoreInstance.getState();
        const newBlades = urlIds.map((id) => {
          const cachedBlade = payloadCache[id];
          return cachedBlade || ({ id, type: 'Sdui.Container.Blade', properties: {}, children: [] } as any);
        });

        bladeStoreInstance.setState({ activeBlades: newBlades });
      } else {
        bladeStoreInstance.setState({ activeBlades: [] });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlBlades = params.get('blades') || '';

    // We now track EVERY blade in the array, explicitly maintaining absolute transparency
    const stateBlades = activeBlades.map((b) => b.id).join(',');

    if (urlBlades === stateBlades) {
      isFirstRender.current = false;
      return;
    }

    if (activeBlades.length > 0) {
      params.set('blades', stateBlades);
    } else {
      params.delete('blades');
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;

    // On the absolute first render sequence (e.g., Session Hydration), we replace the state quietly.
    // Every subsequent mutation driven by the user pushes an explicit history frame!
    if (isFirstRender.current) {
      window.history.replaceState({ isBlade: false }, '', newUrl);
      isFirstRender.current = false;
    } else {
      window.history.pushState({ isBlade: true }, '', newUrl);
    }
  }, [activeBlades]);

  return (
    <div
      className="sdui-blade-host absolute inset-0 w-full h-full z-[100] pointer-events-none"
      // A sliding focus target must not create a programmatically scrollable host.
      style={{ overflow: 'clip' }}
    >
      <AnimatePresence>
        {activeBlades.map((blade, index) => (
          <BladeLayer
            key={blade.id}
            blade={blade}
            index={index}
            isTop={index === activeBlades.length - 1}
            shift={reducedMotion ? 0 : -(activeBlades.length - index - 1) * stackOffset}
            reducedMotion={!!reducedMotion}
            backdrop={backdrop}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Keep interrupted exits mounted for motion, but remove them from interaction immediately. */
function BladeLayer({
  blade,
  index,
  isTop,
  shift,
  reducedMotion,
  backdrop,
}: {
  blade: SduiBladeNode;
  index: number;
  isTop: boolean;
  shift: number;
  reducedMotion: boolean;
  backdrop: BladeBackdropConfig;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const shell = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const initialReducedMotion = useRef(reducedMotion);
  const ResolvedComponent = BladeRegistry.resolve(blade.type);
  const config = {
    enabled: true,
    closeOnClick: false,
    opacity: 0,
    blur: 0,
    ...backdrop,
    ...(blade.properties?.backdrop as BladeBackdropConfig | undefined),
  };
  const rootBackdropRequested = backdrop.enabled === true || blade.properties?.backdrop?.enabled === true;
  const panelWidth = () =>
    content.current?.firstElementChild?.getBoundingClientRect().width ??
    shell.current?.getBoundingClientRect().width ??
    0;

  useLayoutEffect(() => {
    // Initialize before paint; an interrupted exit must retain its current offset.
    const width = content.current?.firstElementChild?.getBoundingClientRect().width;
    x.set(initialReducedMotion.current ? 0 : width || shell.current?.getBoundingClientRect().width || 0);
  }, [x]);

  useLayoutEffect(() => {
    if (shell.current) shell.current.inert = !isPresent;
  }, [isPresent]);

  useEffect(() => {
    const controls = animate(x, reducedMotion ? 0 : isPresent ? shift : panelWidth(), {
      type: 'tween',
      duration: reducedMotion ? 0 : 0.32,
      ease: [0.25, 0.1, 0.25, 1],
    });
    let cancelled = false;
    if (!isPresent)
      void controls.then(() => {
        if (!cancelled) safeToRemove?.();
      });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [x, isPresent, shift, reducedMotion, safeToRemove]);

  if (!ResolvedComponent) {
    console.warn(`[SDUI Blade Engine] No React component registered for JSON type: '${blade.type}'`);
    return null;
  }

  return (
    <div
      ref={shell}
      className="sdui-blade-presence absolute inset-0 pointer-events-none"
      data-presence={isPresent ? 'present' : 'exiting'}
      aria-hidden={isPresent ? undefined : true}
      style={{ zIndex: index === 0 ? 90 : 100 + index }}
    >
      {(index > 0 || rootBackdropRequested) && isTop && config.enabled && (
        <motion.div
          className="sdui-blade-backdrop absolute inset-0 pointer-events-auto"
          style={{
            backgroundColor: `rgb(0 0 0 / ${boundedBackdropValue(config.opacity, 1)})`,
            backdropFilter: `blur(${boundedBackdropValue(config.blur, 40)}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isPresent ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          onClick={() => {
            if (isPresent && config.closeOnClick) bladeStoreInstance.getState().closeBlade(blade.id);
          }}
        />
      )}
      <motion.div
        className="sdui-blade-layer absolute inset-0 pointer-events-none"
        data-blade-id={blade.id}
        style={{ x }}
      >
        <div ref={content} className="w-full h-full pointer-events-none [&>*]:pointer-events-auto">
          <ResolvedComponent node={blade} />
        </div>
      </motion.div>
    </div>
  );
}
