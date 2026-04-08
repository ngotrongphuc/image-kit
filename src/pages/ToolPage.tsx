import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Play, Trash2, Download } from 'lucide-react'
import type { Accept } from 'react-dropzone'
import { getToolById } from '@/tools/registry'
import { DropZone } from '@/components/DropZone'
import { FileList } from '@/components/FileList'
import { OptionsPanel } from '@/components/OptionsPanel'
import { PreviewModal } from '@/components/PreviewModal'
import { useFileQueue } from '@/store/useFileQueue'
import { downloadBlob, downloadZip } from '@/lib/download'
import type { OptionValue, ToolOptions } from '@/tools/types'

/**
 * Convert a tool's accept list (mime types or extensions) into the shape
 * react-dropzone expects. Extensions go under a wildcard type.
 */
const toDropzoneAccept = (accept: string[]): Accept => {
  const out: Record<string, string[]> = {}
  for (const entry of accept) {
    if (entry.startsWith('.')) {
      if (!out['application/octet-stream']) out['application/octet-stream'] = []
      out['application/octet-stream'].push(entry)
    } else {
      out[entry] = []
    }
  }
  return out as Accept
}

export const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>()
  const tool = getToolById(toolId)

  const items = useFileQueue((s) => s.items)
  const addFiles = useFileQueue((s) => s.addFiles)
  const remove = useFileQueue((s) => s.remove)
  const clear = useFileQueue((s) => s.clear)
  const setStatus = useFileQueue((s) => s.setStatus)
  const setProgress = useFileQueue((s) => s.setProgress)
  const setResult = useFileQueue((s) => s.setResult)
  const setError = useFileQueue((s) => s.setError)

  const defaults = useMemo<ToolOptions>(() => {
    if (!tool) return {}
    const out: ToolOptions = {}
    for (const [k, def] of Object.entries(tool.options)) {
      out[k] = def.default
    }
    return out
  }, [tool])

  const [options, setOptions] = useState<ToolOptions>(defaults)
  const [running, setRunning] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)

  if (!tool) return <Navigate to="/" replace />

  const handleOptionChange = (key: string, value: OptionValue) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  const runAll = async () => {
    setRunning(true)
    const pending = items.filter((i) => i.status === 'pending' || i.status === 'error')
    for (const item of pending) {
      setStatus(item.id, 'processing')
      setProgress(item.id, 0)
      try {
        const result = await tool.process({
          file: item.file,
          options,
          onProgress: (p) => setProgress(item.id, Math.max(0, Math.min(100, p))),
        })
        setResult(item.id, result.blob, result.filename)
      } catch (err) {
        setError(item.id, err instanceof Error ? err.message : 'Unknown error')
      }
    }
    setRunning(false)
  }

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === 'done' && i.resultBlob && i.resultName)
    if (done.length === 0) return
    if (done.length === 1) {
      const { resultBlob, resultName } = done[0]
      downloadBlob(resultBlob!, resultName!)
      return
    }
    await downloadZip(
      done.map((d) => ({ blob: d.resultBlob!, name: d.resultName! })),
      `image-kit-${tool.id}.zip`,
    )
  }

  const doneCount = items.filter((i) => i.status === 'done').length
  const hasWork = items.some((i) => i.status === 'pending' || i.status === 'error')
  const previewItem = items.find((i) => i.id === previewId) ?? null
  const Icon = tool.icon

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="btn-ghost self-start">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${tool.accent} text-white`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">{tool.name}</h1>
            <p className="truncate text-sm text-slate-500">{tool.tagline}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <DropZone onFiles={(files) => addFiles(files)} accept={toDropzoneAccept(tool.accept)} />
          <FileList items={items} onRemove={remove} onPreview={setPreviewId} />

          {items.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button type="button" className="btn-ghost" onClick={clear} disabled={running}>
                <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Clear all</span>
                <span className="sm:hidden">Clear</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={runAll}
                  disabled={running || !hasWork}
                >
                  <Play className="h-4 w-4" />
                  {running ? 'Processing…' : `Run (${items.length})`}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={downloadAll}
                  disabled={doneCount === 0 || running}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Download {doneCount > 1 ? 'all (zip)' : ''}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="card h-fit min-w-0 p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Options
          </h3>
          <OptionsPanel schema={tool.options} values={options} onChange={handleOptionChange} />
        </aside>
      </div>

      <PreviewModal item={previewItem} onClose={() => setPreviewId(null)} />
    </div>
  )
}
