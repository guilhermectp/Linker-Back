import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { clientService } from "../services/client.service";
import { sendResponse } from "../utils/send-response";

export const clientController = {
  getAllClient: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await clientService.getAllClient());
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const clientId = req.params.idCliente as string;
    sendResponse(res, await clientService.getById(clientId));
  }),

  createClient: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await clientService.createClient(req.body));
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

  // updateConnectionPoint: asyncHandler(async (req: Request, res: Response) => {
  //   const { idCliente, idPontoConexao } = req.params;
  //   const result = await clientService.updateConnectionPoint(
  //     idCliente as string,
  //     idPontoConexao as string,
  //     req.body,
  //   );

  //   if (!result.success)
  //     return res.status(result.statusCode).json(result.error);

  //   return res.status(result.statusCode).json(result.data);
  // }),
};
