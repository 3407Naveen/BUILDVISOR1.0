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

export interface Project {
    id: string;
    name: string;
    params: BuildingParams;
    timestamp: number;
}

interface BuildingState {
    params: BuildingParams
    projects: Project[]
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
    saveProject: (name: string) => void
    deleteProject: (id: string) => void
    loadProject: (project: Project) => void
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

export const useBuildingStore = create<BuildingState>((set) => {
    // Helper to load projects from localStorage
    const getStoredProjects = (): Project[] => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem('buildvisor_projects')
        return stored ? JSON.parse(stored) : []
    }

    return {
        params: defaultParams,
        projects: getStoredProjects(),
        viewMode: 'exterior',
        lightingMode: 'day',
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
        saveProject: (name) => set((state) => {
            const newProject: Project = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                params: { ...state.params },
                timestamp: Date.now()
            }
            const updatedProjects = [...state.projects, newProject]
            localStorage.setItem('buildvisor_projects', JSON.stringify(updatedProjects))
            return { projects: updatedProjects }
        }),
        deleteProject: (id) => set((state) => {
            const updatedProjects = state.projects.filter(p => p.id !== id)
            localStorage.setItem('buildvisor_projects', JSON.stringify(updatedProjects))
            return { projects: updatedProjects }
        }),
        loadProject: (project) => set({
            params: project.params,
            viewMode: 'exterior',
            activeFloor: null
        }),
        resetParams: () => set({
            params: defaultParams,
            viewMode: 'exterior',
            lightingMode: 'day',
            activeFloor: null,
            hoveredElement: null,
            selectedElement: null
        }),
    }
})
