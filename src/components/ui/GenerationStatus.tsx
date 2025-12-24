'use client'

import { Check, Circle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GenerationStatusProps {
    isVisible: boolean
    onComplete: () => void
}

const steps = [
    "Analyzing prompt requirements...",
    "Generating structural geometry...",
    "Calculating interior zones...",
    "Placing furniture & fittings...",
    "Applying final finishes..."
]

export function GenerationStatus({ isVisible, onComplete }: GenerationStatusProps) {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (!isVisible) {
            setCurrentStep(0)
            return
        }

        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval)
                    setTimeout(onComplete, 800) // Small delay after last step before closing
                    return prev
                }
                return prev + 1
            })
        }, 1200) // Duration per step

        return () => clearInterval(interval)
    }, [isVisible, onComplete])

    if (!isVisible) return null

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-2xl max-w-sm w-full space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-block relative">
                        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin absolute inset-0" />
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center relative z-10">
                            <span className="text-blue-500 font-bold text-lg">{Math.min(((currentStep + 1) / steps.length) * 100, 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Building Your Vision</h3>
                    <p className="text-slate-400 text-sm">AI architect is working on your design</p>
                </div>

                <div className="space-y-3">
                    {steps.map((step, index) => {
                        const status = index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'

                        return (
                            <div key={index} className="flex items-center gap-3 text-sm">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' :
                                        status === 'active' ? 'bg-blue-500/20 border-blue-500/50 text-blue-500' :
                                            'bg-slate-900 border-slate-800 text-slate-700'
                                    }`}>
                                    {status === 'completed' && <Check className="w-3 h-3" />}
                                    {status === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {status === 'pending' && <Circle className="w-2 h-2 fill-current" />}
                                </div>
                                <span className={`transition-colors ${status === 'active' ? 'text-white font-medium' :
                                        status === 'completed' ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                    {step}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
