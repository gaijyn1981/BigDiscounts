import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)

    // Check seller
    const seller = await prisma.seller.findFirst({ where: { verifyToken: token } })
    if (seller) {
      await prisma.seller.update({
        where: { id: seller.id },
        data: { password: hashed, verifyToken: null }
      })
      return NextResponse.json({ success: true })
    }

    // Check buyer
    const buyer = await prisma.buyer.findFirst({ where: { verifyToken: token } })
    if (buyer) {
      await prisma.buyer.update({
        where: { id: buyer.id },
        data: { password: hashed, verifyToken: null }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
