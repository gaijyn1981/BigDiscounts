import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json([], { status: 401 })

  const favourites = await prisma.favourite.findMany({
    where: { buyerEmail: session.user.email }
  })

  return NextResponse.json(favourites.map(f => f.productId))
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await req.json()

  const existing = await prisma.favourite.findUnique({
    where: { buyerEmail_productId: { buyerEmail: session.user.email, productId } }
  })

  if (existing) {
    await prisma.favourite.delete({
      where: { buyerEmail_productId: { buyerEmail: session.user.email, productId } }
    })
    return NextResponse.json({ saved: false })
  } else {
    await prisma.favourite.create({
      data: { buyerEmail: session.user.email, productId }
    })
    return NextResponse.json({ saved: true })
  }
}
