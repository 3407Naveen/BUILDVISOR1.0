'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ArrowRight, User, Calendar, AlertTriangle, Link2, TrendingUp } from 'lucide-react'

type TaskStatus = 'todo' | 'review' | 'approved' | 'rejected'
type Priority = 'High' | 'Medium' | 'Low'

interface Task {
    id: number
    title: string
    assignee: string
    assigneeInitials: string
    assigneeColor: string
    deadline: string
    priority: Priority
    status: TaskStatus
    dependency?: string
    impact: string
    costImpact: string
    requiresApproval: boolean
}

const initialTasks: Task[] = [
    { id: 1, title: 'Update structural drawings per v2.3 revisions', assignee: 'Arjun Verma', assigneeInitials: 'AV', assigneeColor: 'bg-blue-500', deadline: 'Feb 22', priority: 'High', status: 'todo', impact: 'Structural compliance', costImpact: '₹0', requiresApproval: true },
    { id: 2, title: 'Submit load rating report for Pillar A3', assignee: 'ConstructCo', assigneeInitials: 'CC', assigneeColor: 'bg-emerald-500', deadline: 'Feb 20', priority: 'High', status: 'review', dependency: 'Task 1', impact: 'Conflict resolution', costImpact: '₹0', requiresApproval: true },
    { id: 3, title: 'Finalize lighting fixture procurement list', assignee: 'Sarah Lee', assigneeInitials: 'SL', assigneeColor: 'bg-purple-500', deadline: 'Feb 25', priority: 'Medium', status: 'review', impact: 'Interior fit-out', costImpact: '+₹2.4L', requiresApproval: false },
    { id: 4, title: 'Revise BOQ for steel quantity changes', assignee: 'ConstructCo', assigneeInitials: 'CC', assigneeColor: 'bg-emerald-500', deadline: 'Feb 21', priority: 'High', status: 'approved', impact: 'Budget accuracy', costImpact: '+₹6.8L', requiresApproval: true },
    { id: 5, title: 'Review fire exit design for NBC compliance', assignee: 'Arjun Verma', assigneeInitials: 'AV', assigneeColor: 'bg-blue-500', deadline: 'Feb 19', priority: 'High', status: 'rejected', impact: 'Code compliance', costImpact: '+₹1.1L', requiresApproval: true },
    { id: 6, title: 'Site inspection — foundation progress report', assignee: 'ConstructCo', assigneeInitials: 'CC', assigneeColor: 'bg-emerald-500', deadline: 'Mar 1', priority: 'Low', status: 'todo', impact: 'Phase tracking', costImpact: '₹0', requiresApproval: false },
]

const columns: { id: TaskStatus; label: string; icon: any; color: string; bg: string }[] = [
    { id: 'todo', label: 'To Do', icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10' },
    { id: 'review', label: 'In Review', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
]

const priorityConfig: Record<Priority, string> = {
    High: 'text-red-400 bg-red-500/10 border-red-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
}

export function TaskKanban() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [justApproved, setJustApproved] = useState<number | null>(null)

    const moveTask = (id: number, newStatus: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
        if (newStatus === 'approved') {
            setJustApproved(id)
            setTimeout(() => setJustApproved(null), 3000)
        }
    }

    const approvedCostImpact = tasks
        .filter(t => t.status === 'approved' && t.costImpact !== '₹0')
        .reduce((sum, t) => {
            const val = parseFloat(t.costImpact.replace(/[^\d.]/g, '')) || 0
            return sum + val
        }, 0)

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Task & Approval Workflow</h3>
                        <p className="text-[10px] text-slate-500">{tasks.filter(t => t.status !== 'rejected').length} active tasks</p>
                    </div>
                </div>
                {justApproved && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-bold animate-pulse">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Cost recalculated: +₹{approvedCostImpact.toFixed(1)}L
                    </div>
                )}
            </div>

            {/* Kanban */}
            <div className="overflow-x-auto custom-scrollbar">
                <div className="flex gap-3 p-4" style={{ minWidth: 840 }}>
                    {columns.map(col => {
                        const Icon = col.icon
                        const colTasks = tasks.filter(t => t.status === col.id)
                        return (
                            <div key={col.id} className="flex-1 min-w-[200px] flex flex-col">
                                {/* Column Header */}
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${col.bg} border border-white/5 mb-2`}>
                                    <Icon className={`w-3.5 h-3.5 ${col.color}`} />
                                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                                    <span className={`ml-auto text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center bg-black/30 ${col.color}`}>{colTasks.length}</span>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-2 flex-1">
                                    {colTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={`bg-white/[0.02] border rounded-xl p-3 transition-all hover:border-white/10 group ${task.id === justApproved ? 'border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}
                                        >
                                            <div className="flex items-start justify-between gap-1 mb-2">
                                                <p className="text-xs font-semibold text-white leading-snug">{task.title}</p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold shrink-0 ${priorityConfig[task.priority]}`}>{task.priority}</span>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-5 h-5 rounded-full ${task.assigneeColor} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>{task.assigneeInitials}</div>
                                                <span className="text-[11px] text-slate-500 truncate">{task.assignee}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-[10px] text-slate-600 mb-2">
                                                <div className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{task.deadline}</div>
                                                {task.dependency && <div className="flex items-center gap-1 text-amber-500"><Link2 className="w-2.5 h-2.5" />Needs: {task.dependency}</div>}
                                            </div>

                                            {task.costImpact !== '₹0' && (
                                                <div className="text-[10px] text-red-400 mb-2 flex items-center gap-1">
                                                    <TrendingUp className="w-2.5 h-2.5" />Cost: {task.costImpact}
                                                </div>
                                            )}

                                            {/* Move actions */}
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                                                {col.id !== 'review' && (
                                                    <button onClick={() => moveTask(task.id, 'review')} className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg font-bold hover:bg-amber-500/20 transition-all">
                                                        → Review
                                                    </button>
                                                )}
                                                {col.id !== 'approved' && task.requiresApproval && (
                                                    <button onClick={() => moveTask(task.id, 'approved')} className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold hover:bg-emerald-500/20 transition-all">
                                                        ✓ Approve
                                                    </button>
                                                )}
                                                {col.id !== 'rejected' && (
                                                    <button onClick={() => moveTask(task.id, 'rejected')} className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/20 transition-all">
                                                        ✕ Reject
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
