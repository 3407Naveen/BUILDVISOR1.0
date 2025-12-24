'use client'

import { useBuildingStore } from '@/store/buildingStore'
import * as THREE from 'three'
import { WindowRow, Door, Roof, FloorSlab } from './BuildingParts'
import { InteriorRenderer } from './InteriorRenderer'

export function BuildingRenderer() {
    const {
        params,
        viewMode,
        activeFloor,
        hoveredElement,
        setHoveredElement,
        setSelectedElement
    } = useBuildingStore()

    // Wall Material
    const wallMat = new THREE.MeshStandardMaterial({
        color: params.wallColor,
        roughness: params.facadeMaterial === 'concrete' ? 0.9 : 0.6,
        transparent: viewMode === 'interior',
        opacity: viewMode === 'interior' ? 0.15 : 1.0,
        side: THREE.DoubleSide // Changed to DoubleSide to see back walls when transparent
    })

    // Environment Colors
    const groundColor = params.envType === 'grass' ? '#365314' : (params.envType === 'forest' ? '#14532d' : '#94a3b8')

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

    // Helper to render floors for a specific mass dimensions
    const renderFloors = (width: number, depth: number, xOffset: number, zOffset: number) => {
        const elements = []
        const FLOOR_HEIGHT = 3.2

        for (let i = 0; i < params.floorCount; i++) {
            const floorNum = i + 1
            const isVisible = activeFloor === null || activeFloor === floorNum

            if (!isVisible) continue

            const yBase = params.foundationHeight + (i * FLOOR_HEIGHT)
            const isGround = i === 0

            const floorName = `Floor ${floorNum}`

            // Floor Slab - Always visible
            if (i > 0) {
                elements.push(
                    <group
                        key={`slab-${i}`}
                        position={[xOffset, yBase, zOffset]}
                        onClick={(e) => handleClick(e, `${floorName} Slab`)}
                        onPointerOver={(e) => handlePointerOver(e, `${floorName} Slab`)}
                        onPointerOut={handlePointerOut}
                    >
                        <FloorSlab width={width} depth={depth} yPos={0} />
                    </group>
                )
            }

            // Windows (Front)
            elements.push(
                <group key={`win-f-${i}`} position={[xOffset, 0, zOffset]}>
                    <WindowRow
                        count={isGround ? Math.max(1, Math.floor(params.windowCount / 2)) : params.windowCount}
                        wallWidth={width}
                        style={params.windowStyle}
                        zOffset={depth / 2 + 0.05}
                        yPos={yBase + 1.5}
                        floors={1}
                        viewMode={viewMode}
                    />
                </group>
            )

            // Windows (Back)
            elements.push(
                <group key={`win-b-${i}`} position={[xOffset, 0, zOffset]}>
                    <WindowRow
                        count={params.windowCount}
                        wallWidth={width}
                        style={params.windowStyle}
                        zOffset={-depth / 2 - 0.05}
                        yPos={yBase + 1.5}
                        floors={1}
                        viewMode={viewMode}
                    />
                </group>
            )
        }
        return elements
    }

    const showRoof = viewMode === 'exterior' && (activeFloor === null || activeFloor === params.floorCount)

    return (
        <group>
            {/* --- MAIN MASS --- */}
            <group position={[0, 0, 0]}>
                {/* Core Mass - Walls */}
                <mesh
                    position={[0, params.height / 2 + params.foundationHeight, 0]}
                    castShadow
                    receiveShadow
                    material={wallMat}
                    onClick={(e) => handleClick(e, 'Exterior Walls')}
                    onPointerOver={(e) => handlePointerOver(e, 'Exterior Walls')}
                    onPointerOut={handlePointerOut}
                >
                    <boxGeometry args={[params.width, params.height, params.depth]} />
                </mesh>

                {/* Plinth */}
                <mesh position={[0, params.foundationHeight / 2, 0]} receiveShadow material={new THREE.MeshStandardMaterial({ color: '#44403c' })}>
                    <boxGeometry args={[params.width + 0.6, params.foundationHeight, params.depth + 0.6]} />
                </mesh>

                {/* Roof - Conditional Visibility */}
                {showRoof && (
                    <Roof
                        type={params.roofType}
                        width={params.width}
                        depth={params.depth}
                        height={params.height + params.foundationHeight}
                        color={params.roofColor}
                        overhang={params.overhang}
                    />
                )}

                {/* Facade - Front Door (Ground Only) */}
                <Door style={params.doorStyle} zOffset={params.depth / 2 + 0.05} viewMode={viewMode} />

                {/* Floor-based Details */}
                {renderFloors(params.width, params.depth, 0, 0)}
            </group>

            {/* --- WING MASS (L-Shape) --- */}
            {params.footprintShape === 'L-shape' && params.wingParams && (
                <group position={[params.width / 2 + params.wingParams.width / 2 - 0.2, 0, params.depth / 2 - params.wingParams.depth / 2]}>
                    {/* Core */}
                    <mesh position={[0, params.height / 2 + params.foundationHeight, 0]} castShadow receiveShadow material={wallMat}>
                        <boxGeometry args={[params.wingParams.width, params.height, params.wingParams.depth]} />
                    </mesh>
                    {/* Plinth */}
                    <mesh position={[0, params.foundationHeight / 2, 0]} receiveShadow material={new THREE.MeshStandardMaterial({ color: '#44403c' })}>
                        <boxGeometry args={[params.wingParams.width + 0.6, params.foundationHeight, params.wingParams.depth + 0.6]} />
                    </mesh>
                    {/* Roof */}
                    {showRoof && (
                        <Roof
                            type={params.roofType}
                            width={params.wingParams.width}
                            depth={params.wingParams.depth}
                            height={params.height + params.foundationHeight}
                            color={params.roofColor}
                            overhang={params.overhang}
                        />
                    )}
                    {/* Wing Floors */}
                    {renderFloors(params.wingParams.width, params.wingParams.depth, 0, 0)}
                </group>
            )}

            {/* --- INTERIOR --- */}
            {viewMode === 'interior' && (
                <group position={[0, params.foundationHeight, 0]}>
                    <InteriorRenderer />
                </group>
            )}

            {/* --- ENVIRONMENT --- */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[80, 64]} />
                <meshStandardMaterial color={groundColor} roughness={1} />
            </mesh>

            {/* Path */}
            <mesh position={[0, 0.05, params.depth / 2 + 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2.5, 8]} />
                <meshStandardMaterial color="#e7e5e4" />
            </mesh>
        </group>
    )
}
