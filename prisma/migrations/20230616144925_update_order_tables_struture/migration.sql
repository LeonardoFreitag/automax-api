/*
  Warnings:

  - You are about to drop the column `canceled` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `finished` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `orderItemsId` on the `orderItemsPhases` table. All the data in the column will be lost.
  - You are about to drop the `orderItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagProductId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagProductName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagReference` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagSellerName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagStatus` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagTissueName` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeName` to the `orderItemsPhases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `orderItemsPhases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phaseName` to the `orderItemsPhases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "orderItemsPhases" DROP CONSTRAINT "orderItemsPhases_orderItemsId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "canceled",
DROP COLUMN "finished",
DROP COLUMN "userId",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tagId" TEXT NOT NULL,
ADD COLUMN     "tagProductId" TEXT NOT NULL,
ADD COLUMN     "tagProductName" TEXT NOT NULL,
ADD COLUMN     "tagReference" TEXT NOT NULL,
ADD COLUMN     "tagSellerName" TEXT NOT NULL,
ADD COLUMN     "tagStatus" TEXT NOT NULL,
ADD COLUMN     "tagTissueName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItemsPhases" DROP COLUMN "orderItemsId",
ADD COLUMN     "employeeName" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "phaseName" TEXT NOT NULL;

-- DropTable
DROP TABLE "orderItems";

-- AddForeignKey
ALTER TABLE "orderItemsPhases" ADD CONSTRAINT "orderItemsPhases_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
