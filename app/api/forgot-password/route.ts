import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { forgotPasswordRateLimit } from '@/lib/ratelimit'

const getResend = () => new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await forgotPasswordRateLimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email || typeof email !== 'string' || email.length > 200) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const token = randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000)
    const resetUrl = process.env.NEXTAUTH_URL + '/reset-password?token=' + token

    const emailHtml = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; padding: 40px; border-radius: 16px;"><h1 style="color: #fcd968; font-size: 28px; margin-bottom: 8px;">BigDiscounts</h1><h2 style="color: white; margin-bottom: 16px;">Password Reset Request</h2><p style="color: #9ca3af; margin-bottom: 24px;">Click the button below to reset your password. This link expires in one hour.</p><a href="' + resetUrl + '" style="background: #fcd968; color: black; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 16px;">Reset Password</a><p style="color: #6b7280; margin-top: 24px; font-size: 14px;">If you did not request this, please ignore this email.</p></div>'

    const seller = await prisma.seller.findUnique({ where: { email } })
    if (seller) {
      await prisma.seller.update({
        where: { email },
        data: { verifyToken: token, resetTokenExpiry: expiry }
      })
      await getResend().emails.send({
        from: 'BigDiscounts <hello@bigdiscounts.uk>',
        to: email,
        subject: 'Reset your BigDiscounts password',
        html: emailHtml
      })
      return NextResponse.json({ success: true })
    }

    const buyer = await prisma.buyer.findUnique({ where: { email } })
    if (buyer) {
      await prisma.buyer.update({
        where: { email },
        data: { verifyToken: token, resetTokenExpiry: expiry }
      })
      await getResend().emails.send({
        from: 'BigDiscounts <hello@bigdiscounts.uk>',
        to: email,
        subject: 'Reset your BigDiscounts password',
        html: emailHtml
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
