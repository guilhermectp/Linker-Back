import { Cliente } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  TCreateClient,
  TUpdateClientConnectionPointAddress,
  TUpdateClientConnectionPointPlan,
  TUpdateClientPersonalInfo,
} from "../schema/client.schema";

export const clientRepository = {
  getAllClient: async (): Promise<Cliente[]> => {
    return await prisma.cliente.findMany();
  },

  getClientById: async (id: string): Promise<Cliente | null> => {
    return await prisma.cliente.findUnique({
      where: { id },
    });
  },

  getClientByCpf: async (cpf: string): Promise<Cliente | null> => {
    return await prisma.cliente.findUnique({
      where: { cpf },
    });
  },

  createClient: async (data: TCreateClient): Promise<Cliente> => {
    return await prisma.cliente.create({
      data,
    });
  },

  updatePersonalInfo: async (id: string, data: TUpdateClientPersonalInfo) => {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  },

  updateConnectionPoint: async (
    connectionPointId: string,
    data: TUpdateClientConnectionPointPlan,
  ) => {
    return prisma.cliente.update({
      where: { id: connectionPointId },
      data,
    });
  },
};
