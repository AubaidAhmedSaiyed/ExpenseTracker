import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  CATEGORIES,
  categoryColorClass,
  formatMoney,
  groupByCategory,
  sumAmounts,
  topCategoryBySpend,
} from '../utils/helpers.js'

const COLORS = {
  Food: '#fb923c',
  Travel: '#38bdf8',
  Marketing: '#c084fc',
  Utilities: '#34d399',
  Entertainment: '#fb7185',
  Other: '#94a3b8',
}

export default function SummaryPanel({ expenses }) {
  const totals = useMemo(() => {
    const total = sumAmounts(expenses)
    const count = expenses.length
    const avg = count ? total / count : 0
    const map = groupByCategory(expenses)
    const top = topCategoryBySpend(map)
    const breakdown = CATEGORIES.map((c) => ({
      name: c,
      value: map.get(c) ?? 0,
    })).filter((d) => d.value > 0)

    return { total, count, avg, map, top, breakdown }
  }, [expenses])

  return (
    <section
      id="insights"
      className="glass animate-fadeIn rounded-2xl p-5 sm:p-6"
      aria-labelledby="summary-title"
    >
      <div className="mb-6 flex flex-col gap-2">
        <h2 id="summary-title" className="text-lg font-semibold text-slate-900 dark:text-white">
          Insights
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Category mix, averages, and distribution at a glance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total expenses
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                {formatMoney(totals.total)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Transactions
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                {totals.count}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Top category
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                {totals.top ? totals.top.category : '—'}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {totals.top ? formatMoney(totals.top.amount) : 'Add expenses to see trends'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Average spend
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                {formatMoney(totals.avg)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Category breakdown</p>
            <div className="mt-4 space-y-3">
              {CATEGORIES.map((c) => {
                const v = totals.map.get(c) ?? 0
                const pct = totals.total ? Math.min(100, Math.round((v / totals.total) * 100)) : 0
                return (
                  <div key={c} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{c}</span>
                      <span className="tabular-nums text-slate-500 dark:text-slate-400">{formatMoney(v)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${categoryColorClass(c)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Distribution</p>
          {totals.breakdown.length === 0 ? (
            <div className="mt-10 text-sm text-slate-500 dark:text-slate-400">No data yet.</div>
          ) : (
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totals.breakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {totals.breakdown.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name] ?? COLORS.Other} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatMoney(value)}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148,163,184,0.35)',
                      background: 'rgba(15,23,42,0.92)',
                      color: '#f8fafc',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Hover slices for exact totals.
          </p>
        </div>
      </div>
    </section>
  )
}
