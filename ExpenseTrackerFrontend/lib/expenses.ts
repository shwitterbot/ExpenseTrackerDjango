import type { LucideIcon } from 'lucide-react'
import {
  ShoppingCart,
  UtensilsCrossed,
  Car,
  House,
  Gamepad2,
  HeartPulse,
  Wallet,
  Plane,
  Folder,
} from 'lucide-react'

export type TxType = 'expense' | 'income'

export type CategoryId =
  | 'food'
  | 'groceries'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'travel'
  | 'income'
  | 'other'

export type Category = {
  id: CategoryId
  label: string
  icon: LucideIcon
  /** design token name, e.g. chart-1 */
  color: string
}

export const categories: Record<CategoryId, Category> = {
  food: { id: 'food', label: 'Кафе и рестораны', icon: UtensilsCrossed, color: 'chart-2' },
  groceries: { id: 'groceries', label: 'Продукты', icon: ShoppingCart, color: 'chart-1' },
  transport: { id: 'transport', label: 'Транспорт', icon: Car, color: 'chart-3' },
  housing: { id: 'housing', label: 'Жильё', icon: House, color: 'chart-4' },
  entertainment: { id: 'entertainment', label: 'Развлечения', icon: Gamepad2, color: 'chart-5' },
  health: { id: 'health', label: 'Здоровье', icon: HeartPulse, color: 'chart-2' },
  travel: { id: 'travel', label: 'Путешествия', icon: Plane, color: 'chart-3' },
  income: { id: 'income', label: 'Доход', icon: Wallet, color: 'chart-1' },
  other: { id: 'other', label: 'Другое', icon: Folder, color: 'chart-5' },
}

export const expenseCategoryIds: CategoryId[] = [
  'groceries',
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'travel',
]

export type Transaction = {
  id: string
  serverId: string | null
  title: string
  amount: number
  type: TxType
  category: CategoryId
  date: string | null
}

export type NewTransaction = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>

export type ApiTransaction = {
  id?: number | string
  title?: string
  amount?: number | string
  type?: string
  category?: number | string | null
  date?: string
}

const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return rub.format(value)
}

export function formatDate(iso: string | null): string {
  if (!iso) return ''

  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}
