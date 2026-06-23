import { PontoConexao } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  TConnectionPointAddress,
  TConnectionPointCreate,
} from "../schema/connectionPoint.schema";

export const connectionPointRepository = {
  getByLoginMk: async (loginMk: string) => {
    return await prisma.pontoConexao.findUnique({
      where: { loginMk },
    });
  },

  getById: async (id: string): Promise<PontoConexao | null> => {
    return await prisma.pontoConexao.findUnique({
      where: { id },
    });
  },

  create: async (
    clientId: string,
    ponto: TConnectionPointCreate,
  ): Promise<PontoConexao> => {
    const { endereco, plano, microtik } = ponto;

    return await prisma.pontoConexao.create({
      data: {
        clienteId: clientId,
        planoId: plano.planoId,
        diaVencimento: plano.diaVencimento,
        loginMk: microtik.loginMK,
        senhaMk: microtik.senhaMK,
        tipoEndereco: endereco.tipoEndereco,
        complemento: endereco.complemento,
        latitude: endereco.latitude ?? null,
        longitude: endereco.longitude ?? null,
        ...(endereco.tipoEndereco === "URBANO" && {
          cep: endereco.cep,
          cidade: endereco.cidade,
          bairro: endereco.bairro,
          rua: endereco.rua,
          numero: String(endereco.numero),
        }),
        ...(endereco.tipoEndereco === "RURAL" && {
          nomeLocal: endereco.nomeLocal,
          cidadeRefencia: endereco.cidadeReferencia,
        }),
      },
    });
  },

  updatePlan: async (
    connectionPointId: string,
    data: Partial<Pick<PontoConexao, "planoId" | "diaVencimento">>,
  ): Promise<PontoConexao> => {
    return await prisma.pontoConexao.update({
      where: { id: connectionPointId },
      data: {
        ...(data.planoId && { planoId: data.planoId }),
        ...(data.diaVencimento && { diaVencimento: data.diaVencimento }),
      },
    });
  },

  updateMicrotik: async (
    connectionPointId: string,
    data: { loginMK?: string; senhaMK?: string },
  ): Promise<PontoConexao> => {
    return await prisma.pontoConexao.update({
      where: { id: connectionPointId },
      data: {
        ...(data.loginMK && { loginMk: data.loginMK }),
        ...(data.senhaMK && { senhaMk: data.senhaMK }),
      },
    });
  },

  updateAddress: async (
    connectionPointId: string,
    data: Partial<TConnectionPointAddress>,
  ): Promise<PontoConexao> => {
    return await prisma.pontoConexao.update({
      where: { id: connectionPointId },
      data: {
        ...(data.tipoEndereco && { tipoEndereco: data.tipoEndereco }),
        complemento: data.complemento ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        ...(data.tipoEndereco === "URBANO" && {
          cep: data.cep,
          cidade: data.cidade,
          bairro: data.bairro,
          rua: data.rua,
          numero: String(data.numero),
          nomeLocal: null,
          cidadeRefencia: null,
        }),
        ...(data.tipoEndereco === "RURAL" && {
          nomeLocal: data.nomeLocal,
          cidadeRefencia: data.cidadeReferencia,
          cep: null,
          cidade: null,
          bairro: null,
          rua: null,
          numero: null,
        }),
      },
    });
  },

  delete: async (connectionPointId: string): Promise<PontoConexao> => {
    return await prisma.pontoConexao.delete({
      where: { id: connectionPointId },
    });
  },
};
