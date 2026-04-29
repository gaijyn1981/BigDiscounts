import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { prisma } from '@/lib/db'
import { sendAvasamTrialDay25Email, sendAvasamTrialDay30Email } from '@/lib/email'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Redis keepalive ping
  await redis.set('keepalive', new Date().toISOString())

  // 2. Avasam trial management
  const now = new Date()
  let productsHidden = 0
  let day30Sent = 0
  let day25Sent = 0

  // Day 30: trial expired — hide non-Stripe products + send final email
  const expiredSellers = await prisma.seller.findMany({
    where: { avasam: true, trialEndsAt: { lte: now }, trialEmailDay30: false },
    include: { products: true }
  })

  for (const seller of expiredSellers) {
    const toHide = seller.products.filter(p => p.active && !p.stripeSubId)
    if (toHide.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: toHide.map(p => p.id) }, stripeSubId: null },
        data: { active: false }
      })
      productsHidden += toHide.length
    }
    await prisma.seller.update({ where: { id: seller.id }, data: { trialEmailDay30: true } })
    await sendAvasamTrialDay30Email(seller.email, seller.contactName, seller.companyName).catch(console.error)
    day30Sent++
  }

  // Day 25: trial ending within 5 days — send warning email
  const fiveDaysFromNow = new Date()
  fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)

  const warningSellers = await prisma.seller.findMany({
    where: { avasam: true, trialEndsAt: { gte: now, lte: fiveDaysFromNow }, trialEmailDay25: false }
  })

  for (const seller of warningSellers) {
    await prisma.seller.update({ where: { id: seller.id }, data: { trialEmailDay25: true } })
    if (seller.trialEndsAt) {
      await sendAvasamTrialDay25Email(seller.email, seller.contactName, seller.companyName, seller.trialEndsAt).catch(console.error)
    }
    day25Sent++
  }

  return NextResponse.json({
    ok: true,
    pinged: now.toISOString(),
    trial: { productsHidden, day25Sent, day30Sent }
  })
}
