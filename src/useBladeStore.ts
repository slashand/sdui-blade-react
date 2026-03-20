import { useStore } from 'zustand';
import { StoreApi } from 'zustand/vanilla';
import { createSduiBladeStore, BladeState } from '@slashand/sdui-blade-core';

// Create the singleton instance of the vanilla core store
export const bladeStoreInstance: StoreApi<BladeState> = createSduiBladeStore();

/**
 * React hook binding for the framework-agnostic Blade System.
 */
export function useBladeStore(): BladeState;
export function useBladeStore<T>(selector: (state: BladeState) => T): T;
export function useBladeStore<T>(selector?: (state: BladeState) => T) {
    if (selector) {
        return useStore(bladeStoreInstance, selector);
    }
    return useStore(bladeStoreInstance);
}

/**
 * URL pushState / popState hydration logic
 * Can be called high up in the React tree (e.g. inside `<BladeHost>`).
 */
export function syncBladeUrlState() {
    // Utility to be implemented linking `bladeStoreInstance` with window.location
}
