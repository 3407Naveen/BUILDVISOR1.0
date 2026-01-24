'use client'

import { useBuildingStore, Project } from '@/store/buildingStore'
import { Card } from './card'
import { X, Folder, Trash2, ExternalLink, Clock, HardDrive } from 'lucide-react'
import { Button } from './button'

interface ProjectsSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function ProjectsSidebar({ isOpen, onClose }: ProjectsSidebarProps) {
    const { projects, deleteProject, loadProject } = useBuildingStore()

    const handleLoad = (project: Project) => {
        loadProject(project)
        onClose()
    }

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className={`relative w-80 h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}>
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Folder className="w-4 h-4 text-blue-400" />
                        My Projects
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-600">
                                <HardDrive className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-300">No projects yet</p>
                                <p className="text-xs text-slate-500">Your saved designs will appear here.</p>
                            </div>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <Card key={project.id} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group">
                                <div className="p-3 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors uppercase truncate max-w-[140px]">
                                                {project.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                {formatDate(project.timestamp)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleLoad(project)}
                                            className="flex-1 h-7 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-0"
                                        >
                                            <ExternalLink className="w-2.5 h-2.5 mr-1" />
                                            Load Design
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/20">
                    <p className="text-[10px] text-slate-500 text-center">
                        Projects are saved to your local workspace.
                    </p>
                </div>
            </div>
        </div>
    )
}
