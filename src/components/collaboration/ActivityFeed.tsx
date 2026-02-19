'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FileText, CheckCircle2, AlertCircle, List, Clock, Filter, ChevronRight, X, Milestone, Tag, Star, DollarSign } from 'lucide-react'

type ViewMode = 'list' | 'timeline'
type RoleFilter = 'all' | 'owner' | 'architect' | 'builder' | 'designer' | 'system'

interface Activity {
    id: number
    user: string
    role: RoleFilter
    action: string
    target: string
    time: string
    date: string
    type: 'comment' | 'approval' | 'update' | 'alert' | 'milestone' | 'cost' | 'version'
    message: string
    commentId?: number
    isMajor?: boolean
}

const activities: Activity[] = [
    { id: 1, user: 'Arjun Verma', role: 'architect', action: 'commented on', target: 'Ground Floor Map', time: '10:15 AM', date: 'Today', type: 'comment', message: 'The structural pillars need to be moved by 200mm to align with the grid.', commentId: 1 },
    { id: 2, user: 'ConstructCo Builds', role: 'builder', action: 'approved', target: 'Material List', time: '9:30 AM', date: 'Today', type: 'approval', message: 'All materials verified against spec. Proceeding with procurement.', isMajor: true },
    { id: 3, user: 'Sarah Lee', role: 'designer', action: 'updated', target: 'Lighting Plan', time: '8:45 AM', date: 'Today', type: 'update', message: 'Changed living room fixtures to warm LED detailed in attached spec.', commentId: 2 },
    { id: 4, user: 'System AI', role: 'system', action: 'flagged', target: 'Budget Overflow', time: '8:00 AM', date: 'Today', type: 'alert', message: 'Material cost exceeded estimate by 15%. Steel rebar pricing volatile.' },
    { id: 5, user: 'Naveen S', role: 'owner', action: 'released', target: 'Design v2.0', time: '4:15 PM', date: 'Yesterday', type: 'version', message: 'Structural optimization pass completed. Pillar grid realigned.', isMajor: true },
    { id: 6, user: 'System AI', role: 'system', action: 'milestone', target: 'Foundation Plan Approved', time: '2:00 PM', date: 'Yesterday', type: 'milestone', message: 'Foundation plan approved by all stakeholders. Construction can begin.', isMajor: true },
    { id: 7, user: 'ConstructCo Builds', role: 'builder', action: 'updated', target: 'Cost Estimate', time: '11:00 AM', date: 'Yesterday', type: 'cost', message: 'Updated cost projection: ₹86.2L (down from ₹87.7L after optimization).' },
    { id: 8, user: 'Arjun Verma', role: 'architect', action: 'approved', target: 'Structural Load Analysis', time: '9:00 AM', date: '2 days ago', type: 'approval', message: 'Load analysis within acceptable limits. Green light for construction phase.', isMajor: true },
]

const typeConfig: Record<string, { icon: typeof MessageSquare; bg: string; text: string }> = {
    comment: { icon: MessageSquare, bg: 'bg-blue-500/10', text: 'text-blue-400' },
    approval: { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    update: { icon: FileText, bg: 'bg-purple-500/10', text: 'text-purple-400' },
    alert: { icon: AlertCircle, bg: 'bg-amber-500/10', text: 'text-amber-400' },
    milestone: { icon: Milestone, bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    cost: { icon: DollarSign, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    version: { icon: Tag, bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
}

const roleFilters: { key: RoleFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'owner', label: 'Owner' },
    { key: 'architect', label: 'Architect' },
    { key: 'builder', label: 'Builder' },
    { key: 'designer', label: 'Designer' },
    { key: 'system', label: 'System' },
]

interface ActivityFeedProps {
    onCommentClick?: (commentId: number) => void
}

export function ActivityFeed({ onCommentClick }: ActivityFeedProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const filteredActivities = roleFilter === 'all'
        ? activities
        : activities.filter(a => a.role === roleFilter)

    // Group by date for timeline
    const groupedByDate = filteredActivities.reduce<Record<string, Activity[]>>((acc, a) => {
        if (!acc[a.date]) acc[a.date] = []
        acc[a.date].push(a)
        return acc
    }, {})

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm">Project Activity</h3>
                    <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-lg p-0.5">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${viewMode === 'list' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <List className="w-3 h-3" /> List
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${viewMode === 'timeline' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Clock className="w-3 h-3" /> Timeline
                        </button>
                    </div>
                </div>

                {/* Role Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                    <Filter className="w-3 h-3 text-slate-500 shrink-0" />
                    {roleFilters.map(rf => (
                        <button
                            key={rf.key}
                            onClick={() => setRoleFilter(rf.key)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${roleFilter === rf.key ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 border border-white/5'}`}
                        >
                            {rf.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {viewMode === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 space-y-4"
                        >
                            {filteredActivities.map((item) => {
                                const config = typeConfig[item.type]
                                const Icon = config.icon
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3 group"
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center ${config.text}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-slate-300">
                                                <span className="font-semibold text-white">{item.user}</span>{' '}
                                                {item.action}{' '}
                                                <span className="text-blue-200">{item.target}</span>
                                                {item.isMajor && <Star className="w-3 h-3 inline ml-1 text-amber-400" />}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mb-1">{item.time} · {item.date}</div>
                                            {item.message && (
                                                <div
                                                    className={`mt-1 p-3 bg-white/5 border border-white/5 rounded-lg text-xs text-slate-400 ${item.commentId ? 'cursor-pointer hover:bg-white/[0.08] transition-colors' : ''}`}
                                                    onClick={() => item.commentId && onCommentClick?.(item.commentId)}
                                                >
                                                    {item.message}
                                                    {item.commentId && (
                                                        <span className="ml-2 text-blue-400 text-[10px]">→ View in 3D</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="p-4"
                        >
                            {/* Horizontal Scrollable Timeline */}
                            <div className="overflow-x-auto custom-scrollbar pb-4">
                                <div className="flex gap-6 min-w-max">
                                    {Object.entries(groupedByDate).map(([date, dateActivities]) => (
                                        <div key={date} className="flex-shrink-0 w-64">
                                            {/* Date Header */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 border-4 border-[#0a0a0a]" />
                                                <span className="text-xs font-bold text-white uppercase tracking-wider">{date}</span>
                                                <div className="flex-1 h-px bg-white/10" />
                                            </div>

                                            {/* Activities */}
                                            <div className="space-y-3 ml-1.5 pl-4 border-l border-white/10">
                                                {dateActivities.map(item => {
                                                    const config = typeConfig[item.type]
                                                    const Icon = config.icon
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={`p-3 bg-white/[0.03] border rounded-lg transition-all cursor-pointer ${expandedId === item.id ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 hover:bg-white/[0.05]'} ${item.isMajor ? 'ring-1 ring-amber-500/20' : ''}`}
                                                            onClick={() => {
                                                                setExpandedId(expandedId === item.id ? null : item.id)
                                                                if (item.commentId) onCommentClick?.(item.commentId)
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={`w-5 h-5 rounded-full ${config.bg} flex items-center justify-center ${config.text}`}>
                                                                    <Icon className="w-2.5 h-2.5" />
                                                                </div>
                                                                <span className="text-xs font-semibold text-white truncate flex-1">{item.target}</span>
                                                                {item.isMajor && <Star className="w-3 h-3 text-amber-400 shrink-0" />}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 mb-1">{item.user} · {item.time}</div>

                                                            {/* Expanded Content */}
                                                            <AnimatePresence>
                                                                {expandedId === item.id && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.message}</p>
                                                                        {item.commentId && (
                                                                            <button className="mt-2 text-[10px] text-blue-400 flex items-center gap-1 hover:text-blue-300">
                                                                                <ChevronRight className="w-3 h-3" /> Focus in 3D Model
                                                                            </button>
                                                                        )}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
