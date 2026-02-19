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

    // Phase 5: Home Planning & Layout
    plot: {
        width: number
        depth: number
        unit: 'ft' | 'm'
    }
    setbacks: {
        front: number
        back: number
        left: number
        right: number
    }
    orientation: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW'
    rooms: Room[]
    smartHome: boolean
    materialTier: 'economy' | 'standard' | 'premium'
    ventilationPlan: boolean // Renaming/Confirming if this is distinct or same as smartHome-like feature
    ventilationType: 'natural' | 'mechanical' | 'hybrid'
}

export interface Room {
    id: string
    name: string
    type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining' | 'study' | 'other'
    floor: number
    width: number
    depth: number
    // Additional refined properties usually needed for logic, kept simple for now
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
    screenshotTrigger: number
    triggerScreenshot: () => void
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
    // Phase 5 Defaults
    plot: { width: 40, depth: 60, unit: 'ft' }, // Default plot size
    setbacks: { front: 5, back: 5, left: 3, right: 3 }, // Typical setbacks
    orientation: 'N',
    rooms: [
        { id: '1', name: 'Living Room', type: 'living', floor: 1, width: 16, depth: 14 },
        { id: '2', name: 'Kitchen', type: 'kitchen', floor: 1, width: 12, depth: 10 }
    ],
    smartHome: false,
    materialTier: 'standard',
    ventilationPlan: true,
    ventilationType: 'natural'
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
            set((state) => {
                const mergedParams = { ...state.params, ...newParams }

                // Auto-calculate Building Dimensions based on Plot & Setbacks
                // We do this if plot or setbacks are touched, OR if we just want to enforce the constraint strictly.
                // Constraint: Building Width = Plot Width - Left - Right
                const derivedWidth = mergedParams.plot.width - mergedParams.setbacks.left - mergedParams.setbacks.right
                const derivedDepth = mergedParams.plot.depth - mergedParams.setbacks.front - mergedParams.setbacks.back

                // Ensure dimensions don't go negative or absurdly small
                mergedParams.width = Math.max(4, derivedWidth)
                mergedParams.depth = Math.max(4, derivedDepth)

                return { params: mergedParams }
            }),
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
        screenshotTrigger: 0,
        triggerScreenshot: () => set((state) => ({ screenshotTrigger: state.screenshotTrigger + 1 })),
    }
})
