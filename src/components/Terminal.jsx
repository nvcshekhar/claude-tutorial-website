import { useEffect, useRef, useState, useCallback } from 'react'

const STYLE = {
  prompt: { color: '#e8dfd2' },
  output: { color: '#b8ae9f' },
  ok: { color: '#7fc99a' },
  dim: { color: '#6b6359' },
  claude: { color: '#e6a98e' },
  tool: { color: '#8db4d9' },
}

const PROMPT_SIGIL = {
  prompt: '$ ',
  claude: '⏺ ',
  tool: '  ⊹ ',
}

function useInView(ref) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return seen
}

// A self-typing terminal. Plays once when scrolled into view; replayable.
export default function Terminal({ title = 'claude', lines = [] }) {
  const wrap = useRef(null)
  const inView = useInView(wrap)
  const [rendered, setRendered] = useState([])   // completed lines
  const [typing, setTyping] = useState(null)     // {kind, text} currently typing
  const [typedLen, setTypedLen] = useState(0)
  const [done, setDone] = useState(false)
  const [runId, setRunId] = useState(0)
  const timers = useRef([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const play = useCallback(() => {
    clearTimers()
    setRendered([])
    setTyping(null)
    setTypedLen(0)
    setDone(false)

    let acc = 0
    let i = 0
    const runLine = () => {
      if (i >= lines.length) { setDone(true); return }
      const line = lines[i]
      const isTyped = line.kind === 'prompt'
      setTyping(line)
      setTypedLen(isTyped ? 0 : line.text.length)

      if (isTyped) {
        // typewriter for user-typed prompts
        let c = 0
        const tick = () => {
          c += 1
          setTypedLen(c)
          if (c < line.text.length) {
            timers.current.push(setTimeout(tick, 22 + Math.random() * 30))
          } else {
            timers.current.push(setTimeout(commit, 320))
          }
        }
        timers.current.push(setTimeout(tick, 120))
      } else {
        timers.current.push(setTimeout(commit, 260))
      }

      function commit() {
        setRendered((r) => [...r, line])
        setTyping(null)
        i += 1
        timers.current.push(setTimeout(runLine, line.kind === 'prompt' ? 180 : 90))
      }
    }
    timers.current.push(setTimeout(runLine, 350))
    return () => clearTimers()
    // eslint-disable-next-line
  }, [lines])

  useEffect(() => {
    if (inView) play()
    return clearTimers
  }, [inView, runId, play])

  const renderLine = (line, key, partial) => {
    const sigil = PROMPT_SIGIL[line.kind] || ''
    const text = partial != null ? line.text.slice(0, partial) : line.text
    const showCursor = partial != null
    return (
      <div key={key} className="whitespace-pre-wrap leading-relaxed">
        {sigil && <span style={{ color: line.kind === 'prompt' ? '#d97757' : STYLE[line.kind]?.color }}>{sigil}</span>}
        <span style={STYLE[line.kind] || STYLE.output} className={showCursor ? 'term-cursor' : ''}>
          {text}
        </span>
      </div>
    )
  }

  return (
    <div ref={wrap} className="terminal overflow-hidden">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: '#2c2823', background: '#13110f' }}>
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className={`w-3 h-3 rounded-full ${done ? '' : 'term-live'}`} style={{ background: '#28c840' }} />
        <span className="ml-2 text-xs tracking-wide" style={{ color: '#6b6359', fontFamily: 'var(--font-mono)' }}>
          {title}
        </span>
        <button
          onClick={() => setRunId((n) => n + 1)}
          className="ml-auto text-[11px] px-2 py-1 rounded-md transition hover:opacity-100 opacity-60"
          style={{ color: '#b8ae9f', fontFamily: 'var(--font-mono)' }}
          aria-label="Replay animation"
        >
          ↻ replay
        </button>
      </div>
      {/* body */}
      <div className="relative p-4 text-[13px] min-h-[200px]" style={{ fontFamily: 'var(--font-mono)' }}>
        {rendered.map((l, idx) => renderLine(l, idx))}
        {typing && renderLine(typing, 'typing', typing.kind === 'prompt' ? typedLen : null)}
        {done && <div className="term-cursor mt-1" />}
        <div className="term-scan" aria-hidden="true" />
      </div>
    </div>
  )
}
