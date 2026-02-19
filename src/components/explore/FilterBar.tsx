'use client'

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const filters = [
    { id: 'style', label: 'Style', options: ['All', 'Modern', 'Traditional', 'Minimalist', 'Industrial', 'Sustainable', 'Brutalist'] },
    { id: 'floors', label: 'Floors', options: ['All', '1 Storey', '2 Storey', 'Villa'] },
    { id: 'budget', label: 'Budget', options: ['All', '< ₹20L', '₹20L - ₹50L', '₹50L - ₹1Cr', '> ₹1Cr'] },
]

interface FilterBarProps {
    onSearchChange: (val: string) => void
    onFilterChange: (type: string, val: string) => void
    activeFilters: any
}

export function FilterBar({ onSearchChange, onFilterChange, activeFilters }: FilterBarProps) {
    const [openFilter, setOpenFilter] = useState<string | null>(null)
    const filterBarRef = useRef<HTMLDivElement>(null)

    // Click outside handler to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
                setOpenFilter(null)
            }
        }

        if (openFilter) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openFilter])

    return (
        <div ref={filterBarRef} className="flex flex-col md:flex-row items-center gap-4 w-full p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">

            {/* Search Input */}
            <div className="relative flex-1 w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search for styles or designs..."
                    className="w-full h-10 pl-10 pr-4 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all placeholder:text-slate-500"
                />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/10" />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {filters.map((filter) => (
                    <div key={filter.id} className="relative group shrink-0">
                        <button
                            onClick={() => setOpenFilter(openFilter === filter.id ? null : filter.id)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all ${activeFilters[filter.id] !== 'All'
                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {filter.label}{activeFilters[filter.id] !== 'All' ? `: ${activeFilters[filter.id]}` : ''}
                            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${openFilter === filter.id ? 'rotate-180' : ''}`} />
                        </button>

                        {openFilter === filter.id && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-64 overflow-y-auto">
                                {filter.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            onFilterChange(filter.id, opt)
                                            setOpenFilter(null)
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeFilters[filter.id] === opt
                                            ? 'bg-blue-600/20 text-blue-400'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors shrink-0 md:ml-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Advanced</span>
                </button>
            </div>

        </div>
    )
}
