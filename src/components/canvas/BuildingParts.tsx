import React, { useMemo } from 'react'
import * as THREE from 'three'
import { BuildingParams } from '@/store/buildingStore'

// --- PBR Materials (Phase 4) ---
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#a8c7fa',
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: 0.4,
    transmission: 0.6,
    thickness: 0.1
})

const frameMaterial = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.3 })
const slabMaterial = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.8 })

// --- Components ---

export const FloorSlab = ({ width, depth, yPos }: { width: number, depth: number, yPos: number }) => {
    return (
        <mesh position={[0, yPos, 0]} receiveShadow material={slabMaterial}>
            <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
        </mesh>
    )
}

export const WindowRow = ({ count, wallWidth, style, zOffset, yPos, floors, viewMode = 'exterior' }: { count: number, wallWidth: number, style: BuildingParams['windowStyle'], zOffset: number, yPos: number, floors: number, viewMode?: 'exterior' | 'interior' }) => {
    const windows = []
    const spacing = wallWidth / (count + 1)

    const isInterior = viewMode === 'interior'
    const opacity = isInterior ? 0.2 : 1.0

    // Window Dimension Logic
    const w = style === 'floor-to-ceiling' ? 1.4 : 1.2
    const h = style === 'floor-to-ceiling' ? 2.4 : 1.5

    for (let i = 1; i <= count; i++) {
        windows.push(
            <group key={i} position={[(i * spacing) - (wallWidth / 2), 0, zOffset]}>
                {/* Frame */}
                <mesh>
                    <boxGeometry args={[w + 0.1, h + 0.1, 0.15]} />
                    <meshStandardMaterial color="#1e293b" transparent={isInterior} opacity={isInterior ? 0.2 : 1.0} />
                </mesh>
                {/* Glass */}
                <mesh>
                    <boxGeometry args={[w, h, 0.05]} />
                    <meshPhysicalMaterial
                        color="#a8c7fa"
                        transparent={true}
                        opacity={isInterior ? 0.1 : 0.4}
                        transmission={isInterior ? 0.9 : 0.6}
                        thickness={0.1}
                    />
                </mesh>
                {/* Sill (if standard) */}
                {style === 'standard' && (
                    <mesh position={[0, -h / 2 - 0.05, 0.08]}>
                        <boxGeometry args={[w + 0.2, 0.1, 0.2]} />
                        <meshStandardMaterial color="#1e293b" transparent={isInterior} opacity={opacity} />
                    </mesh>
                )}
            </group>
        )
    }
    return <group position={[0, yPos, 0]}>{windows}</group>
}

export const Door = ({ style, zOffset, viewMode = 'exterior' }: { style: BuildingParams['doorStyle'], zOffset: number, viewMode?: 'exterior' | 'interior' }) => {
    // Determine door look 
    const isClassic = style === 'classic'
    const isInterior = viewMode === 'interior'
    const color = isClassic ? '#78350f' : '#1e293b'

    return (
        <group position={[0, 1.2, zOffset]}>
            {/* Frame */}
            <mesh>
                <boxGeometry args={[isClassic ? 1.6 : 2.0, 2.4, 0.2]} />
                <meshStandardMaterial color="#1e293b" transparent={isInterior} opacity={isInterior ? 0.2 : 1.0} />
            </mesh>
            {/* Door Slab */}
            <mesh>
                <boxGeometry args={[isClassic ? 1.4 : 1.8, 2.3, 0.1]} />
                <meshStandardMaterial color={color} roughness={0.4} transparent={isInterior} opacity={isInterior ? 0.2 : 1.0} />
            </mesh>
            {/* Handle */}
            <mesh position={[-0.6, 0, 0.1]}>
                <sphereGeometry args={[0.06]} />
                <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} transparent={isInterior} opacity={isInterior ? 0.2 : 1.0} />
            </mesh>
        </group>
    )
}

export const Roof = ({ type, width, depth, height, color, overhang }: { type: string, width: number, depth: number, height: number, color: string, overhang: number }) => {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
    const w = width + overhang * 2
    const d = depth + overhang * 2

    // Flat roof with Parapet
    if (type === 'flat') {
        return (
            <group position={[0, height, 0]}>
                {/* Main Slab */}
                <mesh material={mat} receiveShadow>
                    <boxGeometry args={[w, 0.4, d]} />
                </mesh>
                {/* Parapet Walls */}
                <group position={[0, 0.4, 0]}>
                    <mesh position={[0, 0, -depth / 2]} material={mat}><boxGeometry args={[width, 0.6, 0.25]} /></mesh>
                    <mesh position={[0, 0, depth / 2]} material={mat}><boxGeometry args={[width, 0.6, 0.25]} /></mesh>
                    <mesh position={[-width / 2, 0, 0]} material={mat}><boxGeometry args={[0.25, 0.6, depth]} /></mesh>
                    <mesh position={[width / 2, 0, 0]} material={mat}><boxGeometry args={[0.25, 0.6, depth]} /></mesh>
                </group>
            </group>
        )
    }

    // Gable Roof
    if (type === 'gable') {
        const roofHeight = Math.min(width, depth) * 0.5
        // Using a 4-sided pyramid cone rotated 45deg to simulate a hip/pyramid roof for simplicity in this MVP
        return (
            <group position={[0, height + roofHeight / 2, 0]}>
                <mesh rotation={[0, Math.PI / 4, 0]} material={mat}>
                    <coneGeometry args={[Math.max(w, d) * 0.8, roofHeight, 4]} />
                </mesh>
            </group>
        )
    }

    // Default Fallback (Hip-like)
    const roofHeight = 2.5
    return (
        <group position={[0, height + roofHeight / 2, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} material={mat}>
                <coneGeometry args={[Math.max(w, d) * 0.75, roofHeight, 4]} />
            </mesh>
        </group>
    )
}
