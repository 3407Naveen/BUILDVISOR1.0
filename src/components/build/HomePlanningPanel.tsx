'use client'

import { useBuildingStore, Room } from '@/store/buildingStore'
import { PanelSection } from '@/components/ui/PanelSection'
import { Plus, Trash2, AlertTriangle, Zap, Wind, Droplets } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function HomePlanningPanel() {
    const { params, setParams } = useBuildingStore()

    // Helper to update plot
    const updatePlot = (key: keyof typeof params.plot, value: any) => {
        setParams({ plot: { ...params.plot, [key]: value } })
    }

    // Helper to update setbacks
    const updateSetback = (key: keyof typeof params.setbacks, value: number) => {
        setParams({ setbacks: { ...params.setbacks, [key]: value } })
    }

    // Helper to update rooms
    const addRoom = () => {
        const newRoom: Room = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Room',
            type: 'bedroom',
            floor: 1,
            width: 12,
            depth: 12
        }
        setParams({ rooms: [...params.rooms, newRoom] })
    }

    const updateRoom = (id: string, updates: Partial<Room>) => {
        setParams({
            rooms: params.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
        })
    }

    const removeRoom = (id: string) => {
        setParams({
            rooms: params.rooms.filter(r => r.id !== id)
        })
    }

    // Calculations
    const plotArea = params.plot.width * params.plot.depth
    const builtUpArea = params.rooms.reduce((acc, room) => acc + (room.width * room.depth), 0)
    const coverage = (builtUpArea / plotArea) * 100
    const isValidCoverage = coverage <= 75 // Simple rule

    return (
        <div className="space-y-2">

            {/* 1. Plot & Structure */}
            <PanelSection title="Plot & Structure" defaultOpen={true}>
                {/* Plot Size */}
                <div className="space-y-3 mb-4">
                    <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Plot Size ({params.plot.unit})</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-xs text-slate-400 mb-1 block">Width</span>
                            <Input
                                type="number"
                                value={params.plot.width}
                                onChange={(e) => updatePlot('width', Number(e.target.value))}
                                className="h-8 bg-slate-950 border-slate-800 text-slate-200"
                            />
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 mb-1 block">Depth</span>
                            <Input
                                type="number"
                                value={params.plot.depth}
                                onChange={(e) => updatePlot('depth', Number(e.target.value))}
                                className="h-8 bg-slate-950 border-slate-800 text-slate-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Setbacks */}
                <div className="space-y-3 mb-4">
                    <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Setbacks ({params.plot.unit})</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Front</span>
                            <input
                                type="number"
                                value={params.setbacks.front}
                                onChange={(e) => updateSetback('front', Number(e.target.value))}
                                className="w-12 h-6 bg-slate-950 border border-slate-800 rounded px-1 text-right text-slate-300"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Back</span>
                            <input
                                type="number"
                                value={params.setbacks.back}
                                onChange={(e) => updateSetback('back', Number(e.target.value))}
                                className="w-12 h-6 bg-slate-950 border border-slate-800 rounded px-1 text-right text-slate-300"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Left</span>
                            <input
                                type="number"
                                value={params.setbacks.left}
                                onChange={(e) => updateSetback('left', Number(e.target.value))}
                                className="w-12 h-6 bg-slate-950 border border-slate-800 rounded px-1 text-right text-slate-300"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Right</span>
                            <input
                                type="number"
                                value={params.setbacks.right}
                                onChange={(e) => updateSetback('right', Number(e.target.value))}
                                className="w-12 h-6 bg-slate-950 border border-slate-800 rounded px-1 text-right text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Orientation & Floors */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Orientation</label>
                        <select
                            value={params.orientation}
                            onChange={(e) => setParams({ orientation: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded h-8 text-xs px-2 text-slate-200"
                        >
                            {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-1">Floors</label>
                        <select
                            value={params.floorCount}
                            onChange={(e) => setParams({ floorCount: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded h-8 text-xs px-2 text-slate-200"
                        >
                            {[1, 2, 3, 4].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                {/* Coverage Alert */}
                {!isValidCoverage && (
                    <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>Plot coverage exceeds 75%. Consider reducing footprint.</span>
                    </div>
                )}
            </PanelSection>

            {/* 2. Interior Layout */}
            <PanelSection title="Interior Layout" defaultOpen={true}>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Room List</span>
                    <button onClick={addRoom} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
                        <Plus className="w-3 h-3" /> Add Room
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {params.rooms.map((room) => (
                        <div key={room.id} className="bg-slate-950 p-2 rounded border border-slate-800 group hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <input
                                    className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none w-full"
                                    value={room.name}
                                    onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                                />
                                <button onClick={() => removeRoom(room.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={room.type}
                                    onChange={(e) => updateRoom(room.id, { type: e.target.value as any })}
                                    className="col-span-1 bg-slate-900 border border-slate-800 rounded text-[10px] h-6 px-1 text-slate-400"
                                >
                                    <option value="living">Living</option>
                                    <option value="bedroom">Bedroom</option>
                                    <option value="kitchen">Kitchen</option>
                                    <option value="bathroom">Bath</option>
                                    <option value="dining">Dining</option>
                                    <option value="study">Study</option>
                                </select>
                                <div className="col-span-2 flex gap-1 items-center">
                                    <input
                                        type="number"
                                        value={room.width}
                                        onChange={(e) => updateRoom(room.id, { width: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded text-[10px] h-6 px-1 text-center text-slate-300"
                                        placeholder="W"
                                    />
                                    <span className="text-slate-600 text-[10px]">x</span>
                                    <input
                                        type="number"
                                        value={room.depth}
                                        onChange={(e) => updateRoom(room.id, { depth: Number(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded text-[10px] h-6 px-1 text-center text-slate-300"
                                        placeholder="D"
                                    />
                                </div>
                            </div>
                            {/* Validation Warning */}
                            {(room.width < 8 || room.depth < 8) && room.type !== 'bathroom' && (
                                <div className="mt-1 text-[10px] text-amber-500/80 flex items-center gap-1">
                                    <AlertTriangle className="w-2.5 h-2.5" /> Impractical dimensions
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-500">Built-up Area</span>
                    <span className={`text-sm font-bold ${isValidCoverage ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {builtUpArea} <span className="text-[10px] font-normal text-slate-500">sq {params.plot.unit}</span>
                    </span>
                </div>
            </PanelSection>

            {/* 3. Systems & Services */}
            <PanelSection title="Systems & Services" defaultOpen={true}>
                <div className="space-y-2">
                    <div
                        onClick={() => setParams({ smartHome: !params.smartHome })}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${params.smartHome ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${params.smartHome ? 'text-indigo-400' : 'text-slate-600'}`} />
                            <span className={`text-xs font-medium ${params.smartHome ? 'text-indigo-200' : 'text-slate-400'}`}>Smart Home Ready</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${params.smartHome ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${params.smartHome ? 'left-4.5' : 'left-0.5'}`} style={{ left: params.smartHome ? '18px' : '2px' }} />
                        </div>
                    </div>

                    <div
                        onClick={() => setParams({ ventilationPlan: !params.ventilationPlan })}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors border ${params.ventilationPlan ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Wind className={`w-4 h-4 ${params.ventilationPlan ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className={`text-xs font-medium ${params.ventilationPlan ? 'text-emerald-200' : 'text-slate-400'}`}>Ventilation Plan</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${params.ventilationPlan ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${params.ventilationPlan ? 'left-4.5' : 'left-0.5'}`} style={{ left: params.ventilationPlan ? '18px' : '2px' }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {['Economy', 'Standard', 'Premium'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setParams({ materialTier: tier.toLowerCase() as any })}
                                className={`text-[10px] py-1.5 rounded border transition-all ${params.materialTier === tier.toLowerCase()
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>
            </PanelSection>

        </div>
    )
}
