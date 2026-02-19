'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, TrendingUp, AlertCircle, TrendingDown } from 'lucide-react'

interface DataPoint {
    year: number
    value: number
}

interface Series {
    label: string
    data: DataPoint[]
    color: string
}

export function ConstructionRateAnalysis({ inflation }: { inflation: number }) {
    const [timeRange, setTimeRange] = useState<'5y' | '10y' | '20y'>('10y')
    const [hoveredYear, setHoveredYear] = useState<number | null>(null)

    const years = useMemo(() => {
        const startYear = 2026
        const count = timeRange === '5y' ? 5 : timeRange === '10y' ? 10 : 20
        return Array.from({ length: count }, (_, i) => startYear + i)
    }, [timeRange])

    const generateData = (rate: number): DataPoint[] => {
        let currentVal = 100
        return years.map(year => {
            const point = { year, value: currentVal }
            currentVal = currentVal * (1 + rate / 100)
            return point
        })
    }

    const series: Series[] = useMemo(() => [
        { label: 'Base Case (Prev. Trends)', data: generateData(5), color: '#3b82f6' },
        { label: 'Aggressive Inflation', data: generateData(inflation), color: '#ef4444' },
        { label: 'Market Optimized', data: generateData(3), color: '#10b981' },
    ], [inflation, years])

    const maxValue = useMemo(() => {
        return Math.max(...series.flatMap(s => s.data.map(d => d.value))) * 1.1
    }, [series])

    const pointsToPath = (data: DataPoint[]) => {
        const width = 800
        const height = 300
        const xStep = width / (data.length - 1)

        return data.map((p, i) => {
            const x = i * xStep
            const y = height - (p.value / maxValue) * height
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')
    }

    return (
        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Construction Rate Analysis
                        <div className="p-1 rounded-full bg-blue-500/10 text-blue-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 uppercase tracking-tight font-medium">Market Volatility & Escalation Forecast</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 h-fit">
                    {(['5y', '10y', '20y'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setTimeRange(r)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${timeRange === r ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chart */}
            <div className="relative aspect-[16/6] min-h-[300px] w-full mt-4">
                <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={p}
                            x1="0"
                            y1={300 * p}
                            x2="800"
                            y2={300 * p}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Lines */}
                    {series.map((s, idx) => (
                        <motion.path
                            key={s.label}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: idx * 0.2 }}
                            d={pointsToPath(s.data)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {/* Interactive vertical line */}
                    {hoveredYear !== null && (
                        <line
                            x1={(hoveredYear / (years.length - 1)) * 800}
                            y1="0"
                            x2={(hoveredYear / (years.length - 1)) * 800}
                            y2="300"
                            stroke="rgba(255,255,255,0.2)"
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* Intersection Points */}
                    {series.map((s) => (
                        <g key={s.label + '-pts'}>
                            {s.data.map((p, i) => (
                                <rect
                                    key={p.year}
                                    x={(i / (years.length - 1)) * 800 - 20}
                                    y="0"
                                    width="40"
                                    height="300"
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredYear(i)}
                                    onMouseLeave={() => setHoveredYear(null)}
                                    className="cursor-pointer"
                                />
                            ))}
                        </g>
                    ))}
                </svg>

                {/* Labels / Legend */}
                <div className="flex flex-wrap gap-6 mt-8">
                    {series.map((s) => (
                        <div key={s.label} className="flex items-center gap-2">
                            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Dynamic Tooltip */}
                <AnimatePresence>
                    {hoveredYear !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-10 pointer-events-none p-4 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-20 w-48"
                            style={{
                                left: `${(hoveredYear / (years.length - 1)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Projected for {years[hoveredYear]}</div>
                            <div className="space-y-2">
                                {series.map(s => (
                                    <div key={s.label} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 capitalize">{s.label.split(' ')[0]}</span>
                                        <span className="font-bold text-white">₹{(s.data[hoveredYear].value * 10000).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-blue-400 italic">
                                <Info className="w-3 h-3" />
                                AI Insight: {hoveredYear % 2 === 0 ? "Steel price peak alert" : "Labor shortage risk"}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Market Tickers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/5">
                <MarketTicker label="Cement" change="+4.2%" trend="up" />
                <MarketTicker label="Steel (Structural)" change="-1.5%" trend="down" />
                <MarketTicker label="Labor Index" change="+8.1%" trend="up" />
                <MarketTicker label="Fuel / Logistics" change="+2.4%" trend="up" />
            </div>
        </div>
    )
}

function MarketTicker({ label, change, trend }: { label: string, change: string, trend: 'up' | 'down' }) {
    return (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Market Spot</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                </div>
            </div>
        </div>
    )
}
