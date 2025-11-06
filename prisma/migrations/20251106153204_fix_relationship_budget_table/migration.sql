-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_clientId_fkey";

-- DropForeignKey
ALTER TABLE "budget" DROP CONSTRAINT "budget_sellerId_fkey";

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
