import { create } from 'zustand'

export interface BuildingParams {
    width: number
    depth: number
    height: number
    roofType: 'flat' | 'gable' | 'hip'
    wallColor: string
    roofColor: string
    facadeMaterial: 'concrete' | 'brick' | 'wood' | 'stone'
    windowCount: number
    // Architectural Details
    windowStyle: 'standard' | 'floor-to-ceiling' | 'arched'
    doorStyle: 'modern' | 'classic' | 'industrial'
    porchDepth: number
    overhang: number
    foundationHeight: number
    envType: 'grass' | 'pavement' | 'gravel' | 'forest'

    // Phase 3: Structural Realism
    footprintShape: 'rectangular' | 'L-shape'
    wingParams?: {
        width: number
        depth: number
        offset: number // Position along the main mass
    }

    // Phase 4: Refinement
    floorCount: number
    furnitureDensity: 'minimal' | 'standard' | 'premium'
    interiorLightTemp: 'warm' | 'neutral' | 'cool'
}

interface BuildingState {
    params: BuildingParams
    viewMode: 'exterior' | 'interior'
    lightingMode: 'day' | 'evening' | 'night'
    activeFloor: number | null
    hoveredElement: string | null
    selectedElement: string | null
    setParams: (params: Partial<BuildingParams>) => void
    setViewMode: (mode: 'exterior' | 'interior') => void
    setLightingMode: (mode: 'day' | 'evening' | 'night') => void
    setActiveFloor: (floor: number | null) => void
    setHoveredElement: (element: string | null) => void
    setSelectedElement: (element: string | null) => void
    resetParams: () => void
}

const defaultParams: BuildingParams = {
    width: 10,
    depth: 10,
    height: 6,
    roofType: 'flat',
    wallColor: '#e2e8f0',
    roofColor: '#1e293b',
    facadeMaterial: 'concrete',
    windowCount: 4,
    windowStyle: 'standard',
    doorStyle: 'modern',
    porchDepth: 0.0,
    overhang: 0.2,
    foundationHeight: 0.2,
    envType: 'grass',
    furnitureDensity: 'standard', // New default
    interiorLightTemp: 'warm', // New default
    footprintShape: 'rectangular',
    floorCount: 2,
}

export const useBuildingStore = create<BuildingState>((set) => ({
    params: defaultParams,
    viewMode: 'exterior', // Default view
    lightingMode: 'day', // Default lighting
    activeFloor: null,
    hoveredElement: null,
    selectedElement: null,
    setParams: (newParams) =>
        set((state) => ({ params: { ...state.params, ...newParams } })),
    setViewMode: (mode) => set({ viewMode: mode }),
    setLightingMode: (mode) => set({ lightingMode: mode }),
    setActiveFloor: (floor) => set({ activeFloor: floor }),
    setHoveredElement: (element) => set({ hoveredElement: element }),
    setSelectedElement: (element) => set({ selectedElement: element }),
    resetParams: () => set({
        params: defaultParams,
        viewMode: 'exterior',
        lightingMode: 'day',
        activeFloor: null,
        hoveredElement: null,
        selectedElement: null
    }),
}))
