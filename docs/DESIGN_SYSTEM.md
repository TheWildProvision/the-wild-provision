# The Wild Provision design system

> **Version 1.0.0 (2026-09-25).** The blueprint for The Wild Provision storefront: the tokens, type, layout, components and copy rules every page is built from, so typography, buttons and styling stay consistent and sit together naturally. Build to it. When something is missing, extend the system here first, then build; never improvise a one-off in a template.
>
> **Source of truth:** [`src/styles/tokens.css`](../src/styles/tokens.css) defines _what_; this document explains _why_ and _how_. Change them together. `pnpm check:contrast` proves every colour pairing still meets WCAG.
>
> **Accessibility target:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA on every page, plus AAA wherever it costs nothing visually. Rules that come from a success criterion cite it inline as "SC x.x.x". The full map is in [§10](#10-accessibility-wcag-22).

## Contents

1. [Brand foundations](#1-brand-foundations)
2. [Colour](#2-colour)
3. [Typography](#3-typography)
4. [Spacing & layout](#4-spacing--layout)
5. [Shape, borders & elevation](#5-shape-borders--elevation)
6. [Wordmark, imagery & icons](#6-wordmark-imagery--icons)
7. [Motion](#7-motion)
8. [Components](#8-components)
9. [Voice & UI copy](#9-voice--ui-copy)
10. [Accessibility (WCAG 2.2)](#10-accessibility-wcag-22)
11. [Governance](#11-governance)

---

## 1. Brand foundations

**What we sell:** premium, single-ingredient dog chews ("provisions"). Each one is a single, whole, recognisable part, sourced with care and prepared as little as possible.

**The idea: field and specimen.** The brand looks like a naturalist's journal kept on an apothecary's shelf. Two kinds of image carry every page: the **field** (the pasture, coast and weather a provision comes from) and the **specimen** (the chew itself, close up, in its own form). Type splits the same way. A serif narrates like a field journal, and small uppercase labels record the facts like a specimen tag. Everything else is paper, moss and space.

### Personality

| We are                                     | We are not                                                    |
| ------------------------------------------ | ------------------------------------------------------------- |
| Editorial: image-led, spacious, considered | Advertorial: banners, badge clutter, countdown urgency        |
| Apothecary: precise, labelled, calm        | Clinical: sterile white, pharmacy blue                        |
| Natural: honest materials, real light      | Rustic: fake wood grain, kraft-paper clichés, distressed type |
| Quietly premium                            | Luxury-cold, gold foil, flashy                                |
| Warm and dog-literate                      | Cutesy: paw-print confetti, cartoon bones, "fur babies"       |

### Design principles

1. **In its own form.** Show the ingredient as it is. Nothing is drawn over the product itself. The one exception is a single status badge (Sold out, New, Sale) in the image's top-left corner, on a solid chip.
2. **Image and type, nothing else.** Pages are built from photography, typography, hairlines and space. No decorative illustration, patterns, textures or gradients, and **no accent colour**: the photographs carry the colour.
3. **Restraint is the premium.** Two typefaces, one weight each, four display sizes. When in doubt, remove.
4. **Facts are part of the beauty.** Ingredient, origin and weight are set like specimen labels: visible, real text, never buried in accordions.
5. **Accessible by construction.** Colours come in schemes that are verified against WCAG before they ship, so a component that is right once is right everywhere.

---

## 2. Colour

### How colour works

Colour has three layers. Components only ever touch the middle one.

```
 Palette (raw colours)        Semantic tokens (roles)          Schemes (per section)
 --palette-ink   #23241D ──▶  --color-fg       → text-fg   ──▶  .scheme-paper   (default)
 --palette-stone #63635B ──▶  --color-fg-muted → text-fg-muted  .scheme-linen   (panels)
 …                            …                                 .scheme-moss    (dark)
```

- **Palette** colours are deliberately _not_ Tailwind utilities (`bg-moss` doesn't exist).
- **Semantic tokens** are the only colour utilities: `bg-surface`, `text-fg`, `border-control` and so on.
- **Schemes** remap the semantic tokens for a section. Put `scheme-moss` on a band and everything inside it (text, hairlines, input borders, the focus ring) switches to dark-scheme values that are already verified.

Contrast is decided once, in `tokens.css`, and checked by `pnpm check:contrast` on every `pnpm check`.

### Palette

Olive-tinted neutrals, warm and slightly green, running from paper to moss. Paper, linen, ink and moss anchor the palette. The rest are derived in the same hue, each the lightest shade that still passes its WCAG minimum.

| Token   | Hex                   | Role                                           |
| ------- | --------------------- | ---------------------------------------------- |
| `bone`  | `#FAF8F5`             | Raised surfaces on light schemes               |
| `paper` | `#F3F0E8`             | **Page background**; text on moss              |
| `linen` | `#E9E6DB`             | Feature panels, alternate sections             |
| `flax`  | `#C5C3BB`             | Hairlines on light (decorative only)           |
| `taupe` | `#7F7E76`             | Control borders on light                       |
| `stone` | `#63635B`             | Secondary text on light                        |
| `ink`   | `#23241D`             | Text on light                                  |
| `moss`  | `#31372E`             | **The dark surface**: announcement bar, footer |
| `fern`  | `#3B4138`             | Raised surfaces on moss                        |
| `smoke` | `#494E45`             | Hairlines on moss (decorative only)            |
| `dust`  | `#8F9188`             | Control borders on moss                        |
| `oat`   | `#B0B0A7`             | Secondary text on moss                         |
| `error` | `#A3281F` / `#F3988A` | Errors only, on light / on moss                |

**No accent colour.** The accent role still exists, so the whole system can switch to a colour later by editing two lines (see below). For now it maps to ink on light schemes and to paper on moss. The only hue the interface itself uses is error red; everything else comes from the photography.

### Semantic tokens

| Utility examples              | Token            | Role                                  | Paper · Linen     | Moss           | Must keep (vs surface & raised) |
| ----------------------------- | ---------------- | ------------------------------------- | ----------------- | -------------- | ------------------------------- |
| `bg-surface`                  | `surface`        | Section background                    | `paper` · `linen` | `moss`         | n/a                             |
| `bg-surface-raised`           | `surface-raised` | Cards, inputs, drawers, dialogs       | `bone`            | `fern`         | n/a                             |
| `text-fg` `bg-fg` `border-fg` | `fg`             | Text, icons, primary buttons, frames  | `ink`             | `paper`        | **7:1** (AAA, SC 1.4.6)         |
| `text-fg-muted`               | `fg-muted`       | Secondary text, captions, dates       | `stone`           | `oat`          | **4.5:1** (SC 1.4.3)            |
| `border-line` `divide-line`   | `line`           | Decorative hairlines only             | `flax`            | `smoke`        | none: never interactive         |
| `border-control`              | `control`        | Input, select and checkbox boundaries | `taupe`           | `dust`         | **3:1** (SC 1.4.11)             |
| `text-accent`                 | `accent`         | Reserved; maps to `fg` (no accent)    | `ink`             | `paper`        | **4.5:1** (SC 1.4.3)            |
| `text-on-accent`              | `on-accent`      | Text on an accent fill                | `bone`            | `ink`          | **4.5:1** on accent             |
| `text-error` `border-error`   | `error`          | Error text, icons, borders            | `error`           | `error-bright` | **4.5:1** (SC 1.4.3)            |
| (global focus ring)           | `focus`          | Focus indicator                       | `ink`             | `paper`        | **3:1** (SC 2.4.13)             |

Overlays for text on photography (`scrim`, `veil`) are covered in [§6](#type-on-photography).

### Schemes

| Class                        | Surface | Use                                                                                    |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------- |
| _(default)_ / `scheme-paper` | paper   | Most sections                                                                          |
| `scheme-linen`               | linen   | Feature panels beside a photo, alternate sections                                      |
| `scheme-moss`                | moss    | Announcement bar, footer, at most one feature band per page; light text on dark photos |

- Put the scheme on a section's outermost element, usually with `full-width`: `<div class="full-width scheme-moss">`. It sets the background and text colour for you.
- Nest `scheme-paper` inside `scheme-moss` to put a light card on a dark band.
- Merchants choose a section's scheme with a `select` setting whose option values are the full class names (see [architecture.md](architecture.md#using-tailwind-in-liquid)).
- Visitors who set **increase contrast** in their OS get full-strength secondary text and lines on every scheme (`prefers-contrast: more`).

### Contrast (WCAG 2.2)

Lowest ratio of each role against the scheme's surface / raised surface. AA needs **4.5:1** for text, **3:1** for large text (≥ 24px, or ≥ 18.66px bold) and for UI boundaries (SC 1.4.11). Ratios are floored, never rounded up.

| Role                          | Needs   | Paper         | Linen         | Moss         |
| ----------------------------- | ------- | ------------- | ------------- | ------------ |
| `fg` (and `accent`)           | 7 (AAA) | 13.74 / 14.76 | 12.52 / 14.76 | 10.74 / 9.22 |
| `fg-muted`                    | 4.5     | 5.31 / 5.71   | 4.84 / 5.71   | 5.60 / 4.80  |
| `error`                       | 4.5     | 6.40 / 6.87   | 5.83 / 6.87   | 5.63 / 4.83  |
| `control`                     | 3       | 3.58 / 3.84   | 3.26 / 3.84   | 3.82 / 3.28  |
| `focus`                       | 3       | 13.74 / 14.76 | 12.52 / 14.76 | 10.74 / 9.22 |
| Primary button (rest / hover) | 4.5     | 13.74 / 8.82  | 12.52 / 8.23  | 10.74 / 8.25 |

Run `pnpm check:contrast` for all 52 pairings, or `pnpm check:contrast --markdown` for a pasteable table.

### If an accent is ever introduced

Change two lines in `tokens.css`: `--palette-accent` (used on light schemes, needs 4.5:1 on paper, linen and bone) and `--palette-accent-bright` (used on moss, needs 4.5:1 on moss and fern). `pnpm check:contrast` verifies both. Keep it to sale prices and the sale badge.

### Rules

- **Light by default.** Pages sit on paper. Feature panels sit on linen; the announcement bar and footer sit on moss.
- **No accent colour.** A sale is shown by the "Sale" badge, the struck-through compare-at price and its hidden label, not by colour.
- **Colour never carries meaning alone (SC 1.4.1).** Errors have an icon and a message. Links are underlined.
- **Never use `line` for anything interactive.** Controls use `control`.
- **Opacity is for fills, never for text.** `bg-fg/5` for a placeholder is fine; `text-fg/60` is not. Use `text-fg-muted`, the quietest grey that still passes 4.5:1 ([§10](#text-roles-and-minimums)).
- **No automatic dark mode.** The storefront doesn't follow the OS theme. Contrast needs are met through `prefers-contrast` and Windows forced colours instead ([§10](#beyond-wcag)).

---

## 3. Typography

### Typefaces

| Role          | Stack               | Token                 | Weight                               |
| ------------- | ------------------- | --------------------- | ------------------------------------ |
| **Display**   | `Georgia, serif`    | `font-display`        | 400 and _italic_. Never bold.        |
| **Body & UI** | `Arial, sans-serif` | `font-body` (default) | 400. Bold (700) only for `<strong>`. |

**Why system typefaces:**

- **Nothing to download.** No layout shift or invisible text while a font loads.
- **No licences.**
- **Built for screens.** Georgia was drawn by Matthew Carter for screen reading, with a generous x-height and a true italic.

### Android and Linux (deferred)

Arial and Georgia are commercial typefaces, owned by Monotype and licensed by Microsoft and Apple for their systems. Android has neither, so it shows Roboto and Noto Serif instead. Noto Serif is wider and heavier than Georgia, so headlines break and read differently there.

**The fix, when wanted:** add Gelasio and Arimo, open-licence typefaces drawn to Georgia's and Arial's widths. Each is declared as its own `@font-face` that tries the installed font first (`src: local("Georgia"), url(gelasio.woff2)`), so only Android and Linux download them. That's about 93 KB in three files: Gelasio regular, Gelasio italic and Arimo.

It has to be a separately named family, not Gelasio added to the end of the stack. Android can map the name "Georgia" straight to Noto Serif, so a trailing fallback would never be reached.

**Status:** deferred. Georgia and Arial stay as they are for now, and layouts must be checked on Android.

### Two voices

- **The field voice: Georgia.** Headlines, statements, product names, the wordmark, and ordinal numerals.
- **The specimen voice: Arial.** Body text, navigation, buttons, prices, and **labels**. A label is small uppercase Arial, **regular weight, widely tracked**. Case and spacing set it apart from body text; weight doesn't need to. Labels name things (eyebrows, spec lines, badges, dates) and never carry sentences.

### Italic

Italic marks **the closing phrase of a display headline**, the turn in the thought:

> In their _own form._ · Less intervention. _More of the original._ · A clearer connection to the _natural world._

- One italic phrase per headline, four words or fewer, at the end. Never a whole headline, body copy, labels, or the wordmark.
- **Ordinal numerals** (the _01 02 03_ of the tenets strip and index lists) are also Georgia italic: its old-style italic figures turn plain numbering into a detail.
- Georgia italic only. No italic Arial.

### Type scale

Pages are image-led and composed for large screens, so display sizes keep growing up to **1920px** rather than stopping at 1440px.

| Utility           | 375 → 1440 → 1920px | Line height | Tracking | Face    | Use                                                                   |
| ----------------- | ------------------- | ----------- | -------- | ------- | --------------------------------------------------------------------- |
| `text-display-xl` | 44 → 89 → 110px     | 0.95        | −0.02em  | Georgia | The page's `h1`: the hero                                             |
| `text-display-lg` | 32 → 60 → 72px      | 1.05        | −0.015em | Georgia | Section and feature headings, statements, product title               |
| `text-display-md` | 24 → 35 → 40px      | 1.15        | −0.01em  | Georgia | Feature-pair titles, the wordmark, newsletter heading, specimen label |
| `text-display-sm` | 20 → 24 → 26px      | 1.25        | −0.005em | Georgia | Journal titles, drawer and dialog titles                              |
| `text-lg`         | 18px                | 1.6         | 0        | Either  | Lead paragraphs (Arial); product names in cards (Georgia)             |
| `text-base`       | 16px                | 1.6         | 0        | Arial   | Body copy and **all form inputs**                                     |
| `text-sm`         | 14px                | 1.5         | 0        | Arial   | Buttons, links, navigation, captions, origin lines, prices            |
| `text-xs`         | 12px                | 1.5         | 0        | Arial   | Legal fine print only. Nothing is smaller.                            |
| `text-label`      | 12px                | 1.3         | +0.12em  | Arial   | Eyebrows, spec lines, badges, dates. **Always `uppercase`**           |

Every token carries its own line height and tracking, so a size is never set without them.

### How the scale meets WCAG

- **Zoom (SC 1.4.4).** Fluid sizes are `clamp(rem, rem + vw, rem)` with each maximum at most **2.5× its minimum** (`display-xl` is exactly 2.5×, the rest less). That guarantees text still reaches 200% at the browser's 500% zoom limit ([Barvian, _Smashing Magazine_, 2023](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/)).
- **Reflow (SC 1.4.10).** At its 44px minimum, `display-xl` fits Georgia words up to 13 letters on a 320px screen. Headings also hyphenate on small screens (`base.css`).
- **Text spacing (SC 1.4.12).** No text container has a fixed height or clips its overflow.
- **Visual presentation (SC 1.4.8, AAA).** Body text is 16px with 1.6 line height, never justified, in `max-w-reading` (about 74 characters a line).
- **Minimum sizes.** Nothing below 12px; captions, origins and excerpts at 14px or larger ([§10](#text-roles-and-minimums)).

### Rules

- **Semantic level ≠ visual size.** Pick `h1`–`h6` for the outline and `text-display-*` for the look. One `h1` per page (SC 1.3.1, 2.4.6).
- **Headings are Georgia by default** (`base.css`). Add `font-display` to non-heading elements that need the display voice.
- **Sentence case in the source**, except product names, which are names ("Emu Neck", "Kangaroo Tail Tips"). `uppercase` is applied by CSS on labels only, so screen readers read words, not letters.
- **Numerals.** Ordinals in Georgia italic. Data (prices, weights, quantities, dates) in Arial.
- **Alignment.** Left-aligned. Never justify (SC 1.4.8).

---

## 4. Spacing & layout

### Base unit

Tailwind's **4px** unit: `p-1` = 4px, `p-4` = 16px. Stick to these steps:

`1` (4) · `2` (8) · `3` (12) · `4` (16) · `6` (24) · `8` (32) · `10` (40) · `12` (48) · `16` (64) · `20` (80) · `24` (96)

### Named spacing tokens (fluid)

| Utility examples           | Token                  | 375 → 1440 → 1920px | Use                                                                             |
| -------------------------- | ---------------------- | ------------------- | ------------------------------------------------------------------------------- |
| `px-gutter`                | `--spacing-gutter`     | 24 → 92 → 123px     | Page side margin: 6.4% of the viewport, up to 128px |
| `py-section`, `mt-section` | `--spacing-section`    | 64 → 108 → 128px    | Between major sections |
| `py-section-sm`            | `--spacing-section-sm` | 40 → 68 → 80px      | Tighter sections: the newsletter, the footer                                    |

### Page grid

Every Shopify section is automatically a `[gutter] [content] [gutter]` grid (`base.css`):

- Children are centred and capped at **`max-w-page` (1920px including gutters)**. Image-led rows stay wide on large screens; running text keeps its own `max-w-reading` measure.
- Add **`full-width`** to a child to bleed edge to edge (split sections, scheme bands), then constrain its content again with `px-gutter`.

### Compositions

Compose on 12 columns from `lg` up, stacking below: `grid gap-x-6 lg:grid-cols-12`.

| Composition          | Layout                                                           | Example                                 |
| -------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| **Split hero**       | Full width, 2 columns: text on paper, photo bleeding to the edge | "In their _own form._"                  |
| **Feature split**    | Full width, 2 columns: photo, then a `scheme-linen` panel        | "Less intervention."                    |
| **Card row**         | 4 products or 3 articles under a section header                  | The collection; "Notes from the field." |
| **Feature pair**     | 2 equal photos with caption rows                                 | "A sense of place."                     |
| **Offset statement** | Eyebrow in columns 1–3, statement in columns 5–12                | "A shorter ingredient list…"            |

On phones, split sections put the photo first. DOM order must match reading order. Place things with grid columns, never by reordering content visually (SC 1.3.2).

### Dividers

A rule between sections either spans **the content column exactly** (`border-t border-line` on the content) or **the full width** (on a `full-width` element). Never somewhere in between, so every rule lines up with an edge that's already on the page.

### Containers

| Utility         | Width  | Use                                                        |
| --------------- | ------ | ---------------------------------------------------------- |
| `max-w-page`    | 1920px | Outer page (applied automatically)                         |
| `max-w-reading` | 32rem  | Running text: ~74 characters of Arial (SC 1.4.8 limit: 80) |
| `max-w-narrow`  | 28rem  | Forms, the password page                                   |

### Breakpoints

Tailwind defaults, mobile-first: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Design at 375px, verify at 320px (nothing may scroll sideways; SC 1.4.10), and check at 1920px.

### Standard grids

| Pattern      | Classes                                                       |
| ------------ | ------------------------------------------------------------- |
| Product row  | `grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4` |
| Journal row  | `grid gap-12 md:grid-cols-3 md:gap-6`                         |
| Feature pair | `grid gap-12 md:grid-cols-2 md:gap-6`                         |
| Split        | `full-width grid lg:grid-cols-2`                              |

### Stacking (z-index)

| Layer                | Class  |
| -------------------- | ------ |
| Sticky header        | `z-30` |
| Drawer + backdrop    | `z-40` |
| Modal dialog         | `z-50` |
| Toast / notification | `z-60` |
| Skip link (focused)  | `z-70` |

---

## 5. Shape, borders & elevation

| Token / utility             | Value      | Use                                                              |
| --------------------------- | ---------- | ---------------------------------------------------------------- |
| _(no class)_                | 0 radius   | **Everything is square:** images, cards, buttons, inputs, badges |
| `rounded-full`              | circle     | Colour swatches and the bag-count dot only                       |
| `border` + `border-line`    | 1px        | Dividers under cards and captions, tenets strip, section rules   |
| `border` + `border-control` | 1px        | Inputs, selects, checkboxes; the newsletter's underline          |
| `border` + `border-fg`      | 1px        | Outlined buttons, arrow-link underlines, the specimen label      |
| `shadow-overlay`            | deep, soft | Drawers, dialogs, popovers: the only shadow                      |

**Hierarchy order:** surface colour, then hairline, then (only for things that genuinely float) shadow.

---

## 6. Wordmark, imagery & icons

### Wordmark

**The Wild Provision**: Georgia, regular weight, title case, with the slight negative tracking its type token carries. No italics, no capitals, no logo file.

- **Live text, not an image.** It stays sharp, inherits the scheme's colour, costs no download, and screen readers read it as a name.
- **Header:** centred, `font-display text-base md:text-display-md`. That's 16px on phones, so it fits between the menu and bag at 320px, and 28–40px from 768px.
- **Footer:** `font-display text-display-md`, above a one-line tagline.
- **Clear space:** at least the height of a capital letter on every side. **Minimum size:** 16px. **Colour:** the scheme's `fg` only.
- **Packaging follows the same rules.** The pouch carries the same wordmark in title case, and its copy follows the voice ([§9](#9-voice--ui-copy)): "chews", never treats; no hype; dogs only.

### Photography

Three families, used together.

**Specimen: the product.**

- The pouch and the chew together, on a plain, pale stone backdrop, lit softly from one side, with a real shadow. Keep the angle, height and scale the same for every product, so a row reads as a set.
- Close enough to read the material: fibre, grain, shell, the cut edge.
- `aspect-product` (4:5). Only one status badge may sit on it, top-left, on a solid chip.

**Field: provenance.**

- Places, not postcards: rolling pasture, black-sand coast, open sea, dry grassland, forest edge, weather.
- Quiet compositions with calm space, a muted and warm natural grade, soft contrast. No HDR or heavy filters.
- Split sections use `aspect-product` (4:5); journal cards use `aspect-landscape` (4:3).

**Source: the animal or the catch.**

- Close, textural crops such as hides or whole fish, respectful and never sentimental.
- `aspect-feature` (5:3), in pairs ("From the land." / "From the sea.").

**Keep highlights below paper.** A photo placed beside paper must not clip to white: a blown-out sky next to a paper panel reads as a hole in the page. Crop to the land, choose a softer sky, or grade the highlights down to about paper's lightness.

**Grade the set together:** warm white balance, no crushed blacks, low saturation, so the product's own colour stays the richest thing on the page.

**Placeholders:** `bg-fg/5` blocks at the correct aspect ratio.

**Alt text (SC 1.1.1):**

- **Specimen images** describe the product: "Emu neck beside its pouch".
- **Field images** get `alt=""` when they're purely atmospheric and nearby text carries the meaning.
- **Never put words inside an image file (SC 1.4.5).**

### Type on photography

Text stays off photos by default. When a page does set text over a photo, contrast is guaranteed against the **worst possible pixel**:

| Overlay      | Utility           | Opacity   | Guarantees over any image | Allowed for                                |
| ------------ | ----------------- | --------- | ------------------------- | ------------------------------------------ |
| Scrim        | `bg-scrim`        | ink 70%   | 5.10:1 for light text     | Any text                                   |
| Subtle scrim | `bg-scrim-subtle` | ink 56%   | 3.28:1                    | **Large text only** (display sizes ≥ 24px) |
| Veil         | `bg-veil`         | paper 61% | 5.05:1 for dark text      | Any text                                   |
| Subtle veil  | `bg-veil-subtle`  | paper 49% | 3.42:1                    | **Large text only**                        |

- Light text (`scheme-moss`) sits on a scrim; dark text (`scheme-paper`) sits on a veil. Anchor the overlay behind the text block and fade it out beyond the text, never behind a letter.
- **"No overlay" is a checked exception.** Every character must reach 4.5:1 (3:1 at display sizes) against the lightest pixel behind it, at both crops.
- Only `color-fg` goes on photos.

### Icons

The header uses words, not icons: **"Search"** and **"Bag (2)"**.

**The arrow is an SVG, not a character.** The long arrow character "⟶" isn't in Arial or Georgia, so each system borrows it from a different symbol font, with a different size, weight and baseline on Mac, Windows and Android. Draw it once:

```html
<svg
  class="w-5 h-2.5"
  viewBox="0 0 20 10"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  aria-hidden="true"
>
  <path d="M0 5h18.5M14 1l4.5 4-4.5 4" />
</svg>
```

It is 20×10 with a 1px stroke, matching the weight of 14px Arial beside it. It's the one icon drawn at 1px.

**Other icons**, for the few places text can't go (the menu button on phones, close, plus/minus, chevron, check, alert), sit on a 24×24 grid with a 1.5px stroke, butt caps, mitred joins and no fills, drawn in `currentColor`. An icon that carries meaning on its own needs an accessible name, 3:1 contrast (SC 1.1.1, 1.4.11) and a 44px target.

---

## 7. Motion

Slow, calm and functional. Motion confirms an action or shows where something came from. It never decorates.

| Use                                | Duration | Easing                    | Classes                                                   |
| ---------------------------------- | -------- | ------------------------- | --------------------------------------------------------- |
| Colour / underline on hover, focus | 200ms    | `ease-out-soft` (default) | `transition-colors`                                       |
| Arrow nudge on link hover          | 200ms    | `ease-out-soft`           | `transition-transform group-hover:translate-x-1`          |
| Product image on card hover        | 700ms    | `ease-out-soft`           | `transition-transform duration-700 group-hover:scale-103` |
| Drawer / dialog in                 | 300ms    | `ease-out-soft`           | `transition-transform duration-300`                       |

- **Reduced motion (SC 2.3.3, AAA).** When the OS asks for reduced motion, every transition and animation is cut globally (`base.css`).
- **Nothing moves by itself for more than 5 seconds without a pause control (SC 2.2.2).** No auto-advancing carousels, marquees or tickers.
- **Nothing flashes** more than three times a second (SC 2.3.1). No parallax, no scroll-jacking.
- **No drag-only interactions (SC 2.5.7).** Galleries and sliders also have previous/next buttons.

---

## 8. Components

Recipes for the core components. **Status: specified, not yet built.** When a component is built it becomes a snippet (`snippets/`) or block (`blocks/`), and its status here changes to ✅.

### Announcement bar

`scheme-moss py-2 text-center text-sm`. One message ("Single-ingredient provisions. Nothing unnecessary."), with an optional text link. **It never rotates or scrolls** (SC 2.2.2).

### Header

```
[ Provisions   Our approach ]      The Wild Provision      [ Search   Bag (2) ]
```

- `grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-gutter min-h-16 md:min-h-24 border-b border-line`.
- **Skip link first** (SC 2.4.1): `sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 bg-surface-raised px-4 py-3 text-sm`, pointing at `<main id="MainContent">`.
- **Navigation** on the left, **wordmark** centred (`text-base md:text-display-md`), **Search** and **Bag (n)** on the right. The links are `text-sm`, sentence case, at least 44px tall. The DOM order is the visual order.
- The current page carries `aria-current="page"` and an underline (SC 1.4.1). The bag link's name includes the count ("Bag, 2 items").
- On phones: menu button (44px, named "Menu"), wordmark, bag. The rest moves into the menu drawer.
- **If sticky:** set `--header-height` on `:root`; `scroll-padding-top` in `base.css` keeps focused elements clear of it (SC 2.4.11). Keep the same order on every page (SC 3.2.3).

### Button

Square, sentence case, 56px tall, with a 1px border on every variant so buttons stay outlined in Windows forced colours:

`group inline-flex min-h-14 items-center justify-between gap-8 border px-7 text-sm transition-colors`

| Variant       | Classes                                                | Use                                 |
| ------------- | ------------------------------------------------------ | ----------------------------------- |
| **Primary**   | `border-transparent bg-fg text-surface hover:bg-fg/85` | One per view: add to bag, checkout  |
| **Secondary** | `border-fg text-fg hover:bg-fg hover:text-surface`     | The hero's "Explore the provisions" |

- Buttons that take you somewhere end with the arrow SVG ([§6](#icons)), which nudges right on hover.
- 56px matches the generous proportions of the layout, and clears the 44px AAA target (SC 2.5.5). Primary product actions go full width on phones.
- There's no accent variant while the accent is none.
- Labels are verb phrases in sentence case. An `aria-label`, if present, must contain the visible label (SC 2.5.3).
- **Don't disable, explain.** Sold out shows "Sold out" with `aria-disabled="true"`, still focusable.
- **Loading:** keep the width, show a spinner, set `aria-disabled="true"`, announce "Adding…" in a live region (SC 4.1.3).

### Arrow link

"All provisions", "Our approach", "Explore land", "Read the note": **one style everywhere**, including feature-pair captions. There is no bare or short-arrow variant.

`group inline-flex items-center gap-4 border-b border-fg pb-1 text-sm`, followed by the arrow SVG with `transition-transform group-hover:translate-x-1`.

- The underline spans text and arrow. The text names the destination (SC 2.4.4). It is at least 24px tall (SC 2.5.8).

### Inline link

Any link without a class is underlined by `base.css` (1px, offset 0.2em, 2px on hover), covering rich text and `link_to` (SC 1.4.1).

### Section header

```
THE COLLECTION                                         All provisions ⟶
Nothing extra. Nothing ordinary.
```

Eyebrow `text-label uppercase text-fg`; heading `mt-4 text-display-lg` (h2); an optional arrow link aligned to the heading's baseline on the right (`flex flex-wrap items-end justify-between gap-6`). Left-aligned.

**Eyebrows are names of one to three words** ("The collection", "Provenance", "The journal"). A sentence in capitals ("DIFFERENT LANDSCAPES. THE SAME PHILOSOPHY.") reads slowly because capitals hide word shapes. Move a line like that into the lead, or drop it.

### Split hero

- Full width, `grid lg:grid-cols-2`, filling the first screen under the header. Text column on paper: `flex flex-col justify-center gap-8 px-gutter py-section`.
- Eyebrow ("The Wild Provision / Single-ingredient chews"); `h1` in `text-display-xl` with an italic closing phrase; a lead in `text-lg text-fg-muted max-w-reading`; the secondary button.
- **Say it once.** The tenets strip sits directly below the hero, so the hero carries no tagline of its own. No line appears twice on one screen.
- Photo column: `aspect-product lg:aspect-auto`, `size-full object-cover`, eager with `fetchpriority="high"`, highlights kept below paper ([§6](#photography)). On phones the photo comes first.

### Tenets strip

```
01  One animal.   │   02  One ingredient.   │   03  One origin.
```

`<ol class="grid border-y border-line sm:grid-cols-3">`. Items are `py-5 text-center text-sm`, divided by `border-line` (a left border from `sm`, a top border below).

The numeral is `font-display italic text-lg text-fg-muted mr-3` (5.31:1 on paper). The numbering is honest because these are the brand's three rules, in order.

### Product card

```
[ image  aspect-product · status badge top-left ]
Emu Neck                                   $21.90 USD     font-display text-lg  ·  text-sm tabular-nums
Product of Australia                                      text-sm text-fg-muted
──────────────────────────────────────────────────────    border-b border-line
100% EMU · 100 G                                          text-label uppercase
```

- The whole card is one link (`group block`), and the product name is its text. Leave the image's `alt` empty inside the card so the name isn't read twice.
- **Media:** `relative aspect-product overflow-hidden bg-fg/5`; image `size-full object-cover transition-transform duration-700 group-hover:scale-103`.
- **Row:** `mt-4 flex items-baseline justify-between gap-4`.
- **Origin:** `mt-1 pb-3 border-b border-line text-sm text-fg-muted`.
- **Spec:** `mt-3 text-label uppercase`. It carries the **net weight** printed on the pouch ("100% emu · 100 g"), so shoppers can compare value without opening each product.
- No add-to-bag button in the grid.

### Badge

**One style:** a paper chip with an uppercase label.

`inline-flex items-center bg-surface px-2 py-1 text-label uppercase text-fg`

- On a product photo it sits at `absolute top-3 left-3`. One badge at most per product: New, Sale or Sold out.
- The word carries the meaning (SC 1.4.1). Because the chip is solid, its contrast never depends on the photo.

### Price

- **Regular:** `text-fg`, Arial, `tabular-nums`. Use Shopify's money filters, never format currency by hand. The storefront uses `money_with_currency` ("$21.90 USD").
- **Sale:** the new price in `text-fg`, then the compare-at price in `text-fg-muted line-through`, plus the Sale badge. Each price has a visually hidden, translated label ("Sale price", "Regular price") (SC 1.4.1, 1.3.1).

### Specimen label ★ signature component

The product page's spec card, set like the label already on the pouch.

```
┌──────────────────────────────────────┐   border border-fg bg-surface-raised p-6
│  THE WILD PROVISION                  │   text-label uppercase text-fg-muted
│  Emu Neck                            │   mt-3 font-display text-display-md
├──────────────────────────────────────┤   <dl class="mt-6 border-t border-fg">
│  INGREDIENT   100% emu               │   rows: grid grid-cols-3 gap-4 border-t border-line py-3
│  ORIGIN       Australia              │     dt: text-label uppercase text-fg-muted
│  NET WEIGHT   100 g                  │     dd: col-span-2 text-sm
│  PROCESSING   Air-dried              │   first row: border-t-0
├──────────────────────────────────────┤
│  SINGLE INGREDIENT. NOTHING ELSE.    │   mt-6 pt-4 border-t border-fg text-label uppercase
└──────────────────────────────────────┘
```

| Row        | Source                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| Ingredient | `product.metafields.custom.ingredient`                                           |
| Origin     | `product.metafields.custom.origin` ("Port Lincoln, South Australia" where known) |
| Net weight | The selected variant's weight: `variant.weight \| weight_with_unit`              |
| Processing | `product.metafields.custom.processing` (optional)                                |
| Texture    | `product.metafields.shopify['pet-treat-texture']` (optional)                     |

- A semantic `<dl>` with `<div>` rows (SC 1.3.1). **Rows with an empty value are left out**; never show "N/A".
- The closing line repeats the pouch's own words, so the site and the packaging say the same thing.

### Feature split

Full width, `grid lg:grid-cols-2`. Photo first (`aspect-product lg:aspect-auto size-full object-cover`), then a `scheme-linen` panel: `flex flex-col justify-center gap-6 px-gutter py-section`. Inside: eyebrow, a `text-display-lg` heading with an italic closing phrase, one or two paragraphs in `text-base text-fg-muted max-w-reading`, and an arrow link.

### Feature pair

Two equal photos (`aspect-feature`). Under each:

- A caption row, `mt-5 flex items-baseline justify-between gap-4`, holding an `h3` in `font-display text-display-md` and an arrow link ("Explore land").
- One line in `mt-2 pb-5 border-b border-line text-sm text-fg-muted`.

### Offset statement

`grid gap-y-6 lg:grid-cols-12 lg:gap-x-6`. Eyebrow in `lg:col-span-3`; the statement block in `lg:col-start-5 lg:col-span-8`, with a `text-display-lg` line ending in an italic phrase, then `mt-6 max-w-reading text-base text-fg-muted`.

### Journal card

- `aspect-landscape` image.
- `<time>` in `mt-5 text-label uppercase text-fg-muted` ("07 September 2026").
- Title `mt-2 font-display text-display-sm`; excerpt `mt-2 text-sm text-fg-muted`.
- Arrow link "Read the note" `mt-5`, with the title in its hidden accessible name ("Read the note: A study in natural variation") so three identical links aren't ambiguous (SC 2.4.4).

### Newsletter

A `py-section-sm` section above the footer, `grid gap-8 lg:grid-cols-2`:

- **Left:** "A note, now and then." in `text-display-md`, one line of `text-sm text-fg-muted`.
- **Right:** an underline field. Visually hidden label "Email address"; input `w-full border-0 border-b border-control bg-transparent py-3 text-base` with `type="email" autocomplete="email"`; the submit is a `size-11` button showing the arrow SVG, named "Subscribe" with `sr-only` text. Fine print below in `mt-3 text-xs text-fg-muted`, with the privacy link underlined.
- The underline is the control's boundary, so it uses `control` (3:1), not `line` (SC 1.4.11).

### Form field

```html
<label class="text-label uppercase" for="email">Email</label>
<input
  id="email"
  type="email"
  autocomplete="email"
  aria-describedby="email-error"
  class="mt-2 block min-h-12 w-full border border-control bg-surface-raised px-4 text-base
              aria-invalid:border-error"
/>
<p id="email-error" class="mt-2 flex gap-2 text-sm text-error">
  [alert icon] Enter an email address, like name@example.com
</p>
```

- **Always a visible label** (SC 3.3.2). The newsletter's hidden label is the exception, because its heading and placeholder make the purpose plain.
- Placeholders are examples, never labels, and take `fg-muted` from `base.css`.
- `autocomplete` on every personal-data field (SC 1.3.5). Inputs are 16px so iOS doesn't zoom.
- **Errors:** a border colour, an icon _and_ a message linked with `aria-describedby` (SC 1.4.1, 3.3.1). The message says how to fix it (SC 3.3.3). Focus moves to the first error on submit. Never ask twice (SC 3.3.7).

### Footer

`scheme-moss`, `py-section-sm`:

- **Left:** the wordmark (`text-display-md`) and a tagline (`text-sm text-fg-muted`).
- **Columns:** headings in `text-label uppercase text-fg-muted` ("Explore", "Good to know"), links in `text-sm`, each at least 24px tall.
- **Bottom row:** `border-t border-line pt-4 text-xs text-fg-muted flex flex-wrap justify-between gap-4`, holding © · "One animal. One ingredient. One origin." · Privacy policy.
- The contact link sits in the same place on every page (SC 3.2.6).

### Index list

Numbered rows for sourcing steps and FAQs: an `<ol>` of native `<details>`/`<summary>` rows, `border-t border-line`, summary `min-h-11 py-5`. Numeral in `font-display italic text-lg text-fg-muted` (as in the tenets strip), title `font-display text-display-sm`, decorative +/− icon (SC 2.1.1, 4.1.2).

### Drawer & dialog

A native `<dialog>` opened with `showModal()`: it traps focus, closes on <kbd>Esc</kbd> and returns focus to the trigger (SC 2.1.2, 2.4.3). Add `scroll-lock`, and style `bg-surface-raised text-fg shadow-overlay backdrop:bg-scrim`.

---

## 9. Voice & UI copy

Write like a good field guide: precise, calm and sensory. A knowledgeable friend, never a salesperson.

| Do                                             | Don't                                    |
| ---------------------------------------------- | ---------------------------------------- |
| "Anatomical animal parts. Minimal processing." | "The ULTIMATE all-natural super-chew!!"  |
| "Nothing extra. Nothing ordinary."             | "Natural treats. Endless adventures."    |
| "Supervise your dog while chewing."            | Burying safety information in fine print |
| "Explore the provisions" / "Read the note"     | "Shop now!" / "Click here"               |

- **Sentence case** for everything in the source, except product names ("Emu Neck"). On screen, only labels are uppercase.
- **Headlines turn on their last phrase**, and that phrase is the italic one.
- **Eyebrows name the section in one to three words.** Say anything longer in the lead.
- **Terminology:**
  - "Provisions" for the range, in navigation and headings. "Chews" in plain description ("Single-ingredient chews"). Never "treats" or "snacks", including on the packaging.
  - "Bag", not cart: "Add to bag", "Bag (2)".
  - "Single-ingredient" with a hyphen as an adjective. "Your dog", never "fur baby".
- **UK English** (colour, fibre, flavour). Dates day-first: "7 September 2026", or "07 September 2026" in labels.
- **Units:** metric with a space (`100 g`, `15 cm`). Origins as "Product of Australia", or more precisely where known ("Port Lincoln, South Australia").
- **No template copy ships.** Theme placeholder text ("An editorial space for your product and material studies.") is replaced before launch.
- **Be specific and truthful.** Every claim about sourcing, processing or duration must be verifiable.
- **Accessible copy:** link text names its destination (SC 2.4.4). An error says what went wrong and how to fix it (SC 3.3.3).
- **All strings live in locale files.** See rule 7 in [AGENTS.md](../AGENTS.md).

---

## 10. Accessibility (WCAG 2.2)

**Target:** WCAG 2.2 Level AA across the storefront. Conforming to 2.2 AA also covers 2.1 AA, the version most accessibility laws currently cite (for example, EN 301 549 under the European Accessibility Act).

**Adopted AAA criteria** (where they cost nothing visually): 1.4.6 for body text, 1.4.8 (measure, spacing, alignment), 2.3.3, 2.4.13 and 2.5.5. W3C doesn't recommend requiring full AAA across a whole site.

### Text roles and minimums

Every piece of text takes one of these roles. Grey text never goes lighter than `fg-muted`, and nothing goes smaller than its size here. A lighter grey or smaller size can look more refined in a mockup, but it fails SC 1.4.3 or strains readers at normal distance.

| Role                                    | Size and face             | Colour     | Contrast (paper / linen / moss) |
| --------------------------------------- | ------------------------- | ---------- | ------------------------------- |
| Body copy, inputs                       | 16px Arial (`text-base`)  | `fg`       | 13.74 / 12.52 / 10.74 (AAA)     |
| Lead paragraphs                         | 18px Arial (`text-lg`)    | `fg-muted` | 5.31 / 4.84 / 5.60              |
| Captions, origins, excerpts, feature body | 14–16px Arial           | `fg-muted` | 5.31 / 4.84 / 5.60              |
| Navigation, buttons, links, prices      | 14px Arial (`text-sm`)    | `fg`       | 13.74 / 12.52 / 10.74           |
| Eyebrows, spec lines, badges            | 12px Arial, `text-label`  | `fg`       | 13.74 / 12.52 / 10.74           |
| Dates, footer headings, specimen terms  | 12px Arial, `text-label`  | `fg-muted` | 5.31 / 4.84 / 5.60              |
| Ordinal numerals                        | 18px Georgia italic       | `fg-muted` | 5.31 / 4.84 / 5.60              |
| Fine print                              | 12px Arial (`text-xs`)    | `fg-muted` | 5.31 / 4.84 / 5.60              |

On raised surfaces (`bone`, `fern`) the lowest ratios are in [§2](#contrast-wcag-22).

### How the system meets each criterion

Where: **T** tokens (`tokens.css`, checked by `check:contrast`) · **B** base styles (`base.css`) · **C** component spec (§8) · **P** publishing rule (merchant content) · **S** Shopify-hosted (checkout, accounts).

| SC      | Level | Criterion                                | How                                                                                              | Where |
| ------- | ----- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ----- |
| 1.1.1   | A     | Non-text content                         | Alt text rules for each photo family; icon buttons named; the arrow SVG `aria-hidden`            | C, P  |
| 1.2.x   | A–AA  | Time-based media                         | Films with speech get captions and a transcript; background video is silent                      | P     |
| 1.3.1   | A     | Info and relationships                   | Real headings, `<ol>` tenets and index lists, `<dl>` specimen label, labelled inputs             | C     |
| 1.3.2   | A     | Meaningful sequence                      | Grid placement only; DOM order equals reading order                                              | C     |
| 1.3.4   | AA    | Orientation                              | No orientation lock                                                                              | C     |
| 1.3.5   | AA    | Identify input purpose                   | `autocomplete` on personal-data fields                                                           | C     |
| 1.4.1   | A     | Use of colour                            | No accent: sale shown by badge, strikethrough and labels; underlined links; icon-and-text errors | B, C  |
| 1.4.3   | AA    | Contrast (minimum)                       | Every semantic pairing ≥ 4.5:1 per scheme; badges on solid chips; worst-case scrims              | T     |
| 1.4.4   | AA    | Resize text                              | rem-based type; fluid maximum ≤ 2.5× minimum                                                     | T     |
| 1.4.5   | AA    | Images of text                           | Live-text headlines and wordmark                                                                 | C, P  |
| 1.4.6   | AAA   | Contrast (enhanced)                      | Adopted for body text (`fg` ≥ 9.22:1). Secondary text is AA                                      | T     |
| 1.4.8   | AAA   | Visual presentation                      | 1.6 line height, ~74-character measure, never justified                                          | T, B  |
| 1.4.10  | AA    | Reflow                                   | Measured display minimums; hyphenation on phones; split sections stack                           | T, B  |
| 1.4.11  | AA    | Non-text contrast                        | `control` ≥ 3.26:1 (the newsletter underline too); focus ≥ 9.22:1; icons ≥ 3:1                   | T, C  |
| 1.4.12  | AA    | Text spacing                             | No fixed heights or clipped text containers                                                      | C     |
| 1.4.13  | AA    | Content on hover or focus                | Menus open on click, close with Esc, stay open while hovered                                     | C     |
| 2.1.1   | A     | Keyboard                                 | Native `button`, `details` and `dialog` first                                                    | C     |
| 2.1.2   | A     | No keyboard trap                         | Modal `<dialog>` releases focus on close                                                         | C     |
| 2.2.2   | A     | Pause, stop, hide                        | No autoplaying carousels or tickers; the announcement bar never rotates                          | C     |
| 2.3.1   | A     | Three flashes                            | Nothing flashes                                                                                  | P     |
| 2.3.3   | AAA   | Animation from interactions              | Reduced motion turns every transition off                                                        | B     |
| 2.4.1   | A     | Bypass blocks                            | Skip link and a `<main>` landmark                                                                | C     |
| 2.4.2   | A     | Page titled                              | `meta-tags` snippet                                                                              | C     |
| 2.4.3   | A     | Focus order                              | DOM order; dialogs return focus to their trigger                                                 | C     |
| 2.4.4   | A     | Link purpose                             | Arrow links name their destination; repeated "Read the note" links carry the title               | C, P  |
| 2.4.5   | AA    | Multiple ways                            | Navigation plus search                                                                           | C     |
| 2.4.6   | AA    | Headings and labels                      | Descriptive headings; eyebrows name sections; one `h1`                                           | C, P  |
| 2.4.7   | AA    | Focus visible                            | Global 2px outline in the scheme's `focus` colour                                                | B     |
| 2.4.11  | AA    | Focus not obscured                       | `scroll-padding-top` follows `--header-height`                                                   | B, C  |
| 2.4.13  | AAA   | Focus appearance                         | 2px solid outline, offset 3px, ≥ 3:1 on every surface                                            | T, B  |
| 2.5.1   | A     | Pointer gestures                         | Pinch or swipe always has a button alternative                                                   | C     |
| 2.5.2   | A     | Pointer cancellation                     | Native buttons act on release                                                                    | C     |
| 2.5.3   | A     | Label in name                            | Accessible names contain the visible label                                                       | C     |
| 2.5.5   | AAA   | Target size (enhanced)                   | Controls ≥ 44px, buttons 56px; inline text links exempt                                          | C     |
| 2.5.7   | AA    | Dragging movements                       | Previous/next buttons on anything draggable                                                      | C     |
| 2.5.8   | AA    | Target size (minimum)                    | Arrow and footer links ≥ 24px tall                                                               | C     |
| 3.1.1   | A     | Language of page                         | `<html lang>` in every layout                                                                    | C     |
| 3.2.1–2 | A     | On focus, on input                       | Selects never navigate on change without a button                                                | C     |
| 3.2.3–4 | AA    | Consistent navigation and identification | Same header and footer order and names everywhere                                                | C     |
| 3.2.6   | A     | Consistent help                          | Contact link in the same place on every page                                                     | C     |
| 3.3.1–3 | A–AA  | Errors, labels, suggestions              | Visible labels; icon-and-text errors that say how to fix                                         | C     |
| 3.3.4   | AA    | Error prevention (financial)             | Bag review before checkout; checkout is Shopify's                                                | S     |
| 3.3.7   | A     | Redundant entry                          | Theme forms never ask twice                                                                      | C     |
| 3.3.8   | AA    | Accessible authentication                | Shopify-hosted login; never block paste or password managers                                     | S     |
| 4.1.2   | A     | Name, role, value                        | Native elements; custom elements expose `aria-expanded`, `aria-current`                          | C     |
| 4.1.3   | AA    | Status messages                          | Bag updates and form results in a `role="status"` region                                         | C     |

WCAG 2.2 removed 4.1.1 Parsing, so it isn't listed.

### Beyond WCAG

- **`prefers-contrast: more`:** secondary text and hairlines go to full strength (`tokens.css`).
- **Windows forced colours:** focus uses `outline`, which survives where `box-shadow` is removed, and buttons carry a border.
- **No web fonts:** text is never invisible while a font loads, and nothing shifts when it arrives.

### Checklist before a release

- [ ] `pnpm check` passes, including `check:contrast`.
- [ ] Keyboard only: every control reachable in a logical order; focus always visible, never under the sticky header.
- [ ] Screen readers: VoiceOver (iOS Safari and macOS) and NVDA (Windows).
- [ ] 320px wide and 400% zoom: no sideways scrolling; split sections stack. Also check at 1920px.
- [ ] Text spacing override (line 1.5, paragraphs 2em, letters 0.12em, words 0.16em): no text lost.
- [ ] Reduced motion on: nothing animates. Windows contrast theme: controls and focus visible.
- [ ] Android Chrome: headings and the wordmark still fit in Noto Serif.
- [ ] Every image with text over it: overlay present, or contrast checked and recorded.
- [ ] Automated scan (axe DevTools or Lighthouse) is clean. Scanners only catch part of WCAG, so they never replace the checks above.

---

## 11. Governance

### Changing a token

1. Edit `src/styles/tokens.css`.
2. Run `pnpm check:contrast`. It fails if any pairing drops below its WCAG minimum, if an overlay stops guaranteeing contrast, or if `.scheme-paper` stops matching the defaults.
3. Update the matching tables here (paste `pnpm check:contrast --markdown` output where useful).
4. For fluid type, keep maximum ≤ 2.5× minimum (SC 1.4.4) and re-check the longest words at 320px (SC 1.4.10).
5. Run `pnpm check`, review the dev theme, and add a line to the changelog with a new version number (patch for a corrected value, minor for a new token or component, major for a change that breaks existing markup).

**Adding a colour role:** add it to the palette, map it in `@theme` _and_ in every scheme, and add its pairing to `PAIRS` in [`scripts/check-contrast.mjs`](../scripts/check-contrast.mjs).

**Don't** add one-off hex values, arbitrary sizes (`text-[17px]`), new shadows, radii, fonts or font weights. If something is genuinely missing, add a token.

### Known gaps in the current theme

The Skeleton-era layout, header and footer predate this system:

- [ ] No skip link, and `content_for_layout` isn't wrapped in `<main id="MainContent">` (SC 2.4.1, 1.3.1).
- [ ] The header renders the shop name as an `<h2>`; it should be the wordmark link.
- [ ] Header and footer CSS is unlayered (see AGENTS.md rule 4) and should be rebuilt to §8.
- [ ] `assets/icon-account.svg` and `assets/icon-cart.svg` are Skeleton placeholders that the text header no longer needs. Their `stroke-width="var(--icon-stroke-width)"` points at a variable that no longer exists. Add `icon-arrow.svg` from §6.

### Open items

- [ ] **Photography:** a hero field image with highlights below paper; a consistent specimen set (§6).
- [ ] **Packaging:** align the pouch wordmark and copy with the site ("The Wild Provision"; chews, not treats; dogs only) (§6, §9).
- [ ] **Android fonts:** Gelasio and Arimo stand-ins, deferred (§3).

### Changelog

| Date       | Version | Change |
| ---------- | ------- | ------ |
| 2026-09-25 | 1.0.0   | First release. Olive-neutral palette with paper, linen and moss schemes and no accent colour; Georgia and Arial; nine type styles fluid to 1920px; spacing, grid and composition rules; wordmark, photography and icon rules; 21 component specs; voice and copy rules; WCAG 2.2 map with `check:contrast` |
