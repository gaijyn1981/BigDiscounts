import webpush from 'web-push'
import { prisma } from './db'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushToUser(
  userId: string,
  userType: 'seller' | 'buyer',
  title: string,
  body: string,
  url: string
) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId, userType } })
  if (!subs.length) return

  const payload = JSON.stringify({ title, body, url })

  await Promise.allSettled(
    subs.map((sub) =>
      webpush
        .sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(async (err: any) => {
          if (err?.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } })
          }
        })
    )
  )
}
