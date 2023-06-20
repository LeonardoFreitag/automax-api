-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
