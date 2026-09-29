#!/usr/bin/env node
// Keeps the locale files in step with the theme. Run: node scripts/check-locales.mjs
// Fails on translation keys that are used but not defined, or defined but never used.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const pluralForms = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

const read = (dirs, pattern) =>
  dirs
    .flatMap((dir) => files(join(root, dir)))
    .filter((path) => pattern.test(path))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');

const flatten = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value !== 'object') return [path];
    if (Object.keys(value).every((child) => pluralForms.has(child))) return [path];
    return flatten(value, path);
  });

const compare = (label, defined, used) => {
  const missing = [...used].filter((key) => !defined.has(key));
  const unused = [...defined].filter((key) => !used.has(key));
  missing.forEach((key) => console.error(`${label}: missing "${key}"`));
  unused.forEach((key) => console.error(`${label}: unused "${key}"`));
  return missing.length + unused.length;
};

const liquid = read(['layout', 'sections', 'snippets', 'templates'], /\.liquid$/);
const storefrontUsed = new Set(
  [...liquid.matchAll(/'([a-z0-9_]+(?:\.[a-z0-9_]+)+)'\s*\|\s*t\b/g)].map((match) => match[1])
);
for (const match of liquid.matchAll(/format:\s*'([a-z0-9_]+)'/g)) storefrontUsed.add(`date_formats.${match[1]}`);

const schemaSources = read(['sections', 'config', 'templates'], /\.(liquid|json)$/);
const schemaUsed = new Set([...schemaSources.matchAll(/"t:([a-z0-9_.]+)"/g)].map((match) => match[1]));

const storefront = new Set(flatten(JSON.parse(readFileSync(join(root, 'locales/en.default.json'), 'utf8'))));
const schema = new Set(flatten(JSON.parse(readFileSync(join(root, 'locales/en.default.schema.json'), 'utf8'))));

const problems =
  compare('en.default.json', storefront, storefrontUsed) + compare('en.default.schema.json', schema, schemaUsed);

if (problems) process.exit(1);
console.log(`Locale checks passed: ${storefront.size} storefront keys, ${schema.size} schema keys.`);
