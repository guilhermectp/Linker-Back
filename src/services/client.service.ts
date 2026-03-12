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
    const exists = await clientRepository.getClientByCpf(clientData.cpf);

    if (exists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este cliente já existe.");

    const data = await clientRepository.createClient(clientData);
    return serviceSuccess(data, true); // 201
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
