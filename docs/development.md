# Development

## Prerequisites

| Tool                                                            | Version     | Notes                                                           |
| --------------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| [Node.js](https://nodejs.org)                                   | ≥ 22.12     | Required by Vite 8 (`engines` in `package.json`)                |
| [pnpm](https://pnpm.io)                                         | 12.6.0      | Pinned by `packageManager`/`devEngines`; npm and yarn are refused |
| [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)         | latest      | Installed globally; provides `shopify theme dev/check/push`     |
| VS Code extensions                                              | —           | Suggested automatically from `.vscode/extensions.json`          |

## First-time setup

```bash
pnpm install
shopify theme dev --store your-store.myshopify.com   # once, to log in and pick the store
```

After the first run the CLI remembers the store in `.shopify/` (git-ignored), so `pnpm dev` works from then on.

## Daily workflow

```bash
pnpm dev
```

This runs three things:

1. `pnpm build`, a clean one-off build, so the dev theme never starts with stale assets.
2. `dev:assets` (blue), which runs `vite build --watch` and rebuilds `assets/theme.css`/`theme.js` when anything in `src/` **or** any Liquid folder changes.
3. `dev:shopify` (green), which runs `shopify theme dev`. It uploads changed files (including the rebuilt assets) to a development theme and serves a hot-reloading preview at `http://127.0.0.1:9292`.

If either process exits, `concurrently --kill-others` stops the other.

Before committing, run:

```bash
pnpm check
```

This runs the type-check, the design-token contrast check, Theme Check and a production build. Commit the regenerated `assets/theme.*` together with your source change.

## Scripts

| Script             | Command                         | Purpose                                         |
| ------------------ | ------------------------------- | ----------------------------------------------- |
| `dev`              | build + `dev:assets` ∥ `dev:shopify` | Local development                          |
| `dev:assets`       | `vite build --watch`            | Rebuild the bundle on change                    |
| `dev:shopify`      | `shopify theme dev`             | Preview server + sync to a dev theme            |
| `build`            | `vite build`                    | Production build into `assets/`                 |
| `typecheck`        | `tsc --noEmit`                  | Type-check `src/` and `vite.config.ts`          |
| `check:contrast`   | `node scripts/check-contrast.mjs` | WCAG 2.2 contrast of every design-token pairing (`--markdown` for a table) |
| `theme:check`      | `shopify theme check`           | Lint Liquid, JSON schemas, translations         |
| `check`            | all of the above except dev     | Pre-commit / CI gate                            |

## Configuration reference

Most config files explain themselves in inline comments. JSON files that can't hold comments are described here.

| File                        | Purpose                                                           | Documented in            |
| --------------------------- | ----------------------------------------------------------------- | ------------------------ |
| `vite.config.ts`            | Bundle build: output names, `assets/` safety, Liquid watching     | Inline comments          |
| `tsconfig.json`             | Type-check only; strict options                                   | Inline comments          |
| `src/styles/main.css`       | Tailwind entry, which folders are scanned                         | Inline comments          |
| `src/styles/tokens.css`     | Design tokens                                                     | Inline + DESIGN_SYSTEM.md |
| `package.json`              | Scripts, pinned pnpm, Node engine. `private: true` blocks accidental npm publish. `UNLICENSED` = proprietary | This file |
| `.vscode/settings.json`     | Tailwind IntelliSense for Liquid, generated files read-only       | Inline comments          |
| `.vscode/extensions.json`   | Recommended extensions                                            | Inline comments          |
| `.shopifyignore`            | Files Shopify CLI must not sync                                   | Inline comments          |
| `.theme-check.yml`          | Theme Check rules (`theme-check:recommended`)                     | Inline comments          |
| `.gitignore`                | Includes `.shopify/` (local CLI state)                            | Inline comments          |
| `.gitattributes`            | Marks generated files so GitHub collapses them in diffs           | Inline comments          |
| `config/settings_schema.json` | Theme editor settings. Intentionally minimal (tokens are code-owned) | [architecture.md](architecture.md#theme-settings-vs-design-tokens) |
| `config/settings_data.json` | Setting values. **Written by the Shopify admin**, so edit with care | [deployment.md](deployment.md) |

## Troubleshooting

**A Tailwind class has no effect.**
1. Is the class name written out in full? Dynamic names like `bg-{{ x }}` are never generated. See [architecture.md](architecture.md#using-tailwind-in-liquid).
2. Is it a token that exists? The default palette (`bg-red-500`, etc.) and the default text/radius/shadow scales are removed on purpose. Check `src/styles/tokens.css`.
3. Is unlayered CSS overriding it? Look for `{% stylesheet %}` CSS not wrapped in `@layer components`.
4. Did you delete a file during `pnpm dev`? Deletions don't trigger a rebuild. Save any Liquid file or run `pnpm build`.

**`pnpm check:contrast` fails.** A colour token change dropped a pairing below its WCAG minimum. The message names the scheme, the pairing and the ratio it needs. Adjust the palette value (darker on light schemes, lighter on `scheme-moss`), never the threshold. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#changing-a-token).

**`npm ERR! EBADDEVENGINES`.** Use `pnpm`. npm is blocked on purpose.

**VS Code flags `@theme` / `@source` as unknown at-rules.** Install the recommended Tailwind CSS IntelliSense extension.
