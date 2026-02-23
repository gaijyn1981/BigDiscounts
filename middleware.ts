import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
})

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (!authHeader || authHeader !== `Basic ${Buffer.from(`${validUsername}:${validPassword}`).toString('base64')}`) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' }
      })
    }
  }

  if (request.nextUrl.pathname === '/api/auth/signin' ||
      request.nextUrl.pathname.startsWith('/api/register')) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a minute and try again.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*', '/api/register/:path*']
}
