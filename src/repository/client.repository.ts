import { Cliente, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { TClientCreate, TClientUpdateInfo } from "../schema/client.schema";
import { TClienteFilters } from "../types/client";

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

  getPaginated: async ({
    pagina,
    itemsPorPagina,
    busca,
    situacao,
    tipoEndereco,
  }: TClienteFilters & { pagina: number; itemsPorPagina: number }) => {
    const where: Prisma.ClienteWhereInput = {
      ...(situacao ? { status: situacao } : {}),
      ...(tipoEndereco
        ? {
            pontosConexao: {
              some: { tipoEndereco },
            },
          }
        : {}),
      ...(busca
        ? {
            OR: [
              { nome: { contains: busca, mode: "insensitive" } },
              { cpf: { contains: busca, mode: "insensitive" } },
              {
                pontosConexao: {
                  some: {
                    loginMk: { contains: busca, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [clients, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip: (pagina - 1) * itemsPorPagina,
        take: itemsPorPagina,
        include: {
          pontosConexao: {
            include: { plano: true },
          },
        },
      }),

      prisma.cliente.count({ where }),
    ]);

    return { clients, total };
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
