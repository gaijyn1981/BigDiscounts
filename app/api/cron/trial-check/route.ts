import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendAvasamTrialDay25Email, sendAvasamTrialDay30Email } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  // --- Day 30: Trial expired — hide products & send final email ---
  const expiredSellers = await prisma.seller.findMany({
    where: {
      avasam: true,
      trialEndsAt: { lte: now },
      trialEmailDay30: false
    },
    include: { products: true }
  })

  let hiddenCount = 0
  for (const seller of expiredSellers) {
    // Only hide products that aren't on a paid Stripe subscription
    const productsToHide = seller.products.filter(p => p.active && !p.stripeSubId)
    if (productsToHide.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: productsToHide.map(p => p.id) }, stripeSubId: null },
        data: { active: false }
      })
      hiddenCount += productsToHide.length
    }

    await prisma.seller.update({
      where: { id: seller.id },
      data: { trialEmailDay30: true }
    })

    await sendAvasamTrialDay30Email(seller.email, seller.contactName, seller.companyName).catch(console.error)
  }

  // --- Day 25: Trial ending in 5 days — send reminder ---
  const fiveDaysFromNow = new Date()
  fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)

  const warningSellers = await prisma.seller.findMany({
    where: {
      avasam: true,
      trialEndsAt: {
        gte: now,       // trial not yet expired
        lte: fiveDaysFromNow // but within 5 days
      },
      trialEmailDay25: false
    }
  })

  for (const seller of warningSellers) {
    await prisma.seller.update({
      where: { id: seller.id },
      data: { trialEmailDay25: true }
    })

    if (seller.trialEndsAt) {
      await sendAvasamTrialDay25Email(
        seller.email, seller.contactName, seller.companyName, seller.trialEndsAt
      ).catch(console.error)
    }
  }

  return NextResponse.json({
    ok: true,
    ran_at: now.toISOString(),
    expired_sellers_processed: expiredSellers.length,
    products_hidden: hiddenCount,
    day25_warnings_sent: warningSellers.length
  })
}
