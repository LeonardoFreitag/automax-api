/*
  Warnings:

  - Added the required column `customerId` to the `phases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phases" ADD COLUMN     "customerId" TEXT NOT NULL;
