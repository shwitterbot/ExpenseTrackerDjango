import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.delete('origin')

  return NextResponse.next({
    request: { headers },
  })
}

export const config = {
  matcher: '/backend/:path*',
}
