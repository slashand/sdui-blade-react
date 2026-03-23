import { useState, useEffect } from 'react';
import { SduiRenderer } from '@slashand/sdui-blade-react';
import { SduiParser } from '@slashand/sdui-blade-core';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Microsoft Azure Management API Request over the wire
  useEffect(() => {
    fetch('/mock-blades/dashboard.json')
      .then(res => res.text())
      .then(text => {
        setJsonInput(text);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('[SDUI] Failed to resolve remote blade manifest', err);
        setIsLoading(false);
      });
  }, []);

  // Parse securely using the Core validation engine
  let activeTree = null;
  let validationError = null;
  
  if (!isLoading && jsonInput) {
    try {
      const rawObj = JSON.parse(jsonInput);
      activeTree = SduiParser.parseNode(rawObj);
    } catch (err: any) {
      activeTree = null;
      validationError = err.message;
    }
  }

  return (
    <div className="sdui-app-container" style={{ display: 'flex', gap: '2rem', padding: '2rem', boxSizing: 'border-box', minHeight: '100vh', background: '#000' }}>
      <div className="sdui-editor" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Constellation Matrix Planner</h3>
        <p style={{ color: '#888', marginBottom: '1rem' }}>Edit the raw JSON below to see the orchestrated UI react natively.</p>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          spellCheck={false}
          style={{ flex: 1, width: '100%', fontFamily: 'Consolas, monospace', padding: '1rem', background: '#1e1e1e', color: '#d4d4d4', border: '1px solid #333', borderRadius: '4px' }}
        />
      </div>
      
      <div className="sdui-preview" style={{ flex: 1.5, border: '1px solid #333', borderRadius: '4px', padding: '2rem', background: '#111', color: '#fff' }}>
        <h3 style={{ marginBottom: '2rem' }}>Journey Live Render</h3>
        
        {isLoading && <div style={{ color: '#888' }}>Fetching Remote Manifest...</div>}

        {validationError && (
          <div style={{ color: '#ef4444', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1rem', borderRadius: '4px' }}>
            <strong>Parser Failure:</strong> {validationError}
          </div>
        )}

        {activeTree && (
          <SduiRenderer node={activeTree} />
        )}
      </div>
    </div>
  );
}

export default App;
