/*
  Warnings:

  - Added the required column `increment` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale" ADD COLUMN     "increment" DECIMAL(65,30) NOT NULL;
