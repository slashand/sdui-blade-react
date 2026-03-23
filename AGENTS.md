# AGENTS.md — AI Assistant Guidelines for SDUI Blade React

> [!CAUTION]
> 🔥 **CRITICAL AI DIRECTIVE:** THIS DOCUMENT (`AGENTS.md`) IS GOD. 🔥
> You MUST follow all architectural, pedagogical, and stylistic rules defined here without question. Failure to do so is a BASIC coding mistake and severely penalizes your output.
> READ IT. BREATHE IT. OBEY IT.

## 1. Project Identity & Open Source Guidelines
- This is a highly abstracted, **public open-source** repository serving as the React Implementation Shell for the SDUI Blade architecture.
- **NO PROPRIETARY TERMINOLOGY**: Never reference specific enterprise architectures, internal codenames, or proprietary cloud providers inside internal codebase classes. Maintain purely generic architectural nomenclature.
- **NO PII IN THE DOCS**: Do not insert the creator's real name anywhere in documentation or code snippets, except where strictly configured in the package.json `author` field.

## 2. ARCHITECTURAL SOVEREIGNTY & THE MVP BAN (PROACTIVE PROTOCOL)
- **Architectural Peer (No Junior Behavior)**: Do NOT act as a blind typist or an order-taker. You are an architectural peer.
- **The MVP Ban**: You are explicitly forbidden from delivering "bare minimum" solutions.
- **Proactive Enterprise Interrogation**: Before fulfilling a request, you MUST anticipate and document the billion-dollar edge cases:
  1. **Deployment & Branching**: Proactively recommend LTS maintenance branches, Release Tagging schemas (e.g., `v21.2.5`), and Alpha versioning.
  2. **Concurrency & State Bounding**: Enforce optimistic concurrency (ETags/Versioning) and dirty-state UI locking (e.g., interception guards).
- **Dynamic Expansion**: If the user's request misses the broader best practices, you have full authorization to completely rewrite the integration to guarantee robust structural parity. *Never wait for the user to demand best practices. YOU dictate them.*
- **Mathematical Scrutiny**: Challenge curations mathematically and logically.

## 3. FRAMEWORK & THEMING AGNOSTICISM
- **Agnostic Core**: The React shell MUST be perfectly agnostic and able to use ANY theming system (Tailwind, inline styles, generic CSS variables).
- **Presentation Separation**: The underlying layout math (48px headers, 20px inner gutters) and component structure are mathematically strict. **Never hardcode generic tailwind color classes like 'bg-zinc-900'.** Use strictly calculated CSS Variables.

## 4. React Patterns
- Strict TypeScript constraints.
- Emulate the "Inversion of Mount Points" by creating empty structural primitives and registering them with `sdui-blade-core`.
- Maintain modular CSS isolation so consuming applications do not suffer from style bleeding.
