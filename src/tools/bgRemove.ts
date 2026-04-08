import { Scissors } from 'lucide-react'
import type { ImageTool } from './types'
import { replaceExtension } from '@/lib/format'

/**
 * Background removal runs a ~40MB ONNX model in the browser via WASM.
 * The module is lazy-loaded so it doesn't bloat the main bundle.
 */
export const bgRemoveTool: ImageTool = {
  id: 'remove-bg',
  name: 'Remove BG',
  tagline: 'Erase the background with an AI model (runs locally)',
  icon: Scissors,
  accent: 'from-violet-500 to-purple-600',
  accept: ['image/*'],
  options: {},
  process: async ({ file, onProgress }) => {
    onProgress?.(5)
    const { removeBackground } = await import('@imgly/background-removal')
    onProgress?.(15)
    const blob = await removeBackground(file, {
      progress: (_key, current, total) => {
        const pct = 15 + Math.round((current / Math.max(1, total)) * 80)
        onProgress?.(Math.min(95, pct))
      },
    })
    onProgress?.(100)
    return { blob, filename: replaceExtension(file.name, 'png') }
  },
}
