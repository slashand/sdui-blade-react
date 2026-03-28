import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBladeStore, bladeStoreInstance } from './useBladeStore';
import { BladeRegistry } from './registry';

/**
 * The Root Container that mounts the progressive disclosure SDUI Blades.
 * Typically rendered at the top level of the application workspace.
 */
export function BladeHost() {
  const activeBlades = useBladeStore((state) => state.activeBlades);

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
          return cachedBlade || { id, type: 'Sdui.Container.Blade', properties: {}, children: [] } as any;
        });

        bladeStoreInstance.setState({ activeBlades: newBlades });
      } else {
        bladeStoreInstance.setState({ activeBlades: [] });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const prevBladesRef = useRef(activeBlades);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const currentLength = activeBlades.length;
    const prevLength = prevBladesRef.current.length;
    const params = new URLSearchParams(window.location.search);
    const urlBlades = params.get('blades') || '';
    
    // We now track EVERY blade in the array, explicitly maintaining absolute transparency
    const stateBlades = activeBlades.map((b) => b.id).join(',');

    if (urlBlades === stateBlades) {
      prevBladesRef.current = activeBlades;
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

    prevBladesRef.current = activeBlades;
  }, [activeBlades]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-[100] pointer-events-none">
      <AnimatePresence>
        {activeBlades.map((blade, index) => {
          const isBaseBlade = index === 0;
          const ResolvedComponent = BladeRegistry.resolve(blade.type);

          if (!ResolvedComponent) {
            console.warn(`[SDUI Blade Engine] No React component registered for JSON type: '${blade.type}'`);
            return null;
          }

          return (
            <React.Fragment key={blade.id}>
              {/* STACKING BACKDROP FOR UI LAYER VISIBILITY */}
              {!isBaseBlade && (
                <motion.div
                  className="absolute inset-0 bg-[#00000088] backdrop-blur-sm z-[0] pointer-events-auto"
                  style={{ zIndex: 9 + index }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => bladeStoreInstance.getState().closeTopBlade()}
                />
              )}

              <motion.div
                className={`absolute inset-0 pointer-events-none ${isBaseBlade ? 'bg-[var(--bg)] z-[90]' : ''}`}
                style={{ zIndex: isBaseBlade ? 90 : 100 + index }}
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className={`w-full h-full pointer-events-none [&>*]:pointer-events-auto ${isBaseBlade ? '[&>*]:!w-full [&>*]:!max-w-none [&>*]:!ml-0 [&>*]:!border-l-0 [&>*]:!rounded-none' : ''}`}>
                  <ResolvedComponent node={blade} />
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
