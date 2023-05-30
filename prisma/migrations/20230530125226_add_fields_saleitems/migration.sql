/*
  Warnings:

  - Added the required column `groupId` to the `saleItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `saleItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tissueId` to the `saleItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `underMeasure` to the `saleItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `widthSale` to the `saleItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "saleItems" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "originalPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "tissueId" TEXT NOT NULL,
ADD COLUMN     "underMeasure" BOOLEAN NOT NULL,
ADD COLUMN     "widthSale" DECIMAL(65,30) NOT NULL;
