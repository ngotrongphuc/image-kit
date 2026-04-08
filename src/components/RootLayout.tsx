import { Outlet, Link } from 'react-router-dom'
import { ImageIcon, Github } from 'lucide-react'

export const RootLayout = () => {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <ImageIcon className="h-4 w-4" />
            </span>
            <span>image-kit</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500">
          Your images never leave your browser. Built with React + Vite.
        </div>
      </footer>
    </div>
  )
}
