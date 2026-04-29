import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const body = await req.json()
    const { order_id, external_order_id, tracking_number, carrier } = body

    if (!order_id && !external_order_id) {
      return NextResponse.json({ error: 'order_id or external_order_id is required' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        ...(order_id ? { id: order_id } : {}),
        ...(external_order_id ? { externalOrderId: external_order_id } : {})
      }
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot dispatch a cancelled order' }, { status: 400 })
    }
    if (order.status === 'dispatched') {
      return NextResponse.json({ error: 'Order is already dispatched' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'dispatched',
        trackingNumber: tracking_number || null,
        carrier: carrier || null,
        dispatchedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      order_id: updated.id,
      external_order_id: updated.externalOrderId,
      status: updated.status,
      tracking_number: updated.trackingNumber,
      carrier: updated.carrier,
      dispatched_at: updated.dispatchedAt
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
