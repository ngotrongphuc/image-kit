import { RotateCw } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

export const rotateTool: ImageTool = {
  id: 'rotate',
  name: 'Rotate',
  tagline: 'Rotate images by any angle',
  icon: RotateCw,
  accent: 'from-cyan-500 to-blue-500',
  accept: ['image/*'],
  options: {
    angle: {
      type: 'range',
      label: 'Angle',
      min: -180,
      max: 180,
      step: 1,
      default: 90,
      suffix: '°',
    },
    background: {
      type: 'select',
      label: 'Background (non-90° angles)',
      options: [
        { value: 'transparent', label: 'Transparent' },
        { value: '#ffffff', label: 'White' },
        { value: '#000000', label: 'Black' },
      ],
      default: 'transparent',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const angle = Number(options.angle ?? 90)
    const rad = (angle * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    const w = img.naturalWidth
    const h = img.naturalHeight

    const newW = Math.round(w * cos + h * sin)
    const newH = Math.round(w * sin + h * cos)

    const canvas = document.createElement('canvas')
    canvas.width = newW
    canvas.height = newH
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    const bg = String(options.background ?? 'transparent')
    if (bg !== 'transparent') {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, newW, newH)
    }

    ctx.translate(newW / 2, newH / 2)
    ctx.rotate(rad)
    ctx.drawImage(img, -w / 2, -h / 2)

    onProgress?.(80)
    const mime = bg === 'transparent' ? 'image/png' : file.type || 'image/png'
    const blob = await canvasToBlob(canvas, mime, 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
