'use client'

import { useState, useEffect } from 'react'
import { Box, Eye, MessageSquare, MapPin, Users, ZoomIn, ChevronRight, Layers, Grid3X3 } from 'lucide-react'

const structuralPins = [
    { id: 'wall-north', label: 'North Wall', type: 'Wall', x: 22, y: 38, color: 'blue', commentId: 1, commentUser: 'Arjun Verma', commentText: 'Pillars need to shift 200mm' },
    { id: 'beam-main', label: 'Main Beam B1', type: 'Beam', x: 52, y: 28, color: 'amber', commentId: 4, commentUser: 'System AI', commentText: 'Load stress exceeds 85% threshold' },
    { id: 'pillar-a', label: 'Pillar A3', type: 'Pillar', x: 35, y: 55, color: 'purple', commentId: null, commentUser: null, commentText: null },
    { id: 'room-living', label: 'Living Room', type: 'Room', x: 62, y: 60, color: 'emerald', commentId: 2, commentUser: 'Sarah Lee', commentText: 'Changed fixtures to warm LED' },
    { id: 'service-hvac', label: 'HVAC Line S2', type: 'Service Line', x: 78, y: 42, color: 'red', commentId: 3, commentUser: 'ConstructCo', commentText: 'Duct routing conflicts with beam' },
    { id: 'pillar-b', label: 'Pillar B1', type: 'Pillar', x: 44, y: 70, color: 'purple', commentId: null, commentUser: null, commentText: null },
    { id: 'wall-south', label: 'South Wall', type: 'Wall', x: 68, y: 78, color: 'blue', commentId: null, commentUser: null, commentText: null },
]

const collaborators = [
    { id: 1, name: 'Arjun Verma', initials: 'AV', color: 'bg-blue-500', x: 45, y: 35, viewing: 'Main Beam B1' },
    { id: 2, name: 'Sarah Lee', initials: 'SL', color: 'bg-purple-500', x: 65, y: 58, viewing: 'Living Room' },
    { id: 3, name: 'ConstructCo', initials: 'CC', color: 'bg-emerald-500', x: 30, y: 65, viewing: 'Pillar A3' },
]

const pinColors: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-500/20 text-blue-400',
    amber: 'border-amber-500 bg-amber-500/20 text-amber-400',
    purple: 'border-purple-500 bg-purple-500/20 text-purple-400',
    emerald: 'border-emerald-500 bg-emerald-500/20 text-emerald-400',
    red: 'border-red-500 bg-red-500/20 text-red-400',
}

interface ModelViewerPanelProps {
    focusedCommentId?: number | null
}

export function ModelViewerPanel({ focusedCommentId }: ModelViewerPanelProps) {
    const [selectedPin, setSelectedPin] = useState<string | null>(null)
    const [activeView, setActiveView] = useState<'3d' | 'floor'>('3d')
    const [focusedPin, setFocusedPin] = useState<string | null>(null)
    const [cursorTick, setCursorTick] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setCursorTick(p => p + 1), 2000)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        if (focusedCommentId) {
            const pin = structuralPins.find(p => p.commentId === focusedCommentId)
            if (pin) {
                setFocusedPin(pin.id)
                setSelectedPin(pin.id)
                setTimeout(() => setFocusedPin(null), 2000)
            }
        }
    }, [focusedCommentId])

    const cursorOffsets = [
        { x: 0, y: 0 }, { x: 3, y: -2 }, { x: -2, y: 3 }, { x: 2, y: 2 }, { x: -3, y: -1 }
    ]

    return (
        <div className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                        <Box className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-white">3D Model</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setActiveView('3d')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeView === '3d' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Layers className="w-3.5 h-3.5 inline mr-1" />3D
                    </button>
                    <button
                        onClick={() => setActiveView('floor')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeView === 'floor' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Grid3X3 className="w-3.5 h-3.5 inline mr-1" />Floor
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{collaborators.length} live</span>
                    </div>
                </div>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 overflow-hidden bg-[#050507]" style={{ minHeight: 280 }}>
                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(100,150,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,150,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Building SVG Representation */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    {/* Foundation */}
                    <rect x="15" y="72" width="70" height="4" rx="1" fill="rgba(100,150,255,0.08)" stroke="rgba(100,150,255,0.2)" strokeWidth="0.3" />
                    {/* Main walls */}
                    <rect x="15" y="30" width="70" height="43" rx="1" fill="rgba(100,150,255,0.04)" stroke="rgba(100,150,255,0.15)" strokeWidth="0.4" />
                    {/* Roof */}
                    <polygon points="10,30 50,10 90,30" fill="rgba(100,150,255,0.06)" stroke="rgba(100,150,255,0.25)" strokeWidth="0.4" />
                    {/* Interior walls */}
                    <line x1="50" y1="30" x2="50" y2="72" stroke="rgba(100,150,255,0.12)" strokeWidth="0.3" strokeDasharray="2,1" />
                    <line x1="15" y1="52" x2="85" y2="52" stroke="rgba(100,150,255,0.12)" strokeWidth="0.3" strokeDasharray="2,1" />
                    {/* Windows */}
                    <rect x="20" y="35" width="10" height="8" rx="0.5" fill="rgba(147,197,253,0.1)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.3" />
                    <rect x="70" y="35" width="10" height="8" rx="0.5" fill="rgba(147,197,253,0.1)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.3" />
                    <rect x="55" y="35" width="10" height="8" rx="0.5" fill="rgba(147,197,253,0.1)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.3" />
                    {/* Door */}
                    <rect x="43" y="60" width="14" height="12" rx="0.5" fill="rgba(100,150,255,0.06)" stroke="rgba(100,150,255,0.2)" strokeWidth="0.3" />
                    {/* Beams */}
                    <line x1="15" y1="52" x2="85" y2="52" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
                    <line x1="50" y1="30" x2="50" y2="52" stroke="rgba(251,191,36,0.2)" strokeWidth="0.6" />
                    {/* Dimension lines */}
                    <line x1="5" y1="30" x2="5" y2="72" stroke="rgba(100,150,255,0.1)" strokeWidth="0.2" />
                    <line x1="3" y1="30" x2="7" y2="30" stroke="rgba(100,150,255,0.1)" strokeWidth="0.2" />
                    <line x1="3" y1="72" x2="7" y2="72" stroke="rgba(100,150,255,0.1)" strokeWidth="0.2" />
                </svg>

                {/* Live Collaborator Cursors */}
                {collaborators.map((collab, i) => {
                    const offset = cursorOffsets[cursorTick % cursorOffsets.length]
                    return (
                        <div
                            key={collab.id}
                            className="absolute pointer-events-none transition-all duration-1000"
                            style={{
                                left: `${collab.x + (i === 0 ? offset.x : i === 1 ? -offset.y : offset.y)}%`,
                                top: `${collab.y + (i === 0 ? offset.y : i === 1 ? offset.x : -offset.x)}%`,
                            }}
                        >
                            <div className="relative">
                                <svg width="12" height="16" viewBox="0 0 12 16" className="drop-shadow-lg">
                                    <path d="M0 0 L0 12 L4 9 L6 16 L8 15 L6 8 L10 8 Z" fill={collab.color.replace('bg-', '').includes('blue') ? '#3b82f6' : collab.color.includes('purple') ? '#a855f7' : '#10b981'} />
                                </svg>
                                <div className={`absolute -top-6 left-3 ${collab.color} text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shadow-lg`}>
                                    {collab.name.split(' ')[0]}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Structural Element Pins */}
                {structuralPins.map(pin => (
                    <button
                        key={pin.id}
                        onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group ${focusedPin === pin.id ? 'scale-150' : 'hover:scale-125'}`}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${pinColors[pin.color]} shadow-lg ${focusedPin === pin.id ? 'animate-pulse' : ''}`}>
                            <MapPin className="w-2.5 h-2.5" />
                        </div>
                        {pin.commentId && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white/90 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-2 h-2 text-slate-800" />
                            </div>
                        )}
                        {/* Tooltip */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-white/10 rounded-xl px-3 py-2 min-w-max opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-20">
                            <div className="text-xs font-bold text-white mb-0.5">{pin.label}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{pin.type}</div>
                            {pin.commentText && <div className="text-[10px] text-slate-400 mt-1 max-w-32 leading-tight">{pin.commentText}</div>}
                        </div>
                    </button>
                ))}

                {/* Selected Pin Detail */}
                {selectedPin && (() => {
                    const pin = structuralPins.find(p => p.id === selectedPin)
                    if (!pin) return null
                    return (
                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 z-20">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${pinColors[pin.color]}`}>{pin.type}</div>
                                    <span className="text-sm font-bold text-white">{pin.label}</span>
                                </div>
                                <button onClick={() => setSelectedPin(null)} className="text-slate-500 hover:text-white transition-colors text-xs">✕</button>
                            </div>
                            {pin.commentText && (
                                <div className="flex items-start gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-white">{pin.commentUser?.split(' ').map(n => n[0]).join('')}</div>
                                    <p className="text-xs text-slate-400">{pin.commentText}</p>
                                </div>
                            )}
                        </div>
                    )
                })()}

                {/* Zoom Focus animation overlay */}
                {focusedPin && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg animate-pulse" />
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <ZoomIn className="w-3 h-3" />
                            Navigating to location...
                        </div>
                    </div>
                )}

                {/* View indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg px-2 py-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">{activeView === '3d' ? 'Perspective' : 'Floor Plan'}</span>
                </div>
            </div>

            {/* Live Presence Bar */}
            <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.01] flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Viewing</span>
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    {collaborators.map(c => (
                        <div key={c.id} className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-2 py-0.5">
                            <div className={`w-2 h-2 rounded-full ${c.color}`} />
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{c.name.split(' ')[0]}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">{c.viewing}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
