import type { ImageTool } from './types'
import { compressTool } from './compress'
import { convertTool } from './convert'
import { resizeTool } from './resize'
import { cropTool } from './crop'
import { rotateTool } from './rotate'
import { flipTool } from './flip'
import { filtersTool } from './filters'
import { blurTool } from './blur'
import { watermarkTool } from './watermark'
import { memeTool } from './meme'
import { upscaleTool } from './upscale'
import { bgRemoveTool } from './bgRemove'
import { htmlToImageTool } from './htmlToImage'

export const tools: ImageTool[] = [
  compressTool,
  convertTool,
  resizeTool,
  cropTool,
  rotateTool,
  flipTool,
  filtersTool,
  blurTool,
  watermarkTool,
  memeTool,
  upscaleTool,
  bgRemoveTool,
  htmlToImageTool,
]

export const getToolById = (id: string | undefined): ImageTool | undefined =>
  tools.find((t) => t.id === id)
