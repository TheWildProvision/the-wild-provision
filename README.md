# The Wild Provision: Shopify theme

Custom Shopify Online Store 2.0 theme for **The Wild Provision**, premium single-ingredient dog chews.

Built on Shopify's [Skeleton theme](https://github.com/Shopify/skeleton-theme), with **Vite**, **Tailwind CSS v4** and **TypeScript** layered on top. Liquid stays exactly where Shopify expects it, and a local build compiles `src/` into `assets/theme.css` and `assets/theme.js`.

## Quick start

Requires Node ≥ 22.12, pnpm 12 and the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli).

```bash
pnpm install
pnpm dev      # watch + build assets, and run `shopify theme dev` (preview at http://127.0.0.1:9292)
pnpm check    # type-check, contrast check, Theme Check, production build: run before every commit
```

The first time, run `shopify theme dev --store your-store.myshopify.com` to log in and choose a store.

## Project layout

```
assets/ blocks/ config/ layout/ locales/ sections/ snippets/ templates/   ← Shopify theme (Liquid)
src/                                                                      ← Vite source (TS + Tailwind)
  main.ts            → assets/theme.js
  styles/            → assets/theme.css   (tokens.css = design tokens)
docs/                                                                     ← documentation
```

> `assets/theme.css` and `assets/theme.js` are **generated but committed**, because Shopify doesn't run a build. Edit `src/` instead.

## Documentation

| Doc                                    | What's in it                                                       |
| -------------------------------------- | ------------------------------------------------------------------ |
| [Design system](docs/DESIGN_SYSTEM.md) | Brand, colour, type, spacing, components, voice, accessibility     |
| [Architecture](docs/architecture.md)   | How Vite/Tailwind/TS fit with Liquid, CSS layers, JS patterns      |
| [Development](docs/development.md)     | Setup, scripts, config file reference, troubleshooting             |
| [Deployment](docs/deployment.md)       | GitHub integration vs. CLI, protecting editor customisations       |
| [AGENTS.md](AGENTS.md)                 | Rules for AI coding agents (also loaded by Claude via `CLAUDE.md`) |

## Licence

Proprietary: © The Wild Provision. All rights reserved.
Portions are derived from Shopify's Skeleton theme and remain subject to [its licence](LICENSE.md).
