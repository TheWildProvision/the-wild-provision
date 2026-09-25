/**
 * Vite build for the theme's CSS/JS bundle.
 *
 * Shopify serves theme files from its CDN and doesn't run a build step, so Vite
 * runs locally (or in CI) and writes plain files straight into assets/:
 *
 *   src/main.ts  ─┬─▶ assets/theme.js
 *                 └─▶ assets/theme.css   (Tailwind, via src/styles/main.css)
 *
 * Both outputs are generated. Never edit them by hand. They're committed so
 * Shopify's GitHub integration can deploy without a build (see
 * docs/deployment.md). Full pipeline notes: docs/architecture.md.
 */
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/**
 * Folders containing Liquid that Tailwind scans for class names. Keep in sync
 * with the `@source` list in src/styles/main.css.
 */
const LIQUID_DIRS = ["layout", "sections", "snippets", "blocks", "templates"];

/**
 * `vite build --watch` only watches files in the JS import graph, so editing a
 * .liquid file wouldn't regenerate theme.css and new Tailwind classes would
 * be missing during `pnpm dev`. This registers the Liquid folders with the
 * watcher so any change there triggers a rebuild.
 */
function watchLiquid(): Plugin {
  return {
    name: "the-wild-provision:watch-liquid",
    apply: "build",
    buildStart() {
      if (!this.meta.watchMode) return;
      for (const dir of LIQUID_DIRS) this.addWatchFile(dir);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), watchLiquid()],

  // Keep Shopify CLI's output visible when both run under `pnpm dev`.
  clearScreen: false,

  // There's no public/ folder; static files belong in assets/ directly.
  publicDir: false,

  build: {
    outDir: "assets",

    // CRITICAL: assets/ also holds hand-managed Shopify files (icons, images).
    // Emptying it would delete them.
    emptyOutDir: false,

    // Library mode produces fixed, un-hashed file names. Shopify's `asset_url`
    // filter already appends a cache-busting version query, and fixed names
    // mean the Liquid <script>/<link> tags never need to change.
    //
    // Avoid dynamic `import()`: it would emit extra chunk files into assets/.
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "theme.js",
      cssFileName: "theme",
    },

    // Everything in assets/ gets uploaded to the storefront. Source maps
    // would be public and are not useful on the Shopify CDN.
    sourcemap: false,
  },
});
