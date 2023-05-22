-- DropForeignKey
ALTER TABLE "saleItems" DROP CONSTRAINT "saleItems_saleId_fkey";

-- DropForeignKey
ALTER TABLE "salePaymentForm" DROP CONSTRAINT "salePaymentForm_saleId_fkey";

-- AddForeignKey
ALTER TABLE "saleItems" ADD CONSTRAINT "saleItems_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePaymentForm" ADD CONSTRAINT "salePaymentForm_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
