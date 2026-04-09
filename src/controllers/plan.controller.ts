import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { planService } from "../services/plan.service";
import { sendResponse } from "../utils/send-response";

export const planController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await planService.getAll());
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await planService.create(req.body));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.nome as string;
    sendResponse(res, await planService.update(name, req.body));
  }),

  deletePlan: asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.nome as string;
    sendResponse(res, await planService.delete(name));
  }),
};
