/*
  Warnings:

  - Added the required column `perCommission` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "perCommission" DECIMAL(15,2) NOT NULL;
