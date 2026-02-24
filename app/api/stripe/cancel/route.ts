import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const seller = await prisma.seller.findUnique({ where: { email: session.user.email } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    const { productId, type } = await req.json()

    const product = await prisma.product.findFirst({
      where: { id: productId, sellerId: seller.id }
    })

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    if (type === 'featured') {
      if (!product.featuredSubId) return NextResponse.json({ error: 'No featured subscription' }, { status: 400 })
      await stripe.subscriptions.cancel(product.featuredSubId)
      await prisma.product.update({
        where: { id: productId },
        data: { featured: false, featuredSubId: null }
      })
    } else {
      if (!product.stripeSubId) return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
      await stripe.subscriptions.cancel(product.stripeSubId)
      await prisma.product.update({
        where: { id: productId },
        data: { active: false, stripeSubId: null }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}
