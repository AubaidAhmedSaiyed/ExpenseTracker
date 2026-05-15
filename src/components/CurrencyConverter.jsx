import { useMemo } from 'react'
import { formatMoney } from '../utils/helpers.js'
import { Spinner } from './Loader.jsx'

const OPTIONS = ['USD', 'INR', 'EUR', 'GBP', 'AED']

export default function CurrencyConverter({
  totalUsd,
  currency,
  onCurrencyChange,
  loading,
  error,
  rates,
  onRetry,
  convertFromUsd,
}) {
  const converted = useMemo(() => convertFromUsd(totalUsd, currency), [convertFromUsd, currency, totalUsd])

  const rateMissing = currency !== 'USD' && rates && !rates[currency]

  return (
    <section className="glass card-hover animate-fadeIn rounded-2xl p-5 sm:p-6" aria-labelledby="fx-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="fx-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Live conversion
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Frankfurter (USD→INR/EUR/GBP) with AED merged when available.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={onRetry}>
          Refresh rates
        </button>
      </div>

      {loading ? (
        <Spinner label="Fetching exchange rates…" />
      ) : error && !rates ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
          role="alert"
        >
          <p className="font-semibold">We couldn’t load rates</p>
          <p className="mt-1 text-rose-700/90 dark:text-rose-100/80">{error}</p>
          <button type="button" className="btn-primary mt-4" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <label htmlFor="fx-currency" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Target currency
            </label>
            <select
              id="fx-currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 focus:ring-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
            >
              {OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {error && rates ? (
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-300" role="status">
                {error}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Converted total
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">
                {rateMissing || converted === null ? '—' : formatMoney(converted, currency)}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Base total: <span className="font-medium text-slate-800 dark:text-slate-200">{formatMoney(totalUsd)}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
