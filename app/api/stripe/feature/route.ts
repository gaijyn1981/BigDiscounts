import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    const { productId } = await req.json()

    const product = await prisma.product.findFirst({
      where: { id: productId, sellerId: seller.id }
    })

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    let customerId = seller.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: seller.email,
        name: seller.companyName,
      })
      customerId = customer.id
      await prisma.seller.update({
        where: { id: seller.id },
        data: { stripeCustomerId: customerId }
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_FEATURED_PRICE_ID,
        quantity: 1
      }],
      metadata: { productId, sellerId: seller.id, type: 'featured' },
      success_url: `${process.env.NEXTAUTH_URL}/seller/dashboard?featured=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/seller/dashboard?cancelled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
