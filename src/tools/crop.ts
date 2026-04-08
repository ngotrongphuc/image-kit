import { Crop } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

export const cropTool: ImageTool = {
  id: 'crop',
  name: 'Crop',
  tagline: 'Trim your image by percentage',
  icon: Crop,
  accent: 'from-amber-500 to-orange-500',
  accept: ['image/*'],
  options: {
    left: { type: 'range', label: 'Left (%)', min: 0, max: 90, step: 1, default: 0, suffix: '%' },
    top: { type: 'range', label: 'Top (%)', min: 0, max: 90, step: 1, default: 0, suffix: '%' },
    width: {
      type: 'range',
      label: 'Width (%)',
      min: 10,
      max: 100,
      step: 1,
      default: 100,
      suffix: '%',
    },
    height: {
      type: 'range',
      label: 'Height (%)',
      min: 10,
      max: 100,
      step: 1,
      default: 100,
      suffix: '%',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const left = (Number(options.left ?? 0) / 100) * img.naturalWidth
    const top = (Number(options.top ?? 0) / 100) * img.naturalHeight
    const width = (Number(options.width ?? 100) / 100) * img.naturalWidth
    const height = (Number(options.height ?? 100) / 100) * img.naturalHeight

    const sw = Math.min(width, img.naturalWidth - left)
    const sh = Math.min(height, img.naturalHeight - top)

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(sw))
    canvas.height = Math.max(1, Math.round(sh))
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.drawImage(img, left, top, sw, sh, 0, 0, canvas.width, canvas.height)

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
