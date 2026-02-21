import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await req.json()

  const seller = await prisma.seller.findUnique({
    where: { email: session.user.email }
  })

  if (!seller) {
    return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  let customerId = seller.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: seller.email,
      name: seller.companyName
    })
    customerId = customer.id
    await prisma.seller.update({
      where: { id: seller.id },
      data: { stripeCustomerId: customerId }
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Listing: ${product.title}`,
            description: '£1/month per product listing on BigDiscounts'
          },
          unit_amount: 100,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXTAUTH_URL}/seller/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/seller/dashboard?cancelled=true`,
    metadata: { productId: product.id, sellerId: seller.id }
  })

  return NextResponse.json({ url: checkoutSession.url })
}
