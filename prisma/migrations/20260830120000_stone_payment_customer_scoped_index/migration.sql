-- A fila da SmartPOS passou a ser consultada por (customerId, terminalId): o
-- terminalId é configurado à mão no aparelho e pode repetir entre clientes, o
-- que faria um terminal enxergar pedido de outro customer.
--
-- Migração separada (e não edição da anterior) porque a de criação da tabela
-- pode já ter sido aplicada; com IF EXISTS/IF NOT EXISTS esta roda nos dois
-- cenários.

DROP INDEX IF EXISTS "stonePaymentOrder_terminalId_status_expiresAt_idx";

CREATE INDEX IF NOT EXISTS "stonePaymentOrder_customerId_terminalId_status_expiresAt_idx"
    ON "stonePaymentOrder" ("customerId", "terminalId", "status", "expiresAt");
