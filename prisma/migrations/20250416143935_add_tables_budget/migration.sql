-- CreateTable
CREATE TABLE "budget" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "budgetNumber" TEXT NOT NULL,
    "budgetDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "increment" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "budgetStatus" TEXT NOT NULL,
    "refusedNotes" TEXT NOT NULL,
    "returnedNotes" TEXT NOT NULL,
    "signatureFileName" TEXT,
    "signatureUrl" TEXT,
    "signatureBase64" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetItems" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unity" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "tableCode" TEXT,
    "tableName" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "originalPrice" DECIMAL(65,30) NOT NULL,
    "groupId" TEXT NOT NULL,
    "groupName" TEXT,
    "tissueId" TEXT NOT NULL,
    "tissueCode" TEXT NOT NULL,
    "tissueName" TEXT,
    "underMeasure" BOOLEAN NOT NULL,
    "widthSale" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "budgetId" TEXT NOT NULL,

    CONSTRAINT "budgetItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgetPaymentForm" (
    "id" TEXT NOT NULL,
    "paymentFormId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "installments" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "budgetId" TEXT NOT NULL,

    CONSTRAINT "budgetPaymentForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetItems" ADD CONSTRAINT "budgetItems_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgetPaymentForm" ADD CONSTRAINT "budgetPaymentForm_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
