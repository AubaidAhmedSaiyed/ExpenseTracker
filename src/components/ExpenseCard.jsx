import { formatDateTime, formatMoney } from '../utils/helpers.js'

export default function ExpenseCard({ expense, onDelete }) {
  return (
    <article className="glass card-hover group relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">{expense.name}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {expense.category}
            </span>
            <span>{formatDateTime(expense.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{formatMoney(expense.amount)}</p>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:border-white/10 dark:bg-white/5 dark:text-rose-300 dark:hover:bg-rose-500/10"
            onClick={() => onDelete(expense.id)}
            aria-label={`Delete expense ${expense.name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
