/*
  Warnings:

  - You are about to drop the column `descripriont` on the `salePaymentForm` table. All the data in the column will be lost.
  - Added the required column `description` to the `salePaymentForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "salePaymentForm" DROP COLUMN "descripriont",
ADD COLUMN     "description" TEXT NOT NULL;
