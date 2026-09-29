# The Wild Provision design system

Version 1.1.0. UK English throughout.

This is the reference for how the storefront looks and behaves. Every value here exists as a token in [`assets/critical.css`](../assets/critical.css). Change a token there and the whole theme follows. Nothing else in the theme hard-codes a colour, a font size or an inline style, and `node scripts/check-design-system.mjs` fails if anything does.

## Principles

1. **Quiet and material.** The palette is paper, ink and moss. Colour comes from photography, not from the interface. There is no accent colour.
2. **Four type sizes.** Hierarchy comes from typeface, case and space first, and from size last.
3. **Tokens, not values.** Components refer to colour roles and type tokens, never to raw hex codes or pixel sizes.
4. **Accessible by default.** WCAG 2.2 AA is the floor, not a goal.
5. **Content is data.** Names, links and facts come from Shopify (menus, collections, products, Brand settings, policies and locale files), never from markup.

## Where things live

| What                                   | Where                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tokens, base styles, shared components | `assets/critical.css`, loaded on every page                                                     |
| Component styles                       | The `{% stylesheet %}` tag of the section or snippet that renders the markup                    |
| Component behaviour                    | The `{% javascript %}` tag of the same file                                                     |
| Storefront copy                        | `locales/en.default.json`                                                                       |
| Theme editor labels                    | `locales/en.default.schema.json`                                                                |
| Checks                                 | `node scripts/check-design-system.mjs`, `node scripts/check-locales.mjs`, `shopify theme check` |

## Colour

### Palette

Palette tokens are only referenced by colour roles. Components never use them directly.

| Token                 | Value     | Purpose                                    |
| --------------------- | --------- | ------------------------------------------ |
| `--palette-paper`     | `#f3f0e7` | Page background, text on dark surfaces     |
| `--palette-panel`     | `#e8e5db` | Panel surface, empty media frames          |
| `--palette-ink`       | `#282a25` | Text, solid buttons                        |
| `--palette-stone`     | `#65675f` | Secondary text, control borders            |
| `--palette-line`      | `#cbc9bd` | Decorative rules                           |
| `--palette-moss`      | `#30372e` | Dark surface, button hover                 |
| `--palette-lichen`    | `#c2c2b9` | Secondary text and control borders on dark |
| `--palette-moss-line` | `#64685f` | Decorative rules on dark                   |
| `--palette-rust`      | `#8e3028` | Errors on light surfaces                   |
| `--palette-coral`     | `#f0a99f` | Errors on dark surfaces                    |

### Roles and surfaces

Components use roles only. A surface class re-maps the roles, so a component works on any surface without changes. The default surface is paper; add `.surface--panel` or `.surface--dark` to a section to switch it.

| Role                                      | Paper   | Panel   | Dark    | Minimum |
| ----------------------------------------- | ------- | ------- | ------- | ------- |
| `--color-text` on `--color-bg`            | 12.73:1 | 11.51:1 | 10.77:1 | 4.5:1   |
| `--color-text-muted` on `--color-bg`      | 5.04:1  | 4.55:1  | 6.84:1  | 4.5:1   |
| `--color-error` on `--color-bg`           | 7.08:1  | 6.40:1  | 6.36:1  | 4.5:1   |
| `--color-on-fill` on `--color-fill`       | 12.73:1 | 12.73:1 | 10.77:1 | 4.5:1   |
| `--color-on-fill` on `--color-fill-hover` | 10.77:1 | 10.77:1 | 9.73:1  | 4.5:1   |
| `--color-control` on `--color-bg`         | 5.04:1  | 4.55:1  | 6.84:1  | 3:1     |

Rules:

- `--color-rule` is for decorative dividers only. Anything a shopper must see to operate (field borders, chips, pagination, select boxes) uses `--color-control`, which meets 3:1 (WCAG 1.4.11).
- Never lower contrast with `opacity`. Use `--color-text-muted`.
- `--color-scrim` is the only translucent colour. It darkens the lower edge of full-bleed photography.
- `node scripts/check-design-system.mjs` recalculates every ratio above from the tokens.

## Typography

Two families, both installed on almost every device, so there are no web-font downloads:

- `--font-serif`: Georgia. Headings, card titles, the wordmark.
- `--font-sans`: Arial. Body copy, interface and labels.

### The four sizes

| Token            | Value                                       | Renders at | Leading | Tracking                | Used for                                                  |
| ---------------- | ------------------------------------------- | ---------- | ------- | ----------------------- | --------------------------------------------------------- |
| `--text-display` | `clamp(3rem, 2rem + 4.5cqi, 6rem)`          | 48–96px    | 1.04    | −0.04em                 | Every `h1`                                                |
| `--text-heading` | `clamp(1.875rem, 1.25rem + 2.2cqi, 3.5rem)` | 30–56px    | 1.12    | −0.03em                 | `h2`, statements, feature card titles, the mobile menu    |
| `--text-body`    | `0.9375rem`                                 | 15px       | 1.65    | 0                       | Reading text, product and accordion titles (set in serif) |
| `--text-small`   | `0.75rem`                                   | 12px       | 1.5     | 0, or 0.12em for labels | Navigation, buttons, prices, meta, labels, legal text     |

**Why 15px and 12px.** Arial's large x-height makes 15px read like 16px in most typefaces. The 15:12 step is a 1.25 ratio (a major third), which keeps body and interface text visibly distinct. Nothing in the theme is smaller than 12px.

**Why container units.** Display and heading scale with the width of their container (`cqi`), not the viewport. The same `--text-heading` token renders large in a full-width section and smaller in a three-column card, so the scale needs no extra sizes. A component that should size its headings by its own width declares `container-type: inline-size`. `.container` does this by default.

**Changing a size.** Edit the one token. Every heading, label or paragraph that uses it follows.

**The wordmark.** `--wordmark-size` is a logo size, not part of the type scale. It applies only to the shop name in the header when no Brand logo is uploaded. `--logo-width` sizes an uploaded logo.

### Type utilities

| Class                                                         | Effect                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `.text-display`, `.text-heading`, `.text-body`, `.text-small` | Apply a size role to any element, independent of its heading level                          |
| `.label`                                                      | Small, uppercase, regular weight, 0.12em tracking. Eyebrows, dates, badges, footer headings |
| `.serif`                                                      | Switch to the serif family                                                                  |
| `.text-muted`                                                 | Secondary text colour                                                                       |
| `.rte`                                                        | Vertical rhythm for merchant rich text                                                      |

Choose the heading level for the document outline and the size class for the look. For example, a product card title is an `h2` on a collection page and an `h3` under a section heading, and it is set in body-size serif in both.

## Space and layout

| Token                                                     | Value                                                                                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `--space-1` … `--space-8`                                 | 4, 8, 12, 16, 24, 32, 48, 64px                                                                                                    |
| `--space-section`                                         | `clamp(3.5rem, 7vw, 7rem)`: vertical padding of a section                                                                         |
| `--gutter`                                                | `clamp(1.25rem, 4.2vw, 4.5rem)`: page margin                                                                                      |
| `--container-max`                                         | 102.5rem (1640px)                                                                                                                 |
| `--measure` / `--measure-narrow`                          | 68ch / 40ch: the maximum line length for reading text and for short leads                                                         |
| `--control-height`                                        | 3.25rem (52px): buttons and fields                                                                                                |
| `--header-height` | 5.25rem, or 4.75rem below 800px: sticky header height, also the anchor scroll offset |
| `--target-min`                                            | 2.75rem (44px): height of header links, menu buttons, pagination and accordion summaries. No target anywhere is smaller than 24px |
| `--ratio-portrait` / `--ratio-landscape` | 4/5 products and article covers, 4/3 stories and collections |

Breakpoints are 480px, 800px and 1100px. Media queries can't read CSS variables, so use these three values only. Prefer intrinsic layouts (`auto-fit`, `minmax`, container units) to new breakpoints.

Corners are square everywhere. Borders are `--border-width` (1px).

## Motion

`--ease` with `--duration-fast` (0.2s) for colour and underline changes, and `--duration-slow` (0.65s) for image zoom on hover. `prefers-reduced-motion: reduce` removes all transitions and smooth scrolling.

## Components

Each component is listed with its home file and the rules that keep it consistent.

### Button (`critical.css`)

- `.button` is an outline button. `.button--solid` is the primary action; use one per view. `.button--full` spans its container.
- Text is `--text-small`, height `--control-height`. A trailing `.arrow` means "go somewhere"; leave it off for actions in place, such as Print.
- Disabled buttons drop to 50% opacity and keep their label. Sold-out products say so in the button.

### Links (`critical.css`)

- `.arrow-link`: an underlined small link with an arrow. Use it for "see more" links beside section headings.
- `.text-link`: an inline underlined link. Rich text links get the same style automatically.
- Link text names its destination. A link to a collection shows the collection's title, and a link to the blog shows the blog's title.

### Label (`critical.css`)

- `.label` marks eyebrows, dates and badges. An eyebrow is four words at most. A full sentence belongs in the lead paragraph instead.

### Forms (`critical.css`)

- `.form-field` wraps a visible `<label>` and a `.field`. Placeholders are hints, never labels.
- On error, the field gets `aria-invalid="true"` and `aria-describedby` pointing to the message. After a full-page submit, focus moves to the error or success message.
- `.field-row` places fields side by side and wraps them automatically below 14rem each.

### Accordion (`critical.css`)

- A native `<details class="accordion">` with a `<summary>` and a `.accordion__content` body. Summaries are at least 44px tall.
- Used for product details (feeding guide, storage, delivery) and FAQs, where summaries are set in serif.

### Cards (`snippets/product-card.liquid`, `article-card.liquid`, `collection-card.liquid`)

- A card is a list item with exactly one link: the title, stretched over the whole card with `.card__link`. Keyboard focus outlines the whole card.
- Images inside cards are decorative (`alt=""`) when the title already names the item. Product cards keep the collection in the URL so the product breadcrumb knows where the shopper came from.
- Grids are `<ul>` lists: `.product-grid`, `.journal-grid`, `.collection-grid`.

### Media (`critical.css`, `snippets/responsive-image.liquid`)

- `.media` is a frame with a panel background that crops its image to fill.
- Images are served from Shopify's CDN with a srcset. Alt text comes from the image in Content > Files. Missing images show a placeholder in the theme editor only; shoppers never see "replace this" content.

### Headings (`critical.css`)

- `.page-heading`: label, `h1`, lead. One per page.
- `.section-heading`: label, `h2`, lead, and optionally an `.arrow-link` aligned to the right.

### Navigation (`snippets/menu.liquid`, `sections/header.liquid`, `sections/footer.liquid`)

- All navigation comes from Shopify menus. The header defaults to `main-menu` and the footer to `footer`. Footer column headings use each menu's own title.
- The current page gets `aria-current="page"`. Its top-level parent is underlined.
- The header sticks to the top on a frosted surface (78% paper with a backdrop blur; solid paper where blur is unsupported).
- One `<nav>` serves every screen size. Below 800px it becomes a frosted drawer that slides in from the left over a dimmed page. It traps focus while open, closes with Escape, the ✕ or a tap outside, and stays readable without JavaScript.

### Price (`snippets/price.liquid`)

- The only place money is formatted, so the "Show currency code" setting applies everywhere. Sale prices announce "Sale price" and "Regular price" to screen readers.

### Smaller parts

- `.badge`: a label on a paper chip, e.g. "Sold out" on a card.
- `.empty-state`: a centred heading, text and one action.
- `.editor-note`: a dashed note shown only in the theme editor (`request.design_mode`).
- Breadcrumb (`snippets/breadcrumb.liquid`), pagination (`snippets/pagination.liquid`), newsletter form (`snippets/newsletter-form.liquid`).

## Content rules

- Sentence case for everything, including buttons and headings. UK spelling.
- One name per thing, taken from Shopify. The full range is "All provisions": that is the title of the `all` collection, and every link to it shows that title. The home page's feature list links to "Featured provisions".
- Shop name, logo, slogan, description and social links come from Shopify admin > Settings > Brand.
- Dates use the `long_date` format (7 September 2026).
- Placeholder or instructional copy never reaches shoppers. Editor guidance uses `.editor-note`.

## Accessibility checklist (WCAG 2.2 AA)

| Criterion                          | How the system meets it                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1.1.1 Non-text content             | Alt text from Files; decorative images `alt=""`; icons `aria-hidden`                                         |
| 1.3.1 Info and relationships       | Lists for grids and menus, `<dl>` for product facts, labelled forms, landmark regions, one `h1` per page     |
| 1.4.3 Contrast (minimum)           | Every text role is at least 4.5:1 on every surface (checked by script)                                       |
| 1.4.4 Resize text                  | All sizes in rem, so they follow the browser's text size                                                     |
| 1.4.10 Reflow                      | Single-column layouts from 800px down; no horizontal scrolling at 320px                                      |
| 1.4.11 Non-text contrast           | Control borders and focus rings are at least 3:1                                                             |
| 1.4.12 Text spacing                | No fixed heights on text containers                                                                          |
| 2.1.1 Keyboard                     | Native links, buttons, `<details>` and forms; Escape closes menus                                            |
| 2.4.1 Bypass blocks                | Skip link to `#MainContent`                                                                                  |
| 2.4.4 Link purpose                 | One link per card; "Remove" links name their product                                                         |
| 2.4.7 Focus visible                | A 2px outline in the text colour, 3px offset, on every focusable element                                     |
| 2.5.8 Target size                  | Every target is at least 24px; header links, pagination and accordions are 44px                              |
| 3.2.2 On input                     | Changing a select never submits a form; sorting has an Apply button                                          |
| 3.3.1 / 3.3.3 Error identification | Errors in text, tied to fields, focused after submit                                                         |
| 4.1.2 Name, role, value            | `aria-expanded` on the menu button, `aria-pressed` on gallery thumbnails, `aria-current` on the current page |
| 4.1.3 Status messages              | Add to bag and newsletter results announced with `role="status"`                                             |

## Changelog

| Version | Date       | Change         |
| ------- | ---------- | -------------- |
| 1.0.0   | 2026-09-29 | First release. |
| 1.1.0 | 2026-09-29 | Sticky frosted header and `--header-height`; mobile menu becomes a frosted slide-in drawer; article covers framed at 4/5 instead of full-bleed; `--ratio-wide` removed. |
