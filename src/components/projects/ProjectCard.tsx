'use client'

import { MoreHorizontal, Box, Calendar, DollarSign, ArrowUpRight, Sparkles, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface ProjectProps {
    id: number
    title: string
    status: 'Draft' | 'Simulated' | 'In Construction'
    lastEdited: string
    cost: string
    image: string
    delay: number
    prompt: string
    confidence?: number
    version?: string
}

const statusColors = {
    Draft: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
    Simulated: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    'In Construction': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
}

export function ProjectCard({ title, status, lastEdited, cost, image, delay, prompt, confidence, version }: ProjectProps) {
    const router = useRouter()

    const handleOpen = () => {
        router.push(`/build?prompt=${encodeURIComponent(prompt)}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.05 }}
            className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all hover:bg-white/[0.02]"
        >
            <div className="flex flex-col md:flex-row gap-4 p-4 items-center">

                {/* Thumbnail */}
                <div className="w-full md:w-32 h-24 bg-slate-900 rounded-lg shrink-0 overflow-hidden relative group-hover:shadow-lg transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="h-full w-full flex items-center justify-center text-slate-700">
                        <Box className="w-8 h-8" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-lg truncate group-hover:text-blue-400 transition-colors">{title}</h3>
                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${statusColors[status]}`}>
                            {status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{lastEdited}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{cost}</span>
                        </div>
                        {confidence && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20 w-fit">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] font-bold text-blue-400">{confidence}% Match</span>
                            </div>
                        )}
                        {version && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <Tag className="w-3 h-3" />
                                <span className="text-[10px] font-medium">{version}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 md:border-l md:pl-4 justify-end">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleOpen}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Open
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </motion.div>
    )
}
