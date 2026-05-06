import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/db'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  // Internal only — verify shared secret
  const secret = req.headers.get('x-push-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, userType, title, body, url } = await req.json()

  const subs = await prisma.pushSubscription.findMany({
    where: { userId, userType },
  })

  const payload = JSON.stringify({ title, body, url })
  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      ).catch(async (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Remove stale subscriptions (410 Gone)
        if (err?.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } })
        }
        throw err
      })
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  return NextResponse.json({ sent, total: subs.length })
}
