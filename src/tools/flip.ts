import { FlipHorizontal2 } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

export const flipTool: ImageTool = {
  id: 'flip',
  name: 'Flip',
  tagline: 'Mirror images horizontally or vertically',
  icon: FlipHorizontal2,
  accent: 'from-lime-500 to-emerald-500',
  accept: ['image/*'],
  options: {
    direction: {
      type: 'select',
      label: 'Direction',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'both', label: 'Both' },
      ],
      default: 'horizontal',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const dir = String(options.direction ?? 'horizontal')

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    const flipH = dir === 'horizontal' || dir === 'both'
    const flipV = dir === 'vertical' || dir === 'both'

    ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(img, 0, 0)

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
