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

    if (!title || typeof title !== 'string' || title.length > 200)
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 })

    if (!description || typeof description !== 'string' || description.length > 2000)
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 })

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0 || parseFloat(price) > 1000000)
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })

    if (category && typeof category !== 'string' || (category && category.length > 50))
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })

    if (photos && (!Array.isArray(photos) || photos.length > 4))
      return NextResponse.json({ error: 'Maximum 4 photos allowed' }, { status: 400 })

    const product = await prisma.product.create({
      data: { sellerId: seller.id, title, description, price: parseFloat(price), category: category || null, photos: JSON.stringify(photos || []), active: false }
    })

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
