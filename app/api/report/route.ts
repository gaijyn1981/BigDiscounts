import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { productId, reason } = await req.json()
    if (!productId || !reason) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    await prisma.report.create({
      data: { productId, reason }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
