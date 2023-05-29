/*
  Warnings:

  - You are about to drop the column `isComissioned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `perCommission` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "isComissioned",
DROP COLUMN "perCommission";
