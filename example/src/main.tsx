import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ExampleBlade } from './ExampleBlades.tsx';

import { BladeRegistry } from '@slashand/sdui-blade-react';

// Register the generic SDUI Recursive Renderer to handle Blade JSON envelopes
BladeRegistry.register('Sdui.Container.Blade', ExampleBlade);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
