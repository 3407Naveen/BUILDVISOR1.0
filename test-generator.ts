
// Mocking BuildingParams from buildingStore
interface BuildingParams {
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

// Logic copied from src/lib/generator.ts
function parsePrompt(prompt: string): BuildingParams {
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

// Test Runner
function runTests() {
    console.log("Starting Generation Logic Tests...\n");
    let passed = 0;
    let failed = 0;

    function assert(condition: boolean, desc: string, details?: any) {
        if (condition) {
            console.log(`✅ PASS: ${desc}`);
            passed++;
        } else {
            console.log(`❌ FAIL: ${desc}`);
            if (details) console.log(`   Details:`, details);
            failed++;
        }
    }

    // Test Case 1: "Two storey modern house"
    {
        const prompt = "Two storey modern house";
        const result = parsePrompt(prompt);
        assert(result.floorCount === 2, `"${prompt}" should have 2 floors`, { floorCount: result.floorCount });
    }

    // Test Case 2: "Three storey office building"
    {
        const prompt = "Three storey office building";
        const result = parsePrompt(prompt);
        assert(result.floorCount === 3, `"${prompt}" should have 3 floors`, { floorCount: result.floorCount });
    }

    // Test Case 3: "Large modern villa" -> L-shape trigger
    {
        const prompt = "Large modern villa";
        const result = parsePrompt(prompt);
        // Note: L-shape is probabilistic for "large" unless specific keywords like "villa" force it if the logic says so.
        // Looking at code: const isCompound = ... || p.includes('villa') ...
        // So it should be L-shape.
        assert(result.footprintShape === 'L-shape', `"${prompt}" should be L-shape`, { footprintShape: result.footprintShape });
        assert(!!result.wingParams, `"${prompt}" should have wingParams`);
    }

    // Test Case 4: "Classic brick cottage with gable roof"
    {
        const prompt = "Classic brick cottage with gable roof";
        const result = parsePrompt(prompt);
        assert(result.facadeMaterial === 'brick', `"${prompt}" should be brick`, { material: result.facadeMaterial });
        assert(result.roofType === 'gable', `"${prompt}" should have gable roof`, { roof: result.roofType });
        assert(result.windowStyle === 'arched', `"${prompt}" should have arched windows (classic)`, { window: result.windowStyle });
    }

    // Test Case 5: "Minimalist concrete box"
    {
        const prompt = "Minimalist concrete box";
        const result = parsePrompt(prompt);
        assert(result.facadeMaterial === 'concrete', `"${prompt}" should be concrete`, { material: result.facadeMaterial });
        assert(result.roofType === 'flat', `"${prompt}" should have flat roof`, { roof: result.roofType });
        assert(result.windowStyle === 'floor-to-ceiling', `"${prompt}" should have floor-to-ceiling windows`, { window: result.windowStyle });
    }

    // Test Case 6: "Modern glass home with forest surroundings"
    {
        const prompt = "Modern glass home with forest surroundings";
        const result = parsePrompt(prompt);
        assert(result.envType === 'forest', `"${prompt}" should have forest environment`, { env: result.envType });
    }

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
}

runTests();
