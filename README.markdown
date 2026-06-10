# Drive⏻n

A peer-to-peer car-sharing app — **driver** and **car-owner** flows — designed as a
component library in **Figma** and **vibe-coded into a live React prototype with Claude**,
with the design and the code kept in lockstep. Teal liquid-glass design system, light/dark
mode with four accent themes, digital-key unlock, fuel verification, and **50 screens**
wired into a fully tappable prototype.

> Tagline: *Your next adventure is parked nearby.* · *Drive freely. Earn easily.*

The brand mark is **Drive⏻n** — the "o" is a power button (drive *on*), used as the wordmark,
the iOS-style app icon, and the favicon.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — interactive prototype
npm run build        # production build → dist/
npm run pages        # bundle the prototype into ONE self-contained docs/app.html
npm run figma        # self-contained, Figma-importable static export → figma-export/
```

## Live site (GitHub Pages)

The marketing **landing page** and both prototype builds live in **`docs/`**, served by
**GitHub Pages → Deploy from branch → `main` / `/docs`**. No build step is needed to serve it.

```
docs/
  index.html        the landing page (inline CSS + Drive⏻n wordmark, team, video placeholder)
  assets/           device-frame screenshots + favicon.png
  app.html          the full INTERACTIVE prototype as ONE self-contained file
                    (JS + CSS + every image inlined — runs from any path, even file://)
  screens.html      static, no-JS prototype — all 50 frames in one self-contained file
  screens-new.html  static — just the latest new/redesigned frames
  .nojekyll         lets Pages serve everything untouched
```

The landing page links the prototype two ways: **"Launch the prototype"** (`./app.html`, the
fully interactive single-file build) and **"All 50 screens (static)"** (`./screens.html`, a
JS-free page that works even with scripts disabled). Everything is inlined, so both run from
any Pages subpath — no broken asset paths.

**Serving at `dkaluta.com/getaway/`:** the apex DNS already points at GitHub Pages
(`185.199.108–111.153`, `www → dkaluta.github.io`). For the `/getaway/` subpath to resolve,
the custom domain must sit on a **user-site repo** named exactly `dkaluta.github.io`; project
repos then nest automatically at `dkaluta.com/<repo>/`. Make sure the `getaway` repo's Pages
**folder is `/docs`** (not `/ (root)`) — root serves the Vite dev `index.html` and renders blank.

Rebuild the interactive single-file with `npm run pages`; regenerate the static screens with
`npm run figma`, then copy `figma-export/getaway-figma.html` → `docs/screens.html` and
`figma-export/getaway-new.html` → `docs/screens-new.html`.

## What's here

A real Vite + React app. The design originates as a **Figma component library**; the live
prototype is **vibe-coded with Claude** and kept 1:1 with the Figma source — same screens,
tokens, components, and copy on both sides. Each side feeds the other: the app server-renders
to a Figma-importable static export, and the Figma components map back to the React source via
Code Connect.

### Screens (50)
- **Driver:** splash → sign-up (4-step wizard) → home → search list → map → filters →
  car detail (with **"Navigate to Vehicle"** → Google Maps transit directions once reserved —
  a mockup, not a live API) → date/time picker → checkout (ticket-stub) → confirmation →
  **fuel check** (mandatory full-tank photo verification before unlock) → digital key
  (NFC unlock) → **end-trip refuel check** → trip completed, plus history, likes, profile,
  settings (edit profile, payment methods, verification). The bottom-nav center button is the
  primary **search** entry point.
- **Owner:** sign-up → dashboard (animated earnings, approve/deny requests) →
  **earnings breakdown** (5-month chart, per-car rows) → **week-view schedule** (per-day
  bookings, week navigation, availability windows) → rental history → garage → list/edit-a-car
  → profile.
- **Shared:** login, settings, dark mode, four accent themes (Turquoise / Lagoon / Sunset / Violet).

Car-detail and filter screens use **pinned action bars** that float above the glass tab bar,
with the scroll content cleared so nothing hides behind them.

### Design system highlights
- **Palette:** turquoise → deep-teal HSL tokens (`src/styles.css`). Figma names the core
  brand colors **Turquoise** (`#3ee0cf`, primary), **Tradewind** (`#56b3a5`, secondary),
  **Patina** (`#5a8c86`, accent) and **Plantation** (`#25504b`, brand).
- **Type:** system font stack, UPPERCASE bold headings/buttons, tight tracking.
- **Icons:** exact Lucide geometry (`src/icons.jsx`).
- **Logo:** the **Drive⏻n** wordmark (power-button "o"), inlined as a single recolorable SVG
  (`src/ui.jsx`); power-button **app icon** (`public/img/app-icon.png`) and **favicon**
  (`public/img/favicon.png`) come straight from Figma.
- **Liquid glass:** frosted, translucent tab bars and search bars (native-feel blur + rim).
- **Owners can't book their own cars** — owned cars are filtered out of every driver browse
  surface, and tapping your own car shows a *Manage* (not *Book*) view.

## Project layout

```
index.html              Vite entry (Drive⏻n title + favicon)
src/
  main.jsx              mounts <App>
  app.jsx               router + cross-screen state + splash + tweaks
  styles.css            the full design system (HSL tokens, liquid glass, pinned bars)
  data.js               cars, owners, bookings, earnings, schedule, policies
  icons.jsx             exact Lucide icon set
  ui.jsx                Drive⏻n wordmark, status bar, chips, nav, cards…
  blocks.jsx            generic rows/headers/tiles shared by both flows
  screens-driver.jsx    driver-flow screens
  screens-owner.jsx     owner-flow screens
  screens-onboarding.jsx sign-up wizards + login
  tweaks-panel.jsx      floating theme/dark/radius toolbar
  figma/gallery.jsx     static all-screens harness for the Figma export
scripts/
  build-singlefile.mjs  bundles the prototype into ONE self-contained docs/app.html
  build-figma.mjs       SSR-renders every screen → one JS-free HTML file per screen
public/img/             real photos, avatars, map, splash bg, app icon, favicon
docs/                   GitHub Pages landing page + prototype builds
```

## Importing into Figma

`npm run figma` server-renders **every** screen to plain, **JS-free** static HTML sized to
**iPhone 16 Pro Max (440 × 956 pt)**. Each screen carries full iOS chrome (status bar, the
app's tab/nav bar, home indicator), no phone bezel, and is built from **flexbox flow** — the
direct analog of Figma Auto Layout — so `html.to.design` rebuilds it as semantic Auto Layout
layers (with fill/hug resizing) rather than a flattened, absolutely-positioned mess. The
stylesheet is inlined and every image embedded as a base64 data-URI, so each file is fully
self-contained.

```
figma-export/
  index.html              links + import steps (with a "🆕 New screens only" section)
  getaway-figma.html      all 50 frames stacked (single multi-frame capture)
  getaway-new.html        only the new/redesigned frames
  screens/NN-<name>.html  one full-bleed screen per file (capture one at a time)
```

Every **per-page state** is rendered as its own static frame — not just the default view:
digital key Locked/Unlocked, fuel check Upload/Uploaded/Verified, end-trip refuel, car detail
Default/Liked/Reserved, Likes filled/Empty, owner week-schedule This-week/Next-week, search
Default/Filtered, every sign-up step + Processing/Verified, and Dark-mode variants of the key
screens.

Then in Figma:
1. Open a file — `screens/NN-<name>.html` for one frame, or `getaway-figma.html` for all.
2. **html.to.design → "Import current tab"** (not "Import from URL").
3. Frames land as editable Auto Layout layers and resize responsively.

Regenerate any time with `npm run figma`.

## Component library & Code Connect

The Figma file (`hCgqlk4CL9NDwY2LSiBjvs`, page **🧱 Components**) holds a **30-component**
library, all variant-driven:

> Logo · Icon · Input field · Form field · Stepper · Day toggle · Earnings row · Search bar ·
> EntityRow · Owner row · Rental row · History row · SettingRow · NavCard · SectionCard ·
> ProfileHeader · Header · Tab bar · Status bar · Home Indicator · Digital key · Approve / deny ·
> Map pin · Badge · Button · Chip · Toggle · Stars · Heart · Stat tile

**Code Connect** links Figma components to their React source so Dev Mode shows the real
component + props. Mappings are written for the connectable components:

- `src/ui.figma.jsx` — Icon, Badge, Chips, Stars, Heart, Header, BottomTab, StatusBar
- `src/blocks.figma.jsx` — EntityRow, Toggle, SettingRow, NavCard, SectionCard, ProfileHeader
- `figma.config.json` — Code Connect config (React parser, label "DriveOn")

```bash
npm run figma:parse      # validate the code side (no token needed)
npm run figma:publish    # push mappings to Figma (reads FIGMA_ACCESS_TOKEN)
npm run figma:unpublish  # remove them
```

Publishing requires an Org/Enterprise Dev seat and a token with *Code Connect: Write*
(`cp .env.example .env`, set `FIGMA_ACCESS_TOKEN`).
