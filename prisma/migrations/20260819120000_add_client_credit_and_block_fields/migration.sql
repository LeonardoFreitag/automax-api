-- Campos que o cadastro do ERP sempre teve e a integração nunca levou.
--
-- Todos opcionais com default seguro: a carga atual, que não os envia, continua
-- funcionando sem alteração, e nenhum cliente existente fica bloqueado ou com
-- limite zerado por engano — `blocked` nasce false e os limites em 0, que os
-- consumidores tratam como "sem limite definido".
--
-- `blocked` é decisão manual da retaguarda e é intencionalmente separado de
-- `financialPendency`, que é calculada pelo contas a receber. Colapsados num
-- campo só, o app não conseguia dar a mensagem certa.
ALTER TABLE "client" ADD COLUMN "creditLimit" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "client" ADD COLUMN "discountRate" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "client" ADD COLUMN "initialDiscountLimit" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "client" ADD COLUMN "blocked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "client" ADD COLUMN "blockReason" TEXT NOT NULL DEFAULT '';
