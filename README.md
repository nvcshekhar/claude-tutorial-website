# Claude Code Academy

An interactive, visual tutorial covering **every feature of Claude Code** — both the
CLI and the macOS desktop app. Built for software engineers who want to adopt the
best workflows and features in their day-to-day coding.

![tech](https://img.shields.io/badge/React-18-blue) ![tech](https://img.shields.io/badge/Vite-6-purple) ![tech](https://img.shields.io/badge/Tailwind-4-teal)

## ✨ What's inside

23 feature areas, grouped into eight learning tracks, each with a **self-typing simulated
terminal**, copyable commands, best-practice tips, and CLI-vs-Desktop comparisons:

| Track | Sections |
|-------|----------|
| **Foundations** | Getting Started · Interactive & One-Shot Modes · Built-in Slash Commands · Keyboard Shortcuts |
| **Quick Reference** | Slash Command Reference — a searchable catalog of 70+ commands |
| **Context & Memory** | CLAUDE.md Memory · Extended Thinking · Checkpoints & Rewind |
| **Control & Safety** | Plan Mode · Permissions & Modes · Settings & Configuration |
| **Extend & Automate** | Custom Slash Commands · Subagents · Hooks · MCP Servers · Agent Skills |
| **Integrate** | Git & GitHub · IDE Integrations |
| **Desktop App** | Overview & Workspace · Parallel Sessions & Worktrees · Visual Diffs & Checkpoints · Editor, Terminal & PR Monitoring |
| **Mastery** | Best Practices for Engineers |

### Interactive features
- 🖥️ **Simulated terminals** that type out real Claude Code workflows (replayable)
- 🔎 **Searchable slash-command reference** — filter 70+ commands live, with args & examples
- ⌘K **command palette** with fuzzy search across every feature, command, and shortcut
- 🌗 **Light / dark mode** in the warm Claude "clay & cream" aesthetic
- 📊 **Progress tracking** — sections you've read are checked off as you scroll
- 📋 **Copy-to-clipboard** on every command
- 📱 Fully **responsive** with a mobile nav drawer

## 🚀 Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Build for production / preview:

```bash
npm run build
npm run preview
```

The output in `dist/` is a static bundle — deploy it to GitHub Pages, Netlify,
Vercel, or any static host.

## 🧱 Project structure

```
src/
  data/content.js        # All tutorial content (data-driven sections)
  components/
    Hero.jsx             # Landing hero + animated terminal
    Section.jsx          # Generic section renderer (cards, commands, tips, tables)
    Terminal.jsx         # Self-typing simulated terminal
    CommandPalette.jsx   # ⌘K fuzzy search
    SlashReference.jsx   # Searchable slash-command catalog
    Sidebar.jsx          # Scroll-spy nav + progress
    Icons.jsx            # Inline SVG icon set
  index.css              # Theme tokens (warm clay/cream) + animations
  App.jsx                # Shell: header, theme, scroll-spy, routing
```

### Adding or editing content
Everything is driven by `src/data/content.js`. To add a feature, append a section
object (with `terminal`, `cards`, `commands`, `tips`, etc.) and it renders
automatically — no component changes needed.

## 📚 Source
Feature coverage is based on the official Claude Code documentation at
<https://docs.claude.com/en/docs/claude-code>.
