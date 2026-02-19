'use client'

import { Layers, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'

export function DashboardStats() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="Active Projects"
                value="9"
                icon={Layers}
                color="text-blue-400"
                bg="bg-blue-400/10"
            />
            <StatCard
                label="Completed"
                value="5"
                icon={CheckCircle2}
                color="text-emerald-400"
                bg="bg-emerald-400/10"
            />
            <StatCard
                label="Pending Review"
                value="4"
                icon={AlertCircle}
                color="text-amber-400"
                bg="bg-amber-400/10"
            />
            <StatCard
                label="Est. Value"
                value="₹2.5Cr"
                icon={TrendingUp}
                color="text-purple-400"
                bg="bg-purple-400/10"
            />
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</div>
            </div>
        </div>
    )
}
