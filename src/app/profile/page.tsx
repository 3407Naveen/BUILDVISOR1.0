'use client'

import { motion } from 'framer-motion'
import {
    User, Mail, Building, CreditCard, Shield, MapPin, Edit3,
    Award, Briefcase, Code, Activity, Github, Linkedin,
    ExternalLink, Cpu, Star, TrendingUp, CheckCircle2
} from 'lucide-react'

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
                        <p className="text-slate-400">Manage your professional identity and architectural preferences.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Identity & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />

                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl">
                                    NS
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-black border-4 border-[#0a0a0a] rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-1">Naveen S</h2>
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">Pro Architect</span>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">Verified</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Experience</p>
                                    <p className="text-lg font-bold">8+ Years</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Projects</p>
                                    <p className="text-lg font-bold">42 Total</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Professional Network</h3>
                            <a href="#" className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Linkedin className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-medium">LinkedIn</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                            </a>
                            <a href="#" className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Github className="w-5 h-5 text-white" />
                                    <span className="text-sm font-medium">GitHub</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Bio, Skills & Detailed Sections */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Bio / About */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                            <h3 className="font-bold text-xl flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-blue-400" />
                                Professional Biography
                            </h3>
                            <p className="text-slate-400 leading-relaxed italic">
                                "Senior Architectural Designer with a focus on sustainable residential projects and urban integration.
                                Leveraging AI-driven modeling to optimize structural integrity and material efficiency.
                                Committed to delivering premium, code-compliant designs that push the boundaries of modern living."
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> Primary Contact
                                    </div>
                                    <div className="text-sm font-medium">naveen@buildvisor.com</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <Building className="w-3.5 h-3.5" /> Studio
                                    </div>
                                    <div className="text-sm font-medium">BuildVisor Prime</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> Base
                                    </div>
                                    <div className="text-sm font-medium">Bangalore, IN</div>
                                </div>
                            </div>
                        </div>

                        {/* Skill Matrix */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-xl flex items-center gap-3">
                                    <Cpu className="w-6 h-6 text-purple-400" />
                                    Software & Skill Matrix
                                </h3>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5" /> Live Performance
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { name: 'Revit / BIM modeling', level: 95, color: 'bg-blue-500' },
                                    { name: 'Three.js / WebRender', level: 88, color: 'bg-purple-500' },
                                    { name: 'Sustainable Analysis', level: 82, color: 'bg-emerald-500' },
                                    { name: 'Project Coordination', level: 90, color: 'bg-amber-500' }
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-slate-200">{skill.name}</span>
                                            <span className="font-bold">{skill.level}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full ${skill.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Awards & Accreditation */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                            <h3 className="font-bold text-xl flex items-center gap-3 mb-6">
                                <Award className="w-6 h-6 text-amber-400" />
                                Certifications & Awards
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'LEED Accredited Professional', issuer: 'USGBC', year: '2025' },
                                    { title: 'Excellence in Modular Design', issuer: 'BuildVisor Council', year: '2024' }
                                ].map((cert, i) => (
                                    <div key={i} className="flex items-center border border-white/5 bg-white/[0.02] p-4 rounded-2xl gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                            <Star className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-100">{cert.title}</p>
                                            <p className="text-xs text-slate-500">{cert.issuer} • {cert.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
