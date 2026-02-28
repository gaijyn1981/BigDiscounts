import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const productId = session.metadata?.productId
      const type = session.metadata?.type
      const subscriptionId = session.subscription as string

      if (!productId) {
        console.error('No productId in metadata')
        return NextResponse.json({ received: true })
      }

      if (type === 'featured') {
        await prisma.product.update({
          where: { id: productId },
          data: { featured: true, featuredSubId: subscriptionId }
        })
      } else {
        let subscriptionEndsAt: Date | null = null
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
          const periodEnd = (stripeSubscription as any).current_period_end
          if (periodEnd) {
            subscriptionEndsAt = new Date(periodEnd * 1000)
          }
        } catch (e) {
          console.error('Could not retrieve subscription:', e)
        }

        await prisma.product.update({
          where: { id: productId },
          data: {
            active: true,
            stripeSubId: subscriptionId,
            ...(subscriptionEndsAt && { subscriptionEndsAt })
          }
        })
      }
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.paused') {
      const subscription = event.data.object as Stripe.Subscription
      await prisma.product.updateMany({
        where: { stripeSubId: subscription.id },
        data: { active: false, stripeSubId: null, subscriptionEndsAt: null }
      })
      await prisma.product.updateMany({
        where: { featuredSubId: subscription.id },
        data: { featured: false, featuredSubId: null }
      })
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription
      if (subscription.cancel_at_period_end) {
        const periodEnd = (subscription as any).current_period_end
        if (periodEnd) {
          await prisma.product.updateMany({
            where: { stripeSubId: subscription.id },
            data: { subscriptionEndsAt: new Date(periodEnd * 1000) }
          })
        }
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = (invoice as any).subscription as string
      if (subscriptionId) {
        await prisma.product.updateMany({
          where: { stripeSubId: subscriptionId },
          data: { active: false }
        })
        await prisma.product.updateMany({
          where: { featuredSubId: subscriptionId },
          data: { featured: false }
        })
      }
    }

  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
