import {
  ServiceErrorCode,
  serviceError,
  serviceSuccess,
} from "../utils/send-response";
import { connectionPointRepository } from "../repository/connectionPoint.repository";
import { encrypt } from "../utils/encrypt-mk-password";

import { planRepository } from "../repository/plan.repository";
import { TResPontoConexao } from "../types/connectionPoint";
import { clientIntegration } from "../integration/client.integration";
import {
  TConnectionPointAddress,
  TConnectionPointCreate,
  TConnectionPointMicrotik,
  TConnectionPointPlan,
} from "../schema/connectionPoint.schema";

export const connectionPointService = {
  create: async (clientId: string, connectionPoint: TConnectionPointCreate) => {
    const built =
      await connectionPointService.buildConnectionPointData(connectionPoint);

    if (!("data" in built)) return built;

    const { ponto } = built.data;

    const createdPonto = await connectionPointRepository.create(
      clientId,
      ponto,
    );

    try {
      await clientIntegration.create({
        name: connectionPoint.microtik.loginMK,
        password: connectionPoint.microtik.senhaMK,
        profile: (await planRepository.getPlanById(
          connectionPoint.plano.planoId,
        ))!.nome,
        service: "pppoe",
      });
    } catch (error) {
      await connectionPointRepository.delete(createdPonto.id);
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao criar usuário no MikroTik.",
      );
    }

    return serviceSuccess(
      {
        message: "Ponto de Conexão adicionado.",
        ponto: {
          id: createdPonto.id,
          clienteId: createdPonto.clienteId,
          status: createdPonto.status,
          plano: {
            planoId: createdPonto.planoId,
            diaVencimento: createdPonto.diaVencimento,
            dataUltimoPagamento: createdPonto.dataUltimoPagamento,
          },
          microtik: {
            loginMk: createdPonto.loginMk,
          },
          endereco: connectionPointService.formatAddress(createdPonto),
        },
      },
      true,
    );
  },

  updatePlan: async (
    connectionPointId: string,
    data: Partial<TConnectionPointPlan>,
  ) => {
    const pontoAtual =
      await connectionPointRepository.getById(connectionPointId);

    if (!pontoAtual)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Ponto de Conexão não encontrado.",
      );

    const { planoId, diaVencimento } = data;

    if (!planoId && !diaVencimento)
      return serviceError(
        ServiceErrorCode.BAD_REQUEST,
        "Dados não foram enviados ou estão vazios.",
      );

    let planoNome: string | undefined;
    if (planoId) {
      const plano = await planRepository.getPlanById(planoId);
      if (!plano)
        return serviceError(
          ServiceErrorCode.NOT_FOUND,
          "Plano não encontrado.",
        );
      planoNome = plano.nome;
    }

    const updatedPonto = await connectionPointRepository.updatePlan(
      connectionPointId,
      { planoId, diaVencimento },
    );

    if (planoNome) {
      try {
        console.log(planoNome);
        console.log(pontoAtual.loginMk);
        await clientIntegration.update(pontoAtual.loginMk, {
          profile: planoNome,
        });
      } catch (error) {
        await connectionPointRepository.updatePlan(connectionPointId, {
          planoId: pontoAtual.planoId,
          diaVencimento: pontoAtual.diaVencimento,
        });
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Erro ao atualizar no MikroTik.",
        );
      }
    }

    return serviceSuccess({
      message: "Ponto de Conexão atualizado.",
      ponto: {
        id: updatedPonto.id,
        plano: {
          planoId: updatedPonto.planoId,
          diaVencimento: updatedPonto.diaVencimento,
        },
      },
    });
  },

  updateMicrotik: async (
    connectionPointId: string,
    data: Partial<TConnectionPointMicrotik>,
  ) => {
    const pontoAtual =
      await connectionPointRepository.getById(connectionPointId);

    if (!pontoAtual)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Ponto de Conexão não encontrado.",
      );

    const { loginMK, senhaMK } = data;

    if (!loginMK && !senhaMK)
      return serviceError(
        ServiceErrorCode.BAD_REQUEST,
        "Dados não foram enviados ou estão vazios.",
      );

    if (loginMK) {
      const pointExists = await connectionPointRepository.getByLoginMk(loginMK);
      if (pointExists && pointExists.id !== connectionPointId)
        return serviceError(
          ServiceErrorCode.CONFLICT,
          "Este login MikroTik já está em uso.",
        );
    }

    const senhaMKPlain = senhaMK;
    const encryptedSenha = senhaMK ? encrypt(senhaMK) : undefined;

    const updatedPonto = await connectionPointRepository.updateMicrotik(
      connectionPointId,
      {
        ...(loginMK && { loginMK }),
        ...(encryptedSenha && { senhaMK: encryptedSenha }),
      },
    );

    try {
      await clientIntegration.update(pontoAtual.loginMk, {
        ...(loginMK && { name: loginMK }),
        ...(senhaMKPlain && { password: senhaMKPlain }),
      });
    } catch (error) {
      await connectionPointRepository.updateMicrotik(connectionPointId, {
        loginMK: pontoAtual.loginMk,
        senhaMK: pontoAtual.senhaMk,
      });
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao atualizar no MikroTik.",
      );
    }

    return serviceSuccess({
      message: "Ponto de Conexão atualizado.",
      ponto: {
        id: updatedPonto.id,
        microtik: {
          loginMk: updatedPonto.loginMk,
        },
      },
    });
  },

  updateAddress: async (
    connectionPointId: string,
    data: Partial<TConnectionPointAddress>,
  ) => {
    const pontoAtual =
      await connectionPointRepository.getById(connectionPointId);

    if (!pontoAtual)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Ponto de Conexão não encontrado.",
      );

    if (!data || Object.keys(data).length === 0)
      return serviceError(
        ServiceErrorCode.BAD_REQUEST,
        "Dados não foram enviados ou estão vazios.",
      );

    const updatedPonto = await connectionPointRepository.updateAddress(
      connectionPointId,
      data,
    );

    return serviceSuccess({
      message: "Ponto de Conexão atualizado.",
      ponto: {
        id: updatedPonto.id,
        endereco: connectionPointService.formatAddress(updatedPonto),
      },
    });
  },

  buildConnectionPointData: async (connectionPoint: TConnectionPointCreate) => {
    const loginExists = await connectionPointRepository.getByLoginMk(
      connectionPoint.microtik.loginMK,
    );

    if (loginExists)
      return serviceError(
        ServiceErrorCode.CONFLICT,
        "Este login MikroTik já está em uso.",
      );

    const plano = await planRepository.getPlanById(
      connectionPoint.plano.planoId,
    );

    if (!plano)
      return serviceError(ServiceErrorCode.NOT_FOUND, "Plano não encontrado.");

    const encryptedMk = encrypt(connectionPoint.microtik.senhaMK);

    return serviceSuccess({
      ponto: {
        ...connectionPoint,
        senhaMK: encryptedMk,
      },
    });
  },

  delete: async (connectionPointId: string) => {
    const pontoAtual =
      await connectionPointRepository.getById(connectionPointId);

    if (!pontoAtual)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Ponto de Conexão não encontrado.",
      );

    try {
      await clientIntegration.delete(pontoAtual.loginMk);
    } catch (error) {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao remover usuário no MikroTik.",
      );
    }

    await connectionPointRepository.delete(connectionPointId);

    return serviceSuccess({
      message: "Ponto de Conexão removido.",
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
