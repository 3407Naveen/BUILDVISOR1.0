'use client'

import { DashboardStats } from '@/components/projects/DashboardStats'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Plus, Filter, Upload, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadWizard } from '@/components/projects/UploadWizard'
import { ProjectCreationModal } from '@/components/projects/ProjectCreationModal'
import { FilterDropdown } from '@/components/projects/FilterDropdown'
import { useState, useMemo } from 'react'
import { useBuildingStore } from '@/store/buildingStore'

const initialProjects = [
    { id: 0, title: 'Generated Villa (Plan v1.0)', status: 'Draft' as const, lastEdited: 'Just now', cost: '₹18.4L', image: '', prompt: 'Modern villa generated from 2D plan', confidence: 94, version: 'Generated from 2D Plan v1.0' },
    { id: 1, title: 'Large modern villa', status: 'In Construction' as const, lastEdited: '2 hours ago', cost: '₹85L', image: '', prompt: 'Large modern villa with white concrete walls, vast floor-to-ceiling glass windows, flat roof.' },
    { id: 2, title: 'L-shaped brick estate', status: 'Simulated' as const, lastEdited: '5 hours ago', cost: '₹65L', image: '', prompt: 'L-shaped industrial estate with exposed red brick walls, black metal frames, warehouse-style windows.' },
    { id: 3, title: 'Sprawling ranch complex', status: 'Draft' as const, lastEdited: '1 day ago', cost: '₹45L', image: '', prompt: 'Minimalist sprawling ranch house, light grey stone cladding, flat overhanging roof.' },
    { id: 4, title: 'Classic brick cottage', status: 'Simulated' as const, lastEdited: '2 days ago', cost: '₹95L', image: '', prompt: 'Classic brick cottage with gable roof, dark wooden beams, arched windows.' },
    { id: 5, title: 'Sustainable timber home', status: 'In Construction' as const, lastEdited: '3 days ago', cost: '₹55L', image: '', prompt: 'Sustainable timber home with solar panels, wooden slat facade, green living roof.' },
    { id: 6, title: 'Brutalist concrete box', status: 'Simulated' as const, lastEdited: '1 week ago', cost: '₹1.2Cr', image: '', prompt: 'Brutalist concrete home, bold geometric shapes, raw cement texture.' },
    { id: 7, title: 'Modern glass home', status: 'Draft' as const, lastEdited: '1 week ago', cost: '₹1.5Cr', image: '', prompt: 'Modern glass home, black steel frame, surrounded by forest.' },
    { id: 8, title: 'Industrial stone warehouse', status: 'Simulated' as const, lastEdited: '2 weeks ago', cost: '₹25L', image: '', prompt: 'Industrial stone warehouse luxury conversion, large black arched windows.' },
    { id: 9, title: 'Minimalist concrete box', status: 'Draft' as const, lastEdited: '3 weeks ago', cost: '₹75L', image: '', prompt: 'Minimalist concrete box home, square proportions, large architectural cutout.' },
]

export default function ProjectsPage() {
    const [isUploadWizardOpen, setIsUploadWizardOpen] = useState(false)
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const [activeFilters, setActiveFilters] = useState({
        status: 'All',
        budget: 'All',
        date: 'All'
    })

    const { projects: storedProjects } = useBuildingStore()

    const allProjects = useMemo(() => {
        // Transform stored projects to match the UI interface if needed
        const mappedStored = storedProjects.map(p => ({
            id: parseInt(p.id, 36),
            title: p.name,
            status: 'Draft' as const, // Default for new
            lastEdited: 'Just now',
            cost: '₹0L',
            image: '',
            prompt: 'Custom project',
        }))
        return [...mappedStored, ...initialProjects]
    }, [storedProjects])

    const filteredProjects = useMemo(() => {
        return allProjects.filter(p => {
            if (activeFilters.status !== 'All' && p.status !== activeFilters.status) return false
            // Simplified budget filtering for demo
            if (activeFilters.budget !== 'All') {
                if (activeFilters.budget === '< ₹25L' && !p.cost.includes('L')) return false
                if (activeFilters.budget === '> ₹1.5Cr' && !p.cost.includes('Cr')) return false
            }
            return true
        })
    }, [allProjects, activeFilters])

    const handleFilterChange = (type: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [type]: value }))
    }

    const resetFilters = () => {
        setActiveFilters({ status: 'All', budget: 'All', date: 'All' })
    }

    return (
        <div className={`min-h-screen bg-black text-white pt-24 px-6 pb-20 ${(isUploadWizardOpen || isNewProjectModalOpen) ? 'overflow-hidden max-h-screen' : ''}`}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">My Projects</h1>
                        <p className="text-slate-400 text-sm">Manage your designs and construction progress.</p>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border rounded-lg text-sm transition-all ${isFilterOpen ? 'border-blue-500/50 text-white' : 'border-white/5 text-slate-300'}`}
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                                {Object.values(activeFilters).some(v => v !== 'All') && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <FilterDropdown
                                        isOpen={isFilterOpen}
                                        onClose={() => setIsFilterOpen(false)}
                                        activeFilters={activeFilters}
                                        onFilterChange={handleFilterChange}
                                        onReset={resetFilters}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setIsUploadWizardOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium text-white transition-all relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Upload className="w-4 h-4 text-blue-400" />
                            Upload 2D Plan
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md ml-1">
                                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                                <span className="text-[8px] font-bold uppercase tracking-tighter text-blue-400">AI</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setIsNewProjectModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 translate-z-0"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <DashboardStats />
                </motion.div>

                {/* Project List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 pl-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Activity</div>
                        {Object.values(activeFilters).some(v => v !== 'All') && (
                            <button onClick={resetFilters} className="text-[10px] font-bold text-blue-400 hover:underline">Clear all filters</button>
                        )}
                    </div>

                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={`${project.id}-${index}`}
                                delay={index}
                                {...project}
                            />
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mb-4">
                                <X className="w-8 h-8 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">No projects found</h3>
                            <p className="text-sm text-slate-500 max-w-xs">No projects match your current filter criteria. Try adjusting your selection.</p>
                            <button onClick={resetFilters} className="mt-4 text-sm font-bold text-blue-400 hover:text-blue-300">Reset Filters</button>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isUploadWizardOpen && (
                        <UploadWizard isOpen={isUploadWizardOpen} onClose={() => setIsUploadWizardOpen(false)} />
                    )}
                    {isNewProjectModalOpen && (
                        <ProjectCreationModal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
