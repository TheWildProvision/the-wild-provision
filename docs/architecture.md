# Architecture

How Vite, Tailwind CSS and TypeScript sit alongside a standard Shopify Liquid theme.

## The big picture

Shopify renders Liquid on its servers and serves everything in `assets/` from its CDN. **It never runs a build step.** So the toolchain runs on your machine (or in CI) and writes plain `.css`/`.js` files into `assets/`, where Shopify picks them up like any other asset.

```
 src/main.ts, src/styles/*.css ─────┐
                                    ├──▶  Vite + Tailwind  ──▶  assets/theme.css
 layout/  sections/  snippets/      │     (runs locally        assets/theme.js
 blocks/  templates/ ───────────────┘      or in CI)                  │
      │   (scanned for Tailwind class names)                          │
      │                                                               ▼
      └────────────────── shopify theme push / GitHub sync ──▶  Shopify renders Liquid
                                                                and serves assets/ from its CDN
```

- `layout/theme.liquid` and `layout/password.liquid` load `theme.css` and `theme.js` on every page via `asset_url`.
- `templates/gift_card.liquid` uses `{% layout none %}` and loads `theme.css` only.

## Directory layout

| Path                         | Owner   | Purpose                                                                  |
| ---------------------------- | ------- | ------------------------------------------------------------------------ |
| `assets/`                    | Shopify | Static files served by the CDN. **Contains generated `theme.css`/`theme.js`.** |
| `blocks/`                    | Shopify | Theme blocks, nestable and merchant-editable                            |
| `config/`                    | Shopify | `settings_schema.json` (editor settings), `settings_data.json` (values)  |
| `layout/`                    | Shopify | HTML shells (`<head>`, `<body>`)                                         |
| `locales/`                   | Shopify | Storefront (`*.json`) and editor (`*.schema.json`) translations          |
| `sections/`                  | Shopify | Full-width modules and section groups                                    |
| `snippets/`                  | Shopify | Reusable Liquid partials (`{% render %}`)                                |
| `templates/`                 | Shopify | JSON templates composing sections per page type                         |
| `src/main.ts`                | Vite    | Bundle entry; imports the stylesheet and components                      |
| `src/styles/main.css`        | Vite    | Tailwind entry and `@source` list                                        |
| `src/styles/tokens.css`      | Vite    | Design tokens (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md))                 |
| `src/styles/base.css`        | Vite    | Element defaults + section grid                                          |
| `src/components/`            | Vite    | Custom elements (TypeScript)                                             |
| `src/utils/`                 | Vite    | Shared TS helpers                                                        |
| `docs/`                      | —       | Documentation. `docs/ai/` holds agent reference material                |

Shopify folders **cannot** be renamed or nested (the only allowed sub-folder is `templates/customers/`). Only the theme folders plus a root `AGENTS.md`/`DESIGN.md` are ever uploaded by Shopify CLI. `src/`, `docs/` and config files stay local.

## Build pipeline

Configured in [`vite.config.ts`](../vite.config.ts) (commented inline).

- **Library mode** gives fixed file names (`theme.js`, `theme.css`) instead of hashed ones. Shopify's `asset_url` already appends a cache-busting `?v=` query, and fixed names mean Liquid never needs updating.
- **`emptyOutDir: false`** matters because `assets/` also holds hand-managed files (icons, images). Vite must not wipe it.
- **No dynamic `import()`.** It would emit extra chunk files into `assets/`. Keep one bundle.
- **No source maps.** Everything in `assets/` is public on the storefront.
- **Liquid watching.** `vite build --watch` only watches the JS import graph. The small `watchLiquid` plugin adds the Liquid folders so new Tailwind classes in `.liquid` files trigger a rebuild. One limitation: *deleting* a Liquid file doesn't trigger one. The unused CSS stays until the next rebuild (harmless), and `pnpm build` always produces a clean result.

## CSS

### Where CSS comes from

| Source                                 | Output                           | Use for                                          |
| -------------------------------------- | -------------------------------- | ------------------------------------------------ |
| Tailwind utilities in Liquid/TS        | `assets/theme.css`               | **Default. Almost all styling.**                 |
| `src/styles/base.css`                  | `assets/theme.css`               | Global element defaults, section grid            |
| `{% stylesheet %}` in section/block/snippet | Shopify-compiled stylesheet | Rare cases utilities can't express (complex selectors, `:has()`, keyframes) |
| `{% style %}` in Liquid                | Inline `<style>`                 | CSS that must contain Liquid values (e.g. `@font-face` with `asset_url`) |

### CSS cascade layers

Tailwind v4 emits its CSS in [cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer), in this order:

```
@layer theme, base, components, utilities;
         (lowest) ──────────────▶ (highest)
```

**Unlayered CSS beats every layer, whatever the specificity.** A bare `.card { margin: 0 }` in a `{% stylesheet %}` would silently override `class="card mt-8"`. The Skeleton theme's old `critical.css` did exactly this with `* { margin: 0 }`, which is why it was folded into `src/styles/base.css` inside `@layer base`.

Rule: **wrap all hand-written CSS in a layer.**

```liquid
{% stylesheet %}
  @layer components {
    .provision-label { … }
  }
{% endstylesheet %}
```

### Using Tailwind in Liquid

Tailwind scans the folders listed with `@source` in `src/styles/main.css` for complete class-name strings. It doesn't execute Liquid.

```liquid
{%- # ❌ Tailwind never sees "scheme-moss" or "scheme-linen" -%}
<div class="scheme-{{ section.settings.scheme }}">

{%- # ✅ Full class names appear in the source -%}
{%- liquid
  case section.settings.scheme
    when 'moss'
      assign scheme_class = 'scheme-moss'
    when 'linen'
      assign scheme_class = 'scheme-linen'
    else
      assign scheme_class = 'scheme-paper'
  endcase
-%}
<div class="full-width {{ scheme_class }}">
```

Because `sections/` and `blocks/` are scanned, full class names used as **`select` option values in a `{% schema %}`** also work:

```json
{ "type": "select", "id": "width", "options": [
  { "value": "max-w-reading", "label": "t:options.width.reading" },
  { "value": "max-w-page", "label": "t:options.width.page" }
]}
```

For **single-value settings** (a range, a colour), pass a CSS variable and use Tailwind's variable shorthand:

```liquid
<div class="grid gap-(--gap)" style="--gap: {{ block.settings.gap }}px">
```

### Design tokens as CSS variables

`tokens.css` uses `@theme static`, so every token is always available as a CSS variable (`var(--color-fg)`, `var(--spacing-gutter)`) in `{% stylesheet %}`, `{% style %}` and inline styles, even if no utility uses it.

Use the semantic `--color-*` variables: `scheme-*` classes remap them per section, so `var(--color-fg)` is dark ink on paper and light on `scheme-moss`. The raw `--palette-*` variables also exist, but they ignore schemes and skip the contrast guarantees. Keep them inside `tokens.css`.

### Section layout grid

Every `.shopify-section` is a three-column grid, `[gutter] [content ≤ page width] [gutter]`, defined in `base.css`. Direct children sit in the centre column. Add `full-width` to a child to bleed edge-to-edge. `var(--content-grid)` reproduces the same columns on an inner element.

## JavaScript

- Write TypeScript in `src/components/` as **[custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)** and import them from `src/main.ts`.
- Custom elements suit Shopify well. The theme editor re-renders sections by swapping HTML, and `connectedCallback`/`disconnectedCallback` run automatically on the new markup, so there's no manual re-initialising on `shopify:section:load`.
- `theme.js` is `type="module"`, so it's deferred and runs after the HTML is parsed.
- Avoid `{% javascript %}` tags. They can't be type-checked or bundled and don't run through Vite.

```ts
// src/components/quantity-input.ts
export class QuantityInput extends HTMLElement {
  connectedCallback() { /* … */ }
}
customElements.define("quantity-input", QuantityInput);

// src/main.ts
import "./components/quantity-input";
```

## Theme settings vs. design tokens

Design tokens (colour, type, spacing, radius) are **code-owned** in `src/styles/tokens.css`. The Skeleton theme's colour, font and page-width settings (and the `css-variables` snippet that output them) have been removed. `config/settings_schema.json` only holds `theme_info` for now. Add editor settings for **content and layout choices** (which menu, show/hide, alignment), not for brand values.

## Product data

Product metafields used by the theme (defined in the Shopify admin):

| Metafield           | Type        | Used for                                        |
| ------------------- | ----------- | ----------------------------------------------- |
| `custom.ingredient` | Single line | The single ingredient (e.g. "Water buffalo horn") |
| `custom.origin`     | Single line | Where it's sourced                              |
| `custom.processing` | Single line | How it's prepared (e.g. "Air-dried")            |

Plus Shopify's standard pet-supply category metafields (`shopify.pet-treat-type`, `shopify.pet-treat-texture`, etc.). These power the **specimen label** component in the design system.
