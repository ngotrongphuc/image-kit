import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type OptionValue = string | number | boolean

export type OptionSchema =
  | { type: 'number'; label: string; min?: number; max?: number; step?: number; default: number }
  | { type: 'range'; label: string; min: number; max: number; step?: number; default: number; suffix?: string }
  | { type: 'select'; label: string; options: Array<{ value: string; label: string }>; default: string }
  | { type: 'boolean'; label: string; default: boolean }

export type ToolOptions = Record<string, OptionValue>

export type ProcessContext = {
  file: File
  options: ToolOptions
  onProgress?: (percent: number) => void
}

export type ProcessResult = {
  blob: Blob
  filename: string
}

export type ImageTool = {
  id: string
  name: string
  tagline: string
  icon: LucideIcon
  accent: string
  /** MIME types this tool accepts. Use e.g. ['image/*']. */
  accept: string[]
  /** Schema describing editable options (keys map to option ids). */
  options: Record<string, OptionSchema>
  /** Process a single file and return the resulting blob + filename. */
  process: (ctx: ProcessContext) => Promise<ProcessResult>
  /** Optional custom preview component (not required for MVP). */
  Preview?: ComponentType<{ file: File }>
}
