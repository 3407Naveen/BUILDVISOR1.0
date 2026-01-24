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
        interiorLightTemp: 'warm'
    }

}

export function calculateCost(params: BuildingParams): number {
    const area = params.width * params.depth + (params.wingParams ? params.wingParams.width * params.wingParams.depth : 0)
    const volume = area * params.height
    const materialFactor = params.facadeMaterial === 'concrete' ? 1.2 : 1.0

    // Base cost + volume cost
    return Math.floor(50000 + (volume * 200 * materialFactor))
}

export function calculateTimeline(params: BuildingParams): string {
    const area = params.width * params.depth + (params.wingParams ? params.wingParams.width * params.wingParams.depth : 0)
    const weeks = Math.ceil((area * params.height) / 100)
    return `${weeks} weeks`
}
