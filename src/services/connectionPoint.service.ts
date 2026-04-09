import {
  ServiceErrorCode,
  serviceError,
  serviceSuccess,
} from "../utils/send-response";
import { connectionPointRepository } from "../repository/connectionPoint.repository";
import { encrypt } from "../utils/encrypt-mk-password";
import {
  TCreateConnectionPoint,
  TUpdateConnectionPoint,
} from "../schema/pointConnection.schema";
import { planRepository } from "../repository/plan.repository";
import { TResPontoConexao } from "../types/connectionPoint";
import { clientIntegration } from "../integration/client.integration";

export const connectionPointService = {
  create: async (clientId: string, connectionPoint: TCreateConnectionPoint) => {
    const built =
      await connectionPointService.buildConnectionPointData(connectionPoint);

    if (!("data" in built)) return built;

    const { ponto } = built.data;

    const createdPonto = await connectionPointRepository.create(
      clientId,
      ponto,
    );

    return serviceSuccess(
      {
        message: "Ponto de Conexão adicionado.",
        ponto: {
          id: createdPonto.id,
          status: createdPonto.status,
          diaVencimento: createdPonto.diaVencimento,
          dataUltimoPagamento: createdPonto.dataUltimoPagamento,
          loginMk: createdPonto.loginMk,
          clienteId: createdPonto.clienteId,
          planoId: createdPonto.planoId,
          createdAt: createdPonto.createdAt,
          updatedAt: createdPonto.updatedAt,
          endereco: connectionPointService.formatAddress(createdPonto),
        },
      },
      true,
    );
  },

  update: async (
    connectionPointId: string,
    data: Partial<TUpdateConnectionPoint>,
  ) => {
    if (!data.ponto || Object.keys(data.ponto).length === 0)
      return serviceError(
        ServiceErrorCode.UNPROCESSABLE,
        "Nenhum campo para atualizar.",
      );

    const { ponto } = data;

    const pontoAtual =
      await connectionPointRepository.getById(connectionPointId);

    if (!pontoAtual)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Ponto de Conexão não encontrado.",
      );

    const updatedPonto = await connectionPointRepository.update(
      connectionPointId,
      ponto,
    );

    if (ponto.planoId) {
      const plano = await planRepository.getPlanById(ponto.planoId);

      if (!plano)
        return serviceError(
          ServiceErrorCode.NOT_FOUND,
          "Plano não encontrado.",
        );

      try {
        await clientIntegration.update(pontoAtual.loginMk, {
          profile: plano.nome,
        });
      } catch (error) {
        await connectionPointRepository.update(connectionPointId, {
          planoId: pontoAtual.planoId,
        });

        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Erro ao atualizar plano no MikroTik.",
        );
      }
    }

    return serviceSuccess({
      message: "Ponto de Conexão atualizado.",
      ponto: {
        id: updatedPonto.id,
        status: updatedPonto.status,
        diaVencimento: updatedPonto.diaVencimento,
        dataUltimoPagamento: updatedPonto.dataUltimoPagamento,
        loginMk: updatedPonto.loginMk,
        clienteId: updatedPonto.clienteId,
        planoId: updatedPonto.planoId,
        createdAt: updatedPonto.createdAt,
        updatedAt: updatedPonto.updatedAt,
        endereco: connectionPointService.formatAddress(updatedPonto),
      },
    });
  },

  buildConnectionPointData: async (connectionPoint: TCreateConnectionPoint) => {
    const loginExists = await connectionPointRepository.getByLoginMk(
      connectionPoint.ponto.loginMK,
    );

    if (loginExists)
      return serviceError(
        ServiceErrorCode.CONFLICT,
        "Este login MikroTik já está em uso.",
      );

    const plano = await planRepository.getPlanById(
      connectionPoint.ponto.planoId,
    );

    if (!plano)
      return serviceError(ServiceErrorCode.NOT_FOUND, "Plano não encontrado.");

    const encryptedMk = encrypt(connectionPoint.ponto.senhaMK);

    return serviceSuccess({
      ponto: {
        ...connectionPoint.ponto,
        senhaMK: encryptedMk,
      },
    });
  },

  formatAddress: (address: TResPontoConexao) => {
    return address.tipoEndereco === "URBANO"
      ? {
          tipoEndereco: address.tipoEndereco,
          cep: address.cep,
          cidade: address.cidade,
          bairro: address.bairro,
          rua: address.rua,
          numero: address.numero,
          complemento: address.complemento,
          latitude: address.latitude,
          longitude: address.longitude,
        }
      : {
          tipoEndereco: address.tipoEndereco,
          nomeLocal: address.nomeLocal,
          cidadeRefencia: address.cidadeRefencia,
          complemento: address.complemento,
          latitude: address.latitude,
          longitude: address.longitude,
        };
  },
};
