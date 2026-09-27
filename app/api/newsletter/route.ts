import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { newsletterRateLimit } from '@/lib/ratelimit'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await newsletterRateLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email || typeof email !== 'string' || email.length > 200 || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const clean = email.trim().toLowerCase()
    const isNew = await redis.hsetnx('newsletter:uk', clean, new Date().toISOString())
    return NextResponse.json({ ok: true, alreadySubscribed: !isNew })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
