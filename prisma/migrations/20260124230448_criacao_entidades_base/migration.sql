-- CreateEnum
CREATE TYPE "ClienteStatus" AS ENUM ('ATIVO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PlanoStatus" AS ENUM ('ATIVO', 'REDUZIDO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "BoletoStatus" AS ENUM ('PAGO', 'PENDENTE', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SuporteStatus" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'CANCELADO', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT NOT NULL,
    "senhaCentralCliente" TEXT NOT NULL,
    "status" "ClienteStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PontoConexao" (
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

    CONSTRAINT "PontoConexao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "uploadMB" INTEGER NOT NULL,
    "downloadMB" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boleto" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "BoletoStatus" NOT NULL DEFAULT 'PENDENTE',
    "linkBoleto" TEXT,
    "pontoConexaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suporte" (
    "id" SERIAL NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "SuporteStatus" NOT NULL DEFAULT 'ABERTO',
    "pontoConexaoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PontoConexao_loginMk_key" ON "PontoConexao"("loginMk");

-- CreateIndex
CREATE UNIQUE INDEX "Plano_nome_key" ON "Plano"("nome");

-- AddForeignKey
ALTER TABLE "PontoConexao" ADD CONSTRAINT "PontoConexao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PontoConexao" ADD CONSTRAINT "PontoConexao_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "PontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suporte" ADD CONSTRAINT "Suporte_pontoConexaoId_fkey" FOREIGN KEY ("pontoConexaoId") REFERENCES "PontoConexao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
