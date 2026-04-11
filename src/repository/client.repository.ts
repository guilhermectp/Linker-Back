import { Cliente } from "@prisma/client";
import { prisma } from "../config/prisma";
import { TClientCreate, TClientUpdateInfo } from "../schema/client.schema";

export const clientRepository = {
  getAll: async () => {
    return await prisma.cliente.findMany({
      include: {
        pontosConexao: {
          include: {
            plano: true,
          },
        },
      },
    });
  },

  getById: async (id: string) => {
    return await prisma.cliente.findUnique({
      where: { id },
      include: {
        pontosConexao: {
          include: {
            plano: true,
          },
        },
      },
    });
  },

  getClientByCpf: async (cpf: string): Promise<Cliente | null> => {
    return await prisma.cliente.findUnique({
      where: { cpf },
    });
  },

  create: async (data: TClientCreate): Promise<Cliente> => {
    return await prisma.cliente.create({
      data,
    });
  },

  updatePersonalInfo: async (id: string, data: TClientUpdateInfo) => {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  },

  updateCustomerCentralPassword: async (id: string, hashedPassword: string) => {
    return prisma.cliente.update({
      where: { id },
      data: {
        senhaCentralCliente: hashedPassword,
      },
    });
  },

  deleteById: async (id: string) => {
    return await prisma.cliente.delete({
      where: { id },
    });
  },
};
