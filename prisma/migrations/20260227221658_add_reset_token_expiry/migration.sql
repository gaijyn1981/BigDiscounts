-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
