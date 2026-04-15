import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { product_id, price } = await req.json()

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }
    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: product_id } })
    if (!product) {
      return NextResponse.json({ error: `No product found with id: ${product_id}` }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id: product_id },
      data: { price: parseFloat(price) }
    })

    return NextResponse.json({
      success: true,
      product_id: updated.id,
      title: updated.title,
      old_price: product.price,
      new_price: updated.price,
      message: 'Product price updated successfully.',
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
