import { asyncHandler } from "./../utils/async-handler";
import { Request, Response } from "express";
import { planService } from "../services/plan.service";
import { mapHttpStatus } from "../utils/service-response";

export const planController = {
  getAllPlan: asyncHandler(async (req: Request, res: Response) => {
    const result = await planService.getAllPlan();
    return res
      .status(mapHttpStatus(result.type))
      .json(result.data || result.error);
  }),

  createPlan: asyncHandler(async (req: Request, res: Response) => {
    const result = await planService.createPlan(req.body);
    return res
      .status(mapHttpStatus(result.type))
      .json(result.data || result.error);
  }),

  updatePlan: asyncHandler(async (req: Request, res: Response) => {
    const { nome } = req.params;
    const result = await planService.updatePlan(nome as string, req.body);
    return res
      .status(mapHttpStatus(result.type))
      .json(result.data || result.error);
  }),

  deletePlan: asyncHandler(async (req: Request, res: Response) => {
    const { nome } = req.params;
    const result = await planService.deletePlan(nome as string);
    return res
      .status(mapHttpStatus(result.type))
      .json(result.data || result.error);
  }),
};
