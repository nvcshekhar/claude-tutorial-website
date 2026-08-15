import { useMemo, useState } from 'react'
import Icon from './Icons'
import { SLASH_COMMANDS } from '../data/content'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1300) } catch { /* ignore */ }
      }}
      className="shrink-0 p-1.5 rounded-md text-muted hover:text-accent hover:bg-sunken transition opacity-0 group-hover:opacity-100"
      aria-label="Copy command"
      title="Copy"
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} />
    </button>
  )
}

export default function SlashReference() {
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return SLASH_COMMANDS
    return SLASH_COMMANDS
      .map((g) => ({
        ...g,
        commands: g.commands.filter((c) =>
          (c.cmd + ' ' + c.args + ' ' + c.desc).toLowerCase().includes(query)),
      }))
      .filter((g) => g.commands.length > 0)
  }, [q])

  const total = useMemo(() => SLASH_COMMANDS.reduce((n, g) => n + g.commands.length, 0), [])
  const shown = groups.reduce((n, g) => n + g.commands.length, 0)

  return (
    <div className="space-y-5">
      {/* search */}
      <div className="flex items-center gap-3 card px-4 py-2.5 sticky top-16 z-10">
        <Icon name="search" size={17} className="text-muted shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter commands… (e.g. context, model, git)"
          className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted"
        />
        <span className="text-[12px] text-muted shrink-0 tabular-nums">{shown}/{total}</span>
        {q && (
          <button onClick={() => setQ('')} className="text-muted hover:text-accent" aria-label="Clear filter">
            <Icon name="close" size={15} />
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <div className="card p-8 text-center text-muted text-sm">No commands match "{q}".</div>
      )}

      {groups.map((g) => (
        <div key={g.label} className="card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-app flex items-center gap-2 bg-sunken/50">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <h3 className="font-semibold text-[13.5px]">{g.label}</h3>
            <span className="ml-auto text-[11px] text-muted">{g.commands.length}</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {g.commands.map((c) => (
              <div key={c.cmd} className="group grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-x-4 gap-y-1 px-4 py-3 hover:bg-sunken/40 transition">
                <div className="flex items-start gap-2 min-w-0">
                  <code className="text-[13px] text-accent font-semibold break-words" style={{ fontFamily: 'var(--font-mono)' }}>
                    {c.cmd}{c.args ? <span className="text-muted font-normal"> {c.args}</span> : null}
                  </code>
                  <CopyButton text={c.cmd + (c.args ? ' ' : '')} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] text-app/90 leading-snug">{c.desc}</p>
                  {c.example && (
                    <code className="block mt-1 text-[11.5px] text-muted break-words" style={{ fontFamily: 'var(--font-mono)' }}>
                      <span className="text-accent/60">› </span>{c.example}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
