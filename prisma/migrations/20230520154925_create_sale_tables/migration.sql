-- CreateTable
CREATE TABLE "sale" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "selerId" TEXT NOT NULL,
    "saleNumber" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "refused" BOOLEAN NOT NULL,
    "refusedNotes" TEXT NOT NULL,
    "returned" BOOLEAN NOT NULL,
    "returnedNotes" TEXT NOT NULL,
    "signatureFileName" TEXT NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "signatureBase64" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saleItems" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unity" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saleItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salePaymentForm" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "paymentFormId" TEXT NOT NULL,
    "descripriont" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "installments" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salePaymentForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saleItems" ADD CONSTRAINT "saleItems_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePaymentForm" ADD CONSTRAINT "salePaymentForm_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
