import { PontoConexao } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  TCreateConnectionPoint,
  TUpdateConnectionPoint,
} from "../schema/pointConnection.schema";

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
    ponto: TCreateConnectionPoint["ponto"],
  ): Promise<PontoConexao> => {
    const { endereco } = ponto;

    return await prisma.pontoConexao.create({
      data: {
        clienteId: clientId,
        planoId: ponto.planoId,
        loginMk: ponto.loginMK,
        senhaMk: ponto.senhaMK,
        diaVencimento: ponto.diaVencimento,
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

  update: async (
    connectionPointId: string,
    ponto: TUpdateConnectionPoint["ponto"],
  ): Promise<PontoConexao> => {
    const endereco = ponto?.endereco;

    return await prisma.pontoConexao.update({
      where: { id: connectionPointId },
      data: {
        ...(ponto?.planoId && { planoId: ponto.planoId }),
        ...(ponto?.loginMK && { loginMk: ponto.loginMK }),
        ...(ponto?.diaVencimento && { diaVencimento: ponto.diaVencimento }),
        ...(endereco && {
          complemento: endereco.complemento ?? null,
          latitude: endereco.latitude ?? null,
          longitude: endereco.longitude ?? null,
          ...("tipoEndereco" in endereco &&
            endereco.tipoEndereco === "URBANO" && {
              tipoEndereco: endereco.tipoEndereco,
              cep: endereco.cep,
              cidade: endereco.cidade,
              bairro: endereco.bairro,
              rua: endereco.rua,
              numero: String(endereco.numero),
            }),
          ...("tipoEndereco" in endereco &&
            endereco.tipoEndereco === "RURAL" && {
              tipoEndereco: endereco.tipoEndereco,
              nomeLocal: endereco.nomeLocal,
              cidadeRefencia: endereco.cidadeReferencia,
            }),
        }),
      },
    });
  },
};
