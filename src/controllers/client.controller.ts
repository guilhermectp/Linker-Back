import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { clientService } from "../services/client.service";

export const clientController = {
  getAllClient: asyncHandler(async (req: Request, res: Response) => {
    const result = await clientService.getAllClient();

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { idCliente } = req.params;

    const result = await clientService.getById(idCliente as string);

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  createClient: asyncHandler(async (req: Request, res: Response) => {
    const result = await clientService.createClient(req.body);

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  updatePersonalInfo: asyncHandler(async (req: Request, res: Response) => {
    const { idCliente } = req.params;

    const result = await clientService.updatePersonalInfo(
      idCliente as string,
      req.body,
    );

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  updateCustomerCentralPassword: asyncHandler(
    async (req: Request, res: Response) => {
      const { idCliente } = req.params;

      const result = await clientService.updateCustomerCentralPassword(
        idCliente as string,
        req.body,
      );

      if (!result.success)
        return res.status(result.statusCode).json(result.error);

      return res.status(result.statusCode).json(result.data);
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
