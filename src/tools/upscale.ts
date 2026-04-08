import { ZoomIn } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

/**
 * Multi-step smooth upscale. Running drawImage() through progressive
 * 2x steps with high-quality interpolation gives noticeably better
 * results than a single big-jump upscale.
 */
const stepUpscale = (
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement => {
  let curW = img.naturalWidth
  let curH = img.naturalHeight
  let current: HTMLCanvasElement | HTMLImageElement = img

  while (curW * 2 <= targetW) {
    const nextW = curW * 2
    const nextH = curH * 2
    const next = document.createElement('canvas')
    next.width = nextW
    next.height = nextH
    const ctx = next.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(current, 0, 0, nextW, nextH)
    current = next
    curW = nextW
    curH = nextH
  }

  const final = document.createElement('canvas')
  final.width = targetW
  final.height = targetH
  const ctx = final.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(current, 0, 0, targetW, targetH)
  return final
}

export const upscaleTool: ImageTool = {
  id: 'upscale',
  name: 'Upscale',
  tagline: 'Enlarge images with smooth multi-step interpolation',
  icon: ZoomIn,
  accent: 'from-teal-500 to-cyan-500',
  accept: ['image/*'],
  options: {
    factor: {
      type: 'select',
      label: 'Scale factor',
      options: [
        { value: '2', label: '2× (double)' },
        { value: '3', label: '3×' },
        { value: '4', label: '4× (quadruple)' },
      ],
      default: '2',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const factor = Number(options.factor ?? 2)

    const targetW = Math.round(img.naturalWidth * factor)
    const targetH = Math.round(img.naturalHeight * factor)

    onProgress?.(30)
    const canvas = stepUpscale(img, targetW, targetH)
    onProgress?.(80)

    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
