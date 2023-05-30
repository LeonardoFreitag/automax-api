/*
  Warnings:

  - You are about to drop the column `selerId` on the `sale` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale" DROP COLUMN "selerId",
ADD COLUMN     "sellerId" TEXT NOT NULL;
