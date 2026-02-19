'use client'

import { useState, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft,
    Box,
    Layers,
    Maximize2,
    Settings2,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Scale,
    Save,
    Sparkles,
    Trash2,
    Plus,
    Move,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useBuildingStore, Room as StoreRoom } from '@/store/buildingStore'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, ContactShadows, Environment, Html } from '@react-three/drei'
import { BuildingRenderer } from '@/components/canvas/BuildingRenderer'

export default function Plan3DPreviewPage() {
    const [wallHeight, setWallHeight] = useState(3000) // in mm
    const [wallThickness, setWallThickness] = useState(230) // in mm
    const [isCalibrated, setIsCalibrated] = useState(true)
    const [isCalibrating, setIsCalibrating] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
    const [isEditingRoom, setIsEditingRoom] = useState(false)
    const [tempRoomType, setTempRoomType] = useState('')
    const [rooms, setRooms] = useState([
        { id: '1', name: 'Master Bedroom', type: 'Bedroom', area: 240, confidence: 98 },
        { id: '2', name: 'Kitchen', type: 'Kitchen', area: 120, confidence: 95 },
        { id: '3', name: 'Living Room', type: 'Hall', area: 350, confidence: 92 },
        { id: '4', name: 'Guest Room', type: 'Bedroom', area: 180, confidence: 88 },
        { id: '5', name: 'Dining Area', type: 'Hall', area: 150, confidence: 94 },
        { id: '6', name: 'Toilet 1', type: 'Bathroom', area: 45, confidence: 85 },
    ])
    const { setParams, saveProject, setViewMode, setActiveFloor } = useBuildingStore()
    const router = useRouter()

    // Sync local state to store for live preview visualization
    useEffect(() => {
        // Initial setup for preview
        setViewMode('interior')
        setActiveFloor(1)

        // Sync detected rooms and height
        const typeMap: Record<string, any> = {
            'Bedroom': 'bedroom',
            'Kitchen': 'kitchen',
            'Hall': 'living',
            'Bathroom': 'bathroom',
            'Dining Area': 'dining',
            'Other': 'other'
        }

        const storeRooms: StoreRoom[] = rooms.map(r => {
            const side = Math.sqrt(r.area)
            return {
                id: r.id,
                name: r.name,
                type: typeMap[r.type] || 'other',
                floor: 1,
                width: Math.round(side * 1.2),
                depth: Math.round(side / 1.2),
                x: 0,
                z: 0
            }
        })

        setParams({
            rooms: storeRooms,
            height: wallHeight / 1000,
            width: 15,
            depth: 12
        })
    }, [rooms, wallHeight, setParams, setViewMode, setActiveFloor])
    const handleRoomTypeChange = (roomId: string, newType: string) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, type: newType, confidence: 100 } : r))
        setIsEditingRoom(false)
    }

    const handleApprove = () => {
        // Map types to store-compatible types
        const typeMap: Record<string, any> = {
            'Bedroom': 'bedroom',
            'Kitchen': 'kitchen',
            'Hall': 'living',
            'Bathroom': 'bathroom',
            'Dining Area': 'dining',
            'Other': 'other'
        }

        // Map internal room to store room
        const storeRooms: StoreRoom[] = rooms.map(r => {
            const side = Math.sqrt(r.area)
            return {
                id: r.id,
                name: r.name,
                type: typeMap[r.type] || 'other',
                floor: 1,
                width: Math.round(side * 1.2), // Rough aspect ratio
                depth: Math.round(side / 1.2)
            }
        })

        // Update technical params for the generator
        setParams({
            rooms: storeRooms,
            height: wallHeight / 1000,
            width: 15, // Derived from floor plan area roughly
            depth: 12,
            facadeMaterial: 'concrete',
            roofType: 'flat'
        })

        // Save project with a specific name
        const timestamp = new Date().toLocaleDateString()
        saveProject(`Plan-Gen-${timestamp}`)

        // Redirect to build workspace where the 3D model will be rendered
        router.push('/build')
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col overflow-hidden text-white">
            {/* Top Navigation Bar - Fixed and Unified */}
            <header className="h-16 shrink-0 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between z-[101]">
                <Link href="/projects" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    <span className="text-sm font-medium">Back to Projects</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400">94% AI Confidence</span>
                    </div>
                    <Button
                        onClick={handleApprove}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 px-6 h-10"
                    >
                        Approve & Create Project
                    </Button>
                </div>
            </header>

            {/* Main Workspace - 3 Column Layout (Strictly below Navbar) */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Left Panel: Elements & Rooms */}
                <aside className="w-80 border-r border-white/5 bg-[#050505] p-6 overflow-y-auto hidden lg:block custom-scrollbar relative z-10">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Detected Rooms</h3>
                        <div className="space-y-2">
                            {rooms.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room.id)}
                                    className={`w-full p-3 rounded-xl border transition-all text-left ${selectedRoom === room.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-bold ${selectedRoom === room.id ? 'text-blue-400' : 'text-white'}`}>{room.name}</span>
                                        <span className="text-[10px] text-slate-500">{room.area} sq.ft</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 uppercase font-medium">{room.type}</span>
                                        <div className="flex items-center gap-1">
                                            {room.confidence === 100 ? (
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
                                                    <span className="text-[10px] text-blue-400 italic">User Verified</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-[10px] text-emerald-500">{room.confidence}%</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {selectedRoom === room.id && (
                                        <div className="mt-3 pt-3 border-t border-blue-500/20 flex flex-wrap gap-1.5">
                                            {['Bedroom', 'Kitchen', 'Hall', 'Bathroom', 'Balcony'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRoomTypeChange(room.id, type)
                                                    }}
                                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${room.type === type ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Structural Elements</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <p className="text-xl font-bold text-white">24</p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium">Walls</p>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <p className="text-xl font-bold text-white">8</p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium">Windows</p>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <p className="text-xl font-bold text-white">5</p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium">Doors</p>
                            </div>
                            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                <p className="text-xl font-bold text-white">1</p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium">Stairs</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center: 3D Model Viewer (Three.js) */}
                <section className="flex-1 relative bg-[#080808] overflow-hidden">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    }>
                        <Canvas
                            shadows
                            camera={{ position: [15, 12, 15], fov: 40 }}
                            className="w-full h-full"
                        >
                            <ambientLight intensity={0.6} />
                            <directionalLight
                                position={[10, 20, 10]}
                                intensity={1.2}
                                castShadow
                                shadow-mapSize={[1024, 1024]}
                            />

                            <group position={[0, 0, 0]}>
                                <BuildingRenderer />

                                {/* AI Detection Labels as HTML markers */}
                                {rooms.map((room, idx) => (
                                    <Html
                                        key={room.id}
                                        position={[
                                            (idx % 2 === 0 ? -3 : 3) * (idx + 1) * 0.5,
                                            3.5,
                                            (idx % 3 === 0 ? -3 : 3) * (idx + 1) * 0.5
                                        ]}
                                        center
                                        distanceFactor={15}
                                    >
                                        <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg whitespace-nowrap pointer-events-none">
                                            <p className="text-[10px] font-bold text-white leading-tight">{room.name}</p>
                                            <p className="text-[8px] text-blue-400 uppercase font-bold tracking-tighter">Detected</p>
                                        </div>
                                    </Html>
                                ))}
                            </group>

                            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />
                            <Grid
                                position={[0, -0.01, 0]}
                                args={[100, 100]}
                                cellColor="#333"
                                sectionColor="#444"
                                fadeDistance={50}
                                infiniteGrid
                            />

                            <OrbitControls
                                makeDefault
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 2.2}
                                enableDamping
                                dampingFactor={0.05}
                            />
                            <Environment preset="night" />
                        </Canvas>
                    </Suspense>

                    {/* Perspective Controls Overlay */}
                    <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
                        <button className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white" title="Reset View">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white" title="Move Tool">
                            <Move className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scale Calibration UI */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 min-w-[400px] z-10">
                        <div className="flex items-center gap-3">
                            <Scale className={`w-5 h-5 ${isCalibrating ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`} />
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{isCalibrating ? 'Selecting Reference' : 'Calibration'}</p>
                                <p className="text-xs text-white">100px = {isCalibrating ? 'Select two points...' : '2.5m (Auto-calibrated)'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCalibrating(!isCalibrating)}
                            className={`text-xs font-bold transition-colors ${isCalibrating ? 'text-amber-400 hover:text-amber-300' : 'text-blue-400 hover:text-blue-300'}`}
                        >
                            {isCalibrating ? 'Cancel' : 'Recalibrate'}
                        </button>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Scale Confirmed</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Adjustments & Settings */}
                <aside className="w-80 border-l border-white/5 bg-[#050505] p-6 overflow-y-auto hidden xl:block custom-scrollbar z-10">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" />
                            Global Adjustments
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-300">Wall Height</label>
                                    <span className="text-xs font-bold text-blue-400">{wallHeight}mm</span>
                                </div>
                                <input
                                    type="range"
                                    min="2400"
                                    max="4500"
                                    step="100"
                                    value={wallHeight}
                                    onChange={(e) => setWallHeight(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-600">
                                    <span>2.4m</span>
                                    <span>4.5m</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-300">Exterior Wall Thickness</label>
                                    <span className="text-xs font-bold text-blue-400">{wallThickness}mm</span>
                                </div>
                                <input
                                    type="range"
                                    min="150"
                                    max="450"
                                    step="10"
                                    value={wallThickness}
                                    onChange={(e) => setWallThickness(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-600">
                                    <span>150mm</span>
                                    <span>450mm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 pt-8 border-t border-white/5">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Material Estimator (AI Preview)</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Total Concrete</span>
                                <span className="text-xs font-bold text-white">42.5 m³</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Bricks Required</span>
                                <span className="text-xs font-bold text-white">12,400 units</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Estimated Base Cost</span>
                                <span className="text-xs font-bold text-emerald-400">₹18.4L</span>
                            </div>
                        </div>
                        <p className="mt-4 text-[10px] text-slate-600 leading-relaxed italic">
                            *Estimates based on current regional standard material costs.
                        </p>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <Button variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5 gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Reset AI Generation
                        </Button>
                    </div>
                </aside>
            </main>

            {/* Mobile/Small Screen Overlays or Warnings */}
            <AnimatePresence>
                <div className="lg:hidden fixed bottom-6 inset-x-6 z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 backdrop-blur-md"
                    >
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-200">
                            The 3D inspector is optimized for larger screens. Some editing features may be limited on mobile.
                        </p>
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    )
}
