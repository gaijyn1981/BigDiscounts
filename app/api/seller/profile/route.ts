import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
  if (!seller) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(seller)
}

export async function PATCH(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { paypalMe } = await req.json()

  const seller = await prisma.seller.update({
    where: { email: session.user.email },
    data: { paypalMe }
  })

  return NextResponse.json(seller)
}
