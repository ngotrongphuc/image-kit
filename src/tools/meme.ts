import { MessageSquareText } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, loadImage } from '@/lib/image'

const drawMemeText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  baseline: CanvasTextBaseline,
): void => {
  ctx.font = `bold ${fontSize}px Impact, "Arial Black", sans-serif`
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = Math.max(2, fontSize * 0.08)
  ctx.textAlign = 'center'
  ctx.textBaseline = baseline

  // naive word-wrap
  const words = text.toUpperCase().split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)

  const lineHeight = fontSize * 1.1
  lines.forEach((line, i) => {
    const offset = baseline === 'top' ? i * lineHeight : -(lines.length - 1 - i) * lineHeight
    ctx.strokeText(line, x, y + offset)
    ctx.fillText(line, x, y + offset)
  })
}

export const memeTool: ImageTool = {
  id: 'meme',
  name: 'Meme',
  tagline: 'Classic top/bottom meme text generator',
  icon: MessageSquareText,
  accent: 'from-yellow-500 to-amber-500',
  accept: ['image/*'],
  options: {
    topText: {
      type: 'select',
      label: 'Top text',
      options: [
        { value: 'WHEN YOU FINALLY', label: 'WHEN YOU FINALLY' },
        { value: 'NOBODY:', label: 'NOBODY:' },
        { value: 'ME EXPLAINING', label: 'ME EXPLAINING' },
        { value: 'TOP TEXT', label: 'TOP TEXT' },
      ],
      default: 'TOP TEXT',
    },
    bottomText: {
      type: 'select',
      label: 'Bottom text',
      options: [
        { value: 'SHIP IT', label: 'SHIP IT' },
        { value: 'IT WORKS ON MY MACHINE', label: 'IT WORKS ON MY MACHINE' },
        { value: 'I AM THE SENATE', label: 'I AM THE SENATE' },
        { value: 'BOTTOM TEXT', label: 'BOTTOM TEXT' },
      ],
      default: 'BOTTOM TEXT',
    },
    fontSize: {
      type: 'range',
      label: 'Font size (% of image)',
      min: 4,
      max: 15,
      step: 0.5,
      default: 9,
      suffix: '%',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const img = await loadImage(file)
    const topText = String(options.topText ?? 'TOP TEXT')
    const bottomText = String(options.bottomText ?? 'BOTTOM TEXT')
    const fontPct = Number(options.fontSize ?? 9)

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.drawImage(img, 0, 0)

    const fontSize = Math.max(24, (canvas.width * fontPct) / 100)
    const padding = fontSize * 0.4
    const maxWidth = canvas.width - padding * 2

    drawMemeText(ctx, topText, canvas.width / 2, padding, maxWidth, fontSize, 'top')
    drawMemeText(
      ctx,
      bottomText,
      canvas.width / 2,
      canvas.height - padding,
      maxWidth,
      fontSize,
      'bottom',
    )

    onProgress?.(80)
    const blob = await canvasToBlob(canvas, file.type || 'image/png', 0.92)
    onProgress?.(100)
    return { blob, filename: file.name }
  },
}
