'use client'

import { useState } from 'react'
import { Scene } from '@/components/canvas/Scene'
import { parsePrompt, calculateCost, calculateTimeline } from '@/lib/generator'
import { useBuildingStore } from '@/store/buildingStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Box, Home as HomeIcon } from 'lucide-react'

import { FloorNavigator } from '@/components/ui/FloorNavigator'
import { WorkspaceControls } from '@/components/ui/WorkspaceControls'
import { ContextualTooltip } from '@/components/ui/ContextualTooltip'
import { PanelSection } from '@/components/ui/PanelSection'
import { GenerationStatus } from '@/components/ui/GenerationStatus'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { setParams, params, viewMode, setViewMode } = useBuildingStore()

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)

    // Simulate generation steps (GenerationStatus will handle UI timing)
    // We just wait for it to complete
  }

  const handleGenerationComplete = () => {
    setIsGenerating(false)
    const newParams = parsePrompt(prompt)
    setParams(newParams)
  }

  const cost = calculateCost(params)
  const time = calculateTimeline(params)

  return (
    <div className="flex flex-col h-screen bg-black text-white w-full overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BuildVisor</h1>
        </div>

        {/* View Mode Toggle */}
        <div className="mx-auto flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setViewMode('exterior')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'exterior' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <HomeIcon className="w-3 h-3" />
            Exterior
          </button>
          <button
            onClick={() => setViewMode('interior')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'interior' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Box className="w-3 h-3" />
            Interior
          </button>
        </div>

        <nav className="ml-auto text-sm text-slate-400 gap-4 flex disabled">
          <span>My Projects</span>
          <span>Settings</span>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 p-2 gap-2 h-[calc(100vh-3.5rem)]">

        {/* Left: 3D Viewport */}
        <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
          <Scene />
          <ContextualTooltip />
          <FloorNavigator />
          <WorkspaceControls />
          <GenerationStatus isVisible={isGenerating} onComplete={handleGenerationComplete} />

          {/* Floating Prompt Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-10">
            <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-2xl flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe your home (e.g. 'Modern two-storey concrete villa with flat roof')"
                className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-slate-500 h-10"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Architectural Panels */}
        <div className="w-80 flex flex-col gap-2 overflow-hidden h-full">

          {/* 5D Simulation Panel (Keep as is, maybe make collapsible too if desired, keeping fixed for now as per plan) */}
          <Card className="bg-slate-950 border-slate-800 text-slate-200 p-0 shrink-0">
            {/* ... existing 5D simulation code ... */}
            <div className="bg-slate-900/50 p-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                5D Simulation
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-emerald-400">₹{cost.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Timeline</div>
                  <div className="text-xl font-bold text-blue-400">{time}</div>
                </div>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Materials</span>
                  <span>₹ {Math.floor(cost * 0.4).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Labor</span>
                  <span>₹ {Math.floor(cost * 0.35).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Overhead</span>
                  <span>₹ {Math.floor(cost * 0.25).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Scrollable Parameters Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">

            <PanelSection title="Structure (Locked)" locked={true}>
              <div className="text-xs text-slate-500 mb-2">Exterior geometry is locked during interior planning.</div>
              <div className="space-y-2 opacity-50 pointer-events-none">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Width</span><span>{params.width}m</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Depth</span><span>{params.depth}m</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Height</span><span>{params.height}m</span></div>
              </div>
            </PanelSection>

            <PanelSection title="Style & Materials" defaultOpen={true}>
              {/* Re-using existing row style */}
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Style</span>
                <span className="capitalize text-slate-200 text-sm">{params.roofType === 'flat' ? 'Modern' : 'Classic'}</span>
              </div>
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Material</span>
                <span className="capitalize text-slate-200 text-sm">{params.facadeMaterial}</span>
              </div>
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Roof</span>
                <span className="capitalize text-slate-200 text-sm">{params.roofType}</span>
              </div>
            </PanelSection>

            <PanelSection title="Openings" defaultOpen={false}>
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Windows</span>
                <span className="capitalize text-slate-200 text-sm">{params.windowStyle}</span>
              </div>
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Door</span>
                <span className="capitalize text-slate-200 text-sm">{params.doorStyle}</span>
              </div>
            </PanelSection>

            <PanelSection title="Environment" defaultOpen={false}>
              <div className="group flex justify-between items-center p-2 rounded hover:bg-slate-800 transition-colors cursor-pointer border border-transparent">
                <span className="text-slate-400 text-sm">Terrain</span>
                <span className="capitalize text-slate-200 text-sm">{params.envType}</span>
              </div>
            </PanelSection>

            <PanelSection title="Interior Settings" defaultOpen={true}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Furniture Density</span>
                  <select
                    className="bg-slate-950 border border-slate-700 rounded text-xs p-1 text-slate-300"
                    value={params.furnitureDensity}
                    onChange={(e) => setParams({ furnitureDensity: e.target.value as any })}
                  >
                    <option value="minimal">Minimal</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Lighting Style</span>
                  <select
                    className="bg-slate-950 border border-slate-700 rounded text-xs p-1 text-slate-300"
                    value={params.interiorLightTemp}
                    onChange={(e) => setParams({ interiorLightTemp: e.target.value as any })}
                  >
                    <option value="warm">Warm</option>
                    <option value="neutral">Neutral</option>
                    <option value="cool">Cool</option>
                  </select>
                </div>
              </div>
            </PanelSection>

          </div>

        </div>

      </div>
    </div >
  )
}
