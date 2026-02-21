import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const { productId } = session.metadata!

    await prisma.product.update({
      where: { id: productId },
      data: {
        active: true,
        stripeSubId: session.subscription as string
      }
    })
  }

  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'customer.subscription.paused'
  ) {
    const subscription = event.data.object as Stripe.Subscription
    await prisma.product.updateMany({
      where: { stripeSubId: subscription.id },
      data: { active: false }
    })
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const subId = invoice.subscription as string
    if (subId) {
      await prisma.product.updateMany({
        where: { stripeSubId: subId },
        data: { active: false }
      })
    }
  }

  return NextResponse.json({ received: true })
}
