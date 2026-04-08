import { Sliders } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

export const filtersTool: ImageTool = {
  id: 'filters',
  name: 'Filters',
  tagline: 'Adjust brightness, contrast, saturation & more',
  icon: Sliders,
  accent: 'from-rose-500 to-red-500',
  accept: ['image/*'],
  options: {
    brightness: {
      type: 'range',
      label: 'Brightness',
      min: 0,
      max: 200,
      step: 1,
      default: 100,
      suffix: '%',
    },
    contrast: {
      type: 'range',
      label: 'Contrast',
      min: 0,
      max: 200,
      step: 1,
      default: 100,
      suffix: '%',
    },
    saturate: {
      type: 'range',
      label: 'Saturation',
      min: 0,
      max: 200,
      step: 1,
      default: 100,
      suffix: '%',
    },
    grayscale: {
      type: 'range',
      label: 'Grayscale',
      min: 0,
      max: 100,
      step: 1,
      default: 0,
      suffix: '%',
    },
    sepia: {
      type: 'range',
      label: 'Sepia',
      min: 0,
      max: 100,
      step: 1,
      default: 0,
      suffix: '%',
    },
    invert: { type: 'boolean', label: 'Invert colors', default: false },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    const parts = [
      `brightness(${Number(options.brightness ?? 100)}%)`,
      `contrast(${Number(options.contrast ?? 100)}%)`,
      `saturate(${Number(options.saturate ?? 100)}%)`,
      `grayscale(${Number(options.grayscale ?? 0)}%)`,
      `sepia(${Number(options.sepia ?? 0)}%)`,
      options.invert ? 'invert(100%)' : '',
    ].filter(Boolean)

    ctx.filter = parts.join(' ')
    ctx.drawImage(img, 0, 0)

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
