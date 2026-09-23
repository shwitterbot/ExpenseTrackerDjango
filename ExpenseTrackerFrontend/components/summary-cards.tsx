import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/expenses'

type Props = {
  balance: number
  income: number
  expenses: number
}

export function SummaryCards({ balance, income, expenses }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
        <div className="flex items-center gap-2 text-sm/6 text-primary-foreground/80">
          <Wallet className="size-4" aria-hidden="true" />
          Баланс за месяц
        </div>
        <p className="mt-3 font-mono text-3xl font-semibold tracking-tight">
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm/6 text-muted-foreground">
          <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
          Доходы
        </div>
        <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(income)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm/6 text-muted-foreground">
          <span className="grid size-6 place-items-center rounded-full bg-destructive/10 text-destructive">
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </span>
          Расходы
        </div>
        <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(expenses)}
        </p>
      </div>
    </div>
  )
}
