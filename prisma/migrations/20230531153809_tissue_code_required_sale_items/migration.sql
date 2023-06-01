/*
  Warnings:

  - Made the column `tissueCode` on table `saleItems` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "saleItems" ALTER COLUMN "tissueCode" SET NOT NULL;
