import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icons'
import { SECTIONS, CATEGORIES } from '../data/content'

// Flatten searchable entries: sections + their commands/keys.
function buildIndex() {
  const entries = []
  for (const s of SECTIONS) {
    entries.push({ type: 'section', id: s.id, title: s.title, sub: s.tagline, icon: s.icon, cat: s.category })
    ;(s.commands || []).forEach((c) =>
      entries.push({ type: 'command', id: s.id, title: c.cmd, sub: c.desc, icon: 'slash', cat: s.category }))
    ;(s.keys || []).forEach((k) =>
      entries.push({ type: 'key', id: s.id, title: k.k, sub: k.d, icon: 'keyboard', cat: s.category }))
  }
  return entries
}

export default function CommandPalette({ open, onClose, onNavigate }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const index = useMemo(buildIndex, [])

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return index.filter((e) => e.type === 'section')
    return index
      .map((e) => {
        const hay = (e.title + ' ' + e.sub).toLowerCase()
        let score = 0
        if (e.title.toLowerCase().startsWith(query)) score += 100
        if (hay.includes(query)) score += 40
        // fuzzy: all chars in order
        let qi = 0
        for (let i = 0; i < hay.length && qi < query.length; i++) if (hay[i] === query[qi]) qi++
        if (qi === query.length) score += 10
        return { ...e, score }
      })
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
  }, [q, index])

  useEffect(() => { setActive(0) }, [q])
  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 30) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      else if (e.key === 'Enter') { e.preventDefault(); const r = results[active]; if (r) { onNavigate(r.id); onClose() } }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, active, onClose, onNavigate])

  if (!open) return null
  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || ''

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl card glass-modal overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-app">
          <Icon name="search" size={18} className="text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search features, commands, shortcuts…"
            className="flex-1 bg-transparent py-4 outline-none text-[15px] placeholder:text-muted"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-4 py-8 text-center text-muted text-sm">No matches for "{q}"</div>
          )}
          {results.map((r, i) => (
            <button
              key={r.type + r.id + r.title + i}
              onMouseEnter={() => setActive(i)}
              onClick={() => { onNavigate(r.id); onClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition
                ${i === active ? 'bg-sunken' : ''}`}
            >
              <span className={`shrink-0 ${i === active ? 'text-accent' : 'text-muted'}`}>
                <Icon name={r.icon} size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[13.5px] truncate ${r.type === 'command' || r.type === 'key' ? 'font-mono text-accent' : 'font-medium'}`}>
                  {r.title}
                </span>
                <span className="block text-[12px] text-muted truncate">{r.sub}</span>
              </span>
              <span className="shrink-0 text-[10.5px] uppercase tracking-wider text-muted/70">{catLabel(r.cat)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-app text-[11px] text-muted">
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> jump</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  )
}
