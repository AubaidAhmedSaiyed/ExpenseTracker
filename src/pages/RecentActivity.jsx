import ExpenseList from '../components/ExpenseList.jsx'

export default function RecentActivity({ expenses, onDelete, onGoBack }) {
  return (
    <section className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Recent activity
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and manage your latest transactions on a dedicated page.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={onGoBack}
        >
          Back to dashboard
        </button>
      </div>

      <ExpenseList expenses={expenses} onDelete={onDelete} />
    </section>
  )
}
