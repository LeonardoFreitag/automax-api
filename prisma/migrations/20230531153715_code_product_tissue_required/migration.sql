/*
  Warnings:

  - Made the column `code` on table `productTissue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "productTissue" ALTER COLUMN "code" SET NOT NULL;
