import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { clientService } from "../services/client.service";
import { sendResponse } from "../utils/send-response";
import { TClienteFilters } from "../types/client";
import { ClienteStatus } from "@prisma/client";
import { TTipoEndereco } from "../types/connectionPoint";

export const clientController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await clientService.getAll());
  }),

  getPaginated: asyncHandler(async (req: Request, res: Response) => {
    const { pagina, itemsPorPagina, busca, situacao, tipoEndereco } = req.query;

    const filters: TClienteFilters = {
      pagina: pagina ? Number(pagina) : undefined,
      itemsPorPagina: itemsPorPagina ? Number(itemsPorPagina) : undefined,
      busca: busca ? String(busca) : undefined,
      situacao: situacao ? (String(situacao) as ClienteStatus) : undefined,
      tipoEndereco: tipoEndereco
        ? (String(tipoEndereco) as TTipoEndereco)
        : undefined,
    };

    sendResponse(res, await clientService.getPaginated(filters));
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const clientId = req.params.idCliente as string;
    sendResponse(res, await clientService.getById(clientId));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await clientService.create(req.body));
  }),

  updatePersonalInfo: asyncHandler(async (req: Request, res: Response) => {
    const clientId = req.params.idCliente as string;

    sendResponse(
      res,
      await clientService.updatePersonalInfo(clientId, req.body),
    );
  }),

  updateCustomerCentralPassword: asyncHandler(
    async (req: Request, res: Response) => {
      const clientId = req.params.idCliente as string;

      sendResponse(
        res,
        await clientService.updateCustomerCentralPassword(clientId, req.body),
      );
    },
  ),
};
