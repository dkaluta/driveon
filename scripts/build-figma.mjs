/* Build the Figma-import-ready static export.
 *
 * Why this exists: html.to.design (and any "URL import") needs *rendered, static
 * DOM*. The GETAWAY app is a client-rendered React SPA + router, so a naive
 * import sees an empty <div id="root"> (or only one screen). This script
 * server-renders EVERY screen to plain HTML — no React, no scripts.
 *
 * The frames are FULL-BLEED (no phone bezel), RESPONSIVE, and built from
 * flexbox flow so they import as semantic Figma Auto Layout layers.
 *
 * Outputs (figma-export/):
 *   screens/NN-<slug>.html   one full-bleed screen per file (capture one at a time)
 *   getaway-figma.html       every screen stacked (single multi-frame capture)
 *   index.html               links + import instructions
 */
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const imgDir = join(root, 'public/img');

const MIME = { '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp' };

/* Export-only overrides: strip the phone shell, make each frame a full-bleed,
   responsive, flow-based Auto Layout frame. Appended after the app stylesheet. */
const EXPORT_CSS = `
/* ---- Figma export: full-bleed, responsive, semantic Auto Layout ---- */
html,body{height:auto;margin:0;}
body{display:block;overflow:auto;background:var(--bg);}

/* each screen = a vertical Auto Layout frame sized to iPhone 16 Pro Max
   (440 × 956 pt). Width is fixed to the device; height is the device floor and
   grows for scroll-heavy screens so no content is lost. The inner layout stays
   flexbox, so children keep fill/hug constraints and resize responsively in Figma. */
.ga-frame{width:440px;min-height:956px;margin:0 auto;display:flex;flex-direction:column;
  background:var(--bg);color:var(--ink);position:relative;isolation:isolate;}
/* canvas screens (map) need a definite height for their absolute internals */
.ga-frame.ga-fixed{height:956px;}
.ga-frame .ga-content{flex:1 1 auto;display:flex;flex-direction:column;min-width:0;}

/* iPhone status bar (hugs top) */
.ga-frame .ga-statusbar-wrap{flex:0 0 auto;}
.ga-frame .ga-statusbar-wrap .statusbar{height:54px;}
/* splash: dark hero — status bar overlays the image, white glyphs */
.ga-frame.ga-splash{background:hsl(var(--brand));}
.ga-frame.ga-splash .ga-statusbar-wrap{position:absolute;top:0;left:0;right:0;z-index:5;}

/* iOS home indicator (hugs bottom) */
.ga-frame .ga-home{flex:0 0 auto;display:flex;justify-content:center;padding:7px 0 9px;}
.ga-frame .ga-home-bar{width:140px;height:5px;border-radius:3px;background:var(--ink);opacity:.32;}
.ga-frame.ga-splash .ga-home-bar{background:#fff;opacity:.6;}
.ga-frame .ga-content > .screen-pad{flex:1 1 auto;padding-bottom:28px;}
.ga-frame .ga-content > .splash,
.ga-frame .ga-content > .confirm{flex:1 1 auto;}

/* map / canvas screens keep their absolute internals but get real height */
.ga-frame.ga-fixed .ga-content.bare{flex:1 1 auto;position:relative;min-height:0;}

/* bottom nav flows in-document (hugs) instead of floating-absolute */
.ga-frame .ga-nav{display:block;}
.ga-frame .tabbar{position:relative;left:auto;right:auto;bottom:auto;
  width:auto;margin:8px 16px 22px;}

/* pinned CTA flows in-document for export (no sticky/fade) — sits at content bottom */
.ga-frame .pinned-actions{position:static;margin:auto 0 0;padding:12px 0 0;background:none;}

/* combined gallery: label strip above each centered device frame */
.ga-cell{display:flex;flex-direction:column;align-items:center;}
.ga-label{align-self:stretch;font:600 13px/1 var(--font-label);letter-spacing:.1em;
  text-transform:uppercase;color:#cfe9e2;background:#0e1b1a;padding:20px 22px 12px;margin:0;text-align:center;}
`;

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

// base64 data-URI cache, then replace every /img/<file> reference in a markup string.
const uriCache = new Map();
function dataUri(file){
  if(uriCache.has(file)) return uriCache.get(file);
  const mime = MIME[extname(file).toLowerCase()];
  const uri = `data:${mime};base64,` + readFileSync(join(imgDir,file)).toString('base64');
  uriCache.set(file, uri);
  return uri;
}
function embed(markup){
  return markup.replace(/\/img\/([A-Za-z0-9._-]+)/g, (m,f) => {
    try { return dataUri(f); } catch { return m; }
  });
}

function page({title, css, body}){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
${css}
${EXPORT_CSS}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

async function main(){
  // 1. SSR-render via Vite (handles JSX + module graph).
  const server = await createServer({ root, server:{ middlewareMode:true }, appType:'custom', logLevel:'warn' });
  let screens, gallery, galleryNew, count, newScreens;
  try {
    const mod = await server.ssrLoadModule('/src/figma/gallery.jsx');
    screens = mod.renderScreens();
    gallery = mod.renderGallery();
    galleryNew = mod.renderGalleryNew();
    count = mod.screenCount;
    newScreens = mod.newScreens;
  } finally {
    await server.close();
  }
  const isNew = (name) => newScreens.includes(name);

  const css = readFileSync(join(root, 'src/styles.css'), 'utf8');

  // 2. Fresh output dir.
  const outDir = join(root, 'figma-export');
  rmSync(outDir, { recursive:true, force:true });
  mkdirSync(join(outDir, 'screens'), { recursive:true });

  // 3. One full-bleed file per screen (each is exactly one frame).
  const links = [];
  screens.forEach((s, i) => {
    const file = `${String(i+1).padStart(2,'0')}-${slug(s.name)}.html`;
    writeFileSync(join(outDir, 'screens', file),
      page({ title:`GETAWAY — ${s.name}`, css, body: embed(s.html) }));
    links.push({ file, name:s.name });
  });

  // 4. Combined file — every frame stacked for a single capture.
  writeFileSync(join(outDir, 'getaway-figma.html'),
    page({ title:'GETAWAY — all screens (Figma import)', css, body: embed(gallery) }));

  // 4b. New-screens-only file — just the Frame-1 additions/redesigns.
  writeFileSync(join(outDir, 'getaway-new.html'),
    page({ title:'GETAWAY — new screens only (Figma import)', css, body: embed(galleryNew) }));

  // 5. Index with instructions + links.
  const list = links.map(l => `<li><a href="screens/${l.file}">${isNew(l.name)?'🆕 ':''}${l.name}</a></li>`).join('\n      ');
  const newList = links.filter(l=>isNew(l.name))
    .map(l => `<li><a href="screens/${l.file}">${l.name}</a></li>`).join('\n      ');
  writeFileSync(join(outDir, 'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>GETAWAY — Figma export</title>
<style>body{font:15px/1.6 system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#1a2b29}
h1{font-size:24px}code{background:#eef3f2;padding:1px 6px;border-radius:5px}
a{color:#2a8f82}ol{padding-left:20px}ul{columns:2;gap:24px}li{margin:2px 0}</style></head>
<body>
  <h1>GETAWAY — Figma import</h1>
  <p>Every screen is pre-rendered as JS-free HTML sized to <b>iPhone 16 Pro Max
     (440 × 956 pt)</b>, built from flexbox flow, so <b>html.to.design</b> rebuilds it as
     semantic <b>Auto Layout</b> frames that match the device and resize responsively.</p>
  <ol>
    <li>Install the <b>html.to.design</b> browser extension.</li>
    <li>Open a screen file below (or <code>getaway-figma.html</code> for all at once).</li>
    <li>Click the extension → <b>“Import current tab”</b> (not “Import from URL”).</li>
    <li>The frame(s) land in Figma with Auto Layout intact and resize responsively.</li>
  </ol>
  <h2>🆕 New screens only (Frame-1 changes)</h2>
  <p>Just the screens added or redesigned for the latest changes — open
     <code>getaway-new.html</code> to import them all at once, or pick one:</p>
  <ul>
      ${newList}
  </ul>
  <p><a href="getaway-new.html"><b>→ New screens on one page</b></a></p>
  <h2>All ${count} screens</h2>
  <ul>
      ${list}
  </ul>
  <p><a href="getaway-figma.html"><b>→ All screens on one page</b></a></p>
</body></html>
`);

  const kb = Math.round(statSync(join(outDir,'getaway-figma.html')).size / 1024);
  console.log(`\n✓ Figma export written → figma-export/`);
  console.log(`  • screens/         ${count} full-bleed, responsive, single-frame files`);
  console.log(`  • getaway-figma.html  all ${count} frames stacked (${kb} KB, self-contained)`);
  console.log(`  • getaway-new.html    ${newScreens.length} new/redesigned frames only`);
  console.log(`  • index.html       links + import steps\n`);
  console.log(`  Import: open a file → html.to.design "Import current tab" → Auto Layout frames.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
