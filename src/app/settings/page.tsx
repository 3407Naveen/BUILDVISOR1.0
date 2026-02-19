'use client'

import {
    Bell, Monitor, Globe, Moon, Save, Brain, HardDrive,
    Plug, ShieldCheck, Zap, Database, Smartphone,
    Lock, Eye, Languages, Layout
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [marketingNotifs, setMarketingNotifs] = useState(false)
    const [aiStrictness, setAiStrictness] = useState(70)

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Workspace Settings</h1>
                        <p className="text-slate-400">Configure global preferences, AI analysis engines, and resource allocations.</p>
                    </div>
                </div>

                <div className="space-y-8">

                    {/* Section: AI Analysis Engine */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-3 italic">
                                <Brain className="w-5 h-5 text-purple-400" />
                                AI Logic & Generation Preferences
                            </h3>
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase border border-purple-500/20">Veta-Core v4.2</span>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="font-bold text-slate-200">Compliance Strictness</div>
                                        <div className="text-sm text-slate-500">How strictly should AI follow local building codes (NBC/RERA).</div>
                                    </div>
                                    <span className="text-lg font-mono font-bold text-purple-400">{aiStrictness}%</span>
                                </div>
                                <input
                                    type="range"
                                    value={aiStrictness}
                                    onChange={(e) => setAiStrictness(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                                    <span>Creative Freedom</span>
                                    <span>Strict Compliance</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Cost Optimization</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Prioritize material efficiency</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                            <Database className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Live-Sync Cloud</div>
                                            <div className="text-[10px] text-slate-500 font-medium">Instant backup of 3D states</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Resource & Storage */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                            <h3 className="font-bold text-lg flex items-center gap-3 italic">
                                <HardDrive className="w-5 h-5 text-blue-400" />
                                Resource Allocation
                            </h3>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-400">Cloud Storage Usage</span>
                                <span className="text-sm font-bold text-white">12.4 GB / 100 GB</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/5 p-0.5">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full w-[12.4%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Models</p>
                                    <p className="text-lg font-bold">14 Total</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Datasets</p>
                                    <p className="text-lg font-bold">4.2 GB</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Renders</p>
                                    <p className="text-lg font-bold">2.8 GB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Localization & Units */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                            <h3 className="font-bold text-lg flex items-center gap-3 italic">
                                <Languages className="w-5 h-5 text-slate-400" />
                                Localization & System Units
                            </h3>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Base Currency</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <span className="font-bold text-xs">₹</span>
                                    </div>
                                    <select className="w-full bg-black border border-white/10 rounded-xl p-3 pl-8 text-sm focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer group-hover:bg-white/[0.02]">
                                        <option>Indian Rupee (INR)</option>
                                        <option>US Dollar (USD)</option>
                                        <option>Euro (EUR)</option>
                                        <option>Pound (GBP)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Unit Standards</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <Layout className="w-4 h-4" />
                                    </div>
                                    <select className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer group-hover:bg-white/[0.02]">
                                        <option>Metric (meters, mm)</option>
                                        <option>Imperial (feet, inches)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Third-Party Integrations */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                            <h3 className="font-bold text-lg flex items-center gap-3 italic">
                                <Plug className="w-5 h-5 text-amber-400" />
                                Professional Integrations
                            </h3>
                        </div>
                        <div className="p-8 grid sm:grid-cols-2 gap-4">
                            {[
                                { name: 'Autodesk BIM 360', status: 'Connected', icon: 'A' },
                                { name: 'SketchUp Cloud', status: 'Not Linked', icon: 'S' }
                            ].map((integ, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                            {integ.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{integ.name}</div>
                                            <div className={`text-[10px] font-bold uppercase ${integ.status === 'Connected' ? 'text-blue-400' : 'text-slate-500'}`}>{integ.status}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold hover:bg-white/10">{integ.status === 'Connected' ? 'Settings' : 'Link App'}</Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl">
                        <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                            <ShieldCheck className="w-4 h-4" />
                            Security Protocol: End-to-end encrypted
                        </div>
                        <button className="flex items-center gap-3 px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 active:scale-95 text-sm uppercase tracking-widest">
                            <Save className="w-5 h-5" /> Save Configuration
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
