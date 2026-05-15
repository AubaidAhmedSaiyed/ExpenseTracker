import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import RecentActivity from './pages/RecentActivity.jsx'
import { STORAGE_KEY, formatMoney, groupByCategory, monthlySpend, sumAmounts, topCategoryBySpend } from './utils/helpers.js'
import { useCurrency } from './hooks/useCurrency.js'

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
    const value = localStorage.getItem('flowspend-theme')
    if (value === 'light' || value === 'dark') return value
  } catch {
    // ignore
  }
  return 'light'
}

export default function App() {
  const [page, setPage] = useState('home')
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
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const total = useMemo(() => sumAmounts(expenses), [expenses])
  const monthly = useMemo(() => monthlySpend(expenses), [expenses])
  const topCategory = useMemo(() => {
    const map = groupByCategory(expenses)
    const top = topCategoryBySpend(map)
    return top ? { name: top.category, amount: top.amount } : null
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
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    setToast({ type: 'info', message: 'Expense removed.' })
  }, [])

  const onNotify = useCallback((notification) => setToast(notification), [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const navigate = useCallback((destination) => setPage(destination), [])

  return (
    <div className="min-h-svh">
      <Navbar theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} activePage={page} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:space-y-10 lg:px-8 lg:py-10">
        {page === 'home' ? (
          <Home
            expenses={expenses}
            total={total}
            monthly={monthly}
            topCategory={topCategory}
            convertedLabel={convertedLabel}
            fxLoading={fxLoading}
            currency={currency}
            rates={rates}
            fxError={fxError}
            refetch={refetch}
            convertFromUsd={convertFromUsd}
            onAdd={onAdd}
            onNotify={onNotify}
            onCurrencyChange={setCurrency}
            onShowActivity={() => navigate('activity')}
          />
        ) : (
          <RecentActivity expenses={expenses} onDelete={onDelete} onGoBack={() => navigate('home')} />
        )}
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
