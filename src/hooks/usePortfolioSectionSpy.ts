import { useEffect, useMemo, useState } from 'react'

function headerPadPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? Math.round(n) + 24 : 96
}

/** Secção mais próxima do topo (abaixo do header) para realçar o link ativo. */
export function usePortfolioSectionSpy(sectionIds: readonly string[]) {
  const ids = useMemo(() => [...sectionIds], [sectionIds])
  const [activeId, setActiveId] = useState<string>(() => ids[0] ?? 'home')

  useEffect(() => {
    const measure = () => {
      const pad = headerPadPx()
      let current = ids[0] ?? 'home'
      for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i]
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= pad) {
          current = id
          break
        }
      }
      setActiveId(current)
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ids])

  return activeId
}
