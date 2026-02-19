'use client'

import { useState } from 'react'
import { GitBranch, Clock, User, ArrowLeftRight, RotateCcw, DollarSign, ChevronRight, X, Check, Eye, TrendingUp, TrendingDown } from 'lucide-react'

interface Version {
    id: string
    label: string
    author: string
    authorInitials: string
    authorColor: string
    timestamp: string
    summary: string
    costTotal: string
    costDelta: string
    timelineDelta: string
    changes: { type: 'added' | 'modified' | 'removed'; desc: string }[]
    current: boolean
}

const versions: Version[] = [
    {
        id: 'v2.3', label: 'v2.3', author: 'Naveen S', authorInitials: 'NS', authorColor: 'bg-amber-500',
        timestamp: 'Feb 18, 2026 · 2:00 PM', summary: 'Incorporated all architect structural revisions. Roof spec finalized.',
        costTotal: '₹1.38Cr', costDelta: '+₹14L', timelineDelta: '+3 weeks',
        changes: [
            { type: 'modified', desc: 'Pillar A3 repositioned 200mm east' },
            { type: 'added', desc: 'Secondary egress added on Floor 2' },
            { type: 'modified', desc: 'Roof truss spec updated to ISA 75x75x8' },
        ],
        current: true
    },
    {
        id: 'v2.2', label: 'v2.2', author: 'Arjun Verma', authorInitials: 'AV', authorColor: 'bg-blue-500',
        timestamp: 'Feb 15, 2026 · 11:30 AM', summary: 'Structural revisions per load analysis report. Material substitute approved.',
        costTotal: '₹1.24Cr', costDelta: '+₹8L', timelineDelta: '+1 week',
        changes: [
            { type: 'modified', desc: 'Ground floor columns upgraded M20→M25' },
            { type: 'modified', desc: 'HVAC duct material corrected to GI' },
            { type: 'removed', desc: 'Redundant load-bearing wall in Zone C removed' },
        ],
        current: false
    },
    {
        id: 'v2.1', label: 'v2.1', author: 'Sarah Lee', authorInitials: 'SL', authorColor: 'bg-purple-500',
        timestamp: 'Feb 10, 2026 · 3:45 PM', summary: 'Interior layout finalized. Lighting plan and material board updated.',
        costTotal: '₹1.16Cr', costDelta: '+₹4.5L', timelineDelta: '0',
        changes: [
            { type: 'added', desc: 'Warm LED lighting plan (2700K) — 22 fixtures' },
            { type: 'modified', desc: 'Master bedroom layout rotated 90°' },
        ],
        current: false
    },
    {
        id: 'v2.0', label: 'v2.0', author: 'Naveen S', authorInitials: 'NS', authorColor: 'bg-amber-500',
        timestamp: 'Feb 1, 2026 · 9:00 AM', summary: 'Major redesign — shifted from RCC to hybrid steel-RCC system.',
        costTotal: '₹1.11Cr', costDelta: '+₹22L', timelineDelta: '+5 weeks',
        changes: [
            { type: 'modified', desc: 'Structural system changed: RCC → Hybrid Steel-RCC' },
            { type: 'added', desc: 'Basement level added (B1)' },
            { type: 'modified', desc: 'Facade material: Brick → Precast Concrete Panel' },
        ],
        current: false
    },
    {
        id: 'v1.0', label: 'v1.0', author: 'Naveen S', authorInitials: 'NS', authorColor: 'bg-amber-500',
        timestamp: 'Jan 15, 2026 · 10:00 AM', summary: 'Initial design — base concept approved by all stakeholders.',
        costTotal: '₹89L', costDelta: '—', timelineDelta: '—',
        changes: [
            { type: 'added', desc: 'Initial 3BHK layout — 3,200 sqft' },
            { type: 'added', desc: 'Ground + 2 floors, flat roof' },
            { type: 'added', desc: 'RCC structural system, brick facade' },
        ],
        current: false
    },
]

export function VersionControlPanel() {
    const [compareMode, setCompareMode] = useState(false)
    const [compareA, setCompareA] = useState<string>('v2.3')
    const [compareB, setCompareB] = useState<string>('v2.2')
    const [revertTarget, setRevertTarget] = useState<Version | null>(null)
    const [revertConfirmed, setRevertConfirmed] = useState(false)

    const vA = versions.find(v => v.id === compareA)
    const vB = versions.find(v => v.id === compareB)

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Design Versions</h3>
                        <p className="text-[10px] text-slate-500">{versions.length} versions tracked</p>
                    </div>
                </div>
                <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${compareMode ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Compare
                </button>
            </div>

            {/* Compare Mode */}
            {compareMode && vA && vB && (
                <div className="p-3 border-b border-white/5 bg-indigo-500/[0.03]">
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={compareA}
                            onChange={e => setCompareA(e.target.value)}
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white appearance-none"
                        >
                            {versions.map(v => <option key={v.id} value={v.id}>{v.label} — {v.author}</option>)}
                        </select>
                        <ArrowLeftRight className="w-4 h-4 text-slate-500 shrink-0" />
                        <select
                            value={compareB}
                            onChange={e => setCompareB(e.target.value)}
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white appearance-none"
                        >
                            {versions.map(v => <option key={v.id} value={v.id}>{v.label} — {v.author}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                            <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">{vA.label}</div>
                            <div className="text-xs font-bold text-white mb-1">{vA.costTotal}</div>
                            <p className="text-[10px] text-slate-500">{vA.summary}</p>
                            <div className="mt-2 space-y-1">
                                {vA.changes.map((c, i) => (
                                    <div key={i} className={`text-[10px] flex items-start gap-1 ${c.type === 'added' ? 'text-emerald-400' : c.type === 'removed' ? 'text-red-400' : 'text-blue-400'}`}>
                                        <span className="shrink-0">{c.type === 'added' ? '+ ' : c.type === 'removed' ? '- ' : '~ '}</span>{c.desc}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{vB.label}</div>
                            <div className="text-xs font-bold text-white mb-1">{vB.costTotal}</div>
                            <p className="text-[10px] text-slate-500">{vB.summary}</p>
                            <div className="mt-2 space-y-1">
                                {vB.changes.map((c, i) => (
                                    <div key={i} className={`text-[10px] flex items-start gap-1 ${c.type === 'added' ? 'text-emerald-400' : c.type === 'removed' ? 'text-red-400' : 'text-blue-400'}`}>
                                        <span className="shrink-0">{c.type === 'added' ? '+ ' : c.type === 'removed' ? '- ' : '~ '}</span>{c.desc}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Version List */}
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 380 }}>
                <div className="p-3 space-y-2">
                    {versions.map((version, i) => (
                        <div key={version.id} className={`rounded-xl border transition-all ${version.current ? 'border-indigo-500/25 bg-indigo-500/[0.04]' : 'border-white/5 bg-white/[0.015] hover:border-white/10'}`}>
                            <div className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-full ${version.authorColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                                            {version.authorInitials}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">{version.label}</span>
                                                {version.current && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold">Current</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <User className="w-2.5 h-2.5" />{version.author}
                                                <Clock className="w-2.5 h-2.5 ml-1" />{version.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xs font-bold text-white">{version.costTotal}</div>
                                        {version.costDelta !== '—' && (
                                            <div className={`text-[10px] flex items-center gap-0.5 justify-end ${version.costDelta.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {version.costDelta.startsWith('+') ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                                {version.costDelta}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{version.summary}</p>
                                <div className="mt-2 space-y-0.5">
                                    {version.changes.slice(0, 2).map((c, ci) => (
                                        <div key={ci} className={`text-[10px] flex items-start gap-1 ${c.type === 'added' ? 'text-emerald-400' : c.type === 'removed' ? 'text-red-400' : 'text-blue-400'}`}>
                                            <span className="shrink-0 font-bold">{c.type === 'added' ? '+' : c.type === 'removed' ? '−' : '~'}</span>
                                            <span className="text-slate-500">{c.desc}</span>
                                        </div>
                                    ))}
                                    {version.changes.length > 2 && <div className="text-[10px] text-slate-600">+{version.changes.length - 2} more changes</div>}
                                </div>
                                {!version.current && (
                                    <div className="flex gap-2 mt-3">
                                        <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all">
                                            <Eye className="w-3 h-3" /> Preview
                                        </button>
                                        <button
                                            onClick={() => setRevertTarget(version)}
                                            className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg transition-all"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Revert to {version.label}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revert Confirmation Modal */}
            {revertTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => { setRevertTarget(null); setRevertConfirmed(false) }}>
                    <div className="bg-[#0f0f0f] border border-amber-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        {!revertConfirmed ? (
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <RotateCcw className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white">Revert to {revertTarget.label}?</h4>
                                        <p className="text-xs text-slate-500">{revertTarget.timestamp}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl mb-4">
                                    <p className="text-xs text-amber-300/80 leading-relaxed">
                                        This will replace the current design ({versions.find(v => v.current)?.label}) with {revertTarget.label}. All changes after {revertTarget.label} will be archived as a backup version.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setRevertTarget(null); setRevertConfirmed(false) }} className="flex-1 py-2 text-xs font-bold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition-all">Cancel</button>
                                    <button onClick={() => setRevertConfirmed(true)} className="flex-1 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all">Confirm Revert</button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                                    <Check className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">Reverted to {revertTarget.label}</h4>
                                <p className="text-xs text-slate-500 mb-4">Current version archived. Project synced.</p>
                                <button onClick={() => { setRevertTarget(null); setRevertConfirmed(false) }} className="px-6 py-2 text-xs font-bold text-white bg-white/10 border border-white/10 rounded-xl hover:bg-white/15 transition-all">Done</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
