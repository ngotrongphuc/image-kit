import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { QueueItem } from '@/store/useFileQueue'
import { formatBytes } from '@/lib/format'

type PreviewModalProps = {
  item: QueueItem | null
  onClose: () => void
}

/**
 * Full-screen before/after preview for a single queue item.
 * If there's no result yet, only the original is shown.
 */
export const PreviewModal = ({ item, onClose }: PreviewModalProps) => {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  if (!item) return null

  const hasResult = item.status === 'done' && item.resultUrl

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[85vh] grid-cols-1 gap-px overflow-auto bg-slate-200 md:grid-cols-2">
          <div className="flex flex-col bg-slate-50">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                Original
              </div>
              <div className="text-[11px] text-slate-500 sm:text-xs">
                {formatBytes(item.file.size)}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-[conic-gradient(at_50%_50%,#f1f5f9_0deg,#e2e8f0_90deg,#f1f5f9_180deg,#e2e8f0_270deg,#f1f5f9_360deg)] p-2 sm:p-4">
              <img
                src={item.originalUrl}
                alt="Original"
                className="max-h-[40vh] max-w-full object-contain shadow-sm md:max-h-[70vh]"
              />
            </div>
          </div>

          <div className="flex flex-col bg-slate-50">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 sm:text-xs">
                Processed
              </div>
              <div className="text-[11px] text-slate-500 sm:text-xs">
                {item.resultBlob ? formatBytes(item.resultBlob.size) : '—'}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center bg-[conic-gradient(at_50%_50%,#f1f5f9_0deg,#e2e8f0_90deg,#f1f5f9_180deg,#e2e8f0_270deg,#f1f5f9_360deg)] p-2 sm:p-4">
              {hasResult ? (
                <img
                  src={item.resultUrl}
                  alt="Processed"
                  className="max-h-[40vh] max-w-full object-contain shadow-sm md:max-h-[70vh]"
                />
              ) : (
                <div className="px-6 py-10 text-center text-sm text-slate-400 sm:px-8 sm:py-16">
                  {item.status === 'processing'
                    ? 'Processing…'
                    : item.status === 'error'
                      ? `Failed: ${item.error ?? 'unknown error'}`
                      : 'Run the tool to see the result here'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="truncate border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
          {item.file.name}
        </div>
      </div>
    </div>
  )
}
