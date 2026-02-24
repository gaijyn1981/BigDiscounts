import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function DELETE() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const buyer = await prisma.buyer.findUnique({ where: { email: session.user.email } })
    if (!buyer) return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })

    // Delete favourites first
    await prisma.favourite.deleteMany({ where: { buyerEmail: session.user.email } })

    // Delete buyer
    await prisma.buyer.delete({ where: { id: buyer.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
