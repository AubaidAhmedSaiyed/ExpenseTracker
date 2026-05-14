import { formatMoney } from '../utils/helpers.js'
import { CardSkeleton } from './Loader.jsx'

function Mini({ label, value, hint, loading }) {
  if (loading) return <CardSkeleton />
  return (
    <div className="glass card-hover animate-fadeIn rounded-2xl p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  )
}

export default function DashboardCards({
  total,
  monthly,
  topCategory,
  convertedLabel,
  fxLoading,
}) {
  return (
    <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard highlights">
      <Mini label="Total expenses" value={formatMoney(total)} hint="All-time spend in USD" loading={false} />
      <Mini label="Monthly spending" value={formatMoney(monthly)} hint="Current calendar month" loading={false} />
      <Mini
        label="Top category"
        value={topCategory ? topCategory.name : '—'}
        hint={topCategory ? `${formatMoney(topCategory.amount)} tracked` : 'Add data to rank categories'}
        loading={false}
      />
      <Mini label="Currency preview" value={convertedLabel} hint="Updates with totals & FX" loading={fxLoading} />
    </section>
  )
}
