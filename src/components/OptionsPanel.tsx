import type { OptionSchema, OptionValue, ToolOptions } from '@/tools/types'

type OptionsPanelProps = {
  schema: Record<string, OptionSchema>
  values: ToolOptions
  onChange: (key: string, value: OptionValue) => void
}

/**
 * Schema-driven form: renders one control per option definition.
 * Adding a new option to a tool requires zero UI code.
 */
export const OptionsPanel = ({ schema, values, onChange }: OptionsPanelProps) => {
  const entries = Object.entries(schema)
  if (entries.length === 0) return null

  return (
    <div className="space-y-5">
      {entries.map(([key, def]) => (
        <div key={key}>
          <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>{def.label}</span>
            {def.type === 'range' && (
              <span className="text-xs text-slate-500">
                {Number(values[key] ?? def.default).toFixed(2)}
                {def.suffix ?? ''}
              </span>
            )}
          </label>
          {def.type === 'range' && (
            <input
              type="range"
              min={def.min}
              max={def.max}
              step={def.step ?? 0.05}
              value={Number(values[key] ?? def.default)}
              onChange={(e) => onChange(key, Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          )}
          {def.type === 'number' && (
            <input
              type="number"
              min={def.min}
              max={def.max}
              step={def.step ?? 1}
              value={Number(values[key] ?? def.default)}
              onChange={(e) => onChange(key, Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          )}
          {def.type === 'select' && (
            <select
              value={String(values[key] ?? def.default)}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {def.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          {def.type === 'boolean' && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(values[key] ?? def.default)}
                onChange={(e) => onChange(key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-brand-600"
              />
              <span>Enabled</span>
            </label>
          )}
        </div>
      ))}
    </div>
  )
}
