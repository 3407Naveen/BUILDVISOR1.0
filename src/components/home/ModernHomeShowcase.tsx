'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Ruler, Maximize, Wind, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function ModernHomeShowcase() {
    return (
        <section className="relative w-full py-24 bg-black overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Visual Side */}
                    <div className="w-full lg:w-3/5">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
                        >
                            <Image
                                src="/explore/modern_villa.png"
                                alt="Modern Villa Design"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Glass Overlay Info */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-wrap justify-between items-center gap-4"
                                >
                                    <div className="flex gap-8">
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Total Area</span>
                                            <span className="text-white font-medium">3,450 SQFT</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Style</span>
                                            <span className="text-white font-medium">Contemporary Neutral</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Rating</span>
                                            <span className="text-white font-medium text-emerald-400">Platinum</span>
                                        </div>
                                    </div>

                                    <Link href="/build">
                                        <button className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors">
                                            View Layout <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Decorative architectural markers */}
                            <div className="absolute top-10 left-10 p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-2/5">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-blue-500 font-semibold tracking-widest uppercase text-xs mb-4 block">Design Showcase</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Signature <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 font-medium">Modern Residence</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-light leading-relaxed mb-10">
                                Experience architecture that breathes. Our signature modern designs prioritize natural light, structural integrity, and sustainable materials to create spaces that inspire.
                            </p>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Maximize className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm font-medium">Spatial Efficiency</span>
                                    </div>
                                    <p className="text-slate-500 text-xs leading-relaxed">Optimization of every square inch for maximum livability.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Wind className="w-5 h-5 text-emerald-400" />
                                        <span className="text-sm font-medium">Eco-Integration</span>
                                    </div>
                                    <p className="text-slate-500 text-xs leading-relaxed">Integrated passive cooling and natural ventilation systems.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Ruler className="w-5 h-5 text-orange-400" />
                                        <span className="text-sm font-medium">Precision Logic</span>
                                    </div>
                                    <p className="text-slate-500 text-xs leading-relaxed">Structural calculations executed with sub-millimeter accuracy.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                        <span className="text-sm font-medium">BIM Validated</span>
                                    </div>
                                    <p className="text-slate-500 text-xs leading-relaxed">Full Building Information Modeling data included with every design.</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <Link href="/explore">
                                    <button className="flex items-center gap-2 group text-white font-medium hover:text-blue-400 transition-colors">
                                        Explore More Collections
                                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
