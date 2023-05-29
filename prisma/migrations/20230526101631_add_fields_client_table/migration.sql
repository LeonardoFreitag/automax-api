/*
  Warnings:

  - Added the required column `sellerId` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "client" ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
