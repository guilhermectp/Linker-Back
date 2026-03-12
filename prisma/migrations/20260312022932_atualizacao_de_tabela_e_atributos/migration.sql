/*
  Warnings:

  - The values [ATRASADO] on the enum `BoletoStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DESATIVADO] on the enum `ClienteStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `suporte` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `referente` to the `boleto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrdemServicoTipo" AS ENUM ('INSTALACAO', 'SUPORTE', 'CANCELAMENTO', 'TROCA_ENDERECO');

-- CreateEnum
CREATE TYPE "OrdemServicoStatus" AS ENUM ('AGENDADA', 'FINALIZADA', 'CANCELADA');

-- AlterEnum
BEGIN;
CREATE TYPE "BoletoStatus_new" AS ENUM ('PENDENTE', 'PAGO', 'VENCIDO', 'CANCELADO');
ALTER TABLE "public"."boleto" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "boleto" ALTER COLUMN "status" TYPE "BoletoStatus_new" USING ("status"::text::"BoletoStatus_new");
ALTER TYPE "BoletoStatus" RENAME TO "BoletoStatus_old";
ALTER TYPE "BoletoStatus_new" RENAME TO "BoletoStatus";
DROP TYPE "public"."BoletoStatus_old";
ALTER TABLE "boleto" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ClienteStatus_new" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');
ALTER TABLE "public"."cliente" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "cliente" ALTER COLUMN "status" TYPE "ClienteStatus_new" USING ("status"::text::"ClienteStatus_new");
ALTER TYPE "ClienteStatus" RENAME TO "ClienteStatus_old";
ALTER TYPE "ClienteStatus_new" RENAME TO "ClienteStatus";
DROP TYPE "public"."ClienteStatus_old";
ALTER TABLE "cliente" ALTER COLUMN "status" SET DEFAULT 'ATIVO';
COMMIT;

-- DropForeignKey
ALTER TABLE "pontoConexao" DROP CONSTRAINT "pontoConexao_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "suporte" DROP CONSTRAINT "suporte_pontoConexaoId_fkey";

-- AlterTable
ALTER TABLE "boleto" ADD COLUMN     "referente" TEXT NOT NULL;

-- DropTable
DROP TABLE "suporte";

-- DropEnum
DROP TYPE "SuporteStatus";

-- CreateTable
CREATE TABLE "ordemServico" (
    "id" TEXT NOT NULL,
    "tipo" "OrdemServicoTipo" NOT NULL,
    "status" "OrdemServicoStatus" NOT NULL DEFAULT 'AGENDADA',
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "pontoConexaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordemServico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pontoConexao" ADD CONSTRAINT "pontoConexao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordemServico" ADD CONSTRAINT "ordemServico_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "pontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
