'use client'

import { useBuildingStore } from '@/store/buildingStore'
import { Info } from 'lucide-react'

export function ContextualTooltip() {
    const { hoveredElement, selectedElement } = useBuildingStore()

    const target = hoveredElement || selectedElement

    if (!target) return null

    return (
        <div className="absolute top-6 left-6 pointer-events-none z-50">
            <div className="bg-slate-950/90 text-slate-200 px-4 py-2 rounded-full border border-slate-700 text-sm shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 backdrop-blur-md flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-white">{target}</span>
                {selectedElement === target && <span className="text-xs text-slate-500 ml-2 border-l border-slate-700 pl-2">Selected</span>}
            </div>
        </div>
    )
}
