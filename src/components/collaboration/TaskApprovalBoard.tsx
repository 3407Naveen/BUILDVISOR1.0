'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { KanbanSquare, Clock, User, AlertTriangle, ChevronRight, DollarSign, Check, X, ArrowRight } from 'lucide-react'

type TaskStatus = 'todo' | 'review' | 'approved' | 'rejected'

interface Task {
    id: string
    title: string
    assignee: string
    assigneeInitials: string
    deadline: string
    status: TaskStatus
    priority: 'low' | 'medium' | 'high'
    dependency?: string
    costImpact: string
    timelineImpact: string
    approvalRequired: boolean
}

const tasks: Task[] = [
    { id: 't1', title: 'Finalize pillar grid alignment', assignee: 'Arjun Verma', assigneeInitials: 'AV', deadline: 'Feb 22', status: 'review', priority: 'high', dependency: 'Foundation plan', costImpact: '+₹45K', timelineImpact: '+1 day', approvalRequired: true },
    { id: 't2', title: 'Approve warm LED lighting spec', assignee: 'Sarah Lee', assigneeInitials: 'SL', deadline: 'Feb 23', status: 'todo', priority: 'medium', costImpact: '+₹12K', timelineImpact: 'None', approvalRequired: true },
    { id: 't3', title: 'HVAC duct re-routing plan', assignee: 'ConstructCo', assigneeInitials: 'CC', deadline: 'Feb 24', status: 'todo', priority: 'high', dependency: 'Beam B1 review', costImpact: '+₹2.4L', timelineImpact: '+3 days', approvalRequired: true },
    { id: 't4', title: 'Update fire exit dimensions', assignee: 'Arjun Verma', assigneeInitials: 'AV', deadline: 'Feb 21', status: 'review', priority: 'high', costImpact: '+₹85K', timelineImpact: '+2 days', approvalRequired: true },
    { id: 't5', title: 'Kitchen fixture selection', assignee: 'Sarah Lee', assigneeInitials: 'SL', deadline: 'Feb 25', status: 'todo', priority: 'low', costImpact: '+₹35K', timelineImpact: 'None', approvalRequired: false },
    { id: 't6', title: 'Foundation waterproofing spec', assignee: 'ConstructCo', assigneeInitials: 'CC', deadline: 'Feb 20', status: 'approved', priority: 'medium', costImpact: '+₹1.2L', timelineImpact: '+1 day', approvalRequired: true },
    { id: 't7', title: 'Remove load-bearing wall option', assignee: 'Naveen S', assigneeInitials: 'NS', deadline: 'Feb 19', status: 'rejected', priority: 'high', costImpact: '-₹2L', timelineImpact: '-3 days', approvalRequired: true },
]

const columns: { key: TaskStatus; label: string; color: string; bgColor: string }[] = [
    { key: 'todo', label: 'To Do', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
    { key: 'review', label: 'In Review', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { key: 'approved', label: 'Approved', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { key: 'rejected', label: 'Rejected', color: 'text-red-400', bgColor: 'bg-red-500/10' },
]

const priorityConfig = {
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

export function TaskApprovalBoard() {
    const [taskList, setTaskList] = useState(tasks)

    const moveTask = (taskId: string, newStatus: TaskStatus) => {
        setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    }

    const totalCostApproved = taskList
        .filter(t => t.status === 'approved')
        .reduce((sum, t) => {
            const val = parseFloat(t.costImpact.replace(/[^\d.-]/g, '').replace('L', '')) || 0
            return sum + (t.costImpact.includes('L') ? val * 100000 : val * 1000)
        }, 0)

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                            <KanbanSquare className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">Task & Approval Workflow</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            Approved Impact: <span className="text-emerald-400">₹{(totalCostApproved / 100000).toFixed(1)}L</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-500">Track tasks, approvals, and their impact on project cost and timeline.</p>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-4 gap-0 divide-x divide-white/5 min-h-[300px]">
                {columns.map(col => {
                    const colTasks = taskList.filter(t => t.status === col.key)
                    return (
                        <div key={col.key} className="flex flex-col">
                            {/* Column Header */}
                            <div className="p-3 border-b border-white/5 flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${col.color}`}>{col.label}</span>
                                <span className={`w-5 h-5 rounded-full ${col.bgColor} ${col.color} text-[10px] font-bold flex items-center justify-center`}>
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Task Cards */}
                            <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                                {colTasks.map((task, idx) => {
                                    const prio = priorityConfig[task.priority]
                                    return (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-3 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-all group"
                                        >
                                            {/* Priority & Title */}
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${prio.bg} ${prio.text} border ${prio.border} shrink-0 mt-0.5`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs font-medium text-white leading-tight">{task.title}</span>
                                            </div>

                                            {/* Assignee & Deadline */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white">
                                                    {task.assigneeInitials}
                                                </div>
                                                <span className="text-[10px] text-slate-500">{task.assignee}</span>
                                                <div className="flex-1" />
                                                <span className="text-[10px] text-slate-600 flex items-center gap-0.5">
                                                    <Clock className="w-2.5 h-2.5" />{task.deadline}
                                                </span>
                                            </div>

                                            {/* Dependency */}
                                            {task.dependency && (
                                                <div className="flex items-center gap-1 text-[10px] text-slate-600 mb-2">
                                                    <ArrowRight className="w-2.5 h-2.5" />
                                                    <span>Depends on: {task.dependency}</span>
                                                </div>
                                            )}

                                            {/* Impact */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold ${task.costImpact.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    <DollarSign className="w-2.5 h-2.5 inline" />{task.costImpact}
                                                </span>
                                                <span className={`text-[10px] font-bold ${task.timelineImpact !== 'None' && task.timelineImpact.startsWith('+') ? 'text-amber-400' : 'text-slate-500'}`}>
                                                    <Clock className="w-2.5 h-2.5 inline" />{task.timelineImpact}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            {task.approvalRequired && (col.key === 'review' || col.key === 'todo') && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1 border-t border-white/5">
                                                    {col.key === 'todo' && (
                                                        <button
                                                            onClick={() => moveTask(task.id, 'review')}
                                                            className="flex-1 py-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 rounded border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                                                        >
                                                            Submit for Review
                                                        </button>
                                                    )}
                                                    {col.key === 'review' && (
                                                        <>
                                                            <button
                                                                onClick={() => moveTask(task.id, 'approved')}
                                                                className="flex-1 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => moveTask(task.id, 'rejected')}
                                                                className="flex-1 py-1 text-[10px] font-bold text-red-400 bg-red-500/10 rounded border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                <X className="w-3 h-3" /> Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })}

                                {colTasks.length === 0 && (
                                    <div className="flex items-center justify-center h-20 text-[10px] text-slate-600 uppercase tracking-wider">
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
