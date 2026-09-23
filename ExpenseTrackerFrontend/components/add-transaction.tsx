'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  categories,
  expenseCategoryIds,
  type NewTransaction,
  type CategoryId,
  type TxType,
} from '@/lib/expenses'

type Props = {
  onAdd: (tx: NewTransaction) => void
}

export function AddTransaction({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<TxType>('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<CategoryId>('groceries')

  function reset() {
    setTitle('')
    setAmount('')
    setCategory('groceries')
    setType('expense')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number.parseFloat(amount.replace(',', '.'))
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return
    onAdd({
      title: title.trim(),
      amount: Math.round(value),
      type,
      category: type === 'income' ? 'income' : category,
    })
    reset()
    setOpen(false)
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="w-full rounded-full sm:w-auto"
        size="lg"
      >
        <Plus className="size-4" aria-hidden="true" />
        Добавить операцию
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-lg sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Новая операция</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
            aria-label="Закрыть"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
            {(['expense', 'income'] as TxType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-full py-2 text-sm font-medium transition ${
                  type === t
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {t === 'expense' ? 'Расход' : 'Доход'}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="text-sm text-muted-foreground">Описание</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, продукты"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-sm text-muted-foreground">Сумма, ₽</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {type === 'expense' && (
            <div>
              <span className="text-sm text-muted-foreground">Категория</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {expenseCategoryIds.map((id) => {
                  const cat = categories[id]
                  const active = category === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCategory(id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full rounded-full" size="lg">
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  )
}
