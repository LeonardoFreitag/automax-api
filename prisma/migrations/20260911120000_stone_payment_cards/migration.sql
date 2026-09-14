-- Cards de cobrança (delivery) na fila da SmartPOS — Etapa 2.
--
-- mode/description/consumed/consumedBySale já existiam desde a criação da
-- tabela (reservados). Entra só o carimbo de consumo e o índice da lista de
-- cards. Aditivo: nada muda para pagamentos attended já gravados.

ALTER TABLE "stonePaymentOrder" ADD COLUMN "consumedAt" TIMESTAMP(3);

CREATE INDEX "stonePaymentOrder_customerId_mode_status_consumed_idx"
    ON "stonePaymentOrder" ("customerId", "mode", "status", "consumed");
