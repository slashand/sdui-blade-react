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

## Motion and focus

`BladeHost` clips its animated layers without making the host a scroll container.
Entering and exiting blades use a 320ms slide over the rendered panel width,
without spring overshoot; a reduced-motion preference removes the slide. Existing
parent components remain mounted. Closing layers become inert immediately. A
same-ID reopen reverses from its current position and cancels stale exit removal.
Keep application focus changes scroll-free with `element.focus({ preventScroll: true })`.
The demo restores focus using the active store identity, so an outgoing animation
cannot capture focus or consume a second Escape intended for its parent.

This follows the browser's [overflow clipping behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow),
[focus scrolling options](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)
and [Motion's reduced-motion guidance](https://motion.dev/docs/react-accessibility).

Earlier motion-only qualification, November 22, 2026 (`fix/stable-package-qualification`, baseline
`6ba72b5069164cf2b8ae9e0fd23360d9ea27b4b1`, with existing uncommitted package/demo work preserved):

- The running Chrome demo reproduced a 1,657px host scroll during entry. After the
  correction, child entry recorded zero host scrolling and zero parent movement.
- Chromium exercised all ten authored demos and five-level nesting at 320, 390,
  768 and 1440px, including Back/Forward and rapid Escape. All 72 measured entry/
  exit observations passed, across 2,330 sampled frames.
- Four additional desktop/phone journeys passed independent wheel scrolling,
  retained parent scroll and action state, close buttons and resizing, with normal
  and reduced motion. No page errors were observed.
- The three existing host tests and strict library/example TypeScript checks pass.
  These results qualify the local source; they do not claim a published package.

## Sizing and behavior examples

The local example gallery includes all six sizing examples: Full-Width (Default),
X-Large (1125px), Large (855px), Medium (585px), Small (315px) and Menu (265px).
The five behavior examples are Kitchen Sink (Scroll), Limited Scroll Block,
Journey Parallax Stack, Naked Decoupling and Footer Alignments. All open parsed
manifests through the same registered `BladeHost`; the application gallery remains
available above them. Both sections use the original responsive one/two/three-column
card layout. Nested examples retain their mounted parent inputs.

The SDK defaults `BaseBlade` and the standard JSON blade renderer to full work-area
width. Set `size="large"` or JSON `properties.width="large"` when an 855px panel is
required. All sizes shrink to the available work area on narrow screens.
`BladeFooter` supports `align="left"`, `"center"`, `"right"` (default) and `"between"`,
plus standard div styles/attributes. `BladeHost` accepts an optional
`parallaxOffset` in pixels, bounded to 0–120 and disabled by default. The journey
example enables 60px per background level; reduced motion suppresses that shift.

Gallery qualification, November 22, 2026, on the same local branch: all eleven
examples passed at 320, 390, 768 and 1440px (44 cases). Checks measured widths,
work-area boundaries and close controls, retained nested configuration, pinned
kitchen-sink controls, independent list scrolling, 60/120px journey offsets,
Back/Forward, custom content without SDK chrome, and every footer alignment.
Two targeted checks also passed reduced-motion parallax suppression and the
existing application renderer fallback. The earlier 72-observation motion sweep
was not repeated. Package build/native ESM exports, strict example types, all 12
focused primitive/host/renderer tests, and changed example lint/formatting pass.
This extension changes `src/BaseBlade.tsx`, `src/BladeHost.tsx`, the renderer and its
spec, adds `src/BaseBlade.spec.tsx`, adds the three `example/src/BladeExamples.ts`,
`ExampleBlades.tsx` and `BladeExamples.css` modules, wires `example/src/App.tsx` and
`main.tsx`, and updates this README. Other pre-existing working changes remain
preserved. Source is local and uncommitted; no package publication is claimed.

## Interrupted motion and theme correction — November 22, 2026

The React demo now includes the Angular demo's Dark Default, Neon Cyberpunk and
Light Minimal theme choices in the header and sidebar. Theme colors remain scoped
to the demo; the SDK still accepts consumer tokens. Data-grid surfaces now use
those tokens too, so Light theme headers remain readable. React gallery Git history did
not contain an earlier theme switcher. Application examples appear first, followed
by full-size sizing/behavior cards with 24px desktop padding.

An interrupted close previously left outgoing panels and backdrops interactive.
The host now makes those layers inert, cancels superseded exit completion, and
slides each panel over its own width. It does not queue or discard store actions.
Backdrop opacity, blur, enabled state and click dismissal remain developer options
on the host and individual blades; individual values override the host and the
SDK defaults stay clear, unblurred and non-dismissing.

Targeted Chromium qualification passed at 390 and 1440px with both normal and
reduced motion: 32 rapid pointer open/close cycles, same-ID reopen, interrupted
Back/Forward, retained parent input, and three theme choices per case. All 215
sampled frames kept the standard parent stationary and host scrolling at zero;
there were no browser errors. An additional 12 interrupted store close/reopen
cycles retained the final stack and limited the small-panel travel to 315px.
A final smoke check passed all six widths and the journey shift/return with retained
input. Gallery and open-blade Light theme screenshots were visually inspected via
Playwright after the regular Chrome screenshot request did not return.
The first browser assertion incorrectly sampled a deliberate root exit as parent
drift; the corrected rapid-child observation window passed. Earlier settled
animation checks are historical evidence, not qualification of interrupted input.

Package/native ESM build, example TypeScript/lint and 14 focused primitive, host
and renderer tests pass. Current correction scope: `src/BladeHost.tsx`,
`src/BladeHost.spec.tsx`, `example/src/App.tsx`, `example/src/App.css`,
`example/src/BladeExamples.css`, `example/src/index.css`,
`src/renderer/SduiRenderer.tsx` and this README, on
`fix/stable-package-qualification` at baseline `6ba72b5`. Existing unrelated
uncommitted files remain preserved. This is local source qualification; publication
and consuming applications have not been changed by this correction.

### First-blade backdrop correction — November 22, 2026

The earlier interrupted-motion qualification did not cover the demo backdrop
button on a single blade. Its label changed, but the host excluded every first
blade from backdrop rendering. The host now honors an explicit `enabled: true`
from either the host or blade on the first blade, matching the Angular contract.
Nested defaults, individual overrides, opacity, blur and dismissal remain intact.
An unconfigured first blade still has no backdrop.

After the correction, an isolated Chromium session used only real gallery,
options and backdrop buttons at 390 and 1440px: first blade and nested blade each
passed enabled → disabled → enabled; parent input and URLs were retained. Desktop
hit testing confirmed the backdrop sits above the gallery, and a backdrop click
preserved the non-dismissing blade. There were no page errors. No store mutation,
DOM injection, stylesheet injection or mocked browser state was used. The owner's
existing tab was inspected read-only before the correction, then left alone;
the existing Vite server was not stopped or restarted.

Seven host tests and the package/native ESM build pass. Prior unrelated checks
were not repeated. This correction changes only `src/BladeHost.tsx`,
`src/BladeHost.spec.tsx` and this README within the complete prepared branch scope
below. Final review confirms that the root condition preserves explicit per-blade
overrides and that toggling does not replace mounted content. Source remains
uncommitted; no package publication or consuming-application change is claimed.

## Package version correction — November 22, 2026

The package and root lockfile retain `1.0.0`, matching the committed GitHub
baseline. The unintended local `1.0.2` increment has been removed. A read-only
check of the public npm registry confirms that stable `1.0.0` is not published;
this source correction performs no publication or npm tag change. Core and Svelte
versions and all dependency ranges remain unchanged. Validation compared both
parsed JSON files before/after: only the package's own version fields changed;
manifest and root lockfile versions agree with Git HEAD. Existing application
qualification is retained without repeating unchanged browser or unit tests.

### Prepared source-control handoff

Repository: `D:\dev\sdui-blade-react`; branch/push target:
`fix/stable-package-qualification` / `origin/fix/stable-package-qualification`;
baseline: `6ba72b5069164cf2b8ae9e0fd23360d9ea27b4b1`. The complete existing
branch scope is kept together: package exports, SDK geometry/motion and their
tests, followed by the integrated demo and documentation. No migration is required.
After an explicit owner commit instruction, execute only these Git operations,
stopping immediately on unexpected tracked changes, a failed hook/command or an
uncertain result. Preserve unrelated untracked files. Do not run development
checks or publish a package during the commit turn.

```powershell
git branch --show-current
git status --short --branch
git add -- package.json package-lock.json tsconfig.json scripts/check-package.mjs src/index.ts src/BaseBlade.tsx src/BaseBlade.spec.tsx src/BladeHost.tsx src/BladeHost.spec.tsx src/renderer/SduiRenderer.tsx src/renderer/SduiRenderer.spec.tsx
git diff --cached
git commit -m "fix: stabilize blade motion and package exports"
git add -- example/src/App.tsx example/src/App.css example/src/index.css example/src/main.tsx example/src/OmniverseGallery.ts example/src/BladeExamples.ts example/src/BladeExamples.css example/src/ExampleBlades.tsx example/vite.config.ts README.md
git diff --cached
git commit -m "feat: complete responsive blade demo and theme parity"
git push origin fix/stable-package-qualification
git status --short --branch
git log -2 --oneline
git ls-remote --heads origin fix/stable-package-qualification
```

Expected: the two stated commits, no remaining reviewed changes, and the remote
branch hash matching local HEAD. This handoff preserves the previously prepared
package/gallery work rather than committing an incomplete correction in isolation.
Final review found no remaining blocker in this source scope. Local qualification
is complete; owner commit/push and subsequent package release remain separate actions.

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
