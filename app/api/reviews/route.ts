import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const sellerId = searchParams.get("sellerId");
  const sellerEmail = searchParams.get("sellerEmail");

  if (!productId && !sellerId && !sellerEmail) {
    return NextResponse.json({ error: "productId, sellerId, or sellerEmail required" }, { status: 400 });
  }

  try {
    let where: Record<string, string> = {};
    if (productId) {
      where = { productId };
    } else if (sellerId) {
      where = { sellerId };
    } else if (sellerEmail) {
      const seller = await prisma.seller.findUnique({ where: { email: sellerEmail } });
      if (!seller) return NextResponse.json([]);
      where = { sellerId: seller.id };
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, sellerId, buyerName, rating, comment } = body;

    if (!productId || !sellerId || !buyerName || !rating || !comment) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }
    if (comment.length > 1000) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        sellerId,
        buyerName: buyerName.trim().substring(0, 60),
        rating: parseInt(rating),
        comment: comment.trim(),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
