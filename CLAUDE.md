# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Claude Code Academy — a static, single-page interactive tutorial site covering Claude Code features (CLI and macOS desktop app). React 18 + Vite 6 + Tailwind CSS 4. No backend, no APIs, no router, no test suite or linter configured. Not currently a git repository.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Serve the production build locally
```

`.claude/launch.json` defines a preview server named `academy` (npm run dev, port 5173) for use with `preview_start`. The `dist/` directory is a build artifact — deployable to any static host.

## Architecture

The app is **data-driven**: all tutorial content lives in `src/data/content.js`, and generic components render it. Adding or changing content almost never requires touching components.

- `src/data/content.js` — single source of truth:
  - `CATEGORIES`: 8 learning tracks (foundations, reference, context, control, extend, integrate, desktop, mastery).
  - `SECTIONS`: ~23 section objects. Each is self-contained with `id`, `category`, `icon`, `title`, `tagline`, `blurb`, plus optional `terminal`, `cards`, `commands`, `keys`, `tips`, `practices`, `compare`, `slashRef`. Sections render in array order.
  - `SLASH_COMMANDS`: 70+ command catalog, grouped. Independent of `SECTIONS` — not auto-generated from them.
  - Terminal-line helpers: `p()` prompt, `o()` output, `ok()` success, `dim()` muted, `claude()` Claude response, `tool()` tool call.
- `src/App.jsx` — owns all shared state (theme, active section, visited set, palette, mobile nav) and passes props/callbacks down. Plain React hooks only; no state library or Context. Theme persists to localStorage key `cca-theme`.
- `src/components/Section.jsx` — generic renderer for a section object. The one special case: `slashRef: true` skips the normal layout and renders `SlashReference.jsx` instead.
- `src/components/Terminal.jsx` — self-typing terminal demo; animation starts on scroll-into-view and is replayable.
- `src/components/CommandPalette.jsx` — ⌘K fuzzy search over sections, commands, and shortcuts.
- `src/components/Icons.jsx` — the icon set; a section's `icon` field must name one of the paths defined here.
- `src/index.css` — Tailwind 4 plus the theme. All colors are CSS variables (`--bg`, `--text`, `--accent`, etc.) defined on `:root` (light: warm cream/clay) and `html.dark`. Change colors by editing these variable declarations, not the utility classes. Custom utilities: `.card`, `.kbd`, `.terminal`, `.reveal`, `.floaty`, `.shimmer-text`.

## Adding a new tutorial section

1. Add one object to the `SECTIONS` array in `src/data/content.js` (pick an existing section as a template; choose a unique `id`, a `category` key from `CATEGORIES`, and an `icon` name from `Icons.jsx`).
2. That's it — the section automatically appears in the sidebar, mobile nav drawer, command palette search, scroll-spy, and progress bar.
3. If documenting a new slash command, also add it to `SLASH_COMMANDS` separately.

## Gotchas

- Scroll-spy uses an IntersectionObserver with rootMargin `-45% 0px -50% 0px` to pick the active section; changing section padding or `scroll-mt-24` affects highlight behavior.
- "Visited" progress only increments via scroll-spy, not command-palette navigation, and resets on refresh (not persisted).
- Fixed-element z-index stacking: mobile nav drawer is `z-30`, header is `z-40`.
- Terminal typing timing is a `setTimeout` cascade in `Terminal.jsx`; adjust constants there and re-check pacing visually.
