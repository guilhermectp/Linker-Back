/*
  Warnings:

  - The values [CANCELADO] on the enum `ClienteStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ABERTO] on the enum `SuporteStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `boleto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `plano` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pontoConexao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `status` column on the `pontoConexao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `suporte` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `clienteId` to the `boleto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoEndereco` to the `pontoConexao` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConexaoStatus" AS ENUM ('ATIVO', 'REDUZIDO', 'BLOQUEADO', 'CANCELADO');

-- AlterEnum
BEGIN;
CREATE TYPE "ClienteStatus_new" AS ENUM ('ATIVO', 'DESATIVADO');
ALTER TABLE "public"."cliente" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "cliente" ALTER COLUMN "status" TYPE "ClienteStatus_new" USING ("status"::text::"ClienteStatus_new");
ALTER TYPE "ClienteStatus" RENAME TO "ClienteStatus_old";
ALTER TYPE "ClienteStatus_new" RENAME TO "ClienteStatus";
DROP TYPE "public"."ClienteStatus_old";
ALTER TABLE "cliente" ALTER COLUMN "status" SET DEFAULT 'ATIVO';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SuporteStatus_new" AS ENUM ('EM_ABERTO', 'EM_ANDAMENTO', 'CANCELADO', 'FINALIZADO');
ALTER TABLE "public"."suporte" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "suporte" ALTER COLUMN "status" TYPE "SuporteStatus_new" USING ("status"::text::"SuporteStatus_new");
ALTER TYPE "SuporteStatus" RENAME TO "SuporteStatus_old";
ALTER TYPE "SuporteStatus_new" RENAME TO "SuporteStatus";
DROP TYPE "public"."SuporteStatus_old";
ALTER TABLE "suporte" ALTER COLUMN "status" SET DEFAULT 'EM_ABERTO';
COMMIT;

-- DropForeignKey
ALTER TABLE "boleto" DROP CONSTRAINT "boleto_pontoConexaoId_fkey";

-- DropForeignKey
ALTER TABLE "pontoConexao" DROP CONSTRAINT "pontoConexao_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "pontoConexao" DROP CONSTRAINT "pontoConexao_planoId_fkey";

-- DropForeignKey
ALTER TABLE "suporte" DROP CONSTRAINT "suporte_pontoConexaoId_fkey";

-- AlterTable
ALTER TABLE "boleto" DROP CONSTRAINT "boleto_pkey",
ADD COLUMN     "clienteId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pontoConexaoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "boleto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "boleto_id_seq";

-- AlterTable
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cliente_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cliente_id_seq";

-- AlterTable
ALTER TABLE "plano" DROP CONSTRAINT "plano_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "plano_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "plano_id_seq";

-- AlterTable
ALTER TABLE "pontoConexao" DROP CONSTRAINT "pontoConexao_pkey",
ADD COLUMN     "cidadeRefencia" TEXT,
ADD COLUMN     "nomeLocal" TEXT,
ADD COLUMN     "tipoEndereco" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ConexaoStatus" NOT NULL DEFAULT 'ATIVO',
ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "cidade" DROP NOT NULL,
ALTER COLUMN "bairro" DROP NOT NULL,
ALTER COLUMN "rua" DROP NOT NULL,
ALTER COLUMN "numero" DROP NOT NULL,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
ALTER COLUMN "planoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "pontoConexao_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pontoConexao_id_seq";

-- AlterTable
ALTER TABLE "suporte" DROP CONSTRAINT "suporte_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'EM_ABERTO',
ALTER COLUMN "pontoConexaoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "suporte_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "suporte_id_seq";

-- DropEnum
DROP TYPE "PlanoStatus";

-- AddForeignKey
ALTER TABLE "pontoConexao" ADD CONSTRAINT "pontoConexao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pontoConexao" ADD CONSTRAINT "pontoConexao_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boleto" ADD CONSTRAINT "boleto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boleto" ADD CONSTRAINT "boleto_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "pontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suporte" ADD CONSTRAINT "suporte_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "pontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
