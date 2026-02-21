import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const product = await prisma.product.findUnique({ where: { id } })
  return NextResponse.json(product)
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  const { title, description, price, category, photos } = await req.json()
  await prisma.product.updateMany({
    where: { id, sellerId: seller.id },
    data: { title, description, price: parseFloat(price), category, photos: JSON.stringify(photos || []) }
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  await prisma.product.deleteMany({ where: { id, sellerId: seller.id } })
  return NextResponse.json({ success: true })
}
