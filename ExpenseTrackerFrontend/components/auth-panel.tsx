'use client'

import { useState } from 'react'
import { LogIn, LogOut, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loginUser, logoutUser, registerUser } from '@/lib/transactions-api'

type Mode = 'login' | 'register'

type Props = {
  onAuthChange?: (username: string | null) => void
}

export function AuthPanel({ onAuthChange }: Props) {
  const [mode, setMode] = useState<Mode>('login')
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  function resetForm() {
    setUsername('')
    setEmail('')
    setPassword('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const formUsername = String(formData.get('username') ?? username).trim()
    const formEmail = String(formData.get('email') ?? email).trim()
    const formPassword = String(formData.get('password') ?? password)

    try {
      if (mode === 'register') {
        const user = await registerUser({ username: formUsername, email: formEmail, password: formPassword })
        await loginUser({ username: formUsername, password: formPassword })
        setCurrentUser(user.username)
        onAuthChange?.(user.username)
      } else {
        const user = await loginUser({ username: formUsername, password: formPassword })
        setCurrentUser(user.username)
        onAuthChange?.(user.username)
      }

      resetForm()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    try {
      await logoutUser()
    } catch {
      // ignore and clear local UI anyway
    } finally {
      setCurrentUser(null)
      onAuthChange?.(null)
    }
  }

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground">
          {currentUser}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={signOut}>
          <LogOut className="size-4" aria-hidden="true" />
          Выйти
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button type="button" size="sm" onClick={() => setOpen((v) => !v)}>
        <LogIn className="size-4" aria-hidden="true" />
        Войти
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[380px] rounded-3xl border border-border bg-card p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Кошелёк
              </span>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                {mode === 'login' ? 'Вход' : 'Регистрация'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted"
              aria-label="Закрыть"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 rounded-full bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Войти
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'register'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm text-muted-foreground">Логин</span>
              <input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </label>

            {mode === 'register' && (
              <label className="block">
                <span className="text-sm text-muted-foreground">Email</span>
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm text-muted-foreground">Пароль</span>
              <input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                type="password"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </label>

            {error && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full rounded-full" size="lg" disabled={busy}>
              {busy ? (
                '...'
              ) : mode === 'login' ? (
                <>
                  <LogIn className="size-4" aria-hidden="true" />
                  Войти
                </>
              ) : (
                <>
                  <UserPlus className="size-4" aria-hidden="true" />
                  Создать аккаунт
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
