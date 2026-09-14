-- Estorno (cancellation) na fila da SmartPOS.
--
-- Aditivo: todo pedido já gravado é "payment" pelo default, e os campos novos
-- ficam nulos. Nada muda para o PDV nem para o app enquanto não usarem
-- operation="cancellation".

ALTER TABLE "stonePaymentOrder" ADD COLUMN "operation" TEXT NOT NULL DEFAULT 'payment';
ALTER TABLE "stonePaymentOrder" ADD COLUMN "targetPaymentId" TEXT;
ALTER TABLE "stonePaymentOrder" ADD COLUMN "targetAtk" TEXT;
ALTER TABLE "stonePaymentOrder" ADD COLUMN "refundedByOrderId" TEXT;

-- "já existe estorno em andamento/aprovado para este pagamento?" — checado a
-- cada POST de cancellation.
CREATE INDEX "stonePaymentOrder_targetPaymentId_idx" ON "stonePaymentOrder" ("targetPaymentId");
