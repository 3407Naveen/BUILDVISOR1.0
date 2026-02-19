'use client'

import { useState } from 'react'
import { MessageSquare, FileText, CheckCircle2, AlertCircle, GitBranch, DollarSign, LayoutList, GitCommit, Filter, ChevronDown, X, User, Clock } from 'lucide-react'

type Role = 'All' | 'Owner' | 'Architect' | 'Builder' | 'Designer' | 'System'
type ActivityType = 'comment' | 'approval' | 'update' | 'alert' | 'version' | 'cost'

interface Activity {
    id: number
    user: string
    role: Role
    action: string
    target: string
    time: string
    timestamp: string
    type: ActivityType
    message: string
    milestone?: boolean
    element?: string
}

const activities: Activity[] = [
    { id: 1, user: 'Arjun Verma', role: 'Architect', action: 'pinned comment on', target: 'North Wall / Pillar A3', time: '10 min ago', timestamp: '11:25 AM', type: 'comment', message: 'The structural pillars need to be moved by 200mm to align with the grid. Current position creates a 12kN overload on foundation plate.', element: 'wall-north', milestone: false },
    { id: 2, user: 'ConstructCo', role: 'Builder', action: 'approved', target: 'Material List v2.1', time: '1 hr ago', timestamp: '10:35 AM', type: 'approval', message: 'Approved with condition: Substitution of M20 concrete with M25 for ground floor columns.', milestone: true },
    { id: 3, user: 'Sarah Lee', role: 'Designer', action: 'updated', target: 'Lighting Plan', time: '3 hrs ago', timestamp: '08:30 AM', type: 'update', message: 'Changed living room fixtures to warm LED (2700K). Spec updated in attached PDF. Energy rating improved by 18%.', milestone: false },
    { id: 4, user: 'System', role: 'System', action: 'flagged', target: 'Budget Overflow', time: 'Yesterday', timestamp: 'Feb 18, 4:15 PM', type: 'alert', message: 'Material cost exceeded estimate by 15%. Auto-notified Owner. AI recommends reviewing steel procurement strategy.', milestone: true },
    { id: 5, user: 'Naveen S', role: 'Owner', action: 'released version', target: 'Design v2.3', time: 'Yesterday', timestamp: 'Feb 18, 2:00 PM', type: 'version', message: 'Published v2.3 with all architect revisions incorporated. Distributed to Builder and Contractor teams.', milestone: true },
    { id: 6, user: 'System', role: 'System', action: 'recalculated', target: 'Project Cost', time: '2 days ago', timestamp: 'Feb 17, 5:00 PM', type: 'cost', message: 'Cost updated: ₹1.24Cr → ₹1.38Cr (+11.3%) due to material price revision and scope change in electrical works.', milestone: true },
    { id: 7, user: 'Arjun Verma', role: 'Architect', action: 'commented on', target: 'Roof Structure', time: '2 days ago', timestamp: 'Feb 17, 1:45 PM', type: 'comment', message: 'Skylight position conflicts with truss spacing. Recommend shifting 900mm west per structural calculation.', milestone: false },
    { id: 8, user: 'ConstructCo', role: 'Builder', action: 'submitted', target: 'Phase 1 Progress Report', time: '3 days ago', timestamp: 'Feb 16, 9:00 AM', type: 'update', message: 'Foundation work 85% complete. Awaiting rebar inspection clearance from structural engineer before pouring.', milestone: false },
]

const typeConfig: Record<ActivityType, { icon: any; color: string; bg: string }> = {
    comment: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    approval: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    update: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    alert: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    version: { icon: GitBranch, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    cost: { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
}

const roleColors: Record<string, string> = {
    Owner: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    Architect: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    Builder: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    Designer: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    System: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
}

interface ActivityTimelineProps {
    onCommentClick?: (id: number) => void
}

export function ActivityTimeline({ onCommentClick }: ActivityTimelineProps) {
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
    const [roleFilter, setRoleFilter] = useState<Role>('All')
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [showModal, setShowModal] = useState<Activity | null>(null)

    const roles: Role[] = ['All', 'Owner', 'Architect', 'Builder', 'Designer', 'System']
    const filtered = roleFilter === 'All' ? activities : activities.filter(a => a.role === roleFilter)

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm">Project Activity</h3>
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LayoutList className="w-3.5 h-3.5" /> List
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === 'timeline' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <GitCommit className="w-3.5 h-3.5" /> Timeline
                        </button>
                    </div>
                </div>
                {/* Role Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                    <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {roles.map(r => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 transition-all ${roleFilter === r ? (r === 'All' ? 'bg-white/10 text-white border-white/20' : `${roleColors[r]} border`) : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-white/10'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'list' ? (
                    <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {filtered.map(item => {
                            const cfg = typeConfig[item.type]
                            const Icon = cfg.icon
                            const isExpanded = expandedId === item.id
                            return (
                                <div key={item.id} className={`group rounded-xl border transition-all duration-200 ${item.milestone ? 'border-white/8 bg-white/[0.025]' : 'border-transparent hover:border-white/5 hover:bg-white/[0.015]'}`}>
                                    <div className="flex gap-3 p-3">
                                        <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="text-sm text-slate-300 leading-snug">
                                                        <span className="font-semibold text-white">{item.user}</span>
                                                        {' '}{item.action}{' '}
                                                        <span
                                                            className={`text-blue-300 hover:text-blue-200 cursor-pointer transition-colors ${item.element ? 'underline underline-offset-2 decoration-dotted' : ''}`}
                                                            onClick={() => item.element && item.id && onCommentClick?.(item.id)}
                                                        >
                                                            {item.target}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-slate-500">{item.time}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${roleColors[item.role]}`}>{item.role}</span>
                                                        {item.milestone && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">Milestone</span>}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                                    className="shrink-0 p-1 rounded-md text-slate-600 hover:text-slate-400 transition-colors"
                                                >
                                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                            {isExpanded && (
                                                <div className="mt-2 p-3 bg-white/[0.03] border border-white/5 rounded-lg text-xs text-slate-400 leading-relaxed">
                                                    {item.message}
                                                    <button
                                                        onClick={() => setShowModal(item)}
                                                        className="block mt-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                                    >
                                                        View Full Details →
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* Timeline View */
                    <div className="h-full overflow-x-auto custom-scrollbar">
                        <div className="flex items-start gap-0 px-4 pt-8 pb-4" style={{ minWidth: `${filtered.length * 180}px` }}>
                            {filtered.map((item, i) => {
                                const cfg = typeConfig[item.type]
                                const Icon = cfg.icon
                                return (
                                    <div key={item.id} className="flex flex-col items-center" style={{ width: 180, flexShrink: 0 }}>
                                        {/* Connector line */}
                                        <div className="flex items-center w-full mb-2">
                                            {i > 0 && <div className="flex-1 h-px bg-white/10" />}
                                            <div className={`w-8 h-8 rounded-full ${cfg.bg} border-2 ${item.milestone ? 'border-amber-500/50 scale-110' : 'border-white/10'} flex items-center justify-center shrink-0 cursor-pointer hover:scale-110 transition-transform`}
                                                onClick={() => setShowModal(item)}>
                                                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                                            </div>
                                            {i < filtered.length - 1 && <div className="flex-1 h-px bg-white/10" />}
                                        </div>
                                        {/* Card */}
                                        <div
                                            className={`w-40 p-2.5 rounded-xl border cursor-pointer hover:border-white/15 transition-all ${item.milestone ? 'bg-amber-500/[0.04] border-amber-500/15' : 'bg-white/[0.02] border-white/5'}`}
                                            onClick={() => setShowModal(item)}
                                        >
                                            <div className="text-[10px] text-slate-500 mb-1">{item.timestamp}</div>
                                            <div className="text-xs font-bold text-white leading-tight mb-1">{item.target}</div>
                                            <div className="text-[10px] text-slate-500 truncate">{item.user}</div>
                                            <div className={`mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full border inline-block font-bold ${roleColors[item.role]}`}>{item.role}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(null)}>
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${roleColors[showModal.role]}`}>{showModal.role}</span>
                                    {showModal.milestone && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">Milestone</span>}
                                </div>
                                <h4 className="text-base font-bold text-white">{showModal.target}</h4>
                            </div>
                            <button onClick={() => setShowModal(null)} className="text-slate-500 hover:text-white p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                {showModal.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">{showModal.user}</div>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />{showModal.timestamp}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-slate-300 leading-relaxed">
                            {showModal.message}
                        </div>
                        {showModal.element && (
                            <button
                                className="w-full mt-3 py-2 text-xs font-bold text-blue-400 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl transition-all"
                                onClick={() => { onCommentClick?.(showModal.id); setShowModal(null) }}
                            >
                                View in 3D Model →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
