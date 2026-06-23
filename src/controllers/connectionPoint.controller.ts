import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { sendResponse } from "../utils/send-response";
import { connectionPointService } from "../services/connectionPoint.service";

export const connectionPointController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const idCliente = req.params.idCliente as string;

    sendResponse(res, await connectionPointService.create(idCliente, req.body));
  }),

  updatePlan: asyncHandler(async (req: Request, res: Response) => {
    const idPontoConexao = req.params.idPontoConexao as string;
    sendResponse(
      res,
      await connectionPointService.updatePlan(idPontoConexao, req.body),
    );
  }),

  updateMicrotik: asyncHandler(async (req: Request, res: Response) => {
    const idPontoConexao = req.params.idPontoConexao as string;
    sendResponse(
      res,
      await connectionPointService.updateMicrotik(idPontoConexao, req.body),
    );
  }),

  updateAddress: asyncHandler(async (req: Request, res: Response) => {
    const idPontoConexao = req.params.idPontoConexao as string;
    sendResponse(
      res,
      await connectionPointService.updateAddress(idPontoConexao, req.body),
    );
  }),
};
