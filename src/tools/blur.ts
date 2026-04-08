import { Droplet } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

export const blurTool: ImageTool = {
  id: 'blur',
  name: 'Blur',
  tagline: 'Apply a Gaussian blur to hide details',
  icon: Droplet,
  accent: 'from-blue-500 to-indigo-500',
  accept: ['image/*'],
  options: {
    radius: {
      type: 'range',
      label: 'Blur radius',
      min: 0,
      max: 50,
      step: 0.5,
      default: 8,
      suffix: 'px',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const radius = Number(options.radius ?? 8)

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.filter = `blur(${radius}px)`
    ctx.drawImage(img, 0, 0)

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
