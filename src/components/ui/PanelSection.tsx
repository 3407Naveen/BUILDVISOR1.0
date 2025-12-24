'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Lock } from 'lucide-react'

interface PanelSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    locked?: boolean
}

export function PanelSection({ title, children, defaultOpen = false, locked = false }: PanelSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
            <button
                onClick={() => !locked && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors ${locked ? 'cursor-not-allowed opacity-50 text-slate-500' : 'hover:bg-slate-800 text-slate-200'}`}
            >
                <div className="flex items-center gap-2">
                    {locked && <Lock className="w-3 h-3 text-slate-500" />}
                    {title}
                </div>
                {!locked && (
                    isOpen ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />
                )}
            </button>
            {isOpen && !locked && (
                <div className="p-3 border-t border-slate-800 space-y-3">
                    {children}
                </div>
            )}
        </div>
    )
}
