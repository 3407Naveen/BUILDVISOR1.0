'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Shield, Mail, MessageCircle, CheckCircle2, ChevronDown, Search, Copy, Link2 } from 'lucide-react'

interface Member {
    name: string
    role: string
    email: string
    avatar: string
    isOnline: boolean
    taskCount: number
    lastActive: string
    permissions: { view: boolean; edit: boolean; admin: boolean }
}

const members: Member[] = [
    { name: 'Naveen S', role: 'Owner', email: 'naveen@buildvisor.com', avatar: 'NS', isOnline: true, taskCount: 5, lastActive: 'Now', permissions: { view: true, edit: true, admin: true } },
    { name: 'Arjun Verma', role: 'Architect', email: 'arjun.arch@studio.com', avatar: 'AV', isOnline: true, taskCount: 3, lastActive: '5 mins ago', permissions: { view: true, edit: true, admin: false } },
    { name: 'ConstructCo', role: 'Builder', email: 'contact@constructco.in', avatar: 'CC', isOnline: true, taskCount: 4, lastActive: '12 mins ago', permissions: { view: true, edit: true, admin: false } },
    { name: 'Sarah Lee', role: 'Designer', email: 'sarah.design@gmail.com', avatar: 'SL', isOnline: false, taskCount: 2, lastActive: '2 hours ago', permissions: { view: true, edit: false, admin: false } },
]

const roleColors: Record<string, string> = {
    Owner: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Architect: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Builder: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Designer: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

export function InvitePanel() {
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [expandedMember, setExpandedMember] = useState<string | null>(null)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('Architect')
    const [invitePermissions, setInvitePermissions] = useState({ view: true, edit: false, admin: false })

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-sm">Team Members</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {members.filter(m => m.isOnline).length} online
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-500">Manage access, roles, and permissions.</p>
            </div>

            <div className="p-4">
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full py-2.5 mb-4 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Invite Collaborator
                </button>

                <div className="space-y-2">
                    {members.map((member) => (
                        <div key={member.email}>
                            <div
                                className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer"
                                onClick={() => setExpandedMember(expandedMember === member.email ? null : member.email)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                            {member.avatar}
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${member.isOnline ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white flex items-center gap-1.5">
                                            {member.name}
                                            {member.taskCount > 0 && (
                                                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-400">{member.taskCount} tasks</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-500">{member.isOnline ? 'Online' : member.lastActive}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold ${roleColors[member.role] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                                        {member.role}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${expandedMember === member.email ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedMember === member.email && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-14 pr-2 pb-3 space-y-2">
                                            {/* Quick Actions */}
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all">
                                                    <MessageCircle className="w-3 h-3" /> Message
                                                </button>
                                                <button className="flex items-center gap-1 px-2.5 py-1 bg-white/5 text-slate-400 text-[10px] font-bold rounded-lg border border-white/5 hover:bg-white/10 transition-all">
                                                    <Mail className="w-3 h-3" /> Email
                                                </button>
                                            </div>

                                            {/* Permissions */}
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-2 mb-1">Permissions</div>
                                            <div className="flex items-center gap-3">
                                                {(['view', 'edit', 'admin'] as const).map(perm => (
                                                    <label key={perm} className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${member.permissions[perm] ? 'bg-blue-600 border-blue-500' : 'border-white/10'}`}>
                                                            {member.permissions[perm] && <CheckCircle2 className="w-2 h-2 text-white" />}
                                                        </div>
                                                        <span className="uppercase font-bold tracking-wider">{perm}</span>
                                                    </label>
                                                ))}
                                            </div>

                                            {/* Recent Activity */}
                                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-2 mb-1">Recent</div>
                                            <div className="text-xs text-slate-400">Commented on Ground Floor Map · 10 mins ago</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Permissions */}
            <div className="border-t border-white/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <h3 className="font-bold text-white text-sm">Project Permissions</h3>
                </div>
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Public Link Sharing</span>
                        <div className="w-8 h-4 bg-slate-700 rounded-full relative cursor-pointer hover:bg-slate-600 transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-0 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Builder Edit Access</span>
                        <div className="w-8 h-4 bg-emerald-600 rounded-full relative cursor-pointer hover:bg-emerald-500 transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">AI Suggestions</span>
                        <div className="w-8 h-4 bg-emerald-600 rounded-full relative cursor-pointer hover:bg-emerald-500 transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-0 shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setShowInviteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">Invite Collaborator</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Email Input */}
                            <div className="mb-4">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">Email Address</label>
                                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                                    <Search className="w-4 h-4 text-slate-500" />
                                    <input
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="mb-4">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">Role</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Owner', 'Architect', 'Builder', 'Designer'].map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setInviteRole(role)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${inviteRole === role ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-white/[0.03] text-slate-400 border-white/5 hover:bg-white/[0.06]'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Granular Permissions */}
                            <div className="mb-6">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2 block">Access Control</label>
                                <div className="space-y-2">
                                    {([
                                        { key: 'view' as const, label: 'View Access', desc: 'Can view models, plans, and documents' },
                                        { key: 'edit' as const, label: 'Edit Access', desc: 'Can modify designs and submit changes' },
                                        { key: 'admin' as const, label: 'Admin Access', desc: 'Full control including user management' },
                                    ]).map(perm => (
                                        <div
                                            key={perm.key}
                                            className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-lg cursor-pointer hover:bg-white/[0.05] transition-all"
                                            onClick={() => setInvitePermissions(prev => ({ ...prev, [perm.key]: !prev[perm.key] }))}
                                        >
                                            <div>
                                                <div className="text-xs font-medium text-white">{perm.label}</div>
                                                <div className="text-[10px] text-slate-500">{perm.desc}</div>
                                            </div>
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${invitePermissions[perm.key] ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${invitePermissions[perm.key] ? 'right-0' : 'left-0'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-slate-300 rounded-lg border border-white/5 text-sm font-medium hover:bg-white/10 transition-all">
                                    <Link2 className="w-4 h-4" /> Copy Link
                                </button>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
