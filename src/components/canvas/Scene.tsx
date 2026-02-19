'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, ContactShadows } from '@react-three/drei'
import { BuildingRenderer } from './BuildingRenderer'
import { useBuildingStore } from '@/store/buildingStore'
import { useEffect, useRef } from 'react'

function ScreenshotHandler() {
    const { gl, scene, camera } = useThree()
    const screenshotTrigger = useBuildingStore(state => state.screenshotTrigger)
    const isFirstRun = useRef(true)

    useEffect(() => {
        // Skip first run
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }

        // Need to render the scene right before capturing to ensure non-empty buffer
        gl.render(scene, camera)
        const dataUrl = gl.domElement.toDataURL('image/png')

        const link = document.createElement('a')
        link.download = `buildvisor-design-${Date.now()}.png`
        link.href = dataUrl
        link.click()
    }, [screenshotTrigger, gl, scene, camera])

    return null
}

export function Scene() {
    const { lightingMode } = useBuildingStore()

    const lightingSettings = {
        day: { ambient: 0.6, dirIntensity: 1.2, dirColor: '#ffffff' },
        evening: { ambient: 0.3, dirIntensity: 0.8, dirColor: '#ffb347' },
        night: { ambient: 0.1, dirIntensity: 0.5, dirColor: '#a0c4ff' },
    }[lightingMode]

    return (
        <div className="w-full h-full min-h-[500px] w-full bg-slate-950 rounded-lg overflow-hidden relative">
            <Canvas
                shadows
                camera={{ position: [15, 10, 15], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, alpha: true }}
            >
                <ScreenshotHandler />
                <ambientLight intensity={lightingSettings.ambient} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={lightingSettings.dirIntensity}
                    color={lightingSettings.dirColor}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                <BuildingRenderer />

                <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={50} blur={2.5} far={4} />
                <Grid position={[0, -0.11, 0]} args={[50, 50]} cellColor="#4a4a4a" sectionColor="#2a2a2a" fadeDistance={30} infiniteGrid />

                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enableDamping={true} dampingFactor={0.1} />
                <Environment preset="sunset" />
            </Canvas>
        </div>
    )
}
