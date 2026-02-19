'use client'

import { useEffect, useRef, createContext, useContext } from 'react'

// ─── Scroll T Context ─────────────────────────────────────────────────────────
// scrollT: 0 = top of page, 1 = bottom of page
const ScrollTContext = createContext<React.MutableRefObject<number>>({ current: 0 } as React.MutableRefObject<number>)

export function useScrollT() {
    return useContext(ScrollTContext)
}

// ─── ScrollRig ────────────────────────────────────────────────────────────────
// Creates a tall scroll container so the browser generates a scrollbar.
// The fixed 3D canvas receives scroll events via the context ref.
export function ScrollRig({
    children,
    totalHeight = '700vh',
}: {
    children: React.ReactNode
    totalHeight?: string
}) {
    const scrollTRef = useRef(0)
    const scrollerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => {
            const el = scrollerRef.current
            if (!el) return
            const maxScroll = el.scrollHeight - window.innerHeight
            scrollTRef.current = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <ScrollTContext.Provider value={scrollTRef}>
            {/* Tall transparent scroller that drives scroll depth */}
            <div
                ref={scrollerRef}
                style={{ height: totalHeight, width: '100%', position: 'relative', zIndex: -1 }}
                aria-hidden
            />
            {children}
        </ScrollTContext.Provider>
    )
}
