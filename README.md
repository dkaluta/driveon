# GETAWAY

A car-sharing app — **driver** and **car-owner** flows — implemented from the Claude Design
handoff bundle. Teal brand system, system fonts with uppercase display energy, liquid-glass
navigation, light/dark mode, and ~24 screens wired into a tappable prototype.

> Tagline: *Your next adventure is parked nearby.* · *Drive freely. Earn easily.*

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — interactive prototype
npm run build        # production build → dist/
npm run figma        # self-contained, Figma-importable export → figma-export/
npm run pages        # bundle the prototype into ONE self-contained docs/app.html
```

## Landing page (GitHub Pages)

A static marketing page lives in **`docs/`** and is ready to deploy with **GitHub Pages →
Deploy from branch → `main` / `/docs`**. No build step is required to serve it.

```
docs/
  index.html        the landing page (inline CSS + wordmark, has a YouTube placeholder)
  assets/           device-frame screenshots + favicon
  app.html          the full INTERACTIVE prototype as ONE self-contained file
                    (JS + CSS + every image inlined — runs from any path, even file://)
  screens.html      static, no-JS prototype — all 48 frames in one self-contained file
  screens-new.html  static — just the latest new/redesigned frames
  .nojekyll         lets Pages serve everything untouched
```

The landing page links the prototype two ways: **"Launch the prototype"** (`./app.html`, the
fully interactive single-file build) and **"All 48 screens (static)"** (`./screens.html`, a
JS-free page that works even with scripts disabled). Because everything is inlined, both run
from any Pages subpath (`https://<user>.github.io/<repo>/`) — no broken asset paths.

Rebuild the interactive single-file with `npm run pages`; regenerate the static screens with
`npm run figma` then copy `figma-export/getaway-figma.html` → `docs/screens.html`. Drop your
walkthrough into the YouTube placeholder in `docs/index.html`, and update the GitHub link there.

## What's here

This is a real Vite + React app, ported from the original Babel-in-browser design
prototype into clean ES modules. The visual design (CSS, layout, imagery, icons) is
preserved 1:1; only the plumbing changed (global `window.*` soup → real imports, a build
step, and a static export path).

### Screens
- **Driver:** splash → sign-up → home → search list → map → filters → car detail
  (with **"Navigate to Vehicle"** → Google Maps transit directions once reserved) →
  date/time picker → checkout (ticket-stub) → confirmation → **fuel check** (mandatory
  full-tank photo verification) → digital key (NFC unlock) → **end-trip refuel check** →
  trip completed, plus history, likes, profile, settings. The bottom-nav center button is
  the primary **search** entry point.
- **Owner:** sign-up → dashboard (animated earnings, approve/deny requests) →
  **week-view schedule** (per-day bookings + week navigation) → rental history → garage →
  list-a-car → profile.
- **Shared:** login, settings, dark mode, 4 accent themes.

### Design system highlights
- **Palette:** exact turquoise → deep-teal tokens (`src/styles.css`), HSL custom properties.
- **Type:** system font stack, UPPERCASE bold headings/buttons, tight tracking.
- **Icons:** exact Lucide geometry (`src/icons.jsx`).
- **Logo:** the GETAWAY wordmark + G-scooter mark, inlined as SVG (`src/ui.jsx`).
- **Owners can't book their own cars** — owned cars are filtered out of every driver
  browse surface, and tapping your own car shows a *Manage* (not *Book*) view.

## Project layout

```
index.html              Vite entry
src/
  main.jsx              mounts <App>
  app.jsx              router + cross-screen state + splash + tweaks
  styles.css           the full design system (copied verbatim)
  data.js              cars, owners, bookings, policies (image paths → /img/*)
  icons.jsx            exact Lucide icon set
  ui.jsx               logo, wordmark, status bar, chips, nav, cards…
  blocks.jsx           generic rows/headers/tiles shared by both flows
  screens-driver.jsx   driver-flow screens
  screens-owner.jsx    owner-flow screens
  screens-onboarding.jsx  sign-up wizards + login
  tweaks-panel.jsx     floating theme/dark/radius toolbar
  figma/gallery.jsx    static all-screens harness for the Figma export
scripts/
  build-figma.mjs      SSR-renders every screen → one JS-free HTML file
public/img/            real photos, avatars, map, splash background
```

## Importing into Figma

The earlier prototype kept failing `html.to.design` imports because it was a
client-rendered React SPA + router — the importer saw an empty `<div id="root">`, and even
when it rendered, only one screen existed in the DOM at a time.

`npm run figma` solves this for good. It server-renders **every** screen to plain,
**JS-free** static HTML, sized to **iPhone 16 Pro Max (440 × 956 pt)**. Each screen carries
full iOS chrome (status bar, the app's tab/nav bar, home indicator), no phone bezel, and is
built from **flexbox flow** — the direct analog of Figma Auto Layout — so the importer rebuilds
it as semantic Auto Layout layers (with fill/hug resizing) rather than a flattened,
absolutely-positioned mess. The stylesheet is inlined and every image embedded as a base64
data-URI, so each file is fully self-contained.

> **Device size:** frames are **440 px wide** (the iPhone 16 Pro Max point width) and **≥ 956 px
> tall** — exactly 956 for screens that fit, taller for scroll-heavy ones so no content is lost.
> In Figma they line up with the built-in *iPhone 16 Pro Max* frame preset; tall frames can be
> clipped to 956 if you want a pixel-exact device frame.

```
figma-export/
  index.html              links + import steps (with a "🆕 New screens only" section)
  getaway-figma.html      all 48 frames stacked (single multi-frame capture)
  getaway-new.html        only the new/redesigned frames (Frame-1 changes)
  screens/NN-<name>.html  one full-bleed screen per file (capture one at a time)
```

Every **per-page state** is rendered as its own static frame — not just the default view:
digital key Locked/Unlocked, fuel check Upload/Verified, end-trip refuel, car detail
Default/Liked/Reserved, Likes filled/Empty, owner week-schedule This-week/Next-week, search
Default/Filtered, every sign-up step + Processing/Verified, and Dark-mode variants of the key
screens. So the export captures states that normally only appear on interaction.

Then in Figma:
1. Open a file — `screens/05-driver-home.html` for one frame, or `getaway-figma.html` for all.
2. **html.to.design → "Import current tab"** (not "Import from URL").
3. Frames land as editable Figma Auto Layout layers (named via `data-name`) and resize responsively.

Because every file is static and self-contained, there's no JS for the importer to run and
no external assets to resolve — the round-trip comes back tidy.

Regenerate any time with `npm run figma`.

## Code Connect (Figma ↔ code)

**Status:** the component library is built in Figma (page **🧱 Components**, file
`hCgqlk4CL9NDwY2LSiBjvs`) — Badge, Button, Chip, Toggle, Stars, Stat tile, Icon (19 icons),
Header, SettingRow, NavCard, SectionCard, ProfileHeader, EntityRow, Tab bar, Heart, Status bar,
Search bar — and **all 14 Code Connect mappings are wired to those real node IDs** (0
placeholders; Search bar has no React counterpart so it isn't mapped). Publishing still requires
an Org/Enterprise Dev seat (see below).

**Code Connect** links each Figma component to its React source so Figma Dev Mode shows the real
component + props. The mappings are written for all 14 connectable components:

- `src/ui.figma.jsx` — Icon, Badge, Chips, Stars, Heart, Header, BottomTab, StatusBar
- `src/blocks.figma.jsx` — EntityRow, Toggle, SettingRow, NavCard, SectionCard, ProfileHeader
- `figma.config.json` — Code Connect config (React parser, label "GETAWAY")

Validate the code side any time (no token needed):

```bash
npm run figma:parse      # parses all mappings → prints the generated Code Connect docs
```

To finish wiring (the two inputs only you can provide):

1. **Build the Figma components** (see `figma-export/COMPONENTS.md`) and copy each one's link
   (right-click → *Copy link to selection*).
2. In `src/ui.figma.jsx` / `src/blocks.figma.jsx`, replace each placeholder URL
   (`…/REPLACE_FILE_KEY/…?node-id=ICON`, etc.) with the real link. Make sure the
   `figma.enum`/`figma.boolean` property names ('Status', 'Mode', 'On', …) match the Figma
   component's property names.
3. Add a token: `cp .env.example .env` and set `FIGMA_ACCESS_TOKEN` (scope: *Code Connect: Write*).
4. Publish:

```bash
npm run figma:publish    # pushes mappings to Figma (reads FIGMA_ACCESS_TOKEN)
npm run figma:unpublish  # removes them
```

> Tip: instead of hand-pasting URLs you can run `npx figma connect create "<figma-url>"` to
> generate a stub per component, then merge in the prop maps already written here.

See `figma-export/COMPONENTS.md` for the full atoms → organisms component plan.
