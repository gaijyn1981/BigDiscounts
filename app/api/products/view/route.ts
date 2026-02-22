import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { productId } = await req.json()
    await prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } }
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}
