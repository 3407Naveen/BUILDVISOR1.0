'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowUpRight, Box, Ruler, IndianRupee, Eye } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DesignProps {
    title: string
    style: string
    floors: number
    area: number
    cost: string
    image: string
    prompt?: string
    delay: number
    onClick?: () => void
}

export function ExploreCard({ title, style, floors, area, cost, image, prompt, delay, onClick }: DesignProps) {
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: delay * 0.05 }}
            onClick={onClick}
            className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all hover:shadow-[0_0_40px_rgba(37,99,235,0.1)] cursor-pointer"
        >
            {/* Image / Preview */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                {/* Main Render */}
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoadingComplete={() => setImageLoaded(true)}
                />

                {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                        <Box className="w-8 h-8 text-slate-700" />
                    </div>
                )}

                {/* Floating Tag */}
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] uppercase font-bold tracking-wider text-white">
                    {style}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
                        className={`p-2 rounded-full backdrop-blur transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    <button className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{title}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {floors} Floors</span>
                    <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {area} sqft</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                        <div className="text-[10px] uppercase text-slate-500 tracking-wider">Est. Cost</div>
                        <div className="text-sm font-semibold text-emerald-400 flex items-center">
                            <IndianRupee className="w-3 h-3 mr-0.5" />
                            {cost}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const detailPrompt = prompt || `${title}, ${style} style, ${floors} floors, ${area} sqft area`
                            router.push(`/build?prompt=${encodeURIComponent(detailPrompt)}`)
                        }}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-blue-600 hover:border-blue-500 text-xs font-bold text-white transition-all border border-white/5"
                    >
                        Simulate
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
