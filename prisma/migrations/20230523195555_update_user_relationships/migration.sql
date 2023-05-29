-- DropForeignKey
ALTER TABLE "userRefreshTokens" DROP CONSTRAINT "userRefreshTokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "userTokens" DROP CONSTRAINT "userTokens_userId_fkey";

-- AddForeignKey
ALTER TABLE "userTokens" ADD CONSTRAINT "userTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRefreshTokens" ADD CONSTRAINT "userRefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
