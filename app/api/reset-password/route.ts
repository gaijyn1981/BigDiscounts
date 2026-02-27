import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (password.length > 200) {
      return NextResponse.json({ error: 'Password too long' }, { status: 400 })
    }

    const now = new Date()
    const hashed = await bcrypt.hash(password, 10)

    const seller = await prisma.seller.findFirst({ where: { verifyToken: token } })
    if (seller) {
      if (!seller.resetTokenExpiry || seller.resetTokenExpiry < now) {
        return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
      }
      await prisma.seller.update({
        where: { id: seller.id },
        data: { password: hashed, verifyToken: null, resetTokenExpiry: null }
      })
      return NextResponse.json({ success: true })
    }

    const buyer = await prisma.buyer.findFirst({ where: { verifyToken: token } })
    if (buyer) {
      if (!buyer.resetTokenExpiry || buyer.resetTokenExpiry < now) {
        return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
      }
      await prisma.buyer.update({
        where: { id: buyer.id },
        data: { password: hashed, verifyToken: null, resetTokenExpiry: null }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
