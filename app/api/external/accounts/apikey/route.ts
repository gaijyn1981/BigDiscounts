import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== process.env.AVASAM_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized — invalid or missing API key' }, { status: 401 })
    }

    const { seller_email } = await req.json()

    if (!seller_email || typeof seller_email !== 'string') {
      return NextResponse.json({ error: 'seller_email is required' }, { status: 400 })
    }

    const seller = await prisma.seller.findUnique({ where: { email: seller_email } })
    if (!seller) {
      return NextResponse.json({ error: `No seller found with email: ${seller_email}` }, { status: 404 })
    }

    // Generate a unique API key for this seller
    const generatedKey = `BD-SELLER-${crypto.randomBytes(16).toString('hex').toUpperCase()}`

    return NextResponse.json({
      success: true,
      seller_email: seller.email,
      company_name: seller.companyName,
      api_key: generatedKey,
      message: 'API key generated successfully. Use this key in the x-api-key header for all API requests on behalf of this seller.',
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
