import { CheckCircle2, Loader2, AlertCircle, X, Download, FileImage } from 'lucide-react'
import type { QueueItem } from '@/store/useFileQueue'
import { formatBytes } from '@/lib/format'
import { downloadBlob } from '@/lib/download'
import { cn } from '@/lib/cn'

type FileListProps = {
  items: QueueItem[]
  onRemove: (id: string) => void
}

export const FileList = ({ items, onRemove }: FileListProps) => {
  if (items.length === 0) return null

  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 px-4 py-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <FileImage className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="truncate text-sm font-medium text-slate-800">{item.file.name}</div>
              <div className="flex-none text-xs text-slate-500">
                {formatBytes(item.file.size)}
                {item.resultBlob && (
                  <span className="ml-2 text-emerald-600">
                    → {formatBytes(item.resultBlob.size)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full transition-all',
                  item.status === 'error' ? 'bg-rose-500' : 'bg-brand-500',
                )}
                style={{ width: `${item.status === 'done' ? 100 : item.progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-none items-center gap-1">
            {item.status === 'pending' && <span className="text-xs text-slate-400">queued</span>}
            {item.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />}
            {item.status === 'done' && (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <button
                  type="button"
                  aria-label="Download"
                  className="btn-ghost px-2 py-1"
                  onClick={() =>
                    item.resultBlob &&
                    item.resultName &&
                    downloadBlob(item.resultBlob, item.resultName)
                  }
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}
            {item.status === 'error' && (
              <span title={item.error} className="text-rose-500">
                <AlertCircle className="h-4 w-4" />
              </span>
            )}
            <button
              type="button"
              aria-label="Remove"
              className="btn-ghost px-2 py-1 text-slate-400 hover:text-rose-500"
              onClick={() => onRemove(item.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
