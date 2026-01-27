/*
  Warnings:

  - You are about to drop the `Boleto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plano` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PontoConexao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Suporte` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Boleto" DROP CONSTRAINT "Boleto_pontoConexaoId_fkey";

-- DropForeignKey
ALTER TABLE "PontoConexao" DROP CONSTRAINT "PontoConexao_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "PontoConexao" DROP CONSTRAINT "PontoConexao_planoId_fkey";

-- DropForeignKey
ALTER TABLE "Suporte" DROP CONSTRAINT "Suporte_pontoConexaoId_fkey";

-- DropTable
DROP TABLE "Boleto";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Plano";

-- DropTable
DROP TABLE "PontoConexao";

-- DropTable
DROP TABLE "Suporte";

-- CreateTable
CREATE TABLE "cliente" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "senhaCentralCliente" TEXT NOT NULL,
    "status" "ClienteStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pontoConexao" (
    "id" SERIAL NOT NULL,
    "status" "PlanoStatus" NOT NULL DEFAULT 'ATIVO',
    "diaVencimento" INTEGER NOT NULL,
    "dataUltimoPagamento" TIMESTAMP(3),
    "loginMk" TEXT NOT NULL,
    "senhaMk" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "clienteId" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pontoConexao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "uploadMB" INTEGER NOT NULL,
    "downloadMB" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boleto" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "BoletoStatus" NOT NULL DEFAULT 'PENDENTE',
    "linkBoleto" TEXT,
    "pontoConexaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suporte" (
    "id" SERIAL NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "SuporteStatus" NOT NULL DEFAULT 'ABERTO',
    "pontoConexaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_cpf_key" ON "cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pontoConexao_loginMk_key" ON "pontoConexao"("loginMk");

-- CreateIndex
CREATE UNIQUE INDEX "plano_nome_key" ON "plano"("nome");

-- AddForeignKey
ALTER TABLE "pontoConexao" ADD CONSTRAINT "pontoConexao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pontoConexao" ADD CONSTRAINT "pontoConexao_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boleto" ADD CONSTRAINT "boleto_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "pontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suporte" ADD CONSTRAINT "suporte_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "pontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
