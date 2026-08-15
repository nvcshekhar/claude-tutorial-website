// ============================================================================
// Claude Code Academy — content model
// Each section is fully data-driven so the UI can render consistently.
// ============================================================================

export const CATEGORIES = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'reference', label: 'Quick Reference' },
  { id: 'context', label: 'Context & Memory' },
  { id: 'control', label: 'Control & Safety' },
  { id: 'extend', label: 'Extend & Automate' },
  { id: 'integrate', label: 'Integrate' },
  { id: 'desktop', label: 'Desktop App' },
  { id: 'mastery', label: 'Mastery' },
]

// Helper line builders for the simulated terminal
const p = (text) => ({ kind: 'prompt', text })          // user types this after the prompt
const o = (text) => ({ kind: 'output', text })          // plain output
const ok = (text) => ({ kind: 'ok', text })             // success/green
const dim = (text) => ({ kind: 'dim', text })           // muted
const claude = (text) => ({ kind: 'claude', text })     // Claude speaking
const tool = (text) => ({ kind: 'tool', text })         // tool call line

export const SECTIONS = [
  // ──────────────────────────────────────────────────────────── FOUNDATIONS
  {
    id: 'getting-started',
    category: 'foundations',
    icon: 'rocket',
    title: 'Getting Started',
    tagline: 'Install in 60 seconds and say hello.',
    blurb:
      'Claude Code runs as a terminal CLI and as a native macOS desktop app. Install once, authenticate, and you have an agentic coding partner that reads, writes, and runs your code.',
    terminal: {
      title: 'install.sh',
      lines: [
        p('npm install -g @anthropic-ai/claude-code'),
        dim('added 1 package in 4s'),
        ok('✔ Claude Code installed'),
        p('cd ~/projects/my-app && claude'),
        claude("Welcome to Claude Code! I can see this is a React + TypeScript project."),
        claude('What would you like to build today?'),
      ],
    },
    cards: [
      { h: 'Install the CLI', b: 'npm install -g @anthropic-ai/claude-code, the native installer (curl -fsSL https://claude.ai/install.sh | bash), or brew install --cask claude-code.' },
      { h: 'macOS desktop app', b: 'Download the desktop app for a GUI experience with visual diffs, parallel sessions, and point-and-click checkpoints.' },
      { h: 'Authenticate', b: 'Run claude, then /login. Use your Claude (Pro/Max) subscription or an Anthropic Console API key.' },
      { h: 'Start a session', b: 'cd into any repo and run claude. Claude auto-reads your project structure and any CLAUDE.md files.' },
    ],
    commands: [
      { cmd: 'npm install -g @anthropic-ai/claude-code', desc: 'Install the CLI globally (requires Node 18+).' },
      { cmd: 'claude', desc: 'Launch the interactive REPL in the current directory.' },
      { cmd: 'claude --version', desc: 'Print the installed version.' },
      { cmd: 'claude update', desc: 'Update to the latest release.' },
      { cmd: '/login  •  /logout', desc: 'Authenticate or sign out (subscription or API key).' },
      { cmd: '/status', desc: 'Show account, model, and connection status.' },
    ],
    tips: [
      'Run /doctor (or claude doctor) if installation or auth misbehaves — it diagnoses common setup issues.',
      'The desktop app and CLI share the same account and config, so your CLAUDE.md, agents, and MCP servers follow you.',
    ],
  },

  {
    id: 'cli-basics',
    category: 'foundations',
    icon: 'terminal',
    title: 'Interactive & One-Shot Modes',
    tagline: 'A REPL for conversations, a flag for pipelines.',
    blurb:
      'Use the interactive REPL for back-and-forth work, or run Claude headlessly with -p for scripts and CI. Sessions are resumable, so you never lose context.',
    terminal: {
      title: 'modes',
      lines: [
        dim('# Interactive: just talk'),
        p('claude'),
        p('> refactor the auth module to use async/await'),
        claude('I\'ll update 3 files. Here\'s my plan...'),
        dim('# One-shot: pipe & script'),
        p('claude -p "summarize what changed" < git.diff'),
        o('This diff migrates the session store from Redis to Postgres...'),
        dim('# Resume yesterday\'s session'),
        p('claude --continue'),
        ok('✔ Restored session (42 messages, 3 files in context)'),
      ],
    },
    cards: [
      { h: 'Interactive REPL', b: 'Just run claude. Multi-turn conversation with full tool access and persistent context.' },
      { h: 'One-shot (-p)', b: 'claude -p "prompt" prints a single response and exits. Perfect for scripts, hooks, and CI.' },
      { h: 'Pipe in / out', b: 'cat file | claude -p "review this" — Claude reads stdin and writes to stdout like any Unix tool.' },
      { h: 'Resume anytime', b: '--continue resumes the most recent session; --resume opens a picker of past sessions.' },
    ],
    commands: [
      { cmd: 'claude "fix the failing test"', desc: 'Start interactive with an initial prompt.' },
      { cmd: 'claude -p "explain this regex"', desc: 'Headless one-shot, prints and exits.' },
      { cmd: 'claude -p "..." --output-format json', desc: 'Machine-readable output for scripting.' },
      { cmd: 'claude --continue', desc: 'Resume the latest conversation in this directory.' },
      { cmd: 'claude --resume', desc: 'Pick a previous session to resume.' },
      { cmd: 'claude --model opus', desc: 'Choose the model for this session.' },
    ],
    tips: [
      'Chain Claude into pipelines: git diff | claude -p "write a commit message" turns Claude into a composable Unix tool.',
      'In CI, combine -p with --output-format json and --dangerously-skip-permissions (in a sandbox) for fully automated runs.',
    ],
  },

  {
    id: 'slash-commands',
    category: 'foundations',
    icon: 'slash',
    title: 'Built-in Slash Commands',
    tagline: 'Steer the session without leaving the keyboard.',
    blurb:
      'Type / to control the session: manage context, switch models, review code, inspect costs, and configure everything. These are your cockpit controls.',
    terminal: {
      title: 'slash',
      lines: [
        p('/'),
        dim('  /clear      Reset conversation context'),
        dim('  /compact    Summarize & shrink context'),
        dim('  /model      Switch model'),
        dim('  /review     Review a PR or changes'),
        dim('  /cost       Show token usage & spend'),
        p('/compact'),
        ok('✔ Compacted 48 messages → 1 summary (context freed)'),
      ],
    },
    commands: [
      { cmd: '/help', desc: 'List all available commands.' },
      { cmd: '/clear', desc: 'Wipe conversation context for a fresh start.' },
      { cmd: '/compact', desc: 'Summarize the conversation to reclaim context window.' },
      { cmd: '/context', desc: 'Show how much of the context window is in use.' },
      { cmd: '/init', desc: 'Generate a CLAUDE.md by analyzing the codebase.' },
      { cmd: '/model', desc: 'Switch between Opus, Sonnet, Haiku, etc.' },
      { cmd: '/effort', desc: 'Set reasoning intensity (low / medium / high / xhigh).' },
      { cmd: '/thinking', desc: 'Toggle extended thinking on or off.' },
      { cmd: '/review', desc: 'Review the current diff or a pull request.' },
      { cmd: '/cost', desc: 'Show token usage and session spend.' },
      { cmd: '/memory', desc: 'Open and edit your CLAUDE.md memory files.' },
      { cmd: '/agents', desc: 'Create and manage subagents.' },
      { cmd: '/mcp', desc: 'Manage MCP server connections.' },
      { cmd: '/hooks', desc: 'Configure lifecycle hooks.' },
      { cmd: '/rewind', desc: 'Restore code/conversation to a checkpoint.' },
      { cmd: '/config', desc: 'Open settings (theme, model, behavior).' },
      { cmd: '/vim', desc: 'Enable vim keybindings in the prompt.' },
      { cmd: '/export', desc: 'Export the conversation to a file.' },
    ],
    tips: [
      '/clear between unrelated tasks keeps Claude focused and cheaper — stale context degrades answers.',
      '/compact when a long session approaches the context limit; it preserves the gist while freeing room.',
    ],
  },

  {
    id: 'shortcuts',
    category: 'foundations',
    icon: 'keyboard',
    title: 'Keyboard Shortcuts & Modes',
    tagline: 'Your fingers never leave home row.',
    blurb:
      'Special keys unlock fast interaction: jump to bash, mention files, recall memory, interrupt Claude, and cycle permission modes — all without menus.',
    terminal: {
      title: 'keys',
      lines: [
        p('! ls -la'),
        dim('(bash mode — run a shell command inline)'),
        p('@src/auth.ts  explain this file'),
        dim('(@ mentions a file directly into context)'),
        p('# always run tests with: npm test'),
        ok('✔ Saved to project memory (CLAUDE.md)'),
        dim('shift+tab → cycle: normal · auto-accept · plan'),
      ],
    },
    keys: [
      { k: '/', d: 'Slash command menu' },
      { k: '@', d: 'Mention a file or MCP resource into context' },
      { k: '#', d: 'Add a line to CLAUDE.md memory' },
      { k: '!', d: 'Bash mode — run a shell command directly' },
      { k: 'Shift + Tab', d: 'Cycle permission modes (normal → auto-accept → plan)' },
      { k: 'Esc', d: 'Interrupt Claude mid-response' },
      { k: 'Esc Esc', d: 'Open the rewind / checkpoint picker' },
      { k: 'Ctrl + B', d: 'Send a running command to the background' },
      { k: 'Ctrl + R', d: 'Toggle verbose / reverse-search history' },
      { k: 'Ctrl + L', d: 'Clear the screen (keep context)' },
      { k: 'Ctrl + C', d: 'Cancel current input' },
      { k: 'Ctrl + D', d: 'Exit Claude Code' },
      { k: '↑ / ↓', d: 'Navigate prompt history' },
    ],
    tips: [
      'Press # mid-conversation to teach Claude a durable rule — it writes straight to CLAUDE.md.',
      'Esc once interrupts; Esc-Esc rewinds. Use them to course-correct instead of letting Claude run down a wrong path.',
    ],
  },

  // ───────────────────────────────────────────────────────── QUICK REFERENCE
  {
    id: 'slash-reference',
    category: 'reference',
    icon: 'slash',
    title: 'Slash Command Reference',
    tagline: 'Every slash command, one searchable page.',
    blurb:
      'The complete catalog of built-in slash commands, grouped by purpose with arguments and a real example for each. Use the filter to jump straight to what you need — this is your day-to-day cheat sheet.',
    slashRef: true,
  },

  // ─────────────────────────────────────────────────────────── CONTEXT/MEMORY
  {
    id: 'memory',
    category: 'context',
    icon: 'book',
    title: 'CLAUDE.md Memory',
    tagline: 'Teach Claude your project once.',
    blurb:
      'CLAUDE.md files are persistent instructions Claude reads at the start of every session. Capture conventions, commands, and architecture so you never repeat yourself.',
    terminal: {
      title: 'CLAUDE.md',
      lines: [
        p('/init'),
        tool('Analyzing repository structure...'),
        ok('✔ Created CLAUDE.md with build commands, conventions & layout'),
        p('# use pnpm, never npm. Run `pnpm test` before committing.'),
        ok('✔ Appended to project memory'),
        dim('Loaded next session automatically — no re-explaining.'),
      ],
    },
    cards: [
      { h: 'Project memory', b: './CLAUDE.md (committed) — shared team conventions, build commands, architecture notes.' },
      { h: 'User memory', b: '~/.claude/CLAUDE.md — your personal global preferences across every project.' },
      { h: 'Local overrides', b: 'CLAUDE.local.md — personal, git-ignored notes for a single repo.' },
      { h: 'Imports', b: 'Use @path/to/file inside CLAUDE.md to pull in other docs and build a memory hierarchy.' },
    ],
    commands: [
      { cmd: '/init', desc: 'Bootstrap a CLAUDE.md from your codebase.' },
      { cmd: '/memory', desc: 'Open memory files in your editor.' },
      { cmd: '# <text>', desc: 'Quick-add a rule to memory from the prompt.' },
      { cmd: '@docs/architecture.md', desc: 'Import another file into CLAUDE.md.' },
    ],
    tips: [
      'Keep CLAUDE.md tight and high-signal — it is prepended to every prompt, so bloat costs tokens and focus.',
      'Record the non-obvious: gotchas, naming rules, "always run X before Y". Skip what Claude can infer from the code.',
    ],
  },

  {
    id: 'thinking',
    category: 'context',
    icon: 'brain',
    title: 'Extended Thinking',
    tagline: 'Trade tokens for deeper reasoning.',
    blurb:
      'Prompt Claude to think harder on tricky problems. Escalating phrases allocate progressively more reasoning budget before Claude acts.',
    terminal: {
      title: 'think',
      lines: [
        p('> think hard about why this race condition only happens under load'),
        dim('✻ Thinking…'),
        claude('Three interacting factors: the connection pool caps at 10, the'),
        claude('retry backoff is synchronous, and the lock is released before the'),
        claude('write commits. Under load, requests 11+ retry into the same window…'),
      ],
    },
    cards: [
      { h: '"think"', b: 'A modest reasoning boost for moderately tricky problems.' },
      { h: '"think hard" / "think harder"', b: 'More budget for gnarly logic, design trade-offs, or subtle bugs.' },
      { h: '"ultrathink"', b: 'Maximum reasoning budget for the hardest architectural or debugging problems.' },
      { h: 'When to use', b: 'Race conditions, algorithm design, refactors with many constraints, ambiguous requirements.' },
    ],
    tips: [
      'Reserve deep thinking for genuinely hard problems — for simple edits it just spends tokens and time.',
      'Pair extended thinking with Plan Mode: think hard, produce a plan, review it, then execute.',
    ],
  },

  {
    id: 'checkpoints',
    category: 'context',
    icon: 'rewind',
    title: 'Checkpoints & Rewind',
    tagline: 'An undo button for the agent.',
    blurb:
      'Claude Code automatically checkpoints your code and conversation as it works. If a change goes sideways, rewind to any earlier point instantly.',
    terminal: {
      title: 'rewind',
      lines: [
        p('(press Esc Esc)'),
        dim('  ◷ Checkpoint 3 — before refactor (2 files)'),
        dim('  ◷ Checkpoint 2 — added tests'),
        dim('  ◷ Checkpoint 1 — initial state'),
        p('↑ select Checkpoint 1 · Enter'),
        ok('✔ Restored code + conversation to Checkpoint 1'),
      ],
    },
    cards: [
      { h: 'Automatic', b: 'Checkpoints are captured before edits — no manual snapshots needed.' },
      { h: 'Esc Esc or /rewind', b: 'Open the picker and jump back to any prior state.' },
      { h: 'Restores code & chat', b: 'Choose to rewind code, conversation, or both.' },
      { h: 'Safe experimentation', b: 'Let Claude try a bold refactor; rewind cleanly if you don\'t like it.' },
    ],
    tips: [
      'Checkpoints complement git — they let you undo within a session even before you commit.',
      'In the desktop app, checkpoints are visual: click any point in the timeline to restore.',
    ],
  },

  // ─────────────────────────────────────────────────────────── CONTROL/SAFETY
  {
    id: 'plan-mode',
    category: 'control',
    icon: 'map',
    title: 'Plan Mode',
    tagline: 'Look before you leap.',
    blurb:
      'Plan Mode lets Claude explore and propose a complete plan without touching your files. Review and approve before a single line changes — ideal for big or risky tasks.',
    terminal: {
      title: 'plan-mode',
      lines: [
        dim('shift+tab → Plan Mode ⏸  (read-only)'),
        p('> migrate the REST endpoints to tRPC'),
        tool('Reading routes/, controllers/, types/...'),
        claude('Plan:\n  1. Add tRPC router scaffold\n  2. Port 6 endpoints\n  3. Update client calls\n  4. Remove Express routes'),
        dim('[ Approve plan ] to begin editing'),
        ok('✔ Approved — switching to execution'),
      ],
    },
    cards: [
      { h: 'Read-only exploration', b: 'Claude reads and reasons but cannot edit or run mutating commands.' },
      { h: 'shift+tab to enter', b: 'Cycle permission modes; Plan Mode is one of them.' },
      { h: 'Approve to execute', b: 'ExitPlanMode presents the plan; you approve before any change.' },
      { h: 'Great for big tasks', b: 'Migrations, refactors, and anything where a wrong turn is expensive.' },
    ],
    tips: [
      'Start ambiguous or large tasks in Plan Mode — you catch misunderstandings before code is touched.',
      'Combine with "think hard" so the plan itself is well-reasoned.',
    ],
  },

  {
    id: 'permissions',
    category: 'control',
    icon: 'shield',
    title: 'Permissions & Modes',
    tagline: 'You decide how much rope.',
    blurb:
      'Claude asks before running tools by default. Tune that with permission modes and allow/ask/deny rules in settings.json — from cautious to fully autonomous.',
    terminal: {
      title: 'settings.json',
      lines: [
        o('{'),
        o('  "permissions": {'),
        ok('    "allow": ["Bash(npm run test:*)", "Read", "Edit"],'),
        o('    "ask":   ["Bash(git push:*)"],'),
        dim('    "deny":  ["Read(./.env)", "Bash(rm -rf:*)"]'),
        o('  }'),
        o('}'),
      ],
    },
    cards: [
      { h: 'normal', b: 'Default — Claude asks before edits and shell commands.' },
      { h: 'acceptEdits', b: 'Auto-accept file edits; still asks for riskier commands. (shift+tab)' },
      { h: 'plan', b: 'Read-only planning mode — no mutations at all.' },
      { h: 'auto', b: 'Hands-off mode — a safety classifier vets actions in the background.' },
      { h: 'bypassPermissions', b: '--dangerously-skip-permissions: no prompts. Use only in sandboxes/CI.' },
    ],
    commands: [
      { cmd: '/permissions', desc: 'View and edit allow/ask/deny rules interactively.' },
      { cmd: '"allow": ["Edit", "Bash(npm:*)"]', desc: 'Auto-approve matching tools.' },
      { cmd: '"deny": ["Read(./secrets/**)"]', desc: 'Hard-block sensitive paths or commands.' },
      { cmd: 'claude --dangerously-skip-permissions', desc: 'Full autonomy — sandboxes only.' },
    ],
    tips: [
      'Deny rules are your safety net: block .env reads and destructive commands regardless of mode.',
      'Grant allow rules for the safe, repetitive things (tests, formatters) to cut prompt fatigue without going fully autonomous.',
    ],
  },

  {
    id: 'settings',
    category: 'control',
    icon: 'sliders',
    title: 'Settings & Configuration',
    tagline: 'One JSON file to rule the behavior.',
    blurb:
      'settings.json controls models, permissions, hooks, env vars, status line, and more — layered from user to project to local, so teams share a baseline and individuals override.',
    terminal: {
      title: 'hierarchy',
      lines: [
        dim('Precedence (low → high):'),
        o('  ~/.claude/settings.json            (user / global)'),
        o('  .claude/settings.json              (project, committed)'),
        ok('  .claude/settings.local.json        (personal, git-ignored)'),
        dim('  enterprise managed policy          (highest)'),
      ],
    },
    cards: [
      { h: 'model', b: 'Default model for sessions (e.g. "opus", "sonnet").' },
      { h: 'permissions', b: 'allow / ask / deny tool rules (see Permissions).' },
      { h: 'hooks', b: 'Shell commands wired to lifecycle events.' },
      { h: 'env', b: 'Environment variables injected into Claude\'s shell.' },
      { h: 'statusLine', b: 'A custom command rendered as your status bar.' },
      { h: 'outputStyle', b: 'Switch Claude\'s response persona / format.' },
    ],
    commands: [
      { cmd: '/config', desc: 'Open the interactive settings UI.' },
      { cmd: '.claude/settings.json', desc: 'Project settings, committed for the team.' },
      { cmd: '.claude/settings.local.json', desc: 'Personal overrides, git-ignored.' },
      { cmd: '~/.claude/settings.json', desc: 'Your global defaults across all projects.' },
    ],
    tips: [
      'Commit .claude/settings.json so the whole team inherits the same permissions, hooks, and model defaults.',
      'Keep secrets out of settings — use env references and deny-read rules for credential files.',
    ],
  },

  // ─────────────────────────────────────────────────────────── EXTEND/AUTOMATE
  {
    id: 'custom-commands',
    category: 'extend',
    icon: 'wand',
    title: 'Custom Slash Commands',
    tagline: 'Turn your prompts into reusable verbs.',
    blurb:
      'Save a prompt as a Markdown file in .claude/commands/ and it becomes a /command. Parameterize with $ARGUMENTS and namespace with folders.',
    terminal: {
      title: '.claude/commands/fix-issue.md',
      lines: [
        o('---'),
        o('description: Fix a GitHub issue end-to-end'),
        o('argument-hint: <issue-number>'),
        o('---'),
        o('Read issue #$ARGUMENTS, reproduce it, write a failing test,'),
        o('fix it, and open a PR.'),
        p('/fix-issue 482'),
        ok('✔ Running your custom workflow on issue #482'),
      ],
    },
    cards: [
      { h: 'It\'s just Markdown', b: 'A file at .claude/commands/name.md becomes /name.' },
      { h: '$ARGUMENTS', b: 'Inject text after the command, e.g. /fix-issue 482.' },
      { h: 'Frontmatter', b: 'Add description, argument-hint, allowed-tools, and model.' },
      { h: 'Namespacing', b: 'Subfolders become prefixes: commands/db/migrate.md → /db:migrate.' },
    ],
    commands: [
      { cmd: '.claude/commands/<name>.md', desc: 'Project-scoped command (shared with team).' },
      { cmd: '~/.claude/commands/<name>.md', desc: 'Personal command across all projects.' },
      { cmd: '$ARGUMENTS', desc: 'Placeholder for everything typed after the command.' },
      { cmd: '!`git diff`', desc: 'Embed live shell output into the command prompt.' },
    ],
    tips: [
      'Codify team rituals — /review-pr, /ship, /write-tests — so everyone runs the same high-quality prompt.',
      'Use the allowed-tools frontmatter to scope what a command may do.',
    ],
  },

  {
    id: 'subagents',
    category: 'extend',
    icon: 'agents',
    title: 'Subagents',
    tagline: 'Delegate to specialists, in parallel.',
    blurb:
      'Subagents are purpose-built assistants with their own prompt, tools, and context window. Claude dispatches them for focused tasks — and can run several at once.',
    terminal: {
      title: '.claude/agents/reviewer.md',
      lines: [
        o('---'),
        o('name: code-reviewer'),
        o('description: Reviews diffs for bugs & style'),
        o('tools: Read, Grep, Bash'),
        o('model: sonnet'),
        o('---'),
        o('You are a meticulous senior reviewer...'),
        p('> review my changes with the code-reviewer agent'),
        tool('⇢ Dispatching code-reviewer (isolated context)'),
        ok('✔ 2 issues found, 1 nit — full report returned'),
      ],
    },
    cards: [
      { h: 'Isolated context', b: 'Each subagent has its own window, so it won\'t pollute your main thread.' },
      { h: 'Scoped tools', b: 'Grant only the tools a specialist needs (e.g. read-only reviewer).' },
      { h: 'Parallel fan-out', b: 'Run multiple agents at once for search, review, or multi-file work.' },
      { h: 'Built-in & custom', b: 'Ships with Explore and Plan agents; define your own in .claude/agents/. Manage all via /agents.' },
    ],
    commands: [
      { cmd: '/agents', desc: 'Create and manage subagents interactively.' },
      { cmd: '.claude/agents/<name>.md', desc: 'Define an agent: name, description, tools, model.' },
      { cmd: '"use the X agent to ..."', desc: 'Ask Claude to delegate to a specific agent.' },
    ],
    tips: [
      'Use read-only reviewer/researcher agents to keep your main context clean and focused on building.',
      'Write a sharp description — Claude uses it to decide when to auto-delegate.',
    ],
  },

  {
    id: 'hooks',
    category: 'extend',
    icon: 'hook',
    title: 'Hooks',
    tagline: 'Run your code on Claude\'s lifecycle.',
    blurb:
      'Hooks are shell commands triggered by events — before/after a tool runs, when you submit a prompt, or when Claude stops. Enforce policy, auto-format, notify, and gate actions.',
    terminal: {
      title: 'settings.json › hooks',
      lines: [
        o('"hooks": {'),
        o('  "PostToolUse": [{'),
        o('    "matcher": "Edit|Write",'),
        ok('    "hooks": [{ "type": "command",'),
        ok('      "command": "prettier --write $CLAUDE_FILE_PATHS" }]'),
        o('  }]'),
        o('}'),
        dim('→ Every file Claude edits is auto-formatted.'),
      ],
    },
    cards: [
      { h: 'PreToolUse', b: 'Runs before a tool — return non-zero to block it (e.g. forbid edits to /dist).' },
      { h: 'PostToolUse', b: 'Runs after a tool — auto-format, lint, or run tests.' },
      { h: 'UserPromptSubmit', b: 'Fires when you submit — inject context or validate input.' },
      { h: 'Stop / SubagentStop', b: 'Fires when Claude finishes — gate completion or notify.' },
      { h: 'SessionStart', b: 'Fires on launch — load environment or print a banner.' },
      { h: 'Notification', b: 'Fires on notifications — wire up desktop/Slack alerts.' },
    ],
    commands: [
      { cmd: '/hooks', desc: 'Configure hooks interactively.' },
      { cmd: '"matcher": "Edit|Write"', desc: 'Regex selecting which tools trigger the hook.' },
      { cmd: 'exit 2 (in PreToolUse)', desc: 'Block the tool call and feed stderr back to Claude.' },
      { cmd: '$CLAUDE_FILE_PATHS', desc: 'Env var with the files involved in the event.' },
    ],
    tips: [
      'Auto-format on PostToolUse so Claude\'s edits always match your style — no nagging required.',
      'Use a PreToolUse hook as a guardrail: block writes to generated dirs or commands you never want run.',
    ],
  },

  {
    id: 'mcp',
    category: 'extend',
    icon: 'plug',
    title: 'MCP Servers',
    tagline: 'Give Claude access to your whole stack.',
    blurb:
      'The Model Context Protocol connects Claude to external tools and data — GitHub, databases, Sentry, Figma, Slack, and thousands more — as first-class tools and @-mentionable resources.',
    terminal: {
      title: 'mcp',
      lines: [
        p('claude mcp add github -- npx -y @modelcontextprotocol/server-github'),
        ok('✔ Added MCP server "github" (stdio)'),
        p('/mcp'),
        ok('  ● github     connected · 14 tools'),
        ok('  ● postgres   connected · 6 tools'),
        p('@github:issue://482  what\'s the repro?'),
        claude('Issue #482 reproduces when the cache TTL is 0...'),
      ],
    },
    cards: [
      { h: 'Add a server', b: 'claude mcp add <name> -- <command>, or via .mcp.json for the team.' },
      { h: 'Transports', b: 'stdio (local process), SSE, and HTTP (remote/hosted) servers.' },
      { h: 'Scopes', b: 'local (you), project (.mcp.json, committed), or user (global).' },
      { h: '@-mention resources', b: 'Pull MCP resources straight into context with @server:resource.' },
    ],
    commands: [
      { cmd: 'claude mcp add <name> -- <cmd>', desc: 'Register a stdio MCP server.' },
      { cmd: 'claude mcp add --transport http <name> <url>', desc: 'Add a remote HTTP server.' },
      { cmd: 'claude mcp list', desc: 'List configured servers.' },
      { cmd: '/mcp', desc: 'Inspect connections, tools, and auth in-session.' },
      { cmd: '.mcp.json', desc: 'Project-scoped servers shared with the team.' },
    ],
    tips: [
      'Commit .mcp.json so teammates get the same integrations on first run.',
      'Connect your issue tracker and observability tools — Claude can read a bug report and a stack trace, then fix it.',
    ],
  },

  {
    id: 'skills',
    category: 'extend',
    icon: 'sparkles',
    title: 'Agent Skills',
    tagline: 'Reusable expertise Claude loads on demand.',
    blurb:
      'Skills package instructions, scripts, and resources into a folder Claude discovers and invokes automatically when relevant — like giving Claude a specialized playbook.',
    terminal: {
      title: '.claude/skills/pdf/SKILL.md',
      lines: [
        o('---'),
        o('name: pdf-forms'),
        o('description: Fill and extract PDF form fields'),
        o('---'),
        o('# How to fill a PDF'),
        o('Use ./scripts/fill.py with a field map...'),
        p('> fill out this tax form PDF'),
        tool('✻ Skill "pdf-forms" activated'),
        ok('✔ Completed using the skill\'s bundled script'),
      ],
    },
    cards: [
      { h: 'SKILL.md', b: 'A folder with a SKILL.md (name + description + instructions) Claude auto-discovers.' },
      { h: 'Model-invoked', b: 'Claude reads the description and activates the skill when the task matches.' },
      { h: 'Bundles resources', b: 'Ship scripts, templates, and reference docs alongside the instructions.' },
      { h: 'Shareable', b: 'Drop skills in .claude/skills/ (project) or ~/.claude/skills/ (personal), or via plugins.' },
    ],
    tips: [
      'Write a precise description — it is the trigger Claude matches against, so make it specific.',
      'Skills shine for repeatable, tool-heavy procedures (report generation, data formats, branded docs).',
    ],
  },

  // ─────────────────────────────────────────────────────────────── INTEGRATE
  {
    id: 'git-github',
    category: 'integrate',
    icon: 'git',
    title: 'Git & GitHub',
    tagline: 'From diff to merged PR.',
    blurb:
      'Claude is fluent in git and the gh CLI. It writes clean commits, opens pull requests, and — with the GitHub app — reviews PRs and responds to @claude mentions right in your repo.',
    terminal: {
      title: 'git',
      lines: [
        p('> commit my changes and open a PR'),
        tool('git add -A && git commit -m "feat: add rate limiting"'),
        tool('gh pr create --fill'),
        ok('✔ PR #129 opened → github.com/acme/api/pull/129'),
        dim('Tip: @claude in a PR comment to trigger a review.'),
      ],
    },
    cards: [
      { h: 'Smart commits', b: 'Claude reads the diff and writes descriptive, conventional commit messages.' },
      { h: 'Pull requests', b: 'Opens PRs via gh with a generated summary and test plan.' },
      { h: 'GitHub app', b: '/install-github-app enables @claude mentions and automated PR review.' },
      { h: 'CI / Actions', b: 'Run Claude headlessly in GitHub Actions for automated triage and fixes.' },
    ],
    commands: [
      { cmd: '"commit and push"', desc: 'Stage, write a message, commit, and push.' },
      { cmd: '"open a PR"', desc: 'Create a pull request with a generated body.' },
      { cmd: '/install-github-app', desc: 'Set up @claude mentions & PR review in your repo.' },
      { cmd: '/review', desc: 'Review the current PR or working changes.' },
    ],
    tips: [
      'Let Claude write the commit message from the actual diff — it is more accurate than what you\'d dash off.',
      'In Actions, gate merges on a Claude review step for an always-on first-pass reviewer.',
    ],
  },

  {
    id: 'ide',
    category: 'integrate',
    icon: 'code',
    title: 'IDE Integrations',
    tagline: 'Claude inside your editor.',
    blurb:
      'Official extensions for VS Code (and forks) and JetBrains IDEs surface Claude\'s edits as native diffs, share your selection and diagnostics, and let you launch sessions without leaving the editor.',
    terminal: {
      title: 'ide',
      lines: [
        p('/ide'),
        ok('✔ Connected to VS Code'),
        dim('Edits now appear as inline diffs in the editor.'),
        dim('Your active selection & linter errors are shared automatically.'),
        p('(select code) > explain this function'),
        claude('This memoizes the selector to avoid re-renders...'),
      ],
    },
    cards: [
      { h: 'VS Code extension', b: 'Inline diffs, selection sharing, and one-click session launch.' },
      { h: 'JetBrains plugin', b: 'Same power across IntelliJ, PyCharm, GoLand, WebStorm, and more.' },
      { h: 'Native diff review', b: 'Accept or reject Claude\'s edits with your editor\'s diff UI.' },
      { h: 'Diagnostics aware', b: 'Claude sees linter/compiler errors and your current selection.' },
    ],
    commands: [
      { cmd: '/ide', desc: 'Connect Claude Code to the running IDE.' },
      { cmd: 'Run claude in the IDE terminal', desc: 'Auto-detects and links the editor.' },
      { cmd: 'Install from the marketplace', desc: 'Search "Claude Code" in VS Code / JetBrains.' },
    ],
    tips: [
      'Reviewing edits as native IDE diffs is faster and safer than scrolling terminal output.',
      'Select code before asking — Claude focuses on exactly what you highlighted.',
    ],
  },

  // ───────────────────────────────────────────────────────────── DESKTOP APP
  {
    id: 'desktop-workspace',
    category: 'desktop',
    icon: 'desktop',
    title: 'Overview & Workspace',
    tagline: 'One window, three tabs, a workspace you arrange yourself.',
    blurb:
      'The Claude desktop app (macOS and Windows) has three tabs: Chat for conversations, Cowork for Dispatch and longer agentic work, and Code for software development. The Code tab is a full visual workspace built around panes you arrange in any layout — a session sidebar on the left, the chat transcript with inline edits in the center, and draggable panes for diff, preview, terminal, file, plan, tasks, and subagent. It runs the same engine as the CLI and shares the same CLAUDE.md, MCP servers, hooks, skills, and settings.',
    terminal: {
      title: 'Code tab — workspace layout',
      lines: [
        dim('▣ Tabs:  [ Chat ]  [ Cowork ]  [ Code ◀ ]'),
        dim('▣ Sidebar · sessions · filter by status/project/env'),
        p('Refactor the auth module to use async sessions'),
        claude('Reading src/auth/… and project CLAUDE.md'),
        tool('Edit  src/auth/session.py   +24 -7'),
        dim('▣ Center: chat + inline edits  ·  click +24 -7 → diff'),
        dim('▣ Views menu: diff · preview · terminal · file · tasks'),
        dim('▣ Drag a pane header to rearrange · Cmd+\\ closes it'),
        ok('Shares config with CLI — same CLAUDE.md, MCP, settings'),
        dim('Tip: run /desktop in the CLI to hand a session over'),
      ],
    },
    compare: {
      title: 'CLI vs. Desktop',
      rows: [
        { feature: 'Multiple sessions', cli: 'Separate terminal windows', desktop: 'Sidebar tabs in one window, viewable side by side' },
        { feature: 'Reviewing changes', cli: 'ANSI diff in the terminal', desktop: 'Side-by-side visual diff viewer with line comments' },
        { feature: 'Session isolation', cli: '--worktree flag', desktop: 'Automatic git worktree per session' },
        { feature: 'Model & permission mode', cli: '--model / --permission-mode flags', desktop: 'Dropdowns by the send button, changeable mid-session' },
        { feature: 'Config (CLAUDE.md, MCP)', cli: 'Read from the same files', desktop: 'Shared — identical files, separate history' },
        { feature: 'Scripting / headless', cli: '--print, Agent SDK', desktop: 'Not available — interactive only' },
      ],
    },
    cards: [
      { h: 'Three tabs', b: 'Chat for conversation, Cowork for Dispatch and long agentic runs, and Code for development — this track lives entirely in the Code tab.' },
      { h: 'Pane-based layout', b: 'Arrange chat, diff, preview, terminal, file, plan, tasks, and subagent panes by dragging their headers; open more from the Views menu.' },
      { h: 'Session-centric', b: 'Each conversation is a session with its own chat history, project folder, model, permission mode, and isolated code changes.' },
      { h: 'Same engine as the CLI', b: 'Desktop runs the identical Claude Code engine and reads the same CLAUDE.md, MCP servers, hooks, skills, and settings.json files.' },
    ],
    tips: [
      'Already in the terminal? Run /desktop in the CLI to save the current session and reopen it in the desktop app (subscription login on macOS/Windows; not available with API key, Bedrock, Vertex, or Foundry auth).',
      'Press Cmd+/ (Ctrl+/ on Windows) inside the Code tab to see every keyboard shortcut; Ctrl+O cycles transcript view modes (Normal, Verbose, Summary).',
    ],
  },

  {
    id: 'desktop-parallel',
    category: 'desktop',
    icon: 'agents',
    title: 'Parallel Sessions & Worktrees',
    tagline: 'Run many sessions at once, each in its own isolated copy of the repo.',
    blurb:
      'Click + New session (Cmd+N, or Ctrl+N on Windows) to work on several tasks in parallel. For git repositories each session gets its own isolated copy of your project via git worktrees, stored under <project-root>/.claude/worktrees/ by default, so changes in one session never touch another until you commit. Each session carries its own branch, working directory, model, and permission mode. Cmd-click a session to view two at once, filter or group the sidebar by project, and watch background subagents and shell commands in the tasks pane.',
    terminal: {
      title: 'Sidebar — parallel sessions',
      lines: [
        dim('▣ Session sidebar · 3 sessions · grouped by project'),
        dim('  ● auth-refactor   opus    acceptEdits   +24 -7'),
        dim('  ● flaky-test-fix  sonnet  plan          running'),
        dim('  ● dep-bump        opus    ask           Dispatch ⚡'),
        ok('Each session → its own git worktree (isolated branch)'),
        dim('.claude/worktrees/auth-refactor   branch: cc/auth-refactor'),
        p('Cmd+click flaky-test-fix → open second pane'),
        dim('▣ Tasks pane: subagent · background `npm test` (live)'),
        claude('Tests green in worktree — safe to commit'),
        dim('Hover a session → archive icon removes its worktree'),
      ],
    },
    cards: [
      { h: 'True parallelism', b: 'Run a refactor, a test fix, and a dependency bump simultaneously; Ctrl+Tab cycles sessions and an OS notification fires when one finishes a task you aren\'t viewing.' },
      { h: 'Git worktree isolation', b: 'Each repo session works in its own worktree under .claude/worktrees/, so concurrent sessions never collide before you commit.' },
      { h: 'Per-session settings', b: 'Branch, working directory, model, and permission mode are all scoped to the individual session and editable mid-run.' },
      { h: 'Background & Dispatch panel', b: 'The tasks pane shows subagents and background shell commands; Dispatch-spawned sessions appear in the sidebar with a Dispatch badge.' },
    ],
    tips: [
      'Set a custom worktree location and a branch prefix in Settings → Claude Code to keep Claude-created branches organized.',
      'Add a .worktreeinclude file in your project root to copy gitignored files like .env into each new worktree; turn on Auto-archive after PR merge/close to clean up finished local sessions automatically.',
    ],
  },

  {
    id: 'desktop-diffs',
    category: 'desktop',
    icon: 'rewind',
    title: 'Visual Diffs & Checkpoints',
    tagline: 'Review every change visually, comment line by line, and rewind without fear.',
    blurb:
      'When Claude edits files a diff stats indicator like +12 -1 appears; click it to open the diff viewer with a file list on the left and changes on the right. Click any line to leave a comment, then submit all comments at once with Cmd+Enter and Claude revises. Behind the scenes, every prompt creates a checkpoint, so /rewind (or double-Esc on an empty input) lets you restore code, conversation, or both to any earlier message — and checkpoints persist across sessions.',
    terminal: {
      title: 'Diff viewer + rewind menu',
      lines: [
        tool('Edit  src/auth/session.py   +24 -7'),
        dim('▣ Click +24 -7 → diff viewer (files left · changes right)'),
        dim('  - def login(user):'),
        dim('  + async def login(user, session):'),
        p('Click line → comment: "guard against null session"'),
        dim('Submit all comments: Cmd+Enter → Claude revises'),
        ok('Review code button flags real bugs, not style nits'),
        dim('▣ /rewind (or double-Esc on empty input) opens menu:'),
        dim('  ▸ Restore code and conversation  ▸ Restore conversation'),
        dim('  ▸ Restore code  ▸ Summarize from / up to here'),
      ],
    },
    cards: [
      { h: 'Side-by-side diffs', b: 'A stats indicator like +12 -1 opens a file-list-plus-changes viewer so you review modifications file by file before opening a PR.' },
      { h: 'Comment and revise', b: 'Click any diff line to add a comment, batch-submit with Cmd+Enter, and Claude reads your feedback and returns a fresh diff.' },
      { h: 'Built-in code review', b: 'The Review code button in the diff toolbar asks Claude to flag compile errors, logic bugs, and security issues — skipping style and lint-level noise.' },
      { h: 'Checkpoint & rewind', b: 'Every prompt auto-checkpoints; the rewind menu restores code, conversation, or both to a chosen message, and checkpoints persist across sessions.' },
    ],
    tips: [
      "Rewind only undoes Claude's file-editing tools — changes made by bash commands (rm, mv, cp) and external edits aren't tracked, so keep using git for permanent history.",
      'Use Summarize from here / Summarize up to here in the rewind menu to compress one side of the conversation and free context without reverting any files.',
    ],
  },

  {
    id: 'desktop-integrate',
    category: 'desktop',
    icon: 'code',
    title: 'Integrated Editor, Terminal & PR Monitoring',
    tagline: 'Edit files, run commands, and watch your PR through CI — all in the app.',
    blurb:
      'Click a file path in chat or the diff to open it in the file pane for spot edits, then save it back. The integrated terminal (Ctrl+`) opens in the session\'s working directory and shares Claude\'s environment, so npm test and git status see the same files. After you open a pull request a CI status bar appears with Auto-fix and Auto-merge toggles, powered by the GitHub CLI. And computer use lets Claude open apps and control your screen on macOS or Windows for tasks nothing else can reach.',
    terminal: {
      title: 'Editor · terminal · PR monitor',
      lines: [
        dim('▣ Click a file path → file pane · edit · Save'),
        p('Ctrl+`  → open integrated terminal'),
        tool('$ npm test     (same cwd + env as Claude)'),
        ok('12 passing  ·  shares the session\'s worktree'),
        claude('Opening pull request via gh…'),
        dim('▣ CI status bar:  build ✓  lint ✓  e2e ✗'),
        dim('  [ Auto-fix ●ON ]   [ Auto-merge ○OFF ]'),
        claude('e2e failed — reading log, pushing a fix…'),
        ok('All checks green · desktop notification sent'),
        dim('Computer use: Allow for this session · Deny'),
      ],
    },
    cards: [
      { h: 'File editor pane', b: 'Open any file path from chat or the diff for code or markdown spot edits, with a stale-on-disk warning and Discard to revert (local and SSH sessions).' },
      { h: 'Integrated terminal', b: 'Ctrl+` opens a terminal in the session\'s working directory sharing Claude\'s environment; add tabs with + (local sessions only).' },
      { h: 'Native PR monitoring', b: 'After you open a PR, a CI status bar polls checks via the gh CLI, with Auto-fix and Auto-merge (squash) toggles and a finish notification.' },
      { h: 'Computer use', b: 'A research preview on macOS and Windows (Pro or Max) that lets Claude open apps and control your screen for native GUIs nothing else can reach.' },
    ],
    tips: [
      'PR monitoring needs the GitHub CLI (gh) installed and authenticated; for Auto-merge to work, also enable auto-merge in your GitHub repository settings.',
      'Computer use is off by default — enable it in Settings > General and, on macOS, grant Accessibility and Screen Recording; Claude prefers connectors, Bash, or Claude in Chrome first and falls back to screen control only when nothing else fits.',
    ],
  },

  // ───────────────────────────────────────────────────────────────── MASTERY
  {
    id: 'best-practices',
    category: 'mastery',
    icon: 'trophy',
    title: 'Best Practices for Engineers',
    tagline: 'Workflows that compound.',
    blurb:
      'The teams that get the most from Claude Code follow a few repeatable patterns. Adopt these and your sessions get faster, cheaper, and more reliable.',
    terminal: {
      title: 'the-loop',
      lines: [
        ok('1. Explore  — ask Claude to read & map before coding'),
        ok('2. Plan     — Plan Mode + "think hard" for the approach'),
        ok('3. Code     — execute the approved plan in small steps'),
        ok('4. Verify   — run tests / a subagent review'),
        ok('5. Commit   — clean message, open PR'),
        dim('repeat — /clear between unrelated tasks'),
      ],
    },
    practices: [
      { h: 'Explore → Plan → Code → Commit', b: 'Have Claude understand the code and propose a plan before editing. It prevents wrong turns.' },
      { h: 'Test-driven', b: 'Ask for a failing test first, then the implementation. Tests anchor Claude to the real goal.' },
      { h: 'Manage context', b: '/clear between tasks, /compact when long. A focused context is a smarter, cheaper context.' },
      { h: 'Tune CLAUDE.md', b: 'When Claude repeats a mistake, add a rule with #. Memory is your feedback loop.' },
      { h: 'Delegate to subagents', b: 'Use isolated agents for review, research, and parallel work to protect your main thread.' },
      { h: 'Be specific', b: 'Point at files with @, give acceptance criteria, and define "done". Vague asks get vague code.' },
      { h: 'Guardrails via hooks & perms', b: 'Auto-format, block dangerous commands, and deny secret reads so you can move fast safely.' },
      { h: 'Course-correct early', b: 'Esc to interrupt, Esc-Esc to rewind. Don\'t let a wrong approach run to completion.' },
    ],
    tips: [
      'Treat CLAUDE.md as living documentation — the best teams refine it weekly as they learn Claude\'s blind spots.',
      'Smaller, verified steps beat one giant prompt. Commit often so rewind and git both have your back.',
    ],
  },
]

// Comprehensive slash-command catalog (doc-verified). Rendered by SlashReference.
export const SLASH_COMMANDS = [
  {
    label: 'Session & history',
    commands: [
      { cmd: '/clear', args: '[name]', desc: 'Start a new conversation with empty context; the previous one stays available in /resume. Aliases: /reset, /new.', example: '/clear auth-refactor' },
      { cmd: '/resume', args: '[session]', desc: 'Resume a conversation by ID or name, or open the session picker (background sessions are marked "bg"). Alias: /continue.', example: '/resume auth-refactor' },
      { cmd: '/branch', args: '[name]', desc: 'Branch the current conversation at this point to try a different direction; preserves the original.', example: '/branch try-redis-cache' },
      { cmd: '/fork', args: '<directive>', desc: 'Spawn a background subagent that inherits the full conversation and works the directive while you keep going.', example: '/fork write unit tests for the parser' },
      { cmd: '/rename', args: '[name]', desc: 'Rename the current session; auto-generates a name from history if omitted.', example: '/rename payment-webhooks' },
      { cmd: '/rewind', args: '', desc: 'Rewind conversation and/or code to a previous checkpoint, or summarize from a message. Aliases: /checkpoint, /undo.', example: '/rewind' },
      { cmd: '/export', args: '[filename]', desc: 'Export the current conversation as plain text to a file or a copy/save dialog.', example: '/export session-notes.txt' },
      { cmd: '/copy', args: '[N]', desc: 'Copy the last assistant response (or the Nth-latest) to the clipboard.', example: '/copy 2' },
      { cmd: '/recap', args: '', desc: 'Generate a one-line summary of the current session on demand.', example: '/recap' },
      { cmd: '/exit', args: '', desc: 'Exit the CLI; in an attached background session this detaches and leaves it running. Alias: /quit.', example: '/exit' },
    ],
  },
  {
    label: 'Context window',
    commands: [
      { cmd: '/context', args: '[all]', desc: 'Visualize context usage as a colored grid with optimization tips and capacity warnings; "all" expands the breakdown.', example: '/context' },
      { cmd: '/compact', args: '[instructions]', desc: 'Free up context by summarizing the conversation so far; optional focus instructions for the summary.', example: '/compact keep the API design decisions' },
      { cmd: '/btw', args: '<question>', desc: 'Ask a quick side question without adding it to the main conversation history.', example: '/btw what does git rebase --onto do?' },
    ],
  },
  {
    label: 'Model & reasoning',
    commands: [
      { cmd: '/model', args: '[model]', desc: 'Switch the AI model and save it as the default; with no arg opens a picker (press s to switch for this session only).', example: '/model opus' },
      { cmd: '/effort', args: '[level|auto]', desc: 'Set model effort (low/medium/high/xhigh/max/ultracode; max & ultracode are session-only); "auto" resets to default.', example: '/effort high' },
      { cmd: '/plan', args: '[description]', desc: 'Enter plan mode directly from the prompt, optionally starting with a task description.', example: '/plan fix the auth bug' },
      { cmd: '/goal', args: '[condition|clear]', desc: 'Set a goal Claude works toward across turns until met; clear/stop/off/reset removes it.', example: '/goal all integration tests pass' },
      { cmd: '/advisor', args: '[model|off]', desc: 'Enable/disable the advisor tool that consults a second model (opus/sonnet/fable) for guidance at key moments.', example: '/advisor opus' },
      { cmd: '/fast', args: '[on|off]', desc: 'Toggle fast mode on or off.', example: '/fast on' },
    ],
  },
  {
    label: 'Memory & project',
    commands: [
      { cmd: '/init', args: '', desc: 'Initialize the project with a starter CLAUDE.md guide documenting the codebase.', example: '/init' },
      { cmd: '/memory', args: '', desc: 'Edit CLAUDE.md memory files, toggle auto-memory, and view auto-memory entries.', example: '/memory' },
      { cmd: '/add-dir', args: '<path>', desc: 'Add a working directory for file access during the current session.', example: '/add-dir ../shared-lib' },
      { cmd: '/cd', args: '<path>', desc: 'Move the session to a new working directory, preserving the prompt cache.', example: '/cd ../services/api' },
    ],
  },
  {
    label: 'Permissions & safety',
    commands: [
      { cmd: '/permissions', args: '', desc: 'Manage allow/ask/deny tool-permission rules interactively; also manage directories and auto-mode denials. Alias: /allowed-tools.', example: '/permissions' },
      { cmd: '/sandbox', args: '', desc: 'Toggle sandbox mode (on supported platforms only).', example: '/sandbox' },
      { cmd: '/fewer-permission-prompts', args: '', desc: 'Scan transcripts for common safe read-only calls and add an allowlist to project settings to cut prompts.', example: '/fewer-permission-prompts' },
      { cmd: '/privacy-settings', args: '', desc: 'View and update privacy settings (Pro and Max plans only).', example: '/privacy-settings' },
    ],
  },
  {
    label: 'Configuration & setup',
    commands: [
      { cmd: '/config', args: '[key=value]', desc: 'Open Settings (theme, model, output style, editor mode) or set keys directly. Alias: /settings.', example: '/config theme=dark' },
      { cmd: '/theme', args: '', desc: 'Change the color theme: auto, light/dark, colorblind, ANSI, and custom themes.', example: '/theme' },
      { cmd: '/color', args: '[color|default]', desc: 'Set the prompt bar color for the current session; "default" resets, no arg picks randomly.', example: '/color blue' },
      { cmd: '/statusline', args: '', desc: 'Configure the status line; describe what you want or auto-configure from your shell prompt.', example: '/statusline show git branch and model' },
      { cmd: '/keybindings', args: '', desc: 'Open your keyboard shortcuts file to customize bindings.', example: '/keybindings' },
      { cmd: '/tui', args: '[default|fullscreen]', desc: 'Set the terminal UI renderer (e.g. flicker-free fullscreen) and relaunch with conversation intact.', example: '/tui fullscreen' },
      { cmd: '/focus', args: '', desc: 'Toggle a focus view showing only your last prompt, a one-line tool summary, and the final response.', example: '/focus' },
      { cmd: '/terminal-setup', args: '', desc: 'Configure terminal keybindings for Shift+Enter and similar shortcuts.', example: '/terminal-setup' },
      { cmd: '/ide', args: '', desc: 'Manage IDE integrations and show connection status.', example: '/ide' },
      { cmd: '/chrome', args: '', desc: 'Configure Claude in Chrome settings.', example: '/chrome' },
    ],
  },
  {
    label: 'Extend (skills, agents, MCP, hooks, plugins)',
    commands: [
      { cmd: '/agents', args: '', desc: 'Manage subagent configurations Claude can delegate side tasks to.', example: '/agents' },
      { cmd: '/mcp', args: '[reconnect <server>|enable|disable]', desc: 'Manage MCP server connections and OAuth; open the list or act on a server directly.', example: '/mcp reconnect sentry' },
      { cmd: '/hooks', args: '', desc: 'View hook configurations for tool lifecycle events.', example: '/hooks' },
      { cmd: '/skills', args: '', desc: 'List available skills; press t to sort by token count, Space to hide a skill.', example: '/skills' },
      { cmd: '/reload-skills', args: '', desc: 'Re-scan skill and command directories so on-disk changes apply without restarting.', example: '/reload-skills' },
      { cmd: '/plugin', args: '[subcommand]', desc: 'Manage plugins; open the menu or pass list/install/enable/disable.', example: '/plugin install code-review@claude-plugins-official' },
      { cmd: '/reload-plugins', args: '[--force]', desc: 'Reload active plugins to apply pending changes without restarting.', example: '/reload-plugins' },
    ],
  },
  {
    label: 'Git, GitHub & review',
    commands: [
      { cmd: '/diff', args: '', desc: 'Open an interactive diff viewer for uncommitted changes and per-turn diffs.', example: '/diff' },
      { cmd: '/code-review', args: '[level] [--fix] [--comment]', desc: 'Review the current diff for bugs and cleanups; --fix applies findings, --comment posts inline PR comments.', example: '/code-review high --fix' },
      { cmd: '/simplify', args: '[target]', desc: 'Review changed code for cleanup (reuse, simplification, efficiency) and apply fixes; does not hunt for bugs.', example: '/simplify src/parser.ts' },
      { cmd: '/review', args: '[PR]', desc: 'Review a GitHub pull request by number (or pick from open PRs).', example: '/review 482' },
      { cmd: '/security-review', args: '', desc: 'Analyze pending changes for security vulnerabilities like injection, auth issues, and data exposure.', example: '/security-review' },
      { cmd: '/install-github-app', args: '', desc: 'Install the Claude GitHub App for a repo, optionally setting up GitHub Actions workflows and secrets.', example: '/install-github-app' },
      { cmd: '/autofix-pr', args: '[prompt]', desc: 'Spawn a cloud session that watches the branch\'s PR and pushes fixes when CI fails or reviewers comment.', example: '/autofix-pr only fix lint and type errors' },
    ],
  },
  {
    label: 'Run, verify & background work',
    commands: [
      { cmd: '/run', args: '', desc: 'Launch and drive your project\'s app to see a change working in the running app, not just tests.', example: '/run' },
      { cmd: '/verify', args: '', desc: 'Confirm a change works by building and running the app and observing the result.', example: '/verify' },
      { cmd: '/background', args: '[prompt]', desc: 'Detach the current session to run as a background agent and free the terminal. Alias: /bg.', example: '/background finish the migration' },
      { cmd: '/tasks', args: '', desc: 'View and manage everything running in the background.', example: '/tasks' },
      { cmd: '/stop', args: '', desc: 'Stop the current background session (only while attached); transcript and worktree are kept.', example: '/stop' },
      { cmd: '/batch', args: '<instruction>', desc: 'Decompose a large change into 5–30 units and run each in its own worktree subagent with a PR.', example: '/batch migrate src/ from Solid to React' },
      { cmd: '/loop', args: '[interval] [prompt]', desc: 'Run a prompt repeatedly while the session stays open; omit interval to self-pace.', example: '/loop 5m check if the deploy finished' },
      { cmd: '/deep-research', args: '<question>', desc: 'Fan out web searches, cross-check sources, and synthesize a cited report.', example: '/deep-research compare vector DBs for RAG' },
      { cmd: '/workflows', args: '', desc: 'Open the workflow progress view to watch, pause, resume, or save workflows.', example: '/workflows' },
      { cmd: '/schedule', args: '[description]', desc: 'Create, update, list, or run cloud routines on a schedule. Alias: /routines.', example: '/schedule run the tests every morning at 9am' },
    ],
  },
  {
    label: 'Remote & cross-device',
    commands: [
      { cmd: '/remote-control', args: '', desc: 'Make this session controllable from claude.ai. Alias: /rc.', example: '/remote-control' },
      { cmd: '/teleport', args: '', desc: 'Pull a Claude Code on the web session into this terminal (branch + conversation). Alias: /tp.', example: '/teleport' },
      { cmd: '/desktop', args: '', desc: 'Continue the current session in the Claude Code desktop app (macOS/Windows, subscription). Alias: /app.', example: '/desktop' },
      { cmd: '/mobile', args: '', desc: 'Show a QR code to download the Claude mobile app. Aliases: /ios, /android.', example: '/mobile' },
      { cmd: '/web-setup', args: '', desc: 'Connect your GitHub account to Claude Code on the web using local gh credentials.', example: '/web-setup' },
    ],
  },
  {
    label: 'Account & cost',
    commands: [
      { cmd: '/login', args: '', desc: 'Sign in to your Anthropic account.', example: '/login' },
      { cmd: '/logout', args: '', desc: 'Sign out from your Anthropic account.', example: '/logout' },
      { cmd: '/usage', args: '', desc: 'Show session cost, plan usage limits, and activity stats (with per-skill/agent breakdowns on paid plans).', example: '/usage' },
      { cmd: '/cost', args: '', desc: 'Show session cost and usage. Alias for /usage (/stats is also an alias).', example: '/cost' },
      { cmd: '/upgrade', args: '', desc: 'Open the upgrade page to switch to a higher plan tier.', example: '/upgrade' },
    ],
  },
  {
    label: 'Help, status & diagnostics',
    commands: [
      { cmd: '/help', args: '', desc: 'Show help and the list of available commands.', example: '/help' },
      { cmd: '/status', args: '', desc: 'Open the Settings Status tab showing version, model, account, and connectivity.', example: '/status' },
      { cmd: '/doctor', args: '', desc: 'Diagnose and verify your installation and settings; press f to have Claude fix issues.', example: '/doctor' },
      { cmd: '/debug', args: '[description]', desc: 'Enable debug logging for the session and troubleshoot by reading the debug log.', example: '/debug MCP server keeps disconnecting' },
      { cmd: '/feedback', args: '[report]', desc: 'Submit feedback, report a bug, or share the conversation. Aliases: /bug, /share.', example: '/feedback diff viewer crashes on large files' },
      { cmd: '/release-notes', args: '', desc: 'View the changelog in an interactive version picker.', example: '/release-notes' },
      { cmd: '/insights', args: '', desc: 'Generate a report analyzing your sessions: project areas, patterns, and friction points.', example: '/insights' },
    ],
  },
]

export const STATS = [
  { value: '23', label: 'Feature areas' },
  { value: '70+', label: 'Slash commands' },
  { value: '2', label: 'Surfaces — CLI & Desktop' },
  { value: '∞', label: 'MCP integrations' },
]
