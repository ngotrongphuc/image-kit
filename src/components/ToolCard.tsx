import { Link } from 'react-router-dom'
import type { ImageTool } from '@/tools/types'
import { cn } from '@/lib/cn'

type ToolCardProps = {
  tool: ImageTool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const Icon = tool.icon
  return (
    <Link
      to={`/tool/${tool.id}`}
      className="group card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={cn(
          'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white',
          tool.accent,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-lg font-semibold">{tool.name}</div>
      <div className="mt-1 text-sm text-slate-500">{tool.tagline}</div>
    </Link>
  )
}
