import { create } from 'zustand'

interface UIStore {
    isAssistantOpen: boolean
    toggleAssistant: () => void
}

export const useUIStore = create<UIStore>((set) => ({
    isAssistantOpen: false,
    toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
}))
