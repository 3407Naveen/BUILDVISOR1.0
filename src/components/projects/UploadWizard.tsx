'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, CheckCircle2, Loader2, Sparkles, ChevronRight, AlertCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useBuildingStore } from '@/store/buildingStore'

interface UploadWizardProps {
    isOpen: boolean
    onClose: () => void
}

type Step = 'upload' | 'preview' | 'processing' | 'completed'

export function UploadWizard({ isOpen, onClose }: UploadWizardProps) {
    const [step, setStep] = useState<Step>('upload')
    const [file, setFile] = useState<{ name: string, size: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [processingState, setProcessingState] = useState(0)
    const { saveProject } = useBuildingStore()
    const router = useRouter()

    const processingSteps = [
        "Analyzing Layout...",
        "Detecting Walls...",
        "Identifying Rooms...",
        "Calculating Dimensions...",
        "Generating 3D Structure..."
    ]

    useEffect(() => {
        if (step === 'processing') {
            const interval = setInterval(() => {
                setProcessingState(prev => {
                    if (prev < processingSteps.length - 1) return prev + 1
                    clearInterval(interval)
                    setTimeout(() => setStep('completed'), 1000)
                    return prev
                })
            }, 1500)
            return () => clearInterval(interval)
        }
    }, [step, processingSteps.length])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile({ name: e.target.files[0].name, size: e.target.files[0].size })
            setStep('preview')
        }
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile({ name: e.dataTransfer.files[0].name, size: e.dataTransfer.files[0].size })
            setStep('preview')
        }
    }

    const startProcessing = () => {
        setStep('processing')
    }

    const handleComplete = () => {
        // Redirect to preview page to review AI detection
        router.push('/projects/preview')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">AI 2D to 3D Generation</h3>
                            <p className="text-slate-500 text-sm">Convert floor plans into interactive models.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-slate-500 group-hover:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={onDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}
                                >
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept=".pdf,.dwg,.jpg,.jpeg,.png"
                                    />
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">Drop your floor plan here</h4>
                                    <p className="text-slate-500 text-center text-sm max-w-xs">
                                        Support PDF, JPG, PNG, and DWG formats. Our AI will automatically detect structures.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-300 uppercase">Detection</p>
                                            <p className="text-[11px] text-slate-500">Walls, doors, and windows</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-300 uppercase">Classification</p>
                                            <p className="text-[11px] text-slate-500">Auto-identifying room types</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'preview' && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden relative group">
                                    <div className="aspect-[16/9] flex items-center justify-center bg-slate-900">
                                        <div className="flex flex-col items-center">
                                            <FileText className="w-12 h-12 text-slate-700 mb-2" />
                                            <p className="text-slate-500 font-medium">{file?.name}</p>
                                            <p className="text-[10px] text-slate-600 mt-1">{(file?.size || 0) / 1024 < 1024 ? `${((file?.size || 0) / 1024).toFixed(1)} KB` : `${((file?.size || 0) / (1024 * 1024)).toFixed(1)} MB`}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 animate-pulse">
                                        <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            AI READY
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep('upload')}
                                        className="flex-1 border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                                    >
                                        Replace File
                                    </Button>
                                    <Button
                                        onClick={startProcessing}
                                        className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 relative group overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Generate 3D Model
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20 animate-pulse" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{processingSteps[processingState]}</h4>
                                <p className="text-slate-500 text-sm mb-8 text-center max-w-sm">
                                    BuildVisor AI is reconstructuring your 2D plan into a detailed 3D environment.
                                </p>

                                <div className="w-full max-w-xs space-y-3">
                                    {processingSteps.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {i < processingState ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            ) : i === processingState ? (
                                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-white/10" />
                                            )}
                                            <span className={`text-xs ${i === processingState ? 'text-blue-400 font-bold' : i < processingState ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {s}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'completed' && (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2">Generation Complete!</h4>
                                <p className="text-slate-400 text-sm mb-8 max-w-xs">
                                    Our AI has successfully generated a 3D model with 94% confidence. You can now inspect and refine the result.
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                    <div className="p-4 bg-[#111] border border-white/5 rounded-xl text-left">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Walls Detected</p>
                                        <p className="text-lg text-white font-bold">24 Elements</p>
                                    </div>
                                    <div className="p-4 bg-[#111] border border-white/5 rounded-xl text-left">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Room Count</p>
                                        <p className="text-lg text-white font-bold">6 Zones</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleComplete}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 h-12 text-base font-semibold"
                                >
                                    <Eye className="w-5 h-5" />
                                    Enter 3D Preview
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Progress Strip */}
                {step !== 'processing' && step !== 'completed' && (
                    <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex gap-4">
                            <span className={step === 'upload' ? 'text-blue-400' : 'text-emerald-500'}>1. Upload</span>
                            <span className={step === 'preview' ? 'text-blue-400' : 'text-slate-600'}>2. Preview</span>
                            <span className="text-slate-600">3. AI Generate</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Confidential Process</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
