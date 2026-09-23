import { categories, formatCurrency, type CategoryId } from '@/lib/expenses'

type Slice = {
  category: CategoryId
  total: number
}

type Props = {
  slices: Slice[]
  totalExpenses: number
}

export function CategoryBreakdown({ slices, totalExpenses }: Props) {
  const sorted = [...slices].sort((a, b) => b.total - a.total)

  const gradient = buildConicGradient(sorted, totalExpenses)

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Расходы по категориям</h2>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div
            className="size-36 rounded-full"
            style={{ background: totalExpenses > 0 ? gradient : 'var(--muted)' }}
            role="img"
            aria-label="Круговая диаграмма расходов по категориям"
          />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-card">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Всего</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <ul className="w-full space-y-3">
          {sorted.length === 0 && (
            <li className="text-sm text-muted-foreground">Пока нет расходов.</li>
          )}
          {sorted.map(({ category, total }) => {
            const cat = categories[category]
            const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
            return (
              <li key={category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: `var(--${cat.color})` }}
                    />
                    {cat.label}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: `var(--${cat.color})` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function buildConicGradient(slices: Slice[], total: number): string {
  if (total <= 0) return 'var(--muted)'
  let acc = 0
  const stops = slices.map(({ category, total: t }) => {
    const start = (acc / total) * 100
    acc += t
    const end = (acc / total) * 100
    const color = `var(--${categories[category].color})`
    return `${color} ${start}% ${end}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}
