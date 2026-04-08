import { Code2 } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob } from '@/lib/image'
import { replaceExtension } from '@/lib/format'

/**
 * Render an .html file to a PNG by injecting its body into an off-screen
 * div and rasterising with html2canvas. External resources may be blocked
 * by CORS; inline styles and data-URI images work best.
 */
const extractBody = (html: string): string => {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return match ? match[1] : html
}

export const htmlToImageTool: ImageTool = {
  id: 'html-to-image',
  name: 'HTML to Image',
  tagline: 'Render an .html file to a PNG',
  icon: Code2,
  accent: 'from-slate-600 to-slate-800',
  accept: ['text/html', '.html', '.htm'],
  options: {
    width: {
      type: 'number',
      label: 'Viewport width (px)',
      min: 200,
      max: 4000,
      step: 10,
      default: 1200,
    },
    background: {
      type: 'select',
      label: 'Background',
      options: [
        { value: '#ffffff', label: 'White' },
        { value: '#000000', label: 'Black' },
        { value: 'transparent', label: 'Transparent' },
      ],
      default: '#ffffff',
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const html = await file.text()
    const bodyHtml = extractBody(html)
    const width = Number(options.width ?? 1200)
    const background = String(options.background ?? '#ffffff')

    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-99999px'
    container.style.top = '0'
    container.style.width = `${width}px`
    container.style.background = background === 'transparent' ? 'transparent' : background
    container.innerHTML = bodyHtml
    document.body.appendChild(container)

    onProgress?.(30)
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(container, {
      backgroundColor: background === 'transparent' ? null : background,
      width,
      windowWidth: width,
      scale: 1,
      logging: false,
    })
    onProgress?.(85)

    container.remove()
    const blob = await canvasToBlob(canvas, 'image/png')
    onProgress?.(100)
    return { blob, filename: replaceExtension(file.name, 'png') }
  },
}
