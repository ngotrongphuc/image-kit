import { ShieldCheck, Zap, Package } from 'lucide-react'
import { tools } from '@/tools/registry'
import { ToolCard } from '@/components/ToolCard'

export const HomePage = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="bg-gradient-to-r from-slate-900 to-brand-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          image-kit
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          A tiny toolkit to compress, convert, and resize images — fully in your browser. Nothing
          is uploaded anywhere.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 100% client-side
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> No upload wait
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-slate-200">
            <Package className="h-3.5 w-3.5 text-brand-500" /> Batch + ZIP
          </span>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  )
}
