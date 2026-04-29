import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { sendAvasamWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { email, password, company_name, contact_name, phone } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'password is required (min 8 characters)' }, { status: 400 })
    }
    if (!company_name || typeof company_name !== 'string') {
      return NextResponse.json({ error: 'company_name is required' }, { status: 400 })
    }
    if (!contact_name || typeof contact_name !== 'string') {
      return NextResponse.json({ error: 'contact_name is required' }, { status: 400 })
    }
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 })
    }

    const existing = await prisma.seller.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'A seller account with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 30-day free trial for Avasam-onboarded sellers
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 30)

    const seller = await prisma.seller.create({
      data: {
        email,
        password: hashedPassword,
        companyName: company_name,
        contactName: contact_name,
        phone,
        emailVerified: true,
        avasam: true,
        trialEndsAt
      }
    })

    // Send day-0 welcome email asynchronously
    sendAvasamWelcomeEmail(seller.email, seller.contactName, seller.companyName, trialEndsAt).catch(console.error)

    return NextResponse.json({
      success: true,
      seller_id: seller.id,
      email: seller.email,
      company_name: seller.companyName,
      trial_ends_at: trialEndsAt.toISOString(),
      message: 'Seller account created with 30-day free trial. Products go live immediately.'
    }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
