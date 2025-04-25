-- CreateTable
CREATE TABLE "clientTemp" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "comercialName" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "ie" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientTemp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientContactTemp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fone" TEXT NOT NULL,
    "foneType" TEXT NOT NULL,
    "isWhatsApp" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientTempId" TEXT NOT NULL,

    CONSTRAINT "clientContactTemp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clientContactTemp" ADD CONSTRAINT "clientContactTemp_clientTempId_fkey" FOREIGN KEY ("clientTempId") REFERENCES "clientTemp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
