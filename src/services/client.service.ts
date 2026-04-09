import bcrypt from "bcryptjs";
import { planRepository } from "./../repository/plan.repository";
import { clientRepository } from "./../repository/client.repository";
import {
  TCreateClient,
  TUpdateClientPersonalInfo,
  TUpdateCustomerCentralPassword,
} from "../schema/client.schema";
import {
  ServiceErrorCode,
  serviceError,
  serviceSuccess,
} from "../utils/send-response";
import { prisma } from "../config/prisma";
import { clientIntegration } from "../integration/client.integration";
import { TClienteStatus, TGetCliente } from "../types/client";
import { TPontoConexaoStatus } from "../types/connectionPoint";
import { connectionPointRepository } from "../repository/connectionPoint.repository";
import { encrypt } from "../utils/encrypt-mk-password";

export const clientService = {
  getAllClient: async () => {
    const clients = await clientRepository.getAllClient();

    if (clients.length === 0)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Nenhum cliente encontrado.",
      );

    const mapped: TGetCliente[] = clients.map((cliente) => ({
      id: cliente.id,
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email ?? "",
      telefone: cliente.telefone,
      status: cliente.status as TClienteStatus,
      pontos: cliente.pontosConexao.map((ponto) => ({
        id: ponto.id,
        status: ponto.status as TPontoConexaoStatus,
        diaVencimento: ponto.diaVencimento,
        diaUltimoPagamento: ponto.dataUltimoPagamento?.toISOString() ?? "",
        loginMK: ponto.loginMk,
        plano: {
          id: ponto.plano.id,
          nome: ponto.plano.nome,
          uploadMB: ponto.plano.uploadMB,
          downloadMB: ponto.plano.downloadMB,
          valor: Number(ponto.plano.valor),
          descricao: ponto.plano.descricao ?? undefined,
        },
        endereco:
          ponto.tipoEndereco === "URBANO"
            ? {
                tipoEndereco: "URBANO" as const,
                cep: ponto.cep ?? "",
                cidade: ponto.cidade ?? "",
                bairro: ponto.bairro ?? "",
                rua: ponto.rua ?? "",
                numero: Number(ponto.numero),
                complemento: ponto.complemento ?? undefined,
                latitude: ponto.latitude ?? undefined,
                longitude: ponto.longitude ?? undefined,
              }
            : {
                tipoEndereco: "RURAL" as const,
                nomeLocal: ponto.nomeLocal ?? "",
                cidadeReferencia: ponto.cidadeRefencia ?? "",
                complemento: ponto.complemento ?? undefined,
                latitude: ponto.latitude ?? undefined,
                longitude: ponto.longitude ?? undefined,
              },
      })),
    }));

    return serviceSuccess(mapped);
  },

  getById: async (id: string) => {
    const client = await clientRepository.getClientById(id);

    if (!client)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Cliente não encontrado encontrado.",
      );

    const mapped: TGetCliente = {
      id: client.id,
      nome: client.nome,
      cpf: client.cpf,
      email: client.email ?? "",
      telefone: client.telefone,
      status: client.status as TClienteStatus,
      pontos: client.pontosConexao.map((ponto) => ({
        id: ponto.id,
        status: ponto.status as TPontoConexaoStatus,
        diaVencimento: ponto.diaVencimento,
        diaUltimoPagamento: ponto.dataUltimoPagamento?.toISOString() ?? "",
        loginMK: ponto.loginMk,
        plano: {
          id: ponto.plano.id,
          nome: ponto.plano.nome,
          uploadMB: ponto.plano.uploadMB,
          downloadMB: ponto.plano.downloadMB,
          valor: Number(ponto.plano.valor),
          descricao: ponto.plano.descricao ?? undefined,
        },
        endereco:
          ponto.tipoEndereco === "URBANO"
            ? {
                tipoEndereco: "URBANO" as const,
                cep: ponto.cep ?? "",
                cidade: ponto.cidade ?? "",
                bairro: ponto.bairro ?? "",
                rua: ponto.rua ?? "",
                numero: Number(ponto.numero),
                complemento: ponto.complemento ?? undefined,
                latitude: ponto.latitude ?? undefined,
                longitude: ponto.longitude ?? undefined,
              }
            : {
                tipoEndereco: "RURAL" as const,
                nomeLocal: ponto.nomeLocal ?? "",
                cidadeReferencia: ponto.cidadeRefencia ?? "",
                complemento: ponto.complemento ?? undefined,
                latitude: ponto.latitude ?? undefined,
                longitude: ponto.longitude ?? undefined,
              },
      })),
    };

    return serviceSuccess(mapped);
  },

  createClient: async (clientData: TCreateClient) => {
    const clientExists = await clientRepository.getClientByCpf(clientData.cpf);
    if (clientExists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este cliente já existe.");

    const loginExists = await connectionPointRepository.getByLoginMk(
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

    let createdClient;
    const hashed = await bcrypt.hash(clientData.senhaCentralCliente, 10);
    const encryptedMk = encrypt(clientData.ponto.senhaMK);

    try {
      createdClient = await prisma.$transaction(async (tx) => {
        const cliente = await tx.cliente.create({
          data: {
            cpf: clientData.cpf,
            nome: clientData.nome,
            email: clientData.email,
            telefone: clientData.telefone,
            senhaCentralCliente: hashed,
          },
        });

        const endereco = clientData.ponto.endereco;

        const ponto = await tx.pontoConexao.create({
          data: {
            clienteId: cliente.id,
            planoId: clientData.ponto.planoId,
            loginMk: clientData.ponto.loginMK,
            senhaMk: encryptedMk,
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
        .deleteClientById(createdClient.cliente.id)
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

    return serviceSuccess(
      {
        message: "Cliente cadastrado.",
        cliente: createdClient,
      },
      true,
    );
  },

  updatePersonalInfo: async (id: string, data: TUpdateClientPersonalInfo) => {
    if (Object.keys(data).length === 0)
      return serviceError(
        ServiceErrorCode.UNPROCESSABLE,
        "Nenhum campo para atualizar.",
      );

    const exists = await clientRepository.getClientById(id);

    if (!exists)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Cliente não encontrado.",
      );

    const updated = await clientRepository.updatePersonalInfo(id, data);

    return serviceSuccess({
      message: "Cliente atualizado.",
      cliente: updated,
    });
  },

  updateCustomerCentralPassword: async (
    id: string,
    data: TUpdateCustomerCentralPassword,
  ) => {
    if (Object.keys(data).length === 0)
      return serviceError(
        ServiceErrorCode.UNPROCESSABLE,
        "Nenhum campo para atualizar.",
      );

    const exists = await clientRepository.getClientById(id);

    if (!exists)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Cliente não encontrado.",
      );

    const hashed = await bcrypt.hash(data.senhaCentralCliente, 10);

    await clientRepository.updateCustomerCentralPassword(id, hashed);

    return serviceSuccess({ message: "Senha alterada com sucesso." });
  },
};
