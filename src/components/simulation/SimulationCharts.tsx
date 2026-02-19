'use client'

import { motion } from 'framer-motion'

export function CostBreakdown() {
  const data = [
    { label: 'Materials', value: 45, color: 'bg-blue-500' },
    { label: 'Labor', value: 35, color: 'bg-emerald-500' },
    { label: 'Overhead', value: 15, color: 'bg-amber-500' },
    { label: 'Permits', value: 5, color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-6">Cost Distribution</h3>

      <div className="flex items-end gap-4 h-48 mb-4">
        {data.map((item, i) => (
          <div key={item.label} className="flex-1 flex flex-col justify-end gap-2 group">
            <div className="text-xs text-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{item.value}%</div>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${item.value}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className={`w-full rounded-t-lg ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-slate-400">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TimelineGantt() {
  const phases = [
    { label: 'Foundation', start: 0, duration: 20, color: 'bg-blue-600' },
    { label: 'Framing', start: 15, duration: 30, color: 'bg-emerald-600' },
    { label: 'Systems', start: 40, duration: 25, color: 'bg-amber-600' },
    { label: 'Finishing', start: 60, duration: 40, color: 'bg-purple-600' },
  ]

  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-6">Construction Schedule</h3>

      <div className="space-y-6">
        {phases.map((phase, i) => (
          <div key={phase.label}>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{phase.label}</span>
              <span>{phase.duration} Days</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                whileInView={{ x: `${phase.start}%` }}
                transition={{ duration: 1, delay: i * 0.2 }}
                style={{ width: `${phase.duration}%` }}
                className={`absolute h-full rounded-full ${phase.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-slate-600 mt-6 uppercase tracking-widest">
        <span>Week 1</span>
        <span>Week 4</span>
        <span>Week 8</span>
        <span>Week 12</span>
      </div>
    </div>
  )
}
