import imageCompression from 'browser-image-compression'
import { Minimize2 } from 'lucide-react'
import type { ImageTool } from './types'

export const compressTool: ImageTool = {
  id: 'compress',
  name: 'Compress',
  tagline: 'Shrink image files with a quality slider',
  icon: Minimize2,
  accent: 'from-emerald-500 to-teal-500',
  accept: ['image/*'],
  options: {
    quality: {
      type: 'range',
      label: 'Quality',
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 0.75,
    },
    maxWidth: {
      type: 'number',
      label: 'Max width (px, 0 = keep)',
      min: 0,
      step: 100,
      default: 0,
    },
  },
  process: async ({ file, options, onProgress }) => {
    const quality = Number(options.quality ?? 0.75)
    const maxWidth = Number(options.maxWidth ?? 0)
    const compressed = await imageCompression(file, {
      initialQuality: quality,
      maxWidthOrHeight: maxWidth > 0 ? maxWidth : undefined,
      useWebWorker: true,
      onProgress: (p) => onProgress?.(p),
    })
    return { blob: compressed, filename: file.name }
  },
}
