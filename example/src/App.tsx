import { useState, useEffect } from 'react';
import { SduiParser } from '@slashand/sdui-blade-core';
import type { SduiBladeNode } from '@slashand/sdui-blade-core';
import { BladeHost, bladeStoreInstance } from '@slashand/sdui-blade-react';
import { CORE_PILLARS, generateProceduralPayload } from './OmniverseGallery';
import type { OmniverseApp } from './OmniverseGallery';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [showJson, setShowJson] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Monitor manual JSON input validation
  useEffect(() => {
    if (jsonInput) {
      try {
        const rawObj = JSON.parse(jsonInput);
        SduiParser.parseManifest(rawObj); // Strict schema enforcement
        setValidationError(null);
      } catch (err: any) {
        setValidationError(err.message);
      }
    } else {
      setValidationError(null);
    }
  }, [jsonInput]);

  const launchOmniverseApp = (app: OmniverseApp) => {
    try {
      const manifest = SduiParser.parseManifest(app.payload);
      setJsonInput(JSON.stringify(app.payload, null, 2));
      bladeStoreInstance.getState().setAppBlade(manifest.blade as SduiBladeNode);
    } catch (err: any) {
      alert(`[SDUI ENGINE FATAL] Payload syntactically invalid:\n\n${err.message}`);
    }
  };

  const handleApplyJson = () => {
    try {
      const rawObj = JSON.parse(jsonInput);
      const manifest = SduiParser.parseManifest(rawObj);
      bladeStoreInstance.getState().setAppBlade(manifest.blade as SduiBladeNode);
      setShowJson(false);
    } catch (err: any) {
      alert(`Invalid JSON Payload:\n\n${err.message}`);
    }
  };

  return (
    <div className="sdui-app-shell flex flex-col h-screen w-screen bg-[var(--bg)] text-[var(--text-h)] overflow-hidden font-sans">
      
      {/* GLOBAL HEADINGS */}
      <header className="sdui-global-header flex items-center h-14 shrink-0 bg-[var(--bg)] border-b border-[var(--border)] px-6 z-50 shadow-sm">
        <h1 className="sdui-brand-title text-[var(--text-h)] text-lg font-bold m-0 tracking-wide flex items-center gap-2">
          <span className="opacity-70 text-[var(--accent)]">sdui ::</span> Omniverse SDK Matrix
        </h1>
        <div className="sdui-header-actions ml-auto flex gap-4">
          <button 
            onClick={() => setShowJson(!showJson)} 
            className="sdui-toggle-json-button text-[var(--text)] hover:text-[var(--text-h)] text-[10px] cursor-pointer px-4 py-1.5 rounded border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] transition-all uppercase font-bold tracking-wider"
          >
            {showJson ? 'Close Payload Inspector' : 'Inspect Raw SduiManifest Array'}
          </button>
        </div>
      </header>

      {/* MATRIX WORK SURFACE */}
      <div className="sdui-body-container flex flex-1 overflow-hidden relative">
        <nav className="sdui-global-sidebar w-14 shrink-0 bg-[var(--code-bg)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-6 z-40">
          <div title="Pillar Applications" className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center cursor-pointer shadow-lg text-white text-xl">✨</div>
          <div title="Telemetry Metrics" className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-[var(--bg)] transition-colors text-xl grayscale opacity-30">📊</div>
        </nav>

        <main className="sdui-work-surface flex-1 relative overflow-y-auto bg-[var(--bg)] p-10">
           
           <div className="max-w-6xl mx-auto">
             <div className="mb-10 text-center">
               <h2 className="text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">SDUI Framework Orchestrator</h2>
               <p className="text-lg text-[var(--text)] max-w-2xl mx-auto">Select a structural application profile from the Omniverse below. The React engine will instantly construct the 100% strictly typed, enterprise-grade UX layer automatically via JSON interpretation.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* INFINITE PROCEDURAL GENERATOR TILE */}
                <div 
                  onClick={() => launchOmniverseApp(generateProceduralPayload())}
                  className="sdui-matrix-tile group relative overflow-hidden flex flex-col p-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 shadow-lg cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow">🌌</span>
                    <h3 className="text-xl font-bold text-[var(--text-h)] group-hover:text-[var(--accent)] transition-colors">Synthesize Infinite App</h3>
                  </div>
                  <p className="text-sm text-[var(--text)] leading-relaxed flex-1">
                    Execute a mathematical algorithm capable of generating thousands of unique layout structures. Prove the SduiRenderer recursion handles unimaginable complexity.
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--accent-border)]/30 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                    DISPATCH CHAOS ENGINE →
                  </div>
                </div>

                {/* DETERMINISTIC PILLAR APPS */}
                {CORE_PILLARS.map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => launchOmniverseApp(app)}
                    className="sdui-matrix-tile group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] hover:border-[var(--th-border-hover)] shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-[var(--border)]">{app.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold">{app.category}</span>
                        <h3 className="text-lg font-bold text-[var(--text-h)] leading-tight mt-0.5 group-hover:text-white transition-colors">{app.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text)] leading-relaxed flex-1">
                      {app.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors">
                      LOAD MANIFEST & MOUNT BLADE →
                    </div>
                  </div>
                ))}
             </div>
           </div>

           {/* BLADE ORCHESTRATION HOST MOUNTS IN ABSOLUTE OVERLAY */}
           <BladeHost />
        </main>

        {/* ABSOLUTE JSON EDITOR OVERLAY */}
        {showJson && (
          <aside className="sdui-json-editor-overlay absolute right-0 top-0 bottom-0 w-[550px] bg-[var(--code-bg)] border-l border-[var(--border)] z-[200] flex flex-col shadow-2xl transition-transform">
            <div className="sdui-json-header h-14 border-b border-[var(--border)] flex items-center px-6 justify-between bg-[var(--bg)]">
              <div className="flex flex-col">
                <h3 className="sdui-json-title text-sm font-bold tracking-wider uppercase text-[var(--text-h)] m-0">JSON AST Inspector</h3>
                <span className="text-[10px] text-[var(--text)] uppercase tracking-wide mt-0.5">Live Schema Mutator</span>
              </div>
              <button onClick={() => setShowJson(false)} className="sdui-json-close-button text-[var(--text)] hover:text-[var(--danger)] cursor-pointer p-2 text-2xl transition-colors">×</button>
            </div>
            
            {validationError && (
              <div className="sdui-json-error-banner bg-[var(--th-danger)]/10 border-l-4 border-[var(--th-danger)] p-4 text-xs font-mono">
                <strong className="sdui-json-error-label text-[var(--th-danger)] block mb-1 uppercase tracking-wider font-bold">STRICT VALIDATION ERROR:</strong> 
                <span className="text-red-200">{validationError}</span>
              </div>
            )}

            <div className="flex flex-1 relative bg-[#1e1e1e]">
              <textarea
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
