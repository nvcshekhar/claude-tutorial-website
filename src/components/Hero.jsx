import Icon from './Icons'
import Terminal from './Terminal'
import { STATS } from '../data/content'

const HERO_LINES = [
  { kind: 'prompt', text: 'claude "build me a tutorial site"' },
  { kind: 'tool', text: 'Reading docs · mapping every feature…' },
  { kind: 'claude', text: 'Done. CLI + Desktop, fully interactive.' },
  { kind: 'ok', text: '✔ 23 feature areas ready to explore ↓' },
]

export default function Hero({ onStart, onSearch }) {
  return (
    <header className="relative overflow-hidden bg-aurora">
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-14 md:pt-24 md:pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <div className="glass inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] text-muted mb-6 floaty">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Interactive guide · CLI &amp; macOS desktop app
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Master <span className="shimmer-text">Claude Code</span>,
            <br />one feature at a time.
          </h1>

          <p className="mt-5 text-base md:text-lg text-muted max-w-xl leading-relaxed">
            A hands-on, visual tour of everything Claude Code can do — slash commands, subagents,
            hooks, MCP, plan mode, checkpoints and more. Built for engineers who want the best
            workflow in their terminal and on their desktop.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-[15px] shadow-lg shadow-clay-500/20 hover:translate-y-[-2px] transition"
              style={{ background: 'var(--accent)' }}
            >
              Start the tour
              <Icon name="arrow" size={18} className="group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={onSearch}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-app bg-elevated font-medium text-[14px] text-muted hover:text-app transition"
            >
              <Icon name="search" size={16} />
              Quick search
              <span className="kbd ml-1">⌘K</span>
            </button>
          </div>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-serif font-semibold text-accent">{s.value}</dt>
                <dd className="text-[12.5px] text-muted mt-0.5">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="floaty">
          <Terminal title="claude-code-academy" lines={HERO_LINES} />
        </div>
      </div>
    </header>
  )
}
