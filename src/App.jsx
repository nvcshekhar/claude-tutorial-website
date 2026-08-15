import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from './components/Icons'
import Hero from './components/Hero'
import Sidebar from './components/Sidebar'
import Section from './components/Section'
import CommandPalette from './components/CommandPalette'
import { SECTIONS, CATEGORIES } from './data/content'

function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('cca-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('cca-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, setDark]
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="w-9 h-9 grid place-items-center rounded-lg border border-app bg-elevated text-muted hover:text-accent transition"
      aria-label="Toggle dark mode"
      title="Toggle theme"
    >
      <Icon name={dark ? 'sun' : 'moon'} size={17} />
    </button>
  )
}

export default function App() {
  const [dark, setDark] = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const [visited, setVisited] = useState(() => new Set())
  const [mobileNav, setMobileNav] = useState(false)
  const refs = useRef({})

  const registerRef = useCallback((id, el) => { if (el) refs.current[id] = el }, [])

  // ⌘K / Ctrl+K to open palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll spy + visited tracking
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id
            setActiveId(id)
            setVisited((prev) => {
              if (prev.has(id)) return prev
              const next = new Set(prev); next.add(id); return next
            })
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const navigate = useCallback((id) => {
    const el = refs.current[id] || document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
    setMobileNav(false)
  }, [])

  const progressPct = Math.round((visited.size / SECTIONS.length) * 100)

  const activeTitle = useMemo(
    () => SECTIONS.find((s) => s.id === activeId)?.title || '',
    [activeId],
  )

  return (
    <div className="min-h-screen bg-app text-app">
      {/* top bar */}
      <div className="sticky top-0 z-40 border-b border-app bg-app/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 font-semibold">
            <span className="w-7 h-7 rounded-lg grid place-items-center text-white shrink-0" style={{ background: 'var(--terminal-bg)' }}>
              <span className="text-accent font-mono text-sm">&gt;_</span>
            </span>
            <span className="hidden sm:block">Claude Code <span className="text-accent">Academy</span></span>
          </button>

          <span className="hidden md:block text-[13px] text-muted truncate ml-2">
            {activeTitle && <>· {activeTitle}</>}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg border border-app bg-elevated text-[13px] text-muted hover:text-app transition"
            >
              <Icon name="search" size={15} /> Search <span className="kbd ml-1">⌘K</span>
            </button>
            <a
              href="https://docs.claude.com/en/docs/claude-code"
              target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-lg border border-app bg-elevated text-[13px] text-muted hover:text-app transition"
            >
              Docs <Icon name="arrow" size={14} />
            </a>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button
              onClick={() => setMobileNav((m) => !m)}
              className="lg:hidden w-9 h-9 grid place-items-center rounded-lg border border-app bg-elevated text-muted"
              aria-label="Menu"
            >
              <Icon name={mobileNav ? 'close' : 'menu'} size={18} />
            </button>
          </div>
        </div>
        {/* progress bar under header */}
        <div className="h-0.5 bg-transparent">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* mobile nav drawer */}
      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14" onClick={() => setMobileNav(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-app border-b border-app max-h-[80vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="mb-3">
                <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-muted font-semibold">{cat.label}</div>
                {SECTIONS.filter((s) => s.category === cat.id).map((s) => (
                  <button key={s.id} onClick={() => navigate(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm ${activeId === s.id ? 'bg-sunken text-app font-semibold' : 'text-muted'}`}>
                    <Icon name={s.icon} size={16} className={activeId === s.id ? 'text-accent' : ''} />
                    {s.title}
                    {visited.has(s.id) && <Icon name="check" size={13} className="text-accent/70 ml-auto" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <Hero onStart={() => navigate(SECTIONS[0].id)} onSearch={() => setPaletteOpen(true)} />

      <main className="max-w-6xl mx-auto px-5 flex gap-10">
        <Sidebar activeId={activeId} onNavigate={navigate} visited={visited} progressPct={progressPct} />
        <div className="flex-1 min-w-0 pb-24">
          {SECTIONS.map((s, i) => (
            <Section key={s.id} section={s} index={i} registerRef={registerRef} />
          ))}

          {/* closing CTA */}
          <section className="mt-12 card p-8 md:p-12 text-center bg-aurora">
            <h2 className="font-serif text-3xl font-semibold mb-3">You've got the whole toolkit.</h2>
            <p className="text-muted max-w-xl mx-auto mb-6">
              Open a terminal, run <code className="text-accent font-mono">claude</code>, and put these features to work.
              Tune your CLAUDE.md, wire up a hook, delegate to a subagent — and ship faster.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-5 py-3 rounded-xl bg-accent text-white font-semibold" style={{ background: 'var(--accent)' }}>
                Back to top
              </button>
              <a href="https://docs.claude.com/en/docs/claude-code" target="_blank" rel="noreferrer"
                className="px-5 py-3 rounded-xl border border-app bg-elevated font-medium text-muted hover:text-app transition">
                Read the official docs
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-app">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-muted">
          <span>Claude Code Academy · an interactive feature tutorial</span>
          <span>Built for engineers who want the best workflow.</span>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={navigate} />
    </div>
  )
}
