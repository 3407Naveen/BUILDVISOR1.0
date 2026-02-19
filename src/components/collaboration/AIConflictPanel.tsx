'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, ChevronDown, ChevronRight, Zap, DollarSign, Clock, Wrench, CheckCircle2, Eye, UserPlus } from 'lucide-react'

type Severity = 'low' | 'medium' | 'high'

interface ConflictAlert {
    id: string
    title: string
    category: 'structural' | 'budget' | 'material' | 'compliance' | 'timeline'
    severity: Severity
    description: string
    costImpact: string
    delayEstimate: string
    structuralLoad: string
    element: string
    detectedAt: string
}

const alerts: ConflictAlert[] = [
    {
        id: 'c1', title: 'Beam-Column Junction Clash', category: 'structural', severity: 'high',
        description: 'Main beam B1 intersects with HVAC duct routing at grid intersection C3-D4. Structural integrity may be compromised.',
        costImpact: '+₹2.4L', delayEstimate: '+3 days', structuralLoad: '92% → 78%',
        element: 'Main Beam B1', detectedAt: '12 mins ago'
    },
    {
        id: 'c2', title: 'Budget Deviation — Steel Rebar', category: 'budget', severity: 'medium',
        description: 'Fe550 steel pricing has increased by 18% over estimate. Current procurement exceeds budget allocation by ₹1.8L.',
        costImpact: '+₹1.8L', delayEstimate: 'None', structuralLoad: 'N/A',
        element: 'Material Costs', detectedAt: '1 hour ago'
    },
    {
        id: 'c3', title: 'Non-compliant Fire Exit Width', category: 'compliance', severity: 'high',
        description: 'Ground floor emergency exit corridor measures 900mm, below the NBC mandatory minimum of 1200mm.',
        costImpact: '+₹85K', delayEstimate: '+2 days', structuralLoad: 'N/A',
        element: 'Ground Floor Exit', detectedAt: '2 hours ago'
    },
    {
        id: 'c4', title: 'Material Grade Mismatch', category: 'material', severity: 'low',
        description: 'Specified M25 concrete for non-load bearing partition walls. M20 is sufficient and cost-effective for this application.',
        costImpact: '-₹45K savings', delayEstimate: 'None', structuralLoad: 'Adequate',
        element: 'Partition Walls', detectedAt: '5 hours ago'
    },
    {
        id: 'c5', title: 'Foundation Timeline Risk', category: 'timeline', severity: 'medium',
        description: 'Monsoon forecast indicates heavy rainfall in weeks 8-10. Foundation curing may be delayed if not completed before week 7.',
        costImpact: '+₹1.2L (idle labor)', delayEstimate: '+5-8 days', structuralLoad: 'N/A',
        element: 'Foundation Phase', detectedAt: 'Yesterday'
    },
]

const severityConfig: Record<Severity, { bg: string; text: string; border: string }> = {
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

const categoryIcons: Record<string, typeof AlertTriangle> = {
    structural: AlertTriangle,
    budget: DollarSign,
    material: Wrench,
    compliance: Shield,
    timeline: Clock,
}

interface AIConflictPanelProps {
    onReviewInModel?: (element: string) => void
}

export function AIConflictPanel({ onReviewInModel }: AIConflictPanelProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [resolvedIds, setResolvedIds] = useState<string[]>([])

    const activeAlerts = alerts.filter(a => !resolvedIds.includes(a.id))
    const highCount = activeAlerts.filter(a => a.severity === 'high').length
    const medCount = activeAlerts.filter(a => a.severity === 'medium').length

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-500/10 rounded-lg">
                            <Zap className="w-4 h-4 text-red-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">AI Conflict Detection</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">Live</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {highCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                                {highCount} Critical
                            </span>
                        )}
                        {medCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                                {medCount} Warning
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-slate-500">Real-time analysis of structural, financial, and compliance conflicts.</p>
            </div>

            {/* Alert List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {activeAlerts.map((alert) => {
                    const sev = severityConfig[alert.severity]
                    const CategoryIcon = categoryIcons[alert.category]
                    const isExpanded = expandedId === alert.id

                    return (
                        <div key={alert.id} className="border-b border-white/5 last:border-b-0">
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                                className="w-full p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors text-left"
                            >
                                <div className={`p-1.5 rounded-lg ${sev.bg} shrink-0 mt-0.5`}>
                                    <CategoryIcon className={`w-3.5 h-3.5 ${sev.text}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-white truncate">{alert.title}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sev.bg} ${sev.text} border ${sev.border} shrink-0`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                        <span>{alert.element}</span>
                                        <span>•</span>
                                        <span>{alert.detectedAt}</span>
                                    </div>
                                </div>
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pl-12">
                                            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{alert.description}</p>

                                            {/* Impact Grid */}
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Cost Δ</div>
                                                    <div className={`text-xs font-bold ${alert.costImpact.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>{alert.costImpact}</div>
                                                </div>
                                                <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Delay</div>
                                                    <div className="text-xs font-bold text-amber-400">{alert.delayEstimate}</div>
                                                </div>
                                                <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5">
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Load</div>
                                                    <div className="text-xs font-bold text-blue-400">{alert.structuralLoad}</div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setResolvedIds(prev => [...prev, alert.id])}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" /> Resolve
                                                </button>
                                                <button
                                                    onClick={() => onReviewInModel?.(alert.element)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all"
                                                >
                                                    <Eye className="w-3 h-3" /> Review in Model
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5 hover:bg-white/10 transition-all">
                                                    <UserPlus className="w-3 h-3" /> Assign Task
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}

                {activeAlerts.length === 0 && (
                    <div className="p-8 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">All conflicts resolved</p>
                    </div>
                )}
            </div>
        </div>
    )
}
