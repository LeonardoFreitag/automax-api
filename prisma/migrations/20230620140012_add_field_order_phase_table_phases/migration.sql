/*
  Warnings:

  - Added the required column `orderPhase` to the `phases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phases" ADD COLUMN     "orderPhase" INTEGER NOT NULL;
