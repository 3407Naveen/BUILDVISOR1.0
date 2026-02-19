'use client'

import { motion } from 'framer-motion'
import { Package, Clock, DollarSign, CheckCircle2, Truck, AlertCircle, FileText, ArrowRight } from 'lucide-react'

const purchaseRequests = [
    { id: 'PR-2024-041', material: 'Steel Rebar (Fe550)', qty: '12 Tons', requestedBy: 'ConstructCo', urgency: 'high', status: 'Approved', date: 'Feb 18' },
    { id: 'PR-2024-042', material: 'Ready Mix Concrete (M25)', qty: '450 m³', requestedBy: 'ConstructCo', urgency: 'medium', status: 'Pending', date: 'Feb 19' },
    { id: 'PR-2024-043', material: 'Exterior Glazing Panels', qty: '120 m²', requestedBy: 'Arjun Verma', urgency: 'low', status: 'Pending', date: 'Feb 20' },
    { id: 'PR-2024-044', material: 'Warm LED Downlights', qty: '48 units', requestedBy: 'Sarah Lee', urgency: 'low', status: 'New', date: 'Feb 21' },
]

const deliverySchedule = [
    { material: 'Steel Rebar (Fe550)', vendor: 'SteelMax Industries', deadline: 'Mar 5', daysLeft: 14, status: 'On Track' },
    { material: 'Red Clay Bricks', vendor: 'Chennai Bricks', deadline: 'Feb 28', daysLeft: 9, status: 'At Risk' },
    { material: 'Concrete (M25)', vendor: 'ReadyMix Co', deadline: 'Mar 8', daysLeft: 17, status: 'On Track' },
    { material: 'Plumbing Fixtures', vendor: 'Jaquar India', deadline: 'Mar 20', daysLeft: 29, status: 'Confirmed' },
]

const payments = [
    { id: 'PAY-001', vendor: 'SteelMax Industries', amount: '₹7.8L', status: 'Processing', due: 'Feb 25', type: 'Material' },
    { id: 'PAY-002', vendor: 'Chennai Bricks', amount: '₹2.0L', status: 'Completed', due: 'Feb 15', type: 'Material' },
    { id: 'PAY-003', vendor: 'ReadyMix Co', amount: '₹6.5L', status: 'Pending', due: 'Mar 10', type: 'Material' },
    { id: 'PAY-004', vendor: 'Labor Contractor', amount: '₹3.5L', status: 'Due', due: 'Feb 20', type: 'Labor' },
]

const urgencyColors: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const statusColors: Record<string, string> = {
    'Approved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'On Track': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'At Risk': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Confirmed': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Processing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Due': 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function VendorView() {
    return (
        <div className="space-y-6">
            {/* Purchase Requests */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
            >
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                                <Package className="w-4 h-4 text-indigo-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Purchase Requests</h3>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                                {purchaseRequests.filter(p => p.status !== 'Approved').length} Pending
                            </span>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#050505] text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3">PR ID</th>
                                <th className="px-4 py-3">Material</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3">Urgency</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {purchaseRequests.map(pr => (
                                <tr key={pr.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-xs font-mono text-slate-400">{pr.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs font-medium text-white">{pr.material}</div>
                                        <div className="text-[10px] text-slate-500">by {pr.requestedBy}</div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-300">{pr.qty}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${urgencyColors[pr.urgency]}`}>{pr.urgency}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[pr.status]}`}>{pr.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {pr.status !== 'Approved' && (
                                            <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                                                Process <ArrowRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Delivery Deadlines */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
                >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                <Truck className="w-4 h-4 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Delivery Deadlines</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {deliverySchedule.map(d => (
                            <div key={d.material} className="p-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-white">{d.material}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[d.status]}`}>{d.status}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500">{d.vendor}</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {d.deadline} ({d.daysLeft}d left)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Payment Tracking */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden"
                >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">Payment Tracking</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {payments.map(p => (
                            <div key={p.id} className="p-3 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-500">{p.id}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{p.type}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[p.status]}`}>{p.status}</span>
                                </div>
                                <div className="text-sm text-white font-medium">{p.vendor}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-emerald-400 font-bold">{p.amount}</span>
                                    <span className="text-[10px] text-slate-500">Due: {p.due}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
