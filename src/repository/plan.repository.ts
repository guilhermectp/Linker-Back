import { prisma } from "../config/prisma";
import { Plano, Prisma } from "@prisma/client";
import { TCreatePlanInput, TUpdatePlanInput } from "../schema/plan.schema";

export const planRepository = {
  getAll: async (): Promise<Plano[]> => {
    return await prisma.plano.findMany();
  },

  getPlanById: async (id: string): Promise<Plano | null> => {
    return await prisma.plano.findUnique({
      where: { id },
    });
  },

  getPlanByName: async (nome: string): Promise<Plano | null> => {
    return await prisma.plano.findUnique({
      where: { nome },
    });
  },

  create: async (data: TCreatePlanInput): Promise<Plano> => {
    return await prisma.plano.create({
      data: {
        nome: data.nome,
        uploadMB: data.uploadMB,
        downloadMB: data.downloadMB,
        valor: new Prisma.Decimal(data.valor),
        descricao: data.descricao,
      },
    });
  },

  countUsage: async (planoId: string): Promise<number> => {
    return await prisma.pontoConexao.count({
      where: { planoId },
    });
  },

  update: async (
    originalName: string,
    data: TUpdatePlanInput,
  ): Promise<Plano> => {
    const updateData: any = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.uploadMB !== undefined) updateData.uploadMB = data.uploadMB;
    if (data.downloadMB !== undefined) updateData.downloadMB = data.downloadMB;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;

    if (data.valor !== undefined) {
      updateData.valor = new Prisma.Decimal(data.valor);
    }

    return await prisma.plano.update({
      where: { nome: originalName },
      data: updateData,
    });
  },

  delete: async (planName: string): Promise<Plano> => {
    return await prisma.plano.delete({
      where: { nome: planName },
    });
  },
};
