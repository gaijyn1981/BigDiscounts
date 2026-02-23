import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const { verified } = await req.json()
  const seller = await prisma.seller.update({
    where: { id },
    data: { verified }
  })
  return NextResponse.json(seller)
}
