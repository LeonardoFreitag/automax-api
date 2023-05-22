/*
  Warnings:

  - You are about to drop the column `jog` on the `clientPaymentForm` table. All the data in the column will be lost.
  - Added the required column `job` to the `clientPaymentForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientPaymentForm" DROP COLUMN "jog",
ADD COLUMN     "job" TEXT NOT NULL;
