'use client'

import React, { useMemo } from 'react'
import * as THREE from 'three'
import { generateInteriorLayout, FurnitureItem } from '@/lib/interiorGenerator'
import { useBuildingStore } from '@/store/buildingStore'

const Sofa = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]}>
        {/* Seat */}
        <mesh material={new THREE.MeshStandardMaterial({ color: '#475569' })}>
            <boxGeometry args={[item.width, item.height * 0.5, item.depth]} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, item.height * 0.4, -item.depth / 2 + 0.1]} material={new THREE.MeshStandardMaterial({ color: '#334155' })}>
            <boxGeometry args={[item.width, item.height * 0.6, 0.2]} />
        </mesh>
    </group>
)

const Bed = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]}>
        {/* Mattress */}
        <mesh material={new THREE.MeshStandardMaterial({ color: '#f1f5f9' })}>
            <boxGeometry args={[item.width, item.height * 0.7, item.depth]} />
        </mesh>
        {/* Headboard */}
        <mesh position={[0, item.height * 0.5, -item.depth / 2 + 0.1]} material={new THREE.MeshStandardMaterial({ color: '#94a3b8' })}>
            <boxGeometry args={[item.width, item.height, 0.1]} />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, item.height * 0.4, -item.depth / 2 + 0.4]} material={new THREE.MeshStandardMaterial({ color: '#ffffff' })}>
            <boxGeometry args={[item.width * 0.8, 0.15, 0.4]} />
        </mesh>
    </group>
)

const Table = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#78350f' })}>
            <boxGeometry args={[item.width, 0.05, item.depth]} />
        </mesh>
        {/* Legs - Simplified */}
        <mesh position={[0, -item.height / 2, 0]} material={new THREE.MeshStandardMaterial({ color: '#451a03' })}>
            <cylinderGeometry args={[0.05, 0.05, item.height]} />
        </mesh>
    </group>
)

const KitchenUnit = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#cbd5e1' })}>
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, item.height / 2 + 0.02, 0]} material={new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2 })}>
            <boxGeometry args={[item.width + 0.05, 0.04, item.depth + 0.05]} />
        </mesh>
    </group>
)

const Wardrobe = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#94a3b8' })}>
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
        {/* Doors */}
        <mesh position={[0, 0, item.depth / 2 + 0.01]} material={new THREE.MeshStandardMaterial({ color: '#cbd5e1' })}>
            <planeGeometry args={[item.width - 0.1, item.height - 0.1]} />
        </mesh>
    </group>
)

const TVUnit = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#334155' })}>
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, item.height / 2 + 0.4, 0]} material={new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.1, metalness: 0.8 })}>
            <boxGeometry args={[item.width * 0.1, 0.8, item.depth * 0.8]} />
        </mesh>
    </group>
)

const Rug = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + 0.01, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#d4d4d8', map: null, roughness: 1 })}>
            <boxGeometry args={[item.width, 0.02, item.depth]} />
        </mesh>
    </group>
)

const Shower = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        {/* Glass Box */}
        <mesh material={new THREE.MeshPhysicalMaterial({ color: '#aecbfa', transmission: 0.9, opacity: 0.5, transparent: true, roughness: 0 })} >
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
    </group>
)

const Toilet = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#ffffff' })}>
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
    </group>
)

const Vanity = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#ffffff' })}>
            <boxGeometry args={[item.width, item.height, item.depth]} />
        </mesh>
        <mesh position={[0, item.height / 2 + 0.3, -item.depth / 2 + 0.05]} material={new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.9, roughness: 0.1 })}>
            <boxGeometry args={[item.width, 0.6, 0.05]} />
        </mesh>
    </group>
)

const Chair = ({ item }: { item: FurnitureItem }) => (
    <group position={[item.x, item.y + item.height / 2, item.z]} rotation={[0, item.rotation, 0]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#475569' })}>
            <boxGeometry args={[item.width, 0.05, item.depth]} />
        </mesh>
        <mesh position={[0, 0.2, -item.depth / 2 + 0.05]} material={new THREE.MeshStandardMaterial({ color: '#475569' })}>
            <boxGeometry args={[item.width, 0.45, 0.05]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={new THREE.MeshStandardMaterial({ color: '#334155' })}>
            <cylinderGeometry args={[0.03, 0.03, 0.45]} />
        </mesh>
    </group>
)

const RoomZone = ({ room }: { room: any }) => {
    const colorMap: Record<string, string> = {
        'living': '#60a5fa', // Blue
        'kitchen': '#fbbf24', // Amber
        'bedroom': '#c084fc', // Purple
        'bathroom': '#94a3b8', // Gray
        'study': '#4ade80', // Green
    }
    const color = colorMap[room.type] || '#94a3b8'

    const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.8 }), [])
    const WALL_H = 2.8
    const THICK = 0.1

    return (
        <group position={[room.x, room.y + 0.05, room.z]}>
            {/* Floor overlay */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[room.width, room.depth]} />
                <meshBasicMaterial color={color} transparent opacity={0.10} side={THREE.DoubleSide} />
            </mesh>

            {/* Border Lines */}
            <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(room.width, room.depth)]} />
                <lineBasicMaterial color={color} transparent opacity={0.6} />
            </lineSegments>

            {/* --- Walls --- */}
            {/* Back Wall (-Z) */}
            <mesh position={[0, WALL_H / 2, -room.depth / 2]} receiveShadow material={wallMat}>
                <boxGeometry args={[room.width, WALL_H, THICK]} />
            </mesh>

            {/* Front Wall (+Z) - With Doorway Gap */}
            <group position={[0, WALL_H / 2, room.depth / 2]}>
                {/* Left Segment */}
                <mesh position={[-(room.width / 2 - (room.width / 2 - 0.5) / 2), 0, 0]} material={wallMat}>
                    <boxGeometry args={[room.width / 2 - 0.5, WALL_H, THICK]} />
                </mesh>
                {/* Right Segment */}
                <mesh position={[(room.width / 2 - (room.width / 2 - 0.5) / 2), 0, 0]} material={wallMat}>
                    <boxGeometry args={[room.width / 2 - 0.5, WALL_H, THICK]} />
                </mesh>
                {/* Header above door */}
                <mesh position={[0, WALL_H / 2 - 0.2, 0]} material={wallMat}>
                    <boxGeometry args={[1, 0.4, THICK]} />
                </mesh>
            </group>

            {/* Left Wall (-X) */}
            <mesh position={[-room.width / 2, WALL_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={wallMat}>
                <boxGeometry args={[room.depth, WALL_H, THICK]} />
            </mesh>

            {/* Right Wall (+X) */}
            <mesh position={[room.width / 2, WALL_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={wallMat}>
                <boxGeometry args={[room.depth, WALL_H, THICK]} />
            </mesh>
        </group>
    )
}

export function InteriorRenderer() {
    const {
        params,
        activeFloor,
        setHoveredElement,
        setSelectedElement
    } = useBuildingStore()

    // Generate layout only when params change
    const layout = useMemo(() => generateInteriorLayout(params), [params])

    const handlePointerOver = (e: any, name: string) => {
        e.stopPropagation()
        setHoveredElement(name)
        document.body.style.cursor = 'pointer'
    }

    const handlePointerOut = (e: any) => {
        setHoveredElement(null)
        document.body.style.cursor = 'auto'
    }

    const handleClick = (e: any, name: string) => {
        e.stopPropagation()
        setSelectedElement(name)
    }

    return (
        <group>
            {/* Zones Overlay */}
            {true && layout.rooms && layout.rooms.map((room, idx) => {
                // Filter by floor
                if (activeFloor !== null && activeFloor !== room.floor + 1) return null

                // Add logic: room.y should be derived from floor or provided. 
                // Mocking Y based on floor since generator might not provide it fully for zones yet
                const floorHeight = 3.2
                const roomWithY = { ...room, y: room.floor * floorHeight }

                return <RoomZone key={`room-${idx}`} room={roomWithY} />
            })}

            {layout.furniture.map((item, idx) => {
                // Filter by floor if active
                // Assuming item.y is absolute height relative to foundation
                const floorHeight = 3.2
                const floorNum = Math.floor(item.y / floorHeight) + 1

                if (activeFloor !== null && activeFloor !== floorNum) return null

                const interactProps = {
                    onClick: (e: any) => handleClick(e, `${item.type} (${idx})`),
                    onPointerOver: (e: any) => handlePointerOver(e, `${item.type} (${idx})`),
                    onPointerOut: handlePointerOut
                }

                const furnitureProps = { item }

                return (
                    <group key={idx} {...interactProps}>
                        {item.type === 'sofa' && <Sofa {...furnitureProps} />}
                        {item.type === 'bed' && <Bed {...furnitureProps} />}
                        {item.type === 'table' && <Table {...furnitureProps} />}
                        {item.type === 'kitchen_unit' && <KitchenUnit {...furnitureProps} />}
                        {item.type === 'wardrobe' && <Wardrobe {...furnitureProps} />}
                        {item.type === 'tv_unit' && <TVUnit {...furnitureProps} />}
                        {item.type === 'rug' && <Rug {...furnitureProps} />}
                        {item.type === 'shower' && <Shower {...furnitureProps} />}
                        {item.type === 'toilet' && <Toilet {...furnitureProps} />}
                        {item.type === 'vanity' && <Vanity {...furnitureProps} />}
                        {item.type === 'chair' && <Chair {...furnitureProps} />}
                    </group>
                )
            })}
        </group>
    )
}
