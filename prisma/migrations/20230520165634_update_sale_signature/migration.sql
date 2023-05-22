-- AlterTable
ALTER TABLE "sale" ALTER COLUMN "signatureFileName" DROP NOT NULL,
ALTER COLUMN "signatureUrl" DROP NOT NULL,
ALTER COLUMN "signatureBase64" DROP NOT NULL;
