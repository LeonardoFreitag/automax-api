/*
  Warnings:

  - You are about to drop the column `accepted` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `finished` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `refused` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `returned` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `sale` table. All the data in the column will be lost.
  - Added the required column `saleStatus` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale" DROP COLUMN "accepted",
DROP COLUMN "finished",
DROP COLUMN "refused",
DROP COLUMN "returned",
DROP COLUMN "sent",
ADD COLUMN     "saleStatus" TEXT NOT NULL;
