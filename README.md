# The Wild Provision

The Shopify theme for The Wild Provision, a shop for single-ingredient dog chews. It's a Liquid theme with no build step: plain CSS tokens, per-component `{% stylesheet %}` and `{% javascript %}` tags, and no third-party libraries.

## Develop

Requires [Shopify CLI](https://shopify.dev/docs/api/shopify-cli).

```bash
shopify theme dev --store the-wild-provision.myshopify.com
```

The dev server syncs every change on disk to a development theme and serves it at http://127.0.0.1:9292. If you remove a section or setting, update any template JSON that references it first, because the sync rejects templates that point at something missing.

## Check

Run all three before pushing:

```bash
shopify theme check --path .
```

```bash
node scripts/check-design-system.mjs
```

```bash
node scripts/check-locales.mjs
```

- **Theme check:** Liquid, schema and performance rules.
- **Design system:** colour contrast on every surface, font sizes limited to the four type tokens, and no raw colours or inline styles.
- **Locales:** every translation key used is defined, and every defined key is used.

## Structure

```
assets/critical.css   Design tokens, base styles and shared components
docs/                 Design system reference
layout/               theme.liquid and password.liquid
locales/              Storefront copy (en.default.json) and editor labels (en.default.schema.json)
scripts/              Checks, runnable with Node and no dependencies
sections/             Page sections, each with its own styles, scripts and schema
snippets/             Shared parts: cards, price, menu, breadcrumb, image, forms
templates/            JSON templates for each page type
```

## Where content comes from

The theme hard-codes no names, links or facts. It reads them from Shopify:

| Content                                                | Shopify admin                                                                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo, slogan, short description, favicon, social links | Settings > Brand                                                                                                                                                  |
| Header and footer navigation                           | Content > Menus (`main-menu`, `footer`, plus an optional second footer menu)                                                                                      |
| Collection names and descriptions                      | Products > Collections. "All provisions" is the collection with the handle `all`                                                                                  |
| Product facts                                          | Product metafields `custom.ingredient`, `custom.origin`, `custom.processing`, `custom.feeding_guide`, `custom.storage_guide`; variant weight; category attributes |
| Policies                                               | Settings > Policies                                                                                                                                               |
| Storefront copy                                        | Online Store > Themes > Edit default theme content                                                                                                                |

## Design system

See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). Change design values only through the tokens in `assets/critical.css`.
