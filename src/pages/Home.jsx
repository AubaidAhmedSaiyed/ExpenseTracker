import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import DashboardCards from '../components/DashboardCards.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import ExpenseList from '../components/ExpenseList.jsx'
import SummaryPanel from '../components/SummaryPanel.jsx'
import CurrencyConverter from '../components/CurrencyConverter.jsx'
import { useCurrency } from '../hooks/useCurrency.js'
import {
  STORAGE_KEY,
  formatMoney,
  groupByCategory,
  monthlySpend,
  sumAmounts,
  topCategoryBySpend,
} from '../utils/helpers.js'

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readTheme() {
  try {
    const s = localStorage.getItem('flowspend-theme')
    if (s === 'light' || s === 'dark') return s
  } catch {
    // ignore
  }
  return 'light'
}

export default function Home() {
  const [expenses, setExpenses] = useState(() => loadStored())
  const [theme, setTheme] = useState(() => readTheme())
  const [toast, setToast] = useState(null)
  const [currency, setCurrency] = useState('INR')

  const { rates, loading: fxLoading, error: fxError, refetch, convertFromUsd } = useCurrency()

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('flowspend-theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      // ignore
    }
  }, [expenses])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  const total = useMemo(() => sumAmounts(expenses), [expenses])
  const monthly = useMemo(() => monthlySpend(expenses), [expenses])
  const topCategory = useMemo(() => {
    const map = groupByCategory(expenses)
    const t = topCategoryBySpend(map)
    return t ? { name: t.category, amount: t.amount } : null
  }, [expenses])

  const converted = useMemo(() => convertFromUsd(total, currency), [convertFromUsd, total, currency])

  const convertedLabel = useMemo(() => {
    if (fxLoading) return 'Updating…'
    if (currency !== 'USD' && rates && !rates[currency]) return '—'
    if (converted === null) return '—'
    return formatMoney(converted, currency)
  }, [converted, currency, fxLoading, rates])

  const onAdd = useCallback((expense) => {
    setExpenses((prev) => [expense, ...prev])
  }, [])

  const onDelete = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setToast({ type: 'info', message: 'Expense removed.' })
  }, [])

  const onNotify = useCallback((t) => setToast(t), [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className="min-h-svh">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:space-y-10 lg:px-8 lg:py-10">
        <header className="animate-fadeIn space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Personal workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Your spending, <span className="gradient-accent">clarified</span>.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            Track expenses, understand category momentum, and convert totals with live FX — packaged like a modern
            finance dashboard.
          </p>
        </header>

        <DashboardCards
          total={total}
          monthly={monthly}
          topCategory={topCategory}
          convertedLabel={convertedLabel}
          fxLoading={fxLoading}
        />

        <div className="grid items-start gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-5">
            <ExpenseForm onAdd={onAdd} onNotify={onNotify} />
            <CurrencyConverter
              totalUsd={total}
              currency={currency}
              onCurrencyChange={setCurrency}
              loading={fxLoading}
              error={fxError}
              rates={rates}
              onRetry={refetch}
              convertFromUsd={convertFromUsd}
            />
          </div>
          <div className="space-y-6 xl:col-span-7">
            <ExpenseList expenses={expenses} onDelete={onDelete} />
            <SummaryPanel expenses={expenses} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 py-8 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        Track Your Expense. Confidently.
      </footer>

      {toast ? (
        <div
          className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/90 dark:text-white"
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
