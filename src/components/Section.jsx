import { useEffect, useRef, useState } from 'react'
import Icon from './Icons'
import Terminal from './Terminal'
import SlashReference from './SlashReference'

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${show ? 'in' : ''} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked */ }
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 p-1.5 rounded-md text-muted hover:text-accent hover:bg-sunken transition"
      aria-label="Copy to clipboard"
      title="Copy"
    >
      <Icon name={copied ? 'check' : 'copy'} size={15} />
    </button>
  )
}

function CommandRow({ cmd, desc }) {
  return (
    <div className="group flex items-start gap-3 px-3.5 py-2.5 rounded-lg hover:bg-sunken transition">
      <code className="text-[12.5px] text-accent shrink-0 max-w-[55%] break-words" style={{ fontFamily: 'var(--font-mono)' }}>
        {cmd}
      </code>
      <span className="text-[13px] text-muted flex-1">{desc}</span>
      <span className="opacity-0 group-hover:opacity-100 transition"><CopyButton text={cmd} /></span>
    </div>
  )
}

function MiniCard({ h, b, i }) {
  return (
    <Reveal delay={i * 60}>
      <div className="card card-hover h-full p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h4 className="font-semibold text-[14px]">{h}</h4>
        </div>
        <p className="text-[13px] text-muted leading-relaxed">{b}</p>
      </div>
    </Reveal>
  )
}

function CompareTable({ data }) {
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 text-[13px] font-semibold border-b border-app">
        <div className="px-4 py-3 text-muted">{data.title}</div>
        <div className="px-4 py-3 flex items-center gap-1.5"><Icon name="terminal" size={15} className="text-accent" /> CLI</div>
        <div className="px-4 py-3 flex items-center gap-1.5"><Icon name="desktop" size={15} className="text-accent" /> Desktop</div>
      </div>
      {data.rows.map((r, i) => (
        <div key={i} className={`grid grid-cols-3 text-[13px] ${i % 2 ? 'bg-sunken' : ''}`}>
          <div className="px-4 py-2.5 font-medium">{r.feature}</div>
          <div className="px-4 py-2.5 text-muted">{r.cli}</div>
          <div className="px-4 py-2.5 text-muted">{r.desktop}</div>
        </div>
      ))}
    </div>
  )
}

export default function Section({ section, index, registerRef }) {
  const ref = useRef(null)
  useEffect(() => { registerRef(section.id, ref.current) }, [section.id, registerRef])

  const {
    id, icon, title, tagline, blurb, terminal,
    cards, commands, keys, compare, practices, tips, slashRef,
  } = section

  return (
    <section id={id} ref={ref} className="scroll-mt-24 py-16 border-t border-app first:border-t-0">
      {/* header */}
      <Reveal>
        <div className="flex items-start gap-4 mb-6">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-sunken border border-app grid place-items-center text-accent">
            <Icon name={icon} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono text-muted">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">{title}</h2>
            </div>
            <p className="text-accent text-[15px] mt-0.5 font-medium">{tagline}</p>
          </div>
        </div>
        <p className="text-[15px] md:text-base text-muted leading-relaxed max-w-3xl mb-8">{blurb}</p>
      </Reveal>

      {slashRef && <SlashReference />}

      {!slashRef && (
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* left: terminal demo */}
        {terminal && (
          <Reveal className="lg:sticky lg:top-24">
            <Terminal title={terminal.title} lines={terminal.lines} />
          </Reveal>
        )}

        {/* right: structured content */}
        <div className="space-y-6">
          {cards && (
            <div className="grid sm:grid-cols-2 gap-3">
              {cards.map((c, i) => <MiniCard key={i} {...c} i={i} />)}
            </div>
          )}

          {keys && (
            <Reveal>
              <div className="card p-2">
                {keys.map((row, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-sunken transition">
                    <span className="kbd">{row.k}</span>
                    <span className="text-[13px] text-muted text-right flex-1">{row.d}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {commands && (
            <Reveal>
              <div className="card p-1.5">
                <div className="px-3.5 pt-2.5 pb-1 text-[11px] uppercase tracking-wider text-muted font-semibold">
                  Commands & syntax
                </div>
                {commands.map((c, i) => <CommandRow key={i} {...c} />)}
              </div>
            </Reveal>
          )}

          {practices && (
            <div className="grid sm:grid-cols-2 gap-3">
              {practices.map((c, i) => <MiniCard key={i} {...c} i={i} />)}
            </div>
          )}

          {compare && <Reveal><CompareTable data={compare} /></Reveal>}

          {tips && (
            <Reveal>
              <div className="card p-4 bg-aurora">
                <div className="flex items-center gap-2 mb-2 text-accent font-semibold text-[13px]">
                  <Icon name="star" size={15} /> Best-practice tips
                </div>
                <ul className="space-y-2">
                  {tips.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] text-app/90 leading-relaxed">
                      <Icon name="check" size={15} className="text-accent shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </div>
      )}
    </section>
  )
}
