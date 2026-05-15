export default function EmptyState({ title = 'No expenses yet', description, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/50 px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900/30 ${className}`}
    >
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full bg-green-100/30 blur-xl dark:bg-green-900/20" />
        <svg
          viewBox="0 0 120 120"
          className="relative h-full w-full text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        >
          <rect x="18" y="24" width="84" height="72" rx="14" fill="currentColor" opacity="0.12" />
          <path
            d="M36 44h48M36 58h32M36 72h40"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.35"
          />
          <circle cx="84" cy="78" r="16" fill="url(#g)" opacity="0.9" />
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="max-w-sm space-y-2">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description ??
            'Add your first expense to unlock totals, category insights, and live currency conversion.'}
        </p>
      </div>
    </div>
  )
}
