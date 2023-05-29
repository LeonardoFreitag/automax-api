/*
  Warnings:

  - Added the required column `maxWidth` to the `productPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minWidth` to the `productPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productPrice" ADD COLUMN     "maxWidth" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "minWidth" DECIMAL(65,30) NOT NULL;
