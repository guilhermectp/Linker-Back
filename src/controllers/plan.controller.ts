import { Request, Response } from "express";
import { planService } from "../services/plan.service";
import { TCreatePlanInput, TUpdatePlanInput } from "../schema/plan.schema";

export const planController = {
  async createPlan(req: Request, res: Response) {
    try {
      const planData = req.body as TCreatePlanInput;

      const { data, error } = await planService.createPlan(planData);

      if (error) {
        return res.status(400).json(error);
      }

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json("Ocorreu um erro inesperado no servidor.");
    }
  },

  async getAllPlan(req: Request, res: Response) {
    try {
      const plans = await planService.getAllPlan();

      if (!plans || plans.length === 0) {
        return res.status(404).json("Nenhum plano encontrado.");
      }

      return res.status(200).json(plans);
    } catch (error) {
      return res.status(500).json("Ocorreu um erro inesperado no servidor.");
    }
  },

  async updatePlan(req: Request, res: Response) {
    try {
      const planData = req.body as TUpdatePlanInput;
      console.log(planData);
      const { data, error } = await planService.updatePlan(planData);

      if (error) {
        return res.status(400).json(error);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json("Ocorreu um erro inesperado no servidor.");
    }
  },

  async deletePlan(req: Request, res: Response) {
    try {
      const { nome } = req.params;

      await planService.deletePlan(nome as string);

      return res.status(200).json("Plano deletado com sucesso!");
    } catch (error) {
      return res.status(500).json("Ocorreu um erro inesperado no servidor.");
    }
  },
};
