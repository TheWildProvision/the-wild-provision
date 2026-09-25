# Deployment

## Why built assets are committed

Shopify doesn't run `pnpm build`. Whatever is in `assets/` is what the storefront serves. So `assets/theme.css` and `assets/theme.js` are **committed**. They're marked `linguist-generated` in `.gitattributes`, which collapses them in GitHub diffs.

Always run `pnpm check` before committing so the committed bundle matches `src/`.

## Option A: Shopify GitHub integration (recommended)

In the Shopify admin, go to **Online Store → Themes → Add theme → Connect from GitHub** and pick this repo and a branch (e.g. `main`).

- Shopify deploys the branch as-is on every push, so the committed assets matter.
- **It's two-way.** When someone customises the theme in the editor, Shopify commits the changes (mostly `config/settings_data.json` and `templates/*.json`) back to the branch. Always `git pull` before starting work to avoid conflicts.
- Use a separate branch (e.g. `staging`) connected to an unpublished theme for previews.

## Option B: Shopify CLI

```bash
pnpm check                                   # build + lint first
shopify theme push --unpublished             # new, unpublished theme for review
shopify theme push --theme <id>              # update an existing theme
shopify theme push --theme <id> --publish    # ⚠️ publishes to the live store
```

**Protect editor customisations.** Pushing overwrites `config/settings_data.json` and JSON templates with your local copies. To deploy code without clobbering what was configured in the admin:

```bash
shopify theme pull --theme <id> --only config/settings_data.json --only "templates/*.json"   # sync down first
# or
shopify theme push --theme <id> --ignore config/settings_data.json --ignore "templates/*.json"
```

## What gets uploaded

Shopify CLI syncs only the theme folders (`assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) plus a root `AGENTS.md`/`DESIGN.md`. `AGENTS.md` is excluded via `.shopifyignore`. `src/`, `docs/`, `node_modules/` and config files are never uploaded.

> Naming note: the design system lives at `docs/DESIGN_SYSTEM.md` on purpose. A root-level `DESIGN.md` would be uploaded to the store.

## Recommended next step: CI

Add a GitHub Actions workflow that runs `pnpm install && pnpm check` and then fails if `git diff --exit-code assets/` shows changes. That catches pushes where someone edited `src/` but forgot to rebuild.
