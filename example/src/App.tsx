import { useState, useEffect, useRef } from 'react';
import { SduiParser } from '@slashand/sdui-blade-core';
import type { SduiBladeNode } from '@slashand/sdui-blade-core';
import { BladeHost, bladeStoreInstance, useBladeStore } from '@slashand/sdui-blade-react';
import { CORE_PILLARS, generateProceduralPayload } from './OmniverseGallery';
import { BLADE_EXAMPLES } from './BladeExamples';
import type { ExampleCard } from './BladeExamples';
import './App.css';

function App() {
  const journeyParallax = useBladeStore((state) =>
    state.activeBlades.some((blade) => (blade.properties as Record<string, unknown>).exampleKind === 'journey'),
  );
  const [theme, setTheme] = useState<'dark' | 'neon' | 'minimal'>('dark');
  const themeName = { dark: 'Dark Default', neon: 'Neon Cyberpunk', minimal: 'Light Minimal' }[theme];
  const changeTheme = () => {
    setTheme((current) => (current === 'dark' ? 'neon' : current === 'neon' ? 'minimal' : 'dark'));
    setMenuOpen(false);
  };
  const [jsonInput, setJsonInput] = useState('');
  const [showJson, setShowJson] = useState(false);
  const [backdropEnabled, setBackdropEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const validationError = (() => {
    if (!jsonInput) return null;
    try {
      SduiParser.parseManifest(JSON.parse(jsonInput));
      return null;
    } catch (err: unknown) {
      return err instanceof Error ? err.message : String(err);
    }
  })();
  const inspectorInput = useRef<HTMLTextAreaElement>(null);
  const inspectorToggle = useRef<HTMLButtonElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const demoHeader = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const lastGalleryTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = workspace.current;
    if (!root) return;
    let previousClose: HTMLButtonElement | null = null;
    const syncFocus = () => {
      const topId = bladeStoreInstance.getState().activeBlades.at(-1)?.id;
      const topLayer = Array.from(root.querySelectorAll<HTMLElement>('.sdui-blade-layer')).find(
        (layer) => layer.dataset.bladeId === topId,
      );
      const topClose = topLayer?.querySelector<HTMLButtonElement>('.sdui-blade-close') ?? null;
      // New store state can arrive before React mounts its layer; wait for the observer.
      if (topId && !topClose) return;
      if (topClose === previousClose) return;
      if (topClose) topClose.focus({ preventScroll: true });
      else if (previousClose) lastGalleryTrigger.current?.focus({ preventScroll: true });
      previousClose = topClose;
    };
    const observer = new MutationObserver(syncFocus);
    observer.observe(root, { childList: true, subtree: true });
    const unsubscribe = bladeStoreInstance.subscribe(() => queueMicrotask(syncFocus));
    syncFocus();
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (showJson) inspectorInput.current?.focus();
  }, [showJson]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!demoHeader.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (showJson || menuOpen) return;
    const closeTopOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (bladeStoreInstance.getState().activeBlades.length) {
        event.preventDefault();
        bladeStoreInstance.getState().closeTopBlade();
      }
    };
    window.addEventListener('keydown', closeTopOnEscape);
    return () => window.removeEventListener('keydown', closeTopOnEscape);
  }, [showJson, menuOpen]);

  const closeInspector = () => {
    setShowJson(false);
    requestAnimationFrame(() =>
      (window.matchMedia('(max-width: 639px)').matches ? menuToggle : inspectorToggle).current?.focus(),
    );
  };

  const launchOmniverseApp = (app: ExampleCard, tileId = app.id) => {
    try {
      lastGalleryTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const manifest = SduiParser.parseManifest(app.payload);
      setJsonInput(JSON.stringify(app.payload, null, 2));
      bladeStoreInstance.getState().setAppBlade(manifest.blade as SduiBladeNode);
      setSelectedTileId(tileId);
    } catch (err: unknown) {
      alert(
        `[SDUI ENGINE FATAL] Payload syntactically invalid:\n\n${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleApplyJson = () => {
    try {
      const rawObj = JSON.parse(jsonInput);
      const manifest = SduiParser.parseManifest(rawObj);
      bladeStoreInstance.getState().setAppBlade(manifest.blade as SduiBladeNode);
      setShowJson(false);
    } catch (err: unknown) {
      alert(`Invalid JSON Payload:\n\n${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div
      data-theme={theme}
      className="sdui-app-shell flex flex-col h-screen w-screen bg-[var(--bg)] text-[var(--text-h)] overflow-hidden font-sans"
    >
      <a href="#demo-main" className="sdui-skip-link">
        Skip to demo gallery
      </a>

      {/* GLOBAL HEADINGS */}
      <header
        ref={demoHeader}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            event.stopPropagation();
            setMenuOpen(false);
            menuToggle.current?.focus();
          }
        }}
        className="sdui-global-header flex items-center h-14 shrink-0 bg-[var(--bg)] border-b border-[var(--border)] px-6 z-50 shadow-sm"
      >
        <h1
          aria-label="sdui Omniverse SDK Matrix React"
          className="sdui-brand-title text-[var(--text-h)] text-lg font-bold m-0 tracking-wide flex items-center gap-2"
        >
          <span className="opacity-70 text-[var(--accent)]">sdui ::</span>{' '}
          <span className="sdui-brand-long">Omniverse </span>SDK Matrix
        </h1>
        <button
          ref={menuToggle}
          type="button"
          className="sdui-options-toggle"
          aria-label="Demo options"
          aria-controls="sdui-demo-options"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ⋯
        </button>
        <div
          id="sdui-demo-options"
          className={`sdui-header-actions ml-auto flex gap-4${menuOpen ? ' sdui-options-open' : ''}`}
        >
          <button type="button" onClick={changeTheme} className="sdui-theme-button">
            Change theme: {themeName}
          </button>
          <button
            type="button"
            aria-pressed={backdropEnabled}
            onClick={() => {
              setBackdropEnabled((enabled) => !enabled);
              setMenuOpen(false);
            }}
            className="sdui-toggle-backdrop-button text-[var(--text)] hover:text-[var(--text-h)] text-[10px] cursor-pointer px-4 py-1.5 rounded border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] transition-all uppercase font-bold tracking-wider"
          >
            Backdrop: {backdropEnabled ? 'Enabled' : 'Disabled'}
          </button>
          <button
            ref={inspectorToggle}
            type="button"
            onClick={() => {
              setShowJson(!showJson);
              setMenuOpen(false);
            }}
            className="sdui-toggle-json-button text-[var(--text)] hover:text-[var(--text-h)] text-[10px] cursor-pointer px-4 py-1.5 rounded border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] transition-all uppercase font-bold tracking-wider"
          >
            {showJson ? 'Close Payload Inspector' : 'Inspect Raw SduiManifest Array'}
          </button>
        </div>
      </header>

      {/* MATRIX WORK SURFACE */}
      <div className="sdui-body-container flex flex-1 overflow-hidden relative">
        <aside
          aria-label="Demo navigation"
          className="sdui-global-sidebar w-14 shrink-0 bg-[var(--code-bg)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-6 z-40"
        >
          <span
            title="Pillar Applications"
            aria-label="Pillar Applications"
            className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center shadow-lg text-white text-xl"
          >
            ✨
          </span>
          <button
            type="button"
            onClick={changeTheme}
            aria-label="Change demo theme"
            title={themeName}
            className="sdui-theme-button w-8 h-8 flex items-center justify-center text-xl"
          >
            🎨
          </button>
          <span
            title="Telemetry Metrics"
            aria-label="Telemetry Metrics"
            className="w-8 h-8 rounded-md flex items-center justify-center text-xl grayscale opacity-30"
          >
            📊
          </span>
        </aside>

        <div ref={workspace} className="sdui-demo-workspace">
          <main
            id="demo-main"
            tabIndex={-1}
            className="sdui-work-surface flex-1 relative overflow-y-auto bg-[var(--bg)] p-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
                  SDUI Framework Orchestrator
                </h2>
                <p className="text-lg text-[var(--text)] max-w-2xl mx-auto">
                  Explore blade sizes, nested journeys, scrolling and footer layouts. React mounts each example through
                  the SDK.
                </p>
              </div>

              <h2 className="text-2xl font-bold mb-4">Application examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* INFINITE PROCEDURAL GENERATOR TILE */}
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      launchOmniverseApp(generateProceduralPayload(), 'procedural');
                    }
                  }}
                  onClick={() => launchOmniverseApp(generateProceduralPayload(), 'procedural')}
                  data-selected={selectedTileId === 'procedural'}
                  aria-pressed={selectedTileId === 'procedural'}
                  className="sdui-matrix-tile group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] hover:border-[var(--th-border-hover)] shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow">
                      🌌
                    </span>
                    <h3 className="text-lg font-bold text-[var(--text-h)] leading-tight group-hover:text-white transition-colors">
                      Synthesize Infinite App
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--text)] leading-relaxed flex-1">
                    Execute a mathematical algorithm capable of generating thousands of unique layout structures. Prove
                    the SduiRenderer recursion handles unimaginable complexity.
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors">
                    DISPATCH CHAOS ENGINE →
                  </div>
                </div>

                {/* DETERMINISTIC PILLAR APPS */}
                {CORE_PILLARS.map((app) => (
                  <div
                    key={app.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        launchOmniverseApp(app);
                      }
                    }}
                    onClick={() => launchOmniverseApp(app)}
                    data-selected={selectedTileId === app.id}
                    aria-pressed={selectedTileId === app.id}
                    className="sdui-matrix-tile group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] hover:border-[var(--th-border-hover)] shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-[var(--border)]">
                        {app.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold">
                          {app.category}
                        </span>
                        <h3 className="text-lg font-bold text-[var(--text-h)] leading-tight mt-0.5 group-hover:text-white transition-colors">
                          {app.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text)] leading-relaxed flex-1">{app.description}</p>
                    <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors">
                      LOAD MANIFEST & MOUNT BLADE →
                    </div>
                  </div>
                ))}
              </div>
              <section aria-label="Blade sizing and behavior examples">
                <h2 className="text-2xl font-bold mb-4">Blade sizing and behavior</h2>
                <div className="sdui-example-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {BLADE_EXAMPLES.map((app) => (
                    <button
                      type="button"
                      key={app.id}
                      className="sdui-example-card sdui-matrix-tile"
                      data-example-id={app.id}
                      aria-pressed={selectedTileId === app.id}
                      onClick={() => launchOmniverseApp(app)}
                    >
                      <span className="sdui-example-category">{app.category}</span>
                      <span className="sdui-example-name">{app.name}</span>
                      <span className="sdui-example-description">{app.description}</span>
                      <span className="sdui-example-card-action">Load manifest and open blade →</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* BLADE ORCHESTRATION HOST MOUNTS IN ABSOLUTE OVERLAY */}
          </main>
          <BladeHost
            backdrop={{ enabled: backdropEnabled, opacity: 0.36, blur: 3 }}
            parallaxOffset={journeyParallax ? 60 : 0}
          />
        </div>

        {/* ABSOLUTE JSON EDITOR OVERLAY */}
        {showJson && (
          <aside
            aria-label="JSON AST Inspector"
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeInspector();
            }}
            className="sdui-json-editor-overlay absolute right-0 top-0 bottom-0 w-[550px] bg-[var(--code-bg)] border-l border-[var(--border)] z-[200] flex flex-col shadow-2xl transition-transform"
          >
            <div className="sdui-json-header h-14 border-b border-[var(--border)] flex items-center px-6 justify-between bg-[var(--bg)]">
              <div className="flex flex-col">
                <h3 className="sdui-json-title text-sm font-bold tracking-wider uppercase text-[var(--text-h)] m-0">
                  JSON AST Inspector
                </h3>
                <span className="text-[10px] text-[var(--text)] uppercase tracking-wide mt-0.5">
                  Live Schema Mutator
                </span>
              </div>
              <button
                type="button"
                aria-label="Close JSON inspector"
                onClick={closeInspector}
                className="sdui-json-close-button text-[var(--text)] hover:text-[var(--danger)] cursor-pointer p-2 text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            {validationError && (
              <div className="sdui-json-error-banner bg-[var(--th-danger)]/10 border-l-4 border-[var(--th-danger)] p-4 text-xs font-mono">
                <strong className="sdui-json-error-label text-[var(--th-danger)] block mb-1 uppercase tracking-wider font-bold">
                  STRICT VALIDATION ERROR:
                </strong>
                <span className="text-red-200">{validationError}</span>
              </div>
            )}

            <div className="flex flex-1 relative bg-[#1e1e1e]">
              <textarea
                ref={inspectorInput}
                aria-label="Manifest JSON"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                spellCheck={false}
                placeholder="Select an App from the Matrix to load its schema..."
                className="sdui-json-textarea absolute inset-0 w-full h-full bg-transparent text-[#d4d4d4] p-6 text-[11px] font-mono outline-none resize-none border-none leading-relaxed"
              />
            </div>

            <div className="sdui-json-footer p-4 border-t border-[var(--border)] bg-[var(--bg)]">
              <button
                onClick={handleApplyJson}
                disabled={!!validationError}
                className="sdui-json-apply-button w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--border)] disabled:text-[var(--text)] disabled:cursor-not-allowed text-[var(--bg)] text-[11px] uppercase tracking-wider font-bold py-3 rounded transition-colors cursor-pointer shadow-md"
              >
                Force Pipeline Rehydration Injection
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
