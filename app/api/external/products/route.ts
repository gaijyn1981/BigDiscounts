import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Valid categories
const VALID_CATEGORIES = [
  'Electronics & Tech', 'Phone & Accessories', 'Clothing & Fashion',
  'Home & Living', 'Garden & Outdoor', 'Pets', 'Baby & Kids',
  'Health & Beauty', 'Toys & Games', 'Sports & Fitness', 'Food & Drink',
  'Books & Stationery', 'Tools & DIY', 'Automotive', 'Arts & Crafts',
  'Office & Business', 'Gifts & Seasonal', 'Cleaning & Household', 'Other'
]

export async function POST(req: Request) {
  try {
    // API key authentication
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const body = await req.json()
    const { seller_email, title, description, price, category, photos, delivery_time } = body

    // Validate required fields
    if (!seller_email || typeof seller_email !== 'string') {
      return NextResponse.json({ error: 'seller_email is required' }, { status: 400 })
    }
    if (!title || typeof title !== 'string' || title.length > 200) {
      return NextResponse.json({ error: 'title is required (max 200 characters)' }, { status: 400 })
    }
    if (!description || typeof description !== 'string' || description.length > 2000) {
      return NextResponse.json({ error: 'description is required (max 2000 characters)' }, { status: 400 })
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return NextResponse.json({ error: 'price must be a positive number' }, { status: 400 })
    }
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Invalid category. Valid options: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 })
    }
    if (photos && (!Array.isArray(photos) || photos.length > 4)) {
      return NextResponse.json({ error: 'photos must be an array of up to 4 URLs' }, { status: 400 })
    }

    // Find seller by email
    const seller = await prisma.seller.findUnique({ where: { email: seller_email } })
    if (!seller) {
      return NextResponse.json({ error: `No seller found with email: ${seller_email}` }, { status: 404 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title,
        description,
        price: parseFloat(price),
        category: category || null,
        deliveryTime: delivery_time || null,
        photos: JSON.stringify(photos || []),
        active: false // Requires seller to activate via subscription
      }
    })

    return NextResponse.json({
      success: true,
      product_id: product.id,
      title: product.title,
      price: product.price,
      status: 'pending_activation',
      message: 'Product created successfully. The seller must activate it via their BigDiscounts subscription.',
      product_url: `https://www.bigdiscounts.uk/product/${product.id}`
    }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const seller_email = searchParams.get('seller_email')

    if (!seller_email) {
      return NextResponse.json({ error: 'seller_email query parameter is required' }, { status: 400 })
    }

    const seller = await prisma.seller.findUnique({
      where: { email: seller_email },
      include: {
        products: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!seller) {
      return NextResponse.json({ error: `No seller found with email: ${seller_email}` }, { status: 404 })
    }

    return NextResponse.json({
      seller_email: seller.email,
      company: seller.companyName,
      products: seller.products.map(p => ({
        product_id: p.id,
        title: p.title,
        price: p.price,
        category: p.category,
        active: p.active,
        product_url: `https://www.bigdiscounts.uk/product/${p.id}`
      }))
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
