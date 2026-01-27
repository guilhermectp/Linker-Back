// src/repository/plan.repository.ts
import { prisma } from "../config/prisma";
import { Plano } from "@prisma/client";
import { TCreatePlanInput, TUpdatePlanInput } from "../schema/plan.schema";

export const planRepository = {
  async createPlan(data: TCreatePlanInput): Promise<Plano> {
    return await prisma.plano.create({
      data: {
        nome: data.nome,
        uploadMB: data.uploadMB,
        downloadMB: data.downloadMB,
        valor: data.valor,
        descricao: data.descricao,
      },
    });
  },

  async getAllPlan(): Promise<Plano[]> {
    return await prisma.plano.findMany();
  },

  async getPlanByName(nome: string): Promise<Plano | null> {
    return await prisma.plano.findUnique({
      where: { nome },
    });
  },

  async updatePlan(data: TUpdatePlanInput): Promise<Plano> {
    return await prisma.plano.update({
      where: { nome: data.nome },
      data: {
        uploadMB: data.uploadMB,
        downloadMB: data.downloadMB,
        valor: data.valor,
        descricao: data.descricao,
      },
    });
  },

  async deletePlan(planName: string): Promise<Plano> {
    return await prisma.plano.delete({
      where: { nome: planName },
    });
  },
};
