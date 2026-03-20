import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBladeStore, bladeStoreInstance } from './useBladeStore';
import { BladeRegistry } from './registry';

/**
 * The Root Container that mounts the progressive disclosure SDUI Blades.
 * Typically rendered at the top level of the application workspace.
 */
export function BladeHost() {
    const activeBlades = useBladeStore(state => state.activeBlades);
    
    // Core URL Syncing logic
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const bladesParam = params.get('blades') || '';
            const currentStateKeys = bladeStoreInstance.getState().activeBlades.map(b => b.type).join(',');

            if (bladesParam === currentStateKeys) {
                return;
            }

            if (bladesParam) {
                const keys = bladesParam.split(',');
                const currentActiveBlades = bladeStoreInstance.getState().activeBlades;
                
                bladeStoreInstance.setState({
                    activeBlades: keys.map((key, i) => {
                        const existingBlade = currentActiveBlades[i];
                        if (existingBlade && existingBlade.type === key) {
                            return existingBlade;
                        }
                        return {
                            id: `${key}-popstate-${Date.now()}-${i}`,
                            type: key,
                            props: {}
                        };
                    })
                });
            } else {
                bladeStoreInstance.setState({ activeBlades: [] });
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const prevBladesRef = useRef(activeBlades);
    useEffect(() => {
        const currentLength = activeBlades.length;
        const prevLength = prevBladesRef.current.length;
        const params = new URLSearchParams(window.location.search);
        const urlBlades = params.get('blades') || '';
        const stateBlades = activeBlades.map(b => b.type).join(',');

        if (urlBlades === stateBlades) {
            prevBladesRef.current = activeBlades;
            return;
        }

        if (activeBlades.length > 0) {
            params.set('blades', stateBlades);
        } else {
            params.delete('blades');
        }
        
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        
        if (currentLength > prevLength) {
            window.history.pushState({ isBlade: true }, '', newUrl);
        } else {
            window.history.replaceState({ isBlade: false }, '', newUrl);
        }

        prevBladesRef.current = activeBlades;
    }, [activeBlades]);

    return (
        <div className={`absolute inset-0 w-full h-full flex overflow-hidden z-[100] ${activeBlades.length > 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <AnimatePresence>
                {activeBlades.map((blade, index) => {
                    const isBaseBlade = index === 0;
                    const ResolvedComponent = BladeRegistry.resolve(blade.type);

                    if (!ResolvedComponent) {
                        console.warn(`[SDUI Blade Engine] No React component registered for JSON type: '${blade.type}'`);
                        return null;
                    }

                    return (
                        <motion.div
                            key={blade.id}
                            className="absolute inset-0 flex flex-col pointer-events-none"
                            style={{ zIndex: 10 + index }}
                            initial={{ x: "100%", opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0.5 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className={`flex-1 overflow-auto no-scrollbar relative z-0 pointer-events-auto flex flex-col ${isBaseBlade ? '[&>*]:!w-full [&>*]:!max-w-none [&>*]:!ml-0 [&>*]:!border-l-0 [&>*]:!rounded-none' : ''}`}>
                                <ResolvedComponent node={blade} />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
