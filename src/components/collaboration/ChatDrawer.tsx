'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Paperclip, Pin, AtSign, Sparkles, Reply, FileText, Image, ChevronDown } from 'lucide-react'

interface ChatMessage {
    id: string
    user: string
    initials: string
    color: string
    text: string
    time: string
    isPinned?: boolean
    attachment?: { name: string; type: 'pdf' | 'drawing' | '3d-snapshot' | 'image' }
    replyTo?: string
    mentions?: string[]
    thread?: ChatMessage[]
}

const messages: ChatMessage[] = [
    {
        id: 'm1', user: 'Arjun Verma', initials: 'AV', color: 'bg-blue-500',
        text: 'The pillar alignment on the north wall needs to shift 200mm eastward to match the updated grid. @Naveen can you review?',
        time: '10:15 AM', isPinned: true, mentions: ['Naveen'],
        thread: [
            { id: 'm1r1', user: 'Naveen S', initials: 'NS', color: 'bg-indigo-500', text: 'Checking the structural load impact now.', time: '10:22 AM' },
            { id: 'm1r2', user: 'Arjun Verma', initials: 'AV', color: 'bg-blue-500', text: 'Let me know — I can adjust the beam span if needed.', time: '10:25 AM' },
        ]
    },
    {
        id: 'm2', user: 'Sarah Lee', initials: 'SL', color: 'bg-purple-500',
        text: 'Updated the lighting spec for the living room area. Warm LED downlights throughout.',
        time: '9:45 AM',
        attachment: { name: 'lighting-spec-v3.pdf', type: 'pdf' }
    },
    {
        id: 'm3', user: 'ConstructCo', initials: 'CC', color: 'bg-emerald-500',
        text: 'Steel delivery confirmed for March 5th. Invoice attached for the first batch.',
        time: '9:30 AM',
        attachment: { name: 'invoice-steel-batch1.pdf', type: 'pdf' }
    },
    {
        id: 'm4', user: 'System AI', initials: 'AI', color: 'bg-cyan-500',
        text: '📋 Meeting Summary (Feb 18): Finalized pillar grid, approved warm LED lighting, steel delivery scheduled for March 5. Action items: Naveen to review structural load, Sarah to finalize kitchen fixtures by Feb 22.',
        time: '9:00 AM', isPinned: true
    },
    {
        id: 'm5', user: 'Naveen S', initials: 'NS', color: 'bg-indigo-500',
        text: 'Great progress team! Let\'s target v2.1 freeze by end of this week.',
        time: 'Yesterday'
    },
]

const attachmentIcons: Record<string, typeof FileText> = {
    pdf: FileText,
    drawing: FileText,
    '3d-snapshot': Image,
    image: Image,
}

interface ChatDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
    const [inputText, setInputText] = useState('')
    const [showThreadId, setShowThreadId] = useState<string | null>(null)
    const [showPinnedOnly, setShowPinnedOnly] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [isOpen])

    const displayMessages = showPinnedOnly
        ? messages.filter(m => m.isPinned)
        : messages

    const threadMessages = showThreadId
        ? messages.find(m => m.id === showThreadId)
        : null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/30"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-[420px] z-50 bg-[#080808] border-l border-white/5 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-blue-400" />
                                    <h3 className="font-bold text-white">Project Chat</h3>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">Live</span>
                                </div>
                                <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Filter bar */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setShowPinnedOnly(false); setShowThreadId(null); }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${!showPinnedOnly && !showThreadId ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => { setShowPinnedOnly(true); setShowThreadId(null); }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${showPinnedOnly ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Pin className="w-3 h-3" /> Pinned
                                </button>
                                <div className="flex-1" />
                                <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition-all">
                                    <Sparkles className="w-3 h-3" /> AI Summary
                                </button>
                            </div>
                        </div>

                        {/* Thread Header */}
                        {showThreadId && threadMessages && (
                            <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center gap-2">
                                <button onClick={() => setShowThreadId(null)} className="text-xs text-blue-400 hover:text-blue-300">← Back</button>
                                <span className="text-xs text-slate-400">Thread from {threadMessages.user}</span>
                            </div>
                        )}

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                            {showThreadId && threadMessages ? (
                                <>
                                    <MessageBubble msg={threadMessages} onThreadClick={() => { }} />
                                    {threadMessages.thread?.map(tm => (
                                        <div key={tm.id} className="ml-8">
                                            <MessageBubble msg={tm} onThreadClick={() => { }} isThreadMessage />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                displayMessages.map(msg => (
                                    <MessageBubble
                                        key={msg.id}
                                        msg={msg}
                                        onThreadClick={() => msg.thread && setShowThreadId(msg.id)}
                                    />
                                ))
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/5 bg-white/[0.01] shrink-0">
                            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                                <button className="text-slate-500 hover:text-slate-300 transition-colors">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button className="text-slate-500 hover:text-blue-400 transition-colors">
                                    <AtSign className="w-4 h-4" />
                                </button>
                                <input
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                                />
                                <button className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function MessageBubble({ msg, onThreadClick, isThreadMessage }: { msg: ChatMessage; onThreadClick: () => void; isThreadMessage?: boolean }) {
    const AttachIcon = msg.attachment ? attachmentIcons[msg.attachment.type] : null

    return (
        <div className="group">
            <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-full ${msg.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                    {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white">{msg.user}</span>
                        <span className="text-[10px] text-slate-600">{msg.time}</span>
                        {msg.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{msg.text}</p>

                    {/* Attachment */}
                    {msg.attachment && AttachIcon && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
                            <AttachIcon className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[11px] text-slate-300">{msg.attachment.name}</span>
                        </div>
                    )}

                    {/* Thread indicator & actions */}
                    <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.thread && !isThreadMessage && (
                            <button
                                onClick={onThreadClick}
                                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
                            >
                                <Reply className="w-3 h-3" /> {msg.thread.length} replies
                                <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
