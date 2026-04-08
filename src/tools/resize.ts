import { Maximize2 } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage, renderToCanvas } from '@/lib/image'

export const resizeTool: ImageTool = {
  id: 'resize',
  name: 'Resize',
  tagline: 'Scale images by width, height, or percentage',
  icon: Maximize2,
  accent: 'from-fuchsia-500 to-pink-500',
  accept: ['image/*'],
  options: {
    mode: {
      type: 'select',
      label: 'Mode',
      options: [
        { value: 'width', label: 'Fit to width' },
        { value: 'height', label: 'Fit to height' },
        { value: 'percent', label: 'Scale by percent' },
      ],
      default: 'width',
    },
    value: {
      type: 'number',
      label: 'Value',
      min: 1,
      step: 1,
      default: 1024,
    },
    keepAspect: {
      type: 'boolean',
      label: 'Keep aspect ratio',
      default: true,
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const mode = String(options.mode ?? 'width')
    const value = Number(options.value ?? 1024)
    const keepAspect = Boolean(options.keepAspect ?? true)

    const img = await loadImage(file)
    const srcW = img.naturalWidth
    const srcH = img.naturalHeight
    const ratio = srcW / srcH

    let targetW = srcW
    let targetH = srcH

    if (mode === 'width') {
      targetW = value
      targetH = keepAspect ? Math.round(value / ratio) : srcH
    } else if (mode === 'height') {
      targetH = value
      targetW = keepAspect ? Math.round(value * ratio) : srcW
    } else {
      const scale = value / 100
      targetW = Math.round(srcW * scale)
      targetH = Math.round(srcH * scale)
    }

    onProgress?.(40)
    const canvas = await renderToCanvas(file, targetW, targetH)
    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)

    return { blob, filename: file.name }
  },
}
