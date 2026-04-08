import type { ImageTool } from './types'
import { compressTool } from './compress'
import { convertTool } from './convert'
import { resizeTool } from './resize'

export const tools: ImageTool[] = [compressTool, convertTool, resizeTool]

export const getToolById = (id: string | undefined): ImageTool | undefined =>
  tools.find((t) => t.id === id)
