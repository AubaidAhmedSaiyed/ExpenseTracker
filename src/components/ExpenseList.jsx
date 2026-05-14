import { useMemo, useState } from 'react'
import ExpenseCard from './ExpenseCard.jsx'
import EmptyState from './EmptyState.jsx'

export default function ExpenseList({ expenses, onDelete }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('date_desc')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = expenses
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q),
      )
    }
    const copy = [...list]
    copy.sort((a, b) => {
      if (sort === 'amount_desc') return b.amount - a.amount
      if (sort === 'amount_asc') return a.amount - b.amount
      if (sort === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return copy
  }, [expenses, query, sort])

  const showEmpty = expenses.length === 0
  const showNoMatches = !showEmpty && filtered.length === 0

  return (
    <section
      id="activity"
      className="glass animate-fadeIn rounded-2xl p-5 sm:p-6"
      aria-labelledby="expense-list-title"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="expense-list-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent activity
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, sort, and manage your transactions.
          </p>
        </div>

        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 sm:gap-2">
          <label className="sr-only" htmlFor="expense-search">
            Search expenses
          </label>
          <input
            id="expense-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or category…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 sm:min-w-[220px]"
          />

          <label className="sr-only" htmlFor="expense-sort">
            Sort expenses
          </label>
          <select
            id="expense-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="amount_desc">Highest amount</option>
            <option value="amount_asc">Lowest amount</option>
          </select>
        </div>
      </div>

      {showEmpty ? (
        <EmptyState />
      ) : showNoMatches ? (
        <EmptyState
          title="No matches"
          description="Try a different search term or clear the filter to see all expenses."
        />
      ) : (
        <ul className="space-y-3" role="list">
          {filtered.map((e, idx) => (
            <li
              key={e.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
            >
              <ExpenseCard expense={e} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
