'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Filter, Calendar, DollarSign, Activity } from 'lucide-react'

interface FilterDropdownProps {
    isOpen: boolean
    onClose: () => void
    activeFilters: {
        status: string
        budget: string
        date: string
    }
    onFilterChange: (type: string, value: string) => void
    onReset: () => void
}

export function FilterDropdown({ isOpen, onClose, activeFilters, onFilterChange, onReset }: FilterDropdownProps) {
    if (!isOpen) return null

    const statusOptions = ['All', 'Draft', 'Simulated', 'In Construction', 'Completed']
    const budgetOptions = ['All', '< ₹25L', '₹25L - ₹75L', '₹75L - ₹1.5Cr', '> ₹1.5Cr']
    const dateOptions = ['All', 'Today', 'This Week', 'This Month', 'Older']

    return (
        <div className="absolute top-full right-0 mt-2 z-50">
            {/* Backdrop for closing */}
            <div className="fixed inset-0" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="relative w-72 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5" />
                        Refine Projects
                    </h4>
                    <button onClick={onReset} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase">Reset</button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Status */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            <Activity className="w-3 h-3" />
                            Status
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => onFilterChange('status', opt)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${activeFilters.status === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            <DollarSign className="w-3 h-3" />
                            Budget
                        </div>
                        <div className="flex flex-col gap-1">
                            {budgetOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => onFilterChange('budget', opt)}
                                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${activeFilters.budget === opt ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    {opt}
                                    {activeFilters.budget === opt && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            <Calendar className="w-3 h-3" />
                            Creation Date
                        </div>
                        <div className="flex flex-col gap-1">
                            {dateOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => onFilterChange('date', opt)}
                                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${activeFilters.date === opt ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    {opt}
                                    {activeFilters.date === opt && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
