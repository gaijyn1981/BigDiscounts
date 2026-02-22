import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, companyName, contactName, phone } = await req.json()

    if (!email || !password || !companyName || !contactName || !phone)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

    if (typeof email !== 'string' || !email.includes('@') || email.length > 200)
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    if (typeof password !== 'string' || password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    if (typeof companyName !== 'string' || companyName.length > 100)
      return NextResponse.json({ error: 'Company name too long' }, { status: 400 })

    if (typeof contactName !== 'string' || contactName.length > 100)
      return NextResponse.json({ error: 'Contact name too long' }, { status: 400 })

    if (typeof phone !== 'string' || phone.length > 20)
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })

    const existing = await prisma.seller.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    await prisma.seller.create({
      data: { email, password: hashed, companyName, contactName, phone }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
