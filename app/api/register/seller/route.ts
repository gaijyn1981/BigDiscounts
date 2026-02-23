import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password, companyName, contactName, phone } = await req.json()

    if (!email || !password || !companyName || !contactName || !phone) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const existing = await prisma.seller.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const verifyToken = randomBytes(32).toString('hex')

    await prisma.seller.create({
      data: { email, password: hashed, companyName, contactName, phone, verifyToken }
    })

    await sendVerificationEmail(email, verifyToken, companyName)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
