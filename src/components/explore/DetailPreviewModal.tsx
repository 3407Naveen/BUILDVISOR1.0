'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Box, Ruler, IndianRupee, Zap, ArrowRight, Layers } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface DetailPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    design: {
        title: string
        style: string
        floors: number
        area: number
        cost: string
        image: string
        prompt: string
    } | null
}

export function DetailPreviewModal({ isOpen, onClose, design }: DetailPreviewModalProps) {
    const router = useRouter()
    if (!design) return null

    const handleStartBuilding = () => {
        router.push(`/build?prompt=${encodeURIComponent(design.prompt)}`)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section */}
                        <div className="md:w-3/5 relative h-64 md:h-auto bg-slate-900">
                            <Image
                                src={design.image}
                                alt={design.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="md:w-2/5 p-8 flex flex-col overflow-y-auto">
                            <div className="mb-8">
                                <span className="px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider mb-4 inline-block">
                                    {design.style} Architecture
                                </span>
                                <h2 className="text-3xl font-bold text-white mb-2">{design.title}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed font-light">
                                    {design.prompt}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <StatItem icon={Box} label="Floors" value={`${design.floors} Storey`} />
                                <StatItem icon={Ruler} label="Total Area" value={`${design.area} sqft`} />
                                <StatItem icon={IndianRupee} label="Est. Cost" value={design.cost} color="text-emerald-400" />
                                <StatItem icon={Layers} label="Readiness" value="Ready to Build" />
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                <FeatureItem icon={Zap} text="AI Optimized Structural Integrity" />
                                <FeatureItem icon={Zap} text="Sustainable Material Certification" />
                            </div>

                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={handleStartBuilding}
                                    className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Start Building Design
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleStartBuilding}
                                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all active:scale-[0.98]"
                                >
                                    Simulate Full Cost
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

function StatItem({ icon: Icon, label, value, color = "text-white" }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                <Icon className="w-3 h-3" />
                {label}
            </div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
        </div>
    )
}

function FeatureItem({ icon: Icon, text }: any) {
    return (
        <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Icon className="w-3 h-3" />
            </div>
            {text}
        </div>
    )
}
