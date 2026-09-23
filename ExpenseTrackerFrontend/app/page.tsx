'use client'

import { useMemo, useState } from 'react'
import { Wallet } from 'lucide-react'
import { AuthPanel } from '@/components/auth-panel'
import { SummaryCards } from '@/components/summary-cards'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { TransactionList } from '@/components/transaction-list'
import { AddTransaction } from '@/components/add-transaction'
import { type CategoryId, type NewTransaction, type Transaction } from '@/lib/expenses'
import { addTransaction, getTransactions, removeTransaction } from '@/lib/transactions-api'

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadTransactions() {
    try {
      setLoading(true)
      setError(null)
      setTransactions(await getTransactions())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить операции')
    } finally {
      setLoading(false)
    }
  }

  function handleAuthChange(username: string | null) {
    setCurrentUser(username)
    setError(null)

    if (!username) {
      setTransactions([])
      setLoading(false)
      return
    }

    void loadTransactions()
  }

  const { income, expenses, balance, slices, totalExpenses } = useMemo(() => {
    let income = 0
    let expenses = 0
    const byCategory = new Map<CategoryId, number>()

    for (const tx of transactions) {
      if (tx.type === 'income') {
        income += tx.amount
      } else {
        expenses += tx.amount
        byCategory.set(tx.category, (byCategory.get(tx.category) ?? 0) + tx.amount)
      }
    }

    const slices = Array.from(byCategory, ([category, total]) => ({ category, total }))
    return { income, expenses, balance: income - expenses, slices, totalExpenses: expenses }
  }, [transactions])

  const sorted = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => +new Date(b.date ?? 0) - +new Date(a.date ?? 0),
      ),
    [transactions],
  )

  async function addTransactionData(data: NewTransaction) {
    try {
      setError(null)
      const created = await addTransaction(data)
      setTransactions((prev) => [created, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction')
    }
  }

  async function deleteTransaction(id: string) {
    try {
      setError(null)
      await removeTransaction(id)
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction')
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Кошелёк</h1>
            <p className="text-sm text-muted-foreground">Ваши финансы за месяц</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AuthPanel onAuthChange={handleAuthChange} />
          {currentUser && (
            <div className="hidden sm:block">
              <AddTransaction onAdd={addTransactionData} />
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!currentUser && (
        <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
          Войдите, чтобы увидеть свои операции.
        </div>
      )}

      {currentUser && loading && (
        <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
          Загрузка операций...
        </div>
      )}

      {currentUser && !loading && (
        <div className="mt-8 space-y-4">
          <SummaryCards balance={balance} income={income} expenses={expenses} />
          <CategoryBreakdown slices={slices} totalExpenses={totalExpenses} />
          <TransactionList transactions={sorted} onDelete={deleteTransaction} />
        </div>
      )}

      {currentUser && (
        <div className="mt-6 sm:hidden">
          <AddTransaction onAdd={addTransactionData} />
        </div>
      )}
    </main>
  )
}
