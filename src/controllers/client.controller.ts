import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { clientService } from "../services/client.service";
import { sendResponse } from "../utils/send-response";

export const clientController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await clientService.getAll());
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
