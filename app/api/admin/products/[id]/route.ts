import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { active } = await req.json()
  await prisma.product.update({
    where: { id: params.id },
    data: { active }
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
