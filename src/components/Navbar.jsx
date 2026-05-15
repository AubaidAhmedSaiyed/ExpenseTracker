import { useEffect, useState } from 'react'

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3" onClick={(e) => e.preventDefault()}>
          <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Expense Tracker</p>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            href="#dashboard"
          >
            Dashboard
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            href="#activity"
          >
            Activity
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            href="#insights"
          >
            Insights
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost hidden sm:inline-flex"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            type="button"
            className="btn-ghost md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-slate-200/70 px-4 py-4 dark:border-white/10 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <a className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5" href="#dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </a>
            <a className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5" href="#activity" onClick={() => setOpen(false)}>
              Activity
            </a>
            <a className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5" href="#insights" onClick={() => setOpen(false)}>
              Insights
            </a>
            <button type="button" className="btn-ghost w-full justify-center" onClick={() => { onToggleTheme(); setOpen(false); }}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
