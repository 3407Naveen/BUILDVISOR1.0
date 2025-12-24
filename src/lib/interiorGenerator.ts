import { BuildingParams } from '@/store/buildingStore'

export type FurnitureType =
    | 'sofa' | 'table' | 'bed' | 'wardrobe' | 'kitchen_unit'
    | 'toilet' | 'shower' | 'vanity' | 'tv_unit' | 'rug' | 'plant' | 'chair'

export interface FurnitureItem {
    type: FurnitureType
    x: number
    y: number
    z: number
    rotation: number
    width: number
    depth: number
    height: number
    floor: number
}

export interface Room {
    name: string
    type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'study' | 'corridor'
    x: number
    z: number
    width: number
    depth: number
    floor: number
}

// Helper: Check for collision with existing furniture
function checkCollision(item: FurnitureItem, existing: FurnitureItem[]): boolean {
    const margin = 0.1
    for (const other of existing) {
        if (item.floor !== other.floor) continue

        // Simple AABB collision
        if (
            item.x - item.width / 2 - margin < other.x + other.width / 2 + margin &&
            item.x + item.width / 2 + margin > other.x - other.width / 2 - margin &&
            item.z - item.depth / 2 - margin < other.z + other.depth / 2 + margin &&
            item.z + item.depth / 2 + margin > other.z - other.depth / 2 - margin
        ) {
            return true
        }
    }
    return false
}

export function generateInteriorLayout(params: BuildingParams): { rooms: Room[], furniture: FurnitureItem[] } {
    const rooms: Room[] = []
    const furniture: FurnitureItem[] = []
    const floorHeight = 3.2

    // Dimensions
    const w = params.width
    const d = params.depth

    // --- STRATEGY ---
    // Ground Floor: Open Plan (Living + Dining/Kitchen) + Service (Bath/Study)
    // Upper Floors: Private (Master Bed + Bath + Guest Bed)

    for (let f = 0; f < params.floorCount; f++) {
        const yPos = f * floorHeight

        if (f === 0) {
            // -- GROUND FLOOR GENERATION --

            // Split: 60% Living/Dining (Front), 40% Kitchen/Service (Back)
            const frontDepth = d * 0.6
            const backDepth = d - frontDepth

            // Zone 1: Living (Front Left)
            rooms.push({
                name: 'Living', type: 'living',
                x: -w / 4, z: frontDepth / 2 - d / 2, // Centered in front half
                width: w / 2 - 0.5, depth: frontDepth - 0.5, floor: f
            })

            // Zone 2: Dining (Front Right)
            rooms.push({
                name: 'Dining', type: 'living',
                x: w / 4, z: frontDepth / 2 - d / 2,
                width: w / 2 - 0.5, depth: frontDepth - 0.5, floor: f
            })

            // Zone 3: Kitchen (Back Right)
            rooms.push({
                name: 'Kitchen', type: 'kitchen',
                x: w / 4, z: d / 2 - backDepth / 2,
                width: w / 2 - 0.5, depth: backDepth - 0.5, floor: f
            })

            // Zone 4: Bath/Study (Back Left)
            rooms.push({
                name: 'Study', type: 'study',
                x: -w / 4, z: d / 2 - backDepth / 2,
                width: w / 2 - 0.5, depth: backDepth - 0.5, floor: f
            })

            // --- FURNISHING GROUND FLOOR ---

            // Living Room: Sofa Set + TV
            // Sofa faces "center" of room or TV wall. Let's place TV on Left Wall (-x) and Sofa facing it.

            // TV Unit (Left Wall of Living Zone)
            furniture.push({
                type: 'tv_unit',
                x: (-w / 2) + 0.6, y: yPos, z: frontDepth / 2 - d / 2,
                rotation: Math.PI / 2, width: 0.5, depth: 2.0, height: 0.6, floor: f
            })

            // Sofa (Facing TV, offset to right)
            furniture.push({
                type: 'sofa',
                x: (-w / 2) + 0.6 + 2.5, y: yPos, z: frontDepth / 2 - d / 2,
                rotation: -Math.PI / 2, width: 2.4, depth: 0.9, height: 0.8, floor: f
            })

            // Coffee Table
            furniture.push({
                type: 'table',
                x: (-w / 2) + 0.6 + 1.5, y: yPos, z: frontDepth / 2 - d / 2,
                rotation: 0, width: 1.2, depth: 0.7, height: 0.4, floor: f
            })

            // Rug
            furniture.push({
                type: 'rug',
                x: (-w / 2) + 0.6 + 1.8, y: yPos + 0.01, z: frontDepth / 2 - d / 2,
                rotation: 0, width: 3.0, depth: 2.5, height: 0.02, floor: f
            })

            // Dining Room: Table in center
            furniture.push({
                type: 'table',
                x: w / 4, y: yPos, z: frontDepth / 2 - d / 2,
                rotation: 0, width: 1.8, depth: 1.0, height: 0.75, floor: f
            })
            // Chairs
            furniture.push({ type: 'chair', x: w / 4 - 1, y: yPos, z: frontDepth / 2 - d / 2, rotation: Math.PI / 2, width: 0.5, depth: 0.5, height: 0.9, floor: f })
            furniture.push({ type: 'chair', x: w / 4 + 1, y: yPos, z: frontDepth / 2 - d / 2, rotation: -Math.PI / 2, width: 0.5, depth: 0.5, height: 0.9, floor: f })


            // Kitchen: L-Shape unit
            // Back Wall unit
            furniture.push({
                type: 'kitchen_unit',
                x: w / 4, y: yPos, z: d / 2 - 0.4,
                rotation: 0, width: w / 2 - 1, depth: 0.6, height: 0.9, floor: f
            })
            // Side unit (Right Wall)
            furniture.push({
                type: 'kitchen_unit',
                x: w / 2 - 0.4, y: yPos, z: d / 2 - backDepth / 2,
                rotation: Math.PI / 2, width: 0.6, depth: backDepth - 1.5, height: 0.9, floor: f
            })


        } else {
            // -- UPPER FLOORS GENERATION --
            // Split: Master Suite (Front), Guest/Kids (Back)

            // Master Bedroom (Front Full Width or Large Split)
            rooms.push({
                name: 'Master Bed', type: 'bedroom',
                x: 0, z: -d / 4,
                width: w - 1, depth: d / 2 - 0.5, floor: f
            })

            // Bed (Centered on back wall of zone usually, but here checking constraints)
            // Let's place bed head against Left Wall (-x)
            furniture.push({
                type: 'bed',
                x: -w / 2 + 1.6, y: yPos, z: -d / 4,
                rotation: Math.PI / 2, width: 1.8, depth: 2.1, height: 0.6, floor: f
            })

            // Wardrobe (Right Wall)
            furniture.push({
                type: 'wardrobe',
                x: w / 2 - 0.4, y: yPos, z: -d / 4,
                rotation: -Math.PI / 2, width: 0.6, depth: 2.5, height: 2.2, floor: f
            })

            // Back Zone (Bathroom + Guest)
            const backZ = d / 4

            // Bathroom (Back Left)
            rooms.push({
                name: 'Bath', type: 'bathroom',
                x: -w / 4, z: backZ,
                width: w / 2 - 0.5, depth: d / 2 - 1, floor: f
            })

            // Shower (Corner)
            furniture.push({
                type: 'shower',
                x: -w / 2 + 0.6, y: yPos, z: d / 2 - 0.6,
                rotation: 0, width: 1.0, depth: 1.0, height: 2.1, floor: f
            })
            // Toilet
            furniture.push({
                type: 'toilet',
                x: -w / 2 + 0.5, y: yPos, z: backZ,
                rotation: Math.PI / 2, width: 0.5, depth: 0.7, height: 0.45, floor: f
            })
            // Vanity
            furniture.push({
                type: 'vanity',
                x: -0.5, y: yPos, z: backZ,
                rotation: -Math.PI / 2, width: 1.0, depth: 0.5, height: 0.85, floor: f
            })


            // Guest Room (Back Right)
            rooms.push({
                name: 'Guest Bed', type: 'bedroom',
                x: w / 4, z: backZ,
                width: w / 2 - 0.5, depth: d / 2 - 1, floor: f
            })
            furniture.push({
                type: 'bed',
                x: w / 2 - 1.6, y: yPos, z: backZ,
                rotation: -Math.PI / 2, width: 1.6, depth: 2.0, height: 0.6, floor: f
            })
        }
    }

    // Wings
    if (params.footprintShape === 'L-shape' && params.wingParams) {
        const wx = params.width / 2 + params.wingParams.width / 2 - 0.2
        const wz = params.depth / 2 - params.wingParams.depth / 2
        rooms.push({ name: 'Garage/Office', type: 'study', x: wx, z: wz, width: params.wingParams.width - 1, depth: params.wingParams.depth - 1, floor: 0 })
        // Just a desk
        furniture.push({
            type: 'table', x: wx, y: 0, z: wz,
            rotation: 0, width: 1.6, depth: 0.8, height: 0.75, floor: 0
        })
    }

    // Filter based on Density
    if (params.furnitureDensity === 'minimal') {
        // Remove decorative/non-essential items
        return {
            rooms,
            furniture: furniture.filter(f => !['rug', 'plant', 'tv_unit', 'chair'].includes(f.type))
        }
    } else if (params.furnitureDensity === 'standard') {
        // Keep most things
        return { rooms, furniture }
    } else {
        // Premium: In the future, we could duplicates or add more props (lamps, art).
        // For now, it's the same as standard but allows everything.
        return { rooms, furniture }
    }
}
