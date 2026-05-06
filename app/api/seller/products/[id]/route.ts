import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/db'
import { sendPushToUser } from '@/lib/push'

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  const product = await prisma.product.findFirst({ where: { id, sellerId: seller.id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  const { title, description, price, category, photos, deliveryTime } = await req.json()
  const newPrice = parseFloat(price)

  // Get current price before update
  const existing = await prisma.product.findFirst({ where: { id, sellerId: seller.id }, select: { price: true, title: true, slug: true } })

  await prisma.product.updateMany({
    where: { id, sellerId: seller.id },
    data: { title, description, price: newPrice, category, deliveryTime: deliveryTime || null, photos: JSON.stringify(photos || []) }
  })

  // Notify buyers who favourited this product if price dropped
  if (existing && newPrice < existing.price) {
    const favourites = await prisma.favourite.findMany({ where: { productId: id } })
    const buyers = await prisma.buyer.findMany({
      where: { email: { in: favourites.map(f => f.buyerEmail) } },
      select: { id: true, email: true }
    })
    const productUrl = existing.slug ? `/product/${existing.slug}` : `/product/${id}`
    await Promise.allSettled(
      buyers.map(b => sendPushToUser(b.id, 'buyer', '🏷️ Price Drop!',
        `${existing.title} is now £${newPrice.toFixed(2)} (was £${existing.price.toFixed(2)})`,
        productUrl
      ))
    )
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  await prisma.product.deleteMany({ where: { id, sellerId: seller.id } })
  return NextResponse.json({ success: true })
}
