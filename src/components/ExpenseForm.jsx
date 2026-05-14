import { useMemo, useState } from 'react'
import { CATEGORIES, createExpense } from '../utils/helpers.js'

const initial = { name: '', amount: '', category: CATEGORIES[0] }

export default function ExpenseForm({ onAdd, onNotify }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  const canSubmit = useMemo(() => {
    return Boolean(values.name.trim() && values.amount !== '' && values.category)
  }, [values])

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Please enter an expense name.'
    if (values.amount === '' || Number.isNaN(Number(values.amount))) {
      next.amount = 'Enter a valid amount.'
    } else if (Number(values.amount) < 0) {
      next.amount = 'Amount cannot be negative.'
    } else if (Number(values.amount) === 0) {
      next.amount = 'Amount must be greater than zero.'
    }
    if (!values.category) next.category = 'Pick a category.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const expense = createExpense({
      name: values.name,
      amount: values.amount,
      category: values.category,
    })
    onAdd(expense)
    setValues(initial)
    setErrors({})
    onNotify?.({ type: 'success', message: 'Expense added successfully.' })
  }

  return (
    <section className="glass card-hover animate-fadeIn rounded-2xl p-5 sm:p-6" aria-labelledby="expense-form-title">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="expense-form-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            New expense
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Amounts are stored in USD for conversion.</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="expense-name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Expense name
          </label>
          <input
            id="expense-name"
            name="name"
            autoComplete="off"
            placeholder="e.g. Team lunch"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 transition focus:ring-4 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'expense-name-error' : undefined}
          />
          {errors.name ? (
            <p id="expense-name-error" className="text-sm text-rose-600 dark:text-rose-300" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="expense-amount" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Amount (USD)
            </label>
            <input
              id="expense-amount"
              name="amount"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 transition focus:ring-4 dark:border-white/10 dark:bg-slate-950/40 dark:text-white"
              value={values.amount}
              onChange={(e) => setValues((v) => ({ ...v, amount: e.target.value }))}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'expense-amount-error' : undefined}
            />
            {errors.amount ? (
              <p id="expense-amount-error" className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                {errors.amount}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="expense-category" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </label>
            <select
              id="expense-category"
              name="category"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-400/40 transition focus:ring-4 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
              value={values.category}
              onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'expense-category-error' : undefined}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p id="expense-category-error" className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                {errors.category}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">Fields cannot be empty. Negative amounts are blocked.</p>
          <button className="btn-primary w-full sm:w-auto" type="submit" disabled={!canSubmit}>
            Add expense
          </button>
        </div>
      </form>
    </section>
  )
}
