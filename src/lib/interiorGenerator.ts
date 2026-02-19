import { BuildingParams } from '@/store/buildingStore'

export type FurnitureType =
    | 'sofa' | 'table' | 'bed' | 'wardrobe' | 'kitchen_unit'
    // Sanitary
    | 'toilet' | 'shower' | 'vanity'
    // Decor
    | 'tv_unit' | 'rug' | 'plant' | 'chair'

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
    type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'study' | 'corridor' | 'dining' | 'other'
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
    // Use the user-defined rooms from params.rooms
    // We need to place them within the building footprint. 
    // Since users only define dimensions, we use a simple Flow Layout (Bin Packing lite).

    const roomGap = 0.2

    // Group rooms by floor
    const roomsByFloor: Record<number, typeof params.rooms> = {}
    params.rooms.forEach(r => {
        if (!roomsByFloor[r.floor]) roomsByFloor[r.floor] = []
        roomsByFloor[r.floor].push(r)
    })

    // Process each floor
    // Note: params.rooms floor is 1-based (from UI). 
    // Our renderer expects yPos relative to foundation.
    // If params.floorCount is 2, it means we have Level 1 (Ground) and Level 2.

    for (let f = 1; f <= params.floorCount; f++) {
        const floorRooms = roomsByFloor[f] || []
        // Even if no rooms defined, we might want empty space, but let's just skip logic if empty
        if (floorRooms.length === 0) continue

        const yPos = (f - 1) * floorHeight

        // Simple Layout Cursor
        // Start from top-left of the building interior
        // Building Center is (0,0) locally.
        // Top-Left is (-w/2, -d/2).
        let currentX = -w / 2 + 0.5 // Padding
        let currentZ = -d / 2 + 0.5 // Padding
        let rowMaxDeep = 0

        floorRooms.forEach(userRoom => {
            // Check if fits in current row
            if (currentX + userRoom.width > w / 2) {
                // Move to next row
                currentX = -w / 2 + 0.5
                currentZ += rowMaxDeep + roomGap
                rowMaxDeep = 0
            }

            // Place Room Center
            const roomCenterX = currentX + userRoom.width / 2
            const roomCenterZ = currentZ + userRoom.depth / 2

            // Store in output
            rooms.push({
                name: userRoom.name,
                type: userRoom.type as any, // Cast to match internal type or update internal type
                x: roomCenterX,
                z: roomCenterZ,
                width: userRoom.width,
                depth: userRoom.depth,
                floor: f - 1 // Logic uses 0-indexed floors for rendering check activeFloor
            })

            // Generate Furniture for this room
            // Call a helper or inline logic
            // Adapt existing furniture logic to be relative to THIS room
            generateFurnitureForRoom(furniture, {
                ...userRoom,
                x: roomCenterX,
                z: roomCenterZ,
                y: yPos,
                type: userRoom.type,
                floor: f - 1 // consistent with room floor
            }, params.furnitureDensity)

            // Update Cursor
            currentX += userRoom.width + roomGap
            if (userRoom.depth > rowMaxDeep) rowMaxDeep = userRoom.depth
        })
    }

    return { rooms, furniture }
}

function generateFurnitureForRoom(allFurniture: FurnitureItem[], room: { type: string, x: number, y: number, z: number, width: number, depth: number, floor: number }, density: string) {
    // Helper to add relative to room center
    const add = (item: Omit<FurnitureItem, 'x' | 'y' | 'z' | 'floor'>, xOff: number, zOff: number) => {
        allFurniture.push({
            ...item,
            x: room.x + xOff,
            y: room.y,
            z: room.z + zOff,
            floor: room.floor
        })
    }

    const { width, depth } = room

    // Logic per room type
    if (room.type === 'living') {
        // Sofa centered
        if (width > 3 && depth > 3) {
            add({ type: 'sofa', rotation: -Math.PI / 2, width: 2.4, depth: 0.9, height: 0.8 }, 0, 0)
            add({ type: 'tv_unit', rotation: Math.PI / 2, width: 0.5, depth: 2.0, height: 0.6 }, -width / 2 + 0.6, 0)
            if (density !== 'minimal') {
                add({ type: 'table', rotation: 0, width: 1.2, depth: 0.7, height: 0.4 }, 1.5, 0)
            }
        }
    } else if (room.type === 'bedroom') {
        // Bed against wall
        add({ type: 'bed', rotation: Math.PI / 2, width: 1.8, depth: 2.1, height: 0.6 }, -width / 2 + 2, 0)
        if (width > 3) {
            add({ type: 'wardrobe', rotation: -Math.PI / 2, width: 0.6, depth: 2.0, height: 2.2 }, width / 2 - 0.4, 0)
        }
    } else if (room.type === 'kitchen') {
        // Kitchen Unit
        add({ type: 'kitchen_unit', rotation: 0, width: width - 0.5, depth: 0.6, height: 0.9 }, 0, -depth / 2 + 0.4)
    } else if (room.type === 'bathroom') {
        add({ type: 'shower', rotation: 0, width: 1.0, depth: 1.0, height: 2.1 }, -width / 2 + 0.6, -depth / 2 + 0.6)
        add({ type: 'toilet', rotation: Math.PI / 2, width: 0.5, depth: 0.7, height: 0.45 }, width / 2 - 0.5, 0)
    } else if (room.type === 'dining') {
        add({ type: 'table', rotation: 0, width: 1.8, depth: 1.0, height: 0.75 }, 0, 0)
        if (width > 4) {
            add({ type: 'chair', rotation: Math.PI / 2, width: 0.5, depth: 0.5, height: 0.9 }, -1.5, 0)
            add({ type: 'chair', rotation: -Math.PI / 2, width: 0.5, depth: 0.5, height: 0.9 }, 1.5, 0)
        }
    }
}
