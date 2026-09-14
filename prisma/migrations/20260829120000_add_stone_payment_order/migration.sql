-- Fila de pedidos de pagamento na maquininha Stone SmartPOS.
--
-- Tabela nova e isolada: nada existente é alterado, então a migração é
-- reversível na prática (basta dropar) e não afeta a carga do ERP nem o app.

CREATE TABLE "stonePaymentOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "terminalId" TEXT NOT NULL,
    "externalRef" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "installmentType" TEXT,
    "installmentCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "cancelRequested" BOOLEAN NOT NULL DEFAULT false,
    "mode" TEXT NOT NULL DEFAULT 'attended',
    "description" TEXT,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumedBySale" TEXT,
    "authorizationCode" TEXT,
    "brand" TEXT,
    "atk" TEXT,
    "itk" TEXT,
    "panMasked" TEXT,
    "entryMode" TEXT,
    "cardholderName" TEXT,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stonePaymentOrder_pkey" PRIMARY KEY ("id")
);

-- Consulta quente: o app Android faz polling a cada ~2s por terminal e status.
CREATE INDEX "stonePaymentOrder_terminalId_status_expiresAt_idx"
    ON "stonePaymentOrder" ("terminalId", "status", "expiresAt");

-- Usada pela Etapa 2 (listar aprovados não consumidos de um customer).
CREATE INDEX "stonePaymentOrder_customerId_status_idx"
    ON "stonePaymentOrder" ("customerId", "status");
