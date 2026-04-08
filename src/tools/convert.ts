import { FileImage } from 'lucide-react'
import type { ImageTool } from './types'
import { canvasToBlob, renderToCanvas } from '@/lib/image'
import { replaceExtension } from '@/lib/format'

const MIME_BY_FORMAT: Record<string, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

export const convertTool: ImageTool = {
  id: 'convert',
  name: 'Convert',
  tagline: 'Change format between PNG, JPEG, and WebP',
  icon: FileImage,
  accent: 'from-sky-500 to-indigo-500',
  accept: ['image/*'],
  options: {
    format: {
      type: 'select',
      label: 'Target format',
      options: [
        { value: 'png', label: 'PNG' },
        { value: 'jpeg', label: 'JPEG' },
        { value: 'webp', label: 'WebP' },
      ],
      default: 'webp',
    },
    quality: {
      type: 'range',
      label: 'Quality (JPEG / WebP)',
      min: 0.1,
      max: 1,
      step: 0.05,
      default: 0.9,
    },
  },
  process: async ({ file, options, onProgress }) => {
    onProgress?.(10)
    const format = String(options.format ?? 'webp')
    const quality = Number(options.quality ?? 0.9)
    const mime = MIME_BY_FORMAT[format] ?? 'image/png'

    const canvas = await renderToCanvas(file)
    onProgress?.(60)
    const blob = await canvasToBlob(canvas, mime, quality)
    onProgress?.(100)

    return {
      blob,
      filename: replaceExtension(file.name, format === 'jpeg' ? 'jpg' : format),
    }
  },
}
