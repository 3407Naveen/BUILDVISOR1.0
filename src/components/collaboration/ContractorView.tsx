'use client'

import { motion } from 'framer-motion'
import { Truck, HardHat, Calendar, FileText, Clock, CheckCircle2, AlertTriangle, Package, Users, DollarSign, ArrowRight } from 'lucide-react'

const deliveries = [
    { id: 'd1', material: 'Steel Rebar (Fe550)', qty: '12 Tons', vendor: 'SteelMax Industries', status: 'In Transit', eta: 'Mar 5', progress: 65 },
    { id: 'd2', material: 'Concrete (M25)', qty: '450 m³', vendor: 'ReadyMix Concrete Co', status: 'Scheduled', eta: 'Mar 8', progress: 0 },
    { id: 'd3', material: 'Red Clay Bricks', qty: '25,000 pcs', vendor: 'Chennai Bricks', status: 'Delivered', eta: 'Feb 18', progress: 100 },
    { id: 'd4', material: 'Exterior Glazing', qty: '120 m²', vendor: 'Saint-Gobain Glass', status: 'Processing', eta: 'Mar 15', progress: 30 },
]

const phases = [
    { name: 'Site Preparation', progress: 100, status: 'complete', duration: '2 weeks' },
    { name: 'Foundation', progress: 85, status: 'active', duration: '4 weeks' },
    { name: 'Structural Frame', progress: 0, status: 'upcoming', duration: '6 weeks' },
    { name: 'MEP Rough-In', progress: 0, status: 'upcoming', duration: '3 weeks' },
    { name: 'Interior Finish', progress: 0, status: 'upcoming', duration: '5 weeks' },
]

const workforce = [
    { role: 'Mason', count: 8, shift: 'Day', status: 'active' },
    { role: 'Steel Fitter', count: 4, shift: 'Day', status: 'active' },
    { role: 'Carpenter', count: 3, shift: 'Day', status: 'standby' },
    { role: 'Electrician', count: 2, shift: 'Day', status: 'standby' },
    { role: 'Plumber', count: 2, shift: 'Day', status: 'scheduled' },
]

const invoices = [
    { id: 'INV-001', description: 'Foundation excavation & PCC', amount: '₹4.2L', status: 'Paid', date: 'Feb 10' },
    { id: 'INV-002', description: 'Steel rebar batch 1', amount: '₹7.8L', status: 'Pending', date: 'Feb 18' },
    { id: 'INV-003', description: 'Concrete supply (M25)', amount: '₹6.5L', status: 'Draft', date: 'Feb 20' },
]

const statusColors: Record<string, string> = {
    'In Transit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Scheduled': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Draft': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

export function ContractorView() {
    return (
        <div className="space-y-6">
            {/* Material Delivery Tracking */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
            >
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                            <Truck className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">Material Delivery Tracking</h3>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {deliveries.map(d => (
                        <div key={d.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-sm font-semibold text-white">{d.material}</div>
                                    <div className="text-[10px] text-slate-500">{d.vendor} · {d.qty}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[d.status]}`}>{d.status}</span>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />ETA {d.eta}</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${d.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                    style={{ width: `${d.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Construction Phase Monitor */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
            >
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                            <HardHat className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">Construction Phases</h3>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {phases.map((phase, i) => (
                        <div key={phase.name} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${phase.status === 'complete' ? 'bg-emerald-500/10 text-emerald-400' : phase.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-slate-600'}`}>
                                {phase.status === 'complete' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-medium ${phase.status === 'active' ? 'text-white' : phase.status === 'complete' ? 'text-slate-400' : 'text-slate-500'}`}>{phase.name}</span>
                                    <span className="text-[10px] text-slate-500">{phase.duration}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${phase.status === 'complete' ? 'bg-emerald-500' : phase.status === 'active' ? 'bg-blue-500' : 'bg-transparent'}`}
                                        style={{ width: `${phase.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Workforce Scheduling */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
                >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg">
                                <Users className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Workforce Schedule</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {workforce.map(w => (
                            <div key={w.role} className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-white font-medium">{w.role}</span>
                                    <span className="text-[10px] text-slate-500">×{w.count}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${w.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : w.status === 'standby' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                    {w.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Invoice Submission */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
                >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                    <FileText className="w-4 h-4 text-amber-400" />
                                </div>
                                <h3 className="font-bold text-white text-sm">Invoices</h3>
                            </div>
                            <button className="px-3 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all">
                                + Submit New
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {invoices.map(inv => (
                            <div key={inv.id} className="p-3 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-slate-400">{inv.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[inv.status]}`}>{inv.status}</span>
                                </div>
                                <div className="text-sm text-white font-medium">{inv.description}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-emerald-400 font-bold">{inv.amount}</span>
                                    <span className="text-[10px] text-slate-500">{inv.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
