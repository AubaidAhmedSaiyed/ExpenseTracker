export const CATEGORIES = [
  'Food',
  'Travel',
  'Marketing',
  'Utilities',
  'Entertainment',
  'Other',
]

export const STORAGE_KEY = 'flowspend-expenses-v1'

export function createExpense({ name, amount, category }) {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    amount: Number(amount),
    category,
    createdAt: new Date().toISOString(),
  }
}

export function formatMoney(value, currency = 'USD') {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

export function formatDateTime(iso) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

export function sumAmounts(expenses) {
  return expenses.reduce((acc, e) => acc + (Number.isFinite(e.amount) ? e.amount : 0), 0)
}

export function groupByCategory(expenses) {
  return expenses.reduce((map, e) => {
    const prev = map.get(e.category) ?? 0
    map.set(e.category, prev + e.amount)
    return map
  }, new Map())
}

export function topCategoryBySpend(categoryTotals) {
  let best = null
  let max = -Infinity
  for (const [cat, amt] of categoryTotals) {
    if (amt > max) {
      max = amt
      best = cat
    }
  }
  return best && max > 0 ? { category: best, amount: max } : null
}

export function isCurrentMonth(isoDate) {
  const d = new Date(isoDate)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export function monthlySpend(expenses) {
  return sumAmounts(expenses.filter((e) => isCurrentMonth(e.createdAt)))
}

export function categoryColorClass(category) {
  const map = {
    Food: 'from-green-700/80 to-green-500/80',
    Travel: 'from-sky-500/80 to-cyan-500/80',
    Marketing: 'from-fuchsia-500/80 to-purple-600/80',
    Utilities: 'from-emerald-500/80 to-teal-600/80',
    Entertainment: 'from-pink-500/80 to-rose-600/80',
    Other: 'from-slate-400/80 to-slate-500/80',
  }
  return map[category] ?? map.Other
}
