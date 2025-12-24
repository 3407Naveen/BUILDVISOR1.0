'use client'

import { useBuildingStore } from '@/store/buildingStore'
import { Undo2, Redo2, RefreshCcw, Camera, Sun, Moon, Sunset } from 'lucide-react'
import { Button } from './button'

export function WorkspaceControls() {
    const { lightingMode, setLightingMode, resetParams } = useBuildingStore()

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {/* Lighting Controls */}
            <div className="bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 flex gap-1 shadow-xl">
                <button
                    onClick={() => setLightingMode('day')}
                    className={`p-2 rounded-md transition-colors ${lightingMode === 'day' ? 'bg-amber-500/20 text-amber-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    title="Day Mode"
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setLightingMode('evening')}
                    className={`p-2 rounded-md transition-colors ${lightingMode === 'evening' ? 'bg-orange-500/20 text-orange-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    title="Evening Mode"
                >
                    <Sunset className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setLightingMode('night')}
                    className={`p-2 rounded-md transition-colors ${lightingMode === 'night' ? 'bg-indigo-500/20 text-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    title="Night Mode"
                >
                    <Moon className="w-4 h-4" />
                </button>
            </div>

            {/* History & Tools */}
            <div className="bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 flex gap-1 shadow-xl">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                    <Undo2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                    <Redo2 className="w-4 h-4" />
                </button>
                <div className="w-px bg-slate-800 mx-1" />
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" onClick={() => resetParams()} title="Reset View">
                    <RefreshCcw className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Save Snapshot">
                    <Camera className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
