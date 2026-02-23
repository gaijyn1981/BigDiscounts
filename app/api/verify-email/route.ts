import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) return NextResponse.redirect(new URL('/login?error=invalid', req.url))

  // Check seller
  const seller = await prisma.seller.findFirst({ where: { verifyToken: token } })
  if (seller) {
    await prisma.seller.update({
      where: { id: seller.id },
      data: { emailVerified: true, verifyToken: null }
    })
    return NextResponse.redirect(new URL('/login?verified=true', req.url))
  }

  // Check buyer
  const buyer = await prisma.buyer.findFirst({ where: { verifyToken: token } })
  if (buyer) {
    await prisma.buyer.update({
      where: { id: buyer.id },
      data: { emailVerified: true, verifyToken: null }
    })
    return NextResponse.redirect(new URL('/login?verified=true', req.url))
  }

  return NextResponse.redirect(new URL('/login?error=invalid', req.url))
}
