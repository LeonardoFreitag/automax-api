-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_customerId_fkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
