'use client'

import { Trash2 } from 'lucide-react'
import {
  categories,
  formatCurrency,
  formatDate,
  type Transaction,
} from '@/lib/expenses'

type Props = {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, onDelete }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">Последние операции</h2>
        <span className="text-xs text-muted-foreground">{transactions.length} шт.</span>
      </header>

      <ul className="divide-y divide-border">
        {transactions.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted-foreground">
            Операций пока нет. Добавьте первую.
          </li>
        )}
        {transactions.map((tx) => {
          const cat = categories[tx.category]
          const Icon = cat.icon
          const isIncome = tx.type === 'income'
          return (
            <li
              key={tx.id}
              className="group flex items-center gap-4 px-5 py-3.5"
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full"
                style={{
                  backgroundColor: `color-mix(in oklab, var(--${cat.color}) 16%, transparent)`,
                  color: `var(--${cat.color})`,
                }}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{tx.title}</p>
                <p className="text-xs text-muted-foreground">
                  {cat.label}{tx.date ? ` · ${formatDate(tx.date)}` : ''}
                </p>
              </div>

              <span
                className={`font-mono text-sm font-semibold tabular-nums ${
                  isIncome ? 'text-primary' : 'text-foreground'
                }`}
              >
                {isIncome ? '+' : '−'}
                {formatCurrency(tx.amount)}
              </span>

              {tx.serverId && (
                <button
                  type="button"
                  onClick={() => onDelete(tx.serverId!)}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label={`Удалить операцию «${tx.title}»`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
