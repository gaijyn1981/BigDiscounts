import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function authCheck(req: Request) {
  const apiKey = req.headers.get('x-api-key')
  return apiKey && apiKey === process.env.AVASAM_API_KEY
}

export async function POST(req: Request) {
  try {
    if (!authCheck(req)) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const body = await req.json()
    const {
      seller_email, external_order_id, buyer_name, buyer_email, buyer_phone,
      shipping_address, items,
      currency, dispatch_by, reference_number, notes, paid_on, received_date,
      payment_status
    } = body

    // Validate required fields
    if (!seller_email) return NextResponse.json({ error: 'seller_email is required' }, { status: 400 })
    if (!buyer_name) return NextResponse.json({ error: 'buyer_name is required' }, { status: 400 })
    if (!buyer_email) return NextResponse.json({ error: 'buyer_email is required' }, { status: 400 })
    if (!shipping_address?.line1) return NextResponse.json({ error: 'shipping_address.line1 is required' }, { status: 400 })
    if (!shipping_address?.city) return NextResponse.json({ error: 'shipping_address.city is required' }, { status: 400 })
    if (!shipping_address?.postcode) return NextResponse.json({ error: 'shipping_address.postcode is required' }, { status: 400 })
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 })
    }

    const seller = await prisma.seller.findUnique({ where: { email: seller_email } })
    if (!seller) return NextResponse.json({ error: `No seller found with email: ${seller_email}` }, { status: 404 })

    // Check for duplicate external_order_id
    if (external_order_id) {
      const existing = await prisma.order.findUnique({ where: { externalOrderId: external_order_id } })
      if (existing) {
        return NextResponse.json({ error: 'An order with this external_order_id already exists', order_id: existing.id }, { status: 409 })
      }
    }

    // Validate + resolve items
    const resolvedItems: { productId: string; sku: string | null; title: string; price: number; quantity: number; taxRate: number | null; taxCostInclusive: boolean; useChannelTax: boolean }[] = []
    for (const item of items) {
      if (!item.product_id) return NextResponse.json({ error: 'Each item must have a product_id' }, { status: 400 })
      if (!item.quantity || item.quantity < 1) return NextResponse.json({ error: 'Each item must have a quantity >= 1' }, { status: 400 })

      const product = await prisma.product.findUnique({ where: { id: item.product_id } })
      if (!product) return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 404 })
      if (product.sellerId !== seller.id) return NextResponse.json({ error: `Product ${item.product_id} does not belong to this seller` }, { status: 403 })

      resolvedItems.push({
        productId: product.id,
        sku: product.sku || item.sku || null,
        title: item.ItemTitle || product.title,
        price: item.PricePerUnit ?? item.price ?? product.price,
        quantity: item.Quantity ?? item.quantity,
        taxRate: item.TaxRate ?? null,
        taxCostInclusive: item.TaxCostInclusive ?? false,
        useChannelTax: item.UseChannelTax ?? false
      })
    }

    const order = await prisma.order.create({
      data: {
        sellerId: seller.id,
        externalOrderId: external_order_id || null,
        buyerName: buyer_name,
        buyerEmail: buyer_email,
        buyerPhone: buyer_phone || null,
        shippingLine1: shipping_address.line1,
        shippingLine2: shipping_address.line2 || null,
        shippingCity: shipping_address.city,
        shippingPostcode: shipping_address.postcode,
        shippingCountry: shipping_address.Country || shipping_address.country || 'GB',
        shippingRegion: shipping_address.Region || shipping_address.region || null,
        shippingCompany: shipping_address.Company || shipping_address.company || null,
        shippingLine3: shipping_address.Address3 || shipping_address.line3 || null,
        currency: currency || 'GBP',
        dispatchBy: dispatch_by ? new Date(dispatch_by) : null,
        referenceNumber: reference_number || null,
        notes: notes || null,
        paidOn: paid_on ? new Date(paid_on) : null,
        receivedDate: received_date ? new Date(received_date) : null,
        paymentStatus: payment_status || 'paid',
        status: 'pending',
        items: {
          create: resolvedItems
        }
      },
      include: { items: true }
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      external_order_id: order.externalOrderId,
      status: order.status,
      buyer: { name: order.buyerName, email: order.buyerEmail },
      items: order.items.map(i => ({ product_id: i.productId, sku: i.sku, title: i.title, price: i.price, quantity: i.quantity })),
      created_at: order.createdAt
    }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    if (!authCheck(req)) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const seller_email = searchParams.get('seller_email')
    const order_id = searchParams.get('order_id')
    const external_order_id = searchParams.get('external_order_id')
    const status = searchParams.get('status')

    if (!seller_email) return NextResponse.json({ error: 'seller_email is required' }, { status: 400 })

    const seller = await prisma.seller.findUnique({ where: { email: seller_email } })
    if (!seller) return NextResponse.json({ error: `No seller found with email: ${seller_email}` }, { status: 404 })

    // Single order lookup
    if (order_id || external_order_id) {
      const order = await prisma.order.findFirst({
        where: {
          sellerId: seller.id,
          ...(order_id ? { id: order_id } : {}),
          ...(external_order_id ? { externalOrderId: external_order_id } : {})
        },
        include: { items: true }
      })
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

      return NextResponse.json(formatOrder(order))
    }

    // List orders
    const orders = await prisma.order.findMany({
      where: {
        sellerId: seller.id,
        ...(status ? { status } : {})
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      seller_email: seller.email,
      total: orders.length,
      orders: orders.map(formatOrder)
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatOrder(order: any) {
  return {
    order_id: order.id,
    external_order_id: order.externalOrderId,
    status: order.status,
    buyer: { name: order.buyerName, email: order.buyerEmail, phone: order.buyerPhone },
    shipping_address: {
      line1: order.shippingLine1,
      line2: order.shippingLine2,
      city: order.shippingCity,
      postcode: order.shippingPostcode,
      country: order.shippingCountry
    },
    items: order.items.map((i: any) => ({ product_id: i.productId, sku: i.sku, title: i.title, price: i.price, quantity: i.quantity })),
    tracking_number: order.trackingNumber,
    carrier: order.carrier,
    dispatched_at: order.dispatchedAt,
    cancelled_at: order.cancelledAt,
    cancel_reason: order.cancelReason,
    created_at: order.createdAt,
    updated_at: order.updatedAt
  }
}
