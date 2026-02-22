import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { productId } = session.metadata!
    const subscriptionId = session.subscription as string
    await prisma.product.update({
      where: { id: productId },
      data: { active: true, stripeSubId: subscriptionId }
    })
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.paused') {
    const subscription = event.data.object as Stripe.Subscription
    await prisma.product.updateMany({
      where: { stripeSubId: subscription.id },
      data: { active: false }
    })
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = (invoice as any).subscription as string
    if (subscriptionId) {
      await prisma.product.updateMany({
        where: { stripeSubId: subscriptionId },
        data: { active: false }
      })
    }
  }

  return NextResponse.json({ received: true })
}
