'use client'

import { useState, useMemo } from 'react'
import { FilterBar } from '@/components/explore/FilterBar'
import { ExploreCard } from '@/components/explore/ExploreCard'
import { DetailPreviewModal } from '@/components/explore/DetailPreviewModal'
import { motion, AnimatePresence } from 'framer-motion'

const designs = [
    { id: 1, title: 'Large modern villa', style: 'Modern', floors: 2, area: 2400, cost: '85L', image: '/explore/modern_villa.png', prompt: 'Large modern villa with white concrete walls, vast floor-to-ceiling glass windows, flat roof.' },
    { id: 2, title: 'L-shaped brick estate', style: 'Industrial', floors: 3, area: 1800, cost: '65L', image: '/explore/industrial_estate.png', prompt: 'L-shaped industrial estate with exposed red brick walls, black metal frames, warehouse-style windows.' },
    { id: 3, title: 'Sprawling ranch complex', style: 'Minimalist', floors: 1, area: 1200, cost: '45L', image: '/explore/minimalist_ranch.png', prompt: 'Minimalist sprawling ranch house, light grey stone cladding, flat overhanging roof.' },
    { id: 4, title: 'Classic brick cottage', style: 'Traditional', floors: 1, area: 2800, cost: '95L', image: '/explore/traditional_cottage.png', prompt: 'Classic brick cottage with gable roof, dark wooden beams, arched windows.' },
    { id: 5, title: 'Sustainable timber home', style: 'Sustainable', floors: 2, area: 1500, cost: '55L', image: '/explore/sustainable_timber.png', prompt: 'Sustainable timber home with solar panels, wooden slat facade, green living roof.' },
    { id: 6, title: 'Brutalist concrete box', style: 'Brutalist', floors: 3, area: 3200, cost: '1.2Cr', image: '/explore/brutalist_concrete.png', prompt: 'Brutalist concrete home, bold geometric shapes, raw cement texture.' },
    { id: 7, title: 'Modern glass home', style: 'Modern', floors: 3, area: 4000, cost: '1.5Cr', image: '/explore/modern_villa.png', prompt: 'Modern glass home, black steel frame, surrounded by forest.' },
    { id: 8, title: 'Industrial stone warehouse', style: 'Industrial', floors: 1, area: 800, cost: '25L', image: '/explore/industrial_estate.png', prompt: 'Industrial stone warehouse luxury conversion, large black arched windows.' },
    { id: 9, title: 'Minimalist concrete box', style: 'Minimalist', floors: 2, area: 2100, cost: '75L', image: '/explore/brutalist_concrete.png', prompt: 'Minimalist concrete box home, square proportions, large architectural cutout.' },
]

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDesign, setSelectedDesign] = useState<any>(null)
    const [activeFilters, setActiveFilters] = useState({
        style: 'All',
        floors: 'All',
        budget: 'All'
    })

    const filteredDesigns = useMemo(() => {
        return designs.filter(design => {
            const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                design.style.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStyle = activeFilters.style === 'All' || design.style === activeFilters.style
            const matchesFloors = activeFilters.floors === 'All' ||
                (activeFilters.floors === '1 Storey' && design.floors === 1) ||
                (activeFilters.floors === '2 Storey' && design.floors === 2) ||
                (activeFilters.floors === 'Villa' && design.floors >= 3)

            // Simplified budget matching
            const matchesBudget = activeFilters.budget === 'All' // Add logic if needed

            return matchesSearch && matchesStyle && matchesFloors && matchesBudget
        })
    }, [searchQuery, activeFilters])

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-6 pb-20">

            {/* Modal */}
            <DetailPreviewModal
                isOpen={!!selectedDesign}
                onClose={() => setSelectedDesign(null)}
                design={selectedDesign}
            />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                >
                    Discover Architecture
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 max-w-2xl mx-auto text-lg font-light"
                >
                    Browse AI-generated designs and professional home templates.
                </motion.p>
            </div>

            {/* Filter Bar */}
            <div className="max-w-5xl mx-auto mb-12 sticky top-24 z-30 overflow-visible">
                <FilterBar
                    onSearchChange={setSearchQuery}
                    onFilterChange={(type, val) => setActiveFilters(prev => ({ ...prev, [type]: val }))}
                    activeFilters={activeFilters}
                />
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredDesigns.map((design, index) => (
                        <ExploreCard
                            key={design.id}
                            delay={index}
                            {...design}
                            onClick={() => setSelectedDesign(design)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredDesigns.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    No designs found matching your criteria.
                </div>
            )}

        </div>
    )
}
