import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const token = randomBytes(32).toString('hex')
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    // Check seller
    const seller = await prisma.seller.findUnique({ where: { email } })
    if (seller) {
      await prisma.seller.update({ where: { email }, data: { verifyToken: token } })
      await resend.emails.send({
        from: 'BigDiscounts <hello@bigdiscounts.uk>',
        to: email,
        subject: 'Reset your BigDiscounts password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
            <h2 style="color: white; margin-bottom: 16px;">Password Reset Request</h2>
            <p style="color: #9ca3af; margin-bottom: 24px;">Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
              Reset Password
            </a>
            <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">If you didn't request this, ignore this email. Your password won't change.</p>
          </div>
        `
      })
      return NextResponse.json({ success: true })
    }

    // Check buyer
    const buyer = await prisma.buyer.findUnique({ where: { email } })
    if (buyer) {
      await prisma.buyer.update({ where: { email }, data: { verifyToken: token } })
      await resend.emails.send({
        from: 'BigDiscounts <hello@bigdiscounts.uk>',
        to: email,
        subject: 'Reset your BigDiscounts password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin-bottom: 8px;">🇬🇧 BigDiscounts</h1>
            <h2 style="color: white; margin-bottom: 16px;">Password Reset Request</h2>
            <p style="color: #9ca3af; margin-bottom: 24px;">Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">
              Reset Password
            </a>
            <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">If you didn't request this, ignore this email. Your password won't change.</p>
          </div>
        `
      })
      return NextResponse.json({ success: true })
    }

    // Return success even if email not found (security best practice)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
