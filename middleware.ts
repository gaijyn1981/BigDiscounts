import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const validPassword = process.env.ADMIN_PASSWORD || 'bigdiscounts-admin-2024'

    if (!authHeader || authHeader !== `Basic ${Buffer.from(`admin:${validPassword}`).toString('base64')}`) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"'
        }
      })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
