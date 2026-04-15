import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { product_id, tracking_number, courier, dispatched } = await req.json()

    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }
    if (!tracking_number || typeof tracking_number !== 'string') {
      return NextResponse.json({ error: 'tracking_number is required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: product_id } })
    if (!product) {
      return NextResponse.json({ error: `No product found with id: ${product_id}` }, { status: 404 })
    }

    // Store tracking info in deliveryTime field as JSON string
    const trackingInfo = JSON.stringify({
      tracking_number,
      courier: courier || null,
      dispatched: dispatched || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    const updated = await prisma.product.update({
      where: { id: product_id },
      data: { deliveryTime: trackingInfo }
    })

    return NextResponse.json({
      success: true,
      product_id: updated.id,
      title: updated.title,
      tracking_number,
      courier: courier || null,
      dispatched: dispatched || new Date().toISOString(),
      message: 'Tracking information updated successfully.',
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
