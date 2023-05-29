-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
