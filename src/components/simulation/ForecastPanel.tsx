'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Globe, Sparkles, ArrowRight } from 'lucide-react'

export function ForecastPanel() {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Risk Zones */}
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Predictive Risk Zones
                </h3>

                <div className="space-y-4">
                    <RiskItem
                        title="Steel Price Surge"
                        period="Q3 2026 - Q1 2027"
                        severity="High"
                        desc="Projected global supply chain tightening expected to spike structural steel prices by 14-18%."
                    />
                    <RiskItem
                        title="Skilled Labor Shortage"
                        period="Active Index"
                        severity="Medium"
                        desc="Regional infrastructure boom is diverting specialized masonry and electrical labor."
                    />
                </div>
            </div>

            {/* Comparative Benchmarks */}
            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Comparative Benchmarks
                </h3>

                <div className="space-y-6">
                    <BenchmarkBar label="This Project" value={100} color="bg-blue-500" sub="Optimized" />
                    <BenchmarkBar label="City Average" value={112} color="bg-slate-700" sub="+12%" />
                    <BenchmarkBar label="State Average" value={125} color="bg-slate-800" sub="+25%" />
                    <BenchmarkBar label="National Average" value={138} color="bg-slate-900" sub="+38%" />
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-[10px] text-blue-300/80 leading-relaxed italic">
                        "Your design utilizes 22% more recycled aggregate than state averages, buffering against virgin material inflation."
                    </p>
                </div>
            </div>
        </div>
    )
}

function RiskItem({ title, period, severity, desc }: { title: string, period: string, severity: 'High' | 'Medium' | 'Low', desc: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group cursor-default">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                    {severity} Risk
                </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mb-2">
                <MapPin className="w-3 h-3" />
                {period}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
    )
}

function BenchmarkBar({ label, value, color, sub }: { label: string, value: number, color: string, sub: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-white font-bold">{sub}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(value / 140) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    )
}

export function WhatIfControls({ inflation, setInflation, speed, setSpeed, material, setMaterial }: any) {
    return (
        <div className="bg-slate-950 border border-white/5 p-6 rounded-2xl h-full shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Simulation Engine</h3>
            </div>

            <div className="space-y-10">
                {/* Inflation Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inflation Bias</span>
                        <span className="text-sm font-bold text-blue-400">{inflation}%</span>
                    </div>
                    <input
                        type="range"
                        min="3"
                        max="20"
                        value={inflation}
                        onChange={(e) => setInflation(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase">
                        <span>Conservative</span>
                        <span>Hyper-inflation</span>
                    </div>
                </div>

                {/* Construction Speed */}
                <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Build Velocity</span>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'standard', label: 'Standard', desc: '14 Months' },
                            { id: 'turbo', label: 'Turbo (2x)', desc: '7 Months' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSpeed(s.id)}
                                className={`flex flex-col items-start p-3 rounded-xl border transition-all ${speed === s.id
                                        ? 'bg-blue-600/10 border-blue-500/50 text-white'
                                        : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-xs font-bold">{s.label}</span>
                                <span className="text-[10px] opacity-60 font-medium">{s.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Material Selection */}
                <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Materiality Substitution</span>
                    <div className="space-y-2">
                        {[
                            { id: 'virgin', label: 'Virgin Structural Concrete', sub: 'Standard Carbon' },
                            { id: 'recycled', label: 'Eco-Optimized Hybrid', sub: 'Low Carbon / Tech-Infused' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMaterial(m.id)}
                                className={`w-full flex flex-col items-start p-3 rounded-xl border transition-all ${material === m.id
                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                                        : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-xs font-bold">{m.label}</span>
                                    {material === m.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                </div>
                                <span className="text-[10px] opacity-60 font-medium">{m.sub}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium tracking-wide">ROI Delta</span>
                    <span className="text-emerald-400 font-bold">+ {inflation < 6 ? '14.2%' : '8.1%'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium tracking-wide">Cash-Flow Burn</span>
                    <span className="text-white font-bold">₹{(speed === 'turbo' ? 45 : 22).toLocaleString('en-IN')}L <span className="text-[10px] text-slate-500">/ mo</span></span>
                </div>

                <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2">
                    Sync Full 5D Schedule
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
