'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, Clock, User, DollarSign, ArrowLeftRight, RotateCcw, X, ChevronRight, Check } from 'lucide-react'

interface DesignVersion {
    id: string
    version: string
    title: string
    author: string
    authorInitials: string
    timestamp: string
    costDelta: string
    timelineDelta: string
    changes: string[]
    totalCost: string
    timeline: string
}

const versions: DesignVersion[] = [
    {
        id: 'v3', version: 'v2.1', title: 'HVAC Re-routing + Fire Exit Update',
        author: 'Arjun Verma', authorInitials: 'AV', timestamp: 'Today, 10:30 AM',
        costDelta: '+₹3.2L', timelineDelta: '+5 days',
        changes: ['HVAC duct rerouted around Beam B1', 'Fire exit widened to 1200mm', 'Added emergency lighting'],
        totalCost: '₹89.4L', timeline: '14 months'
    },
    {
        id: 'v2', version: 'v2.0', title: 'Structural Optimization Pass',
        author: 'Naveen S', authorInitials: 'NS', timestamp: 'Yesterday, 4:15 PM',
        costDelta: '-₹1.5L', timelineDelta: '-2 days',
        changes: ['Pillar grid realigned to 6m spacing', 'Reduced slab thickness from 150mm to 125mm', 'Switched to M30 concrete for columns'],
        totalCost: '₹86.2L', timeline: '13.5 months'
    },
    {
        id: 'v1b', version: 'v1.1', title: 'Interior Layout Revision',
        author: 'Sarah Lee', authorInitials: 'SL', timestamp: '3 days ago',
        costDelta: '+₹2.1L', timelineDelta: '+1 day',
        changes: ['Living room expanded by 12 sqft', 'Kitchen island added', 'Warm LED fixtures throughout'],
        totalCost: '₹87.7L', timeline: '13.7 months'
    },
    {
        id: 'v1', version: 'v1.0', title: 'Initial Design Baseline',
        author: 'Naveen S', authorInitials: 'NS', timestamp: '1 week ago',
        costDelta: '—', timelineDelta: '—',
        changes: ['Foundation plan finalized', 'Exterior walls and roof defined', 'Initial cost estimation'],
        totalCost: '₹85.6L', timeline: '13.5 months'
    },
]

export function DesignVersionsPanel() {
    const [selectedVersions, setSelectedVersions] = useState<string[]>([])
    const [showCompare, setShowCompare] = useState(false)
    const [revertTarget, setRevertTarget] = useState<string | null>(null)

    const toggleSelect = (id: string) => {
        setSelectedVersions(prev =>
            prev.includes(id)
                ? prev.filter(v => v !== id)
                : prev.length < 2 ? [...prev, id] : [prev[1], id]
        )
    }

    const compareVersions = selectedVersions.length === 2
        ? [versions.find(v => v.id === selectedVersions[0])!, versions.find(v => v.id === selectedVersions[1])!]
        : null

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/10 rounded-lg">
                            <GitBranch className="w-4 h-4 text-purple-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">Design Versions</h3>
                    </div>
                    {selectedVersions.length === 2 && (
                        <button
                            onClick={() => setShowCompare(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all"
                        >
                            <ArrowLeftRight className="w-3 h-3" /> Compare
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-500">Select two versions to compare. Click to expand details.</p>
            </div>

            {/* Version List */}
            <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto custom-scrollbar">
                {versions.map((v, idx) => (
                    <div key={v.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-start gap-3">
                            {/* Selection checkbox */}
                            <button
                                onClick={() => toggleSelect(v.id)}
                                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${selectedVersions.includes(v.id)
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {selectedVersions.includes(v.id) && <Check className="w-3 h-3" />}
                            </button>

                            {/* Timeline dot */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className={`w-3 h-3 rounded-full border-2 ${idx === 0 ? 'border-blue-500 bg-blue-500/30' : 'border-slate-600 bg-slate-800'}`} />
                                {idx < versions.length - 1 && <div className="w-px h-12 bg-white/5 mt-1" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">{v.version}</span>
                                    <span className="text-sm font-semibold text-white truncate">{v.title}</span>
                                </div>

                                <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{v.author}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.timestamp}</span>
                                </div>

                                {/* Deltas */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${v.costDelta.startsWith('+') ? 'bg-red-500/10 text-red-400' : v.costDelta.startsWith('-') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                        <DollarSign className="w-2.5 h-2.5 inline mr-0.5" />{v.costDelta}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${v.timelineDelta.startsWith('+') ? 'bg-amber-500/10 text-amber-400' : v.timelineDelta.startsWith('-') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                        <Clock className="w-2.5 h-2.5 inline mr-0.5" />{v.timelineDelta}
                                    </span>
                                </div>

                                {/* Changes */}
                                <div className="space-y-1">
                                    {v.changes.map((change, ci) => (
                                        <div key={ci} className="flex items-start gap-1.5 text-xs text-slate-500">
                                            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                                            <span>{change}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Revert button */}
                                {idx > 0 && (
                                    <button
                                        onClick={() => setRevertTarget(v.id)}
                                        className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <RotateCcw className="w-3 h-3" /> Revert to this version
                                    </button>
                                )}
                            </div>

                            {/* Total */}
                            <div className="text-right shrink-0">
                                <div className="text-xs font-bold text-white">{v.totalCost}</div>
                                <div className="text-[10px] text-slate-500">{v.timeline}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Compare Modal */}
            <AnimatePresence>
                {showCompare && compareVersions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setShowCompare(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                                    Version Comparison
                                </h3>
                                <button onClick={() => setShowCompare(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {compareVersions.map(v => (
                                    <div key={v.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">{v.version}</div>
                                        <div className="text-sm font-bold text-white mb-3">{v.title}</div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Total Cost</span>
                                                <span className="text-emerald-400 font-bold">{v.totalCost}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Timeline</span>
                                                <span className="text-blue-400 font-bold">{v.timeline}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Author</span>
                                                <span className="text-slate-300">{v.author}</span>
                                            </div>
                                            <div className="pt-2 mt-2 border-t border-white/5">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Changes</div>
                                                {v.changes.map((c, i) => (
                                                    <div key={i} className="text-slate-400 py-0.5">{c}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost/Timeline Diff */}
                            <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cost Difference</div>
                                    <div className="text-lg font-bold text-amber-400">
                                        {(() => {
                                            const c1 = parseFloat(compareVersions[0].totalCost.replace(/[^\d.]/g, ''))
                                            const c2 = parseFloat(compareVersions[1].totalCost.replace(/[^\d.]/g, ''))
                                            const diff = c1 - c2
                                            return `${diff > 0 ? '+' : ''}₹${Math.abs(diff).toFixed(1)}L`
                                        })()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Timeline Diff</div>
                                    <div className="text-lg font-bold text-blue-400">
                                        {(() => {
                                            const t1 = parseFloat(compareVersions[0].timeline)
                                            const t2 = parseFloat(compareVersions[1].timeline)
                                            const diff = t1 - t2
                                            return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} months`
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Revert Confirmation Modal */}
            <AnimatePresence>
                {revertTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setRevertTarget(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <RotateCcw className="w-5 h-5 text-amber-400" />
                                <h3 className="text-lg font-bold text-white">Revert Design?</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">
                                This will restore the project to <span className="text-white font-semibold">{versions.find(v => v.id === revertTarget)?.version}</span>.
                                A backup of the current version will be saved automatically.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRevertTarget(null)}
                                    className="flex-1 px-4 py-2 bg-white/5 text-slate-300 rounded-lg border border-white/5 text-sm font-medium hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setRevertTarget(null)}
                                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-500 transition-all"
                                >
                                    Confirm Revert
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
