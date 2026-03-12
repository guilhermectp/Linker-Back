import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { planService } from "../services/plan.service";

export const planController = {
  getAllPlan: asyncHandler(async (req: Request, res: Response) => {
    const result = await planService.getAllPlan();

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  createPlan: asyncHandler(async (req: Request, res: Response) => {
    const result = await planService.createPlan(req.body);

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  updatePlan: asyncHandler(async (req: Request, res: Response) => {
    const { nome } = req.params;
    const result = await planService.updatePlan(nome as string, req.body);

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),

  deletePlan: asyncHandler(async (req: Request, res: Response) => {
    const { nome } = req.params;
    const result = await planService.deletePlan(nome as string);

    if (!result.success)
      return res.status(result.statusCode).json(result.error);

    return res.status(result.statusCode).json(result.data);
  }),
};
