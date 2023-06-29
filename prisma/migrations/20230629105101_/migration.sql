/*
  Warnings:

  - Added the required column `productPriceId` to the `productTissue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "productTissue" DROP CONSTRAINT "productTissue_productId_fkey";

-- AlterTable
ALTER TABLE "productTissue" ADD COLUMN     "productPriceId" TEXT NOT NULL;
