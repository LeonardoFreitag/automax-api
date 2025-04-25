-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
