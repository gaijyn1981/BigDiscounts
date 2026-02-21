import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    const { title, description, price, category, photos } = await req.json()
    if (!title || !description || !price) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const product = await prisma.product.create({
      data: { sellerId: seller.id, title, description, price: parseFloat(price), category: category || null, photos: JSON.stringify(photos || []), active: false }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
