import { useEffect, useRef } from 'react'

// Fixed backdrop: drifting color, a cursor light, and a fine grain.
// Sits behind the page (z-index -1) so type stays sharp.
export default function Atmosphere() {
  const spot = useRef(null)

  useEffect(() => {
    const spotEl = spot.current
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let frame = 0
    let x = 0
    let y = 0
    let card = null
    let cx = 0
    let cy = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      const next = e.target instanceof Element ? e.target.closest('.card') : null
      card = next
      if (next) {
        const rect = next.getBoundingClientRect()
        cx = e.clientX - rect.left
        cy = e.clientY - rect.top
      }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (spotEl && !coarse) spotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
        if (card) {
          card.style.setProperty('--mx', `${cx}px`)
          card.style.setProperty('--my', `${cy}px`)
        }
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="bg-aurora-fixed" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />
      <div
        ref={spot}
        className="pointer-spot"
        style={{ transform: 'translate3d(-100vw, -100vh, 0)' }}
      />
      <div className="grain" />
    </div>
  )
}
