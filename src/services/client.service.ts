import { planRepository } from "./../repository/plan.repository";
import { clientRepository } from "./../repository/client.repository";
import {
  TCreateClient,
  TUpdateClientConnectionPointAddress,
  TUpdateClientConnectionPointPlan,
  TUpdateClientPersonalInfo,
} from "../schema/client.schema";
import {
  ServiceErrorCode,
  serviceError,
  serviceSuccess,
} from "../utils/service-response";
import { prisma } from "../config/prisma";
import { clientIntegration } from "../integration/client.integration";

export const clientService = {
  getAllClient: async () => {
    const clients = await clientRepository.getAllClient();

    if (clients.length === 0)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Nenhum cliente encontrado.",
      );

    return serviceSuccess(clients);
  },

  createClient: async (clientData: TCreateClient) => {
    const clientExists = await clientRepository.getClientByCpf(clientData.cpf);
    if (clientExists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este cliente já existe.");

    const loginExists = await clientRepository.getByLoginMk(
      clientData.ponto.loginMK,
    );

    if (loginExists)
      return serviceError(
        ServiceErrorCode.CONFLICT,
        "Este login MikroTik já está em uso.",
      );

    const plano = await planRepository.getPlanById(clientData.ponto.planoId);
    if (!plano)
      return serviceError(ServiceErrorCode.NOT_FOUND, "Plano não encontrado.");

    let createdData;
    try {
      createdData = await prisma.$transaction(async (tx) => {
        const cliente = await tx.cliente.create({
          data: {
            cpf: clientData.cpf,
            nome: clientData.nome,
            email: clientData.email,
            telefone: clientData.telefone,
            senhaCentralCliente: clientData.senhaCentralCliente,
          },
        });

        const endereco = clientData.ponto.endereco;

        const ponto = await tx.pontoConexao.create({
          data: {
            clienteId: cliente.id,
            planoId: clientData.ponto.planoId,
            loginMk: clientData.ponto.loginMK,
            senhaMk: clientData.ponto.senhaMK,
            diaVencimento: clientData.ponto.diaVencimento,
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

        return { cliente, ponto };
      });
    } catch (error) {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao salvar no banco de dados.",
      );
    }

    try {
      await clientIntegration.createUser({
        name: clientData.ponto.loginMK,
        password: clientData.ponto.senhaMK,
        profile: plano.nome,
        service: "pppoe",
      });
    } catch (error) {
      await clientRepository
        .deleteClientById(createdData.cliente.id)
        .catch(() => null);

      if (error instanceof Error && error.message.includes("timeout"))
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Servidor MikroTik não respondeu.",
        );

      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao criar usuário no MikroTik.",
      );
    }

    return serviceSuccess({ message: "Cliente cadastrado com sucesso." }, true);
  },

  updatePersonalInfo: async (id: string, data: TUpdateClientPersonalInfo) => {
    const exists = await clientRepository.getClientById(id);

    if (!exists)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Cliente não encontrado.",
      );

    const updated = await clientRepository.updatePersonalInfo(id, data);
    return serviceSuccess(updated);
  },

  updateConnectionPoint: async (
    clientId: string,
    connectionPointId: string,
    data: TUpdateClientConnectionPointPlan,
  ) => {
    const exists = await clientRepository.getClientById(clientId);

    if (!exists)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Cliente não encontrado.",
      );

    const updated = await clientRepository.updateConnectionPoint(
      connectionPointId,
      data,
    );
    return serviceSuccess(updated);
  },
};
