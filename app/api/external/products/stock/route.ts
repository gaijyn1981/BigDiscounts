import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { product_id, in_stock } = await req.json()

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }
    if (typeof in_stock !== 'boolean') {
      return NextResponse.json({ error: 'in_stock must be a boolean (true or false)' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: product_id } })
    if (!product) {
      return NextResponse.json({ error: `No product found with id: ${product_id}` }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id: product_id },
      data: { active: in_stock }
    })

    return NextResponse.json({
      success: true,
      product_id: updated.id,
      title: updated.title,
      in_stock: updated.active,
      message: `Product stock status updated to ${in_stock ? 'in stock (active)' : 'out of stock (inactive)'}.`,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
