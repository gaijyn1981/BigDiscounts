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

if (event.type === 'checkout.session.completed') {
const session = event.data.object as Stripe.Checkout.Session
const { productId, type } = session.metadata!
const subscriptionId = session.subscription as string

```
if (type === 'featured') {
  await prisma.product.update({
    where: { id: productId },
    data: { featured: true, featuredSubId: subscriptionId }
  })
} else {
  // Fetch subscription to get current period end
  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
  await prisma.product.update({
    where: { id: productId },
    data: {
      active: true,
      stripeSubId: subscriptionId,
      subscriptionEndsAt: new Date(stripeSubscription.current_period_end * 1000)
    }
  })
}
```

}

// Fires when cancel_at_period_end is true and the period actually ends
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

// When a subscription is set to cancel_at_period_end, Stripe fires this event
// We use it to update the subscriptionEndsAt date if not already set
if (event.type === 'customer.subscription.updated') {
const subscription = event.data.object as Stripe.Subscription
if (subscription.cancel_at_period_end) {
await prisma.product.updateMany({
where: { stripeSubId: subscription.id },
data: {
subscriptionEndsAt: new Date(subscription.current_period_end * 1000)
}
})
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

return NextResponse.json({ received: true })
}