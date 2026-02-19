'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, Sparkles } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useState } from 'react'

export function AssistantPanel() {
    const { isAssistantOpen, toggleAssistant } = useUIStore()
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your architectural co-pilot. I can help you optimize designs, calculate costs, or explain building codes. How can I assist you today?' }
    ])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim()) return
        setMessages([...messages, { role: 'user', text: input }])

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: "That's an interesting idea. Based on your current floor plan, expanding the north wing would increase natural light but might require additional structural reinforcement. Would you like to see a cost simulation for that?" }])
        }, 1000)

        setInput('')
    }

    return (
        <AnimatePresence>
            {isAssistantOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleAssistant}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-50 shadow-2xl flex flex-col pt-16"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/20 rounded-lg">
                                    <Bot className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Architect</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-slate-400">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleAssistant}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white/5 border border-white/5 text-slate-300 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                <Sparkles className="w-3 h-3" />
                                                Analysis
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about design, cost, or materials..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
