import type {
  ApiTransaction,
  CategoryId,
  NewTransaction,
  Transaction,
} from '@/lib/expenses'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || '/backend'

const TRANSACTIONS_URL = `${API_BASE_URL}/api/v1/transactions/`
const AUTH_BASE_URL = `${API_BASE_URL}/users/api-auth`
const REGISTER_URL = `${AUTH_BASE_URL}/register/`
const LOGIN_URL = `${AUTH_BASE_URL}/login/?next=/`
const LOGOUT_URL = `${AUTH_BASE_URL}/logout/`
const CHANGE_PASSWORD_URL = `${AUTH_BASE_URL}/users/change_password/`

const categoryByBackendId: Record<number, CategoryId> = {
  1: 'groceries',
  2: 'food',
  3: 'transport',
  4: 'housing',
  7: 'entertainment',
  8: 'health',
  9: 'travel',
  13: 'income',
  14: 'income',
  15: 'income',
  16: 'income',
  17: 'other',
}

const backendIdByCategory: Partial<Record<CategoryId, number>> = {
  groceries: 1,
  food: 2,
  transport: 3,
  housing: 4,
  entertainment: 7,
  health: 8,
  travel: 9,
  income: 13,
  other: 17,
}

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function toSafeAmount(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function toCategoryId(value: unknown, type: 'income' | 'expense'): CategoryId {
  if (typeof value === 'string') {
    if (value in categoryByBackendId) {
      return categoryByBackendId[Number(value)]
    }

    if (value === 'income' || value === 'other') return value
  }

  if (typeof value === 'number') {
    return categoryByBackendId[value] ?? (type === 'income' ? 'income' : 'other')
  }

  return type === 'income' ? 'income' : 'other'
}

function normalizeTransaction(raw: ApiTransaction): Transaction {
  const type = raw.type === 'income' ? 'income' : 'expense'
  const serverId = raw.id == null ? null : String(raw.id)

  return {
    id: serverId ?? crypto.randomUUID(),
    serverId,
    title: String(raw.title ?? ''),
    amount: toSafeAmount(raw.amount),
    type,
    category: toCategoryId(raw.category, type),
    date: typeof raw.date === 'string' ? raw.date : null,
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=').slice(1).join('=')

  return value ? decodeURIComponent(value) : null
}

async function getCsrfToken(): Promise<string | null> {
  const response = await fetch(LOGIN_URL, {
    credentials: 'include',
    cache: 'no-store',
  })
  const html = await response.text()
  const formToken = html.match(
    /name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/,
  )?.[1]
  const token = formToken ?? getCookie('csrftoken')

  // The external Next rewrite may not expose Django's Set-Cookie header.
  // Keep the token on the frontend origin so the proxy forwards it back.
  if (token && typeof document !== 'undefined') {
    document.cookie = `csrftoken=${encodeURIComponent(token)}; path=/; SameSite=Lax`
  }

  return token ?? null
}

async function csrfFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getCsrfToken()
  const headers = new Headers(init.headers)

  if (token) headers.set('X-CSRFToken', token)

  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  })
}

async function responseMessage(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) return `Request failed (${response.status})`

  try {
    const data = JSON.parse(text) as Record<string, unknown>
    return Object.entries(data)
      .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
      .join('; ')
  } catch {
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(await responseMessage(response), response.status)
  }

  if (response.status === 204) return undefined as T

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(TRANSACTIONS_URL, {
    method: 'GET',
    credentials: 'include',
  })

  const data = await readJson<ApiTransaction[]>(response)
  return data.map(normalizeTransaction)
}

async function createTransaction(payload: {
  title: string
  amount: number
  type: 'income' | 'expense'
  category: number | null
}): Promise<Transaction> {
  const response = await csrfFetch(TRANSACTIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return normalizeTransaction(await readJson<ApiTransaction>(response))
}

export async function addTransaction(data: NewTransaction): Promise<Transaction> {
  const category = backendIdByCategory[data.category] ?? null

  try {
    return await createTransaction({
      title: data.title,
      amount: toSafeAmount(data.amount),
      type: data.type,
      category,
    })
  } catch (error) {
    // Category rows are not exposed by the backend API. Null is valid and keeps
    // creation working on databases where the optional seed categories do not exist.
    if (category !== null && error instanceof ApiError && error.status === 400) {
      return createTransaction({
        title: data.title,
        amount: toSafeAmount(data.amount),
        type: data.type,
        category: null,
      })
    }

    throw error
  }
}

export type AuthPayload = {
  username: string
  email?: string
  password: string
}

export type AuthUser = {
  id?: number
  username: string
  email?: string
}

export async function registerUser(payload: AuthPayload): Promise<AuthUser> {
  const response = await csrfFetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return readJson<AuthUser>(response)
}

export async function loginUser(payload: { username: string; password: string }): Promise<AuthUser> {
  const csrfToken = await getCsrfToken()
  const form = new URLSearchParams({
    username: payload.username,
    password: payload.password,
  })

  if (csrfToken) form.set('csrfmiddlewaretoken', csrfToken)

  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
    credentials: 'include',
    body: form,
    redirect: 'follow',
  })

  const finalPath = response.url ? new URL(response.url).pathname : ''
  const loginPath = new URL(LOGIN_URL, window.location.origin).pathname
  const loginSucceeded = response.ok && response.redirected && finalPath !== loginPath

  if (!loginSucceeded) {
    throw new Error(response.status === 403 ? 'CSRF token is invalid' : 'Неверный логин или пароль')
  }

  return { username: payload.username }
}

export type ChangePasswordPayload = {
  old_password: string
  new_password_1: string
  new_password_2: string
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  const response = await csrfFetch(CHANGE_PASSWORD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  await readJson<{ detail?: string }>(response)
}

export async function logoutUser(): Promise<void> {
  const response = await csrfFetch(LOGOUT_URL, {
    method: 'POST',
    redirect: 'manual',
  })

  if (!response.ok && (response.status < 300 || response.status >= 400)) {
    throw new ApiError(await responseMessage(response), response.status)
  }
}

export async function removeTransaction(id: string): Promise<void> {
  const response = await csrfFetch(`${TRANSACTIONS_URL}${id}/`, {
    method: 'DELETE',
  })

  await readJson<void>(response)
}
