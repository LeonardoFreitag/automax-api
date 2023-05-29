/*
  Warnings:

  - You are about to drop the column `addtitionalPercentage` on the `productPrice` table. All the data in the column will be lost.
  - Added the required column `additionalPercentage` to the `productPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productPrice" DROP COLUMN "addtitionalPercentage",
ADD COLUMN     "additionalPercentage" DECIMAL(65,30) NOT NULL;
