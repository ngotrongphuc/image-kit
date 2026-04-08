import { Stamp } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

const POSITIONS = {
  'top-left': { x: 0.02, y: 0.05, align: 'left' as CanvasTextAlign },
  'top-right': { x: 0.98, y: 0.05, align: 'right' as CanvasTextAlign },
  'bottom-left': { x: 0.02, y: 0.95, align: 'left' as CanvasTextAlign },
  'bottom-right': { x: 0.98, y: 0.95, align: 'right' as CanvasTextAlign },
  center: { x: 0.5, y: 0.5, align: 'center' as CanvasTextAlign },
} as const

export const watermarkTool: ImageTool = {
  id: 'watermark',
  name: 'Watermark',
  tagline: 'Add a text watermark to your images',
  icon: Stamp,
  accent: 'from-purple-500 to-fuchsia-500',
  accept: ['image/*'],
  options: {
    text: {
      type: 'select',
      label: 'Text',
      options: [
        { value: '© your name', label: '© your name' },
        { value: 'CONFIDENTIAL', label: 'CONFIDENTIAL' },
        { value: 'DRAFT', label: 'DRAFT' },
        { value: 'SAMPLE', label: 'SAMPLE' },
        { value: 'image-kit', label: 'image-kit' },
      ],
      default: '© your name',
    },
    position: {
      type: 'select',
      label: 'Position',
      options: [
        { value: 'bottom-right', label: 'Bottom right' },
        { value: 'bottom-left', label: 'Bottom left' },
        { value: 'top-right', label: 'Top right' },
        { value: 'top-left', label: 'Top left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'bottom-right',
    },
    fontSize: {
      type: 'range',
      label: 'Font size (% of image)',
      min: 2,
      max: 12,
      step: 0.5,
      default: 5,
      suffix: '%',
    },
    opacity: {
      type: 'range',
      label: 'Opacity',
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 0.6,
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const text = String(options.text ?? 'image-kit')
    const position = String(options.position ?? 'bottom-right') as keyof typeof POSITIONS
    const fontPct = Number(options.fontSize ?? 5)
    const opacity = Number(options.opacity ?? 0.6)

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.drawImage(img, 0, 0)

    const fontSize = Math.max(12, (Math.min(canvas.width, canvas.height) * fontPct) / 100)
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.globalAlpha = opacity
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = Math.max(1, fontSize * 0.06)

    const pos = POSITIONS[position]
    ctx.textAlign = pos.align
    ctx.textBaseline = pos.y > 0.5 ? 'bottom' : pos.y < 0.5 ? 'top' : 'middle'

    const x = pos.x * canvas.width
    const y = pos.y * canvas.height
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
