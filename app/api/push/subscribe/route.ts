import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subscription, userType } = await req.json()
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  // Resolve userId from email
  let userId: string | null = null
  if (userType === 'seller') {
    const seller = await prisma.seller.findUnique({ where: { email: session.user.email }, select: { id: true } })
    userId = seller?.id ?? null
  } else {
    const buyer = await prisma.buyer.findUnique({ where: { email: session.user.email }, select: { id: true } })
    userId = buyer?.id ?? null
  }

  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId,
      userType,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      userId,
      userType,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json()
  if (endpoint) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint } }).catch(() => {})
  }
  return NextResponse.json({ ok: true })
}
