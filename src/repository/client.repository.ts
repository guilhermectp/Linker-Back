import { Cliente } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  TCreateClient,
  TUpdateClientPersonalInfo,
} from "../schema/client.schema";

export const clientRepository = {
  getAllClient: async () => {
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

  getClientById: async (id: string) => {
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

  updateCustomerCentralPassword: async (id: string, hashedPassword: string) => {
    return prisma.cliente.update({
      where: { id },
      data: {
        senhaCentralCliente: hashedPassword,
      },
    });
  },

  deleteClientById: async (id: string) => {
    return await prisma.cliente.delete({
      where: { id },
    });
  },
};
