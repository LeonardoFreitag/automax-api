-- Situação do produto de venda e da matéria-prima.
--
-- Aditivo e com default seguro: todo produto já gravado nasce ativo, então a
-- carga atual do ERP e o app continuam enxergando exatamente o que enxergavam
-- antes desta migração.

ALTER TABLE "product" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "stockProduct" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- As listagens do app passam a filtrar por isActive. Sem índice, o filtro vira
-- seq scan no catálogo inteiro a cada abertura de tela de produto.
CREATE INDEX "product_customerId_isActive_idx" ON "product" ("customerId", "isActive");

CREATE INDEX "stockProduct_customerId_isActive_idx" ON "stockProduct" ("customerId", "isActive");
