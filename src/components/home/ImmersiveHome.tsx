'use client'

import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
    ArrowRight, ChevronDown,
    Home as HomeIcon, Compass, Hammer, FolderKanban,
    Activity, Users, Zap, Shield, Layers, Globe,
    ArrowUpRight, Play, Star, Sparkles, TrendingUp,
    Building2, Cpu, Lock, BarChart3, Workflow, Brain
} from 'lucide-react'
import HomeScene from './HomeScene'

// ─── Font Injection ────────────────────────────────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
`

// ─── Shared Types ─────────────────────────────────────────────────────────────
interface RoomInfo {
    title: string
    subtitle: string
    desc: string
    color: string
    gradient: string
    range: [number, number]
    tag: string
}

const ROOM_INFO: RoomInfo[] = [
    {
        title: 'ENTRANCE', subtitle: 'First Impressions', tag: 'AI · Spatial',
        desc: 'Step into the future of architectural design — where intelligence meets structure.',
        color: '#60a5fa', gradient: 'linear-gradient(135deg,#1d4ed8,#60a5fa)',
        range: [0.05, 0.18]
    },
    {
        title: 'LIVING SPACE', subtitle: 'Parametric Design Engine', tag: 'BIM · 3D',
        desc: 'Sub-millimeter precision with live BIM updates and real-time structural analysis.',
        color: '#a78bfa', gradient: 'linear-gradient(135deg,#6d28d9,#a78bfa)',
        range: [0.20, 0.36]
    },
    {
        title: 'KITCHEN CORE', subtitle: '5D Cost Intelligence', tag: 'Finance · Data',
        desc: 'Real-time supplier pricing across 40+ global databases. Budget never falls behind design.',
        color: '#fbbf24', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)',
        range: [0.38, 0.55]
    },
    {
        title: 'PRIVATE SUITE', subtitle: 'BIM & Compliance', tag: 'IFC · RVT',
        desc: 'Full IFC/RVT export with automated international code checks. Zero compliance gaps.',
        color: '#34d399', gradient: 'linear-gradient(135deg,#059669,#34d399)',
        range: [0.57, 0.74]
    },
    {
        title: 'WORKSPACE', subtitle: 'Project Command', tag: 'Collab · Gantt',
        desc: 'Live budgets, Gantt views, and team sync — all inside the 3D walkthrough.',
        color: '#f472b6', gradient: 'linear-gradient(135deg,#be185d,#f472b6)',
        range: [0.76, 0.90]
    },
    {
        title: 'THE SUMMIT', subtitle: 'Your Future. Designed.', tag: 'Vision · AI',
        desc: 'BuildVisor — where vision meets execution. The world\'s most advanced architectural OS.',
        color: '#22d3ee', gradient: 'linear-gradient(135deg,#0891b2,#22d3ee)',
        range: [0.92, 1.0]
    },
]

// ─── Animated counter ─────────────────────────────────────────────────────────
function CountUp({ end, suffix = '', duration = 2 }: { end: number, suffix?: string, duration?: number }) {
    const [value, setValue] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = end / (duration * 60)
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setValue(end); clearInterval(timer) }
            else setValue(Math.floor(start))
        }, 1000 / 60)
        return () => clearInterval(timer)
    }, [inView, end, duration])

    return <span ref={ref}>{value.toLocaleString()}{suffix}</span>
}

// ─── Hero Overlay ─────────────────────────────────────────────────────────────
function HeroOverlay({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const [opacity, setOpacity] = useState(1)
    const [scrollHint, setScrollHint] = useState(0)

    useEffect(() => {
        let raf: number
        const tick = () => {
            const raw = Math.max(0, 1 - scrollT.current / 0.07)
            setOpacity(raw)
            setScrollHint(scrollT.current * 40)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [scrollT])

    if (opacity <= 0.01) return null

    return (
        <>
            <style>{FONTS}</style>
            <div className="fixed inset-0 z-20 pointer-events-none" style={{ opacity }}>
                {/* Cinematic vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

                {/* Noise grain texture */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px',
                    }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                    {/* Eyebrow badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-2.5 mb-10 px-5 py-2 rounded-full"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)' }}>
                            BUILDVISOR 3.0 · THE ARCHITECTURAL OS
                        </span>
                        <Sparkles className="w-3 h-3 text-sky-400/60" />
                    </motion.div>

                    {/* Main Headline */}
                    <div className="text-center mb-3 overflow-hidden">
                        <motion.div
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h1
                                className="leading-[0.9] tracking-[-0.04em] text-white"
                                style={{
                                    fontFamily: "'Syne', system-ui, sans-serif",
                                    fontSize: 'clamp(28px, 4vw, 56px)',
                                    fontWeight: 800,
                                }}
                            >
                                SPATIAL
                            </h1>
                        </motion.div>
                    </div>

                    <div className="text-center mb-10 overflow-hidden">
                        <motion.div
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h1
                                className="leading-[0.9] tracking-[-0.04em]"
                                style={{
                                    fontFamily: "'Syne', system-ui, sans-serif",
                                    fontSize: 'clamp(28px, 4vw, 56px)',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 45%, #22d3ee 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                INTELLIGENCE.
                            </h1>
                        </motion.div>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.9 }}
                        className="text-center max-w-md mb-12"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(14px, 1.5vw, 18px)',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.75,
                            letterSpacing: '0.01em',
                        }}
                    >
                        The first 5D architectural OS. Walk through your design
                        <br />before a single brick is laid.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.7 }}
                        className="flex items-center gap-4 pointer-events-auto mb-24"
                    >
                        <Link href="/build">
                            <button
                                className="group relative flex items-center gap-2.5 px-8 py-4 rounded-full overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: '#fff',
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 0 40px rgba(99,102,241,0.4)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={e => (e.currentTarget.style.boxShadow = '0 0 60px rgba(99,102,241,0.7)')}
                                onMouseOut={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.4)')}
                            >
                                <span>Launch Studio</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <button
                            className="flex items-center gap-2.5 px-7 py-4 rounded-full transition-all hover:bg-white/10"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <Play className="w-4 h-4" />
                            Watch Demo
                        </button>
                    </motion.div>

                    {/* Scroll Indicator — cinematic */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <motion.span
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 9,
                                letterSpacing: '0.45em',
                                color: 'rgba(255,255,255,0.3)',
                                textTransform: 'uppercase',
                            }}
                        >
                            Scroll to walk in
                        </motion.span>
                        {/* Mouse scroll cue */}
                        <div style={{
                            width: 26, height: 44, borderRadius: 13,
                            border: '1.5px solid rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'flex-start',
                            justifyContent: 'center', paddingTop: 6,
                        }}>
                            <motion.div
                                animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                                style={{
                                    width: 4, height: 4, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.5)',
                                }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Stats row — bottom bar */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="absolute bottom-0 left-0 right-0 px-12 py-5 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                    {[
                        { val: '50K+', label: 'Architects' },
                        { val: '120+', label: 'Countries' },
                        { val: '3.2M', label: 'Designs Built' },
                        { val: '99.9%', label: 'Uptime' },
                    ].map(({ val, label }) => (
                        <div key={label} className="text-center hidden md:block">
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>{val}</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </>
    )
}

// ─── Cinematic Room Announcer ─────────────────────────────────────────────────
function RoomAnnouncer({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const [active, setActive] = useState<RoomInfo | null>(null)
    const [key, setKey] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let last = ''
        let raf: number
        const tick = () => {
            const t = scrollT.current
            setProgress(t)
            const found = ROOM_INFO.find(r => t >= r.range[0] && t <= r.range[1]) ?? null
            if ((found?.title ?? '') !== last) {
                last = found?.title ?? ''
                setActive(found)
                setKey(k => k + 1)
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [scrollT])

    // Calculate room index for progress dots
    const activeIdx = active ? ROOM_INFO.findIndex(r => r.title === active.title) : -1

    return (
        <AnimatePresence mode="wait">
            {active && (
                <motion.div
                    key={key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-x-0 bottom-0 z-10 pointer-events-none"
                >
                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-64"
                        style={{ background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)` }}
                    />

                    <div className="relative px-10 pb-10 flex items-end justify-between">
                        <div>
                            {/* Tag pill */}
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full"
                                style={{
                                    background: `${active.color}15`,
                                    border: `1px solid ${active.color}30`,
                                }}
                            >
                                <div className="w-1 h-1 rounded-full" style={{ background: active.color }} />
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 9, letterSpacing: '0.25em',
                                    color: active.color, textTransform: 'uppercase',
                                }}>
                                    {active.tag}
                                </span>
                            </motion.div>

                            {/* Subtitle line */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="h-px w-8" style={{ background: active.gradient }} />
                                <span style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 11, fontWeight: 600,
                                    letterSpacing: '0.3em', textTransform: 'uppercase',
                                    color: active.color,
                                }}>
                                    {active.subtitle}
                                </span>
                            </motion.div>

                            {/* Room title */}
                            <div className="overflow-hidden mb-2">
                                <motion.h2
                                    initial={{ y: '105%' }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        fontFamily: "'Syne', system-ui, sans-serif",
                                        fontSize: 'clamp(32px, 4.5vw, 72px)',
                                        fontWeight: 800,
                                        color: '#fff',
                                        letterSpacing: '-0.03em',
                                        lineHeight: 0.95,
                                    }}
                                >
                                    {active.title}
                                </motion.h2>
                            </div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 13, fontWeight: 300,
                                    color: 'rgba(255,255,255,0.45)',
                                    lineHeight: 1.65,
                                    maxWidth: 340,
                                }}
                            >
                                {active.desc}
                            </motion.p>
                        </div>

                        {/* Right: Room progress dots */}
                        <div className="hidden md:flex flex-col gap-3 items-center pr-2">
                            {ROOM_INFO.map((r, i) => {
                                const isActive = i === activeIdx
                                return (
                                    <motion.div
                                        key={r.title}
                                        animate={{
                                            height: isActive ? 32 : 8,
                                            opacity: isActive ? 1 : 0.2,
                                        }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        style={{
                                            width: 2,
                                            borderRadius: 4,
                                            background: isActive ? r.color : 'rgba(255,255,255,0.3)',
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollBar() {
    const { scrollYProgress } = useScroll()
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 origin-left z-[60]"
            style={{
                scaleX,
                height: 2,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #22d3ee)',
                boxShadow: '0 0 12px rgba(139,92,246,0.6)',
            }}
        />
    )
}

// ─── Horizontal Marquee ────────────────────────────────────────────────────────
function Marquee({ items, direction = 1, speed = 40 }: { items: string[], direction?: 1 | -1, speed?: number }) {
    return (
        <div className="overflow-hidden whitespace-nowrap" style={{ maskImage: 'linear-gradient(90deg, transparent, white 10%, white 90%, transparent)' }}>
            <motion.div
                className="inline-flex gap-12"
                animate={{ x: direction === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
            >
                {[...items, ...items].map((item, i) => (
                    <span key={i} style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 'clamp(48px,5vw,72px)',
                        fontWeight: 800,
                        color: 'rgba(255,255,255,0.04)',
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        userSelect: 'none',
                        flexShrink: 0,
                    }}>
                        {item} <span style={{ color: 'rgba(99,102,241,0.12)' }}>·</span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: Zap, title: 'Parametric Engine', body: 'Every constraint, every relationship. Geometry updates in real-time as you modify dimensions, materials, or structural loads.', color: '#60a5fa' },
    { icon: Layers, title: '5D BIM Cloud', body: 'Not just 3D. Add time and cost as live dimensions. See your cashflow update as you drag walls.', color: '#a78bfa' },
    { icon: Shield, title: 'Compliance AI', body: 'Automated checking against 200+ international building codes. No manual cross-referencing.', color: '#34d399' },
    { icon: Globe, title: 'Global Teams', body: 'Work with your team from Tokyo to Toronto in one synchronized 3D workspace with zero lag.', color: '#fbbf24' },
    { icon: Brain, title: 'AI Co-Architect', body: 'Natural language instructions. Describe your space, get a parametric model. Iterate in seconds.', color: '#f472b6' },
    { icon: BarChart3, title: 'Live Analytics', body: 'Structural loads, seismic response, energy performance, and wind analysis — all live in the model.', color: '#22d3ee' },
]

const END_STATS = [
    { value: 50000, suffix: '+', label: 'Architects Worldwide', icon: Users },
    { value: 3200000, suffix: '+', label: 'Designs Created', icon: Building2 },
    { value: 82, suffix: 'B+', label: 'USD Construction Value', icon: TrendingUp },
    { value: 120, suffix: '+', label: 'Countries & Regions', icon: Globe },
]

const QUICK_LINKS = [
    { href: '/', Icon: HomeIcon, label: 'Home', color: '#94a3b8' },
    { href: '/explore', Icon: Compass, label: 'Explore', color: '#60a5fa' },
    { href: '/build', Icon: Hammer, label: 'Build', color: '#fbbf24' },
    { href: '/projects', Icon: FolderKanban, label: 'Projects', color: '#a78bfa' },
    { href: '/simulation', Icon: Activity, label: 'Simulate', color: '#34d399' },
    { href: '/collaboration', Icon: Users, label: 'Collaborate', color: '#f472b6' },
]

function FeatureCard({ icon: Icon, title, body, color, index }: typeof FEATURES[0] & { index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 48 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative p-7 rounded-2xl transition-all duration-500"
            style={{
                background: `linear-gradient(145deg, ${color}08, transparent)`,
                border: `1px solid ${color}18`,
            }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
        >
            {/* Glow on hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px ${color}10` }}
            />

            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18, fontWeight: 700,
                color: '#fff', marginBottom: 10,
                letterSpacing: '-0.02em',
            }}>{title}</h3>
            <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.7,
            }}>{body}</p>
            <div
                className="mt-5 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: "'Inter', sans-serif", color, letterSpacing: '0.08em' }}
            >
                Explore <ArrowUpRight className="w-3 h-3" />
            </div>
        </motion.div>
    )
}

// ─── Doom Scroll Finale ───────────────────────────────────────────────────────
function DoomScrollFinale({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        let raf: number
        const tick = () => {
            setVisible(scrollT.current >= 0.92)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [scrollT])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-30 overflow-y-auto"
                    style={{ background: '#030712', pointerEvents: 'all' }}
                >
                    {/* Background radial glows */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden">
                        <div style={{
                            position: 'absolute', top: '-20%', left: '-10%',
                            width: '60%', height: '60%', borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: '-10%', right: '-10%',
                            width: '50%', height: '50%', borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
                        }} />
                        <div style={{
                            position: 'absolute', top: '40%', right: '20%',
                            width: '30%', height: '30%', borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)',
                        }} />
                    </div>

                    {/* Grid lines decoration */}
                    <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }} />

                    <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-32">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex justify-center mb-10"
                        >
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Sparkles className="w-3 h-3 text-violet-400" />
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                                    BuildVisor Platform · v3.0
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Mega heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="text-center mb-6"
                        >
                            <h2 style={{
                                fontFamily: "'Syne', system-ui, sans-serif",
                                fontSize: 'clamp(40px,7vw,96px)',
                                fontWeight: 800,
                                letterSpacing: '-0.04em',
                                lineHeight: 0.95,
                                color: '#fff',
                            }}>
                                Build the world<br />
                                <span style={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #22d3ee 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    smarter, faster.
                                </span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center max-w-2xl mx-auto mb-16"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 'clamp(14px,1.5vw,18px)',
                                fontWeight: 300,
                                color: 'rgba(255,255,255,0.35)',
                                lineHeight: 1.75,
                            }}
                        >
                            Everything you need to design, analyze, and deliver architecture —
                            in one unified, intelligent platform trusted by 50,000+ architects worldwide.
                        </motion.p>

                        {/* Animated stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
                        >
                            {END_STATS.map(({ value, suffix, label, icon: Icon }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.65 + i * 0.08 }}
                                    className="relative p-6 rounded-2xl text-center overflow-hidden group"
                                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                                >
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ background: 'rgba(99,102,241,0.05)' }} />
                                    <Icon className="w-4 h-4 mx-auto mb-3 text-violet-400/50" />
                                    <div style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontSize: 'clamp(28px,3vw,42px)',
                                        fontWeight: 800,
                                        color: '#fff',
                                        letterSpacing: '-0.03em',
                                    }}>
                                        <CountUp end={value} suffix={suffix} />
                                    </div>
                                    <div style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 11, fontWeight: 500,
                                        color: 'rgba(255,255,255,0.3)',
                                        letterSpacing: '0.04em',
                                        marginTop: 6,
                                    }}>{label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Marquee rows */}
                        <div className="mb-16 -mx-6 overflow-hidden">
                            <Marquee
                                items={['Parametric BIM', 'AI Design', '5D Analysis', 'Compliance', 'Simulation', 'Cloud Collaboration']}
                                direction={1}
                                speed={55}
                            />
                            <div className="mt-2">
                                <Marquee
                                    items={['IFC Export', 'Gantt Sync', 'Structural AI', 'Net-Zero Design', 'Live Costing', 'Global Workforce']}
                                    direction={-1}
                                    speed={45}
                                />
                            </div>
                        </div>

                        {/* Section header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center gap-5 mb-10"
                        >
                            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                            <span style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 10, letterSpacing: '0.35em',
                                color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
                            }}>
                                Platform Capabilities
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                        </motion.div>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
                            {FEATURES.map((f, i) => (
                                <FeatureCard key={f.title} {...f} index={i} />
                            ))}
                        </div>

                        {/* Final CTA section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="text-center mb-20"
                        >
                            <div className="inline-block mb-8 p-px rounded-3xl" style={{
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(34,211,238,0.4))',
                            }}>
                                <div className="px-16 py-12 rounded-3xl" style={{ background: '#030712' }}>
                                    <h3 style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontSize: 'clamp(24px,3vw,40px)',
                                        fontWeight: 800,
                                        color: '#fff',
                                        letterSpacing: '-0.03em',
                                        marginBottom: 12,
                                    }}>
                                        Ready to build smarter?
                                    </h3>
                                    <p style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 15, fontWeight: 300,
                                        color: 'rgba(255,255,255,0.35)',
                                        marginBottom: 28,
                                    }}>
                                        Join 50,000+ architects already using BuildVisor.
                                    </p>
                                    <Link href="/build">
                                        <button
                                            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full"
                                            style={{
                                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: 13, fontWeight: 700,
                                                color: '#fff',
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                boxShadow: '0 0 40px rgba(99,102,241,0.35)',
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Start for Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick navigation */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-16">
                            {QUICK_LINKS.map(({ href, Icon, label, color }) => (
                                <Link key={href} href={href}>
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex flex-col items-center gap-2.5 py-5 rounded-2xl cursor-pointer"
                                        style={{
                                            background: `${color}06`,
                                            border: `1px solid ${color}12`,
                                        }}
                                    >
                                        <Icon className="w-5 h-5 transition-transform" style={{ color }} />
                                        <span style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: 10, fontWeight: 600,
                                            letterSpacing: '0.1em',
                                            color: 'rgba(255,255,255,0.35)',
                                            textTransform: 'uppercase',
                                        }}>{label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-center gap-4" style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, letterSpacing: '0.25em',
                            color: 'rgba(255,255,255,0.15)',
                            textTransform: 'uppercase',
                        }}>
                            <span>BuildVisor 3.0</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                            <span>© 2025</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                            <span>All rights reserved</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ─── GPU Detection ────────────────────────────────────────────────────────────
function useIsLowEnd() {
    const [lowEnd, setLowEnd] = useState(false)
    useEffect(() => {
        const nav = navigator as Navigator & { deviceMemory?: number }
        // Only mark as low end if memory is really low or it's a very old CPU
        if ((nav.deviceMemory && nav.deviceMemory < 2) || navigator.hardwareConcurrency <= 2) {
            setLowEnd(true)
        }
        // Removed explicit mobile check that was disabling 3D scene
    }, [])
    return lowEnd
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ImmersiveHome() {
    const scrollTRef = useRef(0)
    const isLowEnd = useIsLowEnd()

    useEffect(() => {
        const onScroll = () => {
            // Use window.innerHeight to account for mobile address bar
            const viewportHeight = window.innerHeight
            const totalHeight = document.documentElement.scrollHeight
            const maxScroll = totalHeight - viewportHeight

            if (maxScroll <= 0) {
                scrollTRef.current = 0
                return
            }

            // Clamping scroll and using a more robust window.scrollY
            const currentScroll = window.pageYOffset || window.scrollY || 0
            scrollTRef.current = Math.min(Math.max(currentScroll / maxScroll, 0), 1)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll) // Handle orientation changes/resize

        onScroll()
        // Delay initial call to ensure layout is settled
        const timer = setTimeout(onScroll, 100)

        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className="relative bg-black min-h-screen">
            <ScrollBar />

            {/* 3D Scene */}
            <Canvas
                shadows
                // Lower DPR on mobile/low-end for performance
                dpr={isLowEnd ? 1 : [1, 1.5]}
                gl={{
                    antialias: true,
                    powerPreference: 'high-performance',
                    toneMapping: 4,
                    toneMappingExposure: 0.9,
                    alpha: false, // Better performance if no transparency needed for canvas background
                    stencil: false,
                    depth: true
                }}
                className="!fixed inset-0"
                style={{
                    zIndex: 0,
                    width: '100vw',
                    height: '100vh',
                    touchAction: 'none' // Prevent default touch behavior on canvas
                }}
            >
                <Suspense fallback={null}>
                    <HomeScene scrollT={scrollTRef} />
                </Suspense>
            </Canvas>

            {/* DOM Overlays */}
            <HeroOverlay scrollT={scrollTRef} />
            <RoomAnnouncer scrollT={scrollTRef} />
            <DoomScrollFinale scrollT={scrollTRef} />

            {/* Scroll Container - relative positioning ensures it works on all browsers */}
            <div style={{ height: '800vh', width: '100%', position: 'relative', pointerEvents: 'none', zIndex: 1 }} />
        </div>
    )
}
