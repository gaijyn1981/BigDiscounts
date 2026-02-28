import { NextResponse } from ‘next/server’
import Stripe from ‘stripe’
import { getServerSession } from “next-auth”
import { authOptions } from “@/lib/auth”
import { prisma } from ‘@/lib/db’

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
try {
const session = await getServerSession(authOptions)
if (!session?.user?.email) return NextResponse.json({ error: ‘Unauthorized’ }, { status: 401 })

```
const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

const { productId, type } = await req.json()

const product = await prisma.product.findFirst({
  where: { id: productId, sellerId: seller.id }
})

if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

if (type === 'featured') {
  if (!product.featuredSubId) return NextResponse.json({ error: 'No featured subscription' }, { status: 400 })
  // Cancel at period end - featured stays until billing period ends
  await stripe.subscriptions.update(product.featuredSubId, {
    cancel_at_period_end: true
  })
  // Don't remove featured yet - webhook will handle it at period end
} else {
  if (!product.stripeSubId) return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
  // Cancel at period end - listing stays active until billing period ends
  const stripeSubscription = await stripe.subscriptions.update(product.stripeSubId, {
    cancel_at_period_end: true
  })
  // Store the end date so we can show it in the seller dashboard
  await prisma.product.update({
    where: { id: productId },
    data: {
      subscriptionEndsAt: new Date(stripeSubscription.current_period_end * 1000)
    }
  })
}

return NextResponse.json({ success: true })
```

} catch (error: any) {
console.error(error)
return NextResponse.json({ error: error.message || ‘Something went wrong’ }, { status: 500 })
}
}