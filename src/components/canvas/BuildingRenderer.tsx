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

    // Calculate Building Position relative to Plot Center
    // Plot Center is (0,0).
    // Top-Left of Plot is (-plotW/2, -plotD/2) if we assume Z is depth.
    // Let's assume standard orientation: Width is X, Depth is Z.
    // "Front" setback pushes from Z- (or Z+ depending on street). Let's assume Street is at +Z for now (common in easy 3D previz).
    // Actually, usually Street is 'Front'. If street is at +Z, "Front Setback" means pushing away from +Z towards -Z.
    // Let's maximize usability: "Front" usually means the side with the door.
    // Let's Place the Plot Center at (0,0).
    const plotW = params.plot.width
    const plotD = params.plot.depth
    const setL = params.setbacks.left
    const setR = params.setbacks.right
    const setF = params.setbacks.front // Front
    const setB = params.setbacks.back  // Back

    // Building Dimensions (already calculated in store, but good to know)
    const buildW = params.width
    const buildD = params.depth

    // If Plot Center is 0,0:
    // West Edge (Left) is -plotW/2. Step in by setL -> x = -plotW/2 + setL + buildW/2
    const centerX = (-plotW / 2) + setL + (buildW / 2)

    // South Edge (Front) is +plotD/2 (if Z+ is forward). Step in by setF -> z = plotD/2 - setF - (buildD / 2)
    const centerZ = (plotD / 2) - setF - (buildD / 2)

    return (
        <group>
            {/* Visualizing the Plot Boundary */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                <planeGeometry args={[plotW, plotD]} />
                <meshStandardMaterial color="#0c0a09" transparent opacity={0.2} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(plotW, plotD)]} />
                    <lineBasicMaterial color="#3b82f6" transparent opacity={0.3} />
                </lineSegments>
            </mesh>

            {/* --- MAIN MASS with Offset --- */}
            <group position={[centerX, 0, centerZ]}>
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

                {/* Smart Home Nodes */}
                {params.smartHome && (
                    <group>
                        {/* Corners */}
                        {[-1, 1].map(x => [-1, 1].map(z => (
                            <mesh key={`${x}-${z}`} position={[x * (params.width / 2 - 0.2), params.height - 0.5, z * (params.depth / 2 - 0.2)]}>
                                <sphereGeometry args={[0.15]} />
                                <meshBasicMaterial color="#60a5fa" toneMapped={false} />
                                <pointLight color="#60a5fa" distance={3} intensity={2} />
                            </mesh>
                        )))}
                    </group>
                )}

                {/* Ventilation Vents */}
                {params.ventilationPlan && (
                    <group>
                        {/* Side Vents */}
                        {[-1, 1].map(x => (
                            <mesh key={`vent-${x}`} position={[x * (params.width / 2 + 0.05), params.height - 1, 0]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
                                <boxGeometry args={[1, 0.4, 0.1]} />
                                <meshStandardMaterial color="#64748b" />
                            </mesh>
                        ))}
                    </group>
                )}

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

                {/* --- INTERIOR (Nested to move with house) --- */}
                {viewMode === 'interior' && (
                    <group position={[0, params.foundationHeight, 0]}>
                        <InteriorRenderer />
                    </group>
                )}
            </group>

            {/* --- WING MASS (L-Shape) - adjusted relative to main mass or kept simple --- */}
            {/* For now, let's keep Wing relative to the Main Mass position we just calculated.
                If the main mass moves, the wing should move with it. 
                However, L-shape logic usually implies the wing helps define the footprint. 
                Logic refactor: The main mass is the anchor. 
             */}
            {params.footprintShape === 'L-shape' && params.wingParams && (
                <group position={[centerX + params.width / 2 + params.wingParams.width / 2 - 0.2, 0, centerZ + params.depth / 2 - params.wingParams.depth / 2]}>
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

            {/* --- ENVIRONMENT --- */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[80, 64]} />
                <meshStandardMaterial color={groundColor} roughness={1} />
            </mesh>

            {/* Path - Adjust to connect to the new Front Door Position */}
            <mesh position={[centerX, 0.05, centerZ + params.depth / 2 + 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2.5, 8]} />
                <meshStandardMaterial color="#e7e5e4" />
            </mesh>
        </group>
    )
}
