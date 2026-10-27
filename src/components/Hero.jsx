import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Icon from './Icons'
import Terminal from './Terminal'
import { SECTIONS, STATS } from '../data/content'

const HERO_LINES = [
  { kind: 'prompt', text: 'claude "build me a tutorial site"' },
  { kind: 'tool', text: 'Reading docs · mapping every feature…' },
  { kind: 'claude', text: 'Done. CLI + Desktop, fully interactive.' },
  { kind: 'ok', text: '✔ 23 feature areas ready to explore ↓' },
]

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

function useCountUp(target, active) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 900 + Math.min(target, 70) * 8
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  return value
}

function StatValue({ value }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const match = /^(\d+)(.*)$/.exec(String(value))
  const target = match ? Number(match[1]) : null
  const suffix = match ? match[2] : ''
  const count = useCountUp(target ?? 0, seen && target != null)
  const shown = target == null ? value : `${count}${suffix}`

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="invisible col-start-1 row-start-1">{value}</span>
      <span className="col-start-1 row-start-1 tabular-nums">{shown}</span>
    </span>
  )
}

function FeatureRibbon() {
  const loop = [...SECTIONS, ...SECTIONS]
  return (
    <div className="feature-ribbon" aria-hidden="true">
      <div className="feature-ribbon-track">
        {loop.map((section, i) => (
          <span key={`${section.id}-${i}`} className="feature-pill">
            <Icon name={section.icon} size={14} className="text-accent" />
            {section.title}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ onStart, onSearch }) {
  return (
    <header className="relative overflow-hidden pb-8">
      <div className="hero-grid" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-10 md:pt-24 md:pb-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div {...rise} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
          <div className="glass inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] text-muted mb-6">
            <span className="live-dot w-2 h-2 rounded-full bg-accent" />
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
              className="btn-shine group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-semibold text-[15px] shadow-lg shadow-clay-500/20 hover:translate-y-[-2px] transition"
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
                <dt className="text-2xl font-serif font-semibold text-accent">
                  <StatValue value={s.value} />
                </dt>
                <dd className="text-[12.5px] text-muted mt-0.5">{s.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 0.08 }}
        >
          <div className="terminal-halo" aria-hidden="true" />
          <div className="floaty relative">
            <Terminal title="claude-code-academy" lines={HERO_LINES} />
          </div>
        </motion.div>
      </div>
      <FeatureRibbon />
    </header>
  )
}
