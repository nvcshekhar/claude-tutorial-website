import Icon from './Icons'
import { CATEGORIES, SECTIONS } from '../data/content'

export default function Sidebar({ activeId, onNavigate, visited, progressPct }) {
  return (
    <nav className="hidden lg:flex flex-col gap-1 w-64 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-10">
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between text-[11px] text-muted mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-sunken overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressPct > 0 ? 'progress-glow progress-spark' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const items = SECTIONS.filter((s) => s.category === cat.id)
        if (!items.length) return null
        return (
          <div key={cat.id} className="mb-2">
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted font-semibold">
              {cat.label}
            </div>
            {items.map((s) => {
              const active = activeId === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => onNavigate(s.id)}
                  className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13.5px] transition
                    ${active ? 'glass nav-active text-app font-semibold' : 'text-muted hover:text-app hover:bg-sunken/60'}`}
                >
                  <span className={`shrink-0 ${active ? 'text-accent' : 'text-muted group-hover:text-accent'} transition`}>
                    <Icon name={s.icon} size={16} />
                  </span>
                  <span className="flex-1 truncate">{s.title}</span>
                  {visited.has(s.id) && <Icon name="check" size={13} className="text-accent/70 shrink-0" />}
                  {active && <span className="w-1 h-4 rounded-full bg-accent shrink-0" />}
                </button>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}
