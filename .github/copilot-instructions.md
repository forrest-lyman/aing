# Copilot Instructions for aing

## Project Overview
This is a CLI tool for generating Angular code using AI. It helps create components, pages, models, and services in an Angular project.

## Code Style Rules

### TypeScript/JavaScript
- **Always use ES modules** - Use `import`/`export`, never `require()` or CommonJS
- **Use modern Node.js APIs** - Prefix Node.js imports with `node:` (e.g., `import { readFileSync } from 'node:fs'`)
- **No inline requires** - Always import at the top of the file
- **Use strict typing** - Prefer explicit TypeScript types over `any`
- **Async/await** - Use modern async patterns, avoid callbacks

### Project Structure
- CLI entry point: `bin/aing.ts`
- Library code: `src/`
- Config files: `src/config/`
- Agents: `src/agents/`

### User Communication
- **Use chalk for colored output** - Style messages with appropriate colors (success: green, error: red, info: blue, warning: yellow)
- **Use ora for progress indicators** - Show spinners for long-running operations with descriptive text
- **Provide clear feedback** - Always inform the user what's happening during operations

### Angular Project Structure
When generating Angular code, assume this structure:
- Components: `src/app/components/`
- Pages: `src/app/pages/`
- Models: `src/app/models/`
- Services: `src/app/services/`

## Conventions
- Use descriptive variable names
- Keep functions focused and single-purpose
- Export interfaces and types for reusability
- Handle errors explicitly with meaningful messages
