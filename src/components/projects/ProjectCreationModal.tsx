'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, AlertCircle, CheckCircle2, Layout, MapPin, DollarSign, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { validateProjectName } from '@/lib/validation'
import { useBuildingStore } from '@/store/buildingStore'
import { useRouter } from 'next/navigation'

interface ProjectCreationModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectCreationModal({ isOpen, onClose }: ProjectCreationModalProps) {
    const [name, setName] = useState('')
    const [type, setType] = useState('Villa')
    const [location, setLocation] = useState('')
    const [budget, setBudget] = useState('')
    const [units, setUnits] = useState('1')

    const [error, setError] = useState<string | null>(null)
    const [isValid, setIsValid] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { saveProject } = useBuildingStore()
    const router = useRouter()

    useEffect(() => {
        if (!name) {
            setError(null)
            setIsValid(false)
            return
        }

        const result = validateProjectName(name)
        if (result.isValid) {
            setError(null)
            setIsValid(true)
        } else {
            setError(result.error || 'Invalid name')
            setIsValid(false)
        }
    }, [name])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isValid) return

        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        saveProject(name)
        setIsSubmitting(false)
        onClose()
        router.push('/build')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Layout className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Create New Project</h3>
                            <p className="text-slate-500 text-sm">Define your architectural vision.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-slate-500 group-hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Name</label>
                        <div className="relative">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. seaside-contemporary-villa"
                                className={`bg-white/[0.03] border-white/10 focus:ring-blue-500/50 pr-10 text-white ${error ? 'border-red-500/50' : isValid ? 'border-emerald-500/50' : ''}`}
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {error && <AlertCircle className="w-4 h-4 text-red-500" />}
                                {isValid && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                        </div>
                        {error && <p className="text-[10px] text-red-400">{error}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            >
                                <option value="Villa">Villa</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Office">Office</option>
                                <option value="Retail">Retail</option>
                            </select>
                        </div>

                        {/* Units */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Units</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    type="number"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    className="bg-white/[0.03] border-white/10 pl-10 text-white"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Bangalore, KA"
                                className="bg-white/[0.03] border-white/10 pl-10 text-white"
                            />
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estimated Budget</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="e.g. 85,00,000"
                                className="bg-white/[0.03] border-white/10 pl-10 text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-white/10 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
