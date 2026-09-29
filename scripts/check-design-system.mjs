#!/usr/bin/env node
// Guards the design system in docs/DESIGN_SYSTEM.md. Run: node scripts/check-design-system.mjs
// 1. Every colour-role pair on every surface meets WCAG 2.2 AA contrast.
// 2. Font sizes only use the four type tokens (plus the wordmark logo size).
// 3. No raw colours or inline style attributes outside assets/critical.css.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const critical = readFileSync(join(root, 'assets/critical.css'), 'utf8');
const failures = [];

// Tolerates line wrapping inside declarations.
const declarations = (block) => {
  const map = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map[match[1]] = match[2].replace(/\s+/g, ' ').trim();
  }
  return map;
};

const blockFor = (selector) => {
  const match = critical.match(new RegExp(`(^|\\n)${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing ${selector} block in critical.css`);
  return declarations(match[2]);
};

const rootTokens = blockFor(':root');
const surfaces = {
  paper: rootTokens,
  panel: { ...rootTokens, ...blockFor('.surface--panel') },
  dark: { ...rootTokens, ...blockFor('.surface--dark') },
};

const resolve = (tokens, value, depth = 0) => {
  const reference = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (!reference) return value;
  if (depth > 5 || !tokens[reference[1]]) throw new Error(`Cannot resolve ${value}`);
  return resolve(tokens, tokens[reference[1]], depth + 1);
};

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (a, b) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

// [foreground role, background role, minimum ratio]
const pairs = [
  ['--color-text', '--color-bg', 4.5],
  ['--color-text-muted', '--color-bg', 4.5],
  ['--color-error', '--color-bg', 4.5],
  ['--color-on-fill', '--color-fill', 4.5],
  ['--color-on-fill', '--color-fill-hover', 4.5],
  ['--color-control', '--color-bg', 3],
];

for (const [name, tokens] of Object.entries(surfaces)) {
  for (const [fg, bg, minimum] of pairs) {
    const ratio = contrast(resolve(tokens, `var(${fg})`), resolve(tokens, `var(${bg})`));
    const line = `${name.padEnd(6)} ${fg} on ${bg}: ${ratio.toFixed(2)}:1 (needs ${minimum}:1)`;
    if (ratio < minimum) failures.push(line);
    else console.log(`ok     ${line}`);
  }
}

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

const sources = ['layout', 'sections', 'snippets', 'templates', 'assets']
  .flatMap((dir) => files(join(root, dir)))
  .filter((path) => /\.(liquid|css|js)$/.test(path));

const allowedSizes = new Set(['--text-display', '--text-heading', '--text-body', '--text-small', '--wordmark-size']);

for (const path of sources) {
  const file = relative(root, path);
  const text = readFileSync(path, 'utf8');
  for (const match of text.matchAll(/font-size\s*:\s*([^;]+);/g)) {
    const token = match[1].match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1];
    if (!allowedSizes.has(token)) failures.push(`${file}: font-size must use a type token, found "${match[1].trim()}"`);
  }
  if (file === 'assets/critical.css') continue;
  for (const match of text.matchAll(/#[0-9a-f]{3,8}\b|\b(?:rgb|hsl)a?\(/gi)) {
    if (!text.slice(Math.max(0, match.index - 1), match.index).includes('&')) {
      failures.push(`${file}: raw colour "${match[0]}"; use a colour token`);
    }
  }
  if (/\sstyle="/.test(text)) failures.push(`${file}: inline style attribute; use a class`);
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('\nDesign system checks passed.');
