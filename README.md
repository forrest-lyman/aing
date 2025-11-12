# AING — AI + Angular Command Line

**AING** (pronounced “ayng”) is an experimental command-line interface for natural-language code generation in Angular projects.

It’s designed to bridge the gap between LLMs and framework CLIs, letting you type what you mean instead of memorizing flags.

> **Early Development Notice**  
> AING is a prototype. It’s not feature-complete, may break often, and currently only supports minimal generation flows.  
> Expect rapid iteration, breaking changes, and missing features while the core design stabilizes.

---

## Concept

AING treats every command you type as a prompt, parses it, and deterministically generates clean Angular code.  
It’s the first CLI designed for AI agents and humans alike.

### Example

```bash
npx aing create a user signin form
```

or the shorthand:

```bash
aing g component signup form
```

Both map to the same operation:

```json
{
  "action": "generate",
  "type": "component",
  "context": "user",
  "name": "signin-form"
}
```

and produce a file like:

```
src/app/components/user/signin-form.component.ts
```

---

## Status

| Feature | Status | Notes |
|----------|---------|-------|
| CLI argument parsing | Working | Fully functional, no Commander dependency |
| Planner → Executor pipeline | Working | Parses basic “generate” / “create” syntax |
| File generation | Working | Writes component/service stubs |
| Plugin system | In progress | Firebase will be first |
| Validation / testing | Planned | Will integrate lint and build validation |
| Natural-language understanding | Placeholder | Will later connect to an LLM planner |

---

## Goals

- No quotes, no friction. Type naturally:  
  `aing generate a service for products`.
- Deterministic output. Same input = same code.
- Plugin-based design. Angular core + Firebase + user-defined domains.
- AI-first architecture. Built for LLM planners and copilot tools.
- Pure ESM, pure TypeScript.

---

## Usage (current MVP)

```bash
# Run directly with tsx
npx tsx bin/aing.ts g service user

# or once published
npx aing create a user signin form
```

The generator currently creates:
```
src/app/services/user.service.ts
```

and logs actions to the console.

---

## Development Setup

```bash
git clone https://github.com/yourname/aing
cd aing
npm install
npm run build
npm link
```

Now test it:
```bash
aing g component signup form
```

---

## Roadmap

1. Minimal CLI + Planner + Executor
2. Plugin loader (`aing-firebase`, `aing-angular`)
3. Smart method scaffolding with TODOs
4. Validation and test runner integration
5. Context-aware AI planner (LLM-powered)

---

## Philosophy

> “Stop fixing prompts. Start defining specs.”

AING aims to make AI code generation predictable, reproducible, and spec-driven — a deterministic compiler for human-level intent.

---

## Disclaimer

This is early experimental software.  
Use it for exploration, not production.

Bugs, incomplete features, and unimplemented commands are expected.

Contributions and feedback are welcome as the foundation stabilizes.

---

© 2025 Forrest Lyman — MIT License
