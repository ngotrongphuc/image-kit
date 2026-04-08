import { create } from 'zustand'

export type QueueStatus = 'pending' | 'processing' | 'done' | 'error'

export type QueueItem = {
  id: string
  file: File
  originalUrl: string
  status: QueueStatus
  progress: number
  resultBlob?: Blob
  resultName?: string
  resultUrl?: string
  error?: string
}

type QueueState = {
  items: QueueItem[]
  addFiles: (files: File[]) => void
  remove: (id: string) => void
  clear: () => void
  setStatus: (id: string, status: QueueStatus) => void
  setProgress: (id: string, progress: number) => void
  setResult: (id: string, blob: Blob, filename: string) => void
  setError: (id: string, error: string) => void
}

let idCounter = 0
const nextId = (): string => `f_${Date.now().toString(36)}_${idCounter++}`

/**
 * Revoke any blob URLs on a queue item so the browser can free them.
 */
const revokeItemUrls = (item: QueueItem): void => {
  if (item.originalUrl) URL.revokeObjectURL(item.originalUrl)
  if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
}

export const useFileQueue = create<QueueState>((set) => ({
  items: [],

  addFiles: (files) =>
    set((state) => ({
      items: [
        ...state.items,
        ...files.map<QueueItem>((file) => ({
          id: nextId(),
          file,
          originalUrl: URL.createObjectURL(file),
          status: 'pending',
          progress: 0,
        })),
      ],
    })),

  remove: (id) =>
    set((state) => {
      const target = state.items.find((i) => i.id === id)
      if (target) revokeItemUrls(target)
      return { items: state.items.filter((i) => i.id !== id) }
    }),

  clear: () =>
    set((state) => {
      state.items.forEach(revokeItemUrls)
      return { items: [] }
    }),

  setStatus: (id, status) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, status } : i)),
    })),

  setProgress: (id, progress) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, progress } : i)),
    })),

  setResult: (id, blob, filename) =>
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id !== id) return i
        if (i.resultUrl) URL.revokeObjectURL(i.resultUrl)
        return {
          ...i,
          status: 'done',
          progress: 100,
          resultBlob: blob,
          resultName: filename,
          resultUrl: URL.createObjectURL(blob),
        }
      }),
    })),

  setError: (id, error) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, status: 'error', error } : i)),
    })),
}))
