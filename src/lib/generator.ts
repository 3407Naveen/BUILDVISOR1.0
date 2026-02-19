import { BuildingParams } from '@/store/buildingStore'

export function parsePrompt(prompt: string): BuildingParams {
    const p = prompt.toLowerCase()

    // Style Intelligence
    const isModern = p.includes('modern') || p.includes('minimal') || p.includes('box') || p.includes('concrete')
    const isClassic = p.includes('classic') || p.includes('cottage') || p.includes('traditional') || p.includes('brick')

    // Strict Floor Logic (Phase 4)
    let floorCount = 1
    if (p.includes('two') || p.includes('2') || p.includes('double')) floorCount = 2
    if (p.includes('three') || p.includes('3') || p.includes('triple')) floorCount = 3
    if (p.includes('tall') && floorCount === 1) floorCount = 2

    const FLOOR_HEIGHT = 3.2
    const height = floorCount * FLOOR_HEIGHT

    // Dimensions Logic (3m floor height standard)
    const isLarge = p.includes('large') || p.includes('villa') || p.includes('mansion') || p.includes('estate')

    const width = isLarge ? 16 + Math.random() * 6 : 10 + Math.random() * 4
    const depth = isLarge ? 14 + Math.random() * 4 : 9 + Math.random() * 4

    // Architectural Inference
    let roofType: BuildingParams['roofType'] = 'flat'
    if (isClassic) roofType = 'gable'
    if (p.includes('hip')) roofType = 'hip'
    if (p.includes('flat')) roofType = 'flat'

    let facadeMaterial: BuildingParams['facadeMaterial'] = 'concrete'
    if (isClassic || p.includes('brick')) facadeMaterial = 'brick'
    if (p.includes('wood') || p.includes('timber')) facadeMaterial = 'wood'
    if (p.includes('stone')) facadeMaterial = 'stone'

    // Intelligent Footprint Logic
    const isCompound = p.includes('estate') || p.includes('villa') || p.includes('complex') || p.includes('ranch') || (isLarge && Math.random() > 0.4)
    const footprintShape = isCompound ? 'L-shape' : 'rectangular'

    // Calculate Wing for L-Shape
    let wingParams = undefined
    if (footprintShape === 'L-shape') {
        wingParams = {
            width: Math.floor(width * 0.55), // Wing is usually smaller
            depth: Math.floor(depth * 0.6),
            offset: 0
        }
    }

    // Refined Colors
    const colors = {
        concrete: ['#cbd5e1', '#94a3b8', '#e2e8f0'],
        brick: ['#7c2d12', '#9a3412', '#b45309'],
        wood: ['#78350f', '#92400e', '#b45309'],
        stone: ['#57534e', '#78716c', '#a8a29e']
    }

    const baseColor = colors[facadeMaterial][Math.floor(Math.random() * colors[facadeMaterial].length)]

    return {
        width: Math.floor(width),
        depth: Math.floor(depth),
        height,
        roofType,
        wallColor: baseColor,
        roofColor: isClassic ? '#451a03' : '#1e293b',
        facadeMaterial,
        windowCount: Math.floor((width + depth) / 4), // Balanced window count

        // New Fields
        windowStyle: isModern ? 'floor-to-ceiling' : (isClassic ? 'arched' : 'standard'),
        doorStyle: isModern ? 'modern' : (isClassic ? 'classic' : 'industrial'),
        porchDepth: isClassic ? 2.5 : (isModern ? 0.5 : 0),
        overhang: isClassic ? 0.6 : (isModern ? 0.2 : 0.4),
        foundationHeight: isClassic ? 0.5 : 0.2,
        envType: p.includes('forest') ? 'forest' : (isClassic ? 'grass' : 'pavement'),

        // Phase 3 & 4 Fields
        footprintShape,
        wingParams,
        floorCount,

        // Interior Settings
        furnitureDensity: 'standard',
        interiorLightTemp: 'warm',

        // New Fields Defaulting (mock values for prompt generation)
        plot: { width: 50, depth: 70, unit: 'ft' },
        setbacks: { front: 5, back: 5, left: 3, right: 3 },
        orientation: 'N',
        rooms: [
            { id: '1', name: 'Living Room', type: 'living', floor: 1, width: 16, depth: 14 },
            { id: '2', name: 'Kitchen', type: 'kitchen', floor: 1, width: 12, depth: 10 }
        ],
        smartHome: p.includes('smart'),
        materialTier: isLarge ? 'premium' : 'standard',
        ventilationPlan: true,
        ventilationType: 'natural'
    }

}

export function calculateCost(params: BuildingParams): number {
    // Base Structure Cost
    const area = params.width * params.depth + (params.wingParams ? params.wingParams.width * params.wingParams.depth : 0)
    const volume = area * params.height

    // Tier Multiplier
    const tierMultipliers = { economy: 0.8, standard: 1.0, premium: 1.5 }
    const tier = tierMultipliers[params.materialTier] || 1.0

    let cost = 50000 + (volume * 200)

    // Systems Cost
    if (params.smartHome) cost += 15000
    if (params.ventilationPlan) cost += 8000

    // Room Complexity Cost (Partitioning, finishing)
    cost += params.rooms.length * 5000

    return Math.floor(cost * tier)
}

export function calculateTimeline(params: BuildingParams): string {
    const area = params.width * params.depth
    let weeks = Math.ceil((area * params.height) / 150) // Refined baseline

    // Add time for complexity
    if (params.floorCount > 1) weeks += 2
    if (params.smartHome) weeks += 1
    if (params.rooms.length > 5) weeks += 1

    return `${weeks} weeks`
}
