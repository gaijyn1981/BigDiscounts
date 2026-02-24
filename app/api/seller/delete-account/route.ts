import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function DELETE() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    // Delete all products first
    await prisma.product.deleteMany({ where: { sellerId: seller.id } })

    // Delete seller
    await prisma.seller.delete({ where: { id: seller.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
