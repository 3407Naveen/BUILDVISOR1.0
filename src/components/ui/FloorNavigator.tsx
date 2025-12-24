'use client'

import { useBuildingStore } from '@/store/buildingStore'
import { Layers } from 'lucide-react'

export function FloorNavigator() {
    const { params, activeFloor, setActiveFloor } = useBuildingStore()

    const floors = Array.from({ length: params.floorCount }, (_, i) => i + 1)

    return (
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-slate-800 flex flex-col gap-1 z-20 shadow-xl">
            <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 mb-1 border-b border-slate-800 pb-2">
                <Layers className="w-3 h-3" />
                <span>LEVELS</span>
            </div>
            <button
                onClick={() => setActiveFloor(null)}
                className={`text-xs px-3 py-1.5 rounded-md text-left transition-all ${activeFloor === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
                Full Building
            </button>
            {floors.reverse().map(floor => (
                <button
                    key={floor}
                    onClick={() => setActiveFloor(floor)}
                    className={`text-xs px-3 py-1.5 rounded-md text-left transition-all ${activeFloor === floor ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                    Floor {floor}
                </button>
            ))}
        </div>
    )
}
