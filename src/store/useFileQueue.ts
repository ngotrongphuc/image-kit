import { create } from 'zustand'

export type QueueStatus = 'pending' | 'processing' | 'done' | 'error'

export type QueueItem = {
  id: string
  file: File
  status: QueueStatus
  progress: number
  resultBlob?: Blob
  resultName?: string
  error?: string
}

type QueueState = {
  items: QueueItem[]
  addFiles: (files: File[]) => void
  remove: (id: string) => void
  clear: () => void
  update: (id: string, patch: Partial<QueueItem>) => void
  setStatus: (id: string, status: QueueStatus) => void
  setProgress: (id: string, progress: number) => void
}

let idCounter = 0
const nextId = (): string => `f_${Date.now().toString(36)}_${idCounter++}`

export const useFileQueue = create<QueueState>((set) => ({
  items: [],
  addFiles: (files) =>
    set((state) => ({
      items: [
        ...state.items,
        ...files.map<QueueItem>((file) => ({
          id: nextId(),
          file,
          status: 'pending',
          progress: 0,
        })),
      ],
    })),
  remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  update: (id, patch) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),
  setStatus: (id, status) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
  setProgress: (id, progress) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, progress } : i)),
    })),
}))
