/*
  Warnings:

  - You are about to drop the column `jog` on the `clientContact` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `clientPaymentForm` table. All the data in the column will be lost.
  - You are about to drop the column `job` on the `clientPaymentForm` table. All the data in the column will be lost.
  - Added the required column `job` to the `clientContact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientContact" DROP COLUMN "jog",
ADD COLUMN     "job" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clientPaymentForm" DROP COLUMN "email",
DROP COLUMN "job";
