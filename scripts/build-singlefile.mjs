/* Build the interactive GETAWAY prototype as ONE self-contained HTML file.
 *
 * Vite normally emits index.html + assets/*.js + assets/*.css + img/*. That's
 * multi-file and its runtime /img/ paths break on a GitHub Pages subpath. This
 * script bundles the app, then inlines the JS, the CSS, and every image (as
 * base64 via window.__IMG, which src/data.js reads) into a single docs/app.html
 * that runs anywhere — no server, no relative-path assumptions.
 */
import { build } from 'vite';
import { readFileSync, writeFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = join(root, '.singlefile-tmp');
const MIME = { '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp' };

// 1. Bundle the app to a temp dir.
await build({
  root, base: './', logLevel: 'warn',
  build: { outDir: tmp, emptyOutDir: true, assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 5000 },
});

// 2. Grab the single CSS + JS chunk.
const assetsDir = join(tmp, 'assets');
const files = readdirSync(assetsDir);
const css = readFileSync(join(assetsDir, files.find(f => f.endsWith('.css'))), 'utf8');
const js  = readFileSync(join(assetsDir, files.find(f => f.endsWith('.js'))),  'utf8');

// 3. Inline every public image as base64.
const imgDir = join(root, 'public/img');
const map = {};
for (const f of readdirSync(imgDir)) {
  const mime = MIME[extname(f).toLowerCase()];
  if (!mime) continue;
  map[f] = `data:${mime};base64,` + readFileSync(join(imgDir, f)).toString('base64');
}

// 4. Assemble one self-contained document.
const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>GETAWAY — interactive prototype</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>window.__IMG=${JSON.stringify(map)};</script>
<script type="module">${js}</script>
</body>
</html>
`;
const dest = join(root, 'docs/app.html');
writeFileSync(dest, out);
rmSync(tmp, { recursive: true, force: true });

const kb = Math.round(statSync(dest).size / 1024);
console.log(`\n✓ Self-contained prototype → docs/app.html (${kb} KB, ${Object.keys(map).length} images inlined)\n`);
