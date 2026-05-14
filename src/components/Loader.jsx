export function Spinner({ label = 'Loading' }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <div className="h-10 w-10 animate-spinSlow rounded-full border-2 border-slate-200 border-t-cyan-500 dark:border-white/10 dark:border-t-cyan-400" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export function CardSkeleton({ className = '' }) {
  return (
    <div
      className={`glass animate-pulse overflow-hidden rounded-2xl p-5 ${className}`}
      aria-hidden="true"
    >
      <div className="mb-4 h-3 w-24 rounded bg-slate-200/80 dark:bg-white/10" />
      <div className="h-8 w-40 rounded bg-slate-200/80 dark:bg-white/10" />
      <div className="mt-4 h-2 w-full rounded bg-slate-200/60 dark:bg-white/5" />
    </div>
  )
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass animate-pulse rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 max-w-[200px] rounded bg-slate-200/80 dark:bg-white/10" />
              <div className="h-3 w-24 rounded bg-slate-200/60 dark:bg-white/5" />
            </div>
            <div className="h-6 w-20 rounded bg-slate-200/80 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
