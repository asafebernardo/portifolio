import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08, ...options },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [options])

  return { ref, visible }
}
