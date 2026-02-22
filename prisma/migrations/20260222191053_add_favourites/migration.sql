-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_buyerEmail_productId_key" ON "Favourite"("buyerEmail", "productId");
