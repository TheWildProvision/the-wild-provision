# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, …) working in this repository. Humans should start with [README.md](README.md).

> 🚨 **MANDATORY:** call `learn_shopify_api` once when working with Liquid themes. Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work. If it's missing, install it in the agent host per that page (or `npx skills add Shopify/shopify-ai-toolkit --list` for skill-compatible hosts).

## Project

A custom Shopify Online Store 2.0 theme for **The Wild Provision**, which sells premium single-ingredient dog chews. It started from Shopify's Skeleton theme (`shopify theme init`).

**Stack:** Liquid (Shopify) · Tailwind CSS v4 · TypeScript · Vite · pnpm

## Commands

| Command               | What it does                                                             |
| --------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`            | Build once, then watch `src/` + Liquid **and** run `shopify theme dev`    |
| `pnpm build`          | Compile `src/` → `assets/theme.css` + `assets/theme.js`                  |
| `pnpm typecheck`      | TypeScript type-check (no emit)                                          |
| `pnpm check:contrast` | Verify every design-token colour pairing against WCAG 2.2                |
| `pnpm theme:check`    | Lint Liquid/JSON with Theme Check                                        |
| `pnpm check`          | All four above. **Must pass before you say a task is done.**             |

Use `pnpm`, never `npm`/`yarn` (enforced via `devEngines`).

## Repository map

```
assets/  blocks/  config/  layout/  locales/  sections/  snippets/  templates/
    └─ Shopify theme folders. Structure is mandated by Shopify: don't rename,
       move, or add sub-folders (only templates/customers/ is allowed).
src/                 Source for the Vite bundle
  main.ts            Entry → assets/theme.js (+ theme.css)
  styles/tokens.css  Design tokens (Tailwind @theme). Single source of truth.
  styles/base.css    Element defaults + Shopify section grid (@layer base)
  styles/main.css    Tailwind entry, @source list
  components/        Custom elements (TypeScript)
  utils/             Shared TS helpers
scripts/             Dev tooling (check-contrast.mjs). Never uploaded to Shopify
docs/                Human + agent documentation (see below)
```

## Rules

1. **Never edit `assets/theme.css` or `assets/theme.js`.** They're generated. Edit `src/`, run `pnpm build`, and commit the regenerated files with your change (Shopify doesn't build; see [docs/deployment.md](docs/deployment.md)).
2. **Style with Tailwind utilities backed by design tokens.** Use `bg-surface`, `text-fg`, `text-display-lg`, `px-gutter`, etc. from `src/styles/tokens.css`. Colour comes only from semantic tokens and `scheme-*` classes (the raw palette is deliberately not a utility). No raw hex values, and no arbitrary values (`mt-[13px]`) when a token or scale step exists. Tailwind's default colour palette is intentionally removed.
3. **Class names must be complete strings.** Never build them dynamically (`text-{{ color }}`). Map settings to full class names. Details: [docs/architecture.md](docs/architecture.md#using-tailwind-in-liquid).
4. **Custom CSS goes in a cascade layer.** Wrap any `{% stylesheet %}` / `{% style %}` CSS in `@layer components { … }`. Unlayered CSS silently overrides Tailwind utilities. See [docs/architecture.md](docs/architecture.md#css-cascade-layers).
5. **Design changes follow the design system.** Read [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) before building UI. If you add or change a token, update both `tokens.css` and `DESIGN_SYSTEM.md`.
6. **Design tokens are code-owned.** Don't add colour/font/spacing settings to `config/settings_schema.json`. Theme editor settings are for content and layout choices only.
7. **All user-facing text is translated.** Storefront text goes in `locales/en.default.json` via `{{ 'key' | t }}`. Editor labels go in `locales/en.default.schema.json` via `"t:key"`. Use sentence case.
8. **LiquidDoc** (`{% doc %}`) is required on every snippet and on any block rendered statically via `content_for 'block'`.
9. **Treat `config/settings_data.json` and `templates/*.json` as shared with the theme editor.** The merchant edits them in the Shopify admin too, so make minimal, deliberate changes.
10. **JavaScript lives in `src/`** as TypeScript custom elements, not in `{% javascript %}` tags (they can't be typed or bundled).

## Reference docs (read on demand)

| Doc                                                                        | Read when                                                  |
| -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)                             | Building or changing any UI                                |
| [docs/architecture.md](docs/architecture.md)                               | Touching the build, CSS layers, JS, or theme structure     |
| [docs/development.md](docs/development.md)                                 | Setting up, running scripts, changing config files         |
| [docs/deployment.md](docs/deployment.md)                                   | Anything involving pushing/publishing the theme            |
| [docs/ai/shopify-liquid-reference.md](docs/ai/shopify-liquid-reference.md) | Writing Liquid, schemas, blocks, sections, or locale files |
