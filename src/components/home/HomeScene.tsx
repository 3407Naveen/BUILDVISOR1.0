'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
    PerspectiveCamera,
    AdaptiveDpr,
    AdaptiveEvents,
    Html,
    Preload,
    MeshReflectorMaterial,
    Environment,
    ContactShadows,
} from '@react-three/drei'
import * as THREE from 'three'
import {
    Layers, Users, Zap, Bot, Activity,
    FolderKanban, Ruler, Wind, ShieldCheck, Compass,
} from 'lucide-react'

// ─── Camera Path ──────────────────────────────────────────────────────────────
const WAYPOINTS = [
    new THREE.Vector3(0, 2.5, 45),     // outside entrance (higher start)
    new THREE.Vector3(0, 1.8, 24),     // entrance hall
    new THREE.Vector3(-4, 1.8, 8),     // living room
    new THREE.Vector3(4, 1.8, -8),      // kitchen
    new THREE.Vector3(-3, 1.8, -24),    // bedroom
    new THREE.Vector3(2, 1.8, -40),     // workspace
    new THREE.Vector3(0, 2.5, -55),    // terrace
]

const LOOKAT = [
    new THREE.Vector3(0, 1.8, 25),
    new THREE.Vector3(0, 1.8, 10),
    new THREE.Vector3(4, 1.8, 0),
    new THREE.Vector3(-4, 1.8, -16),
    new THREE.Vector3(4, 1.8, -32),
    new THREE.Vector3(-2, 1.8, -48),
    new THREE.Vector3(0, 3, -80),
]

// ─── Glass Info Card ──────────────────────────────────────────────────────────
function Card({
    pos, title, body, icon: Icon, accent = '#3b82f6', show,
}: {
    pos: [number, number, number]
    title: string
    body: string
    icon: React.ComponentType<{ className?: string }>
    accent?: string
    show: boolean
}) {
    return (
        <Html position={pos} distanceFactor={12} occlude={false} transform style={{ pointerEvents: 'none' }}>
            {/* CSS float — Float component can't be used inside Html (it's a DOM portal outside Canvas fiber) */}
            <div style={{
                animation: 'cardFloat 4s ease-in-out infinite',
            }}>
                <style>{`@keyframes cardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
                <div style={{
                    opacity: show ? 1 : 0,
                    transform: `scale(${show ? 1 : 0.82}) translateY(${show ? 0 : 24}px)`,
                    transition: 'all 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
                    width: 270,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    borderTop: `1px solid rgba(255,255,255,0.18)`,
                    borderRadius: 20,
                    padding: '22px',
                    boxShadow: `0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
                    color: '#ffffff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 11,
                            background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                            border: `1px solid ${accent}35`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            color: accent,
                            boxShadow: `0 0 20px ${accent}25`,
                        }}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>{title}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{body}</p>
                    <div style={{
                        marginTop: 16, height: 1.5, width: '35%',
                        background: `linear-gradient(90deg, ${accent}, transparent)`,
                        borderRadius: 1,
                    }} />
                </div>
            </div>
        </Html>
    )
}

// ─── Room Wall Color Palettes ─────────────────────────────────────────────────
// Distinct architectural tones per zone
const WALL = {
    // Main shell — warm neutral
    shell: '#d6cfc7',       // warm alabaster
    ceiling: '#f5f0eb',     // soft warm white

    // Per-room accent walls
    entrance: '#c8d8e8',    // pale blue-grey glass reflection
    living: '#c2c9be',      // warm sage green
    kitchen: '#d8cfc4',     // warm limestone
    bedroom: '#cdc5d0',     // soft lavender grey
    workspace: '#1e2d3d',   // deep navy
    terrace: '#b8ccd4',     // sky mist

    // Feature / accent pieces
    accentWood: '#7a5c41',
    accentDark: '#0f172a',
    furniture: '#3a4252',
    metalDark: '#1e293b',
}

const DARK_FRAME = '#0f172a'
const GLASS_PROPS = {
    color: '#c8ddf0',
    transparent: true,
    opacity: 0.12,
    transmission: 0.96,
    roughness: 0,
    ior: 1.5,
    thickness: 0.1,
}

// ─── Smart Wall (Dynamic Transparency) ────────────────────────────────────────
function SmartWall({
    pos, rot, args, color = WALL.shell, scrollT, thresholdZ, fadeRange = 5
}: {
    pos: [number, number, number]
    rot?: [number, number, number]
    args: [number, number, number]
    color?: string
    scrollT: React.MutableRefObject<number>
    thresholdZ: number
    fadeRange?: number
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const curve = useMemo(() => new THREE.CatmullRomCurve3(WAYPOINTS, false, 'centripetal', 0.5), [])

    useFrame(() => {
        if (!meshRef.current) return
        const t = scrollT.current
        const camPos = curve.getPointAt(t)
        meshRef.current.visible = camPos.z < thresholdZ + 2
    })

    return (
        <mesh ref={meshRef} position={pos} rotation={rot}>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} roughness={0.88} metalness={0.02} transparent />
        </mesh>
    )
}

// ─── Wall Panel Stripe (Architectural Detail) ─────────────────────────────────
// Adds a lower wainscoting strip in a contrasting tone
function WainscotStripe({ zCenter, W, length }: { zCenter: number, W: number, length: number }) {
    return (
        <group>
            {/* Left wainscot */}
            <mesh position={[-W, 0.9, zCenter]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[length, 1.8]} />
                <meshStandardMaterial color="#b5ada4" roughness={0.85} side={THREE.FrontSide} />
            </mesh>
            {/* Right wainscot */}
            <mesh position={[W, 0.9, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[length, 1.8]} />
                <meshStandardMaterial color="#b5ada4" roughness={0.85} side={THREE.FrontSide} />
            </mesh>
            {/* Chair rail trim */}
            <mesh position={[-W, 1.8, zCenter]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.04, 0.06]} />
                <meshStandardMaterial color="#9e968e" roughness={0.5} metalness={0.1} />
            </mesh>
            <mesh position={[W, 1.8, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.04, 0.06]} />
                <meshStandardMaterial color="#9e968e" roughness={0.5} metalness={0.1} />
            </mesh>
        </group>
    )
}

// ─── 1. CONTINUOUS SHELL ─────────────────────────────────────────────────────
function HouseShell({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const length = 80
    const zCenter = (30 + (-50)) / 2   // = -10
    const W = 14
    const H = 6.5

    return (
        <group>
            {/* ── FLOOR (Polished Dark Slate with reflections) ── */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, zCenter]} receiveShadow>
                <planeGeometry args={[W * 2, length]} />
                <MeshReflectorMaterial
                    color="#141820"
                    roughness={0.06}
                    metalness={0.15}
                    mirror={0.35}
                    resolution={1024}
                    mixBlur={4}
                    mixStrength={0.5}
                    depthScale={1}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1}
                    blur={[300, 100]}
                />
            </mesh>

            {/* ── CEILING (Warm off-white) ── */}
            <mesh position={[0, H, zCenter]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[W * 2, length]} />
                <meshStandardMaterial color={WALL.ceiling} roughness={0.95} />
            </mesh>

            {/* Ceiling cove strip for indirect light feel */}
            <mesh position={[-W + 0.3, H - 0.08, zCenter]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.15, 0.3]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} />
            </mesh>
            <mesh position={[W - 0.3, H - 0.08, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.15, 0.3]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} />
            </mesh>

            {/* Baseboard trim */}
            <mesh position={[-W, 0.06, zCenter]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.12, 0.08]} />
                <meshStandardMaterial color="#c8bfb5" roughness={0.7} />
            </mesh>
            <mesh position={[W, 0.06, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[length, 0.12, 0.08]} />
                <meshStandardMaterial color="#c8bfb5" roughness={0.7} />
            </mesh>

            {/* ── LEFT WALL ── */}
            <SmartWall
                pos={[-W, H / 2, zCenter]}
                rot={[0, Math.PI / 2, 0]}
                args={[length, H, 0.1]}
                color={WALL.shell}
                scrollT={scrollT}
                thresholdZ={zCenter + length / 2}
            />

            {/* ── RIGHT WALL ── */}
            <SmartWall
                pos={[W, H / 2, zCenter]}
                rot={[0, -Math.PI / 2, 0]}
                args={[length, H, 0.1]}
                color={WALL.shell}
                scrollT={scrollT}
                thresholdZ={zCenter + length / 2}
            />

            {/* ── BACK WALL ── */}
            <SmartWall
                pos={[0, H / 2, -60]}
                args={[W * 2, H, 0.1]}
                color={WALL.terrace}
                scrollT={scrollT}
                thresholdZ={-60 + 0.05}
            />

            {/* Architectural wainscoting */}
            <WainscotStripe zCenter={zCenter} W={W} length={length} />
        </group>
    )
}

// ─── 2. ENTRANCE ─────────────────────────────────────────────────────────────
function EntranceRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, 30]}>
            {/* Feature accent wall — pale blue-grey behind entrance */}
            <mesh position={[0, 3.25, -8]}>
                <boxGeometry args={[28, 6.5, 0.12]} />
                <meshStandardMaterial color={WALL.entrance} roughness={0.86} />
            </mesh>

            {/* Glass Entrance Wall */}
            <mesh position={[0, 3.25, 0]} castShadow>
                <boxGeometry args={[12, 6.5, 0.1]} />
                <meshPhysicalMaterial {...GLASS_PROPS} />
            </mesh>
            <mesh position={[0, 3.25, 0]}>
                <boxGeometry args={[12.1, 6.6, 0.12]} />
                <meshStandardMaterial color="#0f1a2e" roughness={0.15} metalness={0.4} />
            </mesh>

            {/* Window Light Stream */}
            <rectAreaLight position={[0, 3, 1]} rotation={[0, Math.PI, 0]} width={10} height={5} intensity={14} color="#e8f0ff" />

            {/* Decorative vertical fins (architectural detail) */}
            {([-5, -2.5, 0, 2.5, 5] as number[]).map((x, i) => (
                <mesh key={i} position={[x, 3.25, -4]}>
                    <boxGeometry args={[0.06, 6.5, 0.6]} />
                    <meshStandardMaterial color="#c8d8e8" roughness={0.5} metalness={0.1} />
                </mesh>
            ))}

            {/* Console Table */}
            <mesh position={[5, 0.45, -5]} castShadow receiveShadow>
                <boxGeometry args={[4, 0.9, 0.8]} />
                <meshStandardMaterial color="#f0ece8" roughness={0.75} />
            </mesh>
            <mesh position={[5, 0.92, -5]}>
                <boxGeometry args={[4.2, 0.05, 0.9]} />
                <meshStandardMaterial color={WALL.accentWood} roughness={0.3} metalness={0.05} />
            </mesh>

            {/* Blue accent glow */}
            <pointLight position={[0, 4, -6]} intensity={4} color="#6095cc" distance={12} />
            <pointLight position={[5, 2.5, -5]} intensity={5} color="#ffd8b0" distance={8} />

            <Card pos={[8, 3.5, -2]} title="Spatial AI" body="Design homes using natural language. Our spatial intelligence engine translates intent into architecture." icon={Layers} accent="#60a5fa" show={show} />
        </group>
    )
}

// ─── 3. LIVING ROOM ──────────────────────────────────────────────────────────
function LivingRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, 8]}>
            {/* Sage green accent wall (left side feature wall) */}
            <mesh position={[-13.9, 3.25, 0]}>
                <boxGeometry args={[0.12, 6.5, 20]} />
                <meshStandardMaterial color={WALL.living} roughness={0.88} />
            </mesh>

            {/* Horizontal wall slats (architectural texture on accent wall) */}
            {Array.from({ length: 10 }, (_, i) => (
                <mesh key={i} position={[-13.75, 0.5 + i * 0.55, -1]} >
                    <boxGeometry args={[0.04, 0.08, 14]} />
                    <meshStandardMaterial color="#a8b5a0" roughness={0.7} />
                </mesh>
            ))}

            {/* Architectural Partition (wood slat) */}
            <mesh position={[-6, 3.25, -5]}>
                <boxGeometry args={[0.2, 6.5, 4]} />
                <meshStandardMaterial color={WALL.accentWood} roughness={0.4} />
            </mesh>

            {/* Sofa */}
            <mesh position={[-5, 0.4, 0]} castShadow receiveShadow>
                <boxGeometry args={[7, 0.8, 3]} />
                <meshStandardMaterial color={WALL.furniture} roughness={1} />
            </mesh>
            <mesh position={[-5, 1, 1.4]} castShadow>
                <boxGeometry args={[7, 1.2, 0.3]} />
                <meshStandardMaterial color={WALL.furniture} roughness={1} />
            </mesh>

            {/* Coffee table */}
            <mesh position={[-5, 0.45, -3]}>
                <boxGeometry args={[3, 0.1, 1.5]} />
                <meshStandardMaterial color={WALL.accentWood} roughness={0.35} metalness={0.05} />
            </mesh>

            {/* TV / Media panel */}
            <mesh position={[13.9, 3.25, 0]}>
                <boxGeometry args={[0.2, 4, 8]} />
                <meshStandardMaterial color="#12181f" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Sage accent ambient glow */}
            <pointLight position={[-13, 3, 0]} intensity={3} color="#a8c8a0" distance={10} />
            <pointLight position={[0, 4.5, 0]} intensity={3} color="#f0ece8" distance={12} />

            <Card pos={[10, 4, 2]} title="Parametric Engine" body="Experience sub-millimeter precision. Every design change instantly updates structural logic and BOM." icon={Zap} accent="#a78bfa" show={show} />
            <Card pos={[-10, 4, -4]} title="Visual Fidelity" body="Real-time physically accurate rendering. What you see is exactly what will be built." icon={Bot} accent="#818cf8" show={show} />
        </group>
    )
}

// ─── 4. KITCHEN ──────────────────────────────────────────────────────────────
function KitchenRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, -8]}>
            {/* Warm limestone feature wall (back) */}
            <mesh position={[13.85, 3.25, 0]}>
                <boxGeometry args={[0.12, 6.5, 20]} />
                <meshStandardMaterial color={WALL.kitchen} roughness={0.92} />
            </mesh>

            {/* Tile backsplash hint (grid pattern mesh) */}
            {Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 12 }, (_, col) => (
                    <mesh key={`${row}-${col}`} position={[13.85 - 0.06, 1.2 + row * 0.26, -5 + col * 0.8]}>
                        <boxGeometry args={[0.02, 0.24, 0.74]} />
                        <meshStandardMaterial color="#e8ddd0" roughness={0.3} metalness={0.05} />
                    </mesh>
                ))
            ).flat()}

            {/* Island */}
            <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
                <boxGeometry args={[6, 2.1, 2.5]} />
                <meshStandardMaterial color="#1c2635" roughness={0.25} metalness={0.1} />
            </mesh>
            {/* Countertop */}
            <mesh position={[0, 2.15, 0]}>
                <boxGeometry args={[6.2, 0.1, 2.7]} />
                <meshStandardMaterial color={WALL.accentWood} roughness={0.18} metalness={0.08} />
            </mesh>

            {/* Back Cabinets */}
            <mesh position={[13.8, 3, 0]}>
                <boxGeometry args={[0.4, 6, 12]} />
                <meshStandardMaterial color="#f2ede8" roughness={0.6} />
            </mesh>

            {/* Pendant lights */}
            {([-1.5, 0, 1.5] as number[]).map((x, i) => (
                <group key={i}>
                    <mesh position={[x, 4.5, 0]}>
                        <boxGeometry args={[0.02, 4, 0.02]} />
                        <meshStandardMaterial color={DARK_FRAME} />
                    </mesh>
                    <mesh position={[x, 3, 0]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffeecc" emissiveIntensity={6} />
                    </mesh>
                    <pointLight position={[x, 3, 0]} intensity={10} distance={6} color="#ffd090" />
                </group>
            ))}

            {/* Warm ambient kitchen light */}
            <pointLight position={[0, 5, 0]} intensity={3} color="#ffecd8" distance={14} />

            <Card pos={[-8, 4, 0]} title="Energy Simulation" body="Real-time thermal analysis ensures peak efficiency and passive-first design." icon={Zap} accent="#fbbf24" show={show} />
            <Card pos={[8, 4, -4]} title="Supply Chain" body="Live cost tracking synced with global suppliers for instant financial projections." icon={Ruler} accent="#34d399" show={show} />
        </group>
    )
}

// ─── 5. BEDROOM ──────────────────────────────────────────────────────────────
function BedroomRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, -24]}>
            {/* Soft lavender-grey feature wall (headboard side) */}
            <mesh position={[8, 3.25, -4]}>
                <boxGeometry args={[0.12, 6.5, 20]} />
                <meshStandardMaterial color={WALL.bedroom} roughness={0.9} />
            </mesh>

            {/* Fluted panel texture on feature wall */}
            {Array.from({ length: 14 }, (_, i) => (
                <mesh key={i} position={[8.07, 3.25, -9 + i * 1.1]}>
                    <boxGeometry args={[0.08, 6.5, 0.85]} />
                    <meshStandardMaterial color="#c8c0cb" roughness={0.88} />
                </mesh>
            ))}

            {/* King Bed */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
                    <boxGeometry args={[6, 0.6, 7]} />
                    <meshStandardMaterial color={WALL.furniture} roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[5.8, 0.4, 6.8]} />
                    <meshStandardMaterial color="#f4f0f8" roughness={1} />
                </mesh>
                <mesh position={[0, 1.2, -3.4]} castShadow>
                    <boxGeometry args={[6, 2, 0.2]} />
                    <meshStandardMaterial color={WALL.accentWood} roughness={0.6} />
                </mesh>
            </group>

            {/* Bedside pendant lights */}
            <pointLight position={[-4, 3, -1]} intensity={6} color="#ffd8c8" distance={6} />
            <pointLight position={[4, 3, -1]} intensity={6} color="#ffd8c8" distance={6} />
            {/* Lavender accent */}
            <pointLight position={[7, 4, -4]} intensity={3} color="#c8a8e8" distance={8} />

            <Card pos={[-8, 4, -2]} title="BIM Mastery" body="Full architectural data availability. Export native IFC and RVT files with one click from our cloud engine." icon={ShieldCheck} accent="#a78bfa" show={show} />
            <Card pos={[8, 4, 2]} title="Eco Integration" body="Automated solar gain and natural ventilation modeling for net-zero ready designs built-in." icon={Wind} accent="#34d399" show={show} />
        </group>
    )
}

// ─── 6. WORKSPACE ────────────────────────────────────────────────────────────
function WorkspaceRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, -40]}>
            {/* Deep navy accent wall — behind desk */}
            <mesh position={[0, 3.25, -2.5]}>
                <boxGeometry args={[28, 6.5, 0.12]} />
                <meshStandardMaterial color={WALL.workspace} roughness={0.2} metalness={0.15} />
            </mesh>

            {/* Perforated metal look panel */}
            {Array.from({ length: 6 }, (_, col) => (
                <mesh key={col} position={[-6 + col * 2.4, 3.25, -2.3]}>
                    <boxGeometry args={[2.2, 6.5, 0.04]} />
                    <meshStandardMaterial color="#1a2740" roughness={0.1} metalness={0.3} />
                </mesh>
            ))}

            {/* Dark Wood Desk */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 0.05, 3]} />
                <meshStandardMaterial color="#0c1520" roughness={0.18} metalness={0.1} />
            </mesh>

            {/* Floating display */}
            <mesh position={[0, 2.5, -1.8]}>
                <boxGeometry args={[12, 4, 0.1]} />
                <meshStandardMaterial color="#000000" metalness={0.85} roughness={0.08} />
            </mesh>
            {/* Screen glow */}
            <rectAreaLight position={[0, 2.5, -1.6]} rotation={[0, 0, 0]} width={11} height={3.5} intensity={6} color="#1e6fff" />

            {/* Cool blue desk accent */}
            <pointLight position={[0, 2, 0]} intensity={4} color="#5090ff" distance={10} />

            <Card pos={[-8, 4, 2]} title="Project Command" body="Manage budgets, timelines, and collaboration directly within your unified 3D walkthrough environment." icon={FolderKanban} accent="#8b5cf6" show={show} />
            <Card pos={[8, 4, -2]} title="Compliance" body="Automated building code validation and structural integrity checks performed in real-time as you build." icon={Activity} accent="#fbbf24" show={show} />
        </group>
    )
}

// ─── 7. TERRACE ──────────────────────────────────────────────────────────────
function TerraceRoom({ show }: { show: boolean }) {
    return (
        <group position={[0, 0, -55]}>
            {/* Sky mist open back wall suggesting sky */}
            <mesh position={[0, 3.25, -12]}>
                <boxGeometry args={[28, 6.5, 0.12]} />
                <meshStandardMaterial color={WALL.terrace} roughness={0.8} />
            </mesh>

            {/* Open Sky light */}
            <rectAreaLight position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} width={20} height={20} intensity={5} color="#d8eeff" />

            {/* Horizontal louvres — terrace privacy screen */}
            {Array.from({ length: 10 }, (_, i) => (
                <mesh key={i} position={[-14, 2.5 + i * 0.32, -10]}>
                    <boxGeometry args={[0.08, 0.08, 28]} />
                    <meshStandardMaterial color="#9db5c8" roughness={0.6} metalness={0.2} />
                </mesh>
            ))}

            {/* Glass Railing */}
            <mesh position={[0, 0.6, -10]} castShadow>
                <boxGeometry args={[28, 1.2, 0.1]} />
                <meshPhysicalMaterial {...GLASS_PROPS} />
            </mesh>

            {/* Outdoor seating */}
            <mesh position={[0, 0.2, -5]} castShadow receiveShadow>
                <boxGeometry args={[10, 0.4, 5]} />
                <meshStandardMaterial color="#2c3a48" roughness={1} />
            </mesh>

            {/* Sky ambient */}
            <pointLight position={[0, 5, -6]} intensity={4} color="#a8d8f8" distance={20} />

            <Card pos={[-10, 3.5, -5]} title="Global Access" body="Collaborate with architects and engineering teams globally in one unified, real-time 5D environment." icon={Users} accent="#60a5fa" show={show} />
            <Card pos={[10, 3.5, -8]} title="The Future" body="BuildVisor is redefining the relationship between digital design and physical construction. Start your journey today." icon={Compass} accent="#34d399" show={show} />
        </group>
    )
}

// ─── GLOBAL LIGHTING ──────────────────────────────────────────────────────────
function GlobalLighting() {
    return (
        <>
            <Environment preset="apartment" />
            <ambientLight intensity={0.25} color="#e8edf5" />
            <directionalLight
                position={[8, 18, 14]}
                intensity={1.1}
                castShadow
                shadow-mapSize={[2048, 2048]}
                color="#fff8f0"
            >
                <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 0.5, 100]} />
            </directionalLight>
            {/* Cool fill light */}
            <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#c8d8f0" />
            <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={100} blur={3} far={10} color="#000000" />
        </>
    )
}

// ─── CAMERA RIG ───────────────────────────────────────────────────────────────
function CameraRig({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const { camera } = useThree()
    const curve = useMemo(() => new THREE.CatmullRomCurve3(WAYPOINTS, false, 'centripetal', 0.5), [])
    const lookCurve = useMemo(() => new THREE.CatmullRomCurve3(LOOKAT, false, 'centripetal', 0.5), [])
    const smoothT = useRef(0)
    const pos = useMemo(() => new THREE.Vector3(), [])
    const look = useMemo(() => new THREE.Vector3(), [])
    const quat = useMemo(() => new THREE.Quaternion(), [])
    const mat = useMemo(() => new THREE.Matrix4(), [])

    useFrame((_, delta) => {
        smoothT.current = THREE.MathUtils.lerp(smoothT.current, scrollT.current, Math.min(delta * 2.0, 1))
        const t = THREE.MathUtils.clamp(smoothT.current, 0, 1)

        curve.getPointAt(t, pos)
        lookCurve.getPointAt(t, look)

        camera.position.lerp(pos, 0.15)
        mat.lookAt(camera.position, look, camera.up)
        quat.setFromRotationMatrix(mat)
        camera.quaternion.slerp(quat, 0.12)
    })

    return null
}

// ─── ROOM VISIBILITY TRACKER ──────────────────────────────────────────────────
function useRoomVisibility(scrollT: React.MutableRefObject<number>, roomIndex: number, start: number, end: number) {
    const [show, setShow] = useState(false)
    useFrame(() => {
        const t = scrollT.current
        const v = t >= Math.max(0, start - 0.05) && t <= Math.min(1, end + 0.05)
        setShow(prev => prev !== v ? v : prev)
    })
    return show
}

// ─── MAIN SCENE ───────────────────────────────────────────────────────────────
function HomeScene({ scrollT }: { scrollT: React.MutableRefObject<number> }) {
    const showEntrance = useRoomVisibility(scrollT, 0, 0, 0.2)
    const showLiving = useRoomVisibility(scrollT, 1, 0.15, 0.35)
    const showKitchen = useRoomVisibility(scrollT, 2, 0.3, 0.55)
    const showBedroom = useRoomVisibility(scrollT, 3, 0.5, 0.75)
    const showWork = useRoomVisibility(scrollT, 4, 0.7, 0.9)
    const showTerrace = useRoomVisibility(scrollT, 5, 0.85, 1)

    return (
        <>
            {/* Set a base background color to avoid pure black/blank if Environment fails */}
            <color attach="background" args={['#050810']} />

            <PerspectiveCamera
                makeDefault
                fov={62}
                near={0.1}
                far={200}
                position={WAYPOINTS[0].toArray()}
            />
            <CameraRig scrollT={scrollT} />
            <GlobalLighting />

            {/* Controlled fog for depth */}
            <fog attach="fog" args={['#050810', 30, 110]} />

            {/* Complete house structure */}
            <HouseShell scrollT={scrollT} />

            {/* Rooms */}
            <EntranceRoom show={showEntrance} />
            <LivingRoom show={showLiving} />
            <KitchenRoom show={showKitchen} />
            <BedroomRoom show={showBedroom} />
            <WorkspaceRoom show={showWork} />
            <TerraceRoom show={showTerrace} />

            <AdaptiveDpr pixelated={false} />
            <AdaptiveEvents />
            {/* Limit Preload to essential bits to avoid hanging 3D on slow connections */}
            <Preload all={false} />
        </>
    )
}

export default HomeScene
