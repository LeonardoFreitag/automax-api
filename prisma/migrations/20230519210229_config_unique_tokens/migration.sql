/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `userRefreshTokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `userTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userRefreshTokens_refreshToken_key" ON "userRefreshTokens"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "userTokens_token_key" ON "userTokens"("token");
