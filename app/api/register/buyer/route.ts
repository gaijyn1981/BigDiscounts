import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (typeof email !== 'string' || email.length > 200) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    if (typeof password !== 'string' || password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    if (password.length > 200) return NextResponse.json({ error: 'Password too long' }, { status: 400 })
    if (typeof name !== 'string' || name.length > 100) return NextResponse.json({ error: 'Name too long' }, { status: 400 })

    const existing = await prisma.buyer.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const verifyToken = randomBytes(32).toString('hex')

    await prisma.buyer.create({
      data: { email, password: hashed, name, verifyToken }
    })

    await sendVerificationEmail(email, verifyToken, name)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
