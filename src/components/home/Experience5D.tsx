'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Eye, Sun, Moon, Maximize2, Home as HomeIcon } from 'lucide-react'

type ViewMode = 'default' | 'top' | 'walkthrough' | 'dollhouse'

// Simple 3D House Model
function House({ isDayMode }: { isDayMode: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    // Foundation
    const Foundation = () => (
        <mesh position={[0, -0.2, 0]} receiveShadow>
            <boxGeometry args={[9, 0.4, 7]} />
            <meshStandardMaterial color="#2a2a2a" />
        </mesh>
    )

    // Walls
    const Walls = () => (
        <group>
            {/* Front wall */}
            <mesh position={[0, 1.5, 3.5]} castShadow receiveShadow>
                <boxGeometry args={[8, 3, 0.2]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            {/* Back wall */}
            <mesh position={[0, 1.5, -3.5]} castShadow receiveShadow>
                <boxGeometry args={[8, 3, 0.2]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            {/* Left wall */}
            <mesh position={[-4, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 3, 7]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            {/* Right wall */}
            <mesh position={[4, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 3, 7]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
        </group>
    )

    // Windows
    const Windows = () => (
        <group>
            {/* Front windows */}
            <mesh position={[-2, 1.5, 3.51]} castShadow>
                <boxGeometry args={[1.5, 1.5, 0.1]} />
                <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[2, 1.5, 3.51]} castShadow>
                <boxGeometry args={[1.5, 1.5, 0.1]} />
                <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Side windows */}
            <mesh position={[4.01, 1.5, 1.5]} castShadow>
                <boxGeometry args={[0.1, 1.5, 1.5]} />
                <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[-4.01, 1.5, -1.5]} castShadow>
                <boxGeometry args={[0.1, 1.5, 1.5]} />
                <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    )

    // Door
    const Door = () => (
        <mesh position={[0, 1, 3.51]} castShadow>
            <boxGeometry args={[1.2, 2, 0.1]} />
            <meshStandardMaterial color="#5a3a1a" />
        </mesh>
    )

    // Roof
    const Roof = () => {
        const roofShape = new THREE.Shape()
        roofShape.moveTo(-4.5, 0)
        roofShape.lineTo(4.5, 0)
        roofShape.lineTo(0, 2.5)
        roofShape.lineTo(-4.5, 0)

        return (
            <group position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh castShadow receiveShadow>
                    <extrudeGeometry args={[roofShape, { depth: 7, bevelEnabled: false }]} />
                    <meshStandardMaterial color="#8b4513" />
                </mesh>
            </group>
        )
    }

    // Interior lighting
    const InteriorLights = () => (
        <>
            <pointLight position={[-2, 2, 0]} intensity={isDayMode ? 0.2 : 1.5} color="#ffaa00" castShadow />
            <pointLight position={[2, 2, 0]} intensity={isDayMode ? 0.2 : 1.5} color="#ffaa00" castShadow />
        </>
    )

    return (
        <group ref={groupRef}>
            <Foundation />
            <Walls />
            <Windows />
            <Door />
            <Roof />
            <InteriorLights />
        </group>
    )
}

// Camera controller for smooth transitions
function CameraController({ viewMode, isDayMode }: { viewMode: ViewMode; isDayMode: boolean }) {
    const { camera, controls } = useThree()
    const targetPosition = useRef(new THREE.Vector3())
    const targetLookAt = useRef(new THREE.Vector3())

    useEffect(() => {
        // Define camera positions and targets for each view mode
        const viewConfigs = {
            default: { position: [12, 8, 12], target: [0, 2, 0] },
            top: { position: [0, 20, 0], target: [0, 0, 0] },
            walkthrough: { position: [0, 1.6, 8], target: [0, 1.6, 0] },
            dollhouse: { position: [15, 12, 15], target: [0, 2, 0] }
        }

        const config = viewConfigs[viewMode]
        targetPosition.current.set(...config.position as [number, number, number])
        targetLookAt.current.set(...config.target as [number, number, number])
    }, [viewMode])

    useFrame((state, delta) => {
        // Smooth camera transition
        camera.position.lerp(targetPosition.current, delta * 2)

        if (controls && 'target' in controls) {
            const orbitControls = controls as any
            orbitControls.target.lerp(targetLookAt.current, delta * 2)
            orbitControls.update()
        }
    })

    return null
}

// Main Scene
function Scene({ viewMode, isDayMode }: { viewMode: ViewMode; isDayMode: boolean }) {
    return (
        <>
            {/* Sky */}
            <Sky
                distance={450000}
                sunPosition={isDayMode ? [100, 20, 100] : [100, -20, 100]}
                inclination={isDayMode ? 0.6 : 0.2}
                azimuth={0.25}
            />

            {/* Lighting */}
            <ambientLight intensity={isDayMode ? 0.5 : 0.2} />
            <directionalLight
                position={isDayMode ? [10, 10, 5] : [10, -5, 5]}
                intensity={isDayMode ? 1.5 : 0.3}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                color={isDayMode ? '#ffffff' : '#4a5f8f'}
            />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color={isDayMode ? '#6b8e23' : '#1a3a2a'} />
            </mesh>

            {/* House */}
            <House isDayMode={isDayMode} />

            {/* Camera Controller */}
            <CameraController viewMode={viewMode} isDayMode={isDayMode} />

            {/* Camera */}
            <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={50} />

            {/* Controls */}
            <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={5}
                maxDistance={40}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    )
}

// Main Component
export default function Experience5D() {
    const [viewMode, setViewMode] = useState<ViewMode>('default')
    const [isDayMode, setIsDayMode] = useState(true)
    const [showHints, setShowHints] = useState(true)

    useEffect(() => {
        // Hide hints after 5 seconds
        const timer = setTimeout(() => setShowHints(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative w-full h-full bg-black">
            {/* 3D Canvas */}
            <Canvas shadows className="w-full h-full">
                <Scene viewMode={viewMode} isDayMode={isDayMode} />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Control Hints */}
                <AnimatePresence>
                    {showHints && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center"
                        >
                            <div className="px-4 py-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-white/70 text-sm">
                                Drag to rotate • Scroll to zoom • Right-drag to pan
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Mode Controls */}
                <div className="absolute top-8 right-8 flex flex-col gap-2 pointer-events-auto">
                    {[
                        { mode: 'default' as ViewMode, icon: <Eye className="w-4 h-4" />, label: 'Default' },
                        { mode: 'top' as ViewMode, icon: <Maximize2 className="w-4 h-4" />, label: 'Top View' },
                        { mode: 'walkthrough' as ViewMode, icon: <HomeIcon className="w-4 h-4" />, label: 'Walkthrough' },
                        { mode: 'dollhouse' as ViewMode, icon: <HomeIcon className="w-4 h-4" />, label: 'Dollhouse' }
                    ].map(({ mode, icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-black/60 text-white/70 hover:bg-black/80 hover:text-white'
                                } backdrop-blur-sm border border-white/10`}
                        >
                            {icon}
                            <span className="text-sm font-medium">{label}</span>
                        </button>
                    ))}

                    {/* Day/Night Toggle */}
                    <button
                        onClick={() => setIsDayMode(!isDayMode)}
                        className="flex items-center gap-2 px-4 py-2 bg-black/60 text-white/70 hover:bg-black/80 hover:text-white rounded-lg transition-all backdrop-blur-sm border border-white/10 mt-2"
                    >
                        {isDayMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="text-sm font-medium">{isDayMode ? 'Day' : 'Night'}</span>
                    </button>
                </div>

                {/* CTA Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <Link href="/build">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-base uppercase tracking-wider shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all flex items-center gap-3"
                        >
                            <span>Enter 5D Design Experience</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.div>
                        </motion.button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
