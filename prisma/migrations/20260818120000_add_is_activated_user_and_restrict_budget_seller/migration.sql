-- Desativação de vendedor: bloqueia acesso ao app sem apagar o cadastro.
-- Default true para que todos os usuários existentes sigam ativos.
ALTER TABLE "user" ADD COLUMN "isActivated" BOOLEAN NOT NULL DEFAULT true;

-- budget.sellerId volta de CASCADE para RESTRICT.
--
-- O CASCADE foi introduzido em 20251106153204 (antes era RESTRICT, em
-- 20250417155715) e fazia com que apagar um vendedor apagasse junto todos os
-- orçamentos dele, com itens e formas de pagamento. Com a desativação acima
-- não há mais motivo para apagar vendedor, então o histórico volta a ser
-- protegido pelo banco.
ALTER TABLE "budget" DROP CONSTRAINT "budget_sellerId_fkey";

ALTER TABLE "budget" ADD CONSTRAINT "budget_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "user"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
