'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    Compass,
    Hammer,
    FolderKanban,
    Activity,
    Users,
    Bot,
    Settings,
    User,
    Menu,
    X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Build', href: '/build', icon: Hammer },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Simulation', href: '/simulation', icon: Activity },
    { name: 'Collaboration', href: '/collaboration', icon: Users },
]

export function Navbar() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { toggleAssistant } = useUIStore()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 pointer-events-none transition-all duration-500 ${scrolled ? 'pt-4' : 'pt-6'}`}
            >
                <div className={`pointer-events-auto backdrop-blur-xl border transition-all duration-500 rounded-full flex items-center justify-between px-2 pr-2 pl-6
          ${scrolled
                        ? 'bg-black/60 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-5xl h-14'
                        : 'bg-transparent border-transparent w-full h-16'
                    }`}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group mr-8">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md group-hover:bg-blue-500/40 transition-all duration-500" />
                            <div className="relative w-8 h-8 bg-gradient-to-br from-slate-800 to-black border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                <span className="text-white font-bold text-sm">B</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className={`font-semibold tracking-tight transition-colors duration-300 ${scrolled ? 'text-white' : 'text-white'}`}>
                            BuildVisor
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 group overflow-hidden"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-bg"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <span className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {item.name}
                                    </span>

                                    {/* Hover Spotlight */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="flex-1" />

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleAssistant}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-full transition-all group"
                        >
                            <Bot className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium text-blue-300 hidden sm:block">AI Assistant</span>
                        </button>

                        <div className="w-px h-4 bg-white/10 hidden sm:block" />

                        <div className="hidden sm:flex items-center">
                            <Link href="/settings">
                                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
                            </Link>
                            <Link href="/profile">
                                <button className="p-2 text-slate-400 hover:text-white transition-colors"><User className="w-4 h-4" /></button>
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden flex flex-col pt-32 px-8"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-4 text-xl font-medium text-slate-300"
                                >
                                    <item.icon className="w-6 h-6" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
