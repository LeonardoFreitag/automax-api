/*
  Warnings:

  - Added the required column `customerId` to the `productTissue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productTissue" ADD COLUMN     "customerId" TEXT NOT NULL;
