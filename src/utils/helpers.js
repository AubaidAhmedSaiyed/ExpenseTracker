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
    Food: 'bg-green-600',
    Travel: 'bg-cyan-600',
    Marketing: 'bg-purple-600',
    Utilities: 'bg-teal-600',
    Entertainment: 'bg-rose-600',
    Other: 'bg-slate-400',
  }
  return map[category] ?? map.Other
}
