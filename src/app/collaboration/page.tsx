'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MessageCircle, Eye, HardHat, Package, Sparkles } from 'lucide-react'

import { ActivityFeed } from '@/components/collaboration/ActivityFeed'
import { InvitePanel } from '@/components/collaboration/InvitePanel'
import { ModelViewerPanel } from '@/components/collaboration/ModelViewerPanel'
import { AIConflictPanel } from '@/components/collaboration/AIConflictPanel'
import { DesignVersionsPanel } from '@/components/collaboration/DesignVersionsPanel'
import { ChatDrawer } from '@/components/collaboration/ChatDrawer'
import { TaskApprovalBoard } from '@/components/collaboration/TaskApprovalBoard'
import { ContractorView } from '@/components/collaboration/ContractorView'
import { VendorView } from '@/components/collaboration/VendorView'

type ViewMode = 'owner' | 'contractor' | 'vendor'

const viewModes: { key: ViewMode; label: string; icon: typeof Eye; desc: string }[] = [
    { key: 'owner', label: 'Owner View', icon: Eye, desc: 'Full project command center' },
    { key: 'contractor', label: 'Contractor View', icon: HardHat, desc: 'Construction & logistics' },
    { key: 'vendor', label: 'Vendor View', icon: Package, desc: 'Procurement & payments' },
]

export default function CollaborationPage() {
    const [activeView, setActiveView] = useState<ViewMode>('owner')
    const [chatOpen, setChatOpen] = useState(false)
    const [focusedCommentId, setFocusedCommentId] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState<'conflicts' | 'versions' | 'tasks'>('conflicts')

    const handleCommentClick = (commentId: number) => {
        setFocusedCommentId(commentId)
        setTimeout(() => setFocusedCommentId(null), 3000)
    }

    const handleReviewInModel = (element: string) => {
        // Map element names to comment IDs for 3D focus
        const elementMap: Record<string, number> = {
            'Main Beam B1': 4,
            'Ground Floor Exit': 1,
            'Partition Walls': 2,
        }
        const commentId = elementMap[element]
        if (commentId) handleCommentClick(commentId)
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 md:px-6 pb-20">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                            <Sparkles className="w-3 h-3" />
                            AI-Powered Command Center
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Collaboration Hub</h1>
                        <p className="text-slate-400 text-sm font-light">Real-time coordination between owners, architects, builders, and vendors.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Mode Tabs */}
                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-xl p-1 gap-0.5">
                            {viewModes.map(vm => {
                                const Icon = vm.icon
                                return (
                                    <button
                                        key={vm.key}
                                        onClick={() => setActiveView(vm.key)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeView === vm.key
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">{vm.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Live Sync Badge */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Sync
                        </div>

                        {/* Chat Toggle */}
                        <button
                            onClick={() => setChatOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-slate-300 text-xs font-medium hover:bg-white/10 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Chat</span>
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                        </button>
                    </div>
                </div>

                {/* Main Content - Conditional on View Mode */}
                <AnimatePresence mode="wait">
                    {activeView === 'owner' && (
                        <motion.div
                            key="owner"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Top Row: 3D Model + Side Panels */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                                {/* 3D Model Viewer — Center Stage */}
                                <div className="lg:col-span-8" style={{ minHeight: 420 }}>
                                    <ModelViewerPanel focusedCommentId={focusedCommentId} />
                                </div>

                                {/* Right Side Panels */}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    {/* Tabbed Panel Switcher */}
                                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-1 flex gap-0.5">
                                        {([
                                            { key: 'conflicts' as const, label: 'AI Conflicts' },
                                            { key: 'versions' as const, label: 'Versions' },
                                            { key: 'tasks' as const, label: 'Tasks' },
                                        ]).map(tab => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key
                                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                                        : 'text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 370 }}>
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'conflicts' && (
                                                <motion.div key="conflicts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <AIConflictPanel onReviewInModel={handleReviewInModel} />
                                                </motion.div>
                                            )}
                                            {activeTab === 'versions' && (
                                                <motion.div key="versions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <DesignVersionsPanel />
                                                </motion.div>
                                            )}
                                            {activeTab === 'tasks' && (
                                                <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <TaskApprovalBoard />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Activity + Team */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                                {/* Activity Feed */}
                                <div className="lg:col-span-8" style={{ minHeight: 350 }}>
                                    <ActivityFeed onCommentClick={handleCommentClick} />
                                </div>

                                {/* Team Members */}
                                <div className="lg:col-span-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: 500 }}>
                                    <InvitePanel />
                                </div>
                            </div>

                            {/* Full Width Task Board */}
                            <div className="mb-4">
                                <TaskApprovalBoard />
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'contractor' && (
                        <motion.div
                            key="contractor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ContractorView />
                        </motion.div>
                    )}

                    {activeView === 'vendor' && (
                        <motion.div
                            key="vendor"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <VendorView />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Drawer */}
                <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
            </div>
        </div>
    )
}
