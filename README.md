# 🌌 @slashand/sdui-blade-react

[![npm version](https://img.shields.io/npm/v/@slashand/sdui-blade-react.svg?style=flat-square)](https://npmjs.org/package/@slashand/sdui-blade-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> The React Synthesizer for the Agnostic Blade System. It consumes the abstract Constellation Map and manifests it into interactive, high-fidelity DOM nodes in real-time.

## 📖 Table of Contents
- [The Glass Brain](#the-glass-brain)
- [Core Capabilities](#core-capabilities)
- [Installation](#installation)
- [Quickstart Usage](#quickstart-usage)
- [Contributing](#contributing)
- [License](#license)

## 🧠 The Glass Brain
If the SDUI Core is the nervous system, `@slashand/sdui-blade-react` is the muscle. It takes the cold, mathematical JSON architecture calculated by the backend and breathes React into it. Utilizing advanced `framer-motion` kinematics for deeply integrated micro-animations, and `tailwind-merge` with `clsx` for deterministic styling collision resolution, it guarantees that dynamically ingested interfaces look and feel tactile.

## ✨ Core Capabilities
- **Zero-Friction Rendering Pipeline**: Uses the `zustand` core store map to surgically hydrate React components out of thin air via an injected component registry.
- **CSS-First Theme Compliance**: Forces components to strictly utilize your pre-configured CSS Variable tokens, preserving global styling control regardless of the backend payload.
- **Dynamic Prop Bridging**: Transparently converts generic JSON attributes into executable React callbacks, `typeof` verifications, and event handlers.

## 📦 Installation

```bash
npm install @slashand/sdui-blade-react @slashand/sdui-blade-core
```
*Required Peer Dependencies:* `react`, `react-dom`, `zustand`

## 🚀 Quickstart Usage

```tsx
import { BladeHost } from '@slashand/sdui-blade-react';
import { createBladeStore } from '@slashand/sdui-blade-core';

// 1. Initialize the core agnostic state machine
const store = createBladeStore({
  initialState: {
    bladeId: "ContentGenerationMatrix",
    presentation: { width: "fullscreen", title: "The Matrix Engine" },
    elements: [
      { id: "prompt", type: "TextField", label: "Enter Directive" },
      { id: "invoke", type: "BladeInvokeControl", target: "ParameterBlade" }
    ]
  }
});

// 2. Render the Glass Shell
export default function App() {
  return (
    <div className="blade-shell-container w-full h-full bg-zinc-950">
      <BladeHost store={store} />
    </div>
  );
}
```

## 🤝 Contributing
We welcome contributions to the Agnostic Blade System! 
1. Fork the project.
2. Create your feature branch (`git checkout -b feat/CosmicFeature`).
3. Commit your changes (`git commit -m 'feat: add CosmicFeature'`).
4. Push to the branch (`git push origin feat/CosmicFeature`).
5. Open a Pull Request.

## 🌟 Ecosystem Showcase
*Where can you see the Agnostic Blade System in action?*

- **Gravity English** (Coming Soon, March 2026) -> Educational Prompt-Orchestration Platform.
- **Coverlay Studio** (Coming Soon) -> Generative AI Non-Linear Video Editor.

*Live production applications utilizing these blades will be showcased here as their respective websites officially launch.*

## 🗺️ React Ecosystem Roadmap
Our specific trajectory for the React wrapper.

- [x] **Core Re-rendering via `useSyncExternalStore`**
- [ ] *React Server Components (RSC) Native Integration*
- [ ] *Next.js App Router API Streaming Support*
- [ ] *Framer Motion Micro-kinematics Expansion*

## 📜 License
Published under the [MIT License](LICENSE). Maintained by **Slashand Studio**.
