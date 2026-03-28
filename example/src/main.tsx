import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BladeRegistry, SduiRenderer } from '@slashand/sdui-blade-react'

// Register the generic SDUI Recursive Renderer to handle Blade JSON envelopes
BladeRegistry.register('Sdui.Container.Blade', SduiRenderer)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
