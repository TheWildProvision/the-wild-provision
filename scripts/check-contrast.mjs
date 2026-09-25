/**
 * Verifies every colour pairing the design system promises against its
 * WCAG 2.2 threshold, straight from src/styles/tokens.css so it can't drift.
 *
 *   pnpm check:contrast               table + pass/fail (part of `pnpm check`)
 *   pnpm check:contrast --markdown    the same table as Markdown, for DESIGN_SYSTEM.md
 *
 * Exits 1 if any pairing fails, if `.scheme-paper` stops matching the @theme
 * defaults, or if an overlay can't guarantee contrast over its worst-case pixel.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(
  new URL("../src/styles/tokens.css", import.meta.url),
  "utf8",
);
const markdown = process.argv.includes("--markdown");

// ---------------------------------------------------------------------------
// WCAG 2.2 relative luminance and contrast ratio (sRGB).
// ---------------------------------------------------------------------------
const channels = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (rgb) => {
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Browsers composite alpha in gamma-encoded sRGB, so blend there too.
const over = (top, alpha, bottom) =>
  top.map((c, i) => alpha * c + (1 - alpha) * bottom[i]);
// Floor, never round: 4.496 must not display as a passing "4.50".
const fmt = (n) => (Math.floor(n * 100) / 100).toFixed(2);

// ---------------------------------------------------------------------------
// Parse tokens.css.
// ---------------------------------------------------------------------------
const palette = Object.fromEntries(
  [...css.matchAll(/--palette-([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map(
    ([, name, hex]) => [name, channels(hex)],
  ),
);

// Patterns tolerate any whitespace inside var()/color-mix(), because a
// formatter may wrap long declarations across lines.

/** `--color-role: var(--palette-name)` declarations in a chunk of CSS. */
const roleMap = (chunk) =>
  Object.fromEntries(
    [
      ...chunk.matchAll(
        /--color-([\w-]+):\s*var\(\s*--palette-([\w-]+)\s*\)/g,
      ),
    ].map(([, role, name]) => [role, name]),
  );

const themeBlock = css.match(/@theme static \{([\s\S]*?)\n\}/)?.[1] ?? "";
const defaults = roleMap(themeBlock);

// Scheme rules in source order, stopping before the prefers-contrast overrides.
// Later rules override earlier ones, mirroring the cascade.
const schemeCss = css.slice(
  css.indexOf("@layer components"),
  css.indexOf("@media (prefers-contrast"),
);
const schemes = {};
for (const [, selectors, body] of schemeCss.matchAll(
  /((?:\.scheme-[\w-]+\s*,?\s*)+)\{([^}]*)\}/g,
)) {
  for (const [, name] of selectors.matchAll(/\.scheme-([\w-]+)/g)) {
    schemes[name] = { ...schemes[name], ...roleMap(body) };
  }
}

/** `--color-name: color-mix(in srgb, var(--palette-x) NN%, transparent)` */
const overlays = Object.fromEntries(
  [
    ...themeBlock.matchAll(
      /--color-([\w-]+):\s*color-mix\(\s*in srgb,\s*var\(\s*--palette-([\w-]+)\s*\)\s+(\d+(?:\.\d+)?)%,\s*transparent\s*\)/g,
    ),
  ].map(([, role, name, pct]) => [role, { name, alpha: Number(pct) / 100 }]),
);

const failures = [];
const fail = (message) => failures.push(message);

if (Object.keys(palette).length === 0 || Object.keys(schemes).length === 0) {
  console.error(
    "check-contrast: couldn't parse palette or schemes from tokens.css. Has its structure changed?",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. .scheme-paper must equal the :root defaults (it exists to restore them).
// ---------------------------------------------------------------------------
for (const role of new Set([
  ...Object.keys(defaults),
  ...Object.keys(schemes.paper ?? {}),
])) {
  if (defaults[role] !== schemes.paper?.[role]) {
    fail(
      `scheme-paper → ${role} is "${schemes.paper?.[role]}" but the @theme default is "${defaults[role]}"`,
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Pairings, per scheme. [foreground, background, minimum, what it covers]
// ---------------------------------------------------------------------------
const PAIRS = [
  ["fg", "surface", 7, "Body text, AAA (SC 1.4.6)"],
  ["fg", "surface-raised", 7, "Body text on cards/inputs, AAA (SC 1.4.6)"],
  ["fg-muted", "surface", 4.5, "Secondary text (SC 1.4.3)"],
  [
    "fg-muted",
    "surface-raised",
    4.5,
    "Placeholders, secondary text (SC 1.4.3)",
  ],
  ["accent", "surface", 4.5, "Accent text, sale price (SC 1.4.3)"],
  ["accent", "surface-raised", 4.5, "Accent text on cards (SC 1.4.3)"],
  ["error", "surface", 4.5, "Error text (SC 1.4.3)"],
  ["error", "surface-raised", 4.5, "Error text in forms (SC 1.4.3)"],
  ["on-accent", "accent", 4.5, "Accent button label (SC 1.4.3)"],
  ["surface", "fg", 4.5, "Primary button label (SC 1.4.3)"],
  ["control", "surface", 3, "Control boundary (SC 1.4.11)"],
  ["control", "surface-raised", 3, "Input border on its fill (SC 1.4.11)"],
  ["focus", "surface", 3, "Focus ring (SC 2.4.13)"],
  ["focus", "surface-raised", 3, "Focus ring on cards (SC 2.4.13)"],
];
// Hover fills are the token at 85% over the surface (`hover:bg-fg/85`).
const HOVERS = [
  ["surface", "fg", "Primary button label on hover (SC 1.4.3)"],
  ["on-accent", "accent", "Accent button label on hover (SC 1.4.3)"],
];
const HOVER_ALPHA = 0.85;

const rows = [];
for (const [scheme, roles] of Object.entries(schemes)) {
  const rgb = (role) => palette[roles[role]];
  for (const [fg, bg, min, what] of PAIRS) {
    if (!rgb(fg) || !rgb(bg)) {
      fail(`scheme-${scheme}: missing ${!rgb(fg) ? fg : bg}`);
      continue;
    }
    rows.push({
      scheme,
      pair: `${fg} on ${bg}`,
      value: ratio(rgb(fg), rgb(bg)),
      min,
      what,
    });
  }
  for (const [text, fill, what] of HOVERS) {
    const blended = over(rgb(fill), HOVER_ALPHA, rgb("surface"));
    rows.push({
      scheme,
      pair: `${text} on ${fill}/85`,
      value: ratio(rgb(text), blended),
      min: 4.5,
      what,
    });
  }
}

// ---------------------------------------------------------------------------
// 3. Overlays: text colour over the overlay composited on the worst pixel.
//    Scrims carry the moss scheme's text; veils carry the paper scheme's.
// ---------------------------------------------------------------------------
const WHITE = [1, 1, 1];
const BLACK = [0, 0, 0];
const OVERLAYS = [
  ["scrim", "moss", WHITE, 4.5, "Any text over a photo (SC 1.4.3)"],
  [
    "scrim-subtle",
    "moss",
    WHITE,
    3,
    "Large display text over a photo (SC 1.4.3)",
  ],
  ["veil", "paper", BLACK, 4.5, "Any text over a photo (SC 1.4.3)"],
  [
    "veil-subtle",
    "paper",
    BLACK,
    3,
    "Large display text over a photo (SC 1.4.3)",
  ],
];
for (const [role, scheme, worst, min, what] of OVERLAYS) {
  const overlay = overlays[role];
  const text = palette[schemes[scheme]?.fg];
  if (!overlay || !text) {
    fail(`overlay ${role}: not found in tokens.css`);
    continue;
  }
  const composite = over(palette[overlay.name], overlay.alpha, worst);
  const worstName = worst === WHITE ? "white" : "black";
  rows.push({
    scheme,
    pair: `fg on ${role} over ${worstName}`,
    value: ratio(text, composite),
    min,
    what,
  });
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
for (const row of rows) {
  if (row.value < row.min)
    fail(
      `scheme-${row.scheme}: ${row.pair} is ${fmt(row.value)}:1, needs ${row.min}:1 (${row.what})`,
    );
}

if (markdown) {
  console.log("| Scheme | Pairing | Ratio | Minimum | Covers |");
  console.log("| ------ | ------- | ----- | ------- | ------ |");
  for (const r of rows)
    console.log(
      `| ${r.scheme} | \`${r.pair}\` | ${fmt(r.value)} | ${r.min} | ${r.what} |`,
    );
} else {
  for (const r of rows) {
    const mark = r.value >= r.min ? "✓" : "✗";
    console.log(
      `${mark} ${r.scheme.padEnd(6)} ${r.pair.padEnd(34)} ${fmt(r.value).padStart(6)} ≥ ${String(r.min).padEnd(4)} ${r.what}`,
    );
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} contrast problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
if (!markdown) console.log(`\nAll ${rows.length} pairings meet WCAG 2.2.`);
