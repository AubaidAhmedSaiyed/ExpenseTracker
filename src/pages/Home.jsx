import DashboardCards from '../components/DashboardCards.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import SummaryPanel from '../components/SummaryPanel.jsx'
import CurrencyConverter from '../components/CurrencyConverter.jsx'

export default function Home({
  expenses,
  total,
  monthly,
  topCategory,
  convertedLabel,
  fxLoading,
  currency,
  rates,
  fxError,
  refetch,
  convertFromUsd,
  onAdd,
  onNotify,
  onCurrencyChange,
  onShowActivity,
}) {
  return (
    <>
      <header className="animate-fadeIn space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
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
          </div>

          <button type="button" className="btn-primary" onClick={onShowActivity}>
            View recent activity
          </button>
        </div>
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
            onCurrencyChange={onCurrencyChange}
            loading={fxLoading}
            error={fxError}
            rates={rates}
            onRetry={refetch}
            convertFromUsd={convertFromUsd}
          />
        </div>
        <div className="space-y-6 xl:col-span-7">
          <SummaryPanel expenses={expenses} />
        </div>
      </div>
    </>
  )
}
