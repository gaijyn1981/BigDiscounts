import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const viewCache = new Map<string, number>()

export async function POST(req: Request) {
  try {
    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for') || 'anonymous'
    const key = `${ip}:${productId}`
    const now = Date.now()
    const last = viewCache.get(key) || 0

    // Only count one view per IP per product per hour
    if (now - last < 60 * 60 * 1000) {
      return NextResponse.json({ success: true, skipped: true })
    }

    viewCache.set(key, now)

    await prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
