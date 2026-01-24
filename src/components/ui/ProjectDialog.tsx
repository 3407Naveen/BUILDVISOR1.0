'use client'

import { useState, useEffect } from 'react'
import { useBuildingStore } from '@/store/buildingStore'
import { validateProjectName } from '@/lib/validation'
import { Button } from './button'
import { Input } from './input'
import { Card } from './card'
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ProjectDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectDialog({ isOpen, onClose }: ProjectDialogProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isValid, setIsValid] = useState(false)
    const { saveProject } = useBuildingStore()

    useEffect(() => {
        if (!name) {
            setError(null)
            setIsValid(false)
            return
        }

        const result = validateProjectName(name)
        if (result.isValid) {
            setError(null)
            setIsValid(true)
        } else {
            setError(result.error || 'Invalid name')
            setIsValid(false)
        }
    }, [name])

    const handleSave = () => {
        if (isValid) {
            saveProject(name)
            setName('')
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-slate-950/90 border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Save className="w-4 h-4 text-blue-400" />
                        Save Project
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Project Name</label>
                        <div className="relative">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="my-awesome-villa"
                                className={`bg-slate-900/50 border-slate-800 focus:ring-blue-500/50 pr-10 ${error ? 'border-red-500/50 focus:ring-red-500/50' : isValid ? 'border-emerald-500/50 focus:ring-emerald-500/50' : ''}`}
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {error && <AlertCircle className="w-4 h-4 text-red-500" />}
                                {isValid && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </div>
                        </div>
                        {error && (
                            <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                                {error}
                            </p>
                        )}
                        {!error && !isValid && (
                            <p className="text-[10px] text-slate-500 mt-1">
                                1-100 chars, lowercase, digits, . _ - allowed. No --- sequence.
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!isValid}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        >
                            Save Design
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
