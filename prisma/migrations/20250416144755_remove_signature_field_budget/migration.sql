/*
  Warnings:

  - You are about to drop the column `signatureBase64` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `signatureFileName` on the `budget` table. All the data in the column will be lost.
  - You are about to drop the column `signatureUrl` on the `budget` table. All the data in the column will be lost.
  - Added the required column `budgetExpiration` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget" DROP COLUMN "signatureBase64",
DROP COLUMN "signatureFileName",
DROP COLUMN "signatureUrl",
ADD COLUMN     "budgetExpiration" TIMESTAMP(3) NOT NULL;
