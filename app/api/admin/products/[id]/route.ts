import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
