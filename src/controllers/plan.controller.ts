import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { planService } from "../services/plan.service";
import { sendResponse } from "../utils/send-response";

export const planController = {
  getAllPlan: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await planService.getAllPlan());
  }),

  createPlan: asyncHandler(async (req: Request, res: Response) => {
    sendResponse(res, await planService.createPlan(req.body));
  }),

  updatePlan: asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.nome as string;
    sendResponse(res, await planService.updatePlan(name, req.body));
  }),

  deletePlan: asyncHandler(async (req: Request, res: Response) => {
    const name = req.params.nome as string;
    sendResponse(res, await planService.deletePlan(name));
  }),
};
