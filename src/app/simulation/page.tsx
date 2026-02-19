'use client'

import { useState } from 'react'
import { CostBreakdown, TimelineGantt } from '@/components/simulation/SimulationCharts'
import { ConstructionRateAnalysis } from '@/components/simulation/ConstructionAnalysis'
import { ForecastPanel, WhatIfControls } from '@/components/simulation/ForecastPanel'
import { Sparkles, ArrowRight, Table2, Info } from 'lucide-react'

export default function SimulationPage() {
  const [inflation, setInflation] = useState(8)
  const [speed, setSpeed] = useState('standard')
  const [material, setMaterial] = useState('virgin')

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              5D Construction Intelligence Active
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tighter">Construction Analytics</h1>
            <p className="text-slate-400 text-lg font-light max-w-xl">
              Predictive 5D modeling connecting time, cost, and market volatility into a synchronized simulation environment.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Est. Project ROI</div>
              <div className="text-2xl font-bold text-white tracking-tight">{14.2 - (inflation - 5) * 0.8}%</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Risk Index</div>
              <div className={`text-2xl font-bold tracking-tight ${inflation > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                {inflation > 12 ? 'HIGH' : inflation > 8 ? 'MOD' : 'LOW'}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid lg:grid-cols-4 gap-6">

          {/* Main Analytics Column */}
          <div className="lg:col-span-3 space-y-6">

            {/* AI Insight Box */}
            <div className="bg-gradient-to-r from-blue-900/20 via-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">AI Scenario Intelligence</h3>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-3 h-3" />
                    Live Market Feed
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-3xl font-light">
                  {material === 'recycled'
                    ? "Sustainable material path selected. Your project is currently shielded from 22% of virgin aggregate price volatility expected in Q4, maintaining a stable cost-line despite market turbulence."
                    : "Standard material path detected. Switching to autoclaved aerated concrete (AAC) blocks for non-load bearing walls could save ₹2.4 Lakhs and reduce overall structural load by 15%."
                  }
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all">
                    Apply Optimization
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all">
                    View Impact Analysis
                  </button>
                </div>
              </div>
            </div>

            {/* Construction Rate Analysis Chart */}
            <ConstructionRateAnalysis inflation={inflation} />

            {/* Existing Core Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <CostBreakdown />
              <TimelineGantt />
            </div>

            {/* Forecast and Benchmarking */}
            <ForecastPanel />

            {/* Material Table Preview */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-bold flex items-center gap-2 text-white">
                  <Table2 className="w-5 h-5 text-slate-400" />
                  Live Bill of Quantities (BoQ)
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-white/5 text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/5 transition-all">Export PDF</button>
                  <button className="px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-blue-500/20 transition-all">Export CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                  <thead className="bg-[#050505] text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-white/5">
                    <tr>
                      <th className="px-8 py-4 text-slate-300">Item Description</th>
                      <th className="px-8 py-4">Quantity</th>
                      <th className="px-8 py-4">Unit Rate</th>
                      <th className="px-8 py-4">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { name: 'Concrete (M25)', qty: '450 m³', rate: '₹4,200', total: '₹18,90,000', trend: 'stable' },
                      { name: 'Steel Rebar (Fe550)', qty: '12 Tons', rate: '₹65,000', total: '₹7,80,000', trend: 'volatile' },
                      { name: 'Bricks (Red Clay)', qty: '25,000 pcs', rate: '₹8', total: '₹2,00,000', trend: 'stable' },
                      { name: 'Exterior Glazing', qty: '120 m²', rate: '₹12,500', total: '₹15,00,000', trend: 'peak' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-blue-500">
                        <td className="px-8 py-5 font-bold text-white">
                          <div className="flex flex-col">
                            <span>{row.name}</span>
                            <span className={`text-[8px] uppercase tracking-widest mt-1 ${row.trend === 'volatile' ? 'text-red-400' : 'text-slate-500'
                              }`}>Market {row.trend}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-300 font-medium">{row.qty}</td>
                        <td className="px-8 py-5 text-slate-300 font-medium">{row.rate}</td>
                        <td className="px-8 py-5 text-emerald-400 font-bold tabular-nums tracking-tight">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Simulation Controls Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <WhatIfControls
                inflation={inflation}
                setInflation={setInflation}
                speed={speed}
                setSpeed={setSpeed}
                material={material}
                setMaterial={setMaterial}
              />

              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border border-blue-500/10">
                <h4 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Dashboard Sync
                </h4>
                <p className="text-[10px] text-blue-300/60 leading-relaxed font-medium">
                  Simulation parameters are live. Adjusting the "What-If" controls will instantly update pricing forecasts, ROI deltas, and the construction timeline across all modules.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
